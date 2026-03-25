import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getVideosBySource, getTrendingVideos } from "../api/api";
import VideoCard from "../components/VideoCard";

import Skeleton from "@mui/material/Skeleton";

function Category() {

  const shuffle = (arr) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const { category } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // category → source mapping
  const sourceMap = {
    webseries: "ulluhd",
    viral: "hotwebhd"
  };

  useEffect(() => {

    setLoading(true);

    // if category uses source
    if (sourceMap[category]) {

      getVideosBySource(sourceMap[category])
        .then(res => {
          setVideos(res.data || []);
          setLoading(false);
        })
        .catch(err => console.error(err));

    }

    // trending = latest videos
    else if (category === "trending") {

      getTrendingVideos(20, 0)
        .then(res => {

          const data = res.data || [];
          setVideos(shuffle(data));
          setLoading(false);

        })
        .catch(err => console.error(err));

    }

  }, [category]);

  return (

    <div className="container mt-4">

      <h3 className="mb-4 text-capitalize">
        {category}
      </h3>

      <motion.div
        className="row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >

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

          videos.map(video => (

            <motion.div
              key={video._id}
              className="col-6 col-md-4 col-lg-3 mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >

              <VideoCard video={video} />

            </motion.div>

          ))

        )}

      </motion.div>

    </div>

  );

}

export default Category;