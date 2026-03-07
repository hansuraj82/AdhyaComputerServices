// import { Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import FullPageLoader from "../ui/FullPageLoader";

// export default function ProtectedRoute({ children }) {
//   const { auth, loading } = useContext(AuthContext);

//   if (loading) return <FullPageLoader />;
//   if (!auth) return <Navigate to="/login" replace />;

//   return children;
// }


import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FullPageLoader from "../ui/FullPageLoader";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { auth, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <FullPageLoader />;
  
  // 1. Not logged in? Go to login
  if (!auth) return <Navigate to="/login" state={{ from: location }} replace />;

  // 2. Role Check: If allowedRoles is provided, check if user's role matches
  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    // Staff tried to access Admin area? Send them to customers
    return <Navigate to="/customers" replace />;
  }

  return children;
}