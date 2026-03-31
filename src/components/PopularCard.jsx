import { useEffect, useState, useRef } from "react";
import { getPopularMixed } from "../api/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./PopularCard.css"; // ✅ keep same CSS

function PopularCard() {

  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  const hasFetched = useRef(false); // 🔥 prevent multiple calls

  useEffect(() => {

    if (hasFetched.current) return;
    hasFetched.current = true;

    getPopularMixed()
      .then(res => {
        setVideos(res.data || []);
      })
      .catch(err => console.error(err));

  }, []);

  return (

    <div className="popular-wrapper">

      <h5 className="fw-bold mb-3">
        🔥 Popular This Month
      </h5>

      {videos.length === 0 ? (

        Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card mb-3 p-2 popular-item">

            <div className="d-flex">
              <div className="popular-thumb skeleton shimmer" />
              <div className="ms-3 w-100">
                <div className="skeleton-text shimmer mb-2" />
                <div className="skeleton-text small shimmer" />
              </div>
            </div>

          </div>
        ))

      ) : (

        videos.map((video, index) => (

          <motion.div
            key={video._id}
            initial={{ opacity: 0, x: 40 }}   // 🔥 slide from right
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: "easeOut"
            }}
            className="card mb-3 p-2 popular-item"
            onClick={() => {
              navigate(`/watch/${video.slug}`);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{ cursor: "pointer" }}
          >

            <div className="d-flex">

              <img
                src={video.thumbnail}
                alt={video.title}
                className="popular-thumb"
                loading="lazy"
              />

              <div className="ms-3 popular-title">
                {video.title}
              </div>

            </div>

          </motion.div>

        ))

      )}

    </div>

  );

}

export default PopularCard;