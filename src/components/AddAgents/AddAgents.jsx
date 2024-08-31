import React, { useState, useEffect } from 'react';
import './AddAgents.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const AddSalesAgentForm = ({ isOpen, onClose, agent }) => {
  const [agentName, setAgentName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [active, setActive] = useState(true);

  // Define the errors state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (agent) {
      setAgentName(agent.associateName);
      setUserName(agent.userName);
      setRole(agent.role.roleName);
      setRoleDescription(agent.role.roleDescription);
      setActive(agent.active);
    }
  }, [agent]);

  const handleClear = () => {
    setAgentName('');
    setUserName('');
    setPassword('');
    setRole('');
    setRoleDescription('');
    setActive(true);
    setErrors({}); // Clear errors
  };

  const validateForm = () => {
    const newErrors = {};
    if (!agentName) newErrors.agentName = 'Agent Name is required.';
    if (!userName) newErrors.userName = 'Username is required.';
    if (!password && !agent) newErrors.password = 'Password is required.';
    if (!role) newErrors.role = 'Role is required.';
    if (!roleDescription) newErrors.roleDescription = 'Role Description is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const roleData = {
        roleName: role,
        roleDescription: roleDescription
      };

      let roleResponse;
      if (agent) {
        roleResponse = { data: { roleId: agent.role.roleId } }; 
      } else {
        roleResponse = await axios.post('http://localhost:7171/api/roles', roleData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      const associateData = {
        role: {
          roleId: roleResponse.data.roleId
        },
        associateName: agentName,
        userName: userName,
        password: password || agent.password,
        active: active
      };

      if (agent) {
        await axios.put(`http://localhost:7171/api/associates/${agent.associateId}`, associateData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        toast.success('Agent Updated Successfully!');
      } else {
        await axios.post('http://localhost:7171/api/associates', associateData, {
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
      toast.error('Failed to Save the Agent. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="form-title">{agent ? 'Edit Sales Agent' : 'Add Sales Agent'}</h2>
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
            <input
              type="text"
              placeholder="Role Name"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            {errors.role && <span className="error">{errors.role}</span>}
          </div>
          <div className="form-group">
            <label>Role Description</label>
            <input
              type="text"
              placeholder="Role Description"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
            />
            {errors.roleDescription && <span className="error">{errors.roleDescription}</span>}
          </div>
          <div className="form-group">
            <label>Active</label>
            <select
              value={active}
              onChange={(e) => setActive(e.target.value === 'true')}
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
