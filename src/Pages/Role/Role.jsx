import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import AddRoleForm from '../../components/AddRole/AddRole'; // AddRoleForm component
import Header from '../../components/Header/Header';

function Roles() {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 10; 
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
      handleCloseModal(); 
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
    setCurrentPage(1); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoleId(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
      <Header className="UniversalHeader" />
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Roles</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Add Role
            </button>
          </div>

          <div className="mb-6 flex items-center">
            <input
              type="text"
              placeholder="Search by role name or description"
              className="border p-2 rounded-lg w-64 text-base"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <span className="ml-2 material-icons text-gray-600">search</span>
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
                {filteredRoles.length > 0 ? (
                  filteredRoles.map((role) => (
                    <tr key={role.roleId} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{role.roleId}</td>
                      <td className="border px-4 py-2">{role.roleName || 'N/A'}</td>
                      <td className="border px-4 py-2">{role.roleDescription || 'N/A'}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleEdit(role.roleId)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(role.roleId)}
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
                      No roles found
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

          {/* Add Role Modal */}
          {isModalOpen && (
            <AddRoleForm
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              roleId={selectedRoleId}
              onUpdate={updateRole}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Roles;
