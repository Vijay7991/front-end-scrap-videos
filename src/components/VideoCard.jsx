import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

import { getStats, formatCount } from "../helper/videoStats";
import "./VideoCard.css";

function VideoCard({ video }) {
  const navigate = useNavigate();

  /* read persistent stats for this slug */
  const stats = useMemo(() => getStats(video?.slug), [video?.slug]);

  const handleClick = () => {
    navigate(`/watch/${video.slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const thumb =
    video.thumbnail && !video.thumbnail.startsWith("data:image")
      ? video.thumbnail
      : "/savita.jpg";

  return (
    <div
      className="video-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
    >
      <div className="video-thumb">
        <img src={thumb} alt={video.title} loading="lazy" />

        {/* HD badge (top-left) */}
        <span className="vc-badge vc-badge-hd">HD</span>

        {/* duration badge (bottom-right) — optional, only if video.duration exists */}
        {video.duration && (
          <span className="vc-badge vc-badge-duration">{video.duration}</span>
        )}

        {/* hover play overlay */}
        <div className="vc-play-overlay">
          <PlayArrowRoundedIcon className="vc-play-icon" />
        </div>
      </div>

      <div className="video-card-body">
        <h6 className="video-card-title" title={video.title}>
          {video.title}
        </h6>

        <div className="video-card-meta">
          <span className="vc-meta-item">
            <VisibilityRoundedIcon className="vc-meta-icon" />
            {formatCount(stats.views)}
          </span>

          <span className="vc-meta-dot">•</span>

          <span className="vc-meta-item">
            <FavoriteRoundedIcon
              className="vc-meta-icon"
              style={{ color: stats.liked ? "var(--like-color)" : undefined }}
            />
            {formatCount(stats.likes)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
