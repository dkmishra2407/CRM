import React, { useState, useEffect } from 'react';
import './Agents.css';
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import AddSalesAgentForm from '../../components/AddAgents/AddAgents';

function Agent() {
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
    if (window.confirm("Are you sure you want to delete this agent?")) {
      try {
        await axios.delete(`${apiUrl}/api/associates/${id}`);
        setAgents(prevAgents => prevAgents.filter(agent => agent.associateId !== id));
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
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAgentId(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter agents based on search term
  const filteredAgents = agents.filter(agent =>
    agent.associateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (agent.phoneNumber && agent.phoneNumber.includes(searchTerm))
  );

  return (
    <div className={`generate-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <h1 className="customers-page-title">AGENTS</h1>
      <div className="customer-search-container">
        <input
          type="text"
          placeholder="Search by name, username, or phone"
          className="customer-search-bar"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <div className="customer-search-icon">
          <span className="material-icons">search</span>
        </div>
        <div className="customer-add-btn" onClick={() => setIsModalOpen(true)}>
          Add Agent
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
                  <button className="action-btn view-btn" onClick={() => handleEdit(agent.associateId)}>Edit</button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(agent.associateId)}>Delete</button>
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

      {isModalOpen && (
        <AddSalesAgentForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          agentId={selectedAgentId}
        />
      )}
    </div>
  );
}

export default Agent;
