import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

import "./VideoPlayer.css";
import "./player-enhancements.css";
import RunningLoader from "./common/RunningLoader";

function VideoPlayer({ src, poster, onErrorNext, onReady, onEnded }) {

  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const onReadyRef = useRef(onReady);
  const onErrorNextRef = useRef(onErrorNext);
  const onEndedRef = useRef(onEnded);
  // Track loading state in a ref so event handler closures always see the current value
  const loadingRef = useRef(true);

  const [loading, setLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    onReadyRef.current = onReady;
    onErrorNextRef.current = onErrorNext;
    onEndedRef.current = onEnded;
  }, [onReady, onErrorNext, onEnded]);

  useEffect(() => {

    const video = videoRef.current;
    if (!video || !src) return;

    loadingRef.current = true;
    setLoading(true);
    setBuffering(false);
    setError(false);

    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch (e) { }
      playerRef.current = null;
    }

    video.src = src;
    video.load();

    const handleLoaded = () => {
      loadingRef.current = false;
      setLoading(false);
      setBuffering(false);
      setError(false);
      onReadyRef.current?.();
    };

    const handleWaiting = () => {
      // Only show buffering spinner after initial load is done
      if (!loadingRef.current) {
        setBuffering(true);
      }
    };

    const handleCanPlay = () => {
      loadingRef.current = false;
      setLoading(false);
      setBuffering(false);
    };

    const handlePlaying = () => {
      setBuffering(false);
    };

    const handleError = () => {
      loadingRef.current = false;
      setLoading(false);
      setError(true);
      setTimeout(() => {
        onErrorNextRef.current?.();
      }, 1000);
    };

    const handleEnded = () => {
      onEndedRef.current?.();
    };

    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("stalled", handleWaiting);
    video.addEventListener("error", handleError);
    video.addEventListener("ended", handleEnded);

    const player = new Plyr(video, {
      autoplay: true,
      muted: true,
      clickToPlay: true,
      resetOnEnd: false,
      keyboard: { focused: true, global: false },
      tooltips: { controls: true, seek: true },
      controls: [
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings",
        "pip",
        "fullscreen",
      ],
      settings: ["speed"],
      speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
      playsinline: true,
    });

    playerRef.current = player;

    const timeout = setTimeout(() => {
      if (video.readyState < 2) {
        handleError();
      }
    }, 25000);

    return () => {
      clearTimeout(timeout);
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("stalled", handleWaiting);
      video.removeEventListener("error", handleError);
      video.removeEventListener("ended", handleEnded);

      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (e) { }
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

      {buffering && !loading && !error && (
        <div className="player-loader">
          <RunningLoader text="Buffering..." />
        </div>
      )}

      {error && (
        <div className="player-error">
          ⚠ Video removed. Loading next...
        </div>
      )}

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
