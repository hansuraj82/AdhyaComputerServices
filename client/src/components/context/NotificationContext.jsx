// import { createContext, useContext, useState, useEffect, useCallback } from "react";
// import { getNotificationsForBellApi } from "../../services/notification.service";
// import toast from "react-hot-toast";


// const NotificationContext = createContext();

// export const NotificationProvider = ({ children }) => {
//   const [count, setCount] = useState(0);

//   const fetchCount = useCallback(async () => {
//     try {
//       const res = await getNotificationsForBellApi();
//       // Use the summary count we calculated in the controller
//       setCount(res.data.count || 0);
//     } catch (err) {
//       toast.error(err.message)
//     }
//   }, []);

//   // Initial load
//   useEffect(() => {
//     fetchCount();
//   }, [fetchCount]);

//   return (
//     <NotificationContext.Provider value={{ count, fetchCount }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => useContext(NotificationContext);

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getNotificationsForBellApi } from "../../services/notification.service";

import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { auth } = useContext(AuthContext); // Get auth state
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    // 🛡️ ROLE GATE: Only fetch if user is logged in AND is an admin
    if (!auth || auth.role !== "owner") {
      setCount(0);
      return;
    }

    try {
      const res = await getNotificationsForBellApi();
      setCount(res.data.count || 0);
      
    } catch (err) {
      toast.error(err.message);

    }
  }, [auth]); // Re-create function if auth state changes

  // Initial load & Re-fetch on login/role change
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