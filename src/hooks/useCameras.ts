import { useState, useEffect } from "react";
import { CameraFeature } from "../types";

const FEATURE_LAYER_URL =
  "https://gis.toronto.ca/arcgis/rest/services/cot_geospatial2/FeatureServer/3/query";

export function useCameras() {
  const [cameras, setCameras] = useState<CameraFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCameras() {
      try {
        const params = new URLSearchParams({
          where: "1=1",
          outFields: "OBJECTID,IMAGEURL,MAINROAD,CROSSROAD,DIRECTION1",
          f: "json",
          returnGeometry: "true",
          orderByFields: "MAINROAD ASC",
          resultRecordCount: "300",
        });

        const response = await fetch(`${FEATURE_LAYER_URL}?${params}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCameras(data.features || []);
      } catch (err) {
        console.error("Error fetching cameras:", err);
        setError("Failed to load cameras. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchCameras();
  }, []);

  return { cameras, loading, error };
}
