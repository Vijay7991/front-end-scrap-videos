import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

function AdminDashboard() {

    return (

        <div className="container-fluid">

            <div className="row">

                {/* Sidebar */}
                <div className="col-md-3 col-lg-2 p-0">
                    <AdminSidebar />
                </div>

                {/* Content */}
                <div className="col-md-9 col-lg-10 p-4 bg-light min-vh-100">
                    <Outlet />
                </div>

            </div>

        </div>

    );

}

export default AdminDashboard;