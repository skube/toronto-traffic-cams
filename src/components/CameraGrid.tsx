import { CameraFeature } from "../types";
import { CameraCard } from "./CameraCard";

interface CameraGridProps {
  cameras: CameraFeature[];
  loading: boolean;
  error: string | null;
  onCameraClick: (cam: CameraFeature) => void;
  timestamp: number;
}

export function CameraGrid({
  cameras,
  loading,
  error,
  onCameraClick,
  timestamp,
}: CameraGridProps) {
  if (loading) {
    return (
      <div id="camera-grid" className="grid">
        <div style={{ textAlign: "center", gridColumn: "1/-1", color: "var(--color-text-muted)" }}>
          Loading cameras...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="camera-grid" className="grid">
        <div style={{ textAlign: "center", gridColumn: "1/-1", color: "#ef4444" }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="grid">
      {cameras.map((cam, index) => (
        <CameraCard
          key={cam.attributes.OBJECTID}
          feature={cam}
          delay={index * 20}
          onClick={() => onCameraClick(cam)}
          timestamp={timestamp}
        />
      ))}
    </div>
  );
}
