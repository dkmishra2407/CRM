import React, { useState, useEffect } from 'react';
import './Agents.css';
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import AddSalesAgentForm from '../../components/AddAgents/AddAgents';
import Header from '../../components/Header/Header';
function Agent() {
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 10; // Show 10 agents per page
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
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAgentId(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Pagination logic
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
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <>
    <Header className="UniversalHeader"/>
    <div className={`generate-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className='heading-no-1'>
        <h1 className="customers-page-title">Agents</h1>
        <div className="add-agent-btn" onClick={() => setIsModalOpen(true)}>
          Add Agent
        </div>
      </div>
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by name, username, or phone"
          className="search-bar"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <div className="search-icon">
          <span className="material-icons">search</span>
        </div>
      </div>

      <table className="agent-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <tr key={agent.associateId}>
                <td>{agent.associateId}</td>
                <td>{agent.associateName || 'N/A'}</td>
                <td>{agent.userName}</td>
                <td>{agent.role.roleName}</td>
                <td>
                  <button
                    className="action-btn view-btn"
                    onClick={() => handleEdit(agent.associateId)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(agent.associateId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No agents found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={previousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-btn"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <AddSalesAgentForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          agentId={selectedAgentId}
        />
      )}
    </div>
    </>
  );
}

export default Agent;
