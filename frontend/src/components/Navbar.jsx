import { useState } from "react";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white-800 text-black p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img src="./src/assets/SLTMobitel_logo.svg" alt="Logo" className="h-12" />
        <h1 className="text-2xl font-bold">SLT Gate Pass</h1>
      </div>
      <ul className="flex gap-6">
        <li>
          <a href="/new-request" className="hover:underline">New Request</a>
        </li>
        <li>
          <a href="/my-request" className="hover:underline">My Requests</a>
        </li>
        <li>
          <a href="/executive-approve" className="hover:underline">Executive Approve</a>
        </li>
        <li>
          <a href="/item-tracker" className="hover:underline">Item Tracker</a>
        </li>
        <li className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)} 
            className="hover:underline"
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
    </nav>
  );
};

export default Navbar;
