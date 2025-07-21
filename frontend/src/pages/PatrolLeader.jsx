import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatrolLeader = () => {
  const [requests, setRequests] = useState([]);
  const [branch, setBranch] = useState('');
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userRes = await axios.get('http://localhost:5000/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBranch(userRes.data.branch_location);

        const res = await axios.get('http://localhost:5000/api/patrol-leader', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(res.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter requests by location type
  const incomingRequests = requests.filter(
    req => req.inLocation === branch
  );
  
  const outgoingRequests = requests.filter(
    req => req.outLocation === branch
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 border-4 border-blue-200 rounded-lg shadow-lg bg-white w-full mt-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left">Patrol Leader - {branch}</h2>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-6 py-2 rounded-lg font-semibold text-lg focus:outline-none transition-all duration-200 ${
            tabIndex === 0 ? 'bg-[#2A6BAC] text-white shadow-md' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
          }`}
          onClick={() => setTabIndex(0)}
        >
          Incoming ({incomingRequests.length})
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-semibold text-lg focus:outline-none transition-all duration-200 ${
            tabIndex === 1 ? 'bg-[#2A6BAC] text-white shadow-md' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
          }`}
          onClick={() => setTabIndex(1)}
        >
          Outgoing ({outgoingRequests.length})
        </button>
      </div>

      <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
        {tabIndex === 0 ? (
          <RequestTable requests={incomingRequests} type="incoming" navigate={navigate} />
        ) : (
          <RequestTable requests={outgoingRequests} type="outgoing" navigate={navigate} />
        )}
      </div>
    </div>
  );
};

const RequestTable = ({ requests, type, navigate }) => (
  <table className="w-full min-w-max border-collapse border rounded-lg shadow-lg">
    <thead>
      <tr className="bg-[#2A6BAC] text-white text-lg">
        <th className="py-3 px-4 border text-left">Ref.No</th>
        <th className="py-3 px-4 border text-left">Items</th>
        <th className="py-3 px-4 border text-left">
          {type === 'incoming' ? 'From' : 'To'}
        </th>
        <th className="py-3 px-4 border text-left">Approved By</th>
        <th className="py-3 px-4 border text-left">Date</th>
        <th className="py-3 px-4 border text-left">Action</th>
      </tr>
    </thead>
    <tbody>
      {requests.length > 0 ? (
        requests.map((request, index) => (
          <tr key={request._id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
            <td className="py-2 px-4 border text-left font-mono">
              {request._id.slice(-6).toUpperCase()}
            </td>
            <td className="py-2 px-4 border text-left">
              {request.items.map((item, i) => (
                <div key={i} className="mb-1 last:mb-0">
                  {item.itemName} {item.quantity && `(Qty: ${item.quantity})`}
                </div>
              ))}
            </td>
            <td className="py-2 px-4 border text-left">
              {type === 'incoming' ? request.outLocation : request.inLocation}
            </td>
            <td className="py-2 px-4 border text-left">{request.executiveOfficer}</td>
            <td className="py-2 px-4 border text-left">
              {new Date(request.updatedAt).toLocaleString()}
            </td>
            <td className="py-2 px-4 border text-center">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded transition-all duration-200"
                onClick={() => navigate(`/view-patrol-request/${request._id}`, { state: { request } })}
              >
                View
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="py-4 text-center text-gray-500">
            No {type} requests found
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default PatrolLeader;