import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddProductForm.css';
import 'react-toastify/dist/ReactToastify.css';
import { FaTimes } from 'react-icons/fa';

const AddProductForm = () => {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [siteId, setSiteId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState([]);
  const [sites, setSites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [rate, setRate] = useState(0);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Fetch Sites
    const fetchSites = async () => {
      try {
        const response = await axios.get('http://localhost:7171/api/sites');
        setSites(response.data);
      } catch (error) {
        console.error('Error fetching sites:', error);
        toast.error('Failed to fetch sites.');
      }
    };

    // Fetch Categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:7171/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories.');
      }
    };

    fetchSites();
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
  };

  const uploadImages = async () => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await axios.post('http://localhost:7171/api/products/upload-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageDetails = response.data.map(image => ({
        id: image.id,
        imageUrl: image.imageUrl,
      }));

      console.log("Images uploaded:", imageDetails);
      return imageDetails;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images.');
      throw error;
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const imageDetails = await uploadImages(); // Upload images and get their details (id and imageUrl)

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
        images: imageDetails, // Add the array of image details (id and imageUrl)
      };

      const response = await axios.post('http://localhost:7171/api/products', productData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success('Product added successfully!');
      console.log('Product added:', response.data);
      setShowForm(false); // Automatically close the modal after saving

      // Reload the page after saving the product
      window.location.reload();

    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product.');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  if (!showForm) {
    return null;
  }

  return (
    <div className="product-form-container">
      <div className="product-form-header">
        <h3 className="product-form-title">Add Product</h3>
        <FaTimes className="close-icon" onClick={handleCloseForm} />
      </div>
      <form className="product-form" onSubmit={addProduct}>
        <label className="product-form-label">SKU ID</label>
        <input
          type="text"
          placeholder="SKU ID"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="product-form-input"
          required
        />

        <label className="product-form-label">Product Name</label>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="product-form-input"
          required
        />

        <div className="form-row">
          <div className="form-group">
            <label className="product-form-label">Site</label>
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              className="product-form-input"
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
              className="product-form-input"
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
        </div>

        <label className="product-form-label">Upload Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="product-form-input"
        />

        <label className="product-form-label">Quantity</label>
        <div className="quantity-control">
          <button
            type="button"
            onClick={() => handleQuantityChange(-1)}
            className="quantity-btn"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="product-form-input quantity-input"
            required
          />
          <button
            type="button"
            onClick={() => handleQuantityChange(1)}
            className="quantity-btn"
          >
            +
          </button>
        </div>

        <label className="product-form-label">Rate</label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value) || 0))}
          className="product-form-input"
          placeholder="Rate"
          required
        />

        <button type="submit" className="product-form-submit-button">
          Save Product
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
