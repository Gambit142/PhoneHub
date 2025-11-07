import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Edit2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    updateQuantity,
    removeFromCart,
    clearCart,
    selectCartItems,
    selectCartTotal,
    selectCartItemsCount,
    selectShippingFee,
    selectIsCartOpen,
    setIsOpen
} from '../reducers/cart/cartSlice';
import { selectIsAuthenticated } from '../reducers/auth/authSlice';
import { calculatePrice, calculateOriginalPrice } from '../utils/priceUtils';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const cartItemsCount = useSelector(selectCartItemsCount);
    const shippingFee = useSelector(selectShippingFee);
    const isOpen = useSelector(selectIsCartOpen);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    if (!isOpen) return null;

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/checkout' } });
        } else if (cartItems.length === 0) {
            alert('Your cart is empty');
        } else {
            dispatch(setIsOpen(false));
            navigate('/checkout');
        }
    };

    const handleEdit = (item) => {
        dispatch(setIsOpen(false));
        navigate(`/product/${item.id.split('_')[0]}`, { state: { isEditing: true, cartItemId: item.compositeId } });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => dispatch(setIsOpen(false))} />

            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Shopping Cart ({cartItemsCount})
                        </h2>
                        <button
                            onClick={() => dispatch(setIsOpen(false))}
                            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                                <p className="text-gray-500">Add some products to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => {
                                    const calculatedPrice = calculatePrice(
                                        item.originalPrice,
                                        item.discountPercentage,
                                        item.productDetails.storage,
                                        item.selectedStorage,
                                        item.productDetails.ramSize,
                                        item.selectedRam
                                    );
                                    const originalPrice = calculateOriginalPrice(
                                        item.originalPrice,
                                        item.productDetails.storage,
                                        item.selectedStorage,
                                        item.productDetails.ramSize,
                                        item.selectedRam
                                    );
                                    const showDiscount = item.discountPercentage && parseFloat(originalPrice) !== parseFloat(calculatedPrice);

                                    return (
                                        <div key={item.compositeId} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                                    {item.name}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    ${parseFloat(calculatedPrice).toFixed(2)}
                                                    {showDiscount && (
                                                        <span className="text-sm text-gray-500 line-through ml-2">
                                                            ${parseFloat(originalPrice).toFixed(2)}
                                                        </span>
                                                    )}
                                                </p>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                                                    {item.selectedStorage && <p>Storage: {item.selectedStorage}</p>}
                                                    {item.selectedRam && <p>RAM: {item.selectedRam}</p>}
                                                </div>

                                                <div className="flex items-center mt-2 space-x-2">
                                                    <button
                                                        onClick={() => dispatch(updateQuantity({ compositeId: item.compositeId, quantity: item.quantity - 1 }))}
                                                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>

                                                    <span className="text-sm font-medium min-w-[2rem] text-center">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() => dispatch(updateQuantity({ compositeId: item.compositeId, quantity: item.quantity + 1 }))}
                                                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>

                                                    <button
                                                        onClick={() => dispatch(removeFromCart(item.compositeId))}
                                                        className="p-1 hover:bg-red-100 rounded transition-colors"
                                                    >
                                                        <Trash2 className="h-3 w-3 text-red-500" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-1 hover:bg-blue-100 rounded transition-colors"
                                                    >
                                                        <Edit2 className="h-3 w-3 text-blue-500" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">
                                                    ${(parseFloat(calculatedPrice) * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="border-t border-gray-200 p-4 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">${shippingFee.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2">
                                    <div className="flex justify-between text-base font-medium">
                                        <span>Total</span>
                                        <span>${(cartTotal + shippingFee).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Checkout
                                </button>
                                <button
                                    onClick={() => dispatch(clearCart())}
                                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;