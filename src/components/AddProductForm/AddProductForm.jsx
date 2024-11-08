import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTimes } from 'react-icons/fa';

const AddProductForm = () => {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [siteId, setSiteId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [quantity, setQuantity] = useState();
  const [images, setImages] = useState([]);
  const [sites, setSites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [rate, setRate] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false); // Add a loading state

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/sites`);
        setSites(response.data);
      } catch (error) {
        console.error('Error fetching sites:', error);
        toast.error('Failed to fetch sites.');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories.');
      }
    };

    fetchSites();
    fetchCategories();
  }, [apiUrl]);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  const uploadImages = async () => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await axios.post(`${apiUrl}/api/products/upload-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageDetails = response.data.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
      }));

      return imageDetails;
    } catch (error) {
      toast.error('Failed to upload images.');
      throw error;
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();

    // Disable button and show loading state
    setIsSubmitting(true);

    try {
      const imageDetails = await uploadImages();

      const productData = {
        sku,
        name,
        rate,
        site: {
          siteId,
        },
        category: {
          categoryId,
        },
        productQuantity: {
          availableQty: quantity,
        },
        images: imageDetails,
      };

      await axios.post(`${apiUrl}/api/products`, productData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success('Product added successfully!');
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      toast.error('Failed to add product.');
      // Re-enable button in case of error
      setIsSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  if (!showForm) {
    return null;
  }

  return (
    <div className="product-form-modal">
      <div className="product-form-container">
        <div className="product-form-header">
          <h3 className="product-form-title">Add Product</h3>
          <FaTimes className="close-icon-productfrom" onClick={handleCloseForm} />
        </div>
        <form className="product-form" onSubmit={addProduct}>

          <div className="form-group">
            <label className="product-form-label">SKU ID</label>
            <input
              type="text"
              placeholder="SKU ID"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className={`product-form-input ${!sku && "input-error"}`}
              required
            />
            {!sku && <small className="error-message">SKU is required</small>}
          </div>

          <div className="form-group">
            <label className="product-form-label">Product Name</label>
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`product-form-input ${!name && "input-error"}`}
              required
            />
            {!name && <small className="error-message">Product Name is required</small>}
          </div>

          <div className="form-group">
            <label className="product-form-label">Site</label>
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              className="product-form-input dropdown"
              required
            >
              <option value="" disabled>Select a site</option>
              {sites.map((site) => (
                <option key={site.siteId} value={site.siteId}>
                  {site.siteName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="product-form-label">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="product-form-input dropdown"
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="product-form-label">Upload Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="product-form-input"
            />
          </div>

          <div className="form-group">
            <label className="product-form-label">Quantity</label>
            <div className="quantity-control">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                className="quantity-btn-product-form"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="quantity-input"
                required
              />
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                className="quantity-btn-product-form"
              >
                +
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="product-form-label">Rate</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value) || 0))}
              className="product-form-input"
              placeholder="Rate"
              required
            />
          </div>

          <button
            type="submit"
            className="product-form-submit-button"
            disabled={isSubmitting || !sku || !name || !siteId || !categoryId} // Disable button if form is incomplete or submitting
          >
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
