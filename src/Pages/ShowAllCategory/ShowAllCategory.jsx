import React, { useState, useEffect } from 'react';
import './ShowAllCategory.css'; // CSS specific for Categories
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import AddCategories from '../../components/AddCatagories/AddCatagories'; // Create an AddCategoryForm similar to AddRoleForm or AddSiteForm
import Header from '../../components/Header/Header';
function ShowAllCategory() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10; // Number of categories per page
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/categories`);
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
      setCategories([]);
    }
  };

  const updateCategory = async (id, updatedData) => {
    try {
      await axios.put(`${apiUrl}/api/categories/${id}`, updatedData);
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.categoryId === id ? { ...category, ...updatedData } : category
        )
      );
      handleCloseModal(); // Close the modal after updating
    } catch (err) {
      console.error('Failed to update category', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${apiUrl}/api/categories/${id}`);
        setCategories((prevCategories) => prevCategories.filter((category) => category.categoryId !== id));
      } catch (err) {
        console.error('Failed to delete category', err);
      }
    }
  };

  const handleEdit = (id) => {
    setSelectedCategoryId(id);
    setIsModalOpen(true);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategoryId(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;

  const filteredCategories = categories
    .filter(
      (category) =>
        (category.categoryName && category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (category.categoryDescription && category.categoryDescription.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .slice(indexOfFirstCategory, indexOfLastCategory);

  const totalPages = Math.ceil(
    categories.filter(
      (category) =>
        (category.categoryName && category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (category.categoryDescription && category.categoryDescription.toLowerCase().includes(searchTerm.toLowerCase()))
    ).length / categoriesPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
    <Header className="UniversalHeader"/>
    <div className={`generate-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className='heading-no-1'>
        <h1 className="categories-page-title">Categories</h1>
        <div className="category-add-btn" onClick={() => setIsModalOpen(true)}>
          Add Category
        </div>
      </div>
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by name or description"
          className="search-bar"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <div className="search-icon">
          <span className="material-icons">search</span>
        </div>
      </div>
      <table className="category-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <tr key={category.categoryId}>
                <td>{category.categoryId}</td>
                <td>{category.categoryName || 'N/A'}</td>
                <td>{category.categoryDescription || 'N/A'}</td>
                <td>
                  <button className="action-btn view-btn" onClick={() => handleEdit(category.categoryId)}>Edit</button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(category.categoryId)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No categories found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button className="pagination-btn" onClick={previousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span className="pagination-info">Page {currentPage} of {totalPages}</span>
        <button className="pagination-btn" onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {isModalOpen && (
        <AddCategories
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          categoryId={selectedCategoryId}
          onUpdate={updateCategory} // Pass the update function as a prop
        />
      )}
    </div>
    </>
  );
}

export default ShowAllCategory;
