import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const Paymentsuccess = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tx_ref = params.get("tx_ref");

    if (!tx_ref) {
      setError("No transaction reference found.");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/payment/chapa/verify/${tx_ref}`
        );
        const data = await response.json();

        if (data && data.data) {
          setPaymentData(data.data);
        } else {
          setError("Payment verification failed.");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while verifying payment.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search]);

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "100px" }}>⏳ Verifying payment...</h2>;
  if (error) return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>❌ {error}</h2>
      <Link to="/" style={{ marginTop: "20px", display: "inline-block" }}>Go Back Home</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: "600px", margin: "100px auto", padding: "20px", fontFamily: "Poppins, sans-serif" }}>
      <h1 style={{ color: "#28a745", fontSize: "2rem" }}>✅ Payment Successful!</h1>
      <p>Thank you for your payment. Your transaction has been verified.</p>

      <div style={{ backgroundColor: "#f9f9f9", borderRadius: "10px", padding: "20px", marginTop: "30px" }}>
        <h3 style={{ textAlign: "center" }}>💳 Payment Receipt</h3>
        <p><strong>Transaction Reference:</strong> {paymentData.tx_ref}</p>
        <p><strong>Amount:</strong> {paymentData.amount} {paymentData.currency}</p>
        <p><strong>Status:</strong> <span style={{ color: "green", fontWeight: "bold" }}>{paymentData.status}</span></p>
        <p><strong>Email:</strong> {paymentData.email}</p>
        <p><strong>Full Name:</strong> {paymentData.first_name} {paymentData.last_name}</p>
        <p><strong>Date:</strong> {new Date(paymentData.created_at).toLocaleString()}</p>
      </div>

      <Link to="/" style={{ marginTop: "30px", display: "inline-block", backgroundColor: "#007bff", color: "#fff", padding: "10px 20px", borderRadius: "5px", textDecoration: "none" }}>
        🏠 Back to Home
      </Link>
    </div>
  );
};

export default Paymentsuccess;
