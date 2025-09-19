import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useCart } from "../context/cartContext";
import { 
  FaHome, FaStore, FaShoppingCart, FaUser, FaSignInAlt, 
  FaUserPlus, FaSignOutAlt, FaBars 
} from "react-icons/fa";
import { useState } from "react";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";

function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Sum total qty in cart
  const totalCartItems = cartItems?.reduce((acc, item) => acc + (item.qty || 1), 0) || 0;

  // Close menu after link click (mobile)
  const handleLinkClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      <div className={`nav-center ${menuOpen ? "active" : ""}`}>
        <button className="nav-link" onClick={() => handleLinkClick("/")}>
          <FaHome /> Home
        </button>

        <button className="nav-link" onClick={() => handleLinkClick("/shop")}>
          <FaStore /> Shop
        </button>

        <button className="nav-link" onClick={() => handleLinkClick("/cart")}>
          <FaShoppingCart /> Cart ({totalCartItems})
        </button>

        {user ? (
          <>
            <span className="nav-user"><FaUser /> {user.name}</span>
            <button className="nav-link" onClick={() => handleLinkClick("/profile")}>
              <FaUser /> Profile
            </button>
            <button className="nav-btn" onClick={() => { logout(); setMenuOpen(false); }}>
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <>
            <button className="nav-btn" onClick={() => handleLinkClick("/register")}>
              <FaUserPlus /> Register
            </button>
            <button className="nav-btn" onClick={() => handleLinkClick("/login")}>
              <FaSignInAlt /> Login
            </button>
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
