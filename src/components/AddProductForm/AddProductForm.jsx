import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddProductForm.css';
import 'react-toastify/dist/ReactToastify.css';

const AddProductForm = () => {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [siteId, setSiteId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState([]); // Holds the uploaded images
  const [sites, setSites] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch Sites
    axios.get('http://localhost:7171/api/sites')
      .then(response => setSites(response.data))
      .catch(error => console.error('Error fetching sites:', error));

    // Fetch Categories
    axios.get('http://localhost:7171/api/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleImageChange = (e) => {
    setImages([...e.target.files]); // Store the selected images
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
  };

  const AddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('sku', sku);
    formData.append('name', name);
    formData.append('site.siteId', siteId);
    formData.append('category.categoryId', categoryId);
    formData.append('productQuantity.availableQty', quantity);

    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await axios.post('http://localhost:7171/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Product added successfully');
      // Optionally reset form fields here
      setSku('');
      setName('');
      setSiteId('');
      setCategoryId('');
      setQuantity(1);
      setImages([]);
    } catch (error) {
      console.error('There was an error adding the product!', error);
      toast.error('Failed to add product. Please try again.');
    }
  };

  return (
    <div className="product-form-container">
      <h3 className="product-form-title">Add Product</h3>
      <form className="product-form" onSubmit={AddProduct}>
        <label className="product-form-label">SKU ID</label>
        <input type="text" placeholder="SKU ID" value={sku} onChange={(e) => setSku(e.target.value)} className="product-form-input" required />

        <label className="product-form-label">Product Name</label>
        <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} className="product-form-input" required />

        <div className="form-row">
          <div className="form-group">
            <label className="product-form-label">Site</label>
            <select value={siteId} onChange={(e) => setSiteId(e.target.value)} className="product-form-input" required>
              <option value="" disabled>Select a site</option>
              {sites.map(site => (
                <option key={site.siteId} value={site.siteId}>{site.siteName}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="product-form-label">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="product-form-input" required>
              <option value="" disabled>Select a category</option>
              {categories.map(category => (
                <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>
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
          <button type="button" onClick={() => handleQuantityChange(-1)} className="quantity-btn">-</button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="product-form-input quantity-input"
            required
          />
          <button type="button" onClick={() => handleQuantityChange(1)} className="quantity-btn">+</button>
        </div>

        <button type="submit" className="product-form-submit-button">Save Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;
