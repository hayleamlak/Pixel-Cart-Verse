import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaSignOutAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";

import "../styles/profilePage.css"; 

function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [message, setMessage] = useState("");

  // Fill form with current user info
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: "" });
    }
  }, [user]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.token) return;
      setLoadingOrders(true);
      try {
        
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/myorders`, {
  headers: {
    Authorization: `Bearer ${user.token}`,
  },
});

        
        
        
        const data = await res.json();
        if (!res.ok && res.status !== 200) throw new Error(data.message || "Failed to fetch orders");
        setOrders(data);
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setMessage("");
    try {
      await updateProfile(formData);
      setFormData({ ...formData, password: "" });
      setIsEditing(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="profile-container">
      <h1><FaUser /> My Profile</h1>
      {message && <p className="message">{message}</p>}

      <div className="profile-cards">
        {/* Account Details Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h2>Account Details</h2>
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}><FaEdit /> Edit</button>
            ) : (
              <>
                <button className="save-btn" onClick={handleSave}><FaSave /> Save</button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}><FaTimes /> Cancel</button>
              </>
            )}
          </div>

          <form className="profile-form">
            <div className="input-group">
              <FaUser className="icon" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                readOnly={!isEditing}
              />
            </div>
            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                readOnly={!isEditing}
              />
            </div>
            <div className="input-group">
              <FaLock className="icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New Password"
                readOnly={!isEditing}
              />
            </div>
          </form>

          <button className="logout-btn" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
        </div>

        {/* Orders Card */}
        <div className="profile-card orders-card">
          <h2>Order History</h2>
          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.totalPrice.toLocaleString()} ETB</td>
                    <td>{order.isPaid ? "✅" : "❌"}</td>
                    <td>{order.isDelivered ? "✅" : "❌"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
