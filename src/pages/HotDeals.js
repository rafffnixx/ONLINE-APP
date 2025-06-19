import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../styles/hotdeal.css";  // ✅ Import the external CSS file

const HotDeals = () => {
    const [hotProducts, setHotProducts] = useState([]);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchHotProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/hot-deals");
                setHotProducts(response.data);
            } catch (error) {
                console.error("❌ Error fetching hot deals:", error);
            }
        };

        fetchHotProducts();
    }, []);

    // 🔄 Scroll Functions
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    return (
        <div className="hot-deals-section">
            <h2>🔥 Hot Deals</h2>

            {/* ✅ Left Scroll Button */}
            <button onClick={scrollLeft} className="hot-deals-scroll-btn left-btn">◀</button>

            {/* ✅ Scrolling Container */}
            <div ref={scrollContainerRef} className="hot-deals-container">
                {hotProducts.map(product => (
                    <div key={product.id} className="hot-deals-item">
                        <img src={product.image_url} alt={product.name} className="hot-deals-img" />
                        <h3>{product.name}</h3>
                        <p><strong>Discounted Price:</strong> ${product.discount_price}</p>
                        <button className="hot-deals-btn">🛒 Buy Now</button>
                    </div>
                ))}
            </div>

            {/* ✅ Right Scroll Button */}
            <button onClick={scrollRight} className="hot-deals-scroll-btn right-btn">▶</button>
        </div>
    );
};

export default HotDeals;
