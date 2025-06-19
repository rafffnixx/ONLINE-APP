import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/ProductList.css";

const ProductList = () => {
    const [productsByCategory, setProductsByCategory] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await axios.get("http://localhost:5000/api/products/list");

                const categorizedProducts = {};
                response.data.forEach(product => {
                    if (!product.category || !product.price_per_unit) {
                        console.warn("Invalid product data:", product);
                        return;
                    }
                    
                    if (!categorizedProducts[product.category]) {
                        categorizedProducts[product.category] = [];
                    }
                    categorizedProducts[product.category].push({
                        ...product,
                        price_per_unit: Number(product.price_per_unit) || 0
                    });
                });

                setProductsByCategory(categorizedProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to load products. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handlePlaceOrder = async (product, quantity) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must log in first!");
            return;
        }

        try {
            const qty = parseFloat(quantity) || 1;
            const price = Number(product.price_per_unit) || 0;
            
            const orderData = {
                user_id: 2,
                items: [
                    {
                        product_id: product.id,
                        quantity: qty,
                        total_price: price * qty
                    }
                ]
            };

            await axios.post("http://localhost:5000/api/orders/place", orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Order placed successfully!");
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        }
    };

    const handleAddToCart = async (product, quantity) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ You must log in first!");
            return;
        }

        try {
            const qty = parseFloat(quantity) || 1;

            const response = await axios.post(
                "http://localhost:5000/api/cart/add",
                {
                    product_id: product.id,
                    quantity: qty
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert(`${product.name} added to cart!`);
        } catch (error) {
            console.error("❌ Error adding to cart:", error);
            alert("❌ Failed to add item to cart. Please try again.");
        }
    };

    const scrollToCategory = (category) => {
        setSelectedCategory(category);
        if (!category) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        
        const categoryElement = document.getElementById(`category-${category}`);
        if (categoryElement) {
            const offset = 100;
            const elementPosition = categoryElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    const formatPrice = (price) => {
        const num = Number(price);
        return isNaN(num) ? "0.00" : num.toFixed(2);
    };
    
    return (
        <div className="product-page-container">
            <button 
                className="sidebar-toggle"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
                {isSidebarCollapsed ? <FaBars /> : <FaTimes />}
            </button>

            <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <h3>Categories</h3>
                <ul>
                    <li>
                        <button 
                            className={`category-btn ${!selectedCategory ? "active" : ""}`} 
                            onClick={() => {
                                scrollToCategory("");
                                setIsSidebarCollapsed(true);
                            }}
                        >
                            All Products
                        </button>
                    </li>
                    {Object.keys(productsByCategory).map(category => (
                        <li key={category}>
                            <button 
                                className={`category-btn ${selectedCategory === category ? "active" : ""}`} 
                                onClick={() => {
                                    scrollToCategory(category);
                                    setIsSidebarCollapsed(true);
                                }}
                            >
                                {category}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            <div className="product-list-container">
                <h2>Featured Products</h2>

                {error ? (
                    <div className="error-message">{error}</div>
                ) : isLoading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : Object.keys(productsByCategory).length === 0 ? (
                    <div className="empty-message">
                        <p>No products available.</p>
                    </div>
                ) : (
                    Object.keys(productsByCategory).map(category => (
                        <div key={category} id={`category-${category}`} className="category-section">
                            <h3 className="category-title">{category}</h3>
                            <div className="product-grid">
                                {productsByCategory[category].map(product => (
                                    <div key={product.id} className="product-card">
                                        <Link to={`/product/${product.id}`} className="product-link">
                                            <img 
                                                src={product.image_url || "https://via.placeholder.com/150"} 
                                                alt={product.name} 
                                                className="product-image" 
                                            />
                                            <h3>{product.name}</h3>
                                            <p>
                                                <strong>Price:</strong> ${formatPrice(product.price_per_unit)} per {product.unit}
                                            </p>
                                        </Link>

                                        <div className="order-section">
                                            <label>
                                                Quantity ({product.unit}):
                                                <input 
                                                    type="number" 
                                                    min="0.1" 
                                                    step="0.1" 
                                                    defaultValue="1" 
                                                    id={`qty-${product.id}`}
                                                />
                                            </label>
                                            <div className="button-group">
                                                <button 
                                                    onClick={() => handleAddToCart(
                                                        product, 
                                                        document.getElementById(`qty-${product.id}`)?.value || "1"
                                                    )} 
                                                    className="add-to-cart-btn"
                                                >
                                                    Add to Cart
                                                </button>
                                                <button 
                                                    onClick={() => handlePlaceOrder(
                                                        product, 
                                                        document.getElementById(`qty-${product.id}`)?.value || "1"
                                                    )} 
                                                    className="order-btn"
                                                >
                                                    Place Order
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductList;