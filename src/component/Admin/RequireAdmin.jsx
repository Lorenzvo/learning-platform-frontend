import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuthHook";

// Checks for 'admin' role in JWT claims
export const RequireAdmin = ({ children }) => {
  const { user } = useAuth();
  if (!user || !user.roles || !user.roles.some(r => r.toLowerCase() === "admin")) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
