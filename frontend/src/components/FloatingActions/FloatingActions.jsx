import { Bell, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";
import "./FloatingActions.css";

export default function FloatingActions() {
  const navigate = useNavigate();
  const { unreadCount, togglePopup } = useNotifications();
  const [isHovered, setIsHovered] = useState(null);

  const actions = [
    {
      id: "notifications",
      icon: Bell,
      label: "Updates",
      color: "var(--color-vault-lavender)",
      hasIndicator: unreadCount > 0,
      onClick: togglePopup
    },
    {
      id: "donate",
      icon: Heart,
      label: "Support Us",
      color: "var(--color-vault-danger)",
      hasIndicator: false,
      onClick: () => {
        navigate("/donate");
      }
    }
  ];

  return (
    <div className="floating-actions-container">
      {actions.map((action, index) => {
        const Icon = action.icon;
        const isActive = isHovered === action.id;

        return (
          <div 
            key={action.id} 
            className="floating-action-wrapper"
            onMouseEnter={() => setIsHovered(action.id)}
            onMouseLeave={() => setIsHovered(null)}
          >
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="floating-action-tooltip glass-light"
                >
                  {action.label}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`floating-action-btn glass-card ${action.hasIndicator && action.id === "notifications" ? "notification-blinking" : ""}`}
              onClick={action.onClick}
              style={{
                "--action-color": action.color,
                "--action-color-rgb": action.color === "var(--color-vault-danger)" ? "248, 113, 113" : "175, 179, 247"
              }}
            >
              <Icon size={18} className={`floating-icon ${isActive ? 'active' : ''}`} />
              
              {action.hasIndicator && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="notification-ping-container"
                >
                  <span className="notification-ping"></span>
                  <span className="notification-dot"></span>
                </motion.span>
              )}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}
