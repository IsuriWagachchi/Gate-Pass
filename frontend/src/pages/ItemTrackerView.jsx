import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import laptopImage from '../assets/laptop.jpg';

const ItemTrackerView = () => {
  const [request, setRequest] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

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
          <h2>Item Tracking Details</h2>
          <button 
            onClick={() => navigate(-1)} 
            className="text-blue-500 hover:underline"
          >
            ← Back
          </button>
        </div>

        {/* Request Overview */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Out Location:</p>
              <p>{request.outLocation}</p>
            </div>
            <div>
              <p className="font-medium">In Location:</p>
              <p>{request.inLocation}</p>
            </div>
            <div>
              <p className="font-medium">Dispatch Out Status:</p>
              <p className={`inline-block px-2 rounded ${
                request.dispatchStatusOut === "Approved" ? "bg-green-100 text-green-800" :
                request.dispatchStatusOut === "Rejected" ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {request.dispatchStatusOut}
              </p>
            </div>
            <div>
              <p className="font-medium">Dispatch In Status:</p>
              <p className={`inline-block px-2 rounded ${
                request.dispatchStatusIn === "Approved" ? "bg-green-100 text-green-800" :
                request.dispatchStatusIn === "Rejected" ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              }`}>
                {request.dispatchStatusIn}
              </p>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Items ({request.items.length})</h3>
          
          {request.items.map((item, index) => (
            <div key={index} className="p-4 rounded-lg shadow-md border border-gray-300">
              {/* Item Header */}
              <div className="bg-[#2A6BAC] text-white px-4 py-2 rounded-t-md flex justify-between font-bold">
                <span>Item #{index + 1}</span>
                <span>Ref: {item.serialNo}</span>
              </div>

              {/* Item Details */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div>
                  <div className="mb-3">
                    <p className="font-medium">Name:</p>
                    <p>{item.itemName}</p>
                  </div>
                  <div className="mb-3">
                    <p className="font-medium">Category:</p>
                    <p>{item.category}</p>
                  </div>
                  <div className="mb-3">
                    <p className="font-medium">Quantity:</p>
                    <p>{item.quantity}</p>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div className="mb-3">
                    <p className="font-medium">Description:</p>
                    <p>{item.description}</p>
                  </div>
                  <div className="mb-3">
                    <p className="font-medium">Returnable:</p>
                    <p>{item.returnable}</p>
                  </div>
                  <div className="mb-3">
                    <p className="font-medium">Image:</p>
                    <div className="flex items-center mt-2">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.itemName} 
                          className="w-16 h-16 object-cover border rounded"
                        />
                      ) : (
                        <img 
                          src={laptopImage} 
                          alt="Default item" 
                          className="w-16 h-16 object-cover border rounded"
                        />
                      )}
                      <button 
                        className="ml-2 bg-[#2A6BAC] text-white px-3 py-1 rounded text-sm"
                        onClick={() => {
                          // Implement image viewer modal if needed
                          if (item.image) window.open(item.image, '_blank');
                        }}
                      >
                        {item.image ? "View Full" : "No Image"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Request Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Receiver Name:</p>
              <p>{request.receiverName}</p>
            </div>
            <div>
              <p className="font-medium">Receiver Contact:</p>
              <p>{request.receiverContact}</p>
            </div>
            <div>
              <p className="font-medium">Transport Method:</p>
              <p>{request.byHand ? "By Hand" : request.vehicleNumber ? `Vehicle: ${request.vehicleNumber}` : "Not specified"}</p>
            </div>
            <div>
              <p className="font-medium">Created At:</p>
              <p>{new Date(request.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemTrackerView;