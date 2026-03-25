import { useNavigate } from "react-router-dom";
import "./VideoCard.css";

function VideoCard({ video }) {

  const navigate = useNavigate();

  return (

    <div
      className="card video-card border-0"
      onClick={() => navigate(`/watch/${video.slug}`)}
    >

      <div className="video-thumb">

        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
        />

        <div className="play-overlay">▶</div>

      </div>

      <div className="p-2">

        <p
          className="mb-1"
          style={{
            fontSize: "14px",
            fontWeight: "600",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {video.title}
        </p>

        {/* views */}

        <p
          style={{
            fontSize: "12px",
            color: "#666",
            marginBottom: 0
          }}
        >
          👁 {video.views || 0} views
        </p>

      </div>

    </div>

  );

}

export default VideoCard;