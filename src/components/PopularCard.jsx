import { useEffect, useState } from "react";
import { getVideos } from "../api/api";
import { useNavigate } from "react-router-dom";
import { shuffleVideos } from "../helper/myFunction";
import { motion } from "framer-motion";
import "./PopularCard.css";

function PopularCard() {

  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    getVideos()
      .then(res => {

        const shuffled = shuffleVideos(res.data || []);
        setVideos(shuffled.slice(0, 30));

      })
      .catch(err => console.error(err));

  }, []);

  return (

    <div className="popular-wrapper">

      <h5 className="fw-bold mb-3">
        🔥 Popular This Month
      </h5>

      {videos.map((video, index) => (

        <motion.div
          key={video._id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="card mb-3 p-2 popular-item"
          onClick={() => navigate(`/watch/${video.slug}`)}
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

      ))}

    </div>

  );

}

export default PopularCard;