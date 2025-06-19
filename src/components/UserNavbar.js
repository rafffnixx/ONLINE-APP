import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";

const getUserRole = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.role || null;
    } catch (error) {
        console.error("❌ Error decoding token:", error);
        return null;
    }
};

const UserNavbar = () => {
    const role = getUserRole();

    return (
        <nav className="navbar">
            <Link to="/">Home</Link>
            <Link to="/products">View Products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/checkout">Checkout</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/profile">Profile</Link>

            {/* ✅ Admin links - Only visible to admins */}
            {role === "admin" && (
                <>
                    <Link to="/admin/dashboard">Admin Dashboard</Link>
                    <Link to="/admin/products">Admin Products</Link>
                    <Link to="/admin/orders">Admin Orders</Link>
                    <Link to="/admin/users">Admin Users</Link>
                </>
            )}
        </nav>
    );
};

export default UserNavbar;
