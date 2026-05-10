import { useEffect, useRef } from "react";

function ProgressPreview({ previewPosition, previewImage, duration, onProgressHover }) {
  const tooltipRef = useRef(null);

  // Format time to MM:SS
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!previewPosition) return null;

  return (
    <div
      ref={tooltipRef}
      className="progress-preview-tooltip"
      style={{
        left: `${previewPosition.x}%`,
        transform: "translateX(-50%)"
      }}
    >
      {previewImage && (
        <img
          src={previewImage}
          alt="Progress preview"
          className="progress-preview-image"
        />
      )}
      <div className="progress-preview-time">
        {formatTime(previewPosition.time)}
      </div>
    </div>
  );
}

export default ProgressPreview;
