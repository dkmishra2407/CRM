import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login/Login';
import MainContent from './Pages/Home/Home';
import SignUp from './components/SignUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import Contact from './Pages/Contact/Contact';
import About from './Pages/About/About';
import Generate from './Pages/Generate/Generate';
import MyCart from './Pages/Mycard/Mycart';
import AddProductForm from './components/AddProductForm/AddProductForm';
import AddSalesAgentForm from './components/AddAgents/AddAgents'
import Agent from './Pages/Agents/Agents';
import CreateInvoiceComponent from './Pages/Invoice/Invoice'
import AddCatagories from "./components/AddCatagories/AddCatagories";
import QuotationPage from './components/Quotation/Quotation';
import Inventory from './Pages/Inventory/Inventory';
import Addsites from './components/Addsite/Addsite';
import Customer from './Pages/Customer/Customer';
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <Router>
      <ToastContainer/>
      <div>
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/genearate" element={<Generate />} />
          <Route path="/mycart" element={<MyCart />} />
          <Route path="/AddProduct" element={<AddProductForm />} />
          <Route path="/AddAgent" element={<AddSalesAgentForm/>}/>
          <Route path='/agents' element={<Agent />}/>
          <Route path='/createinvoice' element={<CreateInvoiceComponent />}/>
          <Route path='/addcategories' element={<AddCatagories />}/>
          <Route path='/quotation' element={<QuotationPage />}/>
          <Route path='/inventory' element={<Inventory />}/>
          <Route path='/addsites' element={<Addsites />}/>
          <Route path='/customer' element={<Customer />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
