import React, { useState } from 'react';
import './AddCatagories.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Sidebar from '../SideBar/SideBar';

const AddCatagories = () => {
    const [categoriename, setcategoriename] = useState('');
    const [categoriediscription, setcategoriediscription] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to control sidebar visibility
    const apiUrl = process.env.REACT_APP_API_URL; // Use the API URL from the environment variables
    
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
            await axios.post(`${apiUrl}/api/categories`, categoriesdata, {
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
        <div className={`add-categories-form-container`}>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className={`main-content ${isSidebarOpen ? 'open' : 'closed'}`}>
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
        </div>
    );
};

export default AddCatagories;
