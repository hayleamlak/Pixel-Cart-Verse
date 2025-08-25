// src/context/authContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ fixed import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // --- Email/Password Login ---
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      setUser(data);
      return data;
    } catch (err) {
      throw new Error(err.message || "Login failed");
    }
  };

  // --- Email/Password Signup ---
  const signup = async (name, email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      setUser(data);
      return data;
    } catch (err) {
      throw new Error(err.message || "Signup failed");
    }
  };

  // --- Google Login ---
  const googleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential); // ✅ fixed usage
      const { name, email, sub: googleId } = decoded;

      const res = await fetch("http://localhost:5000/api/users/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, googleId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");
      setUser(data);
      return data;
    } catch (err) {
      throw new Error(err.message || "Google login failed");
    }
  };

  // --- Logout ---
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Hook to use context ---
export const useAuth = () => useContext(AuthContext);
