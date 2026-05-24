import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

import "./VideoPlayer.css";
import "./player-enhancements.css";

/**
 * VideoPlayer
 *  - Better animated loader / buffering UI
 *  - Keyboard shortcuts: Space, ←/→, ↑/↓, F, M
 *  - Double-tap left / right (mobile) skips ±10s
 *  - No download / no PiP context menu
 */
function VideoPlayer({ src, poster, onErrorNext, onReady, onEnded }) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const playerRef = useRef(null);

  const onReadyRef = useRef(onReady);
  const onErrorNextRef = useRef(onErrorNext);
  const onEndedRef = useRef(onEnded);
  const loadingRef = useRef(true);

  const [loading, setLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState(false);
  const [seekHint, setSeekHint] = useState(null); // { dir: 'fwd' | 'back' }

  useEffect(() => {
    onReadyRef.current = onReady;
    onErrorNextRef.current = onErrorNext;
    onEndedRef.current = onEnded;
  }, [onReady, onErrorNext, onEnded]);

  /* ─────────── Player init ─────────── */
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

    const handleCanPlay = () => {
      loadingRef.current = false;
      setLoading(false);
      setBuffering(false);
      setError(false);
    };

    const handlePlaying = () => {
      loadingRef.current = false;
      setLoading(false);
      setBuffering(false);
      onReadyRef.current?.();
    };

    const handleWaiting = () => {
      if (!loadingRef.current) setBuffering(true);
    };

    const handleError = () => {
      loadingRef.current = false;
      setLoading(false);
      setError(true);
      setTimeout(() => onErrorNextRef.current?.(), 1000);
    };

    const handleEnded = () => onEndedRef.current?.();

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
      settings: ["speed", "loop"],
      speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
      playsinline: true,
      disableContextMenu: true,
    });

    playerRef.current = player;

    const timeout = setTimeout(() => {
      if (video.readyState < 2) handleError();
    }, 25000);

    return () => {
      clearTimeout(timeout);
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

  /* ─────────── Helpers ─────────── */
  const seek = (delta) => {
    const v = videoRef.current;
    if (!v || !isFinite(v.duration)) return;
    v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + delta));
    setSeekHint({ dir: delta > 0 ? "fwd" : "back", amount: Math.abs(delta) });
    window.clearTimeout(seek._t);
    seek._t = window.setTimeout(() => setSeekHint(null), 650);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play().catch(() => {}) : v.pause();
  };

  const adjustVolume = (delta) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = Math.max(0, Math.min(1, v.volume + delta));
    if (v.volume > 0) v.muted = false;
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
  };

  const toggleFullscreen = () => {
    const p = playerRef.current;
    if (!p) return;
    try { p.fullscreen.toggle(); } catch (e) { }
  };

  /* ─────────── Keyboard shortcuts ─────────── */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleKey = (e) => {
      // ignore typing in inputs
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;

      // only act when hovered OR player has focus (Plyr keyboard.focused already covers focus)
      const hovered = wrapper.matches(":hover");
      const focusInside = wrapper.contains(document.activeElement);
      if (!hovered && !focusInside) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "arrowleft":
          e.preventDefault();
          seek(-5);
          break;
        case "arrowright":
          e.preventDefault();
          seek(5);
          break;
        case "j":
          e.preventDefault();
          seek(-10);
          break;
        case "l":
          e.preventDefault();
          seek(10);
          break;
        case "arrowup":
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case "arrowdown":
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* ─────────── Double-tap to seek (mobile) ─────────── */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let lastTap = 0;
    let lastX = 0;

    const handleTouch = (e) => {
      const t = e.changedTouches?.[0];
      if (!t) return;
      const now = Date.now();
      const rect = wrapper.getBoundingClientRect();
      const x = t.clientX - rect.left;

      if (now - lastTap < 320 && Math.abs(x - lastX) < 60) {
        // double-tap
        const isRight = x > rect.width / 2;
        seek(isRight ? 10 : -10);
        lastTap = 0; // reset
        e.preventDefault();
      } else {
        lastTap = now;
        lastX = x;
      }
    };

    wrapper.addEventListener("touchend", handleTouch, { passive: false });
    return () => wrapper.removeEventListener("touchend", handleTouch);
  }, []);

  return (
    <div className="player-wrapper" ref={wrapperRef} tabIndex={-1}>
      {(loading || buffering) && !error && (
        <div className="player-loader">
          <div className="player-spinner-modern">
            <span /><span /><span /><span />
          </div>
          <span className="player-spinner-text">
            {buffering && !loading ? "Buffering…" : "Loading video…"}
          </span>
        </div>
      )}

      {error && (
        <div className="player-error">
          <div className="player-error-icon">⚠</div>
          <div>Video unavailable. Loading next…</div>
        </div>
      )}

      {/* Seek hint overlay (mobile double-tap) */}
      {seekHint && (
        <div className={`seek-hint ${seekHint.dir}`}>
          <div className="seek-hint-inner">
            {seekHint.dir === "fwd" ? "⏩" : "⏪"} {seekHint.amount}s
          </div>
        </div>
      )}

      <div style={{ display: error ? "none" : "block", width: "100%", height: "100%" }}>
        <video
          ref={videoRef}
          poster={poster}
          playsInline
          webkit-playsinline="true"
          controls
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          className="player-video"
        />
      </div>
    </div>
  );
}

export default VideoPlayer;
