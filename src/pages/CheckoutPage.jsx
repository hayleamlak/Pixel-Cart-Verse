// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import { FaMoneyBillWave, FaShippingFast, FaPercent } from "react-icons/fa";
import "../styles/CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Chapa");

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      const alertDiv = document.createElement("div");
      alertDiv.className = "checkout-alert";
      alertDiv.innerText = "⚠️ You must log in first to place an order!";
      document.body.appendChild(alertDiv);

      setTimeout(() => {
        alertDiv.remove();
        navigate("/login", { state: { from: "/checkout" } });
      }, 3000);

      return;
    }

    if (!cartItems.length) {
      alert("Your cart is empty!");
      return;
    }

    const itemsPrice = cartItems.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
    const shippingPrice = itemsPrice * 0.05;
    const tax = itemsPrice * 0.15;
    const totalPrice = itemsPrice + shippingPrice + tax;

    const orderData = {
      orderItems: cartItems.map((item) => ({
        name: item.name,
        qty: item.qty || 1,
        price: item.price,
        product: item._id,
      })),
      shippingAddress: shipping,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      tax,
      totalPrice,
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        if (typeof clearCart === "function") clearCart();
        if (paymentMethod === "Chapa") navigate(`/payment/chapa/${data._id}`);
        else if (paymentMethod === "Telebirr") navigate(`/payment/telebirr/${data._id}`);
        else navigate(`/order/${data._id}`);
      } else alert(data.message || "Order failed");
    } catch (err) {
      console.error("Order failed", err);
      alert("Order failed. Check console for details.");
    }
  };

  // Prices calculation
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice * 0.05;
  const tax = itemsPrice * 0.15;
  const grandTotal = itemsPrice + shippingPrice + tax;

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-grid">
        {/* Left Column: Order Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          {cartItems.length === 0 ? <p>Your cart is empty</p> : (
            <>
              {cartItems.map((item) => (
                <div key={item._id} className="summary-item">
                  <div className="summary-left">
                    <img src={item.image} alt={item.name} className="summary-img" />
                    <span>{item.name} x {item.qty}</span>
                  </div>
                  <span className="summary-price">{(item.price * item.qty).toLocaleString()} ETB</span>
                </div>
              ))}
              <hr />
              <div className="summary-prices">
                <p><FaMoneyBillWave /> Subtotal: {itemsPrice.toLocaleString()} ETB</p>
                <p><FaShippingFast /> Shipping (5%): {shippingPrice.toLocaleString()} ETB</p>
                <p><FaPercent /> Tax (15%): {tax.toLocaleString()} ETB</p>
                <hr />
                <p className="total"><strong>Grand Total: {grandTotal.toLocaleString()} ETB</strong></p>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Shipping & Payment Form */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Shipping Information</h3>
          <input name="address" placeholder="Address" value={shipping.address} onChange={handleChange} required />
          <input name="city" placeholder="City" value={shipping.city} onChange={handleChange} required />
          <input name="postalCode" placeholder="Postal Code" value={shipping.postalCode} onChange={handleChange} required />
          <input name="country" placeholder="Country" value={shipping.country} onChange={handleChange} required />

          <h3>Payment Method</h3>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="Chapa">Chapa</option>
            <option value="Telebirr">Telebirr</option>
            <option value="Cash">Cash on Delivery</option>
          </select>

          <button type="submit" className="place-order-btn">Place Order</button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
