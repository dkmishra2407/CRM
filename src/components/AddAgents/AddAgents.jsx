import React, { useState, useEffect } from 'react';
import './AddAgents.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const AddSalesAgentForm = ({ isOpen, onClose, agentId, onUpdate }) => {
  const [agentName, setAgentName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [active, setActive] = useState(true);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false); // Track form validity

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchRoles();
    if (agentId) {
      fetchAgentData(agentId);
    }
  }, [agentId]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/roles`);
      setRoles(response.data);
    } catch (err) {
      console.error('Failed to fetch roles', err);
      toast.error('Failed to load roles. Please try again.');
    }
  };

  const fetchAgentData = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/api/associates/${id}`);
      const agent = response.data;
      setAgentName(agent.associateName);
      setUserName(agent.userName);
      setRole(agent.role.roleId);
      setRoleDescription(agent.role.roleDescription);
      setActive(agent.active);
      setPassword(''); // Reset password field for editing
    } catch (err) {
      console.error('Failed to fetch agent data', err);
      toast.error('Failed to load agent data. Please try again.');
    }
  };

  const handleClear = () => {
    setAgentName('');
    setUserName('');
    setPassword('');
    setRole('');
    setRoleDescription('');
    setActive(true);
    setErrors({});
    setIsFormValid(false);
  };

  const handleFieldChange = (field, value) => {
    const newErrors = { ...errors };
    if (field === 'agentName') setAgentName(value);
    if (field === 'userName') setUserName(value);
    if (field === 'password') setPassword(value);
    if (field === 'role') setRole(value);
    if (field === 'active') setActive(value === 'true');

    // Field-level validation
    switch (field) {
      case 'agentName':
        if (!value) newErrors.agentName = 'Agent Name is required.';
        else delete newErrors.agentName;
        break;
      case 'userName':
        if (!value) newErrors.userName = 'Username is required.';
        else delete newErrors.userName;
        break;
      case 'password':
        if (!value && !agentId) newErrors.password = 'Password is required.';
        else delete newErrors.password;
        break;
      case 'role':
        if (!value) newErrors.role = 'Role is required.';
        else delete newErrors.role;
        break;
      default:
        break;
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleSave = async () => {
    if (!isFormValid) return; 

    const agentData = {
      role: { roleId: role },
      associateName: agentName,
      userName,
      password: password || undefined, 
      active,
    };

    try {
      if (agentId) {
        await onUpdate(agentId, agentData);
        toast.success('Agent Updated Successfully!');
      } else {
        await axios.post(`${apiUrl}/api/associates`, agentData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        toast.success('Agent Added Successfully!');
      }
      handleClear();
      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Error saving the form', err);
      toast.error('Failed to save the agent. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="form-title">{agentId ? 'Edit Sales Agent' : 'Add Sales Agent'}</h2>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>
        <div className="form-fields">
          <div className="form-group">
            <label>Agent Name</label>
            <input
              type="text"
              placeholder="Agent Name"
              value={agentName}
              onChange={(e) => handleFieldChange('agentName', e.target.value)}
            />
            {errors.agentName && <span className="error">{errors.agentName}</span>}
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => handleFieldChange('userName', e.target.value)}
            />
            {errors.userName && <span className="error">{errors.userName}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              required={!agentId}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => handleFieldChange('role', e.target.value)}
              className="dropdown"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.roleId} value={r.roleId}>
                  {r.roleName}
                </option>
              ))}
            </select>
            {errors.role && <span className="error">{errors.role}</span>}
          </div>

          <div className="form-group">
            <label>Active</label>
            <select
              value={active.toString()}
              onChange={(e) => handleFieldChange('active', e.target.value)}
              className="dropdown"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            onClick={handleSave}
            className={`save-btn ${!isFormValid ? 'disabled-btn' : 'enabled-btn'}`}
            disabled={!isFormValid}
          >
            Save Agent
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSalesAgentForm;
