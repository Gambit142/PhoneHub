import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, fetchCurrentUser, selectAuthLoading, selectAuthError, selectUser } from '../reducers/auth/authSlice';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);
    const user = useSelector(selectUser);

    const { email, password } = formData;

    const from = location.state?.from || '/';

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const loginResult = await dispatch(loginUser({ email, password })).unwrap();
            await dispatch(fetchCurrentUser()).unwrap(); // Fetch user data after login

            // Check user role and redirect accordingly
            if (loginResult.user.role === 'admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            // Error is handled by Redux and displayed via `error` state
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Form Section */}
            <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-20 flex flex-col justify-center">
                <div className="max-w-md w-full mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Log in</h1>

                    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
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
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 
                                    rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 
                                    rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Password"
                                    value={password}
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent 
                            rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>

                    <div className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>

            {/* App Info Section */}
            <div className="w-full md:w-1/2 bg-gradient-to-t from-blue-500 to-blue-800 p-8 md:p-12 lg:p-20 
            flex flex-col justify-center order-first md:order-last">
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

export default Login;