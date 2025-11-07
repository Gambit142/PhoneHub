import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAdminPhones, selectAdminPhones, selectAdminProductLoading, selectAdminProductError } from '../../reducers/admin/adminProductSlice';
import { Star, ChevronRight, ArrowLeft } from 'lucide-react';

const ProductDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { _id } = useParams();
    const phones = useSelector(selectAdminPhones);
    const loading = useSelector(selectAdminProductLoading);
    const error = useSelector(selectAdminProductError);
    const phone = phones.find(p => p._id === _id);

    useEffect(() => {
        if (!phones.length) {
            dispatch(fetchAdminPhones());
        }
    }, [dispatch, phones]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-red-500 text-lg">{error || 'Failed to load product'}</div>
            </div>
        );
    }

    if (!phone) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500 text-lg">Product not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex mb-6" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <button
                                onClick={() => navigate('/admin/products')}
                                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Products
                            </button>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                <span className="ml-1 text-sm font-medium text-gray-700 md:ml-2">
                                    {phone.brand}
                                </span>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                                    {phone.model}
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8 h-[30rem] self-center">
                            <img
                                src={phone.image || 'https://via.placeholder.com/300'}
                                alt={phone.model}
                                className="h-full w-auto object-contain"
                                loading="lazy"
                            />
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{phone.model}</h1>
                                <p className="text-lg text-gray-600 mt-2">{phone.brand}</p>
                                <div className="flex items-center mt-3">
                                    <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                        <span className="text-sm font-medium text-gray-700 ml-1">
                                            {phone.rating.toFixed(1)}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500 ml-3">
                                        {phone.stock} in stock
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className="text-3xl font-bold text-gray-900">${phone.price.toFixed(2)}</span>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-900">Colors</h3>
                                <div className="flex flex-wrap gap-2">
                                    {phone.colors?.map(color => (
                                        <span
                                            key={color}
                                            className="px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700"
                                        >
                                            {color}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-900">Storage</h3>
                                <div className="flex flex-wrap gap-2">
                                    {phone.storage?.map(storage => (
                                        <span
                                            key={storage}
                                            className="px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700"
                                        >
                                            {storage}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-900">RAM</h3>
                                <div className="flex flex-wrap gap-2">
                                    {phone.ramSize?.map(ram => (
                                        <span
                                            key={ram}
                                            className="px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700"
                                        >
                                            {ram}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-900">Description</h3>
                                <p className="text-gray-600">{phone.description}</p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-900">Specifications</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                        <p className="font-medium">Display</p>
                                        <p>{phone.displaySize}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Battery</p>
                                        <p>{phone.batterySize} ({phone.batteryType})</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">RAM</p>
                                        <p>{phone.ramSize?.join(', ')}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Camera</p>
                                        <p>{phone.backCamera} (Rear), {phone.frontCamera} (Front)</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">OS</p>
                                        <p>{phone.os}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Release Date</p>
                                        <p>{phone.releaseDate && new Date(phone.releaseDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
