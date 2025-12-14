import { useState } from "react";
import { CameraFeature } from "../types";

interface CameraCardProps {
  feature: CameraFeature;
  delay: number;
  onClick: () => void;
  timestamp: number;
}

export function CameraCard({ feature, delay, onClick, timestamp }: CameraCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const attr = feature.attributes;

  const title = attr.MAINROAD || "Unknown Location";
  const subtitle = attr.CROSSROAD ? `at ${attr.CROSSROAD}` : "";
  const direction = attr.DIRECTION1 || "";
  
  // Construct URL with timestamp prop to force refresh
  const imageUrl = `${attr.IMAGEURL}?t=${timestamp}`;

  return (
    <div
      className="card"
      style={{ animationDelay: `${delay}ms`, cursor: "pointer" }}
      onClick={onClick}
    >
      <div className="card-image-wrapper">
        {!loaded && !error && <div className="loader">Loading...</div>}
        {error && <div className="loader">Camera Offline</div>}
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s ease",
            display: error ? "none" : "block",
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      </div>
      <div className="card-content">
        <div className="card-title">
          {title}{" "}
          <span style={{ fontSize: "0.8em", fontWeight: "normal", color: "var(--color-accent)" }}>
            {direction}
          </span>
        </div>
        <div className="card-meta">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {subtitle}
        </div>
      </div>
    </div>
  );
}
