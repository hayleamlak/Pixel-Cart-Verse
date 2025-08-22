// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { FaHome, FaStore, FaShoppingCart, FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useState } from "react";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);






  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      <div className={`nav-center ${menuOpen ? "active" : ""}`}>
        <Link to="/" className="nav-link"><FaHome /> Home</Link>
        <Link to="/shop" className="nav-link"><FaStore /> Shop</Link>
        <Link to="/cart" className="nav-link"><FaShoppingCart /> Cart</Link>
        {user ? (
          <>
            <span className="nav-user"><FaUser /> {user.name}</span>
            <Link to="/profile" className="nav-link"><FaUser /> Profile</Link>
           
          </>
        ) : (
          <>
            <Link to="/register" className="nav-btn"><FaUserPlus /> Register</Link>
            <Link to="/login" className="nav-btn"><FaSignInAlt /> Login</Link>
          </>
        )}
      </div>

      <div className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <FaBars />
      </div>
    </nav>
  );
}

export default Navbar;
