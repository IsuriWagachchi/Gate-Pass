import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SenderDetails from "./SenderDetails";

const NewRequest = () => {
  // State to handle multiple items
  const [items, setItems] = useState([
    {
      itemName: "",
      serialNo: "",
      category: "",
      description: "",
      returnable: "",
      image: null,
      quantity: ""
    }
  ]);

  // Common fields state
  const [commonData, setCommonData] = useState({
    inLocation: "",
    outLocation: "",
    executiveOfficer: "",
    receiverName: "",
    receiverContact: "",
    receiverGroup: "",
    receiverServiceNumber: "",
    vehicleNumber: "",
    byHand: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle common field changes
  const handleCommonChange = (e) => {
    const { name, value } = e.target;
    setCommonData({
      ...commonData,
      [name]: value
    });
  };

  // Handle item field changes
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [name]: value
    };
    setItems(newItems);
  };

  // Handle item image changes
  const handleItemImageChange = (index, e) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      image: e.target.files[0]
    };
    setItems(newItems);
  };

  // Add new item
  const addItem = () => {
    setItems([
      ...items,
      {
        itemName: "",
        serialNo: "",
        category: "",
        description: "",
        returnable: "",
        image: null,
        quantity: ""
      }
    ]);
  };

  // Remove item
  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Add common fields
      Object.keys(commonData).forEach(key => {
        formDataToSend.append(key, commonData[key]);
      });

      // Add items
      items.forEach((item, index) => {
        Object.keys(item).forEach(key => {
          if (key !== 'image' && item[key] !== null) {
            formDataToSend.append(`items[${index}][${key}]`, item[key]);
          } else if (key === 'image' && item[key]) {
            formDataToSend.append(`items[${index}][image]`, item[key]);
          }
        });
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
          <SenderDetails></SenderDetails>
          
          {/* Render items */}
          {items.map((item, index) => (
            <div key={index} className="mb-6 border-2 border-blue-400 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Item {index + 1} Details</h3>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Item Name */}
                <div>
                  <label htmlFor={`itemName-${index}`} className="block text-sm font-medium text-gray-700">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    id={`itemName-${index}`}
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* Serial No */}
                <div>
                  <label htmlFor={`serialNo-${index}`} className="block text-sm font-medium text-gray-700">
                    Serial No
                  </label>
                  <input
                    type="text"
                    name="serialNo"
                    id={`serialNo-${index}`}
                    value={item.serialNo}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor={`category-${index}`} className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    id={`category-${index}`}
                    value={item.category}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    id={`quantity-${index}`}
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id={`description-${index}`}
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
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
                        checked={item.returnable === "yes"}
                        onChange={(e) => handleItemChange(index, e)}
                        className="h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="returnable"
                        value="no"
                        checked={item.returnable === "no"}
                        onChange={(e) => handleItemChange(index, e)}
                        className="h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {/* Upload Image */}
                <div>
                  <label htmlFor={`image-${index}`} className="block text-sm font-medium text-gray-700">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    id={`image-${index}`}
                    accept="image/*"
                    onChange={(e) => handleItemImageChange(index, e)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add Item Button */}
          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-6"
          >
            Add Another Item
          </button>

          {/* Location & Officer Details Card */}
          <div className="mb-6 border-2 border-blue-400 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Request Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* In Location */}
              <div>
                <label htmlFor="inLocation" className="block text-sm font-medium text-gray-700">
                  In Location
                </label>
                <select
                  name="inLocation"
                  id="inLocation"
                  value={commonData.inLocation}
                  onChange={handleCommonChange}
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
                  value={commonData.outLocation}
                  onChange={handleCommonChange}
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
                  value={commonData.executiveOfficer}
                  onChange={handleCommonChange}
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
                  value={commonData.vehicleNumber}
                  onChange={handleCommonChange}
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
                  value={commonData.byHand}
                  onChange={handleCommonChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Receiver Details Card */}
          <div className="mb-6 border-2 border-blue-400 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Receiver Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="receiverName" className="block text-sm font-medium text-gray-700">
                  Receiver Name
                </label>
                <input
                  type="text"
                  name="receiverName"
                  id="receiverName"
                  value={commonData.receiverName}
                  onChange={handleCommonChange}
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
                  value={commonData.receiverContact}
                  onChange={handleCommonChange}
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
                  value={commonData.receiverGroup}
                  onChange={handleCommonChange}
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
                  value={commonData.receiverServiceNumber}
                  onChange={handleCommonChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
            </div>
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