import { useEffect } from "react";
import { colors } from "../theme";

export default function Modal({ onClose, children, ariaLabel, ariaLabelledBy }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(6,9,8,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, borderRadius: 16 }}>
      <div role="dialog" aria-modal="true" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} onClick={(e) => e.stopPropagation()} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, width: 420, maxWidth: "calc(100vw - 32px)", maxHeight: "calc(100vh - 32px)", overflowY: "auto", padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.42)" }}>
        {children}
      </div>
    </div>
  );
}
