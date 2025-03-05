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
    <div className="container mx-auto p-6 ">
      
      <div className="overflow-x-auto">
      <div className="container mx-auto p-6 border-4 border-blue-200 rounded-lg shadow-lg bg-white w-full mt-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left">My Request</h2>
        
      <table className="w-full min-w-max border-collapse border rounded-lg shadow-lg">
          <thead className="bg-blue-800 text-white">
            
            <tr>
              <th className="py-3 px-4 text-left">Ref.No</th>
              <th className="py-3 px-4 text-left">Item Name</th>
              
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Full Details</th>
              
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={request._id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                <td className="py-2 px-4 border">{request._id}</td>
                <td className="py-2 px-4 border">{request.itemName}</td>
                
                <td className="py-2 px-4 border">{request.status}</td>
                <td className="py-2 px-4 border">
                  <button
                    className="bg-green-500 hover:bg-green-400 text-white px-4 py-1 rounded"
                    onClick={() => navigate(`/view-request/${request._id}`)}
                  >
                    View Details
                  </button>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    
  );
};

export default MyRequest;
