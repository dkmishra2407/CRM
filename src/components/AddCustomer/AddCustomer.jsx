import React, { useState } from 'react';
import './AddCustomer.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const AddCustomerForm = ({ isOpen, onClose }) => {
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
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
    setCustomerId('');
    setCustomerName('');
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
    if (!customerId) newErrors.customerId = 'Customer ID is required.';
    if (!customerName) newErrors.customerName = 'Customer Name is required.';
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
      customerId: customerId,
      customerName: customerName,
      contactPerson: customerName,
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
      toast.success('Customer Added Successfully!');
      handleClear();  // Clear the form after saving
      onClose();  // Close the modal after saving
    } catch (err) {
      console.error('Error saving the form', err);
      toast.error('Failed to Add the Customer. Please try again.');
    }
  };

  if (!isOpen) return null; // Do not render the modal if it's not open

  return (
    <div className="add-customer-modal-overlay">
      <div className="add-customer-modal-content">
        <div className="add-customer-modal-header">
          <h2 className="add-customer-form-title">Add Customer</h2>
          <FaTimes className="add-customer-close-icon" onClick={onClose} /> {/* Close icon */}
        </div>
        <div className="add-customer-form-fields">
          <div className="add-customer-left-section">
            <div className="add-customer-form-group">
              <label>Customer ID</label>
              <input
                type="text"
                placeholder="Enter Customer Id"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
              {errors.customerId && <span className="add-customer-error">{errors.customerId}</span>}
            </div>
            <div className="add-customer-form-group">
              <label>Customer Name</label>
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              {errors.customerName && <span className="add-customer-error">{errors.customerName}</span>}
            </div>
            <div className="add-customer-form-group">
              <label>Site</label>
              <input
                type="text"
                placeholder="E.g Vishrantwadi / Lohagaon"
                value={site}
                onChange={(e) => setSite(e.target.value)}
              />
              {errors.site && <span className="add-customer-error">{errors.site}</span>}
            </div>
            <div className="add-customer-form-group">
              <label>Contact</label>
              <input
                type="text"
                placeholder="Enter Contact No"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              {errors.contact && <span className="add-customer-error">{errors.contact}</span>}
            </div>
            <div className="add-customer-form-group">
              <label>Address</label>
              <input
                type="text"
                placeholder="Enter Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <span className="add-customer-error">{errors.address}</span>}
            </div>
            <div className="add-customer-form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter Email Address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
              {errors.emailAddress && <span className="add-customer-error">{errors.emailAddress}</span>}
            </div>
            <div className="add-customer-form-group">
              <label>Customer Type</label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
              >
                <option value="Retail">Retail</option>
                <option value="Wholesale">Wholesale</option>
              </select>
            </div>
            <div className="add-customer-form-group">
              <label>Tax Identification Number</label>
              <input
                type="text"
                placeholder="Enter Tax Identification Number"
                value={taxIdentificationNumber}
                onChange={(e) => setTaxIdentificationNumber(e.target.value)}
              />
              {errors.taxIdentificationNumber && <span className="add-customer-error">{errors.taxIdentificationNumber}</span>}
            </div>
          </div>
          <div className="add-customer-right-section">
            <div className="add-customer-image-preview">
              <img
                src={image || 'https://via.placeholder.com/150'}
                alt="Selected"
                className="add-customer-selected-image"
              />
            </div>
            <input type="file" onChange={handleImageChange} className="add-customer-image-input"/>
            <button className="add-customer-select-image-btn">Select Image</button>
          </div>
        </div>
        <div className="add-customer-form-actions">
          <button onClick={handleClear} className="add-customer-clear-btn">CLEAR</button>
          <button onClick={handleSave} className="add-customer-save-btn" disabled={Object.keys(errors).length > 0}>SAVE</button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerForm;
