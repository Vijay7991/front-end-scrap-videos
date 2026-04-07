import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

import { getVideo, getVideos } from "../api/api";

import VideoCard from "../components/VideoCard";
import VideoPlayer from "../components/VideoPlayer";
import Pagination from "../pages/Pagination";

import Skeleton from "@mui/material/Skeleton";

function Watch() {

    const playerRef = useRef(null);

    const { slug } = useParams();
    const navigate = useNavigate();

    const [video, setVideo] = useState(null);

    // ✅ pagination states
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    /* =========================
       PLAY NEXT VIDEO
    ========================= */
    const playNextVideo = () => {

        if (!videos.length) return;

        const nextVideo = videos.find(v => v.slug !== slug);

        if (nextVideo?.slug) {
            navigate(`/watch/${nextVideo.slug}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    /* =========================
       LOAD SINGLE VIDEO
    ========================= */
    useEffect(() => {

        setVideo(null);

        getVideo(slug)
            .then(res => setVideo(res.data))
            .catch(console.error);

    }, [slug]);

    /* =========================
       LOAD PAGINATED VIDEOS
    ========================= */
    useEffect(() => {

        setLoading(true);

        getVideos(page, 20)
            .then(res => {

                const data = res.data.data || [];

                // current video remove
                const filtered = data.filter(v => v.slug !== slug);

                setVideos(filtered);
                setTotalPages(res.data.totalPages || 1);

            })
            .catch(console.error)
            .finally(() => setLoading(false));

    }, [page, slug]);

    /* =========================
       HANDLE READY
    ========================= */
    const handleReady = useCallback(() => {

        setTimeout(() => {

            const yOffset = -80;

            const y =
                playerRef.current.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset;

            window.scrollTo({
                top: y,
                behavior: "smooth"
            });

        }, 50);

    }, []);

    /* =========================
       PAGINATION HANDLER
    ========================= */
    const handlePageChange = (p) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* =========================
       SIDEBAR VIDEOS
    ========================= */
    const suggested = videos.slice(0, 6);

    return (

        <div className="container mt-4">

            <div className="row">

                {/* LEFT VIDEO */}
                {/* LEFT VIDEO */}
                <div ref={playerRef} className="col-lg-8" key={video?.slug}>

                    {video ? (

                        <VideoPlayer
                            key={video?.playerUrl}
                            src={video.playerUrl}
                            poster={video.thumbnail}
                            onErrorNext={playNextVideo}
                            onEnded={playNextVideo}     // ✅ ADDED: Triggers your function when video ends
                            onReady={handleReady}
                        />

                    ) : (

                        <Skeleton
                            variant="rectangular"
                            height={450}
                            sx={{ borderRadius: 2 }}
                        />

                    )}


                    <motion.div
                        className="mt-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {video ? (
                            <h4 className="fw-bold">{video.title}</h4>
                        ) : (
                            <Skeleton width="70%" height={40} />
                        )}
                    </motion.div>

                </div>

                {/* RIGHT SIDEBAR */}
                <div className="col-lg-4">

                    <h5 className="fw-bold mb-3">Trending Posts</h5>

                    {suggested.length === 0 ? (

                        [...Array(6)].map((_, i) => (

                            <div key={i} className="d-flex mb-3">

                                <Skeleton
                                    variant="rectangular"
                                    width={120}
                                    height={70}
                                    sx={{ borderRadius: 2 }}
                                />

                                <div className="ms-3" style={{ flex: 1 }}>
                                    <Skeleton width="90%" />
                                    <Skeleton width="60%" />
                                </div>

                            </div>

                        ))

                    ) : (

                        suggested.map((v, index) => (

                            <motion.div
                                key={v._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                                className="card mb-3 p-2 suggested-card"
                                onClick={() => {
                                    navigate(`/watch/${v.slug}`);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                style={{ cursor: "pointer" }}
                            >

                                <div className="d-flex">

                                    <img
                                        src={v.thumbnail}
                                        alt={v.title}
                                        style={{
                                            width: "120px",
                                            height: "70px",
                                            objectFit: "cover",
                                            borderRadius: "8px"
                                        }}
                                    />

                                    <div className="ms-3 small fw-semibold">
                                        {v.title}
                                    </div>

                                </div>

                            </motion.div>

                        ))

                    )}

                </div>

            </div>

            {/* MORE VIDEOS */}
            <div className="mt-5">

                <h5 className="fw-bold mb-3">More Videos</h5>

                <div className="row">

                    {loading ? (

                        [...Array(8)].map((_, i) => (

                            <div key={i} className="col-6 col-md-4 col-lg-3 mb-4">

                                <Skeleton
                                    variant="rectangular"
                                    height={180}
                                    sx={{ borderRadius: 2 }}
                                />

                                <Skeleton width="80%" />

                            </div>

                        ))

                    ) : (

                        videos.map(v => (

                            <div
                                key={v._id}
                                className="col-6 col-md-4 col-lg-3 mb-4"
                                onClick={() => {
                                    navigate(`/watch/${v.slug}`);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                style={{ cursor: "pointer" }}
                            >

                                <VideoCard video={v} />

                            </div>

                        ))

                    )}

                </div>

                {/* ✅ PAGINATION (NEW) */}
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />

            </div>

        </div>

    );
}

export default Watch;