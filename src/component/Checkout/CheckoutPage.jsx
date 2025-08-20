import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../lib/api.ts";
import { Button } from "../Button/Button";
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

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <CardElement className="checkout-card" />
      {error && <div className="checkout-error">{error}</div>}
      {status && <div className="checkout-status">{status}</div>}
      <Button color="primary" size="medium" type="submit" disabled={processing || !stripe}>
        {processing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
}

export const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  if (!courseId) return <div className="checkout-error">No course selected for checkout.</div>;
  return (
    <section className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>
      <Elements stripe={stripePromise}>
        <CheckoutForm courseId={courseId} />
      </Elements>
    </section>
  );
};
