// src/Pages/Home/Navbar.jsx
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { FaPaw, FaTachometerAlt, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { Button } from "../../components/ui/button"; 

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = {
    name: "Sondip",
    photoURL: "https://i.pravatar.cc/40?img=68",
  };

  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <FaPaw className="text-primary text-2xl" />
          Pawlume
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-primary font-medium" : "text-gray-600 hover:text-gray-900"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/pets"
            className={({ isActive }) =>
              isActive ? "text-primary font-medium" : "text-gray-600 hover:text-gray-900"
            }
          >
            Pet Listing
          </NavLink>
          <NavLink
            to="/donations"
            className={({ isActive }) =>
              isActive ? "text-primary font-medium" : "text-gray-600 hover:text-gray-900"
            }
          >
            Donation Campaigns
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Desktop User Dropdown */}
          <div className="hidden md:block relative">
            <img
              src={user.photoURL}
              alt={user.name}
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                <div className="px-4 py-2 text-sm font-medium">Hi, {user.name}</div>
                <hr />
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaTachometerAlt /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="outline" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <NavLink
            to="/"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/pets"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pet Listing
          </NavLink>
          <NavLink
            to="/donations"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            Donation Campaigns
          </NavLink>

          {/* Mobile User Links */}
          <div className="border-t mt-2">
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <FaTachometerAlt /> Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
