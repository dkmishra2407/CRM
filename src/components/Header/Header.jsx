import React from 'react';
import './Header.css'; // Import the CSS file for styling
import { FaBell, FaUser, FaBolt, FaSignOutAlt } from 'react-icons/fa'; // Import icons
import { Link, useNavigate } from 'react-router-dom';
import { usePage } from '../../Context/page-context'; 

const Header = () => {
  const navigate = useNavigate();
  const { dispatch } = usePage(); 

  const handleLogout = () => {
    dispatch({ type: "SET_PAGES", payload: [] });
    localStorage.removeItem('userSession');

    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to='/webstore'>
          <span className="logo-text gradient-text">DigiTechno</span>
          <span className="logo-sol gradient-text"> Sol</span>
          <FaBolt className="logo-icon" />
        </Link>
      </div>
      <div className="header-icons">
        <FaBell className="header-icon" />
        <Link to='/profile'><FaUser className="header-icon" /></Link>
        <FaSignOutAlt className="header-icon" onClick={handleLogout} />
      </div>
    </header>
  );
};

export default Header;
