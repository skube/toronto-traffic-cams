import { useEffect, useState } from "react";
import { CameraFeature } from "../types";

interface ModalProps {
  feature: CameraFeature | null;
  onClose: () => void;
  timestamp: number;
}

export function Modal({ feature, onClose, timestamp }: ModalProps) {
  /* sent message to user: 'opacity' is declared but its value is never read. */
  const [, setOpacity] = useState(0);

  useEffect(() => {
    if (feature) {
      setOpacity(1);
    } else {
      setOpacity(0);
    }
  }, [feature]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!feature) return null;

  const attr = feature.attributes;
  const title = attr.MAINROAD || "Unknown Location";
  const subtitle = attr.CROSSROAD ? `at ${attr.CROSSROAD}` : "";
  const imageUrl = `${attr.IMAGEURL}?t=${timestamp}`;

  return (
    <div
      className={`modal-overlay ${feature ? "active" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc">
        <button className="modal-button-close" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          <p id="modal-desc" className="modal-subtitle">{subtitle}</p>
        </div>
        <div className="modal-image-wrapper">
          <img src={imageUrl} alt={title} />
        </div>
      </div>
    </div>
  );
}
