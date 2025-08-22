import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../styles/AuthPages.css"; // shared CSS for both login and register

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = await login(email, password);

    // Check if the logged-in user is admin
    if (data.isAdmin) {
      navigate("/admin"); // redirect admins to admin dashboard
    } else {
      navigate(from, { replace: true }); // regular user
    }
  } catch (err) {
    setError(err.message);
  }
};

  
  
  
  
  
  
  

  return (
    <div className="auth-container login-page">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-btn">Login</button>
      </form>
      <p className="switch-page">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;
