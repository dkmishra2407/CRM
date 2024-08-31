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

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get('http://localhost:7171/api/associates');
      setAgents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch agents', err);
      setAgents([]); 
    }
  };

  const searchFetchAgents = async (searchTerm) => {
    if (!searchTerm.trim()) {
      fetchAgents();
      return;
    }

    try {
      const response = await axios.get(`http://localhost:7171/api/associates/${searchTerm}`);
      setAgents(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (err) {
      console.error('Failed to fetch agents', err);
      setAgents([]); 
    }    
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      try {
        await axios.delete(`http://localhost:7171/api/associates/${id}`);
        setAgents(prevAgents => prevAgents.filter(agent => agent.customerId !== id));
      } catch (err) {
        console.error('Failed to delete agent', err);
      }
    }
  };

  const handleView = (id) => {
    setSelectedAgentId(id);
    setIsModalOpen(true);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchFetchAgents(searchTerm);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAgentId(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`generate-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <h1 className="customers-page-title">AGENTS</h1>
      <div className="customer-search-container">
        <input
          type="text"
          placeholder="Search customer"
          className="customer-search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleSearchKeyPress}
        />
        <div className="customer-search-icon" onClick={() => searchFetchAgents(searchTerm)}>
          <span className="material-icons">search</span>
        </div>
        <div className="customer-add-btn" onClick={() => setIsModalOpen(true)}>
          Add Customer
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
          {agents.length > 0 ? (
            agents.map((agent) => (
              <tr key={agent.associateId}>
                <td>{agent.associateId}</td>
                <td>{agent.associateName || 'N/A'}</td>
                <td>{agent.userName}</td>
                <td>{agent.role.roleName}</td>
                <td>
                  <button className="action-btn view-btn" onClick={() => handleView(agent.customerId)}>Edit</button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(agent.customerId)}>Delete</button>
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
