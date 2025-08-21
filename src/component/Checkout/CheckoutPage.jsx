import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../lib/api.ts";
import { Button } from "../Button/Button";
import "./CartCheckoutPage.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Load Stripe with publishable key from env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

/**
 * CheckoutPage: Single course payment with Stripe
 * - On mount, POST /api/checkout?courseId=... to get { clientSecret, paymentId, piId }
 * - Renders CardElement, confirms payment with stripe.confirmCardPayment(clientSecret)
 * - After success, polls /api/enrollments/me for visibility
 * - Server is source of truth; client only caches UI state
 */
function CheckoutForm({ courseId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    api(`/api/checkout?courseId=${courseId}`, { method: "POST" })
      .then(data => {
        setClientSecret(data.clientSecret);
        setStatus("");
        setError("");
      })
      .catch(e => setError(e.message || "Failed to start checkout"));
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");
    setStatus("");
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });
    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
    } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      setStatus("Payment successful!");
      setProcessing(false);
      // Optionally poll /api/enrollments/me here
    } else {
      setError("Payment failed or incomplete.");
      setProcessing(false);
    }
  };

  if (!clientSecret) return <div className="cart-checkout-form">Loading checkout...</div>;

  return (
    <form onSubmit={handleSubmit} className="cart-checkout-form">
      <label className="cart-checkout-label" htmlFor="card-element">Card Information</label>
      <div className="StripeElement">
        <CardElement id="card-element" options={{ style: { base: { fontSize: '1.1rem', fontFamily: 'Inter, Roboto, sans-serif', color: '#374151' } } }} />
      </div>
      {error && <div className="cart-checkout-error">{error}</div>}
      {status && <div className="cart-checkout-status">{status}</div>}
      <Button className="cart-checkout-button" color="primary" size="large" type="submit" disabled={processing || !stripe}>
        {processing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
}

export const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const [enrollment, setEnrollment] = useState(null);
  useEffect(() => {
    if (courseId) {
      api("/api/enrollments/me").then(data => {
        const found = Array.isArray(data) ? data.find(e => String(e.courseId) === String(courseId)) : null;
        setEnrollment(found || null);
      });
    }
  }, [courseId]);
  if (!courseId) return <div className="checkout-error">No course selected for checkout.</div>;
  // Only show message if enrolled and status is 'active' (case-insensitive)
  const status = (enrollment?.status || '').toLowerCase();
  const isActive = status === "active";
  return (
    <section className="cart-checkout-page">
      <h2 className="cart-checkout-title">Checkout</h2>
      {enrollment && isActive ? (
        <div className="cart-checkout-status">You are already enrolled in this course.</div>
      ) : null}
      <Elements stripe={stripePromise}>
        <CheckoutForm courseId={courseId} />
      </Elements>
    </section>
  );
};
