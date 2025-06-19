import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../styles/NewCustomerOrders.css"; 

const API_BASE_URL = "http://localhost:5000/api/customer-orders";

const NewCustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState(null);
    const [activeOrderId, setActiveOrderId] = useState(null);  

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("❌ You must log in first!");
                return;
            }

            try {
                const decodedToken = jwtDecode(token);

                if (!decodedToken.id || isNaN(Number(decodedToken.id))) {
                    console.error("❌ Invalid token data!");
                    setError("❌ Invalid authentication. Please log in again.");
                    return;
                }

                const response = await axios.get(`${API_BASE_URL}/customer/${decodedToken.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const formattedOrders = await Promise.all(response.data.map(async (order) => {
                    const orderItemsRes = await axios.get(`${API_BASE_URL}/${order.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    const items = orderItemsRes.data.items || [];
                    const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

                    return {
                        ...order,
                        orderLabel: `Order#${order.id}`,
                        itemCount: totalQuantity,
                        totalPrice: Number(order.total_price) || 0,
                        items: items,  
                    };
                }));

                setOrders(formattedOrders);

            } catch (err) {
                console.error("❌ Error fetching orders:", err);
                setError("❌ Failed to load orders. Please try again.");
            }
        };

        fetchOrders();
    }, []);

    const handleViewOrder = async (orderId) => {
        if (!orderId || isNaN(Number(orderId))) {  
            console.error("❌ Invalid order ID:", orderId);
            setError("❌ Unable to fetch order details.");
            return;
        }

        if (activeOrderId === orderId) {
            setSelectedOrder(null);
            setActiveOrderId(null);
            return;  
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ You must log in first!");
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSelectedOrder({
                ...response.data,
                items: response.data.items || [],
            });

            setActiveOrderId(orderId);  

        } catch (err) {
            console.error("❌ Error fetching order details:", err);
            setError("❌ Failed to load order details.");
        }
    };

    const handleCloseOrder = () => {
        setSelectedOrder(null);
        setActiveOrderId(null);  
    };

    return (
        <div className="orders-container">
            <h2>📦 Your Orders</h2>
            {error && <p className="error-message">{error}</p>}
            {orders.length === 0 ? (
                <p className="empty-orders">⏳ No orders found.</p>
            ) : (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>ORDER ID</th>
                            <th>Image</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.orderLabel}</td>
                                <td>
                                    <img src={order.img_url || "https://i.postimg.cc/Z5fLwvD7/order-now-icon-ecommerce-shop-now-call-action-788415-6210-removebg-preview.png"} className="order-image" />
                                </td>
                                <td>{order.itemCount}</td>
                                <td>${order.totalPrice.toFixed(2)}</td>
                                <td>
                                    <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                                </td>
                                <td>
                                    <button className="view-details-btn" onClick={() => handleViewOrder(order.id)}>
                                        🔍 View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedOrder && (
                <div className="order-details-overlay">  
                    <div className="order-details-modal">  
                        <h3>🛒 Order Details for {selectedOrder.orderLabel}</h3>
                        <button className="close-details-btn" onClick={handleCloseOrder}>❌ Close</button>
                        <table className="order-items-table">
                            <thead>
                                <tr>
                                    <th>Product ID</th>
                                    <th>Product Name</th>
                                    <th>Image</th>
                                    <th>Quantity</th>
                                    <th>Price Per Unit</th>
                                    <th>Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.items.map((item, index) => (
                                    <tr key={`${item.product_id}-${index}`}>  
                                        <td>{item.product_id}</td>
                                        <td>{item.product_name}</td>
                                        <td>
                                            <img src={item.img_url || "https://via.placeholder.com/90"} className="order-image" />
                                        </td>
                                        <td>{item.quantity}</td>
                                        <td>${Number(item.price_per_unit || 0).toFixed(2)}</td>
                                        <td>${Number(item.total_price || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewCustomerOrders;
