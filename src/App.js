import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login/Login';
import MainContent from './Pages/Home/Home';
import SignUp from './components/SignUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import Generate from './Pages/Generate/Generate';
import MyCart from './Pages/Mycard/Mycart';
import AddProductForm from './components/AddProductForm/AddProductForm';
import AddSalesAgentForm from './components/AddAgents/AddAgents'
import Agent from './Pages/Agents/Agents';
import CreateInvoiceComponent from './Pages/Invoice/Invoice'
import AddCatagories from "./components/AddCatagories/AddCatagories";
import Inventory from './Pages/Inventory/Inventory';
import Addsites from './components/Addsite/Addsite';
import Customer from './Pages/Customer/Customer';
import AddRoles from './components/AddRole/AddRole';
import Header from './components/Header/Header';
import Sites from './Pages/Sites/Site';
import Roles from './Pages/Role/Role';
import ShowAllCategory from './Pages/ShowAllCategory/ShowAllCategory';
import AccessControl from './Pages/AccessControl/AccessControl';
import { ToastContainer } from 'react-toastify';
import Quotation from './Pages/Quotation/Quotation';
function App() {
  return (
    <Router>
      <ToastContainer/>
      <div className='body'>
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/webstore" element={<Generate />} />
          <Route path="/mycart" element={<MyCart />} />
          <Route path="/AddProduct" element={<AddProductForm />} />
          <Route path="/AddAgent" element={<AddSalesAgentForm/>}/>
          <Route path='/agents' element={<Agent />}/>
          <Route path='/mycart/createinvoice' element={<CreateInvoiceComponent />}/>
          <Route path='/addcategories' element={<ShowAllCategory />}/>
          <Route path='/inventory' element={<Inventory />}/>
          <Route path='/addsites' element={<Sites />}/>
          <Route path='/customer' element={<Customer />}/>
          <Route path='/addroles' element={<Roles />}/>
          <Route path='/accesscontol' element={<AccessControl />}/>
          <Route path='/quotation' element={<Quotation />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
