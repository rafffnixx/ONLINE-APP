import React from "react";
import "../styles/footer.css";  // ✅ Import footer styles

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>© 2025 Rafayell Online Store. All Rights Reserved.</p>
                <nav className="footer-links">
                    <a href="/about">About Us</a>
                    <a href="/contact">Contact</a>
                    <a href="/privacy-policy">Privacy Policy</a>
                    <a href="/terms">Terms & Conditions</a>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
