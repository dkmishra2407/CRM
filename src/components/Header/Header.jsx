import React from 'react';
import './Header.css'; // Import the CSS file for styling
import { FaBell, FaUser, FaBolt } from 'react-icons/fa'; // Import icons
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to='/webstore'><span className="logo-text gradient-text">DigiTechno</span></Link>
        <span className="logo-sol gradient-text"> Sol</span>
        <FaBolt className="logo-icon" />
      </div>
      <div className="header-icons">
        <FaBell className="header-icon" />
        <Link to='/login'><FaUser className="header-icon" /></Link>
      </div>
    </header>
  );
};

export default Header;
