import React, { useEffect, useState } from "react";
import { useCart } from "../context/cartContext";
import { useNavigate } from "react-router-dom";
import "../styles/shoppage.css";

const ShopPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();

        // 👉 Assign random discount, isNew, inStock
        const flagged = data.map((p) => ({
          ...p,
          discount: Math.random() < 0.4 ? Math.floor(Math.random() * 50) + 10 : 0,
          isNew: Math.random() < 0.3,
          inStock: Math.random() < 0.9,
        }));

        setProducts(flagged);
        setFilteredProducts(flagged);

        const cats = ["All", ...new Set(flagged.map((p) => p.category))];
        setCategories(cats);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter by category
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => p.category === selectedCategory)
      );
    }
  }, [selectedCategory, products]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="shop-container">
      <h1 className="shop-title">Shop</h1>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => {
          const discountedPrice = product.discount
            ? (product.price - (product.price * product.discount) / 100).toFixed(2)
            : product.price;

          return (
            <div key={product._id} className="product-card">
              {/* Badges */}
              {product.isNew && <span className="badge new">New</span>}
              {product.discount > 0 && (
                <span className="badge discount">-{product.discount}%</span>
              )}

              <img
                src={product.image}
                alt={product.name}
                className="product-image"
                onClick={() => navigate(`/product/${product._id}`)}
              />

              <h2
                className="product-name"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {product.name}
              </h2>
              <p className="product-category">{product.category}</p>

              <div className="price">
                {product.discount > 0 ? (
                  <>
                    <span className="discounted-price">${discountedPrice}</span>
                    <span className="old-price">${product.price}</span>
                  </>
                ) : (
                  <span className="normal-price">${product.price}</span>
                )}
              </div>

              <p className={`stock ${product.inStock ? "in-stock" : "out-stock"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </p>

              <button
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className={`cart-btn ${!product.inStock ? "disabled" : ""}`}
              >
                {product.inStock ? "Add to Cart" : "Unavailable"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopPage;
