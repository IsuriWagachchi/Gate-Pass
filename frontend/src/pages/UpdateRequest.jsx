import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Popup from "./Popup"; // Import the Popup component


const UpdateRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateData, setUpdateData] = useState({
    itemName: "",
    serialNo: "",
    category: "",
    description: "",
    returnable: "",
    image: null,
  });

  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state

  useEffect(() => {
    fetchRequestData();
  }, []);

  const fetchRequestData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/requests/${id}`);
      const { itemName, serialNo, category, description, returnable, image } = response.data;
      setUpdateData({ itemName, serialNo, category, description, returnable, image: null });
      setPreview(image);
    } catch (error) {
      console.error("Error fetching request data:", error);
      setError("Failed to fetch request data.");
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateData({ ...updateData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUpdateData({ ...updateData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("itemName", updateData.itemName);
    formData.append("serialNo", updateData.serialNo);
    formData.append("category", updateData.category);
    formData.append("description", updateData.description);
    formData.append("returnable", updateData.returnable);
    if (updateData.image) {
      formData.append("image", updateData.image);
    }

    try {
      await axios.put(`http://localhost:5000/api/requests/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowPopup(true); // Show the popup after a successful update
    } catch (error) {
      console.error("Error updating request:", error);
      setError("Failed to update request. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      {showPopup && <Popup setShowPopup={setShowPopup} />} {/* Show popup if true */}

      {error && <p className="text-red-500">{error}</p>}

      <div className="max-w-4xl mx-auto p-6 border-2 border-lightblue-400 rounded-md bg-white">
        <h2 className="text-3xl font-bold text-blue-800 mb-1">Update Request</h2>
        <form onSubmit={handleUpdateSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              name="itemName"
              value={updateData.itemName}
              onChange={handleUpdateChange}
              className="p-2 w-full border-2 border-blue-800 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Serial Number</label>
            <input
              type="text"
              name="serialNo"
              value={updateData.serialNo}
              onChange={handleUpdateChange}
              className="p-2 w-full border-2 border-blue-800 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={updateData.category}
              onChange={handleUpdateChange}
              className="p-2 w-full border-2 border-blue-800 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={updateData.description}
              onChange={handleUpdateChange}
              className="p-2 w-full border-2 border-blue-800 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Returnable</label>
            <div className="mt-1 flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="returnable"
                  value="yes"
                  checked={updateData.returnable === "yes"}
                  onChange={handleUpdateChange}
                  className="h-4 w-4"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="returnable"
                  value="no"
                  checked={updateData.returnable === "no"}
                  onChange={handleUpdateChange}
                  className="h-4 w-4"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Item Image</label>
            {preview && (
              <div className="mb-2">
                <img src={preview} alt="Preview" className="h-32 w-32 object-cover rounded-md" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 p-2 w-full border-2 border-blue-800 rounded-md"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={() => navigate("/my-request")}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRequest;
