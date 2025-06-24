import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import "../styles/AdminDashboard.css";  
import Sidebar from "../components/Sidebar";  
import Widget from "../components/Widget";  

const AdminDashboard = () => {
    const [metrics, setMetrics] = useState({});
    const [recentOrders, setRecentOrders] = useState([]);
    const [filteredStatus, setFilteredStatus] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                console.log("🔍 Fetching admin dashboard data...");
                const response = await api.get("/api/admin/overview", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setMetrics(response.data.metrics || {});
                setRecentOrders(response.data.recentOrders || []);
            } catch (err) {
                console.error("❌ Error loading dashboard data:", err);
            }
        };

        fetchDashboardData();
    }, []);

    const statusMap = {
        pending_orders: "pending",
        to_be_shipped_orders: "to be shipped",
        shipped_orders: "shipped",
        delivered_orders: "delivered",
        canceled_orders: "canceled"
    };

    const handleStatusClick = (statusKey) => {
        const selectedStatus = statusMap[statusKey] || null;
        setFilteredStatus(selectedStatus);
    };

    const handleEdit = async (orderId, currentStatus) => {
        const newStatus = prompt(`Update status for Order #${orderId} (Current: ${currentStatus}):`);
        if (newStatus && newStatus !== currentStatus) {
            await api.put("/api/admin/update-order", { orderId, status: newStatus }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            setRecentOrders(prevOrders =>
                prevOrders.map(order =>
                    order.order_id === orderId ? { ...order, status: newStatus } : order
                )
            );
        }
    };

    const filteredOrders = filteredStatus
        ? recentOrders.filter(order => order.status.toLowerCase() === filteredStatus)
        : recentOrders;

    return (
        <div className="admin-dashboard">
            <Sidebar />
            <div className="dashboard-content">
                <h2>🏢 Admin Dashboard</h2>

                <div className="widgets">
                    {Object.entries(metrics).map(([key, value]) => (
                        <div key={key} className="widget-container">
                            <Widget
                                title={key.replace(/_/g, " ")}
                                value={value.toString()}
                            />
                            <button className="view-button" onClick={() => handleStatusClick(key)}>🔍 View</button>
                        </div>
                    ))}
                </div>

                <h3>📋 Orders ({filteredStatus ? `${filteredStatus} Orders` : "All Orders"})</h3>
                <div className="recent-orders">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <div key={order.order_id} className="order-summary">
                                <p>🆔 Order #{order.order_id} | 👤 User ID: {order.user_id} | 💰 ${order.total_price} | ⏳ {order.status} 
                                <button onClick={() => handleEdit(order.order_id, order.status)}>✏ Edit Status</button>
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No orders found for selected status.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
