import React, { createContext, useState, useEffect, useContext } from "react";

// ✅ Create CartContext
export const CartContext = createContext();

// ✅ Provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add or update item in cart
  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item._id === product._id);
      if (exist) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, qty: Math.max(1, item.qty + qty) }
            : item
        );
      } else {
        return [...prev, { ...product, qty }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// ✅ Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
