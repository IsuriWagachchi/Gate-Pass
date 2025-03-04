import React, { useState } from "react";

const Dispatch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const data = [
    {
      refNo: "3423455",
      name: "Dasun Shanaka",
      mobile: "071 65 56 350",
      inLocation: "Colombo",
      outLocation: "Kurunegala",
      createdDateTime: "2025-02-22 16:30:34",
    },
    {
      refNo: "3424677",
      name: "Nimal Kumara",
      mobile: "071 02 26 930",
      inLocation: "Galle",
      outLocation: "Kurunegala",
      createdDateTime: "2024-08-14 15:34:56",
    },
    {
      refNo: "3423875",
      name: "Amara Disanayake",
      mobile: "071 67 45 098",
      inLocation: "Colombo",
      outLocation: "Kurunegala",
      createdDateTime: "2023-09-20 09:24:43",
    },
  ];

  // Filter data based on search term and selected date
  const filteredData = data.filter((item) => {
    return (
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.refNo.includes(searchTerm) ||
        item.mobile.includes(searchTerm)) &&
      (selectedDate === "" || item.createdDateTime.startsWith(selectedDate))
    );
  });

  return (
    <div className="container mx-auto p-6">
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
        <table className="w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-4 border text-left">Ref.No</th>
                <th className="py-3 px-4 border text-left">Name</th>
                <th className="py-3 px-4 border text-left">Mobile No</th>                
                <th className="py-3 px-4 border text-left">In Location</th>
                <th className="py-3 px-4 border text-left">Out Location</th>
                <th className="py-3 px-4 border text-left">Created Date Time</th>       
                <th className="py-3 px-4 border text-left">Full Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                  <td className="py-2 px-4 border text-left">{item.refNo}</td>
                  <td className="py-2 px-4 border text-left">{item.name}</td>
                  <td className="py-2 px-4 border text-left">{item.mobile}</td>
                  <td className="py-2 px-4 border text-left">{item.inLocation}</td>
                  <td className="py-2 px-4 border text-left">{item.outLocation}</td>
                  <td className="py-2 px-4 border text-left">{item.createdDateTime}</td>
                  <td className="py-2 px-4 border text-center">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded transition-all duration-200"
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
