import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import "../styles/NewAdminOrders.css";

const statusOptions = ["pending", "to be shipped", "shipped", "delivered", "canceled"];

const NewAdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [expandedOrders, setExpandedOrders] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("❌ Admin login required.");
                return;
            }

            try {
                console.log("🔍 Fetching all orders...");
                const response = await api.get("/api/new-orders/admin/all", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.data || !Array.isArray(response.data)) {
                    setError("❌ No orders found.");
                    return;
                }

                setOrders(response.data);
                console.log("✅ Orders Loaded:", response.data);
            } catch (err) {
                console.error("❌ Error fetching orders:", err);
                setError("❌ Failed to load orders.");
            }
        };

        fetchOrders();
    }, []);

    const toggleOrderView = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ Admin login required!");
            return;
        }

        try {
            console.log(`🚀 Updating Order #${orderId} to "${newStatus}"...`);

            const response = await api.patch(`/api/new-orders/admin/update/${orderId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data?.order) {
                console.log(`✅ Order #${orderId} updated to "${newStatus}"`);

                const updated = await api.get("/api/new-orders/admin/all", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setOrders(updated.data);
                alert(`✅ Order #${orderId} updated to "${newStatus}"`);
            } else {
                throw new Error("Unexpected backend response.");
            }

        } catch (error) {
            console.error("❌ Error updating order status:", error);
            alert("❌ Failed to update order.");
        }
    };

    if (error) return <div className="error-message">{error}</div>;
    if (!orders || orders.length === 0) return <div>⏳ No orders found.</div>;

    return (
        <div className="admin-orders-container">
            <h2>🔧 Manage Orders</h2>
            {orders.map(order => (
                <div key={order.id} className={`order-item ${order.updated ? "updated" : ""}`}>
                    <p onClick={() => toggleOrderView(order.id)} className="clickable-order">
                        🆔 <strong>Order #{order.id}</strong> | 👤 User ID: {order.user_id} | 💰 <strong>Total: ${order.total_price}</strong> | ⏳ Status: {order.status}  
                        <span>{expandedOrders[order.id] ? " 🔽 Hide Details" : " ▶ View Details"}</span>
                    </p>

                    <select
                        className="status-dropdown"
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    >
                        {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
};

export default NewAdminOrders;
