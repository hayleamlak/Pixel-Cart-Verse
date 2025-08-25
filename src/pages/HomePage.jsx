// src/pages/Home.jsx
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/Home.css";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="home-container">

    
    

    
    {/* Hero Section */}
<section className="hero" data-aos="fade-up">
  <div className="hero-content">
    <div className="hero-text">
      <h1>Upgrade Your Style</h1>
      <p>Discover the best products curated just for you. From trendy outfits to must-have accessories, elevate your fashion game today!</p>
      <button className="cta-btn">Shop Now</button>
    </div>
    <div className="hero-image">
      <img src="/images/hero-banner.jpg" alt="Hero Banner" />
    </div>
  </div>
</section>

    
    

      {/* Featured Categories */}
      <section className="categories" data-aos="fade-right">
        <h2>Featured Categories</h2>
        <div className="category-grid">
          <div className="category-card">
            <img src="/images/shoes.jpg" alt="Shoes" />
            <p>Shoes</p>
          </div>
          <div className="category-card">
            <img src="/images/clothing.jpg" alt="Clothing" />
            <p>Clothing</p>
          </div>
          <div className="category-card">
            <img src="/images/accessories.jpg" alt="Accessories" />
            <p>Accessories</p>
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section className="highlights" data-aos="fade-left">
        <h2>Top Picks for You</h2>
        <div className="product-grid">
          <div className="product-card">
            <img src="/images/product1.jpg" alt="Product 1" />
            <h3>Classic Sneakers</h3>
            <p>$59.99</p>
          </div>
          <div className="product-card">
            <img src="/images/product2.jpg" alt="Product 2" />
            <h3>Summer Dress</h3>
            <p>$39.99</p>
          </div>
          <div className="product-card">
            <img src="/images/product3.jpg" alt="Product 3" />
            <h3>Leather Backpack</h3>
            <p>$79.99</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section" data-aos="zoom-in">
        <img src="/images/cta-banner.jpg" alt="CTA Banner" className="cta-img" />
        <h2>Limited Time Offer</h2>
        <p>Don’t miss out on our special discounts!</p>
        <button className="cta-btn">Grab Deal</button>
      </section>

      {/* Testimonials */}
      <section className="testimonials" data-aos="fade-up">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-list">
          <div className="testimonial">
            <img src="/images/customer1.jpg" alt="Customer 1" />
            <p>“Amazing quality!”</p>
          </div>
          <div className="testimonial">
            <img src="/images/customer2.jpg" alt="Customer 2" />
            <p>“Fast delivery!”</p>
          </div>
          <div className="testimonial">
            <img src="/images/customer3.jpg" alt="Customer 3" />
            <p>“Great customer service!”</p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter" data-aos="fade-up">
        <h2>Stay Updated</h2>
        <p>Join our newsletter for the latest deals.</p>
        <form>
          <input type="email" placeholder="Enter your email" />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="footer" data-aos="fade-up">
        <p>&copy; 2025 My E-Commerce. All rights reserved.</p>
      </footer>
    </div>
  );
}
