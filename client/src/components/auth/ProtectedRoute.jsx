import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FullPageLoader from "../ui/FullPageLoader";

export default function ProtectedRoute({ children }) {
  const { auth, loading } = useContext(AuthContext);

  if (loading) return <FullPageLoader />;
  if (!auth) return <Navigate to="/login" replace />;

  return children;
}
