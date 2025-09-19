import React, { useEffect } from "react";
import "../styles/Toast.css"; // we will create this file next

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500); // toast duration 2.5s
    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className="toast">{message}</div>;
};

export default Toast;
