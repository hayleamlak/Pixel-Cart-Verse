import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/cartContext";
import { FaStar, FaRegStar, FaStarHalfAlt, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../styles/ProductPage.css";

const ETB_RATE = 55;

function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Add to cart (price in ETB)
  const handleAddToCart = () => {
    if (!product) return;

    const priceETB = product.discountPercentage
      ? (product.price - (product.price * product.discountPercentage) / 100) * ETB_RATE
      : product.price * ETB_RATE;

    const originalPriceETB = product.discountPercentage ? product.price * ETB_RATE : null;

    addToCart(
      {
        _id: product._id,
        name: product.name,
        price: priceETB,
        originalPrice: originalPriceETB,
        image: product.images?.[0] || product.image || product.thumbnail,
        description: product.description,
      },
      quantity
    );
  };

  // Buy now: add to cart and go to checkout
  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push(<FaStar key={i} color="#FFD700" />);
      else if (i - rating < 1) stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
      else stars.push(<FaRegStar key={i} color="#FFD700" />);
    }
    return stars;
  };

  if (loading) return <h2>Loading product...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!product) return <h2>Product not found</h2>;

  const priceETB = product.price * ETB_RATE;
  const discountedPriceETB = product.discountPercentage
    ? (product.price - (product.price * product.discountPercentage) / 100) * ETB_RATE
    : priceETB;
  const savingsETB = priceETB - discountedPriceETB;
  const avgRating =
    product.reviews?.length > 0
      ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
      : 0;

  const handlePrevImage = () => {
    if (product?.images?.length) {
      setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (product?.images?.length) {
      setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="product-page-container">
      {/* Left: Gallery */}
      <div className="product-gallery">
        <div className="gallery-main">
          <button className="arrow left" onClick={handlePrevImage}><FaArrowLeft /></button>
          <img
            src={product.images?.[selectedImageIndex] || product.image || product.thumbnail}
            alt={product.name}
            className="main-image"
          />
          <button className="arrow right" onClick={handleNextImage}><FaArrowRight /></button>
        </div>
        <div className="gallery-thumbnails">
          {[product.image, ...(product.images || [])].map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={product.name}
              className={`thumbnail ${selectedImageIndex === idx ? "active" : ""}`}
              onClick={() => setSelectedImageIndex(idx)}
            />
          ))}
        </div>
      </div>

      {/* Right: Info */}
      <div className="product-info">
        <h1>{product.name}</h1>
        <div className="rating-stock">
          <span className="rating">{renderStars(avgRating)}</span>
          <span className="stock">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
        </div>

        <div className="product-price">
          <span className="discounted">{discountedPriceETB.toFixed(2)} ETB</span>
          {product.discountPercentage && (
            <>
              <span className="original">{priceETB.toFixed(2)} ETB</span>
              <span className="savings">You save {savingsETB.toFixed(2)} ETB</span>
            </>
          )}
        </div>

        {/* Quantity selector */}
        <div className="quantity-selector">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)}>+</button>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            Add to Cart
          </button>
          <button className="buy-now-btn" onClick={handleBuyNow} disabled={product.stock <= 0}>
            Buy Now
          </button>
          <button className="wishlist-btn">❤️ Wishlist</button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={activeTab === "description" ? "active" : ""} onClick={() => setActiveTab("description")}>Description</button>
          <button className={activeTab === "specs" ? "active" : ""} onClick={() => setActiveTab("specs")}>Specifications</button>
          <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>Reviews ({product.reviews?.length || 0})</button>
        </div>

        <div className="tab-content">
          {activeTab === "description" && <p>{product.description}</p>}
          {activeTab === "specs" && product.specifications && (
            <table className="specs-table">
              {Object.entries(product.specifications).map(([key, value], idx) => (
                <tr key={idx}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </table>
          )}
          {activeTab === "reviews" &&
            (product.reviews?.length > 0 ? (
              product.reviews.map((r, idx) => (
                <div key={idx} className="review">
                  <div className="review-header">
                    <strong>{r.reviewerName}</strong> - <span>{new Date(r.date).toLocaleDateString()}</span>
                    <div className="review-rating">{renderStars(r.rating)}</div>
                  </div>
                  <p>{r.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            ))
          }
        </div>

        {/* Tags */}
        <div className="product-tags">
          {product.tags?.map((tag, idx) => (
            <span key={idx} className="tag" onClick={() => navigate(`/shop?category=${tag}`)}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
