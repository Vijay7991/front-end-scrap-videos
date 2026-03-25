import { useEffect, useState } from "react";
import { getVideos } from "../api/api";
import { useNavigate } from "react-router-dom";
import { shuffleVideos } from "../helper/myFunction";
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

    <div className="card popular-card shadow-sm">

      {/* HEADER */}

      <div className="popular-header">

        <span className="fire">🔥</span>
        <h6>Popular This Month</h6>

      </div>

      <div className="row">

        {videos.map(video => {

          return (

            <div key={video._id} className="col-12 col-sm-6 mb-3">

              <div
                className="popular-video d-flex"
                onClick={() => navigate(`/watch/${video.slug}`)}
              >

                {/* thumbnail */}

                <div className="popular-thumb">

                  <img src={video.thumbnail} alt={video.title}
                    loading="lazy" />

                  <div className="play-overlay">▶</div>

                </div>

                {/* title */}

                <div className="popular-content">

                  <p className="popular-title">
                    {video.title}
                  </p>

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}

export default PopularCard;