import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; // Close icon

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-lg relative overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{roleId ? 'Edit Role' : 'Add New Role'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="roleName" className="block text-gray-700">Role Name</label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="roleDescription" className="block text-gray-700">Role Description</label>
            <textarea
              id="roleDescription"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              placeholder="Enter role description"
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
           
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {roleId ? 'Update Role' : 'Add Role'}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddRoleForm;
