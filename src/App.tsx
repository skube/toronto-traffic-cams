import { useState, useEffect, useMemo, useCallback } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "./components/Header";
import { Controls } from "./components/Controls";
import { CameraGrid } from "./components/CameraGrid";
import { Modal } from "./components/Modal";
import { useCameras } from "./hooks/useCameras";
import { CameraFeature } from "./types";

function App() {
  const { cameras, loading, error } = useCameras();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState("name");
  const [selectedCamera, setSelectedCamera] = useState<CameraFeature | null>(null);
  const [timestamp, setTimestamp] = useState(Date.now());

  // Live updates every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Date.now());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Centralized filtering and sorting logic
  const filteredAndSortedCameras = useMemo(() => {
    const filtered = cameras.filter((cam) => {
      const title = cam.attributes.MAINROAD || "";
      const cross = cam.attributes.CROSSROAD || "";
      const searchText = `${title} ${cross}`.toLowerCase();
      return searchText.includes(searchTerm.toLowerCase());
    });

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

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (!selectedCamera || filteredAndSortedCameras.length === 0) return;
    const currentIndex = filteredAndSortedCameras.findIndex(
      (cam) => cam.attributes.OBJECTID === selectedCamera.attributes.OBJECTID
    );
    const nextIndex = (currentIndex + 1) % filteredAndSortedCameras.length;
    setSelectedCamera(filteredAndSortedCameras[nextIndex]);
  }, [selectedCamera, filteredAndSortedCameras]);

  const handlePrev = useCallback(() => {
    if (!selectedCamera || filteredAndSortedCameras.length === 0) return;
    const currentIndex = filteredAndSortedCameras.findIndex(
      (cam) => cam.attributes.OBJECTID === selectedCamera.attributes.OBJECTID
    );
    const prevIndex = (currentIndex - 1 + filteredAndSortedCameras.length) % filteredAndSortedCameras.length;
    setSelectedCamera(filteredAndSortedCameras[prevIndex]);
  }, [selectedCamera, filteredAndSortedCameras]);

  return (
    <div className="app-container">
      <Header />
      <Controls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortValue={sortValue}
        onSortChange={setSortValue}
      />
      <main className="main-container">
        <CameraGrid
          cameras={filteredAndSortedCameras}
          loading={loading}
          error={error}
          onCameraClick={setSelectedCamera}
          timestamp={timestamp}
        />
      </main>
      <Modal
        feature={selectedCamera}
        onClose={() => setSelectedCamera(null)}
        onNext={handleNext}
        onPrev={handlePrev}
        timestamp={timestamp}
      />
      <Analytics />
    </div>
  );
}

export default App;
