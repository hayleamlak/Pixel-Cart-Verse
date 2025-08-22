// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaSignOutAlt } from "react-icons/fa";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const updatedUser = await updateProfile({ name, email, password });
      setPassword("");
      setMessage("Profile updated successfully!");
      console.log("Updated user:", updatedUser);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/"); // redirect to Home
  };

  return (
    <div className="profile-container">
      <h1><FaUser /> My Profile</h1>

      {message && <p className="message">{message}</p>}

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="New Password (leave blank to keep current)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="update-btn" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}

export default ProfilePage;
