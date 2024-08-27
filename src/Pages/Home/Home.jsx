import React from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import ellipse1 from './Ellipse 4.png';
import ellipse2 from './Ellipse 3.png';
import ellipse3 from './blue-ellipse.png';
import DashboardImage from './__next_static_media_hero-img-3-1.e9d91e68 1 (1).png';
import RocketImage from './rocket_3-removebg-preview.png';
import EndImage from './endimage.png';
import CloudStorageIcon from './download.png';
import CustomizationIcon from './applications 1.png';
import MobileAccessIcon from './smartphone 1.png';
import MailIcon from './mail.png';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <Navbar />
      <div className="background-ellipses">
        <img src={ellipse1} alt="Background Ellipse 1" className="ellipse ellipse-1" />
        <img src={ellipse2} alt="Background Ellipse 2" className="ellipse ellipse-2" />
        <img src={ellipse3} alt="Background Ellipse 3" className="ellipse ellipse-3" />
      </div>
      <h1 className="main-heading">The Leading <span>Billing Software</span></h1>
      <form className="email-signup-form">
        <div className='email-icon gradient-text'><img src={MailIcon} alt="Mail Icon" /></div>
        <input type="email" placeholder="Business E-mail address" className="email-input gradient-text"/>
        <button type="submit" className="demo-button">GET demo</button>
      </form>
      <h3 className="privacy-note">We are not going to Save Your data</h3>
      <div className="dashboard-container">
        <img src={DashboardImage} alt="Software Dashboard" className="dashboard-image"/>
        <img src={RocketImage} alt="Rocket Icon" className="rocket-image"/>
      </div>

      <div className="features-container">
        <h2 className="features-heading">Our Extreme <span>Features</span></h2>
        <p className="features-subheading">We Build Trust with More than 15000+ Companies.</p>
        <div className="features-list">
          <div className="feature-item">
            <img src={CloudStorageIcon} alt="Cloud Storage" />
            <p>Cloud Storage</p>
          </div>
          <div className="feature-item">
            <img src={MobileAccessIcon} alt="Mobile Access" />
            <p>Mobile Access</p>
          </div>
          <div className="feature-item">
            <img src={CustomizationIcon} alt="Customization" />
            <p>Customization</p>
          </div>
        </div>
      </div>

      <div className="footer-image-container">
        <img src={EndImage} alt="End of Page Image" className="footer-image"/>
      </div>
    </div>
  );
}

export default HomePage;
