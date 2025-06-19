import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";  // ✅ Corrected import


import Home from "./pages/Home";
import ProductList from "./components/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Navbar from "./components/Navbar";
import ProductUpload from "./pages/ProductUpload";
import Orders from "./pages/Orders";
import NewCustomerOrders from "./pages/NewCustomerOrders";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./components/Footer"; 
import AboutUs from "./components/AboutUs"; 
import Profile from "./pages/Profile"; 
import AdminLayout from "./components/AdminLayout"; 
import AdminDashboard from "./pages/AdminDashboard"; 
import AdminOrders from "./pages/AdminOrders"; 
import AdminUsers from "./pages/AdminUsers"; 
import AdminProducts from "./pages/AdminProducts"; 
import NewAdminOrder from "./pages/NewAdminOrder";  

// ✅ Function to get user role from JWT token
const getUserRole = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.role || null;  // ✅ Extract the role
    } catch (error) {
        console.error("❌ Error decoding token:", error);
        return null;
    }
};

// ✅ Private route for admin access restriction
const AdminRoute = ({ element }) => {
    const role = getUserRole();
    if (role !== "admin") {
        alert("❌ Access denied! Admins only.");
        return <Navigate to="/" />;  // ✅ Redirect regular users
    }

    return element;
};

function App() {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, quantity) => {
        if (quantity === "0") {
            setCartItems(cartItems.filter(item => item.id !== product.id));
        } else {
            const updatedProduct = { 
                ...product, 
                quantity: parseFloat(quantity), 
                total_price: (parseFloat(quantity) * product.price_per_unit).toFixed(2)
            };
            setCartItems([...cartItems.filter(item => item.id !== product.id), updatedProduct]);
        }
    };

    return (
        <Router>
            <Navbar />
            <div className="content">
                <Routes>
                    {/* ✅ User Pages */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList addToCart={addToCart} cartItems={cartItems} />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart cartItems={cartItems} />} />
                    <Route path="/checkout" element={<Checkout cartItems={cartItems} />} />
                    <Route path="/upload" element={<ProductUpload />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/customer" element={<NewCustomerOrders />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/about" element={<AboutUs />} /> 
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* ✅ Admin Pages - Protected by `AdminRoute` */}
                    <Route path="/admin" element={<AdminRoute element={<AdminLayout />} />}>
                        <Route path="dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
                        <Route path="orders" element={<AdminRoute element={<AdminOrders />} />} />
                        <Route path="products" element={<AdminRoute element={<AdminProducts />} />} />
                        <Route path="users" element={<AdminRoute element={<AdminUsers />} />} />
                        <Route path="neworder" element={<AdminRoute element={<NewAdminOrder />} />} />
                        <Route path="upload" element={<AdminRoute element={<ProductUpload />} />} />
                    </Route>
                </Routes>
            </div>
            <Footer /> 
        </Router>
    );
}

export default App;
