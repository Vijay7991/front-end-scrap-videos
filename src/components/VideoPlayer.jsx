import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { CircularProgress } from "@mui/material";

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

    // destroy old player
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {
        console.warn("Plyr destroy error:", e);
      }
      playerRef.current = null;
    }

    const handleLoaded = () => {
      setLoading(false);
      onReadyRef.current?.();
    };

    const handleError = () => {

      console.log("❌ Video failed → loading next video");

      setLoading(false);
      setError(true);

      setTimeout(() => {
        onErrorNextRef.current?.();
      }, 1000);
    };
    
    const player = new Plyr(video, {
      autoplay: true,
      muted: false,
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "settings",
        "fullscreen"
      ]
    });

    playerRef.current = player;

    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("error", handleError);

    // 🔥 force reload video source
    video.load();

    // 🔥 fallback if browser doesn't fire error
    const timeout = setTimeout(() => {
      if (video.readyState === 0) {
        handleError();
      }
    }, 5000);

    return () => {

      clearTimeout(timeout);

      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("error", handleError);

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.warn("Destroy cleanup error:", e);
        }
        playerRef.current = null;
      }

    };

  }, [src]);

  return (

    <div style={{ maxWidth: "1000px", margin: "auto", position: "relative" }}>

      {loading && !error && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10
          }}
        >
          <CircularProgress />
        </div>
      )}

      {error && (
        <div
          style={{
            width: "100%",
            aspectRatio: "16/9",
            background: "#000",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            textAlign: "center",
            padding: "20px"
          }}
        >
          ⚠ This video was removed. Loading next video...
        </div>
      )}

      {!error && (
        <video
          ref={videoRef}
          poster={poster}
          playsInline
          controls
          style={{
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: "12px",
            background: "black"
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

    </div>

  );
}

export default VideoPlayer;