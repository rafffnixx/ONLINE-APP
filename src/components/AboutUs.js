import React from "react";
import "../styles/AboutUs.css";

const AboutUs = () => {
    return (
        <div className="about-us-container">
            <header className="about-header">
                <h1>About Us</h1>
            </header>

            <section className="story-section">
                <h2>Our Story</h2>
                <p>
                    Founded with a passion for excellence, we've been dedicated to providing exceptional 
                    products and service to our customers. Our journey began with a simple idea: to create 
                    a shopping experience that combines quality, convenience, and customer satisfaction.
                </p>
                <p>
                    Today, we continue to grow and evolve, always putting our customers first and striving 
                    to exceed expectations in everything we do.
                </p>
            </section>

            <section className="mission-section">
                <h2>Our Mission</h2>
                <ul>
                    <li>Curating high-quality products</li>
                    <li>Providing outstanding customer service</li>
                    <li>Maintaining competitive prices</li>
                    <li>Ensuring a seamless shopping experience</li>
                    <li>Building lasting relationships with our customers</li>
                </ul>
            </section>

            <section className="values-section">
                <h2>Our Values</h2>
                <ul>
                    <li><strong>Quality:</strong> We never compromise on the quality of our products and services.</li>
                    <li><strong>Integrity:</strong> We conduct our business with honesty and transparency.</li>
                    <li><strong>Innovation:</strong> We continuously evolve to meet our customers' changing needs.</li>
                </ul>
            </section>

            <section className="masai-cables">
                <h2>MASAI CABLES</h2>
                <p>
                    <strong>Building Stronger Connections.</strong> For Safety, Efficiency, and Long Life, we recommend you to 
                    <em>USE IT, FEEL IT, AND LIVE WITH IT.</em>
                </p>
            </section>

            <section className="quick-links">
                <h2>Quick Links</h2>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/products">Products</a></li>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </section>

            <section className="products-list">
                <h2>Our Products</h2>
                <ul>
                    <li>Wires & Cables</li>
                    <li>Welding Cable</li>
                    <li>Domestic Cables</li>
                    <li>Submersible Cables</li>
                    <li>Overhead Conductors</li>
                    <li>Flexible Cables</li>
                    <li>Armoured Cable</li>
                </ul>
            </section>

            <section className="contact-us">
                <h2>Contact Us</h2>
                <p><strong>Masai Cables Limited</strong></p>
                <p>P.O.Box 344 - 00242, Kitengela, Kenya</p>
                <p>📞 +254 XX XXX XXXX</p>
                <p>📧 info.mcl@masaigroup.co.ke</p>
            </section>

            <footer className="about-footer">
                <p>© 2025 Masai Cables Limited. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AboutUs;
