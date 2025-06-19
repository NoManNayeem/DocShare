// src/components/PrivateRoute.js
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

/**
 * A wrapper to protect routes that require authentication.
 * Redirects to login if user is not authenticated.
 */
function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // Redirect to login and preserve the intended path for post-login redirect
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children || null;
}

export default PrivateRoute;
