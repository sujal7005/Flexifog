import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  const BASE_URL = 'http://localhost:4000';

  // Safe string conversion helper
  const safeString = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value.toString();
    return '';
  };

  // Get all unique categories from products for filter
  const getAllCategories = () => {
    const categories = new Set();
    products.forEach(product => {
      if (product.category && typeof product.category === 'string') {
        categories.add(product.category);
      }
      if (product.type && typeof product.type === 'string') {
        categories.add(product.type);
      }
    });
    return Array.from(categories);
  };

  // Get all unique brands from products for filter
  const getAllBrands = () => {
    const brands = new Set();
    products.forEach(product => {
      if (product.brand && typeof product.brand === 'string') {
        brands.add(product.brand);
      }
    });
    return Array.from(brands);
  };

  // Generate URL for product
  const generateUrl = (product) => {
    let type = product.type || product.category || "";
    if (typeof type !== "string") {
      type = "product";
    }
  
    let basePath = "products";
    const lowerCaseType = type.toLowerCase();
    const lowerCaseName = (product.name || "").toLowerCase();
  
    if (lowerCaseType.includes("mobile") || lowerCaseType.includes("phone") || lowerCaseName.includes("phone")) {
      basePath = "mobiles";
    } else if (lowerCaseType.includes("laptop") || lowerCaseName.includes("laptop") || lowerCaseName.includes("macbook")) {
      basePath = "laptops";
    } else if (lowerCaseType.includes("tablet") || lowerCaseName.includes("tablet") || lowerCaseName.includes("ipad")) {
      basePath = "tablets";
    } else if (lowerCaseType.includes("tv") || lowerCaseType.includes("television") || lowerCaseName.includes("tv")) {
      basePath = "tv";
    } else if (lowerCaseType.includes("display") || lowerCaseType.includes("monitor") || lowerCaseName.includes("monitor")) {
      basePath = "displays";
    } else if (lowerCaseType.includes("audio") || lowerCaseType.includes("headphone") || lowerCaseType.includes("speaker")) {
      basePath = "audio";
    } else if (lowerCaseType.includes("camera") || lowerCaseName.includes("camera")) {
      basePath = "cameras";
    } else if (lowerCaseType.includes("component") || lowerCaseType.includes("cpu") || lowerCaseType.includes("gpu")) {
      basePath = "components";
    } else if (lowerCaseType.includes("accessory") || lowerCaseName.includes("accessory")) {
      basePath = "accessories";
    } else if (lowerCaseType.includes("kitchen") || lowerCaseName.includes("microwave") || lowerCaseName.includes("oven")) {
      basePath = "kitchen";
    } else if (lowerCaseType.includes("laundry") || lowerCaseName.includes("washer") || lowerCaseName.includes("washing")) {
      basePath = "laundry";
    } else if (lowerCaseType.includes("ac") || lowerCaseName.includes("air conditioner")) {
      basePath = "ac";
    } else if (lowerCaseType.includes("refrigerator") || lowerCaseName.includes("fridge")) {
      basePath = "refrigerators";
    } else if (lowerCaseType.includes("prebuilt") || lowerCaseType.includes("pre-built")) {
      basePath = "prebuilt";
    } else if (lowerCaseType.includes("mini pc")) {
      basePath = "mini-pcs";
    } else if (lowerCaseType.includes("office pc")) {
      basePath = "office-pcs";
    }
  
    return `/${basePath}/${product._id}`;
  };

  // Fetch products from all endpoints
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Search Query:", query);

        // Define all product endpoints
        const endpoints = [
          { name: 'mobiles', url: `${BASE_URL}/api/mobiles` },
          { name: 'laptops', url: `${BASE_URL}/api/laptops` },
          { name: 'tvs', url: `${BASE_URL}/api/tv` },
          { name: 'displays', url: `${BASE_URL}/api/displays` },
          { name: 'audio', url: `${BASE_URL}/api/audio` },
          { name: 'cameras', url: `${BASE_URL}/api/cameras` },
          { name: 'components', url: `${BASE_URL}/api/components` },
          { name: 'accessories', url: `${BASE_URL}/api/accessories` },
          { name: 'kitchen', url: `${BASE_URL}/api/kitchen` },
          { name: 'laundry', url: `${BASE_URL}/api/laundry` },
          { name: 'wearables', url: `${BASE_URL}/api/wearables` },
          { name: 'prebuilt', url: `${BASE_URL}/api/admin/products?type=prebuilt` },
          { name: 'mini-pcs', url: `${BASE_URL}/api/admin/products?type=mini-pc` },
          { name: 'office-pcs', url: `${BASE_URL}/api/admin/products?type=office-pc` },
          { name: 'refurbished', url: `${BASE_URL}/api/admin/products?type=refurbished` }
        ];

        // Fetch from all endpoints in parallel
        const responses = await Promise.all(
          endpoints.map(endpoint => 
            fetch(endpoint.url)
              .then(res => res.json())
              .catch(err => {
                console.log(`Error fetching ${endpoint.name}:`, err);
                return { products: [] };
              })
          )
        );

        // Combine all products
        let allProducts = [];

        responses.forEach((data, index) => {
          const endpoint = endpoints[index];
          
          // Handle different response structures
          if (data && data.success && Array.isArray(data.products)) {
            // Standard API response format
            allProducts = [...allProducts, ...data.products];
          } else if (Array.isArray(data)) {
            // Direct array response
            allProducts = [...allProducts, ...data];
          } else if (data && data.data && Array.isArray(data.data)) {
            // Nested data property
            allProducts = [...allProducts, ...data.data];
          } else if (endpoint.name.includes('prebuilt') || endpoint.name.includes('mini') || endpoint.name.includes('office')) {
            // Handle admin products response
            if (data && data.prebuildPC) allProducts = [...allProducts, ...data.prebuildPC];
            if (data && data.officePC) allProducts = [...allProducts, ...data.officePC];
            if (data && data.refurbishedProducts) allProducts = [...allProducts, ...data.refurbishedProducts];
            if (data && data.miniPCs) allProducts = [...allProducts, ...data.miniPCs];
          }
        });

        // Remove duplicates based on _id
        const uniqueProducts = [];
        const seenIds = new Set();
        
        allProducts.forEach(product => {
          if (product && product._id && !seenIds.has(product._id)) {
            seenIds.add(product._id);
            uniqueProducts.push(product);
          }
        });

        // Filter products by search query with safe string handling
        const searchLower = query.toLowerCase();
        let filteredProducts = uniqueProducts.filter(product => {
          if (!product) return false;
          
          // Safely check each field
          const name = product.name ? safeString(product.name).toLowerCase() : '';
          const brand = product.brand ? safeString(product.brand).toLowerCase() : '';
          const category = product.category ? safeString(product.category).toLowerCase() : '';
          const type = product.type ? safeString(product.type).toLowerCase() : '';
          const description = product.description ? safeString(product.description).toLowerCase() : '';
          
          // Check specs safely
          let specsString = '';
          if (product.specs && typeof product.specs === 'object') {
            try {
              specsString = JSON.stringify(product.specs).toLowerCase();
            } catch (e) {
              specsString = '';
            }
          }

          return (
            name.includes(searchLower) ||
            brand.includes(searchLower) ||
            category.includes(searchLower) ||
            type.includes(searchLower) ||
            description.includes(searchLower) ||
            specsString.includes(searchLower)
          );
        });

        // Apply category filter with safe handling
        if (category) {
          filteredProducts = filteredProducts.filter(product => {
            const productCategory = product.category ? safeString(product.category) : '';
            const productType = product.type ? safeString(product.type) : '';
            return productCategory === category || productType === category;
          });
        }

        // Apply brand filter with safe handling
        if (brand) {
          filteredProducts = filteredProducts.filter(product => {
            const productBrand = product.brand ? safeString(product.brand) : '';
            return productBrand === brand;
          });
        }

        // Apply price range filter
        if (priceRange) {
          const [min, max] = priceRange.split('-').map(Number);
          filteredProducts = filteredProducts.filter(product => {
            const price = Number(product.price || product.finalPrice || 0);
            if (max) {
              return price >= min && price <= max;
            } else {
              return price >= min;
            }
          });
        }

        setProducts(filteredProducts);
        setTotalResults(filteredProducts.length);

        if (filteredProducts.length === 0) {
          setError("No products found matching your search.");
        }

      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchAllProducts();
    } else {
      setProducts([]);
      setTotalResults(0);
      setLoading(false);
    }
  }, [query, category, brand, priceRange]);

  // Get image URL safely
  const getImageUrl = (product) => {
    if (!product || !product.image) return '/placeholder.jpg';
    
    try {
      if (Array.isArray(product.image) && product.image.length > 0) {
        const imagePath = product.image[0].split(/[\\/]/).pop();
        return `${BASE_URL}/uploads/${imagePath}`;
      } else if (typeof product.image === 'string') {
        const imagePath = product.image.split(/[\\/]/).pop();
        return `${BASE_URL}/uploads/${imagePath}`;
      }
    } catch (e) {
      console.error('Error parsing image URL:', e);
    }
    
    return '/placeholder.jpg';
  };

  // Get price safely
  const getPrice = (product) => {
    return Number(product.price || product.finalPrice || 0);
  };

  // Get original price safely
  const getOriginalPrice = (product) => {
    return Number(product.originalPrice || (getPrice(product) * 1.2) || 0);
  };

  // Check stock safely
  const isInStock = (product) => {
    return product.inStock === true || Number(product.stock) > 0;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-4 md:px-8">
      {/* Header */}
      <div className="container mx-auto mb-8">
        <h1 className="text-3xl font-bold text-blue-400">
          Search Results
        </h1>
        <p className="text-gray-400 mt-2">
          {loading ? 'Searching...' : `Found ${totalResults} products for "${query}"`}
        </p>
      </div>

      {/* Filters */}
      <div className="container mx-auto mb-8">
        <div className="flex flex-wrap gap-4 justify-center bg-gray-800 p-4 rounded-lg">
          <select 
            className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {getAllCategories().map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={brand} 
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="">All Brands</option>
            {getAllBrands().map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select 
            className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={priceRange} 
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">All Prices</option>
            <option value="0-10000">Under ₹10,000</option>
            <option value="10000-25000">₹10,000 - ₹25,000</option>
            <option value="25000-50000">₹25,000 - ₹50,000</option>
            <option value="50000-100000">₹50,000 - ₹1,00,000</option>
            <option value="100000-999999">Above ₹1,00,000</option>
          </select>

          {(category || brand || priceRange) && (
            <button
              onClick={() => {
                setCategory('');
                setBrand('');
                setPriceRange('');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="container mx-auto text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Searching products...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="container mx-auto text-center py-12">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results Grid */}
      {!loading && !error && (
        <div className="container mx-auto">
          {products.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-gray-400">
                Showing {products.length} products
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => {
                  if (!product || !product._id) return null;
                  
                  const productUrl = generateUrl(product);
                  const price = getPrice(product);
                  const originalPrice = getOriginalPrice(product);
                  const inStock = isInStock(product);
                  
                  return (
                    <div 
                      key={product._id} 
                      className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                      onClick={() => navigate(productUrl)}
                    >
                      <div className="h-48 bg-gray-700 overflow-hidden">
                        <img
                          src={getImageUrl(product)}
                          alt={product.name || 'Product'}
                          className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {product.brand && (
                            <span className="text-xs font-semibold text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
                              {product.brand}
                            </span>
                          )}
                          {product.type && (
                            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                              {product.type}
                            </span>
                          )}
                        </div>

                        <h3 className="font-semibold text-lg text-white mb-2 line-clamp-2">
                          {product.name || 'Unnamed Product'}
                        </h3>

                        <div className="flex items-baseline gap-2 mb-3">
                          <p className="text-xl font-bold text-green-400">
                            ₹{price.toLocaleString()}
                          </p>
                          {originalPrice > price && (
                            <p className="text-sm text-gray-500 line-through">
                              ₹{originalPrice.toLocaleString()}
                            </p>
                          )}
                        </div>

                        {product.description && (
                          <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded ${
                            inStock 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-red-900 text-red-300'
                          }`}>
                            {inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                          
                          <button 
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(productUrl);
                            }}
                          >
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <p className="text-gray-400 text-lg mb-4">No products found matching your search.</p>
              <p className="text-gray-500 text-sm">Try different keywords or browse our categories.</p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Browse Home
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;