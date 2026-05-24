import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

import { getStats, toggleLike, formatCount } from "../helper/videoStats";
import "./VideoMeta.css";

/**
 * Row of meta info under the video title:
 *   👁 views   ❤ like (animated)   ⤴ share / copy link
 */
function VideoMeta({ slug, title }) {
  const [stats, setStats] = useState({ views: 0, likes: 0, liked: false });
  const [copied, setCopied] = useState(false);
  const [burst, setBurst] = useState(false);

  /* Sync local stats from store whenever slug changes */
  useEffect(() => {
    if (!slug) return;
    setStats(getStats(slug));
  }, [slug]);

  const handleLike = () => {
    if (!slug) return;
    const next = toggleLike(slug);
    setStats(next);
    if (next.liked) {
      setBurst(true);
      window.setTimeout(() => setBurst(false), 650);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = { title: title || "Watch this video", url: shareUrl };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (e) {
        /* user cancelled — fall through to copy */
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      /* ignore */
    }
  };

  return (
    <div className="video-meta">
      <div className="vm-views">
        <VisibilityRoundedIcon className="vm-icon" />
        <span>{formatCount(stats.views)} views</span>
      </div>

      <div className="vm-actions">
        <button
          className={`vm-btn vm-like${stats.liked ? " liked" : ""}`}
          onClick={handleLike}
          aria-label={stats.liked ? "Unlike" : "Like"}
        >
          <span className="vm-like-icon-wrap">
            {stats.liked
              ? <FavoriteRoundedIcon className="vm-icon" />
              : <FavoriteBorderRoundedIcon className="vm-icon" />}

            <AnimatePresence>
              {burst && (
                <motion.span
                  className="vm-burst"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55 }}
                />
              )}
            </AnimatePresence>
          </span>
          <span className="vm-btn-label">{formatCount(stats.likes)}</span>
        </button>

        <button className="vm-btn vm-share" onClick={handleShare} aria-label="Share">
          {copied
            ? <ContentCopyRoundedIcon className="vm-icon" />
            : <IosShareRoundedIcon className="vm-icon" />}
          <span className="vm-btn-label">{copied ? "Copied!" : "Share"}</span>
        </button>
      </div>
    </div>
  );
}

export default VideoMeta;
