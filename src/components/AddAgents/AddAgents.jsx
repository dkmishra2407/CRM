import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const AddSalesAgentForm = ({ isOpen, onClose, agentId, onUpdate }) => {
  const [agentName, setAgentName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [active, setActive] = useState(true);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchRoles();
    if (agentId) fetchAgentData(agentId);
  }, [agentId]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/roles`);
      setRoles(response.data);
    } catch (err) {
      toast.error('Failed to load roles.');
    }
  };

  const fetchAgentData = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/api/associates/${id}`);
      const agent = response.data;
      setAgentName(agent.associateName);
      setUserName(agent.userName);
      setRole(agent.role.roleId);
      setActive(agent.active);
    } catch (err) {
      toast.error('Failed to load agent data.');
    }
  };

  const handleFieldChange = (field, value) => {
    const newErrors = { ...errors };
    if (field === 'agentName') setAgentName(value);
    if (field === 'userName') setUserName(value);
    if (field === 'password') setPassword(value);
    if (field === 'role') setRole(value);
    if (field === 'active') setActive(value === 'true');

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleSave = async () => {
    if (!isFormValid) return;

    const agentData = {
      role: { roleId: role },
      associateName: agentName,
      password,
      userName,
      active,
    };

    try {
      if (agentId) {
        await axios.put(`${apiUrl}/api/associates/${agentId}`, agentData);
        toast.success('Agent Updated!');
      } else {
        await axios.post(`${apiUrl}/api/associates`, agentData);
        toast.success('Agent Added!');
      }
      onClose();
      window.location.reload();
    } catch (err) {
      toast.error('Failed to save the agent.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000] overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {agentId ? 'Edit Sales Agent' : 'Add Sales Agent'}
          </h2>
          <FaTimes className="text-gray-500 hover:text-black cursor-pointer" onClick={onClose} />
        </div>
        <div className="space-y-4">
          <div className="w-full">
            <label className="block mb-2">Agent Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring"
              value={agentName}
              onChange={(e) => handleFieldChange('agentName', e.target.value)}
            />
          </div>
          <div className="w-full">
            <label className="block mb-2">Username</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring"
              value={userName}
              onChange={(e) => handleFieldChange('userName', e.target.value)}
            />
          </div>
          {!agentId && (
            <div className="w-full">
              <label className="block mb-2">Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded focus:outline-none focus:ring"
                value={password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
              />
            </div>
          )}
          <div className="w-full">
            <label className="block mb-2">Role</label>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring"
              value={role}
              onChange={(e) => handleFieldChange('role', e.target.value)}
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.roleId} value={r.roleId}>
                  {r.roleName}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label className="block mb-2">Active</label>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring"
              value={active.toString()}
              onChange={(e) => handleFieldChange('active', e.target.value)}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={handleSave}
            className={`px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
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
