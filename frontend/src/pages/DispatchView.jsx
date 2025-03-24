import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import laptopImage from "../assets/laptop.jpg";

const DispatchView = () => {
  const [request, setRequest] = useState(null);
  const { id } = useParams();
  const location = useLocation();
  const [dispatchStatus, setStatusDispatch] = useState("");
  const [approverName, setApproverName] = useState("");
  const [serviceNo, setServiceNo] = useState("");
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  useEffect(() => {
    if (location.state && location.state.dispatchStatus) {
      setStatusDispatch(location.state.dispatchStatus);
    }
  }, [location.state]);

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/dispatch/getDispatchById/${id}`
      );
      setRequest(response.data);
      setStatusDispatch(response.data.dispatchStatus);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  const handleUpdateStatus = async (newDispatchStatus) => {
    // Validation
    if (!approverName.trim() || !serviceNo.trim()) {
      alert("Name and Service Number are required!");
      return;
    }
    if (newDispatchStatus === "Rejected" && !comment.trim()) {
      alert("Comment is required for rejection!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/dispatch/updateApproval/${id}`,
        {
          dispatchStatus: newDispatchStatus,
          approverName,
          serviceNo,
          comment: newDispatchStatus === "Rejected" ? comment : "",
        }
      );
      setStatusDispatch(newDispatchStatus);
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
            Dispatch Details ➝{" "}
            <span
              className={`${
                dispatchStatus === "Approved"
                  ? "text-green-600"
                  : dispatchStatus === "Pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {dispatchStatus}
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
                  Item Name:{" "}
                  <span className="font-normal">{request.itemName}</span>
                </p>
                <p className="text-lg font-medium mb-1">Quantity: <span className="font-normal">{request.quantity}</span></p>
                <p className="text-lg font-medium mb-1">
                  Serial No:{" "}
                  <span className="font-normal">{request.serialNo}</span>
                </p>
                <p className="text-lg font-medium mb-1">
                  Returnable:{" "}
                  <span className="font-normal">{request.returnable}</span>
                </p>
                <br />

                {request.dispatchStatus !== "Pending" && (
                  <>
                    <p className="text-lg font-medium mb-1">
                      Status:{" "}
                      <span
                        className={`px-3 py-2 rounded ${
                          request.dispatchStatus === "Approved"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {request.dispatchStatus}
                      </span>
                    </p>
                    <br />
                    <p className="text-lg font-medium mb-1">
                      Processed By:{" "}
                      <span className="font-normal">
                        {request.approverName}
                      </span>
                    </p>
                    <p className="text-lg font-medium">
                      Service No:{" "}
                      <span className="font-normal">{request.serviceNo}</span>
                    </p>
                  </>
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

          {dispatchStatus === "Pending" && (
            <>
              {/* Approver Name and Service Number */}
              <label className="block font-bold mb-2 text-blue-700 mt-5">
                Processed By
              </label>
              <input
                type="text"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Enter Name"
              />

              <label className="block font-bold mb-2 text-blue-700 mt-3">
                Service Number
              </label>
              <input
                type="text"
                value={serviceNo}
                onChange={(e) => setServiceNo(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Enter Service Number"
              />

              {/* Comment (Required for Rejection) */}
              <label className="block font-bold mb-2 text-blue-700 mt-3">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
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

export default DispatchView;
