import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import FastForwardRounded from "@mui/icons-material/FastForwardRounded";
import FastRewindRounded from "@mui/icons-material/FastRewindRounded";

import "./VideoPlayer.css";
import "./player-enhancements.css";

const SIDE_SEEK = 10; // seconds skipped per double-tap / J-L
const TAP_WINDOW = 260; // ms to wait before treating a tap as a single tap
const ACCUM_WINDOW = 800; // ms during which repeated taps accumulate

/**
 * VideoPlayer
 *  - YouTube-style gestures: single tap = play/pause, double-tap left/right = skip ±10s,
 *    double-click center = fullscreen (desktop). Taps on the same side accumulate.
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
  const [centerIcon, setCenterIcon] = useState(null); // { type: 'play' | 'pause', id }

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
      clickToPlay: false, // gestures are handled manually below
      resetOnEnd: false,
      keyboard: { focused: false, global: false }, // handled manually below
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
  const flashCenter = (type) => {
    setCenterIcon({ type, id: Date.now() });
    window.clearTimeout(flashCenter._t);
    flashCenter._t = window.setTimeout(() => setCenterIcon(null), 480);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      flashCenter("play");
    } else {
      v.pause();
      flashCenter("pause");
    }
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

  /* ─────────── Unified tap / click gestures ─────────── */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onControls = (el) =>
      !!el?.closest?.(".plyr__controls, .plyr__control, .plyr__menu");

    let down = { x: 0, y: 0, t: 0, ignore: true };
    let tapTimer = null;

    const handleTap = (clientX, pointerType) => {
      const rect = wrapper.getBoundingClientRect();
      const x = clientX - rect.left;
      const w = rect.width || 1;
      const side = x < w * 0.35 ? "back" : x > w * 0.65 ? "fwd" : "center";

      if (tapTimer) {
        // Second tap → double-tap action
        window.clearTimeout(tapTimer);
        tapTimer = null;
        if (side === "back") flashSeek("back", SIDE_SEEK);
        else if (side === "fwd") flashSeek("fwd", SIDE_SEEK);
        else if (pointerType === "mouse") toggleFullscreen();
        else togglePlay();
      } else {
        tapTimer = window.setTimeout(() => {
          tapTimer = null;
          togglePlay();
        }, TAP_WINDOW);
      }
    };

    const onPointerDown = (e) => {
      if (onControls(e.target) || (e.pointerType === "mouse" && e.button !== 0)) {
        down.ignore = true;
        return;
      }
      down = { x: e.clientX, y: e.clientY, t: Date.now(), ignore: false };
    };

    const onPointerUp = (e) => {
      if (down.ignore || onControls(e.target)) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      if (moved > 14 || Date.now() - down.t > 600) return; // a drag / long-press, not a tap
      handleTap(e.clientX, e.pointerType);
    };

    const onDblClick = (e) => {
      if (!onControls(e.target)) e.preventDefault();
    };

    wrapper.addEventListener("pointerdown", onPointerDown);
    wrapper.addEventListener("pointerup", onPointerUp);
    wrapper.addEventListener("dblclick", onDblClick);
    return () => {
      window.clearTimeout(tapTimer);
      wrapper.removeEventListener("pointerdown", onPointerDown);
      wrapper.removeEventListener("pointerup", onPointerUp);
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

      {/* Play / pause feedback flash */}
      {centerIcon && (
        <div className="vp-center-flash" key={centerIcon.id}>
          {centerIcon.type === "play" ? <PlayArrowRounded /> : <PauseRounded />}
        </div>
      )}

      <div style={{ display: error ? "none" : "block", width: "100%", height: "100%" }}>
        <video
          ref={videoRef}
          poster={poster}
          playsInline
          webkit-playsinline="true"
          preload="auto"
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
