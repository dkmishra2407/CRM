import React, { useState, useEffect } from 'react';
import './AddRole.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const AddRoleForm = ({ isOpen, onClose, roleId, onUpdate }) => {
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (roleId) {
      fetchRoleData(roleId);
    }
  }, [roleId]);

  const fetchRoleData = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/api/roles/${id}`);
      const role = response.data;
      setRoleName(role.roleName);
      setRoleDescription(role.roleDescription);
    } catch (err) {
      console.error('Failed to fetch role data', err);
      toast.error('Failed to load role data.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roleData = { roleName, roleDescription };

    try {
      if (roleId) {
        await axios.put(`${apiUrl}/api/roles/${roleId}`, roleData);
        toast.success('Role updated successfully!');
        onUpdate(roleId, roleData);
      } else {
        await axios.post(`${apiUrl}/api/roles`, roleData);
        toast.success('Role added successfully!');
      }
      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Error saving the role', err);
      toast.error('Failed to save the role. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{roleId ? 'Edit Role' : 'Add New Role'}</h2>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>
        <form onSubmit={handleSubmit} className="add-role-form">
          <div className="form-group">
            <label htmlFor="roleName">Role Name</label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="roleDescription">Role Description</label>
            <textarea
              id="roleDescription"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              placeholder="Enter role description"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {roleId ? 'Update Role' : 'Add Role'}
            </button>
            <button type="button" className="clear-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddRoleForm;
