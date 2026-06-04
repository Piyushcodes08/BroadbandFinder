import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // If no token or not admin → redirect to login
  if (!token || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
