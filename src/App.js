// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './components/Login/Login';
// import SignUp from './components/SignUp/SignUp';
// import Dashboard from './components/Dashboard/Dashboard';
// import Generate from './Pages/Generate/Generate';
// import MyCart from './Pages/Mycard/Mycart';
// import AddProductForm from './components/AddProductForm/AddProductForm';
// import AddSalesAgentForm from './components/AddAgents/AddAgents';
// import Agent from './Pages/Agents/Agents';
// import CreateInvoiceComponent from './Pages/Invoice/Invoice';
// import ShowAllCategory from './Pages/ShowAllCategory/ShowAllCategory';
// import Inventory from './Pages/Inventory/Inventory';
// import Sites from './Pages/Sites/Site';
// import Customer from './Pages/Customer/Customer';
// import Roles from './Pages/Role/Role';
// import AccessControl from './Pages/AccessControl/AccessControl';
// import Quotation from './Pages/Quotation/Quotation';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if the user is logged in
//   const [accessiblePages, setAccessiblePages] = useState([]);

//   // Load user session from localStorage on app load
//   useEffect(() => {
//     const storedPages = localStorage.getItem('pageAccess');
//     const storedAuth = localStorage.getItem('isAuthenticated');

//     if (storedPages && storedAuth === 'true') {
//       setAccessiblePages(JSON.parse(storedPages));
//       setIsAuthenticated(true);
//     }
//   }, []);

//   // Function to handle login (called from the login page)
//   const handleLogin = (pageAccess) => {
//     setIsAuthenticated(true);
//     setAccessiblePages(pageAccess);
//   };

//   // Function to handle logout
//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     setAccessiblePages([]);

//     // Clear localStorage
//     localStorage.removeItem('pageAccess');
//     localStorage.removeItem('isAuthenticated');
//   };

//   return (
//     <Router>
//       <ToastContainer />
//       <div className='body'>
//         <Routes>


//           {/* Default redirect to login if user is not authenticated */}
//           <Route path="*" element={<Navigate to={isAuthenticated ? "/webstore" : "/"} />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import Generate from './Pages/Generate/Generate';
import MyCart from './Pages/Mycard/Mycart';
import AddProductForm from './components/AddProductForm/AddProductForm';
import AddSalesAgentForm from './components/AddAgents/AddAgents';
import Agent from './Pages/Agents/Agents';
import CreateInvoiceComponent from './Pages/Invoice/Invoice';
import ShowAllCategory from './Pages/ShowAllCategory/ShowAllCategory';
import Inventory from './Pages/Inventory/Inventory';
import Sites from './Pages/Sites/Site';
import Customer from './Pages/Customer/Customer';
import Roles from './Pages/Role/Role';
import AccessControl from './Pages/AccessControl/AccessControl';
import Quotation from './Pages/Quotation/Quotation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const location = useLocation();

  // Load user session from localStorage on app load
  useEffect(() => {
    const storedPages = localStorage.getItem('pageAccess');
    const storedAuth = localStorage.getItem('isAuthenticated');
    const lastVisitedPage = localStorage.getItem('lastVisitedPage');

    if (storedPages && storedAuth === 'true') {
      const pageNames = JSON.parse(storedPages).map(page => page.pageName.toLowerCase());
      setAccessiblePages(pageNames);
      setIsAuthenticated(true);

      // Navigate to last visited page if it's not the current page
      if (lastVisitedPage && lastVisitedPage !== location.pathname) {
        window.history.replaceState(null, '', lastVisitedPage); // Prevent full page reload
      }
    }
    setLoading(false); // End loading once session is checked
  }, [location.pathname]);

  // Store last visited page in localStorage when the route changes
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('lastVisitedPage', location.pathname);
    }
  }, [location.pathname, isAuthenticated]);

  // Function to handle login (called from the login page)
  const handleLogin = (pageAccess) => {
    setIsAuthenticated(true);
    const pageNames = pageAccess.map(page => page.pageName.toLowerCase());
    setAccessiblePages(pageNames);

    // Store in localStorage
    localStorage.setItem('pageAccess', JSON.stringify(pageAccess));
    localStorage.setItem('isAuthenticated', JSON.stringify(true));
    localStorage.setItem('lastVisitedPage', '/dashboard'); // Default page after login
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAccessiblePages([]);
    localStorage.removeItem('pageAccess');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('lastVisitedPage');
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state while session is being verified
  }

  return (
    <div className="body">
      <ToastContainer />
      <Routes>
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Conditionally render routes based on page access */}
          {isAuthenticated && accessiblePages.includes('dashboard') && (
            <Route path="/dashboard" element={<Dashboard />} />
          )}
          {isAuthenticated && accessiblePages.includes('webstore') && (
            <Route path="/webstore" element={<Generate />} />
          )}
          {isAuthenticated && accessiblePages.includes('mycart')  && (
            <Route path="/mycart" element={<MyCart />} />
          )}
          {isAuthenticated && accessiblePages.includes('addproduct') && (
            <Route path="/addproduct" element={<AddProductForm />} />
          )}
          {isAuthenticated && accessiblePages.includes('addagent') && (
            <Route path="/addagent" element={<AddSalesAgentForm />} />
          )}
          {isAuthenticated && accessiblePages.includes('agents') && (
            <Route path="/agents" element={<Agent />} />
          )}
          {isAuthenticated && accessiblePages.includes('createinvoice') && (
            <Route path="/mycart/createinvoice" element={<CreateInvoiceComponent />} />
          )}
          {isAuthenticated && accessiblePages.includes('addcategories') && (
            <Route path='/addcategories' element={<ShowAllCategory />} />
          )}
          {isAuthenticated && accessiblePages.includes('inventory') && (
            <Route path='/inventory' element={<Inventory />} />
          )}
          {isAuthenticated && accessiblePages.includes('addsites') && (
            <Route path='/addsites' element={<Sites />} />
          )}
          {isAuthenticated && accessiblePages.includes('customer') && (
            <Route path='/customer' element={<Customer />} />
          )}
          {isAuthenticated && accessiblePages.includes('addroles') && (
            <Route path='/addroles' element={<Roles />} />
          )}
          {isAuthenticated && accessiblePages.includes('accesscontrol') && (
            <Route path='/accesscontrol' element={<AccessControl />} />
          )}
          {isAuthenticated && accessiblePages.includes('quotation') && (
            <Route path='/quotation' element={<Quotation />} />
          )}
        {/* Default redirect to login if user is not authenticated */}
        <Route path="*" element={<Navigate to={isAuthenticated ? location.pathname : "/"} />} />
      </Routes>
    </div>
  );
};

export default AppWrapper;

