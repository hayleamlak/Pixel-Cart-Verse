// src/context/authContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async (email, password) => {
    const res = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const res = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    setUser(data);
    return data;
  };

  const logout = () => setUser(null);

  const isLoggedIn = !!user;

  // ✅ Fetch profile from backend
  const fetchProfile = async () => {
    if (!user) return;
    const res = await fetch("http://localhost:5000/api/users/profile", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
    setUser(data);
    return data;
  };

  // ✅ Update profile on backend
  const updateProfile = async (updateData) => {
    if (!user) throw new Error("Not logged in");
    const res = await fetch("http://localhost:5000/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update profile");
    setUser(data);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, login, register, logout, fetchProfile, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
