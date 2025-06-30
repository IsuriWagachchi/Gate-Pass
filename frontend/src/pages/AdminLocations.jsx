import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLocation = () => {
  const [location, setLocation] = useState({
    location_id: "",
    location_name: "",
    location_type: "",
    address: "",
    city: "",
    district: "",
    postal_code: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!location.location_name || !location.location_type) {
      setError("Location name and type are required");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/locations", location);
      setSuccess("Location created successfully!");
      // Reset form
      setLocation({
        location_id: "",
        location_name: "",
        location_type: "",
        address: "",
        city: "",
        district: "",
        postal_code: ""
      });
    } catch (error) {
      setError("Failed to create location. Please try again.");
      console.error("Error creating location:", error);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Location</h2>
        
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white border-2 border-blue-200 p-6 rounded-lg">
          <div className="mb-6 border-2 border-blue-400 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Location Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location_id" className="block text-sm font-medium text-gray-700">
                  Location ID
                </label>
                <input
                  type="text"
                  name="location_id"
                  id="location_id"
                  value={location.location_id}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="location_name" className="block text-sm font-medium text-gray-700">
                  Location Name *
                </label>
                <input
                  type="text"
                  name="location_name"
                  id="location_name"
                  value={location.location_name}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="location_type" className="block text-sm font-medium text-gray-700">
                  Location Type *
                </label>
                <select
                  name="location_type"
                  id="location_type"
                  value={location.location_type}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Location Type</option>
                  <option value="Office">Office</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Store">Store</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={location.address}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={location.city}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  id="district"
                  value={location.district}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postal_code"
                  id="postal_code"
                  value={location.postal_code}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLocation;