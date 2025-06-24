import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "../styles/Cart.css";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchCart = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Please login to view your cart");
            return;
        }

        try {
            const response = await api.get("/api/cart/list", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = Array.isArray(response?.data) ? response.data : [];
            setCartItems(data);
            calculateTotalPrice(data);
        } catch (error) {
            console.error("Error fetching cart:", error);
            setError(error.response?.data?.message || "Failed to load cart items");
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const calculateTotalPrice = (items = []) => {
        if (!Array.isArray(items)) {
            console.error("❌ Expected an array, but got:", items);
            setTotalPrice(0);
            return;
        }

        const total = items.reduce((sum, item) => {
            const price = Number(item.price_per_unit) || 0;
            const quantity = Number(item.quantity) || 0;
            return sum + (Number(item.total_price) || (price * quantity));
        }, 0);

        setTotalPrice(total);
    };

    const handleRemove = async (product_id) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to modify your cart");
            return;
        }

        try {
            await api.delete(`/api/cart/remove/${product_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCart();
        } catch (error) {
            console.error("Error removing item:", error);
            setError(error.response?.data?.message || "Failed to remove item");
        }
    };

    const handlePlaceOrder = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must log in first!");
            navigate("/login");
            return;
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        setIsPlacingOrder(true);
        setError(null);

        try {
            const orderItems = cartItems.map((item, index) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price_per_unit: Number(item.price_per_unit) || 0,
                total_price: Number(item.total_price) || (Number(item.price_per_unit) * item.quantity),
                img_url: item.img_url,
                status: "pending",
                uniqueKey: `${item.product_id}-${index}`
            }));

            const response = await api.post("/api/customer-orders/orderBananaSplit", 
                { items: orderItems },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data?.order_id) {
                await api.delete("/api/cart/clear", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCart();
                navigate(`/orders/${response.data.order_id}`);
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <div className="cart-container">
            <h2>🛒 Your Cart</h2>
            {error && <div className="error-message">{error}</div>}

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <h3>No items in cart</h3>
                    <Link to="/products">
                        <button className="continue-shopping-btn">
                            🛍 Continue Shopping
                        </button>
                    </Link>
                </div>
            ) : (
                <>
                    <div className="cart-items-list">
                        {cartItems.map((item, index) => (
                            <div key={`${item.product_id}-${index}`} className="cart-item">
                                <img src={item.img_url} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h4>{item.name}</h4>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>${(Number(item.total_price) || (Number(item.price_per_unit) * item.quantity)).toFixed(2)}</p>
                                </div>
                                <button
                                    onClick={() => handleRemove(item.product_id)}
                                    className="remove-item-btn"
                                >
                                    ❌ Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3>Total: <span className="total-price">${totalPrice.toFixed(2)}</span></h3>
                    </div>
                    <div className="cart-actions">
                        <button
                            onClick={() => navigate("/checkout")}
                            className="checkout-btn"
                        >
                            🚀 Proceed to Checkout
                        </button>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder}
                            className={`place-order-btn ${isPlacingOrder ? "processing" : ""}`}
                        >
                            {isPlacingOrder ? "⏳ Processing..." : "📦 Place Order Now"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
