import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import "../styles/Navbar.css";

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

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const role = getUserRole();
    const navigate = useNavigate();
    const menuRef = useRef();
    const userMenuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        setSearchQuery("");
        setIsMenuOpen(false);
    };

    const handleSignOut = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header className="navbar-container">
            <div className="navbar-content">
                {/* Logo */}
                <Link to="/" className="navbar-logo">😍😍 STORE</Link>

                {/* Desktop Navigation */}
                <nav className="navbar-links">
                    <Link to="/products">All Products</Link>
                    <Link to="/orders/customer">My Orders</Link>
                    <Link to="/login" className="login-link">Login</Link>
                    
                    <Link to="/profile">🧕</Link>
                </nav>

                {/* Search, Cart, User */}
                <div className="navbar-actions">
                    <form onSubmit={handleSearch} className="search-container">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="search-icon" />
                    </form>
                    <Link to="/cart" className="cart-icon">
                        <ShoppingCart />
                    </Link>

                    {/* User Dropdown Menu */}
                    <div className="user-menu" ref={userMenuRef}>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsUserMenuOpen(!isUserMenuOpen);
                            }} 
                            className="user-icon"
                        >
                            <User />
                        </button>

                        {isUserMenuOpen && (
                            <div className="dropdown">
                                <Link to="/profile" className="dropdown-item">Profile</Link>
                                <Link to="/settings" className="dropdown-item">
                                    <Settings className="icon" /> Settings
                                </Link>
                                {role === "admin" && (
                                    <Link to="/admin" className="dropdown-item">
                                        <LayoutDashboard className="icon" /> Admin Dashboard
                                    </Link>
                                )}
                                <button onClick={handleSignOut} className="dropdown-item logout">
                                    <LogOut className="icon" /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button 
                        className="menu-toggle" 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                        }}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="mobile-menu" ref={menuRef}>
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/products" onClick={() => setIsMenuOpen(false)}>All Products</Link>
                    <Link to="/orders/customer" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
