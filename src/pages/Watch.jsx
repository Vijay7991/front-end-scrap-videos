import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

import { getVideo, getVideos } from "../api/api";

import VideoCard from "../components/VideoCard";
import VideoPlayer from "../components/VideoPlayer";

import Skeleton from "@mui/material/Skeleton";


function Watch() {

  const playerRef = useRef(null);
  
  const { slug } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [allVideos, setAllVideos] = useState([]);
  const [shuffledVideos, setShuffledVideos] = useState([]);

  const loadedIds = useRef(new Set()); // 🔥 prevent duplicates

  /* =========================
     SHUFFLE FUNCTION
  ========================= */
  const shuffle = (arr) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  /* =========================
     PLAY NEXT VIDEO
  ========================= */
  const playNextVideo = () => {

    if (!shuffledVideos.length) return;

    const nextVideo = shuffledVideos.find(v => v.slug !== slug);

    if (nextVideo?.slug) {
      navigate(`/watch/${nextVideo.slug}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

  };

  /* =========================
     LOAD MORE (CORE)
  ========================= */
  const loadMore = async (pageNum) => {

    if (!hasNext || loadingMore) return;

    setLoadingMore(true);

    try {

      const res = await getVideos(pageNum, 20);

      const newData = res.data.data || [];

      // ❌ remove current video + duplicates
      const filtered = newData.filter(v =>
        v.slug !== slug && !loadedIds.current.has(v._id)
      );

      // mark as loaded
      filtered.forEach(v => loadedIds.current.add(v._id));

      // append
      setAllVideos(prev => [...prev, ...filtered]);

      // shuffle only new batch
      const shuffledBatch = shuffle(filtered);

      setShuffledVideos(prev => [...prev, ...shuffledBatch]);

      setHasNext(res.data.hasNext);
      setPage(pageNum);

    } catch (err) {
      console.error(err);
    }

    setLoadingMore(false);
  };

  /* =========================
     LOAD VIDEO + RESET
  ========================= */
  useEffect(() => {

    setVideo(null);
    setAllVideos([]);
    setShuffledVideos([]);
    setPage(1);
    setHasNext(true);
    loadedIds.current.clear();

    getVideo(slug)
      .then(res => setVideo(res.data))
      .catch(console.error);

    loadMore(1);

  }, [slug]);

  /* =========================
     INFINITE SCROLL
  ========================= */
  useEffect(() => {

    const handleScroll = () => {

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        loadMore(page + 1);
      }

    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  }, [page, hasNext, loadingMore]);

  /* =========================
     SIDEBAR VIDEOS
  ========================= */
  const suggested = shuffledVideos.slice(0, 6);

  return (
    

    <div className="container mt-4">

      <div className="row">
        {/* LEFT VIDEO */}
        <div ref={playerRef} className="col-lg-8">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            {video ? (

              <VideoPlayer
                key={video.slug}
                src={video.playerUrl}
                poster={video.thumbnail}
                onErrorNext={playNextVideo}
                onReady={() => {
                  setTimeout(() => {

                    const yOffset = -80; // 🔥 adjust: -60 / -70 / -100 try karo

                    const y =
                      playerRef.current.getBoundingClientRect().top +
                      window.pageYOffset +
                      yOffset;

                    window.scrollTo({
                      top: y,
                      behavior: "smooth"
                    });

                  }, 50);
                }}
              />

            ) : (

              <Skeleton
                variant="rectangular"
                height={450}
                sx={{ borderRadius: 2 }}
              />

            )}

          </motion.div>

          <div className="mt-3">

            {video ? (
              <h4 className="fw-bold">{video.title}</h4>
            ) : (
              <Skeleton width="70%" height={40} />
            )}

          </div>

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
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
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

          {shuffledVideos.length === 0 ? (

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

            shuffledVideos.map(v => (

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

        {/* LOADER */}
        {loadingMore && (
          <p className="text-center mt-3">Loading more...</p>
        )}

      </div>

    </div>

  );

}

export default Watch;