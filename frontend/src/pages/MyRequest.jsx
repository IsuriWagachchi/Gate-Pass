import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyRequest = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await axios.delete(`http://localhost:5000/api/requests/${id}`);
        setRequests(requests.filter((request) => request._id !== id));
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Requests</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Item Name</th>
              <th className="py-3 px-4 text-left">Serial No</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Returnable</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={request._id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                <td className="py-2 px-4 border">{request.itemName}</td>
                <td className="py-2 px-4 border">{request.serialNo}</td>
                <td className="py-2 px-4 border">{request.category}</td>
                <td className="py-2 px-4 border">{request.description}</td>
                <td className="py-2 px-4 border">{request.returnable}</td>
                <td className="py-2 px-4 border text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded mr-2"
                    onClick={() => navigate(`/update-request/${request._id}`)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded"
                    onClick={() => handleDelete(request._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyRequest;

