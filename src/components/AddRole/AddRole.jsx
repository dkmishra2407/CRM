import React, { useState } from 'react';
import './AddRole.css'; // Update CSS filename to match the new component
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Sidebar from '../SideBar/SideBar';

const AddRoles = () => {
    const [roleName, setRoleName] = useState('');
    const [roleDescription, setRoleDescription] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to control sidebar visibility
    const apiUrl = process.env.REACT_APP_API_URL; // Use the API URL from the environment variables

    // Data structure for roles
    const roleData = {
        roleName: roleName,
        roleDescription: roleDescription,
    };

    const handleClear = () => {
        setRoleName('');
        setRoleDescription('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiUrl}/api/roles`, roleData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Role Added Successfully!');
            handleClear();  // Clear the form after saving
        } catch (err) {
            console.error('Error saving the form', err);
            toast.error('Failed to Add the Role. Please try again.');
        }
    };

    return (
        <div className={`add-roles-form-container`}>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className={`main-content ${isSidebarOpen ? 'open' : 'closed'}`}>
                <h2>Add New Role</h2>
                <form onSubmit={handleSubmit} className="add-roles-form">
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
                        <button type="submit" className="submit-btn">Add Role</button>
                        <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
                    </div>
                </form>
                <ToastContainer />  {/* Correctly render the ToastContainer */}
            </div>
        </div>
    );
};

export default AddRoles;
