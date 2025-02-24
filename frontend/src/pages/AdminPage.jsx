import React, { useState } from 'react';

const AdminPage = () => {
  const [location, setLocation] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [csvFile, setCsvFile] = useState(null);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleItemCategoryChange = (e) => {
    setItemCategory(e.target.value);
  };

  const handleCsvFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('location', location);
    formData.append('itemCategory', itemCategory);

    if (csvFile) {
      formData.append('csvFile', csvFile);
    }

    // Handle form submission (e.g., send data to an API)
    console.log('Form data:', formData);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 ">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6 border-2 border-blue-900">
        <h1 className="col-span-2 text-2xl font-semibold text-center text-gray-700 mb-6">Admin</h1>

        {/* Location and Item Category Fields in the first column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="location" className="block text-gray-600 font-medium">Location:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={handleLocationChange}
              placeholder="Enter location"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="item-category" className="block text-gray-600 font-medium">Item Category:</label>
            <input
              type="text"
              id="item-category"
              value={itemCategory}
              onChange={handleItemCategoryChange}
              placeholder="Enter item category"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* CSV File Upload in the second column */}
        <div className="space-y-2">
          <label htmlFor="csv-upload" className="block text-gray-600 font-medium">Upload CSV File:</label>
          <input
            type="file"
            id="csv-upload"
            accept=".csv"
            onChange={handleCsvFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-2">
          <button
            onClick={handleSubmit}
            className="w-48 py-3 mt-4 bg-blue-900 text-white text-md font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
