import React, { useState } from "react";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import "../styles/CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemsPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 5;
    const totalPrice = itemsPrice + shippingPrice;

    const orderData = {
      orderItems: cartItems.map((item) => ({
        name: item.title,
        qty: item.quantity,
        price: item.price,
        product: item._id,
      })),
      shippingAddress: shipping,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        navigate(`/order/${data._id}`);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Order failed", err);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <input
          name="address"
          placeholder="Address"
          value={shipping.address}
          onChange={handleChange}
          required
        />
        <input
          name="city"
          placeholder="City"
          value={shipping.city}
          onChange={handleChange}
          required
        />
        <input
          name="postalCode"
          placeholder="Postal Code"
          value={shipping.postalCode}
          onChange={handleChange}
          required
        />
        <input
          name="country"
          placeholder="Country"
          value={shipping.country}
          onChange={handleChange}
          required
        />
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="PayPal">PayPal</option>
          <option value="Stripe">Stripe</option>
          <option value="Cash">Cash on Delivery</option>
        </select>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default CheckoutPage;
