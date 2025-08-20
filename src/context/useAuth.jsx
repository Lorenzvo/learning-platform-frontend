import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", syncUser);
    // Also patch localStorage.setItem/removeItem to trigger syncUser
    const origSetItem = localStorage.setItem;
    const origRemoveItem = localStorage.removeItem;
  // eslint-disable-next-line no-unused-vars
    localStorage.setItem = function(key, _) {
      origSetItem.apply(this, arguments);
      if (key === "user") syncUser();
    };
    localStorage.removeItem = function(key) {
      origRemoveItem.apply(this, arguments);
      if (key === "user") syncUser();
    };
    return () => {
      window.removeEventListener("storage", syncUser);
      localStorage.setItem = origSetItem;
      localStorage.removeItem = origRemoveItem;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
