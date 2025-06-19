import { useState } from "react";
import "../styles/AdminNavbar.css"; // ✅ Import styles

const AdminNavbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [notifications, setNotifications] = useState(["Order #42 requires approval", "Stock low on Product X"]); // ✅ Example notifications
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSearch = () => {
        alert(`🔍 Searching for: ${searchQuery}`); // ✅ Placeholder action
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        alert("🚪 Logged out successfully!");
        window.location.href = "/login"; // ✅ Redirect to login
    };

    return (
        <nav className="admin-navbar">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>🔍</button>
            </div>

            <div className="admin-actions">
                <div className="notifications">
                    🔔 {notifications.length}
                    <div className="dropdown">
                        {notifications.map((note, index) => (
                            <p key={index}>{note}</p>
                        ))}
                    </div>
                </div>

                <div className="profile-menu" onClick={() => setShowDropdown(!showDropdown)}>
                    👤 Admin
                    {showDropdown && (
                        <div className="dropdown">
                            <p>Settings</p>
                            <p>Profile</p>
                            <p onClick={handleLogout}>Logout</p>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
