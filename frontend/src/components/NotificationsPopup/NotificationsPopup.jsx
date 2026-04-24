import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, ExternalLink, Calendar, Zap, Info, AlertTriangle, Wrench, Megaphone } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import "./NotificationsPopup.css";

const typeConfig = {
  info: { icon: Info, label: "Information", color: "#61DAFB" },
  alert: { icon: AlertTriangle, label: "Urgent Alert", color: "#f87171" },
  announcement: { icon: Megaphone, label: "Announcement", color: "#afb3f7" },
  maintenance: { icon: Wrench, label: "Maintenance", color: "#fbbf24" },
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function NotificationsPopup() {
  const { notifications, isPopupOpen, togglePopup } = useNotifications();

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${url}`;
  };

  return (
    <AnimatePresence>
      {isPopupOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="notifpop-overlay"
            onClick={togglePopup}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 60 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="notifpop-modal"
          >
            {/* Decorative glow elements */}
            <div className="notifpop-glow notifpop-glow-1" />
            <div className="notifpop-glow notifpop-glow-2" />

            {/* Header */}
            <div className="notifpop-header">
              <div className="notifpop-header-left">
                <div className="notifpop-header-icon-wrap">
                  <Zap size={20} />
                </div>
                <div>
                  <h2 className="notifpop-header-title">System_Updates</h2>
                  <p className="notifpop-header-sub">
                    {notifications.length} update{notifications.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button className="notifpop-close" onClick={togglePopup} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="notifpop-body custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="notifpop-empty">
                  <div className="notifpop-empty-icon-ring">
                    <Bell size={36} />
                  </div>
                  <h3>All Clear</h3>
                  <p>No system updates at the moment. You&apos;re all caught up.</p>
                </div>
              ) : (
                <div className="notifpop-list">
                  {notifications.map((notif, idx) => {
                    const config = typeConfig[notif.type] || typeConfig.info;
                    const TypeIcon = config.icon;

                    return (
                      <motion.div
                        key={notif._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.06, duration: 0.35 }}
                        className="notifpop-card"
                        style={{ "--notif-accent": config.color }}
                      >
                        <div className="notifpop-card-accent" />

                        <div className="notifpop-card-top">
                          <div className="notifpop-card-badge" style={{ color: config.color }}>
                            <TypeIcon size={13} />
                            <span>{config.label}</span>
                          </div>
                          <span className="notifpop-card-time">
                            <Calendar size={11} />
                            {formatDate(notif.createdAt)}
                          </span>
                        </div>

                        <h3 className="notifpop-card-title">{notif.title}</h3>
                        <p className="notifpop-card-msg">{notif.message}</p>

                        {notif.imageUrl && (
                          <div className="notifpop-card-img">
                            <img src={getImageUrl(notif.imageUrl)} alt={notif.title} />
                          </div>
                        )}

                        {notif.link && (
                          <a
                            href={notif.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="notifpop-card-link"
                          >
                            <span>View Details</span>
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="notifpop-footer">
              <div className="notifpop-footer-pulse" />
              <span>Live feed from AUS PaperVault</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
