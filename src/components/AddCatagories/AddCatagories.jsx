import React, { useState } from 'react';
import './AddCatagories.css';
import { toast, ToastContainer } from 'react-toastify';  // Import ToastContainer correctly
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const AddCatagories = () => {
    const [categoriename, setcategoriename] = useState('');
    const [categoriediscription, setcategoriediscription] = useState('');

    const categoriesdata = {
        categoryName: categoriename,
        categoryDescription: categoriediscription,
    };

    const handleClear = () => {
        setcategoriediscription('');
        setcategoriename('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:7171/api/categories', categoriesdata, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Category Added Successfully!');
            handleClear();  // Clear the form after saving
        } catch (err) {
            console.error('Error saving the form', err);
            toast.error('Failed to Add the Category. Please try again.');
        }
    };

    return (
        <div className="add-categories-form-container">
            <h2>Add New Category</h2>
            <form onSubmit={handleSubmit} className="add-categories-form">
                <div className="form-group">
                    <label htmlFor="categoriename">Category Name</label>
                    <input
                        type="text"
                        id="categoriename"
                        value={categoriename}
                        onChange={(e) => setcategoriename(e.target.value)}
                        placeholder="Enter category name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="categoriediscription">Category Description</label>
                    <textarea
                        id="categoriediscription"
                        value={categoriediscription}
                        onChange={(e) => setcategoriediscription(e.target.value)}
                        placeholder="Enter category description"
                        rows="4"
                        required
                    ></textarea>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn">Add Category</button>
                    <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
                </div>
            </form>
            <ToastContainer />  {/* Correctly render the ToastContainer */}
        </div>
    );
};

export default AddCatagories;
