import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "../styles/ProductDetails.css";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        api.get(`/api/products/${id}`)
            .then(response => setProduct(response.data))
            .catch(error => console.error("Error fetching product:", error));
    }, [id]);

    if (!product) return <p>Loading...</p>;

    return (
        <div className="product-details">
            <button className="back-button" onClick={() => navigate("/products")}>← Back</button>
            <img src={product.image_url || "https://via.placeholder.com/200"} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
        </div>
    );
};

export default ProductDetails;
