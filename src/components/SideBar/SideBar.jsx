import React, { useEffect, useState } from 'react';
import './SideBar.css';
import logo from './logo1.jpg';
import { Link } from 'react-router-dom';
import { MdChevronLeft, MdChevronRight, MdStore, MdDashboard, MdGroup, MdInventory, MdPersonAdd, MdLocationOn, MdLabel, MdSecurity } from 'react-icons/md';
import { usePage } from '../../Context/page-context'; // Import the PageContext

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { state } = usePage(); // Get the page access from the context
  const [accessiblePages, setAccessiblePages] = useState([]);

  // Load page access from localStorage if state is empty (e.g., after a page refresh)
  useEffect(() => {
    if (state.pageAccess && state.pageAccess.length > 0) {
      setAccessiblePages(state.pageAccess.map(page => page.pageName));
    } else {
      const storedPages = localStorage.getItem('pageAccess');
      if (storedPages) {
        setAccessiblePages(JSON.parse(storedPages).map(page => page.pageName));
      }
    }
  }, [state.pageAccess]);

  // Mapping of pageName to respective icon and link
  const pageMapping = {
    webstore: { icon: <MdStore />, label: 'Web Store', link: '/webstore' },
    dashboard: { icon: <MdDashboard />, label: 'Dashboard', link: '/dashboard' },
    customer: { icon: <MdGroup />, label: 'Customers', link: '/customer' },
    inventory: { icon: <MdInventory />, label: 'Inventory', link: '/inventory' },
    quotation: { icon: <MdInventory />, label: 'Quotation', link: '/quotation' },
    agents: { icon: <MdPersonAdd />, label: 'Agents', link: '/agents' },
    addsites: { icon: <MdLocationOn />, label: 'Add Sites', link: '/addsites' },
    addcategories: { icon: <MdLabel />, label: 'Add Category', link: '/addcategories' },
    addroles: { icon: <MdPersonAdd />, label: 'Add Role', link: '/addroles' },
    accesscontrol: { icon: <MdSecurity />, label: 'Access Control', link: '/accesscontrol' },
  };

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
          const page = pageMapping[pageName.toLowerCase()];
          if (!page) return null; // Ignore pages that don't match
          return (
            <li key={pageName}>
              <Link to={page.link} className="menu-link">
                {page.icon}
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
