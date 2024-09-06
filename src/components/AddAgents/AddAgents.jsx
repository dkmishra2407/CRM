import React, { useState, useEffect } from 'react';
import './AddAgents.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const AddSalesAgentForm = ({ isOpen, onClose, agentId }) => {
  const [agentName, setAgentName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/roles`);
      setRoles(response.data);
    } catch (err) {
      console.error('Failed to fetch roles', err);
      toast.error('Failed to load roles. Please try again.');
    }
  };

  useEffect(() => {
    if (agentId) {
      fetchAgentData(agentId);
    }
  }, [agentId]);

  const fetchAgentData = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/api/associates/${id}`);
      const agent = response.data;

      setAgentName(agent.associateName);
      setUserName(agent.userName);
      setRole(agent.role.roleId);
      setRoleDescription(agent.role.roleDescription);
      setActive(agent.active);
      setPassword('');
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
  };

  const validateForm = () => {
    const newErrors = {};
    if (!agentName) newErrors.agentName = 'Agent Name is required.';
    if (!userName) newErrors.userName = 'Username is required.';
    if (!password && !agentId) newErrors.password = 'Password is required.';
    if (!role) newErrors.role = 'Role is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const associateData = {
        role: { roleId: role },
        associateName: agentName,
        userName: userName,
        password: password || undefined,
        active: active,
      };

      if (agentId) {
        await axios.put(`${apiUrl}/api/associates/${agentId}`, associateData);
        toast.success('Agent Updated Successfully!');
      } else {
        await axios.post(`${apiUrl}/api/associates`, associateData);
        toast.success('Agent Added Successfully!');
      }

      handleClear();
      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Error saving the form', err);
      toast.error('Failed to Save the Agent. Please try again.');
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
              onChange={(e) => setAgentName(e.target.value)}
            />
            {errors.agentName && <span className="error">{errors.agentName}</span>}
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            {errors.userName && <span className="error">{errors.userName}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => {
                const selectedRole = roles.find(r => r.roleId === Number(e.target.value));
                setRole(e.target.value);
                setRoleDescription(selectedRole ? selectedRole.roleDescription : '');
              }}
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
            <label>Role Description</label>
            <input
              type="text"
              value={roleDescription}
              placeholder="Role Description"
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Active</label>
            <select
              value={active}
              onChange={(e) => setActive(e.target.value === 'true')}
              className="dropdown"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button onClick={handleClear} className="clear-btn">CLEAR</button>
          <button onClick={handleSave} className="save-btn" disabled={Object.keys(errors).length > 0}>SAVE</button>
        </div>
      </div>
    </div>
  );
};

export default AddSalesAgentForm;