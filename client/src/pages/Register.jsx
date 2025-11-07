import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, selectAuthLoading, selectAuthError } from '../reducers/auth/authSlice';
import { Lock, Mail, User, Check, X } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [passwordValidations, setPasswordValidations] = useState({
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    const { name, email, password } = formData;

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'password') {
            setPasswordValidations({
                hasMinLength: value.length >= 8,
                hasUpperCase: /[A-Z]/.test(value),
                hasLowerCase: /[a-z]/.test(value),
                hasNumber: /[0-9]/.test(value),
                hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value)
            });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isPasswordValid) return;

        dispatch(registerUser({ name, email, password }))
            .unwrap()
            .then(() => {
                navigate('/login');
            });
    };

    const isPasswordValid = Object.values(passwordValidations).every(Boolean);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Form Section */}
            <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-20 flex flex-col justify-center">
                <div className="max-w-md w-full mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign up</h1>

                    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username (required)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Username"
                                    value={name}
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email (required)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password (required)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md 
                                    shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Password"
                                    value={password}
                                    onChange={onChange}
                                />
                            </div>

                            <div className="mt-2 space-y-1">
                                <div className="flex items-center">
                                    {passwordValidations.hasMinLength ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <X className="h-4 w-4 text-red-500" />
                                    )}
                                    <span className="ml-2 text-xs text-gray-600">At least 8 characters</span>
                                </div>
                                <div className="flex items-center">
                                    {passwordValidations.hasUpperCase ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <X className="h-4 w-4 text-red-500" />
                                    )}
                                    <span className="ml-2 text-xs text-gray-600">At least one uppercase letter</span>
                                </div>
                                <div className="flex items-center">
                                    {passwordValidations.hasLowerCase ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <X className="h-4 w-4 text-red-500" />
                                    )}
                                    <span className="ml-2 text-xs text-gray-600">At least one lowercase letter</span>
                                </div>
                                <div className="flex items-center">
                                    {passwordValidations.hasNumber ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <X className="h-4 w-4 text-red-500" />
                                    )}
                                    <span className="ml-2 text-xs text-gray-600">At least one number</span>
                                </div>
                                <div className="flex items-center">
                                    {passwordValidations.hasSpecialChar ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <X className="h-4 w-4 text-red-500" />
                                    )}
                                    <span className="ml-2 text-xs text-gray-600">At least one special character</span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <div className="text-xs text-gray-500">
                            Username and email must be unique
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isPasswordValid}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent 
                                rounded-md shadow-sm text-sm font-medium text-white ${isPasswordValid ? 
                                    'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>

            {/* App Info Section */}
            <div className="w-full md:w-1/2 bg-gradient-to-t from-blue-500 to-blue-800 p-8 md:p-12 lg:p-20 flex 
            flex-col justify-center order-first md:order-last">
                <div className="max-w-md mx-auto text-white">
                    <h2 className="text-2xl font-bold mb-6">Find and Connect to Thousands of Phones</h2>

                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 text-green-300 mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>Discover the latest smartphones</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 text-green-300 mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>Compare specs side by side</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 text-green-300 mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>Get the best deals available</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 text-green-300 mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span>Manage your phone collection</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Register;