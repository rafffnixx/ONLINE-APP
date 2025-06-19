import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ProductUpload.css"; 

const ProductUpload = () => {
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price_per_unit: "",
        unit: "meters",
        stock: "10",
        image_url: "",
        category_name: ""  // ✅ New field for category selection
    });

    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        // ✅ Fetch categories from backend
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/categories");
                setCategories(response.data);
            } catch (error) {
                console.error("❌ Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    const addCategory = async () => {
        if (!newCategory.trim()) return alert("❌ Enter a valid category name!");

        try {
            const response = await axios.post("http://localhost:5000/api/categories", { name: newCategory });
            setCategories([...categories, response.data]); // ✅ Add to dropdown
            setProductData({ ...productData, category_name: newCategory }); // ✅ Assign new category
            setNewCategory("");
        } catch (error) {
            console.error("❌ Error adding category:", error);
            alert("❌ Could not add category. Try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            alert("❌ You must log in first!");
            navigate("/login");
            return;
        }

        if (!productData.category_name) {
            alert("❌ Select or add a category!");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/products/add", productData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("✅ Product added successfully!");
            setProductData({
                name: "", description: "", price_per_unit: "", unit: "meters", stock: "10", image_url: "", category_name: ""
            });
        } catch (error) {
            console.error("❌ Error posting product:", error);
            alert("❌ Failed to post product.");
        }
    };

    return (
        <div className="product-upload-container">
            <h2>📦 Post a Product</h2>
            {!isLoggedIn ? (
                <p className="error-message">❌ You must be logged in to post a product!</p>
            ) : (
                <form onSubmit={handleSubmit} className="upload-form">
                    <label>Product Name:</label>
                    <input type="text" name="name" value={productData.name} onChange={handleChange} required />

                    <label>Product Description:</label>
                    <textarea name="description" value={productData.description} onChange={handleChange} required />

                    <label>Price Per Unit ($):</label>
                    <input type="number" name="price_per_unit" value={productData.price_per_unit} onChange={handleChange} required />

                    <label>Unit Type:</label>
                    <select name="unit" value={productData.unit} onChange={handleChange} required>
                        <option value="meters">Meters</option>
                        <option value="kg">Kilograms</option>
                    </select>

                    <label>Stock:</label>
                    <input type="number" name="stock" value={productData.stock} onChange={handleChange} required />

                    <label>Image URL:</label>
                    <input type="text" name="image_url" value={productData.image_url} onChange={handleChange} />

                    {/* ✅ Category Selection */}
                    <label>Category:</label>
                    <select name="category_name" value={productData.category_name} onChange={handleChange} required>
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                        <option value="new">➕ Add New Category</option>
                    </select>

                    {productData.category_name === "new" && (
                        <div className="new-category-section">
                            <label>Enter New Category Name:</label>
                            <input type="text" name="new_category_name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required />
                            <button type="button" onClick={addCategory}>✅ Add Category</button>
                        </div>
                    )}

                    <button type="submit" className="submit-btn">📦 Post Product</button>
                </form>
            )}
        </div>
    );
};

export default ProductUpload;
