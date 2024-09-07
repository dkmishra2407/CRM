import React from 'react';
import './SideBar.css';
import logo from './company_logo.png'; // Ensure the logo path is correct
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          {isOpen ? (
            <img src={logo} alt="Company Logo" className="logo" />
          ) : (
            <img src={logo} alt="Company Logo" className="logo-collapsed" />
          )}
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <span className="material-icons">
            {isOpen ? 'chevron_left' : 'chevron_right'}
          </span>
        </button>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/webstore" className="menu-link">
            <span className="material-icons menu-icon">store</span>
            {isOpen && <span className="menu-text">Web Store</span>}
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="menu-link">
            <span className="material-icons menu-icon">dashboard</span>
            {isOpen && <span className="menu-text">Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/customer" className="menu-link">
            <span className="material-icons menu-icon">people</span>
            {isOpen && <span className="menu-text">Customers</span>}
          </Link>
        </li>
        <li>
          <Link to="/inventory" className="menu-link">
            <span className="material-icons menu-icon">inventory_2</span>
            {isOpen && <span className="menu-text">Inventory</span>}
          </Link>
        </li>
        {/* <li>
          <Link to="/sales" className="menu-link">
            <span className="material-icons menu-icon">shopping_cart</span>
            {isOpen && <span className="menu-text">Sales</span>}
          </Link>
        </li> */}
        {/* <li>
          <Link to="/purchase" className="menu-link">
            <span className="material-icons menu-icon">attach_money</span>
            {isOpen && <span className="menu-text">Purchase</span>}
          </Link>
        </li> */}
        {/* <li>
          <Link to="/expenses" className="menu-link">
            <span className="material-icons menu-icon">pie_chart</span>
            {isOpen && <span className="menu-text">Expenses</span>}
          </Link>
        </li> */}
        <li>
          <Link to="/agents" className="menu-link">
            <span className="material-icons menu-icon">person</span>
            {isOpen && <span className="menu-text">Agents</span>}
          </Link>
        </li>
        {/* <li>
          <Link to="/reports" className="menu-link">
            <span className="material-icons menu-icon">assessment</span>
            {isOpen && <span className="menu-text">Reports</span>}
          </Link>
        </li> */}
        <li>
          <Link to="/addsites" className="menu-link">
            <span className="material-icons menu-icon">place</span>
            {isOpen && <span className="menu-text">Add Sites</span>}
          </Link>
        </li>
        <li>
          <Link to="/addcategories" className="menu-link">
            <span className="material-icons menu-icon">label</span>
            {isOpen && <span className="menu-text">Add Category</span>}
          </Link>
        </li>
        <li>
          <Link to="/addroles" className="menu-link">
            <span className="material-icons menu-icon">label</span>
            {isOpen && <span className="menu-text">Add Role</span>}
          </Link>
        </li>
        <li>
          <Link to="/accesscontol" className="menu-link">
            <span className="material-icons menu-icon">label</span>
            {isOpen && <span className="menu-text">Access Control</span>}
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
