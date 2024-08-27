import React from 'react';
import './Login.css';
import seoImage from './seo3.png'; // Import the desktop image
import rocketIcon from './rocket_3-removebg-preview.png'; // Import the rocket icon image
import ellipse2 from './Ellipse3.png'; // Import the first ellipse
import ellipse3 from './Ellipse4.png'; // Import the second ellipse
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-heading-0 welcome-section">
        <h1 className='gradient-text'>DigiTechno Sol <span role="img" aria-label="lightning bolt">⚡</span></h1>
        <img src={seoImage} alt="Desktop" className="desktop-icon" /> 
        <h1 className='login-heading-1'>Welcome</h1>
        <h1 className='login-heading-2'>To DTS Billing Software</h1>
        <div className="rocket-icon">
          <img src={rocketIcon} alt="Rocket Icon" /> 
        </div>
      </div>
      <img src={ellipse2} alt="Ellipse 2" className="login-ellipse login-ellipse-3" />
      <div className="login-section">
      
        <h2 className="login-title">Log In</h2>
        <form>
          <div className="input-group">
            <input type="text" placeholder="Enter username" aria-label="Enter username" />
            <span className="input-icon" role="img" aria-label="user">👤</span>
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" aria-label="Enter password" />
            <span className="input-icon" role="img" aria-label="lock">🔒</span>
          </div>
          <div className="options">
            <a href="#forgot-password" className="forgot-password">Forgot Password</a>
            <label>
              <input type="checkbox" name="remember" /> Remember me
            </label>
          </div>
          <div className="button-container">
            <Link to="/signup"><button type="submit" className="SignUp-button gradient-text">SignUp</button></Link>
            <Link to="/genearate"><button type="submit" className="submit-button">SUBMIT</button></Link>
          </div>
        </form>
      </div>
      <img src={ellipse3} alt="Ellipse 3" className="login-ellipse login-ellipse-2" />

    </div>
  );
};

export default LoginPage;
