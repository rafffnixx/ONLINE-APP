import Sidebar from "./Sidebar"; 
import AdminNavbar from "./AdminNavbar"; 
import { Outlet } from "react-router-dom"; // ✅ Allows dynamic page rendering inside layout

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="main-content">
                <AdminNavbar />
                <Outlet /> {/* ✅ This will render different admin pages dynamically */}
            </div>
        </div>
    );
};

export default AdminLayout;
