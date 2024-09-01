import React, { useState } from 'react';
import './Login.css';
import seoImage from './seo3.png';
import rocketIcon from './rocket_3-removebg-preview.png';
import ellipse2 from './Ellipse3.png';
import ellipse3 from './Ellipse4.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const correctUsername = "Devansh";
  const correctPassword = "123";

  const navigate = useNavigate();

const handlesubmit = (e) => {
  e.preventDefault(); // Prevent the default form submission
  if (user === correctUsername && pass === correctPassword) {
    toast.success("Logged In Successfully!");
    navigate("/Dashboard"); // Navigate to the Dashboard
  } else {
    toast.error("Username or Password does not match!");
  }
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="welcome-section">
        <h1 className="gradient-text">
          DigiTechno Sol <span role="img" aria-label="lightning bolt">⚡</span>
        </h1>
        <img src={seoImage} alt="Desktop" className="desktop-icon" />
        <h1 className="login-heading-1">Welcome</h1>
        <h1 className="login-heading-2">To DTS Billing Software</h1>
        <div className="rocket-icon">
          <img src={rocketIcon} alt="Rocket Icon" className="rocket-image" />
        </div>
      </div>
      <img src={ellipse2} alt="Ellipse 2" className="login-ellipse login-ellipse-3" />
      <div className="login-section">
        <h2 className="login-title">Log In</h2>
        <form onSubmit={handlesubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter username"
              aria-label="Enter username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
            <span className="input-icon" role="img" aria-label="user">👤</span>
          </div>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              aria-label="Enter password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
            <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
              <span className="input-icon" role="img" aria-label="lock">🔒</span>
            </button>
          </div>
          <div className="options">
            <a href="#forgot-password" className="forgot-password">Forgot Password?</a>
            <label>
              <input type="checkbox" name="remember" /> Remember me
            </label>
          </div>
          <div className="button-container">
            <button type="submit" className="submit-button">SUBMIT</button>
          </div>
        </form>
      </div>
      <img src={ellipse3} alt="Ellipse 3" className="login-ellipse login-ellipse-2" />
    </div>
  );
};

export default LoginPage;
