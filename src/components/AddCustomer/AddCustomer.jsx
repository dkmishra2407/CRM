import React, { useState, useEffect } from 'react';
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
    } catch (err) {
      console.error('Failed to fetch customer data', err);
      toast.error('Failed to load customer data. Please try again.');
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
    setSameAsBilling(false);
    setErrors({});
    setIsFormValid(false);
  };

  const handleFieldChange = (field, value) => {
    const newErrors = { ...errors };
    switch (field) {
      case 'customerName':
        setCustomerName(value);
        if (!value) newErrors.customerName = 'Customer Name is required.';
        else delete newErrors.customerName;
        break;
      case 'contact':
        setContact(value);
        if (!value) newErrors.contact = 'Contact number is required.';
        else if (value.length !== 10) newErrors.contact = 'Please enter a valid 10-digit contact number.';
        else delete newErrors.contact;
        break;
      case 'billingAddress':
        setBillingAddress(value);
        if (!value) newErrors.billingAddress = 'Billing address is required.';
        else delete newErrors.billingAddress;
        break;
      case 'shippingAddress':
        setShippingAddress(value);
        if (!value && !sameAsBilling) newErrors.shippingAddress = 'Shipping address is required.';
        else delete newErrors.shippingAddress;
        break;
      case 'emailAddress':
        setEmailAddress(value);
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
    } catch (err) {
      console.error('Error saving the customer', err);
      toast.error('Failed to save the customer. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 shadow-lg relative overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{customerId ? 'Edit Customer' : 'Add Customer'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-gray-700">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => handleFieldChange('customerName', e.target.value)}
              placeholder="Customer Name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.customerName && <span className="text-red-500 text-sm">{errors.customerName}</span>}
          </div>

          <div className="form-group">
            <label className="block text-gray-700">Contact</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => handleFieldChange('contact', e.target.value)}
              placeholder="Enter Contact No"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              maxLength={10}
            />
            {errors.contact && <span className="text-red-500 text-sm">{errors.contact}</span>}
          </div>

          <div className="form-group">
            <label className="block text-gray-700">Billing Address</label>
            <input
              type="text"
              value={billingAddress}
              onChange={(e) => handleFieldChange('billingAddress', e.target.value)}
              placeholder="Enter Billing Address"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.billingAddress && <span className="text-red-500 text-sm">{errors.billingAddress}</span>}
          </div>

          <div className="form-group">
            <label className="block text-gray-700">Shipping Address</label>
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => handleFieldChange('shippingAddress', e.target.value)}
              placeholder="Enter Shipping Address"
              disabled={sameAsBilling}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.shippingAddress && <span className="text-red-500 text-sm">{errors.shippingAddress}</span>}
          </div>
          <div className="form-group flex items-center col-span-2">
            <input
              type="checkbox"
              checked={sameAsBilling}
              onChange={() => setSameAsBilling(!sameAsBilling)}
              className="mr-2"
            />
            <label className="block text-gray-700">Same as Billing Address</label>
          </div>
          
          <div className="form-group col-span-2">
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => handleFieldChange('emailAddress', e.target.value)}
              placeholder="Enter Email Address"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.emailAddress && <span className="text-red-500 text-sm">{errors.emailAddress}</span>}
          </div>

          <div className="form-group col-span-2">
            <label className="block text-gray-700">Customer Type</label>
            <select
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="Retail">Retail</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Walk-in">Walk-in</option>
            </select>
          </div>

          
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Save Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerForm;
