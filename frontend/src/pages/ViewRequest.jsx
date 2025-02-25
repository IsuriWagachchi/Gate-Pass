import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ViewRequest = () => {
  const [request, setRequest] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequestDetails();
  }, []);

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/requests/${id}`
      );
      setRequest(response.data);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await axios.delete(`http://localhost:5000/api/requests/${id}`);
        navigate("/my-request");
      } catch (error) {
        console.error("Error deleting request:", error);
      }
    }
  };

  const handleUpdate = () => {
    navigate(`/update-request/${id}`);
  };

  return (
    <div className="min-h-screen py-8">
      {request ? (
        <>
          <div className="max-w-4xl mx-auto p-6 border-2 border-lightblue-400 rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold text-blue-800">Request Details</h3>
              <button
                onClick={() => navigate("/my-request")}
                className="flex items-center gap-2 text-blue-500 hover:text-blue-700 font-semibold"
              >
                &#8592; Back to Requests {/* Left arrow symbol */}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Ref. No:", value: request._id },
                { label: "Item Name:", value: request.itemName },
                { label: "Serial No:", value: request.serialNo },
                { label: "Category:", value: request.category },
                { label: "Description:", value: request.description, span: 2 },
                { label: "Returnable:", value: request.returnable },
              ].map((field, index) => (
                <div
                  key={index}
                  className={`border-2 border-blue-800 p-4 rounded-lg ${
                    field.span ? "md:col-span-2" : ""
                  }`}
                >
                  <p className="text-gray-600 font-semibold">{field.label}</p>
                  <p className="text-gray-800">{field.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>Loading request details...</p>
      )}
    </div>
  );
};

export default ViewRequest;
