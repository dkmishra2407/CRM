import React, { useState } from 'react';
import './AddAgents.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const AddSalesAgentForm = ({ isOpen, onClose }) => {
  const [agentId, setAgentId] = useState('');
  const [agentName, setAgentName] = useState('');
  const [site, setSite] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [customerType, setCustomerType] = useState('Retail');
  const [taxIdentificationNumber, setTaxIdentificationNumber] = useState('');
  const [image, setImage] = useState(null);

  // Validation state
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleClear = () => {
    setAgentId('');
    setAgentName('');
    setSite('');
    setContact('');
    setAddress('');
    setEmailAddress('');
    setCustomerType('Retail');
    setTaxIdentificationNumber('');
    setImage(null);
    setErrors({}); // Clear errors
  };

  const validateForm = () => {
    const newErrors = {};
    if (!agentId) newErrors.agentId = 'Agent ID is required.';
    if (!agentName) newErrors.agentName = 'Agent Name is required.';
    if (!site) newErrors.site = 'Site is required.';
    if (!contact) newErrors.contact = 'Contact number is required.';
    if (!address) newErrors.address = 'Address is required.';
    if (!emailAddress) {
      newErrors.emailAddress = 'Email Address is required.';
    } else if (!/\S+@\S+\.\S+/.test(emailAddress)) {
      newErrors.emailAddress = 'Email Address is invalid.';
    }
    if (!taxIdentificationNumber) newErrors.taxIdentificationNumber = 'Tax Identification Number is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSave = async () => {
    if (!validateForm()) return; // Validate before proceeding

    const customerData = {
      customerId: agentId,
      customerName: agentName,
      contactPerson: agentName,
      billingAddress: address,
      shippingAddress: address,
      phoneNumber: contact,
      emailAddress: emailAddress,
      customerType: customerType,
      taxIdentificationNumber: taxIdentificationNumber,
    };

    try {
      await axios.post('http://localhost:7171/api/customers', customerData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success('Agent Added Successfully!');
      handleClear();  // Clear the form after saving
      onClose();  // Close the modal after saving
    } catch (err) {
      console.error('Error saving the form', err);
      toast.error('Failed to Add the Agent. Please try again.');
    }
  };

  if (!isOpen) return null; // Do not render the modal if it's not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="form-title">Add Sales Agent</h2>
          <FaTimes className="close-icon" onClick={onClose} /> {/* Close icon */}
        </div>
        <div className="form-fields">
          <div className="left-section">
            <div className="form-group">
              <label>Agent ID</label>
              <input
                type="text"
                placeholder="Enter Agent Id"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
              />
              {errors.agentId && <span className="error">{errors.agentId}</span>}
            </div>
            <div className="form-group">
              <label>Agent Name</label>
              <input
                type="text"
                placeholder="Agent Name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
              />
              {errors.agentName && <span className="error">{errors.agentName}</span>}
            </div>
            <div className="form-group">
              <label>Site</label>
              <input
                type="text"
                placeholder="E.g Vishrantwadi / Lohagaon"
                value={site}
                onChange={(e) => setSite(e.target.value)}
              />
              {errors.site && <span className="error">{errors.site}</span>}
            </div>
            <div className="form-group">
              <label>Contact</label>
              <input
                type="text"
                placeholder="Enter Contact No"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              {errors.contact && <span className="error">{errors.contact}</span>}
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                placeholder="Enter Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter Email Address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
              {errors.emailAddress && <span className="error">{errors.emailAddress}</span>}
            </div>
            <div className="form-group">
              <label>Customer Type</label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
              >
                <option value="Retail">Retail</option>
                <option value="Wholesale">Wholesale</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tax Identification Number</label>
              <input
                type="text"
                placeholder="Enter Tax Identification Number"
                value={taxIdentificationNumber}
                onChange={(e) => setTaxIdentificationNumber(e.target.value)}
              />
              {errors.taxIdentificationNumber && <span className="error">{errors.taxIdentificationNumber}</span>}
            </div>
          </div>
          <div className="right-section">
            <div className="image-preview">
              <img
                src={image || 'https://via.placeholder.com/150'}
                alt="Selected"
                className="selected-image"
              />
            </div>
            <input type="file" onChange={handleImageChange} className="image-input"/>
            <button className="select-image-btn">Select Image</button>
          </div>
        </div>
        <div className="form-actions">
          <button onClick={handleClear} className="clear-btn">CLEAR</button>
          <button onClick={handleSave} className="save-btn" disabled={Object.keys(errors).length > 0}>SAVE</button>
        </div>
      </div>
    </div>
  );
};

export default AddSalesAgentForm;
