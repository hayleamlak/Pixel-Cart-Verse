import React, { useState } from "react";

export default function ProductsTable({ products, onEdit, onDelete, onAdd }) {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    countInStock: "",
  });

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.countInStock) {
      alert("Please fill all fields!");
      return;
    }
    onAdd(newProduct);
    setNewProduct({ name: "", price: "", countInStock: "" });
  };

  return (
    <div>
      {/* Table */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.countInStock}</td>
              <td>
                <button
                  className="btn edit"
                  onClick={() => onEdit(p._id, p)}
                >
                  Edit
                </button>
                <button
                  className="btn delete"
                  onClick={() => onDelete(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {/* Row for Adding New Product */}
          <tr>
            <td>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleChange}
                placeholder="Product Name"
              />
            </td>
            <td>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleChange}
                placeholder="Price"
              />
            </td>
            <td>
              <input
                type="number"
                name="countInStock"
                value={newProduct.countInStock}
                onChange={handleChange}
                placeholder="Stock"
              />
            </td>
            <td>
              <button className="btn add" onClick={handleAdd}>
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
