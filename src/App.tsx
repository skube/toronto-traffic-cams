import { useState, useEffect } from "react";
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
          cameras={cameras}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          sortValue={sortValue}
          onCameraClick={setSelectedCamera}
          timestamp={timestamp}
        />
      </main>
      <Modal
        feature={selectedCamera}
        onClose={() => setSelectedCamera(null)}
        timestamp={timestamp}
      />
    </div>
  );
}

export default App;
