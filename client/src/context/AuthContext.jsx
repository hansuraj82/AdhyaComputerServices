import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) setAuth(JSON.parse(stored));
    setLoading(false);
  }, []);

  // EXTRAORDINARY FIX: Global 401 Listener
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid - Clean up state!
          toast.error("Session expired. Please login again.");
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  const login = (data) => {
    localStorage.setItem("auth", JSON.stringify(data));
    setAuth(data);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
