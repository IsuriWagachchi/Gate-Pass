import React, { useState } from "react";
import { Bell, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "/src/assets/SLTMobitel_logo.svg"; // Ensure correct path
import PopupLogout from "../pages/PopupLogout"; // Import the PopupLogout component

const Navbar = ({ logout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLogoutPopupOpen, setLogoutPopupOpen] = useState(false); // State for the logout popup
  const location = useLocation();

  const handleLogout = () => {
    setLogoutPopupOpen(false); // Close the popup after logout
    logout(); // Trigger the logout function passed as prop
  };

  const handleCancelLogout = () => {
    setLogoutPopupOpen(false); // Close the popup without logging out
  };

  return (
    <nav className="p-4 flex justify-between items-center shadow-lg text-white">
      {/* Logo & Title */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-12" />
        <h1 className="text-2xl font-bold ml-4 text-[#1B3D81]">SLT Gate Pass</h1>
      </div>

      {/* Navigation Links */}
      <ul className="flex ml-auto">
        {[
          { path: "/home", label: "Home" },
          { path: "/new-request", label: "New Request" },
          { path: "/my-request", label: "My Requests" },
          { path: "/executive-approve", label: "Executive Approve" },
          { path: "/verify", label: "Verify" },
          { path: "/my-receipt", label: "My Receipt" },
          { path: "/dispatch", label: "Dispatch" },
          { path: "/item-tracker", label: "Item Tracker" },
          { path: "/admin", label: "Admin" }
        ].map(({ path, label }) => (
          <li key={path} className="h-full flex items-center">
            <NavLink
              to={path}
              className={`px-6 py-3 text-lg font-medium shadow-md transition-all ${
                location.pathname === path
                  ? "bg-[#1B3D81] text-white"
                  : "bg-white text-[#1B3D81] hover:bg-[#1B3D81] hover:text-white"
              }`}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* User Dropdown & Icons */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <NavLink to="/notifications" className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 ml-2">
          <Bell size={20} className="text-[#1B3D81]" />
        </NavLink>

        {/* User Profile & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
          >
            <User size={20} className="text-[#1B3D81]" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40">
              <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-100 text-[#1B3D81]">
                Profile
              </NavLink>

              {/* Trigger the PopupLogout */}
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-[#1B3D81]"
                onClick={() => setLogoutPopupOpen(true)}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PopupLogout Confirmation */}
      {isLogoutPopupOpen && (
        <PopupLogout
          onConfirm={handleLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </nav>
  );
};

export default Navbar;
