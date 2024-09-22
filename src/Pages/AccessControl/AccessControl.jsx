// import React, { useState, useEffect } from 'react';
// import './AccessControl.css';
// import axios from 'axios';
// import Sidebar from '../../components/SideBar/SideBar';
// import Header from '../../components/Header/Header';
// function AccessControl() {
//   const [roles, setRoles] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const apiUrl = process.env.REACT_APP_API_URL;

//   const features = ['WebStore', 'Dashboard', 'Inventory', 'Customers', 'Agents', 'Sites'];

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   const fetchPages = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/api/pages`);
//       const pages = response.data.map((page) => ({
//         ...page,
//         accessControls: features,
//       }));
//       setRoles(pages);
//     } catch (err) {
//       console.error('Failed to fetch roles', err);
//       setRoles([]);
//     }
//   }
//   const fetchRoles = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/api/roles`);
//       const rolesData = response.data.map((role) => ({
//         ...role,
//         accessControls: features,
//       }));
//       setRoles(rolesData);
//     } catch (err) {
//       console.error('Failed to fetch roles', err);
//       setRoles([]);
//     }
//   };

//   const toggleAccess = async (roleId, feature) => {
//     const roleIndex = roles.findIndex((role) => role.roleId === roleId);
//     const role = roles[roleIndex];
//     const accessControls = role.accessControls || [];
//     const hasAccess = accessControls.includes(feature);
//     const updatedAccessControls = hasAccess
//       ? accessControls.filter((item) => item !== feature)
//       : [...accessControls, feature];
//     const updatedRole = { ...role, accessControls: updatedAccessControls };

//     try {
//       await axios.put(`${apiUrl}/api/roles/${roleId}`, updatedRole);
//       setRoles((prevRoles) => {
//         const updatedRoles = [...prevRoles];
//         updatedRoles[roleIndex] = updatedRole;
//         return updatedRoles;
//       });
//     } catch (err) {
//       console.error('Failed to update access control', err);
//     }
//   };

//   const handleSearchTermChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const filteredRoles = roles.filter((role) =>
//     role.roleName && role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <>
//     <Header className="UniversalHeader"/>
//     <div className={`access-control-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//       <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <div className="access-control-heading"><h1>Access Control</h1></div>
//       <div className="access-control-search">
//         <input
//           type="text"
//           placeholder="Search by role name"
//           className="access-control-search-bar"
//           value={searchTerm}
//           onChange={handleSearchTermChange}
//         />
//         <div className="access-control-search-icon">
//           <span className="material-icons">search</span>
//         </div>
//       </div>

//       <table className="access-control-table">
//         <thead>
//           <tr>
//             <th>Role</th>
//             {features.map((feature) => (
//               <th key={feature}>{feature}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {filteredRoles.length > 0 ? (
//             filteredRoles.map((role) => (
//               <tr key={role.roleId}>
//                 <td>{role.roleName}</td>
//                 {features.map((feature) => (
//                   <td key={feature}>
//                     <input
//                       type="checkbox"
//                       checked={role.accessControls.includes(feature)}
//                       onChange={() => toggleAccess(role.roleId, feature)}
//                     />
//                   </td>
//                 ))}
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={features.length + 1}>No roles found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//     </>
//   );
// }

// export default AccessControl;
// import React, { useState, useEffect } from 'react';
// import './AccessControl.css';
// import axios from 'axios';
// import Sidebar from '../../components/SideBar/SideBar';
// import Header from '../../components/Header/Header';

// function AccessControl() {
//   const [rolePageMapping, setRolePageMapping] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const apiUrl = process.env.REACT_APP_API_URL;

//   const fetchRolePageMapping = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/api/role-page-xref`);
//       setRolePageMapping(response.data);
//     } catch (err) {
//       console.error('Failed to fetch role-page mappings', err);
//       setRolePageMapping([]);
//     }
//   };

//   useEffect(() => {
//     fetchRolePageMapping();
//   }, []);

//   const handleSearchTermChange = (e) => {
//     setSearchTerm(e.target.value);
//   };
//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };
//   const handleCheckboxClick = async (roleId, pageId, isChecked, id) => {
//     if (!isChecked) {
//       try {
//         const postData = {
//           role: { roleId },
//           page: { pageId }
//         };
//         const postUrl = `${apiUrl}/api/role-page-xref`;
//         const response = await axios.post(postUrl, postData);
//         console.log(response)
//         fetchRolePageMapping(); 
//       } catch (err) {
//         console.error('Failed to map role to page', err);
//       }
//     } else if (isChecked && id) {
//       try {
//         console.log(id)
//         const deleteUrl = `${apiUrl}/api/role-page-xref/${id}`;
//         const response = await axios.delete(deleteUrl);
//         console.log(response)
//         fetchRolePageMapping();  // Refresh the data after successful delete
//       } catch (err) {
//         console.error('Failed to delete role-page mapping', err);
//       }
//     }
//   };

//   // Filter and group roles based on search term and page access
//   const filteredRoles = rolePageMapping
//     .filter((rolePage) =>
//       rolePage.role.roleName &&
//       rolePage.role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .reduce((acc, rolePage) => {
//       const { role, page } = rolePage;
//       if (!acc[role.roleId]) {
//         acc[role.roleId] = {
//           roleId: role.roleId,
//           roleName: role.roleName,
//           pages: [],
//         };
//       }
//       acc[role.roleId].pages.push({ pageName: page.pageName, id: rolePage.id });
//       return acc;
//     }, {});

//   const roleArray = Object.values(filteredRoles);

//   // Page name to pageId mapping (for sending the POST request)
//   const pageIdMapping = {
//     webstore: 1,
//     dashboard: 2,
//     inventory: 3,
//     quotations: 4,
//     agents: 5,
//     sites: 6,
//     customers: 7,
//     accessControl: 8,
//   };

//   return (
//     <>
//       <Header className="UniversalHeader" />
//       <div className={`access-control-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//         <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//         <div className="access-control-heading">
//           <h1>Access Control</h1>
//         </div>
//         <div className="access-control-search">
//           <input
//             type="text"
//             placeholder="Search by role name"
//             className="access-control-search-bar"
//             value={searchTerm}
//             onChange={handleSearchTermChange}
//           />
//           <div className="access-control-search-icon">
//             <span className="material-icons">search</span>
//           </div>
//         </div>

//         <table className="access-control-table">
//           <thead>
//             <tr>
//               <th>Role</th>
//               <th>WebStore</th>
//               <th>Dashboard</th>
//               <th>Inventory</th>
//               <th>Quotations</th>
//               <th>Agents</th>
//               <th>Sites</th>
//               <th>Customers</th>
//               <th>AccessControl</th>
//             </tr>
//           </thead>
//           <tbody>
//             {roleArray.length > 0 ? (
//               roleArray.map((role) => (
//                 <tr key={role.roleId}>
//                   <td>{role.roleName}</td>
//                   {['webstore', 'dashboard', 'inventory', 'quotations', 'agents', 'sites', 'customers', 'accessControl'].map((feature) => {
//                     const pageMapping = role.pages.find((page) => page.pageName === feature);
//                     const isChecked = !!pageMapping;  // Checkbox is checked if the page is mapped
//                     const id = pageMapping ? pageMapping.id : null;  // Retrieve the role-page mapping ID

//                     return (
//                       <td key={feature}>
//                         <input
//                           type="checkbox"
//                           checked={isChecked}
//                           onChange={() =>
//                             handleCheckboxClick(role.roleId, pageIdMapping[feature], isChecked, id)
//                           }
//                         />
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="9">No roles found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }

// export default AccessControl;

import React, { useState, useEffect } from 'react';
import './AccessControl.css';
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import Header from '../../components/Header/Header';

function AccessControl() {
  const [rolePageMapping, setRolePageMapping] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchRolePageMapping = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/role-page-xref`);
      setRolePageMapping(response.data);
    } catch (err) {
      console.error('Failed to fetch role-page mappings', err);
      setRolePageMapping([]);
    }
  };

  useEffect(() => {
    fetchRolePageMapping();
  }, []);

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
          page: { pageId }
        };
        const postUrl = `${apiUrl}/api/role-page-xref`;
        await axios.post(postUrl, postData);
        fetchRolePageMapping();
      } catch (err) {
        console.error('Failed to map role to page', err);
      }
    } else if (isChecked && id) {
      try {
        const deleteUrl = `${apiUrl}/api/role-page-xref/${id}`;
        await axios.delete(deleteUrl);
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
      <div className={`generate-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <div className='heading-no-1'>
          <h1 className="roles-page-title">Access Control</h1>
        </div>
        
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search by role name"
            className="search-bar"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
          <div className="search-icon">
            <span className="material-icons">search</span>
          </div>
        </div>

        <table className="role-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>WebStore</th>
              <th>Dashboard</th>
              <th>Inventory</th>
              <th>Quotations</th>
              <th>Agents</th>
              <th>Sites</th>
              <th>Customers</th>
              <th>AccessControl</th>
            </tr>
          </thead>
          <tbody>
            {roleArray.length > 0 ? (
              roleArray.map((role) => (
                <tr key={role.roleId}>
                  <td>{role.roleName}</td>
                  {['webstore', 'dashboard', 'inventory', 'quotations', 'agents', 'sites', 'customers', 'accessControl'].map((feature) => {
                    const pageMapping = role.pages.find((page) => page.pageName === feature);
                    const isChecked = !!pageMapping; 
                    const id = pageMapping ? pageMapping.id : null; 

                    return (
                      <td key={feature}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            handleCheckboxClick(role.roleId, pageIdMapping[feature], isChecked, id)
                          }
                        />
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No roles found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AccessControl;

