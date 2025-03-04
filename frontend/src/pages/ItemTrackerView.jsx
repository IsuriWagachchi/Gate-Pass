import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import laptopImage from '../assets/laptop.jpg';

const ViewRequest = () => {
  const [request, setRequest] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/requests/${id}`);
      setRequest(response.data);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  if (!request) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="container mx-auto p-6 font-sans flex justify-center">
      <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-3xl mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 text-blue-700 font-bold text-lg">
          <h2>Request Details</h2>
          <button onClick={() => navigate(-1)} className="text-blue-500 hover:underline">← Back</button>
        </div>

        {/* Request Details Section */}
        <div className="p-3 rounded-lg shadow-md border border-gray-300">
          {/* Blue Header */}
          <div className="bg-[#2A6BAC] text-white px-4 py-2 rounded-t-md flex justify-between font-bold">
            <span>Item Details</span>
            <span>Ref. No: {request._id}</span>
          </div>

          {/* Item Details Box */}
                    <div className="p-3 bg-white rounded-b-md border border-gray-300">
                      <div className="flex justify-between items-start space-x-4">
                        {/* Left Section */}
                        <div className="flex-1">
                          <p className="text-lg font-medium mb-1">Item Name: <span className="font-normal">{request.itemName}</span></p>
                          <p className="text-lg font-medium mb-1">Serial No: <span className="font-normal">{request.serialNo}</span></p>
                          <p className="text-lg font-medium">Returnable: <span className="font-normal">{request.returnable }</span></p>
                        </div>
          
                        {/* Right Section (Image + Button) */}
                        <div className="flex flex-col items-center">
                          {/* <img src={request.imageUrl} alt="Item" className="w-24 h-24 object-cover border rounded-lg shadow-md" /> */}
                          <img src={laptopImage} alt="Item" className="w-24 h-24 object-cover border rounded-lg shadow-md" />
                          <button className="bg-[#2A6BAC] text-white px-4 py-1 mt-2 rounded-lg shadow-md">View Photo</button>
                        </div>
                      </div>
                    </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRequest;