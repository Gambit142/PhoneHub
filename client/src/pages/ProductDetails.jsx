import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPhoneDetails, clearPhoneDetails } from '../reducers/phones/phoneDetailsSlice';
import { Star, ChevronRight, ShoppingCart, ArrowLeft } from 'lucide-react';
import { addToCart, updateCartItem, selectCartItemByCompositeId } from '../reducers/cart/cartSlice';
import { calculatePrice, calculateOriginalPrice } from '../utils/priceUtils';
import Cart from '../pages/Cart';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { item: product, status, error } = useSelector(state => state.phoneDetails);
    const isEditing = location.state?.isEditing;
    const cartItem = useSelector(selectCartItemByCompositeId(isEditing ? location.state?.cartItemId : null));
    const discountPercentage = location.state?.discountPercentage || cartItem?.discountPercentage || 0;

    const [selectedColor, setSelectedColor] = useState('');
    const [selectedStorage, setSelectedStorage] = useState('');
    const [selectedRam, setSelectedRam] = useState('');

    useEffect(() => {
        dispatch(fetchPhoneDetails(id));
        return () => {
            dispatch(clearPhoneDetails());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (product) {
            const initialColor = cartItem?.selectedColor || product.colors?.[0] || '';
            const initialStorage = cartItem?.selectedStorage || product.storage?.[0] || '';
            const initialRam = cartItem?.selectedRam || product.ramSize?.[0] || '';
            
            setSelectedColor(initialColor);
            setSelectedStorage(initialStorage);
            setSelectedRam(initialRam);
        }
    }, [product, cartItem]);

    const currentPrice = useMemo(() => {
        if (!product) return 0;
        return calculatePrice(
            product.price,
            discountPercentage,
            product.storage,
            selectedStorage,
            product.ramSize,
            selectedRam
        );
    }, [product, selectedStorage, selectedRam, discountPercentage]);

    const originalPrice = useMemo(() => {
        if (!product) return 0;
        return calculateOriginalPrice(
            product.price,
            product.storage,
            selectedStorage,
            product.ramSize,
            selectedRam
        );
    }, [product, selectedStorage, selectedRam]);

    const generateCompositeId = () => {
        return `${product?._id || id}_${selectedColor}_${selectedStorage}_${selectedRam}`;
    };

    const handleAddToCart = () => {
        if (product) {
            const compositeId = generateCompositeId();
            if (isEditing && cartItem) {
                dispatch(updateCartItem({
                    compositeId: location.state?.cartItemId,
                    newCompositeId: compositeId,
                    updates: {
                        selectedColor,
                        selectedStorage,
                        selectedRam,
                        price: parseFloat(currentPrice)
                    }
                }));
            } else {
                dispatch(addToCart({
                    product: { ...product, discountPercentage },
                    selectedColor,
                    selectedStorage,
                    selectedRam,
                    compositeId
                }));
            }
            navigate('/');
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-red-500 text-lg">{error || 'Failed to load product'}</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500 text-lg">Product not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Cart />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex mb-6" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <button
                                onClick={() => navigate('/')}
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
                                    {product.brand}
                                </span>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                                    {product.model}
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8 h-[30rem] self-center">
                            <img
                                src={product.image}
                                alt={product.model}
                                className="h-full w-auto object-contain"
                                loading="lazy"
                            />
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{product.model}</h1>
                                <p className="text-lg text-gray-600 mt-2">{product.brand}</p>
                                <div className="flex items-center mt-3">
                                    <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                        <span className="text-sm font-medium text-gray-700 ml-1">
                                            {product.rating || '4.5'}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500 ml-3">
                                        {product.stock} in stock
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className="text-3xl font-bold text-gray-900">${parseFloat(currentPrice).toFixed(2)}</span>
                                {parseFloat(originalPrice) !== parseFloat(currentPrice) && (
                                    <>
                                        <span className="text-xl text-gray-500 line-through">${parseFloat(originalPrice).toFixed(2)}</span>
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-medium">
                                            {discountPercentage}% OFF
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors?.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-4 py-2 rounded-md border ${selectedColor === color
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                                } transition-colors`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-900">Storage</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.storage?.map(storage => (
                                        <button
                                            key={storage}
                                            onClick={() => setSelectedStorage(storage)}
                                            className={`px-4 py-2 rounded-md border ${selectedStorage === storage
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                                } transition-colors`}
                                        >
                                            {storage}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-900">RAM</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.ramSize?.map(ram => (
                                        <button
                                            key={ram}
                                            onClick={() => setSelectedRam(ram)}
                                            className={`px-4 py-2 rounded-md border ${selectedRam === ram
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                                } transition-colors`}
                                        >
                                            {ram}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-900">Description</h3>
                                <p className="text-gray-600">{product.description}</p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-900">Specifications</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                        <p className="font-medium">Display</p>
                                        <p>{product.displaySize}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Battery</p>
                                        <p>{product.batterySize} ({product.batteryType})</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">RAM</p>
                                        <p>{product.ramSize?.join(', ')}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Camera</p>
                                        <p>{product.backCamera} (Rear), {product.frontCamera} (Front)</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">OS</p>
                                        <p>{product.os}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Release Date</p>
                                        <p>{product.releaseDate && new Date(product.releaseDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${product.stock > 0
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span>{isEditing ? 'Update Cart Item' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;