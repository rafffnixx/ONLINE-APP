import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";
import "../styles/Profile.css";

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

                const response = await api.get(`/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

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
            const response = await api.put(`/api/users/update/${user.id}/image`, formData, {
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
            await api.put(`/api/users/update/${user.id}`, { address: newAddress, phone: newPhone }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("✅ Profile updated!");
            setUser({ ...user, address: newAddress, phone: newPhone });
            setEditingAddress(false);
            setEditingPhone(false);
        } catch (error) {
            alert("❌ Error updating profile.");
        }
    };

    if (loading) return <p>⏳ Loading profile...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="profile-container">
            <h2>👤 {user.name}'s Profile</h2>

            <img src={user.profile_picture || "/default-avatar.png"} alt="Profile" className="profile-image" />
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
            <button onClick={handleImageUpload} className="upload-btn">Upload Image</button>

            <p><b>Email:</b> {user.email}</p>

            <p>
                <b>Phone:</b>{" "}
                {editingPhone ? (
                    <>
                        <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
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

            <p>
                <b>Address:</b>{" "}
                {editingAddress ? (
                    <>
                        <input type="text" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
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
