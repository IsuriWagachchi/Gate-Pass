import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';

const AdminPage = () => {
  const [csvFile, setCsvFile] = useState(null);
  const navigate = useNavigate();

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

  const downloadTemplate = () => {
    // Create CSV template content with the provided format
    const csvContent = `data:text/csv;charset=utf-8,username,email,password,sender_name,designation,service_no,section,group_number,contact_number,branch_location,role
john_doe,johnd@gmail.com,12345,John Doe,officer,12305,IT,5,771239567,Matara,admin
jane_smith,jane@gmail.com,12345,Jane Smith,clerk,64890,IT,4,770876543,Matara,user
ann_william,ann@gmail.com,12345,Ann William,Manager,67490,Management,3,789879543,Matara,executive_officer
jenny_smith,jenny@gmail.com,12345,Jenny Smith,Manager,65890,HR,6,769876543,Matara,duty_officer
kelly_felder,kelly@gmail.com,12345,Kelly Felder,security,676690,HR,8,779896543,Matara,security_officer`;
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_template.csv");
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-5xl border-2 border-blue-900 relative">
        {/* Back Button - Moved to top right */}
        <button 
          onClick={() => navigate('/admin')}
          className="absolute top-4 right-4 flex items-center gap-2 text-blue-900 hover:text-blue-700 transition-colors"
        >
          <FaArrowLeft className="inline" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Add Users By CSV File</h1>

        <div className="space-y-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="csv-upload" className="block text-lg text-gray-700 font-medium">
                Upload CSV File:
              </label>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 text-blue-900 hover:text-blue-700 transition-colors text-sm"
              >
                <FaDownload className="inline" />
                <span>Download Template</span>
              </button>
            </div>
            <input
              type="file"
              id="csv-upload"
              accept=".csv"
              onChange={handleCsvFileChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-2 text-sm text-gray-500">
              Note: The CSV file should include all required fields as shown in the template.
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;