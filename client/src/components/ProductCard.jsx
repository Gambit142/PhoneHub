import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { calculatePrice } from '../utils/priceUtils';

const ProductCard = ({ product }) => {
    // Get discount information from store
    const { discountPercentage } = product;

    // Calculate discounted price using calculatePrice
    const discountedPrice = calculatePrice(
        product.price,
        product.discountPercentage,
        product.storage ? product.storage[0] : null,
        product.storage ? product.storage[0] : null,
        product.ramSize ? product.ramSize[0] : null,
        product.ramSize ? product.ramSize[0] : null
    );

    // Direct navigation to product details
    const navigate = useNavigate();
    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent Link navigation when clicking Add to Cart
        // Navigate to product details page with discountPercentage
        navigate(`/product/${product._id}`, { state: { discountPercentage } });
    };

    // Map database fields
    const mappedProduct = {
        ...product,
        id: product._id,
        name: product.model,
        inStock: product.stock > 0,
        rating: product.rating || 0,
        discountPercentage,
        discountedPrice,
    };

    return (
        <Link
            to={`/product/${mappedProduct.id}`}
            state={{ discountPercentage }}
            className="group block h-full"
        >
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full 
            flex flex-col border border-gray-100 overflow-hidden hover:border-blue-100">
                {/* Enhanced Image Container */}
                <div className="relative pt-[100%] bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
                        <img
                            src={mappedProduct.image}
                            alt={mappedProduct.name}
                            className="max-h-full max-w-full object-contain transition-all duration-500 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x300?text=Phone+Image';
                            }}
                        />
                    </div>

                    {/* Badges */}
                    {mappedProduct.discountPercentage && (
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 
                        bg-red-500 text-white text-xs font-bold px-2 py-1 
                        rounded-md shadow-sm">
                            {mappedProduct.discountPercentage}% OFF
                        </div>
                    )}

                    <button
                        className="absolute top-2 sm:top-3 right-2 sm:right-3 p-2 
                        bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white 
                        transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Add to wishlist"
                    >
                        <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                    </button>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 flex-grow flex flex-col">
                    <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                            {mappedProduct.brand}
                        </span>
                        <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-medium text-gray-700 ml-1">
                                {mappedProduct.rating}
                            </span>
                        </div>
                    </div>

                    <h3 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors
                     line-clamp-2 leading-tight text-sm sm:text-base">
                        {mappedProduct.name}
                    </h3>

                    <div className="mt-auto">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className="flex items-baseline space-x-2">
                                <span className="text-base sm:text-lg font-bold text-gray-900">
                                    ${parseFloat(discountedPrice).toFixed(2)}
                                </span>
                                {mappedProduct.price && (
                                    <span className="text-xs sm:text-sm text-gray-500 line-through">
                                        ${parseFloat(mappedProduct.price).toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${mappedProduct.inStock
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {mappedProduct.inStock ? 'In Stock' : 'Sold Out'}
                            </span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                            className={`w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium flex 
                                items-center justify-center space-x-2 transition-all text-sm sm:text-base 
                                ${product.stock > 0
                                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <ShoppingCart className="h-4 sm:h-5 w-4 sm:w-5" />
                            <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;