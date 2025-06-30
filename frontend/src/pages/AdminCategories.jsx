import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminCategories = () => {
  const [category, setCategory] = useState({
    category_id: "",
    category_name: "",
    category_description: "",
    prefix_code: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!category.category_name) {
        setError("Category name is required");
        return;
    }

    try {
        const response = await axios.post("http://localhost:5000/api/categories", {
            category_id: category.category_id,
            category_name: category.category_name,
            category_description: category.category_description,
            prefix_code: category.prefix_code
        });
        
        setSuccess("Category created successfully!");
        setCategory({
            category_id: "",
            category_name: "",
            category_description: "",
            prefix_code: ""
        });
    } catch (error) {
        console.error("Full error response:", error.response);
        const serverError = error.response?.data;
        let errorMessage = "Failed to create category";
        
        if (serverError?.errors) {
            // Handle Mongoose validation errors
            errorMessage = Object.values(serverError.errors).join(', ');
        } else if (serverError?.message) {
            // Handle custom error messages
            errorMessage = serverError.message;
        }
        
        setError(errorMessage);
    }
};
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Category</h2>
        
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white border-2 border-blue-200 p-6 rounded-lg">
          <div className="mb-6 border-2 border-blue-400 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Category Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                  Category ID
                </label>
                <input
                  type="text"
                  name="category_id"
                  id="category_id"
                  value={category.category_id}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="category_name" className="block text-sm font-medium text-gray-700">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="category_name"
                  id="category_name"
                  value={category.category_name}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="category_description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="category_description"
                  id="category_description"
                  value={category.category_description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="prefix_code" className="block text-sm font-medium text-gray-700">
                  Prefix Code
                </label>
                <input
                  type="text"
                  name="prefix_code"
                  id="prefix_code"
                  value={category.prefix_code}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="e.g., ELEC for Electronics"
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
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCategories;