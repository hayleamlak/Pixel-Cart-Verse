import React, { useState } from "react";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaTrash, FaShippingFast, FaMoneyBillWave, FaPercent } from "react-icons/fa";
import "../styles/CartPage.css";

function CartPage() {
  const { cartItems, removeFromCart, addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  // Prices are already in ETB
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingFee = subtotal * 0.05;
  const tax = subtotal * 0.15;
  const grandTotal = subtotal + shippingFee + tax;

  const getEstimatedDelivery = () => {
    const today = new Date();
    const min = new Date(today);
    min.setDate(today.getDate() + 2);
    const max = new Date(today);
    max.setDate(today.getDate() + 7);
    return `${min.toLocaleDateString()} - ${max.toLocaleDateString()}`;
  };

  const handleCheckout = () => {
    if (user) {
      navigate("/checkout");
    } else {
      setShowAlert(true);
    }
  };

  if (cartItems.length === 0)
    return (
      <div className="empty-cart-container">
        <img
          src="/images/empty.gif"
          alt="Empty Cart"
          className="empty-cart-gif"
        />
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven’t added any items yet.</p>
        <button className="shop-btn" onClick={() => navigate("/shop")}>
          Go to Shop
        </button>
      </div>
    );

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => {
            const subtotalItem = (item.price * item.qty).toLocaleString();

            return (
              <div key={item._id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                  onClick={() => navigate(`/product/${item._id}`)}
                  style={{ cursor: "pointer" }}
                />
                <div className="cart-item-info">
                  <h2
                    onClick={() => navigate(`/product/${item._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {item.name}
                  </h2>
                  <p>{item.description?.slice(0, 60)}...</p>

                  <p className="price">{item.price.toLocaleString()} ETB</p>

                  <div className="quantity-control">
                    <button onClick={() => addToCart(item, -1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => addToCart(item, 1)}>+</button>
                  </div>

                  <div className="cart-item-actions">
                    <button className="wishlist-btn">
                      <FaHeart /> Wishlist
                    </button>
                    <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                      <FaTrash /> Remove
                    </button>
                  </div>

                  <p className="item-subtotal">
                    <FaMoneyBillWave /> Subtotal: {subtotalItem} ETB
                  </p>
                  <p className="estimated-delivery">
                    <FaShippingFast /> Estimated Delivery: {getEstimatedDelivery()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <p><FaMoneyBillWave /> Subtotal: {subtotal.toLocaleString()} ETB</p>
          <p><FaShippingFast /> Shipping (5%): {shippingFee.toLocaleString()} ETB</p>
          <p><FaPercent /> Tax (15%): {tax.toLocaleString()} ETB</p>
          <hr />
          <p><strong>Grand Total: {grandTotal.toLocaleString()} ETB</strong></p>
          <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
      </div>

      {/* Alert Modal */}
      {showAlert && (
        <div className="cart-alert-overlay">
          <div className="cart-alert-modal">
            <h2>⚠️ Attention</h2>
            <p>Please sign up or login first to proceed to checkout.</p>
            <div className="cart-alert-actions">
              <button
                className="cart-alert-btn primary"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
              <button
                className="cart-alert-btn secondary"
                onClick={() => setShowAlert(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
