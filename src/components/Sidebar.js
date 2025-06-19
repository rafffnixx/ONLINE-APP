import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css"; 

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h3>🔧 Admin Panel</h3>
            <ul>
                <li><NavLink to="/admin/dashboard">🏢 Admin Home</NavLink></li>
                <li><NavLink to="/admin/orders">📦 Manage Orders</NavLink></li>
                <li><NavLink to="/admin/products">🛍 Manage Products</NavLink></li>
                <li><NavLink to="/admin/users">👤 Manage Users</NavLink></li>
                <li><NavLink to="/admin/upload">📤 Post a Product</NavLink></li> {/* ✅ Added */}
                <li><NavLink to="/admin/neworder">🔧 New Admin Order</NavLink></li>
            </ul>
        </div>
    );
};

export default Sidebar;
