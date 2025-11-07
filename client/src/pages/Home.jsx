import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, Search, Menu, X } from 'lucide-react';

import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Cart from '../pages/Cart';
import TrendingCarousel from '../components/TrendingCarousel';
import HeroSection from '../components/HeroSection';

import { fetchPhones } from '../reducers/phones/phonesSlice';
import { getTrendingProducts } from '../services/phoneServices';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sidebarRef = useRef(null);

    // Redux state
    const { items: products, status, error } = useSelector((state) => state.phones);

    // Local UI state
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        brand: '',
        color: '',
        priceRange: [0, 2000],
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    const productsPerPage = 8;

    // Fetch data from Redux store
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPhones());
        }
    }, [dispatch, status]);

    // Apply filters when products/search/filter changes
    useEffect(() => {
        if (products.length) {
            applyFilters();
        }
    }, [filters, searchTerm, products]);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setShowFilters(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const applyFilters = () => {
        const filtered = products.filter((product) => {
            const matchesBrand = !filters.brand || product.brand === filters.brand;
            const matchesColor = !filters.color || product.colors.includes(filters.color);
            const matchesPrice =
                product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
            const matchesSearch =
                !searchTerm ||
                product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesBrand && matchesColor && matchesPrice && matchesSearch;
        });

        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    const handleShopNow = () => {
        const section = document.getElementById('products-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            // Ensure the section is in view by checking scroll position (optional robustness)
            setTimeout(() => {
                if (window.scrollY + window.innerHeight < section.offsetTop + section.offsetHeight) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500); // Small delay to handle any rendering lag
        }
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const trendingProducts = getTrendingProducts(products);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Cart />
            <HeroSection onShopNow={handleShopNow} />
            {/* Search Bar */}
            <section className="bg-white py-6 sm:py-8 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 transform 
                        -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for phones, brands, or features..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border 
                            border-gray-300 rounded-xl focus:outline-none focus:ring-2 
                            focus:ring-blue-500 text-sm sm:text-lg"
                        />
                        {searchTerm && (
                            <p className="mt-2 text-xs sm:text-sm text-gray-600">
                                {filteredProducts.length} results found for "{searchTerm}"
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Trending Section */}
            {!searchTerm && (
                <section className="pt-12 pb-0 sm:pt-16 sm:pb-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 
                        sm:mb-12 text-gray-900">Trending Products</h2>
                        <TrendingCarousel products={trendingProducts} />
                    </div>
                </section>
            )}

            {/* Products & Filters */}
            <section id="products-section" className="py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-6 
                sm:gap-8">
                    {/* Sidebar Toggle Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md 
                            flex items-center justify-center space-x-2 hover:bg-blue-700 
                            transition-colors"
                        >
                            {showFilters ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                            <span>{showFilters ? 'Close Filters' : 'Filters'}</span>
                        </button>
                    </div>

                    {/* Sidebar */}
                    <div
                        ref={sidebarRef}
                        className={`fixed inset-y-0 left-0 z-50 w-3/4 sm:w-1/2 max-w-xs bg-white 
                            shadow-lg transform transition-transform duration-300 ease-in-out 
                            lg:static lg:w-1/4 lg:translate-x-0 lg:shadow-none 
                            ${showFilters ? 'translate-x-0' : '-translate-x-full'}`}
                    >
                        <div className="p-6">
                            <FilterSidebar products={products} 
                            filters={filters} setFilters={setFilters} 
                            onApply={() => setShowFilters(false)} />
                        </div>
                    </div>

                    {/* Overlay for mobile sidebar */}
                    {showFilters && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                            onClick={() => setShowFilters(false)}
                        ></div>
                    )}

                    {/* Product Grid */}
                    <div className="lg:w-3/4">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                All Products ({filteredProducts.length})
                            </h2>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-base sm:text-lg">No products match your filters.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                                xl:grid-cols-4 gap-4 sm:gap-6">
                                    {currentProducts.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center mt-8 sm:mt-12">
                                        <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <button
                                                    key={i + 1}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md 
                                                        text-sm sm:text-base 
                                                        ${currentPage === i + 1
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                                        } border border-gray-300 transition-colors`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;