import React, { useEffect } from "react";
import { useCart } from "../../context/useCart";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuthHook";
import "./CartPage.css";

/**
 * CartPage displays all items in the user's cart, shows totals, and provides a Checkout button.
 * Cart is always hydrated from the server; client cache is only for UI state.
 */
export const CartPage = () => {
  const { items, remove, loading, error } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // Calculate total price (assuming each item has priceCents and title)
  const totalCents = items.reduce((sum, item) => sum + (item.priceCents || 0), 0);

  if (!user) return null;

  return (
    <section className="cart-page">
      <header className="cart-page__header">
        <h2>My Cart</h2>
      </header>
      {loading && <div className="cart-loading">Loading...</div>}
      {error && !loading && <div className="cart-error">{error}</div>}
      {!loading && !error && items.length === 0 && (
        <div className="cart-empty">Your cart is empty.</div>
      )}
      {!loading && !error && items.length > 0 && (
        <div className="cart-page__grid">
          {items.map(item => (
              <article key={item.courseId} className="cart-page__card cart-page__card--row">
                {item.thumbnailUrl && (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="cart-page__image"
                    style={{ width: "150px", borderRadius: "8px", marginRight: "1rem", alignSelf: "center" }}
                  />
                )}
                <div className="cart-page__content">
                  <h3 className="cart-page__title">{item.title || `Course #${item.courseId}`}</h3>
                  <span className="cart-page__price">${(item.priceCents / 100).toFixed(2)}</span>
                  <Button color="secondary" size="small" onClick={() => remove(item.courseId)}>
                    Remove
                  </Button>
                </div>
              </article>
          ))}
        </div>
      )}
      {!loading && !error && items.length > 0 && (
        <div className="cart-page__footer">
          <span className="cart-page__total">Total: ${(totalCents / 100).toFixed(2)}</span>
          <Button color="primary" size="medium" onClick={() => navigate("/cart-checkout")}>Checkout</Button>
        </div>
      )}
    </section>
  );
};
