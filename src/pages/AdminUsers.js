import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import Modal from "react-modal";

Modal.setAppElement("#root");

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        refreshUserList();
    }, []);

    const refreshUserList = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("❌ Admin login required!");
            return;
        }

        try {
            const response = await api.get("/api/users/all", {
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
            await api.put(`/api/users/update/${selectedUser.id}`,
                {
                    name: selectedUser.name,
                    email: selectedUser.email,
                    role: selectedUser.role,
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
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
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) =>
                                            setSelectedUser({ ...user, role: e.target.value })
                                        }
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => openEditModal(user)}>✏️ Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {modalOpen && selectedUser && (
                <Modal isOpen={modalOpen} onRequestClose={closeEditModal}>
                    <h2>Edit User</h2>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={selectedUser.name}
                        onChange={(e) =>
                            setSelectedUser({ ...selectedUser, name: e.target.value })
                        }
                    />
                    <label>Email:</label>
                    <input
                        type="email"
                        value={selectedUser.email}
                        onChange={(e) =>
                            setSelectedUser({ ...selectedUser, email: e.target.value })
                        }
                    />
                    <label>Role:</label>
                    <select
                        value={selectedUser.role}
                        onChange={(e) =>
                            setSelectedUser({ ...selectedUser, role: e.target.value })
                        }
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button onClick={saveUserDetails}>✅ Save</button>
                    <button onClick={closeEditModal}>❌ Cancel</button>
                </Modal>
            )}
        </div>
    );
};

export default AdminUsers;
