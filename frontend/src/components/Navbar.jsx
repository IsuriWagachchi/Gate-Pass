import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Bell, Settings, User } from "lucide-react";
import logo from "/src/assets/SLTMobitel_logo.svg";

const Navbar = () => {
  const location = useLocation(); // Get current page path

  return (
    <nav className="bg-gradient-to-r from-[#1B3D81] to-[#3459A8] p-3 shadow-lg flex items-center justify-between w-full">
      {/* Left Side: Logo & Title */}
      <div className="flex items-center gap-3 px-4">
      <img src={logo} alt="Logo" className="h-10" />
        <h1 className="text-white text-xl font-semibold">SLT Gate Pass</h1>
      </div>

      {/* Center: Navigation Links */}
      <ul className="flex gap-6">
        {[
          { name: "New Request", path: "/new-request" },
          { name: "My Requests", path: "/my-request" },
          { name: "Executive Approve", path: "/executive-approve" },
          { name: "Item Tracker", path: "/item-tracker" },
          { name: "Admin Page", path: "/admin" },
        ].map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                location.pathname === item.path
                  ? "bg-white text-[#1B3D81] shadow-lg"
                  : "text-white hover:bg-white hover:text-[#1B3D81]"
              }`}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Right Side: Icons */}
      <div className="flex items-center gap-3 pr-4">
        <NavLink to="/settings" className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100">
          <Settings size={20} className="text-[#1B3D81]" />
        </NavLink>
        <NavLink to="/notifications" className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100">
          <Bell size={20} className="text-[#1B3D81]" />
        </NavLink>
        <NavLink to="/profile" className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100">
          <User size={20} className="text-[#1B3D81]" />
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
