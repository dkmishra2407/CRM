import React from 'react';
import './QoutationModal.css';
import { FaTimes } from 'react-icons/fa';
const QoutationModal = ({ onClose, children }) => {
  return (
    <div className="modal-overlay-1">
     
      <div className="modal-content-2">
        
        <div className="modal-body">
        <FaTimes className='quotationModalClose' onClick={onClose} />
        {children}</div>
      </div>
    </div>
  );
};

export default QoutationModal;
