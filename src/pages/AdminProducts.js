import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import "../styles/AdminProducts.css"; 

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [updatedData, setUpdatedData] = useState({});
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get("/api/products/list", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data);
        } catch (error) {
            console.error("❌ Error fetching products:", error);
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setUpdatedData(product);
    };

    const handleDelete = async (productId) => {
        if (window.confirm("❌ Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/api/admin/products/delete/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProducts();
                alert("✅ Product deleted successfully!");
            } catch (error) {
                console.error("❌ Error deleting product:", error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            console.log("Updating Product ID:", editingProduct.id);
            await api.put(`/api/admin/products/update/${editingProduct.id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingProduct(null);
            fetchProducts();
            alert("✅ Product updated successfully!");
        } catch (error) {
            console.error("❌ Error updating product:", error);
            alert("❌ Failed to update product. Please check the API route or product ID.");
        }
    };

    return (
        <div className="admin-products-container">
            <h2>🛠️ Admin Product Management</h2>

            {editingProduct && (
                <form onSubmit={handleUpdate} className="edit-form">
                    <h3>✏️ Edit Product</h3>
                    <label>Product Name: <input type="text" name="name" value={updatedData.name} onChange={handleChange} /></label>
                    <label>Description: <input type="text" name="description" value={updatedData.description} onChange={handleChange} /></label>
                    <label>Price ($): <input type="number" name="price_per_unit" value={updatedData.price_per_unit} onChange={handleChange} /></label>
                    <label>Stock: <input type="number" name="stock" value={updatedData.stock} onChange={handleChange} /></label>
                    <button type="submit">✅ Update Product</button>
                    <button type="button" onClick={() => setEditingProduct(null)}>❌ Cancel</button>
                </form>
            )}

            <table className="admin-product-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>${product.price_per_unit}</td>
                            <td>{product.stock}</td>
                            <td>
                                <button onClick={() => handleEditClick(product)}>✏️ Edit</button>
                                <button onClick={() => handleDelete(product.id)}>🗑️ Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProducts;
