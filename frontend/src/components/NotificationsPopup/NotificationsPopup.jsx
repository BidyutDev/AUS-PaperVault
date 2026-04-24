import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, ExternalLink, Calendar } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import "./NotificationsPopup.css";

export default function NotificationsPopup() {
  const { notifications, isPopupOpen, togglePopup } = useNotifications();

  return (
    <AnimatePresence>
      {isPopupOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="notifications-overlay"
            onClick={togglePopup}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="notifications-popup glass-card"
          >
            <div className="notifications-popup-header">
              <div className="notif-header-title">
                <Bell size={18} className="notif-header-icon" />
                <span>System_Updates</span>
              </div>
              <button className="notif-close-btn" onClick={togglePopup}>
                <X size={20} />
              </button>
            </div>

            <div className="notifications-popup-body custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="notif-empty-state">
                  <Bell size={40} className="notif-empty-icon" />
                  <p>No system updates at the moment.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif._id} className="notif-card">
                    <div className="notif-card-header">
                      <span className={`notif-type-tag ${notif.type}`}>
                        {notif.type}
                      </span>
                      <span className="notif-date">
                        <Calendar size={12} />
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="notif-title">{notif.title}</h3>
                    <p className="notif-message">{notif.message}</p>
                    
                    {notif.imageUrl && (
                      <div className="notif-image-wrap">
                        <img 
                          src={notif.imageUrl.startsWith("http") 
                            ? notif.imageUrl 
                            : `${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${notif.imageUrl}`} 
                          alt={notif.title} 
                        />
                      </div>
                    )}
                    
                    {notif.link && (
                      <a 
                        href={notif.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="notif-link-btn"
                      >
                        Learn More
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="notifications-popup-footer">
              <p>Stay updated with the latest from AUS PaperVault</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
