import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getVideosBySource, getTrendingVideos } from "../api/api";
import VideoCard from "../components/VideoCard";
import Pagination from "../pages/Pagination";
import "./Category.css"; // ✅ keep same CSS
import AdBanner from "../components/exoclick/AdBanner"; // ✅ NEW

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

      <h3 className={`category-title ${category}`}>
        {category === "viral" && "🔥 "}
        {category === "webseries" && "🎬 "}
        {category === "trending" && "🚀 "}
        {category}
      </h3>
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
      <motion.div
        key={page} // 🔥 important for animation on pagination
        className="row"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >

        {loading ? (

          <div className="row">
            {Array.from({ length: 12 }).map((_, i) => (

              <div key={i} className="col-6 col-md-4 col-lg-3 mb-4">

                <div className="skeleton-card">
                  <div className="skeleton-thumb shimmer" />
                  <div className="skeleton-text shimmer" />
                  <div className="skeleton-text small shimmer" />
                </div>

              </div>

            ))}
          </div>

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

  );

}

export default Category;