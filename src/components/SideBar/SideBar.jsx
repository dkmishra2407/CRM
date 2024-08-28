import React from 'react';
import './SideBar.css';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">{isOpen ? "MyLogo" : "M"}</div>
        <button className="toggle-btn" style={{color: 'white'}} onClick={toggleSidebar}>
          <span className="material-icons">
            {isOpen ? 'chevron_left' : 'chevron_right'}
          </span>
        </button>
      </div>
      <ul className="sidebar-menu">
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
        <li>
          <Link to="/sales" className="menu-link">
            <span className="material-icons menu-icon">shopping_cart</span>
            {isOpen && <span className="menu-text">Sales</span>}
          </Link>
        </li>
        <li>
          <Link to="/purchase" className="menu-link">
            <span className="material-icons menu-icon">attach_money</span>
            {isOpen && <span className="menu-text">Purchase</span>}
          </Link>
        </li>
        <li>
          <Link to="/expenses" className="menu-link">
            <span className="material-icons menu-icon">pie_chart</span>
            {isOpen && <span className="menu-text">Expenses</span>}
          </Link>
        </li>
        <li>
          <Link to="/agents" className="menu-link">
            <span className="material-icons menu-icon">person</span>
            {isOpen && <span className="menu-text">Agents</span>}
          </Link>
        </li>
        <li>
          <Link to="/reports" className="menu-link">
            <span className="material-icons menu-icon">assessment</span>
            {isOpen && <span className="menu-text">Reports</span>}
          </Link>
        </li>
        <li>
          <Link to="/store" className="menu-link">
            <span className="material-icons menu-icon">store</span>
            {isOpen && <span className="menu-text">Web Store</span>}
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
