import { useMemo } from "react";
import { CameraFeature } from "../types";
import { CameraCard } from "./CameraCard";

interface CameraGridProps {
  cameras: CameraFeature[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  sortValue: string;
  onCameraClick: (cam: CameraFeature) => void;
  timestamp: number;
}

export function CameraGrid({
  cameras,
  loading,
  error,
  searchTerm,
  sortValue,
  onCameraClick,
  timestamp,
}: CameraGridProps) {
  const filteredAndSortedCameras = useMemo(() => {
    // 1. Filter
    const filtered = cameras.filter((cam) => {
      const title = cam.attributes.MAINROAD || "";
      const cross = cam.attributes.CROSSROAD || "";
      const searchText = `${title} ${cross}`.toLowerCase();
      return searchText.includes(searchTerm.toLowerCase());
    });

    // 2. Sort
    return filtered.sort((a, b) => {
      if (sortValue === "name") {
        const nameA = a.attributes.MAINROAD || "";
        const nameB = b.attributes.MAINROAD || "";
        return nameA.localeCompare(nameB);
      } else if (sortValue === "north-south") {
        return (b.geometry?.y || 0) - (a.geometry?.y || 0);
      } else if (sortValue === "south-north") {
        return (a.geometry?.y || 0) - (b.geometry?.y || 0);
      } else if (sortValue === "east-west") {
        return (b.geometry?.x || 0) - (a.geometry?.x || 0);
      } else if (sortValue === "west-east") {
        return (a.geometry?.x || 0) - (b.geometry?.x || 0);
      }
      return 0;
    });
  }, [cameras, searchTerm, sortValue]);

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
      {filteredAndSortedCameras.map((cam, index) => (
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
