import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  // CSS for styling
import Rocket from './rocket 2.png'
import Search from './Search.png'
import Login from './login 1.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo gradient-text">
        <Link to="/">
          DigiTechnoSol <span role="img" aria-label="lightning">⚡</span>
        </Link>
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        <i className={isOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </div>
      <ul className={isOpen ? "nav-links open" : "nav-links"}>
        <li>
          <Link to="/" onClick={toggleMenu} className='gradient-text'>Home</Link>
        </li>
        <li>
          <Link to="/about" onClick={toggleMenu} className='gradient-text'>About us</Link>
        </li>
        <li>
          <Link to="/contact" onClick={toggleMenu} className='gradient-text'>Contact</Link>
        </li>
        <li>
          <Link to="/blog" onClick={toggleMenu} className='gradient-text'>Blog</Link>
        </li>
      </ul>
      <div className="nav-icons">
        <Link to="/search" className="nav-icon">
        <img src={Search} alt="Search" />
        </Link>
        <Link to="/login" className="nav-icon gradient-text">
        <img src={Login} alt="Login" />
        </Link>
        <Link to="/" className="nav-icon gradient-text">
          <img src={Rocket} alt="logo" />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
