import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const TelebirrPayment = () => {
  const { orderId } = useParams();

  useEffect(() => {
    const initPayment = async () => {
      // Call your backend to get Telebirr payment request
      const res = await fetch(`http://localhost:5000/api/payment/telebirr/${orderId}`);
      const data = await res.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl; // Redirect to Telebirr payment page
      }
    };

    initPayment();
  }, [orderId]);

  return <div>Redirecting to Telebirr payment...</div>;
};

export default TelebirrPayment;
