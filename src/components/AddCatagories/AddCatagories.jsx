import React, { useState, useEffect } from 'react';
import './AddCatagories.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{categoryId ? 'Edit Category' : 'Add New Category'}</h2>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>
        <form onSubmit={handleSubmit} className="add-category-form">
          <div className="form-group">
            <label htmlFor="categoryName">Category Name</label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryDescription">Category Description</label>
            <textarea
              id="categoryDescription"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="Enter category description"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
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
