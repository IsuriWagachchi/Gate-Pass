import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Bell, Settings, User } from "lucide-react";

const Navbar = () => {
  //const [dropdownOpen, setDropdownOpen] = useState(false); 
  const location = useLocation(); 

  return (
    <nav className="p-4 flex justify-between items-center shadow-lg text-white ">
      <div className="flex items-center">
        <img src="./src/assets/SLTMobitel_logo.svg" alt="Logo" className="h-12" />
        <h1 className="text-2xl font-bold ml-4" style={{ color: "#1B3D81" }}>
          SLT Gate Pass
        </h1>
      </div>

      {/* Navigation Links (No Space Between) */}
      <ul className="flex ml-auto">
        {[
          { path: "/", label: "Home" },
          { path: "/new-request", label: "New Request" },
          { path: "/my-request", label: "My Requests" },
          { path: "/executive-approve", label: "Executive Approve" },
          { path: "/verify", label: "Verify" },
          { path: "/my-receipt", label: "My Receipt" },
          { path: "/item-tracker", label: "Item Tracker" }
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

        {/* Account Dropdown (Right-Aligned) */}
        {/* <li className="relative flex items-center">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)} 
            className="px-6 py-3 bg-white text-[#1B3D81] font-medium shadow-md hover:bg-[#1B3D81] hover:text-white"
          >
            Account ▼
          </button>
          {dropdownOpen && (
            <div className="absolute bg-white text-black right-0 mt-2 py-2 w-32 shadow-lg rounded">
              <a href="/user" className="block px-4 py-2 hover:bg-gray-200">User</a>
              <a href="/admin" className="block px-4 py-2 hover:bg-gray-200">Admin</a>
            </div>
          )}
        </li> */}
      </ul>

      {/* Icons (Same as Before) */}
      <div className="flex items-center pl-3">
        {/* <NavLink to="/settings" className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100">
          <Settings size={20} className="text-[#1B3D81]" />
        </NavLink> */}
        <NavLink to="/notifications" className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 ml-2">
          <Bell size={20} className="text-[#1B3D81]" />
        </NavLink>
        <NavLink to="/profile" className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 ml-2">
          <User size={20} className="text-[#1B3D81]" />
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
