import React, { Children } from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "../../Hook/useAuth";
import useUserRole from "../../Hook/useUserRole";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <span className="loading loading-dots loading-xl"></span>;
  }

  if (!user || role !== "admin") {
    return <Navigate to="/forbidden" state={{ from: location }} replace />;
  }
  return children;
};

export default AdminRoute;
