import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateData, setUpdateData] = useState({
    itemName: '',
    serialNo: '',
    category: '',
    description: '',
    returnable: '',
  });

  useEffect(() => {
    fetchRequestData();
  }, []);

  const fetchRequestData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/requests/${id}`);
      setUpdateData(response.data);
    } catch (error) {
      console.error('Error fetching request data:', error);
    }
  };

  const handleUpdateChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/requests/${id}`, updateData);
      alert('Request updated successfully!');
      navigate('/my-request'); // Redirect to MyRequests page
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Update Request</h2>
      <form onSubmit={handleUpdateSubmit} className="space-y-4">
        <input
          type="text"
          name="itemName"
          value={updateData.itemName}
          onChange={handleUpdateChange}
          className="p-2 w-full border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="serialNo"
          value={updateData.serialNo}
          onChange={handleUpdateChange}
          className="p-2 w-full border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="category"
          value={updateData.category}
          onChange={handleUpdateChange}
          className="p-2 w-full border border-gray-300 rounded-md"
          required
        />
        <textarea
          name="description"
          value={updateData.description}
          onChange={handleUpdateChange}
          className="p-2 w-full border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="returnable"
          value={updateData.returnable}
          onChange={handleUpdateChange}
          className="p-2 w-full border border-gray-300 rounded-md"
          required
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
            onClick={() => navigate('/my-request')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRequest;
