import React, { useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [csvFile, setCsvFile] = useState(null);

  const handleCsvFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!csvFile) {
      alert('Please select a file!');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', csvFile);

    try {
      const response = await axios.post('http://localhost:5000/api/upload/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert(response.data.message);
    } catch (error) {
      alert('Error uploading file');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl border-2 border-blue-900">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Admin</h1>

        <div className="space-y-4">
          <label htmlFor="csv-upload" className="block text-gray-600 font-medium">Upload CSV File:</label>
          <input
            type="file"
            id="csv-upload"
            accept=".csv"
            onChange={handleCsvFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-center mt-4">
          <button
            onClick={handleSubmit}
            className="w-48 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
