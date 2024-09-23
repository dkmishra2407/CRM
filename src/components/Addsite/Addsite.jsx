import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; // Importing the close icon from react-icons

const Addsites = ({ isOpen, onClose, siteId, onUpdate }) => {
    const [siteName, setSiteName] = useState('');
    const [siteAddress, setSiteAddress] = useState('');
    const [siteContact, setSiteContact] = useState('');
    const [siteCode, setSiteCode] = useState('');

    const apiUrl = process.env.REACT_APP_API_URL;

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

        if (siteContact.length !== 10) {
            alert("Please enter a valid 10-digit phone number.");
            toast.error('Failed to Add the Site. Please Enter a valid phone number.');
            return;
        }

        try {
            if (siteId) {
                await axios.put(`${apiUrl}/api/sites/${siteId}`, siteData);
                toast.success('Site Updated Successfully!');
                onUpdate(siteId, siteData);
            } else {
                await axios.post(`${apiUrl}/api/sites`, siteData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                toast.success('Site Added Successfully!');
            }
            handleClear();
            onClose();
            window.location.reload();
        } catch (err) {
            console.error('Error saving the site', err);
            toast.error('Failed to save the site. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-lg relative overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{siteId ? 'Edit Site' : 'Add New Site'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group">
                        <label htmlFor="siteName" className="block text-gray-700">Site Name</label>
                        <input
                            type="text"
                            id="siteName"
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            placeholder="Enter site name"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="siteAddress" className="block text-gray-700">Site Address</label>
                        <textarea
                            id="siteAddress"
                            value={siteAddress}
                            onChange={(e) => setSiteAddress(e.target.value)}
                            placeholder="Enter site address"
                            rows="4"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="siteContact" className="block text-gray-700">Site Contact</label>
                        <input
                            type="text"
                            id="siteContact"
                            value={siteContact}
                            onChange={(e) => setSiteContact(e.target.value)}
                            placeholder="Enter site contact"
                            maxLength={10}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="siteCode" className="block text-gray-700">Site Code</label>
                        <input
                            type="text"
                            id="siteCode"
                            value={siteCode}
                            onChange={(e) => setSiteCode(e.target.value)}
                            placeholder="Enter site code"
                            maxLength={10}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            {siteId ? 'Update Site' : 'Add Site'}
                        </button>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Addsites;
