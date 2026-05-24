import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

import FastForwardRounded from "@mui/icons-material/FastForwardRounded";
import FastRewindRounded from "@mui/icons-material/FastRewindRounded";

import "./VideoPlayer.css";
import "./player-enhancements.css";

const SIDE_SEEK = 10; // seconds skipped per double-tap / J-L
const ACCUM_WINDOW = 800; // ms during which repeated skips accumulate in the hint

/**
 * VideoPlayer
 *  - Single tap/click = play/pause (Plyr clickToPlay), with a big center play button.
 *  - Double-tap (mobile) / double-click (desktop) left or right = skip ±10s and keep playing.
 *    Double-click the centre on desktop = fullscreen. Repeated skips accumulate (10s→20s→30s).
 *  - Keyboard: Space/K, ←/→ (5s), J/L (10s), ↑/↓ volume, M mute, F fullscreen.
 *  - Sleek gradient-ring loader + lightweight buffering spinner.
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
  const [seekHint, setSeekHint] = useState(null); // { dir: 'fwd' | 'back', amount }

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

    // Only treat as buffering once we are past the initial load and actually playing
    const handleWaiting = () => {
      if (!loadingRef.current && !video.paused) setBuffering(true);
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
    video.addEventListener("seeked", handleCanPlay);
    video.addEventListener("error", handleError);
    video.addEventListener("ended", handleEnded);

    const player = new Plyr(video, {
      autoplay: true,
      muted: true,
      clickToPlay: true, // tap the video to play/pause
      resetOnEnd: false,
      keyboard: { focused: false, global: false }, // keys handled manually below
      tooltips: { controls: true, seek: true },
      controls: [
        "play-large", // big centre play button when paused
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
      video.removeEventListener("seeked", handleCanPlay);
      video.removeEventListener("error", handleError);
      video.removeEventListener("ended", handleEnded);

      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (e) { }
        playerRef.current = null;
      }
    };
  }, [src]);

  /* ─────────── Core actions (ref-only, safe inside [] effects) ─────────── */
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play().catch(() => {}) : v.pause();
  };

  // Move playback by `delta` seconds, clamped to a seekable position so the
  // browser doesn't silently snap back (which made the old version look broken).
  const seekBy = (delta) => {
    const v = videoRef.current;
    if (!v || !isFinite(v.duration) || v.duration <= 0) return;
    let target = v.currentTime + delta;
    target = Math.max(0, Math.min(v.duration - 0.15, target));
    try {
      const sk = v.seekable;
      if (sk && sk.length) {
        target = Math.max(sk.start(0), Math.min(sk.end(sk.length - 1), target));
      }
    } catch (e) { }
    v.currentTime = target;
  };

  // Accumulating seek + visual hint (YouTube-style). Same direction within the
  // window keeps adding up (10s → 20s → 30s) while each tap still skips `amount`.
  const accumRef = useRef({ dir: null, total: 0, timer: null });
  const flashSeek = (dir, amount) => {
    seekBy(dir === "fwd" ? amount : -amount);

    const a = accumRef.current;
    if (a.dir === dir) a.total += amount;
    else { a.dir = dir; a.total = amount; }

    setSeekHint({ dir, amount: a.total });
    window.clearTimeout(a.timer);
    a.timer = window.setTimeout(() => {
      accumRef.current = { dir: null, total: 0, timer: null };
      setSeekHint(null);
    }, ACCUM_WINDOW);
  };

  // Double-tap/click skip: seek and make sure playback continues (the whole
  // point of "skip ahead" is to keep watching).
  const skip = (dir) => {
    flashSeek(dir, SIDE_SEEK);
    const v = videoRef.current;
    if (v && v.paused) v.play().catch(() => {});
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

  /* ─────────── Double-tap / double-click to skip ─────────── */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onControls = (el) =>
      !!el?.closest?.(".plyr__controls, .plyr__control, .plyr__menu");

    const zoneOf = (clientX) => {
      const rect = wrapper.getBoundingClientRect();
      const x = clientX - rect.left;
      const w = rect.width || 1;
      if (x < w * 0.4) return "back";
      if (x > w * 0.6) return "fwd";
      return "center";
    };

    // Mobile: detect a double-tap on touchend (single taps fall through to Plyr's
    // click-to-play). preventDefault on the 2nd tap stops double-tap-to-zoom.
    let lastTap = 0;
    let lastX = 0;
    const onTouchEnd = (e) => {
      if (onControls(e.target)) return;
      const t = e.changedTouches?.[0];
      if (!t) return;
      const now = Date.now();
      if (now - lastTap < 320 && Math.abs(t.clientX - lastX) < 60) {
        const zone = zoneOf(t.clientX);
        if (zone !== "center") {
          skip(zone);
          e.preventDefault();
        }
        lastTap = 0;
      } else {
        lastTap = now;
        lastX = t.clientX;
      }
    };

    // Desktop: native dblclick. Sides skip, centre toggles fullscreen.
    const onDblClick = (e) => {
      if (onControls(e.target)) return;
      e.preventDefault();
      const zone = zoneOf(e.clientX);
      if (zone === "center") toggleFullscreen();
      else skip(zone);
    };

    wrapper.addEventListener("touchend", onTouchEnd, { passive: false });
    wrapper.addEventListener("dblclick", onDblClick);
    return () => {
      wrapper.removeEventListener("touchend", onTouchEnd);
      wrapper.removeEventListener("dblclick", onDblClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─────────── Keyboard shortcuts ─────────── */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;

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
          flashSeek("back", 5);
          break;
        case "arrowright":
          e.preventDefault();
          flashSeek("fwd", 5);
          break;
        case "j":
          e.preventDefault();
          flashSeek("back", 10);
          break;
        case "l":
          e.preventDefault();
          flashSeek("fwd", 10);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="player-wrapper" ref={wrapperRef} tabIndex={-1}>
      {/* Initial load — full overlay with sleek ring + indeterminate top bar */}
      {loading && !error && (
        <div className="vp-loader vp-loader--full">
          <div className="vp-topbar" />
          <div className="vp-ring" />
          <span className="vp-loader-text">Loading video…</span>
        </div>
      )}

      {/* Buffering mid-playback — lightweight, keeps the frame visible */}
      {buffering && !loading && !error && (
        <div className="vp-loader vp-loader--buffer">
          <div className="vp-ring vp-ring--sm" />
        </div>
      )}

      {error && (
        <div className="player-error">
          <div className="player-error-icon">⚠</div>
          <div>Video unavailable. Loading next…</div>
        </div>
      )}

      {/* Skip feedback (tap / keyboard) */}
      {seekHint && (
        <div className={`vp-seek vp-seek--${seekHint.dir}`}>
          <div className="vp-seek-bubble">
            <div className="vp-seek-chevrons">
              {seekHint.dir === "fwd" ? <FastForwardRounded /> : <FastRewindRounded />}
            </div>
            <span className="vp-seek-text">{seekHint.amount} seconds</span>
          </div>
        </div>
      )}

      <div style={{ display: error ? "none" : "block", width: "100%", height: "100%" }}>
        <video
          ref={videoRef}
          poster={poster}
          playsInline
          webkit-playsinline="true"
          preload="auto"
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
