import { useState } from "react";
import PropTypes from "prop-types";

const Navbar = ({ role, logout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-blue-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Gate Pass Management System</h1>
      <ul className="flex gap-6">
        {/* Conditional links for normal users */}
        {role === "user" && (
          <>
            <li>
              <a href="/new-request" className="hover:underline">
                New Request
              </a>
            </li>
            <li>
              <a href="/my-request" className="hover:underline">
                My Requests
              </a>
            </li>
          </>
        )}
        {/* Additional links for admins */}
        {role === "admin" && (
          <>
            <li>
              <a href="/new-request" className="hover:underline">
                New Request
              </a>
            </li>
            <li>
              <a href="/my-request" className="hover:underline">
                My Requests
              </a>
            </li>
            <li>
              <a href="/item-tracker" className="hover:underline">
                Item Tracker
              </a>
            </li>
          </>
        )}
        <li className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)} 
            className="hover:underline"
          >
            Account ▼
          </button>
          {dropdownOpen && (
            <div className="absolute bg-white text-black right-0 mt-2 py-2 w-32 shadow-lg rounded">
              {/* Conditionally render account-specific links */}
              {role === "admin" ? (
                <>
                  <a href="/admin" className="block px-4 py-2 hover:bg-gray-200">
                    Admin Dashboard
                  </a>
                  <a href="/user" className="block px-4 py-2 hover:bg-gray-200">
                    User Profile
                  </a>
                </>
              ) : (
                <a href="/user" className="block px-4 py-2 hover:bg-gray-200">
                  User Profile
                </a>
              )}
              <a href="/settings" className="block px-4 py-2 hover:bg-gray-200">
                Settings
              </a>
              {/* Logout button */}
              {role && (
                <button 
                  onClick={logout} 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

Navbar.propTypes = {
  role: PropTypes.string,
  logout: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  role: null,
};

export default Navbar;
