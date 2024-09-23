import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import AddCategories from '../../components/AddCatagories/AddCatagories'; 
import Header from '../../components/Header/Header';
import { toast } from 'react-toastify';

function ShowAllCategory() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10;
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
      handleCloseModal();
    } catch (err) {
      console.error('Failed to update category', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${apiUrl}/api/categories/${id}`);
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.categoryId !== id)
        );
        toast.success("Deleted SuccessFully")
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
    setCurrentPage(1); 
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
        (category.categoryName &&
          category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (category.categoryDescription &&
          category.categoryDescription.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .slice(indexOfFirstCategory, indexOfLastCategory);

  const totalPages = Math.ceil(
    categories.filter(
      (category) =>
        (category.categoryName &&
          category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (category.categoryDescription &&
          category.categoryDescription.toLowerCase().includes(searchTerm.toLowerCase()))
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
      <Header className="UniversalHeader" />
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Categories</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Add Category
            </button>
          </div>

          <div className="mb-6 flex items-center">
            <input
              type="text"
              placeholder="Search by name or description"
              className="border p-2 rounded-lg w-20 text-base"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <span className="ml-3 material-icons text-gray-600 text-lg">search</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category.categoryId} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{category.categoryId}</td>
                      <td className="border px-4 py-2">{category.categoryName || 'N/A'}</td>
                      <td className="border px-4 py-2">{category.categoryDescription || 'N/A'}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleEdit(category.categoryId)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.categoryId)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6">
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              onClick={previousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          {/* Add Category Modal */}
          {isModalOpen && (
            <AddCategories
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              categoryId={selectedCategoryId}
              onUpdate={updateCategory}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default ShowAllCategory;
