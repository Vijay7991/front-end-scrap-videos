import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getVideosBySource, getTrendingVideos } from "../api/api";
import VideoCard from "../components/VideoCard";
import Pagination from "../pages/Pagination";
import Skeleton from "@mui/material/Skeleton";


// category → source mapping
const sourceMap = {
  webseries: "ulluhd",
  viral: "hotwebhd"
};


function Category() {

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const shuffle = (arr) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const { category } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    setLoading(true);

    if (sourceMap[category]) {

      getVideosBySource(sourceMap[category], page, 20)
        .then(res => {

          console.log("API RESPONSE:", res.data); // 🔥 ADD THIS

          setVideos(res.data.data || []);
          setTotalPages(res.data.totalPages || 1);
          setLoading(false);

        });

    }

    else if (category === "trending") {

      getTrendingVideos(page, 20)
        .then(res => {

          const data = res.data.data || [];
          setVideos(shuffle(data));
          setTotalPages(res.data.totalPages || 1);
          setLoading(false);

        })
        .catch(console.error);

    }

  }, [category, page]);

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
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

    </div>

  );

}

export default Category;