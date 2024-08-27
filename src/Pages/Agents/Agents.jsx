import React, { useState, useEffect } from 'react';
import './Agents.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 
import Sidebar from '../../components/SideBar/SideBar';
import AddSalesAgentForm from '../../components/AddAgents/AddAgents'; // Import the form component

function Agent() {
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedAgentId, setSelectedAgentId] = useState(null); // State to store the selected agent ID
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get('http://localhost:7171/api/customers');
      const agentsData = Array.isArray(response.data) ? response.data : [];
      setAgents(agentsData);
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
      const response = await axios.get(`http://localhost:7171/api/customers/${searchTerm}`);
      const agentsData = Array.isArray(response.data) ? response.data : [response.data];
      setAgents(agentsData);
    } catch (err) {
      console.error('Failed to fetch agents', err);
      setAgents([]); 
    }    
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this agent?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:7171/api/customers/${id}`);
        setAgents(prevAgents => prevAgents.filter(agent => agent.customerId !== id));
        console.log(`Deleted agent with ID: ${id}`);
      } catch (err) {
        console.error('Failed to delete agent', err);
      }
    }
  };

  const handleView = (id) => {
    setSelectedAgentId(id); // Set the selected agent ID
    setIsModalOpen(true); // Open the modal
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchFetchAgents(searchTerm);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedAgentId(null); // Clear the selected agent ID
  };

  return (
    <div className="generate-container">
      <Sidebar />
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search agent"
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleSearchKeyPress}
        />
        <div className="search-icon" onClick={() => searchFetchAgents(searchTerm)}>
          <span className="material-icons">search</span>
        </div>
        <div className="search-icon" onClick={() => setIsModalOpen(true)}>
          Add Agent
        </div>
      </div>

      <table className="agent-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.length > 0 ? (
            agents.map((agent) => (
              <tr key={agent.customerId}>
                <td>{agent.customerId}</td>
                <td>{agent.customerName || 'N/A'}</td>
                <td>{agent.phoneNumber}</td>
                <td>{agent.emailAddress}</td>
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
          agentId={selectedAgentId} // Pass the selected agent ID to the form
        />
      )}
    </div>
  );
}

export default Agent;
