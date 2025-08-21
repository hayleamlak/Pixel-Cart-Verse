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
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20); // Number of products per page
  const navigate = useNavigate();

  const usdToEtbRate = 55; // Adjust exchange rate if needed

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();

        setProducts(data);
        setFilteredProducts(data);

        const cats = ["All", ...new Set(data.map((p) => p.category))];
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
    setCurrentPage(1); // Reset page when filter changes
    if (selectedCategory === "All") setFilteredProducts(products);
    else
      setFilteredProducts(
        products.filter((p) => p.category === selectedCategory)
      );
  }, [selectedCategory, products]);

  // Calculate average rating
  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  };

  // Pagination logic
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo(0, 0);
  };

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
        {currentProducts.map((product) => {
          const discountedPrice = product.discountPercentage
            ? (
                product.price - 
                (product.price * product.discountPercentage) / 100
              ).toFixed(2)
            : product.price;

          const inStock = product.stock > 0;
          const avgRating = getAverageRating(product.reviews);
          const roundedRating = Math.round(avgRating);

          // Convert USD to ETB
          const priceETB = (product.price * usdToEtbRate).toLocaleString();
          const discountedETB = (discountedPrice * usdToEtbRate).toLocaleString();

          return (
            <div key={product._id} className="product-card">
              {/* Wishlist Icon */}
              <span className="wishlist-icon">❤</span>

              {/* Discount badge */}
              {product.discountPercentage > 0 && (
                <span className="badge discount">-{product.discountPercentage}%</span>
              )}

              {/* Product Image */}
              <img
                src={product.images?.[0] || product.thumbnail || product.image}
                alt={product.name}
                className="product-image"
                onClick={() => navigate(`/product/${product._id}`)}
              />

              {/* Name */}
              <h2
                className="product-name"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {product.name}
              </h2>

              {/* Description */}
              <p className="product-description">{product.description?.substring(0, 60)}...</p>

              {/* Top info: category & stock */}
              <div className="top-info">
                <span className="product-category">{product.category}</span>
                <span className={`stock ${inStock ? "in-stock" : "out-stock"}`}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Price */}
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

              {/* Rating */}
              <div className="product-rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < roundedRating ? "star filled" : "star"}>★</span>
                ))}
                <span className="rating-number">({avgRating.toFixed(1)})</span>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => addToCart(product)}
                disabled={!inStock}
                className={`cart-btn ${!inStock ? "disabled" : ""}`}
              >
                {inStock ? "Add to Cart" : "Unavailable"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
