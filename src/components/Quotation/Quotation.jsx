import React, { useState } from 'react';
import axios from 'axios';
import './Quotation.css';

const QuotationForm = () => {
  // State to hold form data
  const apiUrl = process.env.REACT_APP_API_URL;
  const [quotationNumber, setQuotationNumber] = useState('');
  const [quotationDate, setQuotationDate] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [associateId, setAssociateId] = useState('');
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState('');
  const [rate, setRate] = useState('');
  const [subtotal, setSubtotal] = useState('');
  const [discounts, setDiscounts] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [validityPeriod, setValidityPeriod] = useState('');
  const [notesComments, setNotesComments] = useState('');
  const [quotationStatus, setQuotationStatus] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  const sendQuotationData = async () => {
    const quotationData = {
      quotationNumber,
      quotationDate,
      customer: {
        customerId: parseInt(customerId)
      },
      associate: {
        associateId: parseInt(associateId)
      },
      quotationItemDetails: [
        {
          product: {
            productId: parseInt(productId)
          },
          qty: parseInt(qty),
          rate: parseFloat(rate)
        }
      ],
      subtotal: parseFloat(subtotal),
      discounts: parseFloat(discounts),
      taxAmount: parseFloat(taxAmount),
      totalAmount: parseFloat(totalAmount),
      validityPeriod,
      notesComments,
      quotationStatus,
      followUpDate
    };

    try {
      const response = await axios.post(`${apiUrl}/api/quotations`, quotationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Quotation created successfully:', response.data);
    } catch (error) {
      console.error('There was an error creating the quotation:', error);
    }
  };

  return (
    <div className="quotation-form-container">
      <h2>Quotation Form</h2>
      <div className="form-group">
        <label>Quotation Number:</label>
        <input type="text" value={quotationNumber} onChange={(e) => setQuotationNumber(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Quotation Date:</label>
        <input type="date" value={quotationDate} onChange={(e) => setQuotationDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Customer ID:</label>
        <input type="number" value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Associate ID:</label>
        <input type="number" value={associateId} onChange={(e) => setAssociateId(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Product ID:</label>
        <input type="number" value={productId} onChange={(e) => setProductId(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Quantity:</label>
        <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Rate:</label>
        <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Subtotal:</label>
        <input type="number" value={subtotal} onChange={(e) => setSubtotal(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Discounts:</label>
        <input type="number" value={discounts} onChange={(e) => setDiscounts(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Tax Amount:</label>
        <input type="number" value={taxAmount} onChange={(e) => setTaxAmount(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Total Amount:</label>
        <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Validity Period:</label>
        <input type="date" value={validityPeriod} onChange={(e) => setValidityPeriod(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Notes/Comments:</label>
        <textarea value={notesComments} onChange={(e) => setNotesComments(e.target.value)}></textarea>
      </div>
      <div className="form-group">
        <label>Quotation Status:</label>
        <input type="text" value={quotationStatus} onChange={(e) => setQuotationStatus(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Follow-up Date:</label>
        <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
      </div>
      <button className="submit-button" onClick={sendQuotationData}>Send Quotation</button>
    </div>
  );
};

export default QuotationForm;
