import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ItemTrackerView from './ItemTrackerView';

const ItemTracker = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/requests');
      const returnableItems = response.data.filter(request => request.returnable === "yes");
      setRequests(returnableItems);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 border-4 border-blue-200 rounded-lg shadow-lg bg-white w-full mt-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left">Item Tracker</h2>
      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
        <table className="w-full min-w-max border-collapse border rounded-lg shadow-lg">
          <thead className="bg-[#2A6BAC] text-white">
            <tr>
              <th className="py-3 px-4 border text-left">Ref No</th>
              <th className="py-3 px-4 border text-left">Item Name</th>
              <th className="py-3 px-4 border text-left">Category</th>
              <th className="py-3 px-4 border text-left">In Location</th>
              <th className="py-3 px-4 border text-left">Out Location</th>
              <th className="py-3 px-4 border text-left">Returnable</th>
              <th className="py-3 px-4 border text-center">Full Details</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={request._id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                <td className="py-2 px-4 border">{request._id}</td>
                <td className="py-2 px-4 border">{request.itemName}</td>
                <td className="py-2 px-4 border">{request.category}</td>
                <td className="py-2 px-4 border">{request.inLocation}</td>
                <td className="py-2 px-4 border">{request.outLocation}</td>
                <td className="py-2 px-4 border">{request.returnable}</td>
                <td className="py-2 px-4 border text-center">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white px-4 py-1 rounded mr-2"
                    onClick={() => navigate(`/item-tracker-view/${request._id}`)}
                  >
                    View
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

export default ItemTracker;
