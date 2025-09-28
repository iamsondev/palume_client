import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import useAuth from "../Hook/useAuth";
import useUserRole from "../Hook/useUserRole";
import Logo from "../Pages/Home/Logo";

import {
  FaHome,
  FaPaw,
  FaList,
  FaClipboardList,
  FaDonate,
  FaMoneyCheckAlt,
  FaGift,
  FaUsersCog,
} from "react-icons/fa";

const DashboardLayout = () => {
  const { user, LogOut } = useAuth();
  const { role, roleLoading } = useUserRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    LogOut()
      .then(() => {
        navigate("/");
      })
      .catch((err) => console.error(err));
  };

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  // Sidebar nav item class with emerald hover & active
  const navItemClasses = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded transition-all duration-200
     ${
       isActive
         ? "bg-emerald-500 dark:bg-gray-700 shadow-md"
         : "hover:bg-emerald-600 dark:hover:bg-gray-700 hover:shadow-sm"
     }`;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-emerald-800 to-emerald-400 dark:from-gray-900 dark:to-gray-800 text-white shadow-lg flex flex-col">
        <div
          className="p-2 flex flex-col items-center justify-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Logo />
          <span className="ml-2 text-2xl font-bold">User Dashboard</span>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto">
          <ul>
            <li className="mb-2">
              <NavLink to="/dashboard" end className={navItemClasses}>
                <FaHome className="mr-3" /> Home
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/dashboard/add-pet" className={navItemClasses}>
                <FaPaw className="mr-3" /> Add a Pet
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/dashboard/my-pets" className={navItemClasses}>
                <FaList className="mr-3" /> My Added Pets
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/dashboard/create-donation"
                className={navItemClasses}
              >
                <FaDonate className="mr-3" /> Create Donation Campaign
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/dashboard/my-donation-campaign"
                className={navItemClasses}
              >
                <FaMoneyCheckAlt className="mr-3" /> My Donation Campaigns
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/dashboard/my-donations" className={navItemClasses}>
                <FaGift className="mr-3" /> My Donations
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/dashboard/adoption-requests"
                className={navItemClasses}
              >
                <FaClipboardList className="mr-3" /> Adoption Requests
              </NavLink>
            </li>

            {role === "admin" && (
              <>
                <hr className="my-4 border-emerald-400 dark:border-gray-600" />
                <h2 className="text-xl font-bold px-4 mb-2">Admin Dashboard</h2>
                <li className="mb-2">
                  <NavLink to="/dashboard/admin" className={navItemClasses}>
                    <FaUsersCog className="mr-3" /> All Users
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink to="/dashboard/all-pets" className={navItemClasses}>
                    <FaPaw className="mr-3" /> All Pets
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink
                    to="/dashboard/all-donations"
                    className={navItemClasses}
                  >
                    <FaDonate className="mr-3" /> All Donations
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-gradient-to-r from-emerald-800 to-emerald-500 dark:from-gray-800 dark:to-gray-700 shadow flex items-center justify-between px-6">
          <div className="text-lg font-semibold text-white">
            Welcome, {user?.displayName || "User"}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 p-6 overflow-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-300 rounded-lg shadow-inner">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
