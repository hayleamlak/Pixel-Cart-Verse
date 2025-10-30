import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/cartContext";
import { FaStar, FaRegStar, FaStarHalfAlt, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../styles/ProductPage.css";
import Toast from "../components/Toast";

const ETB_RATE = 55;

function ProductPage() {
  const { id } = useParams(); // MongoDB _id from URL
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [toastMessage, setToastMessage] = useState("");

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

  if (loading) return <h2>Loading product...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!product) return <h2>Product not found</h2>;

  const discountedPrice = product.discountPercentage
    ? product.price - (product.price * product.discountPercentage) / 100
    : product.price;

  const priceETB = (product.price * ETB_RATE).toFixed(2);
  const discountedETB = (discountedPrice * ETB_RATE).toFixed(2);
  const savings = (priceETB - discountedETB).toFixed(2);

  const avgRating =
    product.reviews?.length > 0
      ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
      : 0;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push(<FaStar key={i} color="#FFD700" />);
      else if (i - rating < 1) stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
      else stars.push(<FaRegStar key={i} color="#FFD700" />);
    }
    return stars;
  };

  const handleAddToCart = () => {
    addToCart(
      {
        _id: product._id,
        name: product.name,
        price: discountedPrice * ETB_RATE,
        image: product.images?.[0] || product.thumbnail || product.image,
        description: product.description,
      },
      quantity
    );
    setToastMessage(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const handlePrevImage = () => {
    if (product?.images?.length)
      setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (product?.images?.length)
      setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="product-page-container">
      <div className="product-gallery">
        <div className="gallery-main">
          <button className="arrow left" onClick={handlePrevImage}><FaArrowLeft /></button>
          <img
            src={product.images?.[selectedImageIndex] || product.thumbnail || product.image}
            alt={product.name}
            className="main-image"
          />
          <button className="arrow right" onClick={handleNextImage}><FaArrowRight /></button>
        </div>
        <div className="gallery-thumbnails">
          {[product.images?.[0], ...(product.images || [])].map((img, idx) => (
            <img
              key={idx}
              src={img}
              className={selectedImageIndex === idx ? "active" : ""}
              onClick={() => setSelectedImageIndex(idx)}
              alt={`Thumbnail ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>
        <div className="rating-stock">
          <span className="rating">{renderStars(avgRating)}</span>
          <span className="stock">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
        </div>
        <div className="product-price">
          <span className="discounted">{discountedETB} ETB</span>
          {product.discountPercentage && <span className="original">{priceETB} ETB</span>}
          {product.discountPercentage && <span className="savings">You save {savings} ETB</span>}
        </div>

        <div className="quantity-selector">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)}>+</button>
        </div>

        <div className="action-buttons">
          <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={product.stock <= 0}>Add to Cart</button>
          <button className="buy-now-btn" onClick={handleBuyNow} disabled={product.stock <= 0}>Buy Now</button>
        </div>

        <div className="tabs">
          <button className={activeTab === "description" ? "active" : ""} onClick={() => setActiveTab("description")}>Description</button>
          <button className={activeTab === "specs" ? "active" : ""} onClick={() => setActiveTab("specs")}>Specifications</button>
          <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>
            Reviews ({product.reviews?.length || 0})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "description" && <p>{product.description}</p>}
          {activeTab === "specs" && product.specifications && (
            <table className="specs-table">
              {Object.entries(product.specifications).map(([key, value], idx) => (
                <tr key={idx}><td>{key}</td><td>{value}</td></tr>
              ))}
            </table>
          )}
          {activeTab === "reviews" && (
            product.reviews?.length > 0 ? product.reviews.map((r, idx) => (
              <div key={idx} className="review">
                <strong>{r.reviewerName}</strong> - <span>{new Date(r.date).toLocaleDateString()}</span>
                <div className="review-rating">{renderStars(r.rating)}</div>
                <p>{r.comment}</p>
              </div>
            )) : <p>No reviews yet.</p>
          )}
        </div>
      </div>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
    </div>
  );
}

export default ProductPage;
