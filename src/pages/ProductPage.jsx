import React, { useEffect, useState, useContext } from "react"; 
import { useParams } from "react-router-dom";
import { CartContext } from "../context/cartContext";
import "../styles/ProductPage.css";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <h2>Loading product...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!product) return <h2>Product not found</h2>;

  return (
    <div className="product-page-container">
      <div className="product-page-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-page-info">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p className="product-page-price">Price: ${product.price}</p>
        <button onClick={() => addToCart(product)} className="add-to-cart-btn">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductPage;
