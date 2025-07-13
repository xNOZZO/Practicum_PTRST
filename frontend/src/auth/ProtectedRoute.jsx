// src/auth/ProtectedRoute.jsx
import { useAuth } from "./useAuth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { access } = useAuth();
  return access
    ? children
    : <Navigate to="/login" replace />;
}
