import React, { useEffect, useState } from 'react';
import './SideBar.css';
import logo from './logo1.jpg';
import { Link } from 'react-router-dom';
import { MdChevronLeft, MdChevronRight, MdStore, MdDashboard, MdGroup, MdInventory, MdPersonAdd, MdLocationOn, MdLabel, MdSecurity } from 'react-icons/md';
import { usePage } from '../../Context/page-context'; // Import the PageContext

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { state, dispatch } = usePage(); // Get the page access from the context
  const [accessiblePages, setAccessiblePages] = useState([]);

  // Mapping of pageName to respective icon and link
  const pageMapping = {
    webstore: { icon: <MdStore />, label: 'Web Store', link: '/webstore' },
    dashboard: { icon: <MdDashboard />, label: 'Dashboard', link: '/dashboard' },
    customers: { icon: <MdGroup />, label: 'Customers', link: '/customer' },
    inventory: { icon: <MdInventory />, label: 'Inventory', link: '/inventory' },
    quotations: { icon: <MdInventory />, label: 'Quotation', link: '/quotation' },
    agents: { icon: <MdGroup />, label: 'Agents', link: '/agents' },
    sites: { icon: <MdLocationOn />, label: 'Sites', link: '/addsites' },
    category: { icon: <MdLabel />, label: 'Category', link: '/addcategories' },
    roles: { icon: <MdGroup />, label: 'Role', link: '/addroles' },
    accessControl: { icon: <MdSecurity />, label: 'Access Control', link: '/accessControl' },
  };

  // Load accessible pages from localStorage on mount
  useEffect(() => {
    const storedPages = JSON.parse(localStorage.getItem('pageAccess')) || [];

    const storedAuth = localStorage.getItem('isAuthenticated');
    const pageNames = storedPages.map(page => page.pageName);
    setAccessiblePages(pageNames);
    console.log(pageNames)
    // if (storedPages.length > 0) {
    //   // Dispatching the pages to the context state if necessary
    //   dispatch({ type: 'SET_PAGES', payload: storedPages });
    //   setAccessiblePages(storedPages.map(page => page.pageName));
    // }
  }, []);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <Link to='/webstore'>
          <div className="logo-container">
            <img src={logo} alt="Company Logo" className={`logo ${isOpen ? '' : 'logo-collapsed'}`} />
          </div>
        </Link>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isOpen ? <MdChevronLeft /> : <MdChevronRight />}
        </button>
      </div>
      <ul className="sidebar-menu">
        {accessiblePages.map((pageName) => {
          const page = pageMapping[pageName];
          if (!page) return null; // Ignore pages that don't match
          return (
            <li key={pageName}>
              <Link to={page.link} className="menu-link">
                <span className='menu-icon'>{page.icon}</span>
                {isOpen && <span className="menu-text">{page.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
