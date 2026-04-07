import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { CircularProgress } from "@mui/material";
import "./VideoPlayer.css";

// ✅ ADDED: onEnded prop
function VideoPlayer({ src, poster, onErrorNext, onReady, onEnded }) {

  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const onReadyRef = useRef(onReady);
  const onErrorNextRef = useRef(onErrorNext);
  const onEndedRef = useRef(onEnded); // ✅ ADDED: Ref for the onEnded callback

  useEffect(() => {
    onReadyRef.current = onReady;
    onErrorNextRef.current = onErrorNext;
    onEndedRef.current = onEnded; // ✅ ADDED: Keep ref updated
  }, [onReady, onErrorNext, onEnded]);

  useEffect(() => {

    const video = videoRef.current;
    if (!video || !src) return;

    setLoading(true);
    setError(false);

    // 🔥 destroy old player safely
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) { }
      playerRef.current = null;
    }

    // 🔥 set source manually (IMPORTANT)
    video.src = src;
    video.load();

    const handleLoaded = () => {
      setLoading(false);
      onReadyRef.current?.();
    };

    const handleError = () => {
      setLoading(false);
      setError(true);

      setTimeout(() => {
        onErrorNextRef.current?.();
      }, 1000);
    };

    // ✅ ADDED: Handler for when the video naturally finishes playing
    const handleEnded = () => {
      onEndedRef.current?.();
    };

    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("error", handleError);
    video.addEventListener("ended", handleEnded); // ✅ ADDED: Attach event listener

    // 🔥 init plyr AFTER setting src
    const player = new Plyr(video, {
      autoplay: true,
      muted: true,
      clickToPlay: true,   // ✅ IMPORTANT
      controls: [
        "play",
        "progress",        // ✅ keep timeline
        "current-time",    // optional (can remove if needed)
        "mute",            // ✅ only mute button
        "fullscreen"
      ],
      playsinline: true,   // ✅ IMPORTANT for mobile
    });

    playerRef.current = player;

    // fallback
    const timeout = setTimeout(() => {
      if (video.readyState === 0) handleError();
    }, 5000);

    return () => {
      clearTimeout(timeout);

      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("error", handleError);
      video.removeEventListener("ended", handleEnded); // ✅ ADDED: Cleanup listener

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) { }
        playerRef.current = null;
      }
    };

  }, [src]);

  return (

    <div className="player-wrapper">

      {loading && !error && (
        <div className="player-loader">
          <CircularProgress />
        </div>
      )}

      {error && (
        <div className="player-error">
          ⚠ Video removed. Loading next...
        </div>
      )}

      {/* Display toggle to prevent React DOM unmount crashes */}
      <div style={{ display: error ? "none" : "block", width: "100%", height: "100%" }}>
        <video
          ref={videoRef}
          poster={poster}
          playsInline
          webkit-playsinline="true"
          controls
          className="player-video"
        />
      </div>

    </div>

  );
}

export default VideoPlayer;