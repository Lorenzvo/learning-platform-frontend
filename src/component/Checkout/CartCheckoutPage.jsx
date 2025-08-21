import React, { useEffect, useState } from "react";
import { api } from "../../lib/api.ts";
import { Button } from "../Button/Button";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

import { useCart } from "../../context/useCart";

function CartCheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { refresh } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    api("/api/checkout/cart", { method: "POST" })
      .then(data => {
        setClientSecret(data.clientSecret);
        setStatus("");
        setError("");
      })
      .catch(e => setError(e.message || "Failed to start checkout"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");
    setStatus("");
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });
    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
    } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      setStatus("Payment successful! You are now enrolled.");
      await refresh();
      setProcessing(false);
    } else {
      setError("Payment failed or incomplete.");
      setProcessing(false);
    }
  };

  if (!clientSecret) return <div>Loading checkout...</div>;

  return (
    <form onSubmit={handleSubmit} className="cart-checkout-form">
      <CardElement />
      {error && <div className="cart-checkout-error">{error}</div>}
      {status && <div className="cart-checkout-status">{status}</div>}
      <Button color="primary" size="medium" type="submit" disabled={processing || !stripe}>
        {processing ? "Processing..." : "Pay & Enroll"}
      </Button>
    </form>
  );
}

export const CartCheckoutPage = () => (
  <section className="cart-checkout-page">
    <h2>Cart Checkout</h2>
    <Elements stripe={stripePromise}>
      <CartCheckoutForm />
    </Elements>
  </section>
);
