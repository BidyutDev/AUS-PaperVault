import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  ArrowRight,
  Trash2,
  Inbox,
  Monitor,
  BookOpen,
  X,
} from "lucide-react";
import { useRecentActivity } from "../../hooks/useRecentActivity";
import "./RecentActivity.css";

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function RecentActivity({ open, onClose }) {
  const { activities, clearActivity } = useRecentActivity();
  const overlayRef = useRef(null);

  // Lock body scroll & close on Escape
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!open) return null;

  return (
    <div
      className="ra-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className="ra-modal">
        {/* ── Header ── */}
        <div className="ra-modal-header">
          <div className="ra-modal-title-row">
            <Clock size={20} className="ra-modal-title-icon" />
            <h2 className="ra-modal-title">Recent Activity</h2>
          </div>
          <div className="ra-modal-actions">
            {activities.length > 0 && (
              <button
                className="ra-clear-btn"
                onClick={clearActivity}
                title="Clear all recent activity"
              >
                <Trash2 size={14} />
                Clear All
              </button>
            )}
            <button
              className="ra-close-btn"
              onClick={onClose}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="ra-modal-body">
          {activities.length === 0 ? (
            <div className="ra-empty">
              <Inbox size={40} className="ra-empty-icon" />
              <p className="ra-empty-title">No recent activity</p>
              <p className="ra-empty-desc">
                Browse a department or select a subject — your trail will appear
                here.
              </p>
            </div>
          ) : (
            <ul className="ra-list">
              {activities.map((item, i) => {
                const isDept = item.type === "department";
                const link = `/department/${item.departmentShort || item.departmentId}`;

                return (
                  <li key={`${item.type}-${item.departmentId}-${item.subject || ""}-${i}`}>
                    <Link
                      to={link}
                      className="ra-item"
                      onClick={onClose}
                      style={{
                        "--ra-accent":
                          item.color || "var(--color-vault-lavender)",
                      }}
                    >
                      {/* Accent edge */}
                      <span className="ra-item-edge" />

                      <div className="ra-item-icon">
                        {isDept ? (
                          <Monitor size={20} />
                        ) : (
                          <BookOpen size={20} />
                        )}
                      </div>

                      <div className="ra-item-info">
                        <span className="ra-item-badge">
                          {isDept ? "Department" : "Subject"}
                        </span>
                        <span className="ra-item-name">
                          {isDept ? item.departmentName : item.subject}
                        </span>
                        {!isDept && (
                          <span className="ra-item-detail">
                            {item.departmentShort} // Semester{" "}
                            {item.semester}
                          </span>
                        )}
                      </div>

                      <span className="ra-item-time">
                        {timeAgo(item.timestamp)}
                      </span>
                      <ArrowRight size={16} className="ra-item-arrow" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="ra-modal-footer">
          <span className="ra-footer-hint">
            Activity is stored locally on this device.
          </span>
        </div>
      </div>
    </div>
  );
}
