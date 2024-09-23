import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; // Close icon

const AddCategoryForm = ({ isOpen, onClose, categoryId, onUpdate }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (categoryId) {
      fetchCategoryData(categoryId);
    }
  }, [categoryId]);

  const fetchCategoryData = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/api/categories/${id}`);
      const category = response.data;
      setCategoryName(category.categoryName);
      setCategoryDescription(category.categoryDescription);
    } catch (err) {
      console.error('Failed to fetch category data', err);
      toast.error('Failed to load category data.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryData = { categoryName, categoryDescription };

    try {
      if (categoryId) {
        await axios.put(`${apiUrl}/api/categories/${categoryId}`, categoryData);
        toast.success('Category updated successfully!');
        onUpdate(categoryId, categoryData);
      } else {
        await axios.post(`${apiUrl}/api/categories`, categoryData);
        toast.success('Category added successfully!');
      }
      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Error saving the category', err);
      toast.error('Failed to save the category. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-lg relative overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{categoryId ? 'Edit Category' : 'Add New Category'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="categoryName" className="block text-gray-700">Category Name</label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryDescription" className="block text-gray-700">Category Description</label>
            <textarea
              id="categoryDescription"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="Enter category description"
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {categoryId ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddCategoryForm;
