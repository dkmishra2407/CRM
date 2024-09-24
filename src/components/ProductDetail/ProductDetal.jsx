import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const ProductDetailsModal = ({ id, onClose, image }) => {
  const [productDetails, setProductDetail] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  // Fetch product details from the API
  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/products/${id}`);
      setProductDetail(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle delete product function
  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/api/products/${id}`);
      alert("Product deleted successfully!");
      onClose(); // Close the modal after deletion
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  // Handle updating product quantity
  const handleAddMore = async () => {
    const updatedQuantity = prompt("Enter the updated quantity");

    if (!updatedQuantity || isNaN(updatedQuantity)) {
      alert("Please enter a valid number.");
      return;
    }

    try {
      await axios.patch(`${apiUrl}/api/products/${id}/quantity?quantity=${updatedQuantity}`);
      alert("Product quantity updated successfully!");
    } catch (err) {
      console.error("Failed to update product quantity", err);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  const { sku, name, rate, productQuantity, images, category, site } = productDetails;
  const availableQty = productQuantity ? productQuantity.availableQty : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000] overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative">
        {/* Close Icon */}
        <FaTimes onClick={onClose} className="text-gray-500 hover:text-black cursor-pointer absolute top-4 right-4 text-2xl" />

        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="product__photo">
            <div className="photo-container">
              <img src={image} alt={name} className="w-full h-auto rounded-lg object-cover" />
              <div className="photo-album mt-4 flex space-x-2">
                {images.map((img, index) => (
                  <img key={index} src={img.imageUrl} alt={name} className="w-16 h-16 object-cover rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          <div className="product__info">
            <div className="title mb-4">
              <h1 className="text-2xl font-semibold">{name}</h1>
              <span className="text-gray-500">SKU: {sku}</span>
            </div>
            <div className="price mb-4">
              <h2 className="text-xl font-bold">RS {rate.toFixed(2)}</h2>
            </div>

            <div className="description">
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <ul className="space-y-2">
                <li><strong>Category:</strong> {category.categoryName}</li>
                <li><strong>Quantity Available:</strong> {availableQty}</li>
                <li><strong>Description:</strong> {category.categoryDescription}</li>
                <li><strong>Available at Site:</strong> {site.siteName}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleAddMore}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Add More
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
