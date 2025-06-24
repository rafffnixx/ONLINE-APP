import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import "../styles/Orders.css";

const Orders = () => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const fetchRecords = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("❌ You must log in first!");
                return;
            }

            try {
                const response = await api.get("/api/orders/history", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setRecords(response.data);
            } catch (error) {
                console.error("❌ Error fetching orders and quotes:", error);
            }
        };

        fetchRecords();
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ You must log in first!");
            return;
        }

        try {
            await api.delete(`/api/orders/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setRecords(prev => prev.filter(record => record.id !== id));
            alert("✅ Deleted successfully!");
        } catch (error) {
            console.error("❌ Error deleting record:", error);
        }
    };

    return (
        <div className="orders-container">
            <div className="orders-card">
                <h2>📦 My Orders & Quotes</h2>
                {records.length === 0 ? (
                    <p className="empty-orders">No orders or quotes found.</p>
                ) : (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Product Name</th>
                                <th>Product Image</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record.id}>
                                    <td>{record.id}</td>
                                    <td>
                                        <span className={`type-label ${record.type}`}>
                                            {record.type === "quote" ? "📝 Quote" : "🛒 Order"}
                                        </span>
                                    </td>
                                    <td>{record.product_name}</td>
                                    <td>
                                        <img
                                            src={record.image_url || "https://via.placeholder.com/90"}
                                            alt={record.product_name}
                                            className="order-image"
                                        />
                                    </td>
                                    <td>{record.quantity}</td>
                                    <td>${record.total_price}</td>
                                    <td>
                                        <span className={`status ${record.status.toLowerCase()}`}>{record.status}</span>
                                    </td>
                                    <td>
                                        <button className="delete-btn" onClick={() => handleDelete(record.id)}>❌ Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Orders;
