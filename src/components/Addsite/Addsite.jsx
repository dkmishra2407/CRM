import React, { useState } from 'react';
import './Addsite.css';
import Sidebar from '../SideBar/SideBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Addsites = () => {
    const [siteName, setSiteName] = useState('');
    const [siteAddress, setSiteAddress] = useState('');
    const [siteContact, setSiteContact] = useState('');
    const [siteCode, setSiteCode] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to control sidebar visibility

    const handleClear = () => {
        setSiteName('');
        setSiteAddress('');
        setSiteContact('');
        setSiteCode('');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar state
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const siteData = {
            siteName,
            siteAddress,
            siteContact,
            siteCode,
        };

        try {
            await axios.post('http://localhost:7171/api/sites', siteData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Site Added Successfully!');
            handleClear();  // Clear the form after saving
        } catch (err) {
            console.error('Error saving the site', err);
            toast.error('Failed to Add the Site. Please try again.');
        }
    };

    return (
        <div className={`add-sites-form-container`}>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`main-content ${isSidebarOpen ? 'open' : 'closed'}`}>
                <h2>Add New Site</h2>
                <form onSubmit={handleSubmit} className="add-sites-form">
                    <div className="form-group">
                        <label htmlFor="siteName">Site Name</label>
                        <input
                            type="text"
                            id="siteName"
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            placeholder="Enter site name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="siteAddress">Site Address</label>
                        <textarea
                            id="siteAddress"
                            value={siteAddress}
                            onChange={(e) => setSiteAddress(e.target.value)}
                            placeholder="Enter site address"
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="siteContact">Site Contact</label>
                        <input
                            type="text"
                            id="siteContact"
                            value={siteContact}
                            onChange={(e) => setSiteContact(e.target.value)}
                            placeholder="Enter site contact"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="siteCode">Site Code</label>
                        <input
                            type="text"
                            id="siteCode"
                            value={siteCode}
                            onChange={(e) => setSiteCode(e.target.value)}
                            placeholder="Enter site code"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">Add Site</button>
                        <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
                    </div>
                </form>
                <ToastContainer />  {/* Correctly render the ToastContainer */}
            </div>
        </div>
    );
};

export default Addsites;
