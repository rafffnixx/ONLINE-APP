import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://online-backend-5blt.onrender.com",
});

export default api;
