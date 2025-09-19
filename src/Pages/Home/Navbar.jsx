import React, { useState } from "react";
import { Link } from "react-router"; 
import { FaUserCircle } from "react-icons/fa";
import useAuth from "../../Hook/useAuth"; 

const Navbar = () => {
  const { user, LogOut } = useAuth(); 
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    LogOut()
      .then(() => {
        setDropdownOpen(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-pink-500">
        Pawlume
      </Link>

      {/* Links */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="hover:text-pink-500 transition">
          Home
        </Link>
        <Link to="/pets" className="hover:text-pink-500 transition">
          Pet Listing
        </Link>
        <Link to="/campaigns" className="hover:text-pink-500 transition">
          Donation Campaigns
        </Link>

        {/* Conditional Rendering */}
        {user ? (
          // Logged in - Profile dropdown
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
                <FaUserCircle size={36} className="text-gray-500" />
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl border border-gray-200 py-2 z-50">
                <p className="px-4 py-2 text-sm text-gray-700 font-medium">
                  {user.displayName || "User"}
                </p>
                <hr />
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 hover:bg-pink-50 text-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-pink-50 text-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // Not logged in - Show Login/Register
          <div className="flex gap-2">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg border border-pink-500 text-pink-500 hover:bg-pink-50 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-yellow-400 text-white hover:scale-105 transform transition"
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
