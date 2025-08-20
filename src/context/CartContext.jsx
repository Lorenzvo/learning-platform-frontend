import React, { useEffect, useState, useCallback } from "react";
import { api, post, del } from "../lib/api.ts";
import { CartContext } from "./CartContext";

/**
 * CartProvider provides a server-source-of-truth for cart items.
 * All cart operations (add, remove, refresh) interact with the backend.
 * Client cache is only used for UI state; backend is always authoritative.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hydrate cart from server on load
  const refresh = useCallback(() => {
    setLoading(true);
    api("/api/cart")
      .then(data => {
        console.log("Cart API response:", data);
        setItems(Array.isArray(data) ? data : []);
        setError(null);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to load cart");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Add a course to cart, then refresh
  const add = async (courseId) => {
    await post("/api/cart/add?courseId=" + courseId);
    refresh();
  };

  // Remove a course from cart, then refresh
  const remove = async (courseId) => {
    await del("/api/cart/remove?courseId=" + courseId);
    refresh();
  };

  return (
    <CartContext.Provider value={{ items, add, remove, refresh, loading, error }}>
      {children}
    </CartContext.Provider>
  );
}
