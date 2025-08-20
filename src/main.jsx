// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext"; // <-- import wishlist provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <WishlistProvider>  {/* Wrap App with WishlistProvider */}
        <App />
      </WishlistProvider>
    </CartProvider>
  </React.StrictMode>
);
