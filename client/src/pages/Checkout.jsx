import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
    selectCartItems,
    selectCartTotal,
    selectShippingFee,
    clearCart
} from '../reducers/cart/cartSlice';
import { selectUser, selectIsAuthenticated, fetchCurrentUser } from '../reducers/auth/authSlice';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const shippingFee = useSelector(selectShippingFee);
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const stripe = useStripe();
    const elements = useElements();


    const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Confirmation
    const [formData, setFormData] = useState({
        email: user?.email || '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
        nameOnCard: ''
    });
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated && !user) {
            dispatch(fetchCurrentUser());
        }
    }, [isAuthenticated, user, dispatch]);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                email: user.email || prev.email
            }));
        }
    }, [user]);

    // Calculate Tax amount
    const tax = cartTotal * 0.13; // Assuming 13% tax rate

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to complete the payment');
        navigate('/login', { state: { from: '/checkout' } });
        return;
      }

      // Prepare order items and shipping address
      const orderItems = cartItems.map(item => ({
        phone: item.id,
        quantity: item.quantity,
        price: item.price,
        selectedColor: item.selectedColor,
        selectedStorage: item.selectedStorage,
        selectedRam: item.selectedRam
      }));
      const shippingAddress = {
        address: formData.address,
        city: formData.city,
        postalCode: formData.zipCode,
        country: formData.country
      };

      // Create payment intent
      const stripeResponse = await fetch('/api/orders/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress,
          paymentMethod: 'stripe',
          shippingPrice: shippingFee
        })
      });

      const paymentData = await stripeResponse.json();
      if (!stripeResponse.ok) {
        throw new Error(paymentData.msg || 'Failed to create payment intent');
      }

      // Confirm card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentData.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: formData.nameOnCard,
              email: formData.email,
              address: {
                line1: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.zipCode,
                country: formData.country
              }
            }
          }
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Create order after successful payment
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress,
          paymentMethod: 'stripe',
          shippingPrice: shippingFee,
          paymentResult: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString(),
            email_address: formData.email
          }
        })
      });

      const order = await response.json();
      if (!response.ok) {
        throw new Error(order.msg || 'Failed to create order');
      }

      setOrderDetails({
        orderId: order._id,
        items: cartItems,
        total: cartTotal + shippingFee + tax,
        customerInfo: formData,
        date: new Date().toISOString(),
        status: order.status
      });
      dispatch(clearCart());
      setStep(3);
    } catch (err) {
      setError(err.message);
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };


    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to checkout</h2>
                    <button
                        onClick={() => navigate('/login', { state: { from: '/checkout' } })}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0 && step !== 3) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-8">
                        {[1, 2, 3].map((stepNumber) => (
                            <div key={stepNumber} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                                >
                                    {step > stepNumber ? <CheckCircle className="h-6 w-6" /> : stepNumber}
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-900">
                                    {stepNumber === 1 ? 'Shipping' : stepNumber === 2 ? 'Payment' : 'Confirmation'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`grid gap-8 grid-cols-1 ${step === 3 ? 'lg:grid-cols-1' : 'lg:grid-cols-2'}`}>
                    {/* Main Content */}
                    <div className="space-y-6">
                        {step === 1 && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                ZIP Code
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Country
                                        </label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="EG">Egypt</option>
                                        </select>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/cart')}
                                            className="w-1/2 bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
                                        >
                                            <ArrowLeft className="h-5 w-5 mr-2" />
                                            Back to Cart
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextStep}
                                            className="w-1/2 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            Continue to Payment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center mb-6">
                                    <Lock className="h-5 w-5 text-green-600 mr-2" />
                                    <h2 className="text-xl font-bold text-gray-900">Secure Payment</h2>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handlePayment} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Name on Card
                                        </label>
                                        <input
                                            type="text"
                                            name="nameOnCard"
                                            value={formData.nameOnCard}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Card Details
                                        </label>
                                        <div className="p-3 border border-gray-300 rounded-md">
                                            <CardElement
                                                options={{
                                                    style: {
                                                        base: {
                                                            fontSize: '16px',
                                                            color: '#424770',
                                                            '::placeholder': {
                                                                color: '#aab7c4',
                                                            },
                                                        },
                                                        invalid: {
                                                            color: '#9e2146',
                                                        },
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={handlePreviousStep}
                                            className="w-1/2 bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
                                        >
                                            <ArrowLeft className="h-5 w-5 mr-2" />
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading || !stripe || !elements}
                                            className={`w-1/2 ${loading ? 'bg-green-400' : 'bg-green-600'} text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium`}
                                        >
                                            {loading ? 'Processing...' : 'Complete Order'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {step === 3 && orderDetails && (
                            <div className="bg-white rounded-lg shadow p-6 text-center flex flex-col items-center">
                                <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                                <p className="text-gray-600 mb-6 max-w-md">
                                    Thank you for your purchase. Your order #{orderDetails.orderId} has been placed and is pending admin confirmation.
                                </p>

                                <div className="bg-gray-50 rounded-lg p-4 mb-6 w-full max-w-md">
                                    <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>Order ID: {orderDetails.orderId}</p>
                                        <p>Total: ${orderDetails.total.toFixed(2)}</p>
                                        <p>Items: {orderDetails.items.length}</p>
                                        <p>Status: {orderDetails.status}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-6 max-w-md">
                                    A confirmation email has been sent to {formData.email}
                                </p>
                                <div className="space-y-3 w-full max-w-md">
                                    <button
                                        onClick={() => navigate('/profile/orders')}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        View Orders
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    {step !== 3 && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.compositeId} className="flex items-center space-x-3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded-md"
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            {item.selectedColor && <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>}
                                            {item.selectedStorage && <p className="text-xs text-gray-500">Storage: {item.selectedStorage}</p>}
                                            {item.selectedRam && <p className="text-xs text-gray-500">RAM: {item.selectedRam}</p>}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 border-t border-gray-200 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">${shippingFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">{tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>${(cartTotal + shippingFee).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function CheckoutWrapper() {
    return (
        <Elements stripe={stripePromise}>
            <Checkout />
        </Elements>
    );
}