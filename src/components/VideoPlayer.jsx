import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { CircularProgress } from "@mui/material";
import "./VideoPlayer.css";

function VideoPlayer({ src, poster, onErrorNext, onReady }) {

  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const onReadyRef = useRef(onReady);
  const onErrorNextRef = useRef(onErrorNext);

  useEffect(() => {
    onReadyRef.current = onReady;
    onErrorNextRef.current = onErrorNext;
  }, [onReady, onErrorNext]);

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

    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("error", handleError);

    // 🔥 init plyr AFTER setting src
    const player = new Plyr(video, {
      autoplay: true,
      muted: false,
      clickToPlay: false,   // ✅ IMPORTANT
      controls: [
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
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

      {!error && (
        <video
          ref={videoRef}
          poster={poster}
          playsInline
          webkit-playsinline="true"   // ✅ add this
          controls // 🔥 IMPORTANT
          className="player-video"
        />
      )}

    </div>

  );
}

export default VideoPlayer;