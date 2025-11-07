import axios from 'axios';

// Cache variables
let cachedProducts = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export const fetchProducts = async () => {
    const now = Date.now();

    // Return cached products if they exist and are fresh
    if (cachedProducts && lastFetchTime && (now - lastFetchTime) < CACHE_DURATION) {
        return cachedProducts;
    }

    try {
        const response = await axios.get('/api/phones');
        cachedProducts = response.data;
        lastFetchTime = now;
        return cachedProducts;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getTrendingProducts = (products) => {
    // Group by brand and get latest 5 from each brand
    const brandsMap = {};

    products.forEach(product => {
        if (!brandsMap[product.brand]) {
            brandsMap[product.brand] = [];
        }
        brandsMap[product.brand].push(product);
    });

    // Sort each brand's products by release date (newest first)
    Object.keys(brandsMap).forEach(brand => {
        brandsMap[brand].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    });

    // Take first 5 from each brand and flatten
    const trending = Object.values(brandsMap)
        .flatMap(products => products.slice(0, 5))
        .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

    return trending;
};