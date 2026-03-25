import { Link } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar() {

    return (

        <div className="bg-dark text-white p-3 admin-sidebar">

            <h4 className="mb-3 text-center text-lg-start">
                Admin Panel
            </h4>

            <nav className="admin-nav">

                <Link
                    to="/admin/upload"
                    className="btn btn-outline-light admin-btn"
                >
                    Upload
                </Link>

                <Link
                    to="/admin/videos"
                    className="btn btn-outline-light admin-btn"
                >
                    Videos
                </Link>

                <Link
                    to="/admin/analytics"
                    className="btn btn-outline-light admin-btn"
                >
                    Analytics
                </Link>

            </nav>

        </div>

    );

}

export default AdminSidebar;