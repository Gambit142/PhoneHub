import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit3, Trash2, Eye, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    fetchAdminPhones,
    deleteAdminPhone,
    updateAdminPhone,
    selectAdminPhones,
    selectAdminProductLoading,
    selectAdminProductError,
    clearAdminProductError
} from '../../reducers/admin/adminProductSlice';

const ManageProducts = () => {
    const dispatch = useDispatch();
    const phones = useSelector(selectAdminPhones);
    const loading = useSelector(selectAdminProductLoading);
    const error = useSelector(selectAdminProductError);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [editPhoneId, setEditPhoneId] = useState(null);
    const [editForm, setEditForm] = useState({
        id: '',
        model: '',
        brand: '',
        description: '',
        price: '',
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
        os: ''
    });
    const productsPerPage = 10;

    useEffect(() => {
        dispatch(fetchAdminPhones());
    }, [dispatch]);

    // Filter products based on search term
    const filteredProducts = phones.filter(phone =>
        phone.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleDelete = (phoneId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteAdminPhone(phoneId));
        }
    };

    const toggleStock = (phoneId, currentStock) => {
        dispatch(updateAdminPhone({
            id: phoneId,
            phoneData: { stock: currentStock > 0 ? 0 : 1 }
        }));
    };

    const handleEdit = (phone) => {
        setEditPhoneId(phone._id);
        setEditForm({
            id: phone.id || '',
            model: phone.model || '',
            brand: phone.brand || '',
            description: phone.description || '',
            price: phone.price || '',
            stock: phone.stock || 0,
            colors: phone.colors || [],
            storage: phone.storage || [],
            ramSize: phone.ramSize || [],
            batterySize: phone.batterySize || '',
            batteryType: phone.batteryType || '',
            displaySize: phone.displaySize || '',
            releaseDate: phone.releaseDate ? new Date(phone.releaseDate).toISOString().split('T')[0] : '',
            frontCamera: phone.frontCamera || '',
            backCamera: phone.backCamera || '',
            os: phone.os || ''
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        dispatch(updateAdminPhone({
            id: editPhoneId,
            phoneData: {
                id: editForm.id,
                model: editForm.model,
                brand: editForm.brand,
                description: editForm.description,
                price: Number(editForm.price),
                stock: Number(editForm.stock),
                colors: editForm.colors,
                storage: editForm.storage,
                ramSize: editForm.ramSize,
                batterySize: editForm.batterySize,
                batteryType: editForm.batteryType,
                displaySize: editForm.displaySize,
                releaseDate: editForm.releaseDate,
                frontCamera: editForm.frontCamera,
                backCamera: editForm.backCamera,
                os: editForm.os
            }
        })).then((result) => {
            if (!result.error) {
                setEditPhoneId(null);
                setEditForm({
                    id: '',
                    model: '',
                    brand: '',
                    description: '',
                    price: '',
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
                    os: ''
                });
            }
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: name === 'colors' || name === 'storage' || name === 'ramSize'
                ? value.split(',').map(item => item.trim()).filter(item => item)
                : value
        }));
    };

    const handleCancelEdit = () => {
        setEditPhoneId(null);
        setEditForm({
            id: '',
            model: '',
            brand: '',
            description: '',
            price: '',
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
            os: ''
        });
        dispatch(clearAdminProductError());
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
                <p className="text-gray-600 mt-2">Manage your product inventory</p>
            </div>

            {loading && <div className="text-center text-gray-600">Loading...</div>}
            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                    Error: {error}
                    <button
                        onClick={() => dispatch(clearAdminProductError())}
                        className="ml-4 text-sm underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Edit Form */}
            {editPhoneId && (
                <div className="bg-white rounded-lg shadow mb-6 p-6">
                    <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
                    <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ID</label>
                            <input
                                type="text"
                                name="id"
                                value={editForm.id}
                                onChange={handleEditChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Model</label>
                            <input
                                type="text"
                                name="model"
                                value={editForm.model}
                                onChange={handleEditChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                value={editForm.brand}
                                onChange={handleEditChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={editForm.description}
                                onChange={handleEditChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={editForm.price}
                                onChange={handleEditChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={editForm.stock}
                                onChange={handleEditChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Colors (comma-separated)</label>
                            <input
                                type="text"
                                name="colors"
                                value={editForm.colors.join(', ')}
                                onChange={handleEditChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Storage (comma-separated)</label>
                            <input
                                type="text"
                                name="storage"
                                value={editForm.storage.join(', ')}
                                onChange={handleEditChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">RAM (comma-separated)</label>
                            <input
                                type="text"
                                name="ramSize"
                                value={editForm.ramSize.join(', ')}
                                onChange={handleEditChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Battery Size</label>
                            <input
                                type="text"
                                name="batterySize"
                                value={editForm.batterySize}
                                onChange={handleEditChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Battery Type</label>
                            <input
                                type="text"
                                name="batteryType"
                                value={editForm.batteryType}
                                onChange={handleEditChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Display Size</label>
                            <input
                                type="text"
                                name="displaySize"
                                value={editForm.displaySize}
                                onChange={handleEditChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Release Date</label>
                            <input
                                type="date"
                                name="releaseDate"
                                value={editForm.releaseDate}
                                onChange={handleEditChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Front Camera</label>
                            <input
                                type="text"
                                name="frontCamera"
                                value={editForm.frontCamera}
                                onChange={handleEditChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Back Camera</label>
                            <input
                                type="text"
                                name="backCamera"
                                value={editForm.backCamera}
                                onChange={handleEditChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Operating System</label>
                            <input
                                type="text"
                                name="os"
                                value={editForm.os}
                                onChange={handleEditChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="sm:col-span-2 flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search and Actions */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="text-sm text-gray-600">
                        Showing {currentProducts.length} of {filteredProducts.length} products
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rating
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentProducts.map((phone) => (
                                <tr key={phone._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                src={phone.image || 'https://via.placeholder.com/48'}
                                                alt={phone.model}
                                                className="h-12 w-12 rounded-lg object-cover"
                                            />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {phone.model}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {phone.brand}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                            Smartphone
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            ${phone.price.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => toggleStock(phone._id, phone.stock)}
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${phone.stock > 0
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {phone.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {phone.rating.toFixed(1)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                to={`/admin/products/${phone._id}`}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleEdit(phone)}
                                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(phone._id)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex justify-center">
                            <div className="flex space-x-2">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-3 py-2 rounded-md text-sm ${currentPage === i + 1
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                            } border border-gray-300 transition-colors`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageProducts;
