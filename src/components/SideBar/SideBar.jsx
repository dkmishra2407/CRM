import React from 'react';
import './SideBar.css';
import logo from './company_logo.png'; // Ensure the logo path is correct
import { Link } from 'react-router-dom';
import { MdChevronLeft,MdChevronRight,MdStore, MdDashboard, MdGroup, MdInventory, MdPersonAdd, MdLocationOn, MdLabel, MdSecurity } from 'react-icons/md'; // Using Material Design Icons

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <Link to='/webstore'>
        <div className="logo-container">
          {isOpen ? (
            <img src={logo} alt="Company Logo" className="logo" />
          ) : (
            <img src={logo} alt="Company Logo" className="logo-collapsed" />
          )}
        </div>
        </Link>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <span className="material-icons">
            {isOpen ? <MdChevronLeft /> : <MdChevronRight />}
          </span>
        </button>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/webstore" className="menu-link">
            <MdStore className="menu-icon" />
            {isOpen && <span className="menu-text">Web Store</span>}
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="menu-link">
            <MdDashboard className="menu-icon" />
            {isOpen && <span className="menu-text">Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/customer" className="menu-link">
            <MdGroup className="menu-icon" />
            {isOpen && <span className="menu-text">Customers</span>}
          </Link>
        </li>
        <li>
          <Link to="/inventory" className="menu-link">
            <MdInventory className="menu-icon" />
            {isOpen && <span className="menu-text">Inventory</span>}
          </Link>
        </li>
        <li>
          <Link to="/quotation" className="menu-link">
            <MdInventory className="menu-icon" />
            {isOpen && <span className="menu-text">Quotation</span>}
          </Link>
        </li>
        <li>
          <Link to="/agents" className="menu-link">
            <MdPersonAdd className="menu-icon" />
            {isOpen && <span className="menu-text">Agents</span>}
          </Link>
        </li>
        <li>
          <Link to="/addsites" className="menu-link">
            <MdLocationOn className="menu-icon" />
            {isOpen && <span className="menu-text">Add Sites</span>}
          </Link>
        </li>
        <li>
          <Link to="/addcategories" className="menu-link">
            <MdLabel className="menu-icon" />
            {isOpen && <span className="menu-text">Add Category</span>}
          </Link>
        </li>
        <li>
          <Link to="/addroles" className="menu-link">
            <MdPersonAdd className="menu-icon" />
            {isOpen && <span className="menu-text">Add Role</span>}
          </Link>
        </li>
        <li>
          <Link to="/accesscontol" className="menu-link">
            <MdSecurity className="menu-icon" />
            {isOpen && <span className="menu-text">Access Control</span>}
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;