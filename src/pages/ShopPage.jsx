import React, { useEffect, useState } from "react";
import { useCart } from "../context/cartContext";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast"; // Toast component
import "../styles/ShopPage.css";

const ETB_RATE = 55;

const ShopPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const cached = localStorage.getItem("products");
        if (cached) {
          const data = JSON.parse(cached);
          setProducts(data);
          setFilteredProducts(data);
          setCategories(["All", ...new Set(data.map((p) => p.category))]);
          setLoading(false);
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
        setCategories(["All", ...new Set(data.map((p) => p.category))]);
        localStorage.setItem("products", JSON.stringify(data));
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products by category
  useEffect(() => {
    setVisibleCount(20);
    if (selectedCategory === "All") setFilteredProducts(products);
    else setFilteredProducts(products.filter((p) => p.category === selectedCategory));
  }, [selectedCategory, products]);

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  };

  const handleLoadMore = () => setVisibleCount((prev) => prev + 20);

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
        {filteredProducts.slice(0, visibleCount).map((product) => {
          const discountedPrice =
            product.discountPercentage > 0
              ? product.price - (product.price * product.discountPercentage) / 100
              : product.price;
          const inStock = product.stock > 0;
          const avgRating = getAverageRating(product.reviews);
          const roundedRating = Math.round(avgRating);

          const priceETB = (product.price * ETB_RATE).toLocaleString();
          const discountedETB = (discountedPrice * ETB_RATE).toLocaleString();

          return (
            <div key={product._id} className="product-card">
              {product.discountPercentage > 0 && (
                <span className="badge discount">-{product.discountPercentage}%</span>
              )}

              <img
                src={product.images?.[0] || product.thumbnail || product.image}
                alt={product.name}
                className="product-image"
                onClick={() => navigate(`/product/${product._id}`)}
              />

              <h2 className="product-name" onClick={() => navigate(`/product/${product._id}`)}>
                {product.name}
              </h2>

              <p className="product-description">{product.description?.substring(0, 60)}...</p>

              <div className="top-info">
                <span className="product-category">{product.category}</span>
                <span className={`stock ${inStock ? "in-stock" : "out-stock"}`}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="price">
                {product.discountPercentage > 0 ? (
                  <>
                    <span className="discounted-price">{discountedETB} ETB</span>
                    <span className="old-price">{priceETB} ETB</span>
                  </>
                ) : (
                  <span className="normal-price">{priceETB} ETB</span>
                )}
              </div>

              <div className="product-rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < roundedRating ? "star filled" : "star"}>
                    ★
                  </span>
                ))}
                <span className="rating-number">({avgRating.toFixed(1)})</span>
              </div>

              <button
                onClick={() => {
                  addToCart({
                    _id: product._id,
                    name: product.name,
                    price: discountedPrice * ETB_RATE,
                    image: product.images?.[0] || product.thumbnail || product.image,
                    description: product.description,
                  });
                  setToastMessage(`${product.name} added to cart!`);
                }}
                disabled={!inStock}
                className={`cart-btn ${!inStock ? "disabled" : ""}`}
              >
                {inStock ? "Add to Cart" : "Unavailable"}
              </button>
            </div>
          );
        })}
      </div>

      {visibleCount < filteredProducts.length && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      )}
    </div>
  );
};

export default ShopPage;
