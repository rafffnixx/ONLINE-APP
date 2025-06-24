import React, { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";

const Signup = () => {
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/auth/signup", user);
            alert("✅ Signup successful! You can now log in.");
            navigate("/login");
        } catch (error) {
            alert("❌ Error signing up.");
        }
    };

    return (
        <div className="auth-container">
            <h2>😍😍SHOP</h2>

            <form onSubmit={handleSubmit} className="auth-form">
                <h2>🔐 Create Your Account</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={user.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={user.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" className="auth-btn">Sign Up</button>

                <p className="auth-links">
                    Already have an account?{" "}
                <button type="button" onClick={() => navigate("/login")} className="link-button">Log in</button>
                </p>
            </form>
        </div>
    );
};

export default Signup;
