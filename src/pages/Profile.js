import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../styles/Profile.css";  

const API_BASE_URL = "http://localhost:5000/api";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingPhone, setEditingPhone] = useState(false);
    const [newPhone, setNewPhone] = useState("");
    const [editingAddress, setEditingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState("");
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("❌ No authentication token found. Please log in.");
                    setLoading(false);
                    return;
                }

                const decodedToken = jwtDecode(token);
                const userId = decodedToken?.userId || decodedToken?.id;

                if (!userId || isNaN(userId)) {
                    setError("❌ Invalid token. User ID missing.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("🔍 API Response:", response.data);
                setUser(response.data);
                setNewPhone(response.data.phone !== "Not set" ? response.data.phone : "");
                setNewAddress(response.data.address !== "Not set" ? response.data.address : "");
                setLoading(false);
            } catch (err) {
                console.error("❌ Error fetching profile:", err);
                setError("❌ Failed to load profile.");
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleImageUpload = async () => {
        const token = localStorage.getItem("token");
        if (!imageFile || !token) return alert("❌ Please select an image!");

        const formData = new FormData();
        formData.append("profile_picture", imageFile);

        try {
            const response = await axios.put(`${API_BASE_URL}/users/update/${user.id}/image`, formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
            });

            alert("✅ Profile picture updated!");
            setUser({ ...user, profile_picture: response.data.imageUrl });
        } catch (error) {
            alert("❌ Error updating profile picture.");
        }
    };

    const handleAddressUpdate = async () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("❌ Authentication required!");

        try {
            await axios.put(`${API_BASE_URL}/users/update/${user.id}`, { address: newAddress }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("✅ Address updated!");
            setUser({ ...user, address: newAddress });
            setEditingAddress(false);
        } catch (error) {
            alert("❌ Error updating address.");
        }
    };

    if (loading) return <p>⏳ Loading profile...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="profile-container">
            <h2>👤 {user.name}'s Profile</h2>

            {/* ✅ Profile Image Upload */}
            <img src={user.profile_picture || "/default-avatar.png"} alt="Profile" className="profile-image"/>
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
            <button onClick={handleImageUpload} className="upload-btn">Upload Image</button>

            <p><b>Email:</b> {user.email}</p>

            {/* ✅ Editable Phone Field */}
            <p>
                <b>Phone:</b> {editingPhone ? (
                    <>
                        <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Enter phone number"/>
                        <button onClick={handleAddressUpdate} className="update-btn">Save</button>
                        <button onClick={() => setEditingPhone(false)} className="cancel-btn">Cancel</button>
                    </>
                ) : (
                    <>
                        {user.phone}
                        <button onClick={() => setEditingPhone(true)} className="edit-btn">Edit</button>
                    </>
                )}
            </p>

            {/* ✅ Editable Address Field */}
            <p>
                <b>Address:</b> {editingAddress ? (
                    <>
                        <input type="text" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="Enter address"/>
                        <button onClick={handleAddressUpdate} className="update-btn">Save</button>
                        <button onClick={() => setEditingAddress(false)} className="cancel-btn">Cancel</button>
                    </>
                ) : (
                    <>
                        {user.address}
                        <button onClick={() => setEditingAddress(true)} className="edit-btn">Edit</button>
                    </>
                )}
            </p>
        </div>
    );
};

export default Profile;
