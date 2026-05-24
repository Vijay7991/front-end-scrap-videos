import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

import { getVideo, getVideos } from "../api/api";
import { registerView } from "../helper/videoStats";

import VideoCard from "../components/VideoCard";
import VideoPlayer from "../components/VideoPlayer";
import VideoMeta from "../components/VideoMeta";
import AutoNextOverlay from "../components/AutoNextOverlay";
import Pagination from "../pages/Pagination";
import AdBanner from "../components/exoclick/AdBanner";
import Skeleton from "@mui/material/Skeleton";

function Watch() {
  const playerRef = useRef(null);
  const playerColRef = useRef(null);
  const moreVideosRef = useRef(null);

  const { slug } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);

  /* pagination */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  /* auto-next overlay */
  const [autoNextOn, setAutoNextOn] = useState(false);

  /* The "next" candidate, computed from the sidebar list */
  const nextVideo = useMemo(() => {
    return videos.find((v) => v.slug !== slug) || null;
  }, [videos, slug]);

  /* =========================
     PLAY NEXT VIDEO
     ========================= */
  const playNextVideo = useCallback(() => {
    setAutoNextOn(false);
    if (!nextVideo?.slug) return;
    navigate(`/watch/${nextVideo.slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate, nextVideo]);

  /* =========================
     LOAD SINGLE VIDEO
     ========================= */
  useEffect(() => {
    setVideo(null);
    setAutoNextOn(false);

    getVideo(slug)
      .then((res) => {
        setVideo(res.data);
        // count this watch toward the views
        if (res.data?.slug) registerView(res.data.slug);
      })
      .catch(console.error);
  }, [slug]);

  /* =========================
     LOAD PAGINATED VIDEOS
     ========================= */
  useEffect(() => {
    setLoading(true);

    getVideos(page, 20)
      .then((res) => {
        const data = res.data.data || [];
        const filtered = data.filter((v) => v.slug !== slug);
        setVideos(filtered);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, slug]);

  /* =========================
     HANDLE READY → smooth scroll
     ========================= */
  const handleReady = useCallback(() => {
    setTimeout(() => {
      if (!playerColRef.current) return;
      const yOffset = -80;
      const y =
        playerColRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, 50);
  }, []);

  /* =========================
     ON ENDED → trigger countdown
     ========================= */
  const handleEnded = useCallback(() => {
    if (nextVideo?.slug) {
      setAutoNextOn(true);
    }
  }, [nextVideo]);

  /* =========================
     PAGINATION HANDLER
     - Keep the video playing
     - Smoothly scroll to the "More Videos" section
     ========================= */
  const handlePageChange = (p) => {
    setPage(p);

    // wait a tick so the new skeletons render in place,
    // then scroll the "More Videos" heading into view
    setTimeout(() => {
      if (!moreVideosRef.current) return;
      const yOffset = -70; // leave room for sticky header
      const y =
        moreVideosRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, 30);
  };

  /* SIDEBAR */
  const suggested = videos.slice(0, 6);

  return (
    <div className="container mt-4">
      <div className="row">
        {/* LEFT — PLAYER */}
        <div ref={playerColRef} className="col-lg-8" key={video?.slug}>
          <div ref={playerRef} style={{ position: "relative" }}>
            {video ? (
              <VideoPlayer
                key={video?.playerUrl}
                src={video.playerUrl}
                poster={video.thumbnail}
                onErrorNext={playNextVideo}
                onEnded={handleEnded}
                onReady={handleReady}
              />
            ) : (
              <Skeleton
                variant="rectangular"
                height={450}
                sx={{ borderRadius: 2, bgcolor: "var(--skeleton-base)" }}
              />
            )}

            <AutoNextOverlay
              active={autoNextOn}
              nextVideo={nextVideo}
              seconds={5}
              onPlayNext={playNextVideo}
              onCancel={() => setAutoNextOn(false)}
            />
          </div>

          <motion.div
            className="mt-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {video ? (
              <>
                <h4
                  className="fw-bold"
                  style={{ color: "var(--text-primary)", marginBottom: 4 }}
                >
                  {video.title}
                </h4>
                <VideoMeta slug={video.slug} title={video.title} />
              </>
            ) : (
              <Skeleton
                width="70%"
                height={40}
                sx={{ bgcolor: "var(--skeleton-base)" }}
              />
            )}
          </motion.div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-lg-4">
          <h5
            className="fw-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Trending Posts
          </h5>

          {suggested.length === 0
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="d-flex mb-3">
                  <Skeleton
                    variant="rectangular"
                    width={120}
                    height={70}
                    sx={{ borderRadius: 2, bgcolor: "var(--skeleton-base)" }}
                  />
                  <div className="ms-3" style={{ flex: 1 }}>
                    <Skeleton width="90%" sx={{ bgcolor: "var(--skeleton-base)" }} />
                    <Skeleton width="60%" sx={{ bgcolor: "var(--skeleton-base)" }} />
                  </div>
                </div>
              ))
            : suggested.map((v, index) => (
                <motion.div
                  key={v._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className="card mb-3 p-2 suggested-card"
                  onClick={() => {
                    navigate(`/watch/${v.slug}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{
                    cursor: "pointer",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    borderRadius: 12,
                  }}
                >
                  <div className="d-flex">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      loading="lazy"
                      style={{
                        width: "120px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <div
                      className="ms-3 small fw-semibold"
                      style={{ lineHeight: 1.35 }}
                    >
                      {v.title}
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>

      {/* DESKTOP BANNER */}
      <div className="desktop-only">
        <AdBanner
          className="eas6a97888e2"
          zoneId="5896814"
          height="90px"
        />
      </div>

      {/* MOBILE BANNER */}
      <div className="mobile-only">
        <AdBanner
          className="eas6a97888e10"
          zoneId="5896824"
          height="50px"
        />
      </div>

      {/* MORE VIDEOS */}
      <div className="mt-5" ref={moreVideosRef}>
        <h5 className="fw-bold mb-3" style={{ color: "var(--text-primary)" }}>
          More Videos
        </h5>

        <div className="row">
          {loading
            ? [...Array(8)].map((_, i) => (
                <div key={i} className="col-6 col-md-4 col-lg-3 mb-4">
                  <Skeleton
                    variant="rectangular"
                    height={180}
                    sx={{ borderRadius: 2, bgcolor: "var(--skeleton-base)" }}
                  />
                  <Skeleton width="80%" sx={{ bgcolor: "var(--skeleton-base)" }} />
                </div>
              ))
            : videos.map((v) => (
                <div key={v._id} className="col-6 col-md-4 col-lg-3 mb-4">
                  <VideoCard video={v} />
                </div>
              ))}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* DESKTOP BANNER */}
        <div className="desktop-only">
          <AdBanner
            className="eas6a97888e2"
            zoneId="5896814"
            height="90px"
          />
        </div>

        {/* MOBILE BANNER */}
        <div className="mobile-only">
          <AdBanner
            className="eas6a97888e10"
            zoneId="5896824"
            height="50px"
          />
        </div>
      </div>
    </div>
  );
}

export default Watch;
