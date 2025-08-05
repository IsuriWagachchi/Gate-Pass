import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SenderDetails from "./SenderDetails";
import { uploadToCloudinary } from '../utils/uploadToCloudinary';

const NewRequest = () => {
  // State declarations
  const [senderDetails, setSenderDetails] = useState({
    sender_name: "",  
    designation: "",
    service_no: "",
    section: "",
    group_number: "",
    contact_number: "",
  });

  const [items, setItems] = useState([{
    itemName: "",
    serialNo: "",
    category: "",
    description: "",
    returnable: "",
    images: [],
    quantity: ""
  }]);

  const [commonData, setCommonData] = useState({
    inLocation: "",
    outLocation: "",
    executiveOfficer: "",
    receiverAvailable: false,
    receiverType: "",
    receiverName: "",
    receiverContact: "",
    receiverGroup: "",
    receiverServiceNumber: "",
    receiverIdNumber: "",
    receiverContactteli:"",
    receiverNonsltName:"",
       receiverNonsltemail:"",
    vehicleNumber: "",
    vehicleMethod: '',
    byHand: ""
  });

  const [error, setError] = useState("");
  const [csvFileName, setCsvFileName] = useState("");
  const [isCSVUploaded, setIsCSVUploaded] = useState(false);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const navigate = useNavigate();

  // Fetch locations and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch locations
        const locationsResponse = await axios.get("http://localhost:5000/api/locations");
        setLocations(locationsResponse.data.data);
        
        // Fetch categories
        const categoriesResponse = await axios.get("http://localhost:5000/api/categories");
        setCategories(categoriesResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load required data. Please try again later.");
      } finally {
        setLoadingLocations(false);
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate byHand and vehicleNumber
    if (commonData.byHand === "No" && !commonData.vehicleNumber.trim()) {
      setError("Vehicle number is required when not delivering by hand");
      return;
    }
    
    if (commonData.byHand === "Yes" && commonData.vehicleNumber.trim()) {
      setError("Vehicle number should be empty when delivering by hand");
      return;
    }

    // Validate receiver details if receiver is available
    if (commonData.receiverAvailable) {
      if (!commonData.receiverType) {
        setError("Please select receiver type (SLT/Non-SLT)");
        return;
      }

      if (commonData.receiverType === "SLT" && !commonData.receiverServiceNumber) {
        setError("Service number is required for SLT receivers");
        return;
      }

      if (commonData.receiverType === "Non-SLT" && (!commonData.receiverIdNumber || !commonData.receiverContactteli || !commonData.receiverNonsltName || !commonData.receiverNonsltemail )) {
        setError("ID number and telephone are required for Non-SLT receivers");
        return;
      }
    }

    try {
      const formDataToSend = new FormData();

      // Add sender details
      Object.keys(senderDetails).forEach(key => {
        formDataToSend.append(key, senderDetails[key]);
      });

      // Add common data
      Object.keys(commonData).forEach(key => {
        if (!commonData.receiverAvailable && 
            ['receiverName', 'receiverContact', 'receiverGroup', 'receiverServiceNumber', 'receiverIdNumber'].includes(key)) {
          return;
        }
        
        // Convert boolean fields properly
        let value = commonData[key];
        if (key === 'receiverAvailable') {
          value = value === true || value === 'true';
        }
        formDataToSend.append(key, value);
      });

      // Process items - handle both CSV-imported and manually added items
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Upload images to Cloudinary if they exist
        const imageUrls = [];
        if (item.images && item.images.length > 0) {
          for (let j = 0; j < item.images.length; j++) {
            if (typeof item.images[j] === 'string') {
              imageUrls.push(item.images[j]);
            } else {
              const uploadedUrl = await uploadToCloudinary(item.images[j]);
              if (uploadedUrl) {
                imageUrls.push(uploadedUrl);
              }
            }
          }
        }

        // Add item data to formData
        formDataToSend.append(`items[${i}][itemName]`, item.itemName);
        formDataToSend.append(`items[${i}][serialNo]`, item.serialNo);
        formDataToSend.append(`items[${i}][category]`, item.category);
        formDataToSend.append(`items[${i}][description]`, item.description);
        formDataToSend.append(`items[${i}][returnable]`, item.returnable);
        formDataToSend.append(`items[${i}][quantity]`, item.quantity);
        
        if (item.image) {
          const uploadedUrl = await uploadToCloudinary(item.image);
          if (uploadedUrl) {
            formDataToSend.append(`items[${i}][image]`, uploadedUrl);
          }
        }
        
        formDataToSend.append(`items[${i}][images]`, JSON.stringify(imageUrls));
      }

      await axios.post("http://localhost:5000/api/requests/create", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/my-request");
    } catch (error) {
      setError("Failed to create request. Please try again.");
      console.error("Error creating request:", error);
    }
  };

  // Common form field handler
  const handleCommonChange = (e) => {
    const { name, value } = e.target;
    setCommonData({
      ...commonData,
      [name]: value
    });
  };

  // Item field handlers
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [name]: value
    };
    setItems(newItems);
  };

  const handleItemImageChange = (index, e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 files
    const newItems = [...items];
    newItems[index].images = files; // Store File objects temporarily
    setItems(newItems);
  };

  // Item management
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

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // CSV import handler
  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCsvFileName(file.name);
    setError("");
    setIsCSVUploaded(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target.result;
        const lines = csvData.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length < 2) {
          setError("CSV file is empty or has no data rows");
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const newItems = [];

        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i].split(',');
          const item = {};

          headers.forEach((header, index) => {
            const value = currentLine[index] ? currentLine[index].trim() : '';
            
            switch(header) {
              case 'itemname':
              case 'item name':
                item.itemName = value;
                break;
              case 'serialno':
              case 'serial no':
                item.serialNo = value;
                break;
              case 'category':
                item.category = value;
                break;
              case 'quantity':
                item.quantity = isNaN(parseInt(value)) ? 1 : parseInt(value);
                break;
              case 'description':
                item.description = value;
                break;
              case 'returnable':
                item.returnable = value.toLowerCase() === 'yes' ? 'yes' : 'no';
                break;
            }
          });

          if (!item.itemName) continue;
          newItems.push({
            itemName: item.itemName || '',
            serialNo: item.serialNo || '',
            category: item.category || '',
            description: item.description || '',
            returnable: item.returnable || 'no',
            quantity: item.quantity || 1,
            images: item.image ? [item.image] : []
          });
        }

        if (newItems.length > 0) {
          setItems(newItems);
          setIsCSVUploaded(true);
        } else {
          setError("No valid items found in CSV");
        }
      } catch (err) {
        setError("Error processing CSV file. Please check the format.");
        console.error("CSV processing error:", err);
      }
    };
    reader.readAsText(file);
  };

  // Function to download CSV template
  const downloadCSVTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "itemName,serialNo,category,quantity,description,returnable\n" +
      "Sample Item,S12345,Electronics,1,This is a sample item,yes\n" +
      "Another Item,7890,Stationery,2,Another sample item,no";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "items_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto p-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {isCSVUploaded && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md">
            CSV items loaded successfully. Please review and complete all required fields.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto bg-white border-2 border-blue-200 p-6 rounded-lg">
          {/* Sender Details Section */}
          <SenderDetails 
            onSenderDetailsChange={(details) => setSenderDetails(details)}
          />
          
          {/* CSV Import Section */}
          <div className="mb-6 border-2 border-blue-400 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Import Items from CSV (Optional)</h3>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="csvImport"
                accept=".csv"
                onChange={handleCSVImport}
                className="hidden"
              />
              <label
                htmlFor="csvImport"
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 cursor-pointer"
              >
                Choose Items CSV File
              </label>
              <button
                type="button"
                onClick={downloadCSVTemplate}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Download Items CSV Template
              </button>
              <span className="text-gray-700">{csvFileName || 'No file chosen'}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              CSV should contain: itemName, serialNo, category, quantity, description, returnable
            </p>
          </div>

          {/* Items List */}
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

                <div>
                  <label htmlFor={`category-${index}`} className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  {loadingCategories ? (
                    <select
                      disabled
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
                    >
                      <option>Loading categories...</option>
                    </select>
                  ) : (
                    <select
                      name="category"
                      id={`category-${index}`}
                      value={item.category}
                      onChange={(e) => handleItemChange(index, e)}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.category_id} value={cat.category_name}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

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
                    min="1"
                  />
                </div>

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

                <div>
                  <label htmlFor={`images-${index}`} className="block text-sm font-medium text-gray-700">
                    Upload Images (Max 5, Optional)
                  </label>
                  <input
                    type="file"
                    name="images"
                    id={`images-${index}`}
                    accept="image/*"
                    multiple
                    onChange={(e) => handleItemImageChange(index, e)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  />
                  {item.images.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Selected {item.images.length} image(s)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-6"
          >
            Add Another Item
          </button>

          {/* Request Details Section */}
          <div className="mb-6 border-2 border-blue-400 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Request Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="inLocation" className="block text-sm font-medium text-gray-700">
                  In Location
                </label>
                {loadingLocations ? (
                  <select
                    disabled
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
                  >
                    <option>Loading locations...</option>
                  </select>
                ) : (
                  <select
                    name="inLocation"
                    id="inLocation"
                    value={commonData.inLocation}
                    onChange={handleCommonChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select In Location</option>
                    {locations.map(location => (
                      <option key={`in-${location.location_id}`} value={location.location_name}>
                        {location.location_name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label htmlFor="outLocation" className="block text-sm font-medium text-gray-700">
                  Out Location
                </label>
                {loadingLocations ? (
                  <select
                    disabled
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
                  >
                    <option>Loading locations...</option>
                  </select>
                ) : (
                  <select
                    name="outLocation"
                    id="outLocation"
                    value={commonData.outLocation}
                    onChange={handleCommonChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Out Location</option>
                    {locations.map(location => (
                      <option key={`out-${location.location_id}`} value={location.location_name}>
                        {location.location_name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

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
                  <option value="Kasun Gunawardhane">Mr. Gunawardana</option>
                  <option value="Mr. Perera">Mr. Perera</option>
                  <option value="Ms. Silva">Ms. Silva</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transport Method
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="byHand"
                      value="By Hand"
                      checked={commonData.byHand === "By Hand"}
                      onChange={handleCommonChange}
                      className="form-radio"
                      required
                    />
                    By Hand
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="byHand"
                      value="By Vehicle"
                      checked={commonData.byHand === "By Vehicle"}
                      onChange={handleCommonChange}
                      className="form-radio"
                    />
                    By Vehicle
                  </label>
                </div>
              </div>

              {commonData.byHand === "By Vehicle" && (
                <>
                  <div>
                    <label htmlFor="vehicleMethod" className="block text-sm font-medium text-gray-700">
                      Vehicle Method
                    </label>
                    <select
                      name="vehicleMethod"
                      id="vehicleMethod"
                      value={commonData.vehicleMethod}
                      onChange={handleCommonChange}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="Car">Car</option>
                      <option value="Van">Van</option>
                      <option value="Truck">Truck</option>
                      <option value="Motorbike">Motorbike</option>
                      <option value="Three-Wheeler">Three-Wheeler</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mt-1">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      id="vehicleNumber"
                      value={commonData.vehicleNumber}
                      onChange={handleCommonChange}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Updated Receiver Available Section */}
          <div className="mb-6 border-2 border-blue-400 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="receiverAvailable"
                name="receiverAvailable"
                checked={commonData.receiverAvailable}
                onChange={(e) => {
                  setCommonData({
                    ...commonData,
                    receiverAvailable: e.target.checked,
                    receiverType: "",
                    ...(!e.target.checked && {
                      receiverName: "",
                      receiverContact: "",
                      receiverGroup: "",
                      receiverServiceNumber: "",
                      receiverIdNumber: ""
                    })
                  });
                }}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="receiverAvailable" className="ml-2 text-lg font-medium text-gray-700">
                Receiver Available
              </label>
            </div>

            {commonData.receiverAvailable && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Receiver Type</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="receiverType"
                        value="SLT"
                        checked={commonData.receiverType === "SLT"}
                        onChange={() => setCommonData({...commonData, receiverType: "SLT"})}
                        className="h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">SLT</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="receiverType"
                        value="Non-SLT"
                        checked={commonData.receiverType === "Non-SLT"}
                        onChange={() => setCommonData({...commonData, receiverType: "Non-SLT"})}
                        className="h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Non-SLT</span>
                    </label>
                  </div>
                </div>

                {commonData.receiverType === "SLT" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="receiverServiceNumber" className="block text-sm font-medium text-gray-700">
                          Receiver Service Number
                        </label>
                        <input
                          type="text"
                          name="receiverServiceNumber"
                          id="receiverServiceNumber"
                          value={commonData.receiverServiceNumber}
                          onChange={async (e) => {
                            const serviceNo = e.target.value;
                            setCommonData({
                              ...commonData,
                              receiverServiceNumber: serviceNo
                            });
                            
                            if (serviceNo) {
                              try {
                                const response = await axios.get(`http://localhost:5000/api/auth/by-service/${serviceNo}`);
                                const user = response.data;
                                if (user) {
                                  setCommonData(prev => ({
                                    ...prev,
                                    receiverName: user.sender_name,
                                    receiverContact: user.contact_number,
                                    receiverGroup: user.group_number
                                  }));
                                }
                              } catch (error) {
                                console.error("Error fetching receiver details:", error);
                              }
                            }
                          }}
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>

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
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
                          readOnly
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
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
                          readOnly
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
                          className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
                          readOnly
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {commonData.receiverType === "Non-SLT" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                      <label htmlFor="receiverNonsltName" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="receiverNonsltName"
                        id="receiverNonsltName"
                        value={commonData.receiverNonsltName || ""}
                        onChange={handleCommonChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                     <div>
                      <label htmlFor="receiverNonsltemail" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="text"
                        name="receiverNonsltemail"
                        id="receiverNonsltemail"
                        value={commonData.receiverNonsltemail || ""}
                        onChange={handleCommonChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="receiverIdNumber" className="block text-sm font-medium text-gray-700">
                        ID Number
                      </label>
                      <input
                        type="text"
                        name="receiverIdNumber"
                        id="receiverIdNumber"
                        value={commonData.receiverIdNumber || ""}
                        onChange={handleCommonChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="receiverContactteli" className="block text-sm font-medium text-gray-700">
                        Telephone Number
                      </label>
                      <input
                        type="text"
                        name="receiverContactteli"
                        id="receiverContactteli"
                        value={commonData.receiverContactteli || ""}
                        onChange={handleCommonChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <button type="submit" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRequest;