import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, fetchCurrentUser } from '../../reducers/auth/authSlice';
import { Edit3, Save, X } from 'lucide-react';

const UserInfo = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            // Update user profile via API
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            // Refresh user data
            await dispatch(fetchCurrentUser()).unwrap();
            setIsEditing(false);
        } catch (err) {
            console.error('Update profile error:', err.message);
        }
    };

    const handleCancel = () => {
        // Reset form data to current user data
        setFormData({
            name: user?.name || '',
            email: user?.email || ''
        });
        setIsEditing(false);
    };

    // If no user, show a loading or unauthorized message
    if (!user) {
        return <div className="p-6">Please log in to view your profile.</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <Edit3 className="h-4 w-4" />
                            <span>Edit</span>
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleSave}
                                className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <Save className="h-4 w-4" />
                                <span>Save</span>
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                <X className="h-4 w-4" />
                                <span>Cancel</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6">
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wider">
                        Personal Information
                    </h4>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none
                                 focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <p className="text-gray-900">{formData.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                                focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <p className="text-gray-900">{formData.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <p className="text-gray-900">{user.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;