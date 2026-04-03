import { useEffect, useState } from "react";
import { getVideos } from "../api/api";

import VideoCard from "../components/VideoCard";
import PopularCard from "../components/PopularCard";
import AdBanner from "../components/AdBanner";
import ContactCard from "../components/ContactCard";
import Pagination from "../pages/Pagination"; // 🔥 ADD
import "./Home.css"; // ✅ keep same CSS
import { motion } from "framer-motion";

function Home() {

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const LIMIT = 40;

  useEffect(() => {

    setLoading(true);

    getVideos(page, LIMIT)
      .then(res => {

        setVideos(res.data.data || []);
        setTotalPages(res.data.totalPages || 1); // ✅ IMPORTANT

        setLoading(false);

        // 🔥 scroll top on page change
        window.scrollTo({ top: 0, behavior: "smooth" });

      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

  }, [page]);

  return (

    <div className="container mt-4">

      <h2 className="fancy-title">Latest Videos</h2>

      <AdBanner />

      <div className="row">

        {/* LEFT GRID */}
        <div className="col-12 col-lg-8">

          {loading ? (

            <div className="row">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="col-6 col-md-4 mb-4">

                  <div className="skeleton-card">
                    <div className="skeleton-thumb shimmer" />
                    <div className="skeleton-text shimmer" />
                    <div className="skeleton-text small shimmer" />
                  </div>

                </div>
              ))}
            </div>

          ) : (

              <motion.div
                key={page}
                className="row"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >

              {videos.map((video, index) => (

                <div key={video._id} className="col-6 col-md-4 mb-4">

                  <VideoCard video={video} />

                  {(index + 1) % 6 === 0 && (
                    <div className="col-12 mt-2">
                      <AdBanner />
                    </div>
                  )}

                </div>

              ))}

            </motion.div>

          )}

          {/* 🔥 NEW PAGINATION UI */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-12 col-lg-4">

          <AdBanner />

          <div className="mt-0">
            <PopularCard />
          </div>

          <div className="mt-3">
            <ContactCard />
          </div>

        </div>

      </div>

    </div>

  );

}

export default Home;