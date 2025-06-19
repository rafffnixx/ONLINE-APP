import React, { useState, useEffect } from "react";
import axios from "axios";

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("❌ You must log in first!");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/api/cart/list", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("🔍 Received Cart Data:", response.data);

                // Ensure response.data is always treated as an array
                setCartItems(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("❌ Error fetching cart:", err);
                setError("⚠️ Failed to load cart. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    return (
        <div>
            <h2>📦 Checkout</h2>

            {loading && <p>⏳ Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            
            {!loading && !error && (
                cartItems.length === 0 ? (
                    <p>❌ No items found in cart.</p>
                ) : (
                    cartItems.map(item => (
                        <p key={item.id}>{item.name} - ${item.price_per_unit} x {item.quantity}</p>
                    ))
                )
            )}
        </div>
    );
};

export default Checkout;
