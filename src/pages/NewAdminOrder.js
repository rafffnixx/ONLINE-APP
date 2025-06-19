import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/NewAdminOrders.css"; // ✅ Import the admin orders styles

const API_BASE_URL = "http://localhost:5000/api";
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
                const response = await axios.get(`${API_BASE_URL}/new-orders/admin/all`, {  // ✅ Updated API route
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
            console.log(`🚀 Updating Order #${orderId} to "${newStatus}"...`, { orderId, newStatus });

            const response = await axios.patch(`${API_BASE_URL}/new-orders/admin/update/${orderId}`, { status: newStatus }, {  // ✅ Updated API route
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data && response.data.order) {
                console.log(`✅ Order #${orderId} updated to "${newStatus}" in the database`);

                // ✅ Fetch latest orders directly from backend after update
                const updatedOrderResponse = await axios.get(`${API_BASE_URL}/new-orders/admin/all`, {  // ✅ Updated API route
                    headers: { Authorization: `Bearer ${token}` }
                });

                setOrders(updatedOrderResponse.data);
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
                        🆔 **Order #{order.id}** | 👤 User ID: {order.user_id} | 💰 **Total: ${order.total_price}** | ⏳ Status: {order.status}  
                        <span>{expandedOrders[order.id] ? "🔽 Hide Details" : "▶ View Details"}</span>
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
