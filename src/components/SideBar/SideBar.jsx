import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTachometerAlt, FaUsers, FaBoxOpen, FaShoppingCart, FaDollarSign, FaChartPie, FaUserTie, FaStore } from 'react-icons/fa';
import './SideBar.css';
import Agent from "../../Pages/Agents/Agents";
import { Link } from 'react-router-dom';
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">{isOpen ? "MyLogo" : "M"}</div>
        <button className="toggle-btn gradient-text" onClick={toggleSidebar}>
          {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>
      <ul className="sidebar-menu">
      <Link to="/dashboard">
        <li>
          <FaTachometerAlt className="gradient-text" /> {isOpen && "Dashboard"}
        </li>
        </Link>
        <Link to="/agents">
        <li>
          <FaUsers className="gradient-text" /> {isOpen && "Customers"}
        </li>
        </Link>
        <Link to="/inventory">
        <li>
          <FaBoxOpen className="gradient-text" /> {isOpen && "Inventory"}
        </li>
        </Link>
        <Link to="/sales">
        <li>
          <FaShoppingCart className="gradient-text" /> {isOpen && "Sales"}
        </li>
        </Link>
        <Link to="/purchase">
        <li>
          <FaDollarSign className="gradient-text" /> {isOpen && "Purchase"}
        </li>
        </Link>
        <Link to="/expenses">
        <li>
          <FaChartPie className="gradient-text" /> {isOpen && "Expenses"}
        </li>
        </Link>
        <Link to="/agents">
        <li>
          <FaUserTie className="gradient-text" /> {isOpen && "Agents"}
        </li>
        </Link>
        <li>
          <FaChartPie className="gradient-text" /> {isOpen && "Reports"}
        </li>
        <li>
          <FaStore className="gradient-text" /> {isOpen && "Web Store"}
        </li>
      </ul>
      <div className="sidebar-footer">
        <button className="footer-btn gradient-text">Custom Action</button>
      </div>
    </aside>
  );
};

export default Sidebar;
