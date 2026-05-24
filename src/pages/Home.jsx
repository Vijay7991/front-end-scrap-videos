import { useEffect, useRef, useState } from "react";
import { getVideos } from "../api/api";

import VideoCard from "../components/VideoCard";
import PopularCard from "../components/PopularCard";
import ContactCard from "../components/ContactCard";
import Pagination from "../pages/Pagination"; // 🔥 ADD
import "./Home.css"; // ✅ keep same CSS
import { motion } from "framer-motion";
import AdBanner from "../components/exoclick/AdBanner"; // ✅ NEW


function Home() {

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* When pagination is clicked we set this flag; after the new
     batch loads we smoothly scroll the grid into view (instead of
     jumping to the top of the page on first render). */
  const [shouldScroll, setShouldScroll] = useState(false);
  const gridRef = useRef(null);

  const LIMIT = 40;

  useEffect(() => {

    setLoading(true);

    getVideos(page, LIMIT)
      .then(res => {

        setVideos(res.data.data || []);
        setTotalPages(res.data.totalPages || 1); // ✅ IMPORTANT

        setLoading(false);

        if (shouldScroll) {
          // wait one paint so the new grid is in the DOM
          setTimeout(() => {
            if (!gridRef.current) return;
            const yOffset = -70; // sticky header
            const y =
              gridRef.current.getBoundingClientRect().top +
              window.pageYOffset +
              yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }, 30);
          setShouldScroll(false);
        }

      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (p) => {
    setShouldScroll(true);
    setPage(p);
  };

  return (


    <div className="container mt-4">
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

      <h2 className="fancy-title">Latest Videos</h2>



      <div className="row" ref={gridRef}>

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

        {/* RIGHT SIDEBAR */}
        <div className="col-12 col-lg-4">
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