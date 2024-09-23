import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import Header from '../../components/Header/Header';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

function AccessControl() {
  const [rolePageMapping, setRolePageMapping] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchRolePageMapping();
  }, []);

  const fetchRolePageMapping = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/role-page-xref`);
      setRolePageMapping(response.data);
    } catch (err) {
      console.error('Failed to fetch role-page mappings', err);
      setRolePageMapping([]);
    }
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCheckboxClick = async (roleId, pageId, isChecked, id) => {
    if (!isChecked) {
      try {
        const postData = {
          role: { roleId },
          page: { pageId },
        };
        await axios.post(`${apiUrl}/api/role-page-xref`, postData);
        toast.success("Access Given")
        fetchRolePageMapping();
      } catch (err) {
        console.error('Failed to map role to page', err);
      }
    } else if (isChecked && id) {
      try {
        await axios.delete(`${apiUrl}/api/role-page-xref/${id}`);
        toast.success("Access Deleted")
        fetchRolePageMapping();
      } catch (err) {
        console.error('Failed to delete role-page mapping', err);
      }
    }
  };

  const filteredRoles = rolePageMapping
    .filter((rolePage) =>
      rolePage.role.roleName &&
      rolePage.role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .reduce((acc, rolePage) => {
      const { role, page } = rolePage;
      if (!acc[role.roleId]) {
        acc[role.roleId] = {
          roleId: role.roleId,
          roleName: role.roleName,
          pages: [],
        };
      }
      acc[role.roleId].pages.push({ pageName: page.pageName, id: rolePage.id });
      return acc;
    }, {});

  const roleArray = Object.values(filteredRoles);

  const pageIdMapping = {
    webstore: 1,
    dashboard: 2,
    inventory: 3,
    quotations: 4,
    agents: 5,
    sites: 6,
    customers: 7,
    accessControl: 8,
  };

  return (
    <>
      <Header className="UniversalHeader" />
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Access Control</h1>
          </div>

          {/* Search Bar */}
          <div className="mb-6 flex items-center">
            <input
              type="text"
              placeholder="Search by role name"
              className="border p-2 rounded-lg w-64 text-base"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <FaSearch className="ml-2 text-gray-600 text-lg" />
          </div>

          {/* Role Page Mapping Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border px-4 py-2">Role</th>
                  {['WebStore', 'Dashboard', 'Inventory', 'Quotations', 'Agents', 'Sites', 'Customers', 'AccessControl'].map(
                    (feature) => (
                      <th className="border px-4 py-2" key={feature}>
                        {feature}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {roleArray.length > 0 ? (
                  roleArray.map((role) => (
                    <tr key={role.roleId} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{role.roleName}</td>
                      {['webstore', 'dashboard', 'inventory', 'quotations', 'agents', 'sites', 'customers', 'accessControl'].map(
                        (feature) => {
                          const pageMapping = role.pages.find((page) => page.pageName === feature);
                          const isChecked = !!pageMapping;
                          const id = pageMapping ? pageMapping.id : null;

                          return (
                            <td className="border px-4 py-2" key={feature}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() =>
                                  handleCheckboxClick(role.roleId, pageIdMapping[feature], isChecked, id)
                                }
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                            </td>
                          );
                        }
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-6">
                      No roles found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccessControl;
