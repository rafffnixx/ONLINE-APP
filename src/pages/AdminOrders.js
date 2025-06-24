import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import "../styles/AdminOrders.css";

const AdminOrders = () => {
    const [users, setUsers] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
    const [orderStats, setOrderStats] = useState({ pending: 0, approved: 0, cancelled: 0 });
    const [viewingStatus, setViewingStatus] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ Admin login required!");
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await api.get("/api/orders/admin/grouped", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error("❌ Error fetching users:", error);
            }
        };

        const fetchOrderStats = async () => {
            try {
                const response = await api.get("/api/orders/admin/stats", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrderStats(response.data);
            } catch (error) {
                console.error("❌ Error fetching order stats:", error);
            }
        };

        fetchUsers();
        fetchOrderStats();
    }, []);

    const fetchOrdersByStatus = async (status) => {
        if (viewingStatus === status) {
            setViewingStatus(null);
            setUserOrders([]);
            return;
        }

        setViewingStatus(status);
        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ Admin login required!");
            return;
        }

        try {
            const response = await api.get(`/api/orders/admin/status/${status}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserOrders(response.data);
        } catch (error) {
            console.error("❌ Error fetching orders by status:", error);
        }
    };

    const fetchUserOrders = async (userId) => {
        setViewingStatus(null);
        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ Admin login required!");
            return;
        }

        try {
            const response = await api.get(`/api/orders/admin/orders/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserOrders(response.data);
        } catch (error) {
            console.error("❌ Error fetching user orders:", error);
            alert("❌ Failed to load user orders.");
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ Admin login required!");
            return;
        }

        try {
            await api.put(`/api/orders/admin/update/${orderId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("✅ Order status updated!");
            fetchOrdersByStatus(viewingStatus);
        } catch (error) {
            console.error("❌ Error updating order status:", error);
            alert("❌ Failed to update order status.");
        }
    };

    return (
        <div>
            <h2>🛠 Admin Orders Management</h2>
            <div className="stats">
                <p onClick={() => fetchOrdersByStatus("pending")} style={{ cursor: "pointer", color: viewingStatus === "pending" ? "darkblue" : "blue", textDecoration: "underline" }}>
                    📌 Total Pending: {orderStats.pending}
                </p>
                <p onClick={() => fetchOrdersByStatus("approved")} style={{ cursor: "pointer", color: viewingStatus === "approved" ? "darkgreen" : "green", textDecoration: "underline" }}>
                    ✅ Total Approved: {orderStats.approved}
                </p>
                <p onClick={() => fetchOrdersByStatus("cancelled")} style={{ cursor: "pointer", color: viewingStatus === "cancelled" ? "darkred" : "red", textDecoration: "underline" }}>
                    ❌ Total Cancelled: {orderStats.cancelled}
                </p>
            </div>

            {userOrders.length > 0 ? (
                <div>
                    <h3>📦 Orders for Selected User</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Product Name</th>
                                <th>Image</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userOrders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.product_name}</td>
                                    <td><img src={order.image_url || "https://via.placeholder.com/90"} alt={order.product_name} width="50" height="50" /></td>
                                    <td>{order.quantity}</td>
                                    <td>${order.total_price}</td>
                                    <td>
                                        <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}>
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <>
                    {users.length === 0 ? <p>No orders found.</p> : (
                        <table>
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Orders Count</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.user_id}>
                                        <td>{user.user_name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.order_count}</td>
                                        <td>
                                            <button onClick={() => fetchUserOrders(user.user_id)}>🔎 View Orders</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminOrders;
