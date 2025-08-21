import React from "react";
import { useCart } from "../context/cartContext";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaTrash, FaShippingFast, FaMoneyBillWave, FaPercent } from "react-icons/fa";
import "../styles/CartPage.css";

function CartPage() {
  const { cartItems, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  const getSubtotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const subtotal = getSubtotal();
  const shippingFee = subtotal * 0.05; // 5% of subtotal
  const taxRate = 0.15;
  const tax = subtotal * taxRate;
  const grandTotal = subtotal + shippingFee + tax;

  const getEstimatedDelivery = () => {
    const today = new Date();
    const min = new Date(today);
    min.setDate(today.getDate() + 2);
    const max = new Date(today);
    max.setDate(today.getDate() + 7);
    return `${min.toLocaleDateString()} - ${max.toLocaleDateString()}`;
  };

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-content">
          {/* Left: Items */}
          <div className="cart-items">
            {cartItems.map((item) => (
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

                  {/* Price with discount */}
                  {item.discount ? (
                    <p className="price">
                      <span className="original-price">
                        {item.originalPrice.toLocaleString()} ETB
                      </span>{" "}
                      <span className="discount-price">
                        {item.price.toLocaleString()} ETB
                      </span>
                    </p>
                  ) : (
                    <p className="price">{item.price.toLocaleString()} ETB</p>
                  )}

                  {/* Quantity selector */}
                  <div className="quantity-control">
                    <button onClick={() => addToCart(item, -1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => addToCart(item, 1)}>+</button>
                  </div>

                  {/* Wishlist and remove */}
                  <div className="cart-item-actions">
                    <button className="wishlist-btn">
                      <FaHeart /> Wishlist
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p className="item-subtotal">
                    <FaMoneyBillWave /> Subtotal: {(item.price * item.qty).toLocaleString()} ETB
                  </p>

                  {/* Estimated delivery */}
                  <p className="estimated-delivery">
                    <FaShippingFast /> Estimated Delivery: {getEstimatedDelivery()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <p>
              <FaMoneyBillWave /> Subtotal: {subtotal.toLocaleString()} ETB
            </p>
            <p>
              <FaShippingFast /> Shipping (5%): {shippingFee.toLocaleString()} ETB
            </p>
            <p>
              <FaPercent /> Tax (15%): {tax.toLocaleString()} ETB
            </p>
            <hr />
            <p>
              <strong>Grand Total: {grandTotal.toLocaleString()} ETB</strong>
            </p>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
