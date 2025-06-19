import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    try {
      const tokens = localStorage.getItem("authTokens");
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const tokens = localStorage.getItem("authTokens");
      return tokens ? jwtDecode(JSON.parse(tokens).access) : null;
    } catch {
      return null;
    }
  });

  // Optional: Refresh user on token update
  useEffect(() => {
    if (authTokens) {
      try {
        const decoded = jwtDecode(authTokens.access);
        setUser(decoded);
      } catch {
        logoutUser(); // Invalid token fallback
      }
    }
  }, [authTokens]);

  const loginUser = useCallback(async (username, password) => {
    try {
      const response = await fetch("http://localhost:8000/api/accounts/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        return true;
      } else {
        alert("Login failed: Invalid credentials");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while trying to log in.");
      return false;
    }
  }, []);

  const logoutUser = useCallback(() => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
  }, []);

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
