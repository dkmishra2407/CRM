import React from 'react';
import './SaleModal.css';
import { FaTimes } from 'react-icons/fa';
const SaleModal = ({ onClose, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <FaTimes className="add-customer-close-icon" onClick={onClose} />
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default SaleModal;
