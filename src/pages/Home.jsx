import { useEffect, useState } from "react";
import { getVideos } from "../api/api";

import VideoCard from "../components/VideoCard";
import PopularCard from "../components/PopularCard";
// import SearchBox from "../components/SearchBox";
import AdBanner from "../components/AdBanner";
import ContactCard from "../components/ContactCard";

import { motion } from "framer-motion";

function Home() {

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const LIMIT = 40;

  useEffect(() => {

    setLoading(true);

    getVideos(page, LIMIT)
      .then(res => {

        setVideos(res.data || []);
        setLoading(false);

      })
      .catch(err => console.error(err));

  }, [page]);

  return (

    <div className="container mt-4">

      <h2 className="mb-4">Latest Videos</h2>

      <AdBanner />

      <div className="row">

        {/* LEFT GRID */}

        <div className="col-12 col-lg-8">

          {loading ? (

            <p>Loading...</p>

          ) : (

            <motion.div
              key={page}
              className="row"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >

              {videos.map((video, index) => (

                <>
                  <motion.div
                    key={video._id}
                    className="col-6 col-md-4 mb-4"
                  >
                    <VideoCard video={video} />
                  </motion.div>

                  {(index + 1) % 6 === 0 && (
                    <div className="col-12">
                      <AdBanner />
                    </div>
                  )}

                </>

              ))}

            </motion.div>

          )}

          {/* PAGINATION */}

          <div className="d-flex justify-content-center gap-3 mt-4">

            {page > 1 && (

              <button
                className="btn btn-secondary"
                onClick={() => setPage(page - 1)}
              >
                ← Previous
              </button>

            )}

            {videos.length === LIMIT && (

              <button
                className="btn btn-primary"
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>

            )}

          </div>

        </div>

        {/* RIGHT SIDEBAR */}

        <div className="col-12 col-lg-4">

          {/* <SearchBox /> */}

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