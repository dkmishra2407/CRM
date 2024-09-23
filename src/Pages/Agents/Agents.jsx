import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import AddSalesAgentForm from '../../components/AddAgents/AddAgents';
import Header from '../../components/Header/Header';
import { FaSearch } from 'react-icons/fa';

function Agent() {
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 10;
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/associates`);
      setAgents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch agents', err);
      setAgents([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await axios.delete(`${apiUrl}/api/associates/${id}`);
        setAgents((prevAgents) =>
          prevAgents.filter((agent) => agent.associateId !== id)
        );
      } catch (err) {
        console.error('Failed to delete agent', err);
      }
    }
  };

  const handleEdit = (id) => {
    setSelectedAgentId(id);
    setIsModalOpen(true);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAgentId(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;

  const filteredAgents = agents
    .filter(
      (agent) =>
        agent.associateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (agent.phoneNumber && agent.phoneNumber.includes(searchTerm))
    )
    .slice(indexOfFirstAgent, indexOfLastAgent);

  const totalPages = Math.ceil(
    agents.filter(
      (agent) =>
        agent.associateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (agent.phoneNumber && agent.phoneNumber.includes(searchTerm))
    ).length / agentsPerPage
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
            <h1 className="text-3xl font-bold">Agents</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Add Agent
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6 flex items-center">
            <input
              type="text"
              placeholder="Search by name, username, or phone"
              className="border p-2 rounded-lg w-64 text-base"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <FaSearch className="ml-2 text-gray-600 text-lg" />
          </div>

          {/* Agent Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Username</th>
                  <th className="border px-4 py-2">Role</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.length > 0 ? (
                  filteredAgents.map((agent) => (
                    <tr key={agent.associateId} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{agent.associateId}</td>
                      <td className="border px-4 py-2">{agent.associateName || 'N/A'}</td>
                      <td className="border px-4 py-2">{agent.userName}</td>
                      <td className="border px-4 py-2">{agent.role.roleName}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleEdit(agent.associateId)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(agent.associateId)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6">
                      No agents found
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

          {/* Add Agent Modal */}
          {isModalOpen && (
            <AddSalesAgentForm
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              agentId={selectedAgentId}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Agent;
