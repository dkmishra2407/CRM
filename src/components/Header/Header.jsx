import React from 'react';
import './Header.css'; // Import the CSS file for styling
import { FaBell, FaUser, FaBolt, FaSignOutAlt } from 'react-icons/fa'; // Import icons
import { Link, useNavigate } from 'react-router-dom';
import { usePage } from '../../Context/page-context'; 
import Logo from './company_logo.png';

const Header = () => {
  const navigate = useNavigate();
  const { dispatch } = usePage(); 

  const handleLogout = () => {
    dispatch({ type: "SET_PAGES", payload: [] });
    localStorage.removeItem('pageAccess');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('lastVisitedPage');
    navigate('/');
  };

  const [isOpen, setIsOpen] = React.useState(false); // State to manage sidebar visibility

  return (
    <header className="pb-4 bg-white header">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-12 lg:h-16">
          <div className="flex-shrink-0">
            <a href="#" className="flex">
              <img className="w-auto h-6 lg:h-8" src={Logo} alt="Logo" />
            </a>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden">
            {/* Toggle button for mobile view */}
            <svg className={`w-6 h-6 ${isOpen ? 'hidden' : 'block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
            </svg>
            <svg className={`w-6 h-6 ${isOpen ? 'block' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Sidebar links */}
          <div className={`lg:flex lg:items-center lg:ml-auto lg:space-x-10 ${isOpen ? 'flex' : 'hidden'}`}>
            <Link to="/profile"><FaUser className="header-icon" /></Link>
            <FaBell className="header-icon" />
            <FaSignOutAlt className="header-icon" onClick={handleLogout} />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;