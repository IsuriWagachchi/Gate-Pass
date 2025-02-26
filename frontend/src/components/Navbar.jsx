import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Bell, Settings, User } from "lucide-react";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // Define state for dropdown
  const location = useLocation(); // Get current page path

  return (
    <nav className="p-4 flex justify-between items-center shadow-lg text-white ">
      <div className="flex items-center">
        <img src="./src/assets/SLTMobitel_logo.svg" alt="Logo" className="h-12" />
        <h1 className="text-2xl font-bold ml-4" style={{ color: "#1B3D81" }}>
          SLT Gate Pass
        </h1>
      </div>
      <ul className="flex gap-10">
        <li>
          <a href="/new-request" className="hover:underline text-blue-800">New Request</a>
        </li>
        <li>
          <a href="/my-request" className="hover:underline text-blue-800">My Requests</a>
        </li>
        <li>
          <a href="/executive-approve" className="hover:underline text-blue-800">Executive Approve</a>
        </li>
        <li>
          <a href="/verify" className="hover:underline text-blue-800">Verify</a>
        </li>
        <li>
          <a href="/new-request" className="hover:underline text-blue-800">My Receipt</a>
        </li>
        <li>
          <a href="/item-tracker" className="hover:underline text-blue-800">Item Tracker</a>
        </li>
        <li className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)} 
            className="hover:underline text-blue-800"
          >
            Account ▼
          </button>
          {dropdownOpen && (
            <div className="absolute bg-white text-black right-0 mt-2 py-2 w-32 shadow-lg rounded">
              <a href="/user" className="block px-4 py-2 hover:bg-gray-200">User</a>
              <a href="/admin" className="block px-4 py-2 hover:bg-gray-200">Admin</a>
            </div>
          )}
        </li>
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
