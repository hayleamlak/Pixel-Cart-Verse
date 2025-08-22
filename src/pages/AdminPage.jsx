import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import UsersTable from "../components/admin/UsersTable";
import OrdersTable from "../components/admin/OrdersTable";
import ProductsTable from "../components/admin/ProductsTable";
import { FaUsers, FaBoxOpen, FaClipboardList, FaBars, FaTimes } from "react-icons/fa";
import "../styles/AdminPage.css";

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch functions
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();
    setUsers(data);
  };

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:5000/api/admin/orders", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();
    setOrders(data);
  };

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/admin/products", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    else if (activeTab === "orders") fetchOrders();
    else if (activeTab === "products") fetchProducts();
  }, [activeTab]);

  const handleUpdateUsers = (id, updatedUser) => {
    if (!updatedUser) setUsers(users.filter(u => u._id !== id));
    else setUsers(users.map(u => (u._id === id ? updatedUser : u)));
  };

  return (
    <div className="admin-container">
      {/* Hamburger toggle for mobile */}
      <div className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
        <FaBars />
      </div>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-close" onClick={() => setSidebarOpen(false)}>
          <FaTimes />
        </div>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => {
            setActiveTab("users");
            setSidebarOpen(false);
          }}
        >
          <FaUsers className="sidebar-icon" />
          <span className="sidebar-text">Users</span>
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => {
            setActiveTab("orders");
            setSidebarOpen(false);
          }}
        >
          <FaClipboardList className="sidebar-icon" />
          <span className="sidebar-text">Orders</span>
        </button>
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => {
            setActiveTab("products");
            setSidebarOpen(false);
          }}
        >
          <FaBoxOpen className="sidebar-icon" />
          <span className="sidebar-text">Products</span>
        </button>
      </div>

      {/* Main content */}
      <div className="admin-content">
        {activeTab === "users" && (
          <UsersTable users={users} token={user.token} onUpdateUsers={handleUpdateUsers} />
        )}
        {activeTab === "orders" && <OrdersTable orders={orders} />}
        {activeTab === "products" && <ProductsTable products={products} token={user.token} />}
      </div>
    </div>
  );
}
