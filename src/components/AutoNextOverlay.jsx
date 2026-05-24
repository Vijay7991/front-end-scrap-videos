import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import "./AutoNextOverlay.css";

/**
 * 5-second countdown overlay shown when a video ends.
 * Props:
 *   active        boolean       — when true, the overlay is visible
 *   nextVideo     object|null   — { slug, title, thumbnail }
 *   seconds       number        — countdown duration (default 5)
 *   onPlayNext    () => void
 *   onCancel      () => void
 */
function AutoNextOverlay({ active, nextVideo, seconds = 5, onPlayNext, onCancel }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (!active) {
      setRemaining(seconds);
      return;
    }

    setRemaining(seconds);

    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval);
          onPlayNext?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active, seconds, onPlayNext]);

  /* Esc cancels */
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
      if (e.key === "Enter")  onPlayNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onPlayNext, onCancel]);

  const pct = ((seconds - remaining) / seconds) * 100;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="auto-next-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="auto-next-card"
            initial={{ y: 18, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 18, scale: 0.96 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="an-label">UP NEXT IN {remaining}s</div>

            {nextVideo && (
              <div className="an-thumb">
                <img
                  src={
                    nextVideo.thumbnail &&
                    !nextVideo.thumbnail.startsWith("data:image")
                      ? nextVideo.thumbnail
                      : "/savita.jpg"
                  }
                  alt={nextVideo.title}
                />
                <div className="an-thumb-overlay">
                  <PlayArrowRoundedIcon className="an-play" />
                </div>
              </div>
            )}

            <div className="an-title">{nextVideo?.title || "Next video"}</div>

            <div className="an-progress">
              <div className="an-progress-bar" style={{ width: `${pct}%` }} />
            </div>

            <div className="an-actions">
              <button className="an-btn an-cancel" onClick={onCancel}>
                <CloseRoundedIcon style={{ fontSize: 16 }} /> Cancel
              </button>
              <button className="an-btn an-play-btn" onClick={onPlayNext}>
                <PlayArrowRoundedIcon style={{ fontSize: 18 }} /> Play now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AutoNextOverlay;
