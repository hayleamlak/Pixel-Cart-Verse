import React, { useState } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

export default function UsersTable({ users, token, onUpdateUsers }) {
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({});

  const startEditUser = (user) => {
    setEditingUserId(user._id);
    setEditUserData({ name: user.name, email: user.email, isAdmin: user.isAdmin });
  };

  const saveUser = async (id) => {
    const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(editUserData),
    });
    const data = await res.json();
    if (res.ok) onUpdateUsers(id, data);
    setEditingUserId(null);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) onUpdateUsers(id, null);
  };

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Admin</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u._id}>
            <td>{editingUserId === u._id ? <input value={editUserData.name} onChange={(e) => setEditUserData({...editUserData, name: e.target.value})} /> : u.name}</td>
            <td>{editingUserId === u._id ? <input value={editUserData.email} onChange={(e) => setEditUserData({...editUserData, email: e.target.value})} /> : u.email}</td>
            <td>{editingUserId === u._id ? (
              <select value={editUserData.isAdmin} onChange={(e) => setEditUserData({...editUserData, isAdmin: e.target.value==="true"})}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            ) : u.isAdmin ? "Yes" : "No"}</td>
            <td>
              {editingUserId === u._id ? (
                <>
                  <button onClick={() => saveUser(u._id)} className="save-btn"><FaSave /></button>
                  <button onClick={() => setEditingUserId(null)} className="cancel-btn"><FaTimes /></button>
                </>
              ) : (
                <>
                  <button onClick={() => startEditUser(u)} className="edit-btn"><FaEdit /></button>
                  <button onClick={() => deleteUser(u._id)} className="delete-btn"><FaTrash /></button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
