import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import laptopImage from "../assets/laptop.jpg";

const DispatchViewIn = () => {
  const [request, setRequest] = useState(null);
  const { id } = useParams();
  const [dispatchStatusIn, setStatusDispatchIn] = useState("");
  const [approverNameIn, setapproverNameIn] = useState("");
  const [serviceNoIn, setserviceNoIn] = useState("");
  const [commentIn, setcommentIn] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/dispatch/getDispatchById/${id}`
      );
      setRequest(response.data);
      setStatusDispatchIn(response.data.dispatchStatusIn);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  const handleUpdateStatus = async (newDispatchStatus) => {
    // Validation
    if (!approverNameIn.trim() || !serviceNoIn.trim()) {
      alert("Name and Service Number are required!");
      return;
    }
    if (newDispatchStatus === "Rejected" && !commentIn.trim()) {
      alert("comment is required for rejection!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/dispatch/updateApprovalIn/${id}`,
        {
          dispatchStatusIn: newDispatchStatus,
          approverNameIn,
          serviceNoIn,
          commentIn,
        }
      );
      setStatusDispatchIn(newDispatchStatus);
      alert(`Request ${newDispatchStatus} successfully!`);
    } catch (error) {
      console.error(
        `Error updating approval status to ${newDispatchStatus}:`,
        error
      );
    }
  };

  if (!request) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="container mx-auto p-6 font-sans flex justify-center">
      <div className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-full max-w-3xl mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 text-blue-700 font-bold text-lg">
          <h2>
            Dispatch In Location Details ➝{" "}
            <span
              className={`${
                dispatchStatusIn === "Approved"
                  ? "text-green-600"
                  : dispatchStatusIn === "Pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {dispatchStatusIn}
            </span>
          </h2>

          <button
            onClick={() => navigate(-1)}
            className="text-blue-500 hover:underline"
          >
            ← Back
          </button>
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
                <p className="text-lg font-medium mb-1">
                  Sender Name:{" "}
                  <span className="font-normal">{request.sender_name}</span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Designation:{" "}
                  <span className="font-normal">{request.designation}</span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Contact Number:{" "}
                  <span className="font-normal">{request.contact_number}</span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Out Location:{" "}
                  <span className="font-normal">{request.outLocation}</span>
                </p>
                <p className="text-lg font-medium mb-1">
                  In Location:{" "}
                  <span className="font-normal">{request.inLocation}</span>
                </p>
                <br />

                {request.dispatchStatusIn !== "Pending" && (
                  <>
                    <p className="text-lg font-medium mb-1">
                      Dispatch In Location Status:{" "}
                      <span
                        className={`px-3 py-2 rounded ${
                          request.dispatchStatusIn === "Approved"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {request.dispatchStatusIn}
                      </span>
                    </p>
                    <p className="text-lg font-medium mb-1">
                      Processed By:{" "}
                      <span className="font-normal">
                        {request.approverNameIn}
                      </span>
                    </p>
                    <p className="text-lg font-medium">
                      Service No:{" "}
                      <span className="font-normal">{request.serviceNoIn}</span>
                    </p>
                  </>
                )}

                {/* Items List */}
                {request.items && request.items.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
                      Item Details
                    </h4>
                    <div className="space-y-3">
                      {request.items.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition"
                        >
                          <p>
                            <strong>Name:</strong> {item.itemName}
                          </p>
                          <p>
                            <strong>Serial No:</strong> {item.serialNo}
                          </p>
                          <p>
                            <strong>Category:</strong> {item.category}
                          </p>
                          <p>
                            <strong>Quantity:</strong> {item.quantity}
                          </p>
                          <p>
                            <strong>Returnable:</strong> {item.returnable}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Section (Image + Button) */}
              <div className="flex flex-col items-center">
                {/* <img src={request.imageUrl} alt="Item" className="w-24 h-24 object-cover border rounded-lg shadow-md" /> */}
                <img
                  src={laptopImage}
                  alt="Item"
                  className="w-24 h-24 object-cover border rounded-lg shadow-md"
                />
                <button className="bg-[#2A6BAC] text-white px-4 py-1 mt-2 rounded-lg shadow-md">
                  View Photo
                </button>
              </div>
            </div>
          </div>

          {dispatchStatusIn === "Pending" && (
            <>
              {/* Approver Name and Service Number */}
              <label className="block font-bold mb-2 text-blue-700 mt-5">
                Processed By
              </label>
              <input
                type="text"
                value={approverNameIn}
                onChange={(e) => setapproverNameIn(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Enter Name"
              />

              <label className="block font-bold mb-2 text-blue-700 mt-3">
                Service Number
              </label>
              <input
                type="text"
                value={serviceNoIn}
                onChange={(e) => setserviceNoIn(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Enter Service Number"
              />

              {/* Comment (Required for Rejection) */}
              <label className="block font-bold mb-2 text-blue-700 mt-3">
                Comment
              </label>
              <textarea
                value={commentIn}
                onChange={(e) => setcommentIn(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Enter Comment Here"
              ></textarea>

              {/* Action Buttons */}
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md"
                  onClick={() => handleUpdateStatus("Approved")}
                >
                  Approve
                </button>
                <button
                  className="bg-red-700 text-white px-6 py-2 rounded-lg shadow-md"
                  onClick={() => handleUpdateStatus("Rejected")}
                >
                  Reject
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DispatchViewIn;
