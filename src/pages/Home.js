import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import HotDeals from "./HotDeals";  // ✅ Import hot deals section

const Home = () => {
    return (
        <div className="home-container">
            <header className="hero">
                <h1>⚡ Welcome to Rafayell Online Store!</h1>
                <p>Find the best cables and electrical accessories.</p>
                <Link to="/products">
                    <button className="cta-btn">🛍️ Shop Now</button>
                </Link>
            </header>

            <section className="featured-products">
                <h2>✨ Featured Products</h2>
                <div className="product-grid">
                    <div className="product-card">🔌 Premium HDMI Cable</div>
                    <div className="product-card">🔋 Fast-Charge Power Adapter</div>
                    <div className="product-card">💡 LED Smart Bulb</div>
                </div>
            </section>
            {/* ✅ Embed Hot Deals Section */}
            <HotDeals />
        </div>
    );
};

export default Home;
