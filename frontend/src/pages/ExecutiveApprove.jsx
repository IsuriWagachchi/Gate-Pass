// src/pages/ExecutiveApprove.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExecutiveApprove = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('Pending');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      console.log("Fetching requests...");
  
      const response = await axios.get('http://localhost:5000/api/executive'); // Use direct URL to bypass proxy
      
  
      setRequests(response.data);
    } catch (error) {
      console.error("❌ Error fetching requests:", error.response ? error.response.data : error.message);
    }
  };
  
  

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/api/requests/${id}`, { status });
      setRequests(requests.map(req => req._id === id ? { ...req, status } : req));
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Executive Approval</h2>
      
      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        {['Pending', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded ${
              filter === status ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'
            }`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Item Name</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Status</th>
              {filter === 'Pending' && <th className="py-3 px-4 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.filter(req => req.status === filter).map((request, index) => (
              <tr key={request._id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                <td className="py-2 px-4 border">{request.itemName}</td>
                <td className="py-2 px-4 border">{request.category}</td>
                <td className="py-2 px-4 border">{request.description}</td>
                <td className={`py-2 px-4 border font-bold ${request.status === 'Approved' ? 'text-green-600' : request.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {request.status}
                </td>
                {filter === 'Pending' && (
                  <td className="py-2 px-4 border text-center">
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white px-4 py-1 rounded mr-2"
                      onClick={() => handleUpdateStatus(request._id, 'Approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded"
                      onClick={() => handleUpdateStatus(request._id, 'Rejected')}
                    >
                      Reject
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExecutiveApprove;
