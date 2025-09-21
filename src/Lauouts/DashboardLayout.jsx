import React from "react";
import { Link, Outlet } from "react-router";
import useAuth from "../Hook/useAuth";
import {
  FaHome,
  FaPaw,
  FaList,
  FaClipboardList,
  FaDonate,
  FaMoneyCheckAlt,
  FaGift,
} from "react-icons/fa";

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: "Home", path: "dashboard", icon: <FaHome /> },
    { name: "Add a Pet", path: "add-pet", icon: <FaPaw /> },
    { name: "My Added Pets", path: "my-pets", icon: <FaList /> },
    {
      name: "Adoption Requests",
      path: "adoption-requests",
      icon: <FaClipboardList />,
    },
    {
      name: "Create Donation Campaign",
      path: "create-donation",
      icon: <FaDonate />,
    },
    {
      name: "My Donation Campaigns",
      path: "my-donation-campaigns",
      icon: <FaMoneyCheckAlt />,
    },
    { name: "My Donations", path: "my-donations", icon: <FaGift /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-4 text-2xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </div>
        <nav className="mt-6">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className="mb-2">
                <Link
                  to={`/dashboard/${item.path}`}
                  className="flex items-center px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-gray-800 shadow flex items-center justify-between px-4">
          <div className="text-lg font-semibold text-gray-800 dark:text-white">
            Welcome, {user?.displayName || "User"}
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
