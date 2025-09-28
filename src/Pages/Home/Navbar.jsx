// src/Components/Shared/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FaUserCircle, FaMoon, FaSun } from "react-icons/fa";
import useAuth from "../../Hook/useAuth";
import Logo from "./Logo";

const Navbar = () => {
  const { user, LogOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Dark/Light mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    LogOut()
      .then(() => {
        setDropdownOpen(false);
        navigate("/"); // logout এর পর Home page এ redirect
      })
      .catch((err) => console.error(err));
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link to="/">
        <Logo />
      </Link>

      {/* Links */}
      <div className="flex items-center space-x-4 md:space-x-6">
        <Link to="/" className="hover:text-pink-500 transition">
          Home
        </Link>
        <Link to="/pets" className="hover:text-pink-500 transition">
          Pet Listing
        </Link>
        <Link to="/donationCamp" className="hover:text-pink-500 transition">
          Donation Campaigns
        </Link>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="text-gray-700 dark:text-gray-200 text-lg p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Conditional Rendering */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center focus:outline-none"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
                />
              ) : (
                <FaUserCircle
                  size={36}
                  className="text-gray-500 dark:text-gray-200"
                />
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                <p className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 font-medium">
                  {user.displayName || "User"}
                </p>
                <hr className="border-gray-300 dark:border-gray-700" />
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 hover:bg-pink-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-pink-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg border-2 border-emerald-500 text-white-500 font-medium hover:bg-pink-50 text-emerald-500 hover:scale-105 transform transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 via-red-300 to-yellow-400 text-white font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
