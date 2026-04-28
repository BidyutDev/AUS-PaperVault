import { useState, useEffect } from "react";
import logoAus from "../Logo/aus-logo1.png";
import "./AppLoader.css";

/**
 * Full-screen loading overlay with a horizontal scanning progress bar.
 * Shown on first visit until auth, departments, and papers are all fetched.
 *
 * @param {{ visible: boolean }} props
 */
export default function AppLoader({ visible }) {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (!visible) {
      // Keep mounted long enough for the fade-out transition (550ms in CSS)
      const timer = setTimeout(() => setShouldRender(false), 600);
      return () => clearTimeout(timer);
    }
    setShouldRender(true);
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <div className={`app-loader-overlay ${!visible ? "fade-out" : ""}`}>
      {/* Corner accents */}
      <div className="app-loader-corner top-left" />
      <div className="app-loader-corner top-right" />
      <div className="app-loader-corner bottom-left" />
      <div className="app-loader-corner bottom-right" />

      <div className="app-loader-content">
        {/* Branding */}
        <div className="app-loader-logo">
          <img
            src={logoAus}
            alt="AUS PaperVault"
            className="app-loader-logo-img"
          />
          <div className="app-loader-title">
            AUS <span>PAPERVAULT</span>
          </div>
          <div className="app-loader-subtitle">Assam University // Silchar</div>
        </div>

        {/* Horizontal progress bar */}
        <div className="app-loader-bar-wrapper">
          <div className="app-loader-bar-track">
            <div className="app-loader-bar-fill" />
            <div className="app-loader-bar-fill-secondary" />
          </div>
          <div className="app-loader-status">Loading resources…</div>
        </div>
      </div>
    </div>
  );
}
