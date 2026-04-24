import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { socket } from "../api/socket";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_URL}/notifications/list`);
      const resData = await response.json();
      
      if (resData.success) {
        const fetchedNotifs = Array.isArray(resData.data) ? resData.data : [];
        setNotifications(fetchedNotifs);
        
        // Calculate unread count based on localStorage
        const readIds = JSON.parse(localStorage.getItem("read_global_notifications") || "[]");
        const unread = fetchedNotifs.filter(n => !readIds.includes(n._id)).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    socket.on("global_notification", handleNewNotification);

    return () => {
      socket.off("global_notification", handleNewNotification);
    };
  }, [fetchNotifications]);

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n._id);
    localStorage.setItem("read_global_notifications", JSON.stringify(allIds));
    setUnreadCount(0);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    if (!isPopupOpen) {
      markAllAsRead();
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      isPopupOpen, 
      togglePopup,
      refresh: fetchNotifications 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
