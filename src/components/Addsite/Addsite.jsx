import React, { useState , useEffect } from 'react';
import './Addsite.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; // Close icon from react-icons

const Addsites = ({ isOpen, onClose, siteId, onUpdate }) => {
    const [siteName, setSiteName] = useState('');
    const [siteAddress, setSiteAddress] = useState('');
    const [siteContact, setSiteContact] = useState('');
    const [siteCode, setSiteCode] = useState('');

    const apiUrl = process.env.REACT_APP_API_URL;

    // If editing, fetch the site data based on siteId
    useEffect(() => {
        if (siteId) {
            fetchSiteData(siteId);
        }
    }, [siteId]);

    const fetchSiteData = async (id) => {
        try {
            const response = await axios.get(`${apiUrl}/api/sites/${id}`);
            const site = response.data;
            setSiteName(site.siteName);
            setSiteAddress(site.siteAddress);
            setSiteContact(site.siteContact);
            setSiteCode(site.siteCode);
        } catch (err) {
            console.error('Failed to fetch site data', err);
            toast.error('Failed to load site data. Please try again.');
        }
    };

    const handleClear = () => {
        setSiteName('');
        setSiteAddress('');
        setSiteContact('');
        setSiteCode('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const siteData = {
            siteName,
            siteAddress,
            siteContact,
            siteCode,
        };

        // Validate site contact number to be 10 digits
        if (siteContact.length !== 10) {
            alert("Please enter a valid 10-digit phone number.");
            toast.error('Failed to Add the Site. Please Enter a valid phone number.');
            return;
        }

        try {
            if (siteId) {
                // Update site if siteId exists
                await axios.put(`${apiUrl}/api/sites/${siteId}`, siteData);
                toast.success('Site Updated Successfully!');
                onUpdate(siteId, siteData); // Update the parent component
            } else {
                // Add new site
                await axios.post(`${apiUrl}/api/sites`, siteData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                toast.success('Site Added Successfully!');
            }
            handleClear();  // Clear the form after saving
            onClose();  // Close the modal after adding/updating the site
            window.location.reload();
        } catch (err) {
            console.error('Error saving the site', err);
            toast.error('Failed to save the site. Please try again.');
        }
    };

    if (!isOpen) return null; // Return null if the modal is not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{siteId ? 'Edit Site' : 'Add New Site'}</h2>
                    <FaTimes className="close-icon" onClick={onClose} /> {/* Close icon */}
                </div>
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
                            maxLength={10}
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
                            maxLength={10}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">{siteId ? 'Update Site' : 'Add Site'}</button>
                        {/* <button type="button" className="clear-btn" onClick={onClose}>Cancel</button> */}
                    </div>
                </form>
                <ToastContainer />  {/* Correctly render the ToastContainer */}
            </div>
        </div>
    );
};

export default Addsites;
