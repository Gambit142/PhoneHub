import React from 'react';

const FilterSidebar = ({ products, filters, setFilters }) => {
    // Get unique brands and colors from products
    const brands = [...new Set(products.map(p => p.brand))];
    const colors = [...new Set(products.flatMap(p => p.colors))];

    const handleBrandChange = (brand) => {
        setFilters(prev => ({
            ...prev,
            brand: prev.brand === brand ? '' : brand
        }));
    };

    const handleColorChange = (color) => {
        setFilters(prev => ({
            ...prev,
            color: prev.color === color ? '' : color
        }));
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            priceRange: name === 'minPrice'
                ? [parseInt(value) || 0, prev.priceRange[1]]
                : [prev.priceRange[0], parseInt(value) || 2000]
        }));
    };

    const clearFilters = () => {
        setFilters({
            brand: '',
            color: '',
            priceRange: [0, 2000]
        });
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                    Clear All
                </button>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Brand</h4>
                <div className="space-y-2">
                    {brands.map(brand => (
                        <label key={brand} className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="brand"
                                checked={filters.brand === brand}
                                onChange={() => handleBrandChange(brand)}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                {brand}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Color Filter */}
            <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Color</h4>
                <div className="space-y-2">
                    {colors.map(color => (
                        <label key={color} className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="color"
                                checked={filters.color === color}
                                onChange={() => handleColorChange(color)}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{color}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Min Price</label>
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.priceRange[0]}
                            onChange={handlePriceChange}
                            min="0"
                            max="2000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm 
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Max Price</label>
                        <input
                            type="number"
                            name="maxPrice"
                            value={filters.priceRange[1]}
                            onChange={handlePriceChange}
                            min="0"
                            max="2000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm 
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="text-xs text-gray-500">
                        ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;