import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Bell, Settings, User } from "lucide-react";

const Navbar = ({ logout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white text-black p-4 flex justify-between items-center shadow-md">
      {/* Logo Section */}
      <div className="flex items-center gap-4">
        <img src="/src/assets/SLTMobitel_logo.svg" alt="Logo" className="h-12" />
      </div>

      {/* Navigation Links */}
      <ul className="flex gap-8">
        <li><NavLink to="/new-request" className="hover:text-blue-600">New Request</NavLink></li>
        <li><NavLink to="/my-request" className="hover:text-blue-600">My Requests</NavLink></li>
        <li><NavLink to="/executive-approve" className="hover:text-blue-600">Executive Approve</NavLink></li>
        <li><NavLink to="/verify" className="hover:text-blue-600">Verify</NavLink></li>
        <li><NavLink to="/item-tracker" className="hover:text-blue-600">Item Tracker</NavLink></li>
        <li><NavLink to="/admin" className="hover:text-blue-600">Admin</NavLink></li>
      </ul>

      {/* User Dropdown & Icons */}
      <div className="flex items-center gap-4">
        {/* Settings */}
        <NavLink to="/settings" className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100">
          <Settings size={20} className="text-blue-800" />
        </NavLink>
        {/* Notifications */}
        <NavLink to="/notifications" className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100">
          <Bell size={20} className="text-blue-800" />
        </NavLink>
        {/* User Profile */}
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="hover:text-blue-600">
            <User size={20} className="text-blue-800" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40">
              <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</NavLink>
              <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
