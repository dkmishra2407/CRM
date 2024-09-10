import React, { useState, useEffect } from 'react';
import './AddCustomer.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const AddCustomerForm = ({ isOpen, onClose, customerId, onUpdate }) => {
  const [customerName, setCustomerName] = useState('');
  const [contact, setContact] = useState('');
  const [site, setSite] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [customerType, setCustomerType] = useState('Retail');
  const [image, setImage] = useState(null);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  
  const apiUrl = process.env.REACT_APP_API_URL;
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (customerId) {
      fetchCustomerData(customerId);
    }
  }, [customerId]);

  useEffect(() => {
    if (sameAsBilling) {
      setShippingAddress(billingAddress);
    }
  }, [sameAsBilling, billingAddress]);

  const fetchCustomerData = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/api/customers/${id}`);
      const customer = response.data;

      setCustomerName(customer.customerName);
      setSite(customer.site || '');
      setContact(customer.phoneNumber);
      setBillingAddress(customer.billingAddress);
      setShippingAddress(customer.shippingAddress);
      setEmailAddress(customer.emailAddress);
      setCustomerType(customer.customerType);
      setImage(customer.imageUrl || null);
    } catch (err) {
      console.error('Failed to fetch customer data', err);
      toast.error('Failed to load customer data. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleClear = () => {
    setCustomerName('');
    setContact('');
    setSite('');
    setBillingAddress('');
    setShippingAddress('');
    setEmailAddress('');
    setCustomerType('Retail');
    setImage(null);
    setSameAsBilling(false);
    setErrors({});
    setIsFormValid(false);
  };

  const handleFieldChange = (field, value) => {
    const newErrors = { ...errors };
    if (field === 'customerName') setCustomerName(value);
    if (field === 'contact') setContact(value);
    if (field === 'site') setSite(value);
    if (field === 'shippingAddress') setShippingAddress(value);
    if (field === 'billingAddress') setBillingAddress(value);
    if (field === 'emailAddress') setEmailAddress(value);

    switch (field) {
      case 'customerName':
        if (!value) newErrors.customerName = 'Customer Name is required.';
        else delete newErrors.customerName;
        break;
      case 'contact':
        if (!value) newErrors.contact = 'Contact number is required.';
        else if (value.length !== 10) newErrors.contact = 'Please enter a valid 10-digit contact number.';
        else delete newErrors.contact;
        break;
      case 'site':
        if (!value) newErrors.site = 'Site is required.';
        else delete newErrors.site;
        break;
      case 'shippingAddress':
        if (!value && !sameAsBilling) newErrors.shippingAddress = 'Shipping address is required.';
        else delete newErrors.shippingAddress;
        break;
      case 'billingAddress':
        if (!value) newErrors.billingAddress = 'Billing address is required.';
        else delete newErrors.billingAddress;
        break;
      case 'emailAddress':
        if (!/\S+@\S+\.\S+/.test(value)) newErrors.emailAddress = 'Email Address is invalid.';
        else delete newErrors.emailAddress;
        break;
      default:
        break;
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleSave = async () => {
    if (!isFormValid) return;

    const customerData = {
      customerName,
      site,
      phoneNumber: contact,
      billingAddress,
      shippingAddress,
      emailAddress,
      customerType,
    };

    try {
      if (customerId) {
        await onUpdate(customerId, customerData);
        toast.success('Customer Updated Successfully!');
      } else {
        await axios.post(`${apiUrl}/api/customers`, customerData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        toast.success('Customer Added Successfully!');
      }
      handleClear();
      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Error saving the form', err);
      toast.error('Failed to save the customer. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-customer-modal-overlay">
      <div className="add-customer-modal-content">
        <div className="add-customer-modal-header">
          <h2 className="add-customer-form-title">{customerId ? 'Edit Customer' : 'Add Customer'}</h2>
          <FaTimes className="add-customer-close-icon" onClick={onClose} />
        </div>
        <div className="add-customer-form-fields">
          <div className="add-customer-left-section">
            <div className="add-customer-form-group">
              <label>Customer Name</label>
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => handleFieldChange('customerName', e.target.value)}
              />
              {errors.customerName && <span className="add-customer-error">{errors.customerName}</span>}
            </div>
            <div className="add-customer-form-group">
              <label>Contact</label>
              <input
                type="text"
                placeholder="Enter Contact No"
                value={contact}
                onChange={(e) => handleFieldChange('contact', e.target.value)}
                maxLength={10}
              />
              {errors.contact && <span className="add-customer-error">{errors.contact}</span>}
            </div>
            <div className="add-customer-form-group">
              <label>Billing Address</label>
              <input
                type="text"
                placeholder="Enter Billing Address"
                value={billingAddress}
                onChange={(e) => handleFieldChange('billingAddress', e.target.value)}
              />
              {errors.billingAddress && <span className="add-customer-error">{errors.billingAddress}</span>}
            </div>
            <div className="checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={() => setSameAsBilling(!sameAsBilling)}
                /> Same as Billing Address
              </label>
            </div>
            <div className="add-customer-form-group">
              <label>Shipping Address</label>
              <input
                type="text"
                placeholder="Enter Shipping Address"
                value={shippingAddress}
                onChange={(e) => handleFieldChange('shippingAddress', e.target.value)}
                disabled={sameAsBilling}
              />
              {errors.shippingAddress && <span className="add-customer-error">{errors.shippingAddress}</span>}
            </div>
            <div className="add-customer-form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter Email Address"
                value={emailAddress}
                onChange={(e) => handleFieldChange('emailAddress', e.target.value)}
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
                <option value="Walk-in">Walk-in</option>
              </select>
            </div>
          </div>
        </div>
        <div className="add-customer-form-actions">
          <button
            onClick={handleSave}
            className="add-customer-save-btn"
          >
            Save Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerForm;
