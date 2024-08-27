import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">DigiTechno Sol ⚡</div>
      <div className="search-bar">
        <input type="text" placeholder="Search Customers / Invoice No / Quotation" />
        <button><i className="fa fa-search"></i></button>
      </div>
      <div className="profile">
        <img src="path-to-logo.png" alt="Profile" />
        <span>Sadhguru Tiles</span>
      </div>
    </header>
  );
};

export default Header;
