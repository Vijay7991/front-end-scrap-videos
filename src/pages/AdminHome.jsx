function AdminHome() {

    return (

        <div>

            <h3 className="mb-4">
                Dashboard Overview
            </h3>

            <div className="row">

                <div className="col-md-4 mb-3">
                    <div className="card shadow-sm p-3">
                        <h5>Total Videos</h5>
                        <h2>120</h2>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card shadow-sm p-3">
                        <h5>Total Views</h5>
                        <h2>45K</h2>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card shadow-sm p-3">
                        <h5>Categories</h5>
                        <h2>6</h2>
                    </div>
                </div>

            </div>

        </div>

    )

}

export default AdminHome;