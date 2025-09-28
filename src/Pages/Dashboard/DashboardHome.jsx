import React from "react";
import useUserRole from "../../Hook/useUserRole";
import Forbidden from "../Home/Forbidden";
import AdminDashboardHome from "./AdminDashboardHome";
import UserDashboardHome from "./UserDashboardHome";

const DashboardHome = () => {
  const { role, roleLoading, isError, error } = useUserRole();

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center mt-4">
        Failed to load dashboard: {error?.message || "Something went wrong"}
      </p>
    );
  }

  if (role === "admin") return <AdminDashboardHome />;
  if (role === "user") return <UserDashboardHome />;

  return <Forbidden />;
};

export default DashboardHome;
