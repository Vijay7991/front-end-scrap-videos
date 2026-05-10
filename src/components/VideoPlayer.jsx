import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

import "./VideoPlayer.css";
import RunningLoader from "./common/RunningLoader";


// ✅ ADDED: onEnded prop
function VideoPlayer({ src, poster, onErrorNext, onReady, onEnded }) {

  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const onReadyRef = useRef(onReady);
  const onErrorNextRef = useRef(onErrorNext);
  const onEndedRef = useRef(onEnded); 

  const [loading, setLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    onReadyRef.current = onReady;
    onErrorNextRef.current = onErrorNext;
    onEndedRef.current = onEnded; // ✅ ADDED: Keep ref updated
  }, [onReady, onErrorNext, onEnded]);

  useEffect(() => {

    const video = videoRef.current;
    if (!video || !src) return;

    setLoading(true);
    setBuffering(false);
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
      setBuffering(false);
      setError(false);
      onReadyRef.current?.();
    };

    const handleWaiting = () => {
      if (!loading) {
        setBuffering(true);
      }
    };
    const handleCanPlay = () => {
      setLoading(false);
      setBuffering(false);
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

    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("stalled", handleWaiting);
    video.addEventListener("error", handleError);
    video.addEventListener("ended", handleEnded);

    // 🔥 init plyr AFTER setting src
    const player = new Plyr(video, {
      autoplay: true,
      muted: true,
      clickToPlay: true,
      resetOnEnd: false, // ✅ IMPORTANT
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

    // fallback 15 sec
    const timeout = setTimeout(() => {
      if (video.readyState < 2) {
        console.log("still loading...");
        handleError();
      }
    }, 25000);

    return () => {
      clearTimeout(timeout);

      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("stalled", handleWaiting);
      video.removeEventListener("error", handleError);
      video.removeEventListener("ended", handleEnded);

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
          <RunningLoader text="Loading video..." />
        </div>
      )}

      {buffering && !error && (
        <div className="player-loader">
          <RunningLoader text="Buffering..." />
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