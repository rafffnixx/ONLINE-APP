import axios from "axios";
axios.get("http://localhost:5000/api/products/list") // ✅ Correct

const API_BASE_URL = "http://localhost:5000/api";

export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products/list`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};
