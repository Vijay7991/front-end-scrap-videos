import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getVideo, getVideos } from "../api/api";

import VideoCard from "../components/VideoCard";
import VideoPlayer from "../components/VideoPlayer";

import Skeleton from "@mui/material/Skeleton";

function Watch() {

  const shuffle = (arr) => {  
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const playNextVideo = () => {

    if (!videos || videos.length === 0) return;

    // pick first valid video that is NOT current
    const nextVideo = videos.find(v => v.slug !== slug);

    if (nextVideo?.slug) {
      console.log("➡ Loading next video:", nextVideo.slug);
      navigate(`/watch/${nextVideo.slug}`);
    }

  };

  const { slug } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);       // related videos
  const [allVideos, setAllVideos] = useState([]); // all videos

  useEffect(() => {

    setVideo(null);

    // 1️⃣ Load single video
    getVideo(slug)
      .then(res => {
        setVideo(res.data);
      })
      .catch(err => console.error(err));

    // 2️⃣ Load all videos once
    getVideos(1, 50)
      .then(res => {

        const data = res.data || [];

        // remove current video
        const filtered = data.filter(v => v.slug !== slug);

        // randomize for sidebar
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);

        setVideos(shuffled);     // sidebar videos
        setAllVideos(filtered);  // bottom videos

      })
      .catch(err => console.error(err));

  }, [slug]);

  const suggested = videos.slice(0, 6);

  return (

    <div className="container mt-4">

      <div className="row">

        {/* LEFT VIDEO */}

        <div className="col-lg-8">

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

              <h4 className="fw-bold">
                {video.title}
              </h4>

            ) : (

              <Skeleton width="70%" height={40} />

            )}

          </div>

        </div>


        {/* RIGHT SIDEBAR */}

        <div className="col-lg-4">

          <h5 className="fw-bold mb-3">
            Trending Posts
          </h5>

          {videos.length === 0 ? (

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
                onClick={() => navigate(`/watch/${v.slug}`)}
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

        <h5 className="fw-bold mb-3">
          More Videos
        </h5>

        <div className="row">

          {allVideos.length === 0 ? (

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

              shuffle(allVideos)
                .filter(v => v.slug !== slug)
                .slice(0, 16)
              .map(v => (

                <div
                  key={v._id}
                  className="col-6 col-md-4 col-lg-3 mb-4"
                >

                  <VideoCard video={v} />

                </div>

              ))

          )}

        </div>

      </div>

    </div>

  );

}

export default Watch;