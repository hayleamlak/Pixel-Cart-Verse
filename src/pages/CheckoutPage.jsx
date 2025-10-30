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

  const showAlert = (message) => {
    const alertDiv = document.createElement("div");
    alertDiv.className = "checkout-alert";
    alertDiv.innerText = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // normalize cart items to include `product` (mongo id) required by server
      const orderItemsForServer = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty || 1,
        image: item.image || item.img || "",
        price: item.price,
        product: item._id || item.id || item.product || item.productId, // ensure product id exists
      }));

      // sanity check: fail early if any product id is missing
      const missing = orderItemsForServer.find((it) => !it.product);
      if (missing) throw new Error("One or more cart items are missing a product id");

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          orderItems: orderItemsForServer,
          shippingAddress: shipping,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice: grandTotal,
        }),
      });

      const data = await res.json().catch(async () => {
        // if response isn't JSON, capture text for better error info
        const txt = await res.text();
        return { error: txt };
      });

      if (!res.ok) {
        throw new Error(data.message || data.error || "Order creation failed");
      }

      // clear cart if available
      if (typeof clearCart === "function") clearCart();

      // initiate payment for online providers
      if (paymentMethod === "Chapa" || paymentMethod === "Telebirr") {
        const provider = paymentMethod.toLowerCase(); // "chapa" or "telebirr"
        const paymentRes = await fetch(
          `http://localhost:5000/api/payment/${provider}/${data._id}`, // match server: /api/payment/...
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        const contentType = paymentRes.headers.get("content-type") || "";
        const paymentData = contentType.includes("application/json")
          ? await paymentRes.json().catch(() => ({ error: "Invalid JSON from payment endpoint" }))
          : { error: await paymentRes.text() };

        if (!paymentRes.ok) {
          throw new Error(paymentData.message || paymentData.error || "Payment initiation failed");
        }

        if (paymentData.checkoutUrl) {
          window.location.href = paymentData.checkoutUrl;
        } else {
          throw new Error("No checkout URL returned from payment provider");
        }
      } else {
        // fallback (e.g., Cash on Delivery) - navigate to order page
        navigate(`/order/${data._id}`);
      }
    } catch (err) {
      showAlert(`Checkout failed: ${err.message || err}`);
    }
  };

  const itemsPrice = cartItems.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
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
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
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
