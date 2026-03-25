import { useEffect, useState } from "react";
import { fetchAdminVideos, deleteVideoById } from "../api/api";
import  "./AdminVideos.css";
function AdminVideos() {

    const [videos, setVideos] = useState([]);
    useEffect(() => {

        const loadVideos = async () => {

            try {

                const res = await fetchAdminVideos();
                setVideos(res.data.videos || []);

            } catch (err) {

                console.error("Failed to load videos", err);

            }

        };

        loadVideos();

    }, []);

    const deleteVideo = async (id) => {

        if (!window.confirm("Are you sure you want to delete this video?")) return;

        try {

            await deleteVideoById(id);

            setVideos(prev => prev.filter(v => v._id !== id));

        } catch (err) {

            console.error(err);
            alert("Failed to delete video");

        }

    }

    return (

        <div>

            <h4 className="mb-4">
                All Videos
            </h4>

            <div className="row">

                {videos.map(v => (

                    <div key={v._id} className="col-md-4 mb-4">

                        <div className="card shadow-sm">

                            <div className="admin-thumb">

                                <img
                                    src={`https://res.cloudinary.com/djrxcaxbc/video/upload/so_5/${v.publicId}.jpg`}
                                    alt=""
                                />

                                <img
                                    src={`https://res.cloudinary.com/djrxcaxbc/video/upload/so_8/${v.publicId}.jpg`}
                                    alt=""
                                />

                                <img
                                    src={`https://res.cloudinary.com/djrxcaxbc/video/upload/so_18/${v.publicId}.jpg`}
                                    alt=""
                                />

                            </div>

                            <div className="card-body p-2">

                                <h6
                                    style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden"
                                    }}
                                >
                                    {v.title}
                                </h6>

                                <div className="d-flex gap-2 m-2">

                                    <button className="btn btn-sm btn-primary">
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => deleteVideo(v._id)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    )

}

export default AdminVideos;