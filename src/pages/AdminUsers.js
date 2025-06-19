import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root"); // ✅ Accessibility compliance

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        refreshUserList(); // ✅ Load users on page load
    }, []);

    const refreshUserList = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ Admin login required!");
            return;
        }

        try {
            const response = await axios.get("http://localhost:5000/api/users/all", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUsers(response.data);
            setErrorMessage(null);
        } catch (error) {
            console.error("❌ Error fetching users:", error);
            setErrorMessage("❌ Failed to fetch users. Please check backend setup.");
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedUser(null);
        setModalOpen(false);
    };

    const saveUserDetails = async () => {
        if (!selectedUser) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ Admin login required!");
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/users/update/${selectedUser.id}`, 
                { name: selectedUser.name, email: selectedUser.email, role: selectedUser.role },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("✅ User details updated successfully!");
            closeEditModal();
            refreshUserList();
        } catch (error) {
            console.error("❌ Error updating user details:", error);
            alert("❌ Failed to update user details.");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2 style={{ color: "#333" }}>👤 Admin User Management</h2>
            {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
            {users.length === 0 ? <p style={{ color: "gray" }}>❌ No users found.</p> : (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                    <thead>
                        <tr>
                            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>User ID</th>
                            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Name</th>
                            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Email</th>
                            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Role</th>
                            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ textAlign: "center" }}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select 
                                        value={user.role} 
                                        onChange={(e) => setSelectedUser({ ...user, role: e.target.value })} 
                                        style={{ padding: "5px", borderRadius: "5px" }}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => openEditModal(user)} 
                                        style={{ backgroundColor: "blue", color: "white", padding: "6px 12px", border: "none", cursor: "pointer", borderRadius: "5px", marginRight: "5px" }}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button 
                                        style={{ backgroundColor: "red", color: "white", padding: "6px 12px", border: "none", cursor: "pointer", borderRadius: "5px" }}
                                    >
                                        ❌ Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {modalOpen && selectedUser && (
                <Modal isOpen={modalOpen} onRequestClose={closeEditModal} style={{ content: { maxWidth: "400px", margin: "auto", padding: "20px", borderRadius: "8px" } }}>
                    <h2>Edit User</h2>
                    <label>Name:</label>
                    <input 
                        type="text" 
                        value={selectedUser.name} 
                        onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} 
                        style={{ width: "100%", padding: "8px", margin: "5px 0" }}
                    />
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={selectedUser.email} 
                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} 
                        style={{ width: "100%", padding: "8px", margin: "5px 0" }}
                    />
                    <label>Role:</label>
                    <select 
                        value={selectedUser.role} 
                        onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                        style={{ width: "100%", padding: "8px", margin: "5px 0" }}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button 
                        onClick={saveUserDetails} 
                        style={{ backgroundColor: "green", color: "white", padding: "8px", marginTop: "10px", borderRadius: "5px", cursor: "pointer" }}
                    >
                        ✅ Save
                    </button>
                    <button 
                        onClick={closeEditModal} 
                        style={{ backgroundColor: "gray", color: "white", padding: "8px", marginTop: "10px", marginLeft: "5px", borderRadius: "5px", cursor: "pointer" }}
                    >
                        ❌ Cancel
                    </button>
                </Modal>
            )}
        </div>
    );
};

export default AdminUsers;
