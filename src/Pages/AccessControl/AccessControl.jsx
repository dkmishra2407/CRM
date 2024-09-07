import React, { useState, useEffect } from 'react';
import './AccessControl.css';
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import Header from '../../components/Header/Header';
function AccessControl() {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  const features = ['WebStore', 'Dashboard', 'Inventory', 'Customers', 'Agents', 'Sites'];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/roles`);
      const rolesData = response.data.map((role) => ({
        ...role,
        accessControls: features,
      }));
      setRoles(rolesData);
    } catch (err) {
      console.error('Failed to fetch roles', err);
      setRoles([]);
    }
  };

  const toggleAccess = async (roleId, feature) => {
    const roleIndex = roles.findIndex((role) => role.roleId === roleId);
    const role = roles[roleIndex];
    const accessControls = role.accessControls || [];
    const hasAccess = accessControls.includes(feature);
    const updatedAccessControls = hasAccess
      ? accessControls.filter((item) => item !== feature)
      : [...accessControls, feature];
    const updatedRole = { ...role, accessControls: updatedAccessControls };

    try {
      await axios.put(`${apiUrl}/api/roles/${roleId}`, updatedRole);
      setRoles((prevRoles) => {
        const updatedRoles = [...prevRoles];
        updatedRoles[roleIndex] = updatedRole;
        return updatedRoles;
      });
    } catch (err) {
      console.error('Failed to update access control', err);
    }
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const filteredRoles = roles.filter((role) =>
    role.roleName && role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Header className="UniversalHeader"/>
    <div className={`access-control-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="access-control-heading"><h1>Access Control</h1></div>
      <div className="access-control-search">
        <input
          type="text"
          placeholder="Search by role name"
          className="access-control-search-bar"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <div className="access-control-search-icon">
          <span className="material-icons">search</span>
        </div>
      </div>

      <table className="access-control-table">
        <thead>
          <tr>
            <th>Role</th>
            {features.map((feature) => (
              <th key={feature}>{feature}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role) => (
              <tr key={role.roleId}>
                <td>{role.roleName}</td>
                {features.map((feature) => (
                  <td key={feature}>
                    <input
                      type="checkbox"
                      checked={role.accessControls.includes(feature)}
                      onChange={() => toggleAccess(role.roleId, feature)}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={features.length + 1}>No roles found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>
  );
}

export default AccessControl;
