import React, { useState, useEffect } from 'react';
import './Role.css'; // CSS specific for Roles
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import AddRoleForm from '../../components/AddRole/AddRole'; // Form for adding/editing roles
import Header from '../../components/Header/Header';
function Roles() {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 10; // Number of roles per page
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/roles`);
      setRoles(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch roles', err);
      setRoles([]);
    }
  };

  const updateRole = async (id, updatedData) => {
    try {
      await axios.put(`${apiUrl}/api/roles/${id}`, updatedData);
      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.roleId === id ? { ...role, ...updatedData } : role
        )
      );
      handleCloseModal(); // Close the modal after updating
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await axios.delete(`${apiUrl}/api/roles/${id}`);
        setRoles((prevRoles) =>
          prevRoles.filter((role) => role.roleId !== id)
        );
      } catch (err) {
        console.error('Failed to delete role', err);
      }
    }
  };

  const handleEdit = (id) => {
    setSelectedRoleId(id);
    setIsModalOpen(true);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoleId(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Pagination logic
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;

  const filteredRoles = roles
    .filter(
      (role) =>
        (role.roleName && role.roleName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (role.roleDescription && role.roleDescription.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .slice(indexOfFirstRole, indexOfLastRole);

  const totalPages = Math.ceil(
    roles.filter(
      (role) =>
        (role.roleName && role.roleName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (role.roleDescription && role.roleDescription.toLowerCase().includes(searchTerm.toLowerCase()))
    ).length / rolesPerPage
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
        <h1 className="roles-page-title">Roles</h1>
        <div className="role-add-btn" onClick={() => setIsModalOpen(true)}>
          Add Role
        </div>
      </div>
      <div className="role-search-container">
        <input
          type="text"
          placeholder="Search by role name or description"
          className="role-search-bar"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <div className="role-search-icon">
          <span className="material-icons">search</span>
        </div>
      </div>
      <table className="role-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role) => (
              <tr key={role.roleId}>
                <td>{role.roleId}</td>
                <td>{role.roleName || 'N/A'}</td>
                <td>{role.roleDescription || 'N/A'}</td>
                <td>
                  <button className="action-btn view-btn" onClick={() => handleEdit(role.roleId)}>Edit</button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(role.roleId)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No roles found</td>
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
        <AddRoleForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          roleId={selectedRoleId}
          onUpdate={updateRole} // Pass the update function as a prop
        />
      )}
    </div>
    </>
  );
}

export default Roles;