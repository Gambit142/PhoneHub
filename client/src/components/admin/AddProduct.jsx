import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, X } from 'lucide-react';
import { addAdminPhone, clearAdminProductError } from '../../reducers/admin/adminProductSlice';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(state => state.adminProduct.loading);
    const error = useSelector(state => state.adminProduct.error);

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        price: '',
        description: '',
        stock: '',
        colors: [],
        storage: [],
        ramSize: [],
        batterySize: '',
        batteryType: '',
        displaySize: '',
        releaseDate: '',
        frontCamera: '',
        backCamera: '',
        os: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedStorages, setSelectedStorages] = useState([]);
    const [selectedRams, setSelectedRams] = useState([]);

    const availableColors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Purple', 'Gold', 'Silver'];
    const availableStorages = ['64GB', '128GB', '256GB', '512GB', '1TB'];
    const availableRams = ['4GB', '6GB', '8GB', '12GB', '16GB'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setImagePreview(null);
    };

    const handleColorChange = (color) => {
        setSelectedColors(prev => {
            const updated = prev.includes(color)
                ? prev.filter(c => c !== color)
                : [...prev, color];
            setFormData(prevData => ({
                ...prevData,
                colors: updated
            }));
            return updated;
        });
    };

    const handleStorageChange = (storage) => {
        setSelectedStorages(prev => {
            const updated = prev.includes(storage)
                ? prev.filter(s => s !== storage)
                : [...prev, storage];
            setFormData(prevData => ({
                ...prevData,
                storage: updated
            }));
            return updated;
        });
    };

    const handleRamChange = (ram) => {
        setSelectedRams(prev => {
            const updated = prev.includes(ram)
                ? prev.filter(r => r !== ram)
                : [...prev, ram];
            setFormData(prevData => ({
                ...prevData,
                ramSize: updated
            }));
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) {
            alert('Please upload an image');
            return;
        }

        const result = await dispatch(addAdminPhone(formData));
        if (addAdminPhone.fulfilled.match(result)) {
            alert('Product added successfully!');
            navigate('/admin/products');
            setFormData({
                name: '',
                brand: '',
                price: '',
                description: '',
                stock: '',
                colors: [],
                storage: [],
                ramSize: [],
                batterySize: '',
                batteryType: '',
                displaySize: '',
                releaseDate: '',
                frontCamera: '',
                backCamera: '',
                os: '',
                image: null
            });
            setImagePreview(null);
            setSelectedColors([]);
            setSelectedStorages([]);
            setSelectedRams([]);
        } else {
            alert(`Error: ${result.payload}`);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-gray-600 mt-2">Create a new mobile phone listing</p>
                {error && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                        <button onClick={() => dispatch(clearAdminProductError())} className="absolute top-0 right-0 px-4 py-3">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="iPhone 15 Pro Max"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Brand *
                                        </label>
                                        <input
                                            type="text"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Apple"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Price *
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="999"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Stock *
                                        </label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="100"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Technical Specifications */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Specifications</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Storage Options *
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {availableStorages.map(storage => (
                                                <label key={storage} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedStorages.includes(storage)}
                                                        onChange={() => handleStorageChange(storage)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm">{storage}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            RAM Options *
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {availableRams.map(ram => (
                                                <label key={ram} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRams.includes(ram)}
                                                        onChange={() => handleRamChange(ram)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm">{ram}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Battery Size *
                                        </label>
                                        <input
                                            type="text"
                                            name="batterySize"
                                            value={formData.batterySize}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="4422mAh"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Battery Type *
                                        </label>
                                        <input
                                            type="text"
                                            name="batteryType"
                                            value={formData.batteryType}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Li-Ion"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Display Size *
                                        </label>
                                        <input
                                            type="text"
                                            name="displaySize"
                                            value={formData.displaySize}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="6.7 inches"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Release Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="releaseDate"
                                            value={formData.releaseDate}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Front Camera *
                                        </label>
                                        <input
                                            type="text"
                                            name="frontCamera"
                                            value={formData.frontCamera}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="12MP"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Back Camera *
                                        </label>
                                        <input
                                            type="text"
                                            name="backCamera"
                                            value={formData.backCamera}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="48MP Triple Camera"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Operating System *
                                        </label>
                                        <input
                                            type="text"
                                            name="os"
                                            value={formData.os}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="iOS 17"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Image Upload */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Image *</h3>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="mt-4">
                                                <label className="cursor-pointer">
                                                    <span className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                                        Upload Image
                                                    </span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-gray-500 text-sm mt-2">
                                                PNG, JPG up to 10MB
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Available Colors *</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {availableColors.map(color => (
                                        <label key={color} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedColors.includes(color)}
                                                onChange={() => handleColorChange(color)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm">{color}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Product description..."
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? 'Adding...' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;