import { useState, useRef } from "react";
import  API from "../api/api";
import { uploadToCloudinary } from "../helper/uploadToCloudinary";


function AdminUpload() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [video, setVideo] = useState(null);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState("");
    const [success, setSuccess] = useState("");
    const fileInputRef = useRef(null);

    const handleFile = (file) => {

        setVideo(file);
        setFileName(file.name);

        const videoTitle = file.name
            .replace(/\.[^/.]+$/, "")
            .replace(/[_-]/g, " ");

        if (!title) {
            setTitle(videoTitle);
        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!video) {
            alert("Please select a video");
            return;
        }

        try {

            setProgress(1);

            /* 1️⃣ Upload video to Cloudinary */

            const cloudinaryRes = await uploadToCloudinary(
                video,
                category,
                (percent) => setProgress(percent)
            );

            const videoUrl = cloudinaryRes.secure_url;
            const publicId = cloudinaryRes.public_id;
            const size = cloudinaryRes.bytes;
            const duration = cloudinaryRes.duration;

            /* Generate thumbnail */

            const thumbnail = videoUrl.replace(".mp4", ".jpg");

            /* 2️⃣ Save video metadata in backend */

            await API.post("/videos", {
                title,
                description,
                category,
                videoUrl,
                thumbnail,
                publicId,
                size,
                duration
            });

            setSuccess("Video uploaded successfully!");

            setTimeout(() => {
                setSuccess("");
            }, 3000);

            /* RESET FORM */

            setTitle("");
            setDescription("");
            setCategory("");
            setVideo(null);
            setFileName("");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            setTimeout(() => {
                setProgress(0);
            }, 500);

        } catch (err) {

            console.error("Cloudinary error:", err.response?.data);
            console.error(err);
            alert("Upload failed");

        }

    };

    return (

        <div className="card shadow p-4">

            <h4 className="mb-4">
                Upload Video
            </h4>

            {success && (
                <div className="alert alert-success alert-dismissible fade show">

                    {success}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSuccess("")}
                    ></button>

                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* TITLE */}

                <input
                    className="form-control mb-3"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* DESCRIPTION */}

                <textarea
                    className="form-control mb-3"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* CATEGORY */}

                <select
                    className="form-select mb-3"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >

                    <option value="">Select Category</option>
                    <option value="viral">Viral</option>
                    <option value="popular">Popular</option>
                    <option value="webseries">Web Series</option>
                    <option value="trending">Trending</option>

                </select>

                {/* FILE */}

                <div className="border border-dashed rounded p-4 text-center mb-3">

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFile(e.target.files[0])}
                    />

                    <p className="text-muted mt-2">
                        Drag & Drop video here
                    </p>

                </div>

                {/* FILE NAME */}

                {fileName && (

                    <div className="alert alert-info">

                        Selected Video: <b>{fileName}</b>

                    </div>

                )}

                {/* PROGRESS */}

                {progress > 0 && (

                    <div className="progress mb-3">

                        <div
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            style={{ width: `${progress}%` }}
                        >
                            {progress}%
                        </div>

                    </div>

                )}

                <button className="btn btn-primary w-100">

                    Upload Video

                </button>

            </form>

        </div>

    );

}

export default AdminUpload;