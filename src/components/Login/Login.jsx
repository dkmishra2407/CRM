import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { usePage } from '../../Context/page-context';
import seoImage from './seo3.png';
import rocketIcon from './rocket_3-removebg-preview.png';
import ellipse2 from './Ellipse3.png';
import ellipse3 from './Ellipse4.png';

const LoginPage = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();
  const { dispatch } = usePage();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = { userName: user, password: pass };

    try {
      const response = await fetch(`${apiUrl}/api/associates/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();

      if (data.active) {
        const pages = data.role.rolePageXrefs.map((xref) => xref.page);
        dispatch({ type: 'SET_PAGES', payload: pages });
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('pageAccess', JSON.stringify(pages));
        onLogin(pages);

        if (pages.length > 0) navigate('/webstore');
        else toast.error('No accessible pages found for your role.');
      } else {
        toast.error('User is not active.');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      {/* Welcome Section */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center space-y-8 p-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">
          DigiTechno Sol ⚡
        </h1>
        <img src={seoImage} alt="Desktop Icon" className="w-72 h-72" />
        <h1 className="text-3xl font-bold text-gray-700">Welcome</h1>
        <h2 className="text-xl font-semibold text-gray-600">To DTS Billing Software</h2>
        <img src={rocketIcon} alt="Rocket Icon" className="w-24 h-24" />
      </div>

      {/* Ellipse Backgrounds */}
      <img src={ellipse2} alt="Ellipse 2" className="absolute top-10 right-10 hidden md:block" />
      {/* <img src={ellipse3} alt="Ellipse 3" className="absolute top-160 left-100 hidden md:block" /> */}

      {/* Login Section */}
      <div className="w-full md:w-1/3 bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              aria-label="Enter username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">👤</span>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              aria-label="Enter password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
            <button type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-500" onClick={togglePasswordVisibility}>
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <a href="#forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </a>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-300"
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
