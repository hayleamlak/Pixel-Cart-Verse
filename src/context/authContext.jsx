// src/context/authContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import {jwtDecode }from "jwt-decode"; // // fixed import

const AuthContext = createContext();

// Get API URL from .env
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Persist user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // -----------------------------
  // Email/Password Login
  // -----------------------------
  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    setUser(data);
    return data;
  };

  // -----------------------------
  // Email/Password Register
  // -----------------------------
  const register = async (name, email, password) => {
    const res = await fetch(`${API_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");

    setUser(data);
    return data;
  };

  // -----------------------------
  // Google Login
  // -----------------------------
  const googleLogin = async (credentialResponse) => {
    if (!credentialResponse?.credential)
      throw new Error("Google credential not found");

    const decoded = jwtDecode(credentialResponse.credential);
    const { name, email, sub: googleId } = decoded;

    const res = await fetch(`${API_URL}/api/users/google-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, googleId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Google login failed");

    setUser(data);
    return data;
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, login, register, googleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
