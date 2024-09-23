// import React, { useEffect, useState } from 'react';
// import './SideBar.css';
// import { useSidebar } from '../../Context/sidebar-context';
// import logo from './logo1.jpg';
// import { Link } from 'react-router-dom';
// import { MdChevronLeft, MdChevronRight, MdStore, MdDashboard, MdGroup, MdInventory, MdLocationOn, MdLabel, MdSecurity } from 'react-icons/md';
// import { usePage } from '../../Context/page-context'; // If page context is needed

// const Sidebar = () => {
//   const { state: sidebarState, dispatch: sidebarDispatch } = useSidebar(); // Get the sidebar state and dispatch from SidebarContext
//   const { isOpen } = sidebarState; // Destructure isOpen from sidebarState
//   const [accessiblePages, setAccessiblePages] = useState([]);

//   const { state: pageState } = usePage(); // If you need page access from the page-context

//   const toggleSidebar = () => {
//     sidebarDispatch({ type: 'TOGGLE_SIDEBAR' });
//   };

//   // Mapping of pageName to respective icon and link
//   const pageMapping = {
//     webstore: { icon: <MdStore />, label: 'Web Store', link: '/webstore' },
//     dashboard: { icon: <MdDashboard />, label: 'Dashboard', link: '/dashboard' },
//     customers: { icon: <MdGroup />, label: 'Customers', link: '/customer' },
//     inventory: { icon: <MdInventory />, label: 'Inventory', link: '/inventory' },
//     quotations: { icon: <MdInventory />, label: 'Quotation', link: '/quotation' },
//     agents: { icon: <MdGroup />, label: 'Agents', link: '/agents' },
//     sites: { icon: <MdLocationOn />, label: 'Sites', link: '/addsites' },
//     category: { icon: <MdLabel />, label: 'Category', link: '/addcategories' },
//     roles: { icon: <MdGroup />, label: 'Role', link: '/addroles' },
//     accessControl: { icon: <MdSecurity />, label: 'Access Control', link: '/accessControl' },
//     sales: { icon: <MdInventory />, label: 'sales', link: '/sales' },
//   };

//   // Load accessible pages from localStorage on mount
//   useEffect(() => {
//     const storedPages = JSON.parse(localStorage.getItem('pageAccess')) || [];
//     const pageNames = storedPages.map(page => page.pageName);
//     setAccessiblePages(pageNames);
//   }, []);

//   return (
//     <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
//       <div className="sidebar-header">
//         {isOpen && (
//           <Link to='/webstore'>
//             <div className="logo-container">
//               <img src={logo} alt="Company Logo" className="logo" />
//             </div>
//           </Link>
//         )}
//         <button className="toggle-btn" onClick={toggleSidebar}>
//           {isOpen ? <MdChevronLeft /> : <MdChevronRight />}
//         </button>
//       </div>
//       <ul className="sidebar-menu">
//         {accessiblePages.map((pageName) => {
//           const page = pageMapping[pageName];
//           if (!page) return null;
//           return (
//             <li key={pageName}>
//               <Link to={page.link} className="menu-link">
//                 <span className="menu-icon">{page.icon}</span>
//                 {isOpen && <span className="menu-text">{page.label}</span>}
//               </Link>
//             </li>
//           );
//         })}
//       </ul>
//     </aside>
//   );
// };

// export default Sidebar;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MdChevronLeft,
  MdChevronRight,
  MdStore,
  MdDashboard,
  MdGroup,
  MdInventory,
  MdLocationOn,
  MdLabel,
  MdSecurity,
} from 'react-icons/md';
import { useSidebar } from '../../Context/sidebar-context';
import { usePage } from '../../Context/page-context';
import logo from './logo1.jpg'; // Your logo image

const Sidebar = () => {
  const { state: sidebarState, dispatch: sidebarDispatch } = useSidebar(); // Sidebar context
  const { isOpen } = sidebarState; // Destructure isOpen from sidebarState
  const [accessiblePages, setAccessiblePages] = useState([]);

  const toggleSidebar = () => {
    sidebarDispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  // Page mapping between the page name and its icon, label, and link
  const pageMapping = {
    webstore: { icon: <MdStore />, label: 'Web Store', link: '/webstore' },
    dashboard: { icon: <MdDashboard />, label: 'Dashboard', link: '/dashboard' },
    customers: { icon: <MdGroup />, label: 'Customers', link: '/customer' },
    inventory: { icon: <MdInventory />, label: 'Inventory', link: '/inventory' },
    quotations: { icon: <MdInventory />, label: 'Quotations', link: '/quotation' },
    agents: { icon: <MdGroup />, label: 'Agents', link: '/agents' },
    sites: { icon: <MdLocationOn />, label: 'Sites', link: '/addsites' },
    category: { icon: <MdLabel />, label: 'Category', link: '/addcategories' },
    roles: { icon: <MdGroup />, label: 'Roles', link: '/addroles' },
    accessControl: { icon: <MdSecurity />, label: 'Access Control', link: '/accessControl' },
    sales: { icon: <MdInventory />, label: 'Sales', link: '/sales' },
    sites: { icon: <MdInventory />, label: 'Sites', link: '/sites' },
  };

  // Load accessible pages from localStorage when the component mounts
  useEffect(() => {
    const storedPages = JSON.parse(localStorage.getItem('pageAccess')) || [];
    const pageNames = storedPages.map((page) => page.pageName);
    setAccessiblePages(pageNames);
  }, []);

  return (
    <aside className={`h-screen transition-all duration-300 bg-gray-800 text-white flex flex-col ${isOpen ? 'w-56' : 'w-20'}`}>
      <div className="flex items-center justify-between p-4">
        {isOpen && (
          <Link to="/webstore">
            <img src={logo} alt="Company Logo" className="w-32 transition-all duration-300" />
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 text-2xl transition-transform duration-300"
        >
          {isOpen ? <MdChevronLeft /> : <MdChevronRight />}
        </button>
      </div>

      <ul className="flex-grow">
        {accessiblePages.map((pageName) => {
          const page = pageMapping[pageName];
          if (!page) return null;
          return (
            <li key={pageName} className="flex items-center p-2 hover:bg-gray-700 transition-colors duration-200">
              <Link to={page.link} className="flex items-center text-white w-full">
                <span className="text-2xl">{page.icon}</span>
                {isOpen && <span className="ml-4">{page.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
