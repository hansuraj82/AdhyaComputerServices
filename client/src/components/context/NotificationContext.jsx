import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getNotificationsForBellApi } from "../../services/notification.service";


const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const res = await getNotificationsForBellApi();
      // Use the summary count we calculated in the controller
      setCount(res.data.count || 0);
    } catch (err) {
      console.error("Notif Error:", err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return (
    <NotificationContext.Provider value={{ count, fetchCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);