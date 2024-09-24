import React from 'react';
import { FaTimes } from 'react-icons/fa';

const QoutationModal = ({ onClose, children }) => {
  return (
    <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 z-[10000] overflow-y-auto pt-60">
      <div className="relative w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        <button
          className="absolute top-20 right-3 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <FaTimes className="text-lg" />
        </button>=
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

export default QoutationModal;
