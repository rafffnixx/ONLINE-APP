import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";  
import "../styles/login.css";  

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", credentials);
            localStorage.setItem("token", response.data.token);  
            
            const decoded = jwtDecode(response.data.token);  
            console.log("🔍 User Role:", decoded.role);

            if (decoded.role === "admin") {
                navigate("/admin/dashboard");  
            } else {
                navigate("/");  
            }

            alert("✅ Login successful!");
        } catch (error) {
            alert("❌ Login failed!");
        }
    };

    return (
        
        <div className="login-container">
            <h2>😍😍SHOP</h2>

            <form onSubmit={handleSubmit} className="login-form">
                <h2 >🔑 Login</h2>

                <label>Email:</label>
                <input type="email" name="email" value={credentials.email} onChange={handleChange} required />

                <label>Password:</label>
                <input type="password" name="password" value={credentials.password} onChange={handleChange} required />

                <button type="submit" className="login-btn">Login</button>
            </form>

            {/* ✅ Sign Up Button */}
            <p className="signup-text">Don't have an account?</p>
            <button onClick={() => navigate("/signup")} className="signup-btn">Sign Up</button>
        </div>
    );
};

export default Login;
