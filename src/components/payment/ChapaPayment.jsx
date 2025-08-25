import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ChapaPayment = ({ token }) => {
  const { orderId } = useParams(); // ✅ grab from route
  const [error, setError] = useState("");

  useEffect(() => {
    const initPayment = async () => {
      try {
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/payment/chapa/${orderId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Payment failed");
        }

        if (data.checkoutUrl) {
          // ✅ Auto redirect to Chapa
          window.location.href = data.checkoutUrl;
        } else {
          throw new Error("No checkout URL returned");
        }
      } catch (err) {
        console.error("Payment Error:", err.message);
        setError(err.message);
      }
    };

    initPayment();
  }, [orderId, token]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Redirecting to Chapa...</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};

export default ChapaPayment;
