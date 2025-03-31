import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dispatch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [upcomingDispatches, setUpcomingDispatches] = useState([]);
  const [processedDispatches, setProcessedDispatches] = useState([]);
  const [inLocationDispatches, setInLocationDispatches] = useState([]);
  const [processedInLocation, setProcessedInLocation] = useState([]);
  const [activeTab, setActiveTab] = useState("out");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDispatches = async () => {
      try {
        const token = localStorage.getItem("token");
          if (!token) {
            console.error("No token found in localStorage");
            return;
          }

          // Decode the token to get branch_location
        const tokenPayload = JSON.parse(atob(token.split(".")[1])); 
        const userBranch = tokenPayload.branch_location;
        console.log("User's Branch Location:", userBranch);

        const response = await axios.get("http://localhost:5000/api/dispatch/verified", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const allDispatches = response.data;

        setUpcomingDispatches(allDispatches.filter(item => item.dispatchStatusOut === "Pending" && item.dispatchStatusIn === "Pending" && item.outLocation === userBranch));
        setProcessedDispatches(allDispatches.filter(item => item.dispatchStatusOut !== "Pending" && item.outLocation === userBranch));
        setInLocationDispatches(allDispatches.filter(item => item.dispatchStatusOut === "Approved" && item.dispatchStatusIn === "Pending" && item.inLocation === userBranch));
        setProcessedInLocation(allDispatches.filter(item => item.dispatchStatusOut === "Approved" && item.dispatchStatusIn !== "Pending" && item.inLocation === userBranch));
      } catch (error) {
        console.error("Error fetching dispatches:", error);
      }
    };
    fetchDispatches();
  }, []);

  const getStatusStyle = (status) => {
    if (status === "Approved") return "bg-green-200 text-green-800 font-bold";
    if (status === "Rejected") return "bg-red-200 text-red-800 font-bold";
    return "";
  };

  const filterDispatches = (dispatches) => {
    return dispatches.filter(item => {
      const matchesSearch =
        item.serialNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.inLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.outLocation?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = selectedDate ? new Date(item.createdAt).toISOString().split('T')[0] === selectedDate : true;
      
      return matchesSearch && matchesDate;
    });
  };

  return (
    <div className="container mx-auto p-6 border-4 border-blue-200 rounded-lg shadow-lg bg-white w-full mt-12">
      <div className="flex items-center justify-between mb-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left">
        Dispatch
      </h2>
      <div>
        <button className={`px-4 py-2 rounded-l-lg ${activeTab === "out" ? "bg-[#1B3D81] text-white" : "bg-gray-300"}`} onClick={() => setActiveTab("out")}>Out Location</button>
        <button className={`px-4 py-2 rounded-r-lg ${activeTab === "in" ? "bg-[#1B3D81] text-white" : "bg-gray-300"}`} onClick={() => setActiveTab("in")}>In Location</button>
      </div>
      </div>

      {/* Search and Date Picker Section */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-[28rem] mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[28rem]">
          <input
            type="date"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {activeTab === "out" && (
      <>
      {/* Upcoming Dispatches Table */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Upcoming Dispatches</h3>
      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
        <table className="w-full min-w-max border-collapse border rounded-lg shadow-lg">
            <thead>
              <tr className="bg-[#2A6BAC] text-white">
                <th className="py-3 px-4 border text-left">Ref.No</th>
                <th className="py-3 px-4 border text-left">Name</th>
                <th className="py-3 px-4 border text-left">Category</th>                
                <th className="py-3 px-4 border text-left">In Location</th>
                <th className="py-3 px-4 border text-left">Out Location</th>
                <th className="py-3 px-4 border text-left">Created Date</th>       
                <th className="py-3 px-4 border text-center">Full Details</th>
              </tr>
            </thead>
            <tbody>
              {filterDispatches(upcomingDispatches).map((item, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                  <td className="py-2 px-4 border text-left">{item.serialNo}</td>
                  <td className="py-2 px-4 border text-left">{item.itemName}</td>
                  <td className="py-2 px-4 border text-left">{item.category}</td>
                  <td className="py-2 px-4 border text-left">{item.inLocation}</td>
                  <td className="py-2 px-4 border text-left">{item.outLocation}</td>
                  <td className="py-2 px-4 border text-left">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-4 border text-center">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded mr-2"
                      onClick={() => navigate(`/dispatch-view/${item._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filterDispatches(upcomingDispatches).length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
        </table>
      </div>

      {/* Processed Dispatches Table */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4 mt-9">Processed Dispatches</h3>
      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
        <table className="w-full border-collapse border rounded-lg shadow-lg">
          <thead>
            <tr className="bg-[#2A6BAC] text-white">
              <th className="py-3 px-4 border text-left">Ref.No</th>
              <th className="py-3 px-4 border text-left">Name</th>
              <th className="py-3 px-4 border text-left">Category</th>
              <th className="py-3 px-4 border text-left">In Location</th>
              <th className="py-3 px-4 border text-left">Out Location</th>
              <th className="py-3 px-4 border text-left">Created Date</th>
              <th className="py-3 px-4 border text-center">Status</th>
              <th className="py-3 px-4 border text-center">Full Details</th>
            </tr>
          </thead>
          <tbody>
            {filterDispatches(processedDispatches).map((item, index) => (
              <tr key={index} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                <td className="py-2 px-4 border text-left">{item.serialNo}</td>
                <td className="py-2 px-4 border text-left">{item.itemName}</td>
                <td className="py-2 px-4 border text-left">{item.category}</td>
                <td className="py-2 px-4 border text-left">{item.inLocation}</td>
                <td className="py-2 px-4 border text-left">{item.outLocation}</td>
                <td className="py-2 px-4 border text-left">{new Date(item.createdAt).toLocaleString()}</td>
                <td className={`py-2 px-4 border text-center ${getStatusStyle(item.dispatchStatusOut)}`}>
                  {item.dispatchStatusOut}
                </td>
                <td className="py-2 px-4 border text-center">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                    onClick={() => navigate(`/dispatch-view/${item._id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filterDispatches(processedDispatches).length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </>)}
      
      {activeTab === "in" && (
      <>
      {/* Upcoming Dispatches Table */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Upcoming Dispatches</h3>
      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
        <table className="w-full min-w-max border-collapse border rounded-lg shadow-lg">
            <thead>
              <tr className="bg-[#2A6BAC] text-white">
                <th className="py-3 px-4 border text-left">Ref.No</th>
                <th className="py-3 px-4 border text-left">Name</th>
                <th className="py-3 px-4 border text-left">Category</th>                
                <th className="py-3 px-4 border text-left">In Location</th>
                <th className="py-3 px-4 border text-left">Out Location</th>
                <th className="py-3 px-4 border text-left">Created Date</th>       
                <th className="py-3 px-4 border text-center">Full Details</th>
              </tr>
            </thead>
            <tbody>
              {filterDispatches(inLocationDispatches).map((item, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                  <td className="py-2 px-4 border text-left">{item.serialNo}</td>
                  <td className="py-2 px-4 border text-left">{item.itemName}</td>
                  <td className="py-2 px-4 border text-left">{item.category}</td>
                  <td className="py-2 px-4 border text-left">{item.inLocation}</td>
                  <td className="py-2 px-4 border text-left">{item.outLocation}</td>
                  <td className="py-2 px-4 border text-left">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-4 border text-center">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded mr-2"
                      onClick={() => navigate(`/dispatch-view-In/${item._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filterDispatches(inLocationDispatches).length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
        </table>
      </div>

      {/* Processed Dispatches Table */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-4 mt-9">Processed Dispatches</h3>
      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
        <table className="w-full border-collapse border rounded-lg shadow-lg">
          <thead>
            <tr className="bg-[#2A6BAC] text-white">
              <th className="py-3 px-4 border text-left">Ref.No</th>
              <th className="py-3 px-4 border text-left">Name</th>
              <th className="py-3 px-4 border text-left">Category</th>
              <th className="py-3 px-4 border text-left">In Location</th>
              <th className="py-3 px-4 border text-left">Out Location</th>
              <th className="py-3 px-4 border text-left">Created Date</th>
              <th className="py-3 px-4 border text-center">Status</th>
              <th className="py-3 px-4 border text-center">Full Details</th>
            </tr>
          </thead>
          <tbody>
            {filterDispatches(processedInLocation).map((item, index) => (
              <tr key={index} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                <td className="py-2 px-4 border text-left">{item.serialNo}</td>
                <td className="py-2 px-4 border text-left">{item.itemName}</td>
                <td className="py-2 px-4 border text-left">{item.category}</td>
                <td className="py-2 px-4 border text-left">{item.inLocation}</td>
                <td className="py-2 px-4 border text-left">{item.outLocation}</td>
                <td className="py-2 px-4 border text-left">{new Date(item.createdAt).toLocaleString()}</td>
                <td className={`py-2 px-4 border text-center ${getStatusStyle(item.dispatchStatusIn)}`}>
                  {item.dispatchStatusIn}
                </td>
                <td className="py-2 px-4 border text-center">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                    onClick={() => navigate(`/dispatch-view-In/${item._id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filterDispatches(processedInLocation).length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </>
      )}
    </div>
  );
};

export default Dispatch;
