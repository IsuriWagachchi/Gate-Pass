import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import laptopImage from '../assets/laptop.jpg';

const VerifyView = () => {
  const { id } = useParams();  // Get request ID from URL
  const location = useLocation();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [verify, setStatus] = useState(location.state?.verify || "Pending");  // Get status from navigation

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/verify/${id}`);
        setRequest(response.data);
      } catch (error) {
        console.error("Error fetching request details:", error);
      }
    };
    fetchRequest();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/verify/${id}/verify`, { verify: newStatus });
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (!request) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="container mx-auto p-6 font-sans flex justify-center">
      <div className="bg-white border-2 border-green-500 p-6 rounded-lg shadow-lg w-full max-w-3xl mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 text-green-700 font-bold text-lg">
          <h2>Verification View ➝ <span className="text-[#CC5500]">{verify}</span></h2>
          <button onClick={() => navigate(-1)} className="text-green-500 hover:underline">← Back</button>
        </div>

        {/* Item Details Section */}
        <div className="p-3 rounded-lg shadow-md border border-gray-300">
          {/* Green Header */}
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
                <p className="text-lg font-medium mb-1">Quantity: <span className="font-normal">{request.quantity}</span></p>
                <p className="text-lg font-medium mb-1">In Location: <span className="font-normal">{request.inLocation}</span></p>
                <p className="text-lg font-medium">Out Location: <span className="font-normal">{request.outLocation}</span></p>
              </div>

              {/* Right Section (Image + Button) */}
              <div className="flex flex-col items-center">
                <img src={laptopImage} alt="Item" className="w-24 h-24 object-cover border rounded-lg shadow-md" />
                <button className="bg-[#2A6BAC] text-white px-4 py-1 mt-2 rounded-lg shadow-md">View Photo</button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          {verify === "Pending" && (
            <>
              <label className="block font-bold mb-2 text-green-700 mt-5">Comment</label>
              <textarea className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter Comment Here"></textarea>
              <div className="flex justify-end mt-4 space-x-2">
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md" onClick={() => handleUpdateStatus("Verified")}>Verify</button>
                <button className="bg-red-700 text-white px-6 py-2 rounded-lg shadow-md" onClick={() => handleUpdateStatus("Rejected")}>Reject</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyView;
