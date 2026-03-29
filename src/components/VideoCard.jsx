import { useNavigate } from "react-router-dom";

function VideoCard({ video }) {

  const navigate = useNavigate();

  return (

    <div
      className="video-card"
      style={{ cursor: "pointer" }}
      onClick={() => {
        navigate(`/watch/${video.slug}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <div className="video-thumb">
      <img
        src={video.thumbnail}
        alt={video.title}
        style={{
          width: "100%",
          height: "180px",
          objectFit: "cover",
          borderRadius: "10px"
        }}
      />
      </div>
      <div className="mt-2 fw-semibold small">
        {video.title}
      </div>

    </div>

  );

}

export default VideoCard;