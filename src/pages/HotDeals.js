import React, { useEffect, useState, useRef } from "react";
import api from "../api/axiosInstance";
import "../styles/hotdeal.css";

const HotDeals = () => {
    const [hotProducts, setHotProducts] = useState([]);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchHotProducts = async () => {
            try {
                const response = await api.get("/api/hot-deals");
                setHotProducts(response.data);
            } catch (error) {
                console.error("❌ Error fetching hot deals:", error);
            }
        };

        fetchHotProducts();
    }, []);

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
            <button onClick={scrollLeft} className="hot-deals-scroll-btn left-btn">◀</button>

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

            <button onClick={scrollRight} className="hot-deals-scroll-btn right-btn">▶</button>
        </div>
    );
};

export default HotDeals;
