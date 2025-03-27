import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SenderDetails from "./SenderDetails";

const NewRequest = () => {
  // State to handle single item
  const [formData, setFormData] = useState({
    itemName: "",
    serialNo: "",
    category: "",
    description: "",
    returnable: "",
    image: null,
    inLocation: "",
    outLocation: "",
    executiveOfficer: "",
    receiverAvailable: "",
    receiverName: "",
    receiverContact: "",
    receiverGroup: "",
    receiverServiceNumber: "",
    quantity: "",
    vehicleNumber: "",
    byHand: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Function to handle image changes
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      await axios.post("http://localhost:5000/api/requests/create", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/my-request");
    } catch (error) {
      setError("Failed to create request. Please try again.");
      console.error("Error creating request:", error);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto p-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto bg-white border-2 border-blue-200 p-6 rounded-lg">
          {/* Sender Details Section */}
          <SenderDetails />

          {/* Item Details Card */}
          <div className="mb-6 border-2 border-blue-400 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Item Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Item Name */}
              <div>
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  type="text"
                  name="itemName"
                  id="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Serial No */}
              <div>
                <label htmlFor="serialNo" className="block text-sm font-medium text-gray-700">
                  Serial No
                </label>
                <input
                  type="text"
                  name="serialNo"
                  id="serialNo"
                  value={formData.serialNo}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Returnable */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Returnable</label>
                <div className="mt-1 flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="returnable"
                      value="yes"
                      checked={formData.returnable === "yes"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="returnable"
                      value="no"
                      checked={formData.returnable === "no"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {/* Upload Image */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Upload Image
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Location & Officer Details Card */}
          <div className="mb-6 border-2 border-blue-400 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* In Location */}
              <div>
                <label htmlFor="inLocation" className="block text-sm font-medium text-gray-700">
                  In Location
                </label>
                <select
                  name="inLocation"
                  id="inLocation"
                  value={formData.inLocation}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select In Location</option>
                  <option value="Gampaha Office">Gampaha Office</option>
                  <option value="Kandy Office">Kandy Office</option>
                  <option value="Matara Office">Matara Office</option>
                </select>
              </div>

              {/* Out Location */}
              <div>
                <label htmlFor="outLocation" className="block text-sm font-medium text-gray-700">
                  Out Location
                </label>
                <select
                  name="outLocation"
                  id="outLocation"
                  value={formData.outLocation}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Out Location</option>
                  <option value="Colombo Office">Colombo Office</option>
                  <option value="Galle Office">Galle Office</option>
                  <option value="Kurunegala Office">Kurunegala Office</option>
                </select>
              </div>

              {/* Executive Officer */}
              <div>
                <label htmlFor="executiveOfficer" className="block text-sm font-medium text-gray-700">
                  Executive Officer
                </label>
                <select
                  name="executiveOfficer"
                  id="executiveOfficer"
                  value={formData.executiveOfficer}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Executive Officer</option>
                  <option value="Mr. Gunawardana">Mr. Gunawardana</option>
                  <option value="Mr. Perera">Mr. Perera</option>
                  <option value="Ms. Silva">Ms. Silva</option>
                </select>
              </div>

              {/* Vehicle Number */}
              <div>
                <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  name="vehicleNumber"
                  id="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              {/* By Hand */}
              <div>
                <label htmlFor="byHand" className="block text-sm font-medium text-gray-700">
                  By Hand
                </label>
                <select
                  name="byHand"
                  id="byHand"
                  value={formData.byHand}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Receiver Availability Card */}
          <div className="mb-6 border-2 border-blue-400 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Receiver Availability</h3>
            <div className="mt-1 flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="receiverAvailable"
                  value="yes"
                  checked={formData.receiverAvailable === "yes"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="receiverAvailable"
                  value="no"
                  checked={formData.receiverAvailable === "no"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="ml-2 text-gray-700">No</span>
              </label>
            </div>

            {/* Additional fields when receiver is available */}
            {formData.receiverAvailable === "yes" && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="receiverName" className="block text-sm font-medium text-gray-700">
                    Receiver Name
                  </label>
                  <input
                    type="text"
                    name="receiverName"
                    id="receiverName"
                    value={formData.receiverName}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="receiverContact" className="block text-sm font-medium text-gray-700">
                    Contact No
                  </label>
                  <input
                    type="text"
                    name="receiverContact"
                    id="receiverContact"
                    value={formData.receiverContact}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="receiverGroup" className="block text-sm font-medium text-gray-700">
                    Group
                  </label>
                  <input
                    type="text"
                    name="receiverGroup"
                    id="receiverGroup"
                    value={formData.receiverGroup}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="receiverServiceNumber" className="block text-sm font-medium text-gray-700">
                    Service Number
                  </label>
                  <input
                    type="text"
                    name="receiverServiceNumber"
                    id="receiverServiceNumber"
                    value={formData.receiverServiceNumber}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRequest;