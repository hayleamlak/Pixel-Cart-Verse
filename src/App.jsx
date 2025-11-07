import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChapaPayment from "./components/payment/ChapaPayment";
import TelebirrPayment from "./components/payment/TelebirrPayment";
import PaymentSuccess from "./pages/paymentsuccess";

function AppContent() {
  const location = useLocation();
  const showFooter = location.pathname === "/"; // ✅ show footer only on home page

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/payment/chapa/:orderId" element={<ChapaPayment />} />
        <Route path="/payment/telebirr/:orderId" element={<TelebirrPayment />} />
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />
      </Routes>
      {showFooter && <Footer />} {/* ✅ Footer only on home */}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
