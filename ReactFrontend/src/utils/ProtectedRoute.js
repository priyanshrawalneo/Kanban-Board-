import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
const Dashboard = React.lazy(() => import("../components/Dashboard/Dashboard"));

const ProtectedRoute = ({ children, type }) => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.user)

  return isAuthenticated.username?
  // <Navigate to="/" state={{ from: location }} replace />:
  children:
    <Navigate to="/login" state={{ from: location }} replace />
};

export default ProtectedRoute;
