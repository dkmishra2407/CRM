import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SaleModal = ({ onClose, selectedSale }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-y-auto">
      <div className="relative bg-white w-full md:w-3/4 lg:w-4/5 xl:w-3/4 p-6 rounded-lg shadow-lg overflow-y-scroll max-h-screen">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-20 right-3 text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="h-6 w-6" />
        </button>

        {/* Sale Details */}
        <div className="quotation-details-container">
          <div className="mb-4">
            <h1 className="text-xl font-bold">Sale Details</h1>
            <h4 className="text-gray-600">Validity Period: {selectedSale.dueDate}</h4>
          </div>

          {/* Customer Information */}
          <div className="customer-info">
            <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="text-lg font-semibold">Customer Information</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  Customer Name:
                  <input
                    type="text"
                    value={selectedSale.quotation.customer.customerName}
                    readOnly
                    className="block w-full mt-1 p-2 border rounded-md"
                  />
                </label>
                <label className="block">
                  Email Address:
                  <input
                    type="email"
                    value={selectedSale.quotation.customer.emailAddress}
                    readOnly
                    className="block w-full mt-1 p-2 border rounded-md"
                  />
                </label>
                <label className="block">
                  Phone Number:
                  <input
                    type="text"
                    value={selectedSale.quotation.customer.phoneNumber}
                    readOnly
                    className="block w-full mt-1 p-2 border rounded-md"
                  />
                </label>
                <label className="block">
                  Shipping Address:
                  <input
                    type="text"
                    value={selectedSale.quotation.customer.shippingAddress}
                    readOnly
                    className="block w-full mt-1 p-2 border rounded-md"
                  />
                </label>
                <label className="block">
                  Agent Name:
                  <input
                    type="text"
                    value={selectedSale.quotation.associate.associateName}
                    readOnly
                    className="block w-full mt-1 p-2 border rounded-md"
                  />
                </label>
                <label className="block">
                  Sale Date:
                  <input
                    type="text"
                    value={new Date(selectedSale.saleDate).toLocaleDateString()}
                    readOnly
                    className="block w-full mt-1 p-2 border rounded-md"
                  />
                </label>
              </div>
            </fieldset>
          </div>

          {/* Quotation Product Details Table */}
          <table className="w-full text-left mt-6 border border-gray-300">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-2">No</th>
                <th className="p-2">SKU</th>
                <th className="p-2">Product Name</th>
                <th className="p-2">Image</th>
                <th className="p-2">Category</th>
                <th className="p-2">Rate (INR)</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Tax</th>
                <th className="p-2">Discounts</th>
                <th className="p-2">Total</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedSale.quotation.quotationItemDetails.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{item.product.sku}</td>
                  <td className="p-2">{item.product.name}</td>
                  <td className="p-2">
                    <img src={item.product.images[0].imageUrl} alt={item.product.name} width="50" />
                  </td>
                  <td className="p-2">{item.product.category.categoryName}</td>
                  <td className="p-2">Rs {item.rate}</td>
                  <td className="p-2">{item.qty}</td>
                  <td className="p-2">Rs {(item.rate * item.qty * 0.18).toFixed(2)}</td>
                  <td className="p-2">{item.discount || 0}</td>
                  <td className="p-2">Rs {(item.rate * item.qty + item.rate * item.qty * 0.18).toFixed(2)}</td>
                  <td className="p-2">
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Process Sale Button */}
          <div className="mt-6">
            <Link to="/invoice">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Process Sale
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleModal;
