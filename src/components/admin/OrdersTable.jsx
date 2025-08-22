import React from "react";

export default function OrdersTable({ orders }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>User</th>
          <th>Total</th>
          <th>Paid</th>
          <th>Delivered</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o._id}>
            <td>{o._id}</td>
            <td>{o.user?.name || "N/A"}</td>
            <td>${o.totalPrice.toFixed(2)}</td>
            <td>{o.isPaid ? "Yes" : "No"}</td>
            <td>{o.isDelivered ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
