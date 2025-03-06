import React, { useState, useEffect } from "react";
import axios from "axios";

const Dispatch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchVerifiedRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/dispatch/verified");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching verified requests:", error);
      }
    };
    fetchVerifiedRequests();
  }, []);

  // Filter data based on search term and selected date
  const filteredData = data.filter((item) => {
    return (
      (item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNo.includes(searchTerm) ||
        item.outLocation.toLowerCase().includes(searchTerm) ||
        item.inLocation.toLowerCase().includes(searchTerm)) &&
      (selectedDate === "" || item.createdAt.startsWith(selectedDate))
    );
  });

  return (
    <div className="container mx-auto p-6 border-4 border-blue-200 rounded-lg shadow-lg bg-white w-full mt-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left">
        Dispatch
      </h2>

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

      {/* Table Section */}
      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
        <table className="w-full min-w-max border-collapse border rounded-lg shadow-lg">
            <thead>
              <tr className="bg-[#2A6BAC] text-white">
                <th className="py-3 px-4 border text-left">Ref.No</th>
                <th className="py-3 px-4 border text-left">Name</th>
                <th className="py-3 px-4 border text-left">Category</th>                
                <th className="py-3 px-4 border text-left">In Location</th>
                <th className="py-3 px-4 border text-left">Out Location</th>
                <th className="py-3 px-4 border text-left">Created Date Time</th>       
                <th className="py-3 px-4 border text-center">Full Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
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
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dispatch;
