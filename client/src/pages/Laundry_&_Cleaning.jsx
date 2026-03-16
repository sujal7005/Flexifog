// src/pages/Laundry_&_Cleaning.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FaTshirt,
  FaWater,
  FaWind,
  FaBolt,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaFilter,
  FaSort,
  FaSearch,
  FaTimes,
  FaRuler,
  FaWeight,
  FaPalette,
  FaPlug,
  FaClock,
  FaTachometerAlt,
  FaVolumeUp,
  FaMicrochip,
  FaMemory,
  FaShieldAlt,
  FaMobileAlt,
  FaWifi,
  FaRegClock,
  FaThermometerHalf,
  FaSnowflake,
  FaBroom,
  FaDollarSign,
  FaBatteryFull,
  FaDrum,
  FaCogs,
  FaLeaf,
  FaExclamationTriangle,
  FaCheckCircle,
  FaIndustry,
  FaArrowLeft,
  FaArrowRight,
  FaRobot,
  FaBath,
  FaSoap,
  FaPumpSoap,
  FaTint,
  FaTemperatureLow
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const LaundryCleaning = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    brands: [],
    types: [],
    loadTypes: [],
    energyRatings: []
  });
  
  // Filter states
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedLoadType, setSelectedLoadType] = useState('all');
  const [selectedEnergyRating, setSelectedEnergyRating] = useState('all');
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 1
  });

  const BASE_URL = `http://${window.location.hostname}:4000`;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Helper function for safe string conversion
  const safeToLowerCase = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value.toLowerCase();
    if (Array.isArray(value)) return value.map(item => String(item).toLowerCase()).join(' ');
    if (typeof value === 'object') return JSON.stringify(value).toLowerCase();
    return String(value).toLowerCase();
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Build query params
        const params = new URLSearchParams({
          page: currentPage,
          limit: productsPerPage,
          sort: sortBy,
          minPrice: priceRange.min,
          maxPrice: priceRange.max
        });

        if (selectedType !== 'all') params.append('type', selectedType);
        if (selectedBrand !== 'all') params.append('brand', selectedBrand);
        if (selectedLoadType !== 'all') params.append('loadType', selectedLoadType);
        if (selectedEnergyRating !== 'all') params.append('energyRating', selectedEnergyRating);
        if (searchTerm) params.append('search', searchTerm);
        if (selectedFeatures.length > 0) params.append('features', selectedFeatures.join(','));
        
        const response = await fetch(`${BASE_URL}/api/laundry?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('Laundry API response:', data);
        
        if (data.success) {
          setProducts(data.products || []);
          setFilteredProducts(data.products || []);
          setPagination(data.pagination || {
            total: data.products?.length || 0,
            page: 1,
            limit: 12,
            pages: Math.ceil((data.products?.length || 0) / 12)
          });
          setFilters(data.filters || { 
            brands: [], 
            types: [], 
            loadTypes: [], 
            energyRatings: [] 
          });
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (err) {
        console.error('Error fetching laundry products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, sortBy, selectedType, selectedBrand, selectedLoadType, selectedEnergyRating, searchTerm, priceRange.min, priceRange.max, selectedFeatures]);

  // Get product type icon
  const getProductTypeIcon = (type) => {
    const icons = {
      'Washing Machine': <FaWater className="text-blue-400" />,
      'Dryer': <FaWind className="text-cyan-400" />,
      'Washer-Dryer Combo': <FaCogs className="text-purple-400" />,
      'Iron': <FaIndustry className="text-orange-400" />,
      'Steam Iron': <FaIndustry className="text-orange-400" />,
      'Ironing Board': <FaTshirt className="text-gray-400" />,
      'Steamer': <FaWind className="text-cyan-400" />,
      'Vacuum Cleaner': <FaBroom className="text-green-400" />,
      'Robot Vacuum': <FaRobot className="text-indigo-400" />,
      'Stick Vacuum': <FaBroom className="text-green-400" />,
      'Handheld Vacuum': <FaBroom className="text-green-400" />,
      'Wet-Dry Vacuum': <FaBroom className="text-green-400" />,
      'Carpet Cleaner': <FaBroom className="text-green-400" />,
      'Floor Cleaner': <FaBroom className="text-green-400" />,
      'Steam Mop': <FaBroom className="text-green-400" />,
      'Spin Mop': <FaBroom className="text-green-400" />,
      'Laundry Basket': <FaTshirt className="text-gray-400" />,
      'Drying Rack': <FaTshirt className="text-gray-400" />,
      'Laundry Sorter': <FaTshirt className="text-gray-400" />,
      'Fabric Steamer': <FaWind className="text-cyan-400" />,
      'Garment Steamer': <FaWind className="text-cyan-400" />
    };
    return icons[type] || <FaTshirt className="text-gray-400" />;
  };

  // Get product type color for gradient
  const getProductTypeGradient = (type) => {
    const gradients = {
      'Washing Machine': 'from-blue-600 to-blue-800',
      'Dryer': 'from-cyan-600 to-cyan-800',
      'Washer-Dryer Combo': 'from-purple-600 to-purple-800',
      'Iron': 'from-orange-600 to-orange-800',
      'Steam Iron': 'from-orange-600 to-orange-800',
      'Vacuum Cleaner': 'from-green-600 to-green-800',
      'Robot Vacuum': 'from-indigo-600 to-indigo-800',
      'Carpet Cleaner': 'from-green-600 to-green-800',
      'Floor Cleaner': 'from-green-600 to-green-800'
    };
    return gradients[type] || 'from-gray-600 to-gray-800';
  };

  // Get product type badge color
  const getProductTypeBadge = (type) => {
    const colors = {
      'Washing Machine': 'bg-blue-900/30 text-blue-400',
      'Dryer': 'bg-cyan-900/30 text-cyan-400',
      'Washer-Dryer Combo': 'bg-purple-900/30 text-purple-400',
      'Iron': 'bg-orange-900/30 text-orange-400',
      'Steam Iron': 'bg-orange-900/30 text-orange-400',
      'Vacuum Cleaner': 'bg-green-900/30 text-green-400',
      'Robot Vacuum': 'bg-indigo-900/30 text-indigo-400',
      'Carpet Cleaner': 'bg-green-900/30 text-green-400',
      'Floor Cleaner': 'bg-green-900/30 text-green-400'
    };
    return colors[type] || 'bg-gray-900/30 text-gray-400';
  };

  // Get capacity display
  const getCapacity = (product) => {
    if (product.specs?.capacity) return product.specs.capacity;
    if (product.specs?.dryingCapacity) return product.specs.dryingCapacity;
    if (product.specs?.dustCapacity) return product.specs.dustCapacity;
    if (product.specs?.waterTankCapacity) return product.specs.waterTankCapacity;
    return null;
  };

  // Get energy rating
  const getEnergyRating = (product) => {
    return product.specs?.energyRating || null;
  };

  // Get spin speed
  const getSpinSpeed = (product) => {
    return product.specs?.spinSpeed || null;
  };

  // Get key features based on product type
  const getKeyFeatures = (product) => {
    const features = [];
    const specs = product.specs || {};
    
    if (specs.inverterMotor) features.push('Inverter Motor');
    if (specs.steamWash) features.push('Steam Wash');
    if (specs.quickWash) features.push('Quick Wash');
    if (specs.autoDocking) features.push('Auto Docking');
    if (specs.appControl) features.push('App Control');
    if (specs.voiceControl) features.push('Voice Control');
    if (specs.autoShutOff) features.push('Auto Shut-off');
    if (specs.antiCrease) features.push('Anti-Crease');
    if (specs.childLock) features.push('Child Lock');
    if (specs.moistureSensor) features.push('Moisture Sensor');
    
    return features.slice(0, 3); // Return top 3 features
  };

  // Toggle wishlist
  const toggleWishlist = (productId, e) => {
    e.stopPropagation();
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Toggle compare
  const toggleCompare = (productId, e) => {
    e.stopPropagation();
    setCompareList(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else if (prev.length < 3) {
        return [...prev, productId];
      }
      alert('You can compare up to 3 products at a time');
      return prev;
    });
  };

  // Handle compare
  const handleCompare = () => {
    if (compareList.length < 2) {
      alert('Please select at least 2 products to compare');
      return;
    }
    setShowCompareModal(true);
  };

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/laundry/${productId}`);
  };

  // Toggle feature selection
  const toggleFeature = (feature) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';
    if (Array.isArray(imagePath) && imagePath.length > 0) {
      const filename = imagePath[0].split(/[\\/]/).pop();
      return `${BASE_URL}/uploads/${filename}`;
    }
    if (typeof imagePath === 'string') {
      const filename = imagePath.split(/[\\/]/).pop();
      return `${BASE_URL}/uploads/${filename}`;
    }
    return '/placeholder-image.jpg';
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-indigo-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-white text-lg font-medium mt-4">Loading laundry & cleaning products...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we find the perfect appliances for your home</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 flex items-center justify-center">
        <div className="text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 max-w-md">
          <div className="text-red-500 text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Products</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 pb-20">
      <Helmet>
        <title>Laundry & Cleaning - Washing Machines, Dryers, Vacuums & More | 7HubComputers</title>
        <meta name="description" content="Discover premium laundry and cleaning appliances including washing machines, dryers, irons, vacuum cleaners, and more for your home." />
      </Helmet>

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center">
            <FaTshirt className="mr-4 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Laundry & Cleaning
            </span>
          </h1>
          <p className="text-lg text-gray-400">
            Discover premium washing machines, dryers, irons, and cleaning appliances
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {pagination.total} products found
          </p>
        </motion.div>

        {/* Compare Bar */}
        <AnimatePresence>
          {compareList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl mb-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="font-bold">{compareList.length} product(s) selected for comparison</span>
                <button
                  onClick={handleCompare}
                  className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition font-semibold"
                >
                  Compare Now
                </button>
              </div>
              <button
                onClick={() => {
                  setCompareList([]);
                  setCompareMode(false);
                }}
                className="text-white/80 hover:text-white transition"
              >
                <FaTimes />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Mobile Filter Button */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search laundry & cleaning products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                <FaTimes />
              </button>
            )}
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white hover:border-indigo-500"
            >
              <FaFilter /> Filters
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
              <option value="capacity">Capacity (High to Low)</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={`md:w-80 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}
          >
            {/* Product Type */}
            {filters.types.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <FaTshirt className="mr-2 text-indigo-400" />
                  Product Type
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="all"
                      checked={selectedType === 'all'}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">All Types</span>
                  </label>
                  {filters.types.sort().map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={selectedType === type}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-300 flex items-center">
                        {getProductTypeIcon(type)}
                        <span className="ml-2">{type}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Brands */}
            {filters.brands.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4">Brands</h3>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Brands</option>
                  {filters.brands.sort().map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Load Type (for washing machines) */}
            {filters.loadTypes.length > 0 && (selectedType === 'all' || selectedType === 'Washing Machine') && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <FaWater className="mr-2 text-indigo-400" />
                  Load Type
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="loadType"
                      value="all"
                      checked={selectedLoadType === 'all'}
                      onChange={(e) => setSelectedLoadType(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">All</span>
                  </label>
                  {filters.loadTypes.map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="loadType"
                        value={type}
                        checked={selectedLoadType === type}
                        onChange={(e) => setSelectedLoadType(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-300">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Energy Rating */}
            {filters.energyRatings.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <FaBolt className="mr-2 text-indigo-400" />
                  Energy Rating
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="energyRating"
                      value="all"
                      checked={selectedEnergyRating === 'all'}
                      onChange={(e) => setSelectedEnergyRating(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">All</span>
                  </label>
                  {filters.energyRatings.sort().map(rating => (
                    <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="energyRating"
                        value={rating}
                        checked={selectedEnergyRating === rating}
                        onChange={(e) => setSelectedEnergyRating(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-300">{rating}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Price Range</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Min: {formatPrice(priceRange.min)}</label>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="1000"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Max: {formatPrice(priceRange.max)}</label>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="1000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Features</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {[
                  'Inverter Motor',
                  'Steam Wash',
                  'Quick Wash',
                  'Child Lock',
                  'Smart Diagnosis',
                  'WiFi Connected',
                  'App Control',
                  'Voice Control',
                  'Auto Dosing',
                  'Energy Efficient',
                  'Quiet Operation',
                  'Anti-Allergy',
                  'Hygiene Steam',
                  'Delay Start',
                  'Auto Shut-off'
                ].map(feature => (
                  <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      className="text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <span className="text-gray-300">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedBrand('all');
                setSelectedLoadType('all');
                setSelectedEnergyRating('all');
                setPriceRange({ min: 0, max: 200000 });
                setSelectedFeatures([]);
                setSortBy('popularity');
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Reset All Filters
            </button>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product, index) => {
                    const keyFeatures = getKeyFeatures(product);
                    const price = product.finalPrice || product.price || 0;
                    
                    return (
                      <motion.div
                        key={product._id}
                        variants={itemVariants}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl cursor-pointer group relative"
                        onClick={() => handleProductClick(product._id)}
                      >
                        {/* Compare Checkbox */}
                        <div className="absolute top-3 left-3 z-20">
                          <label className="flex items-center space-x-2 cursor-pointer bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-600 hover:border-indigo-500 transition-all">
                            <input
                              type="checkbox"
                              checked={compareList.includes(product._id)}
                              onChange={(e) => toggleCompare(product._id, e)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-xs text-gray-300 font-medium">Compare</span>
                          </label>
                        </div>

                        {/* Product Image */}
                        <div className="relative h-48 bg-gray-900 p-4">
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-image.jpg';
                            }}
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
                            {product.discount > 0 && (
                              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                                -{product.discount}%
                              </span>
                            )}
                            {getEnergyRating(product) && (
                              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center">
                                <FaBolt className="mr-1" /> {getEnergyRating(product)}
                              </span>
                            )}
                            <span className={`${getProductTypeBadge(product.type)} text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center`}>
                              {getProductTypeIcon(product.type)} 
                              <span className="ml-1">{product.type}</span>
                            </span>
                          </div>

                          {/* Wishlist Button */}
                          <button
                            onClick={(e) => toggleWishlist(product._id, e)}
                            className="absolute bottom-3 right-3 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 border border-gray-600 z-10"
                          >
                            <FaHeart className={wishlist.includes(product._id) ? 'text-red-500' : 'text-gray-400'} />
                          </button>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition">
                            {product.name}
                          </h3>
                          
                          {/* Key Specs */}
                          <div className="flex flex-wrap gap-2 text-xs mb-2">
                            {product.brand && (
                              <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                                {product.brand}
                              </span>
                            )}
                            {getCapacity(product) && (
                              <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                                <FaRuler className="mr-1 text-indigo-400 text-xs" /> {getCapacity(product)}
                              </span>
                            )}
                            {getSpinSpeed(product) && (
                              <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                                <FaTachometerAlt className="mr-1 text-indigo-400 text-xs" /> {getSpinSpeed(product)}
                              </span>
                            )}
                            {product.specs?.loadType && (
                              <span className="bg-gray-700 px-2 py-1 rounded text-gray-300">
                                {product.specs.loadType}
                              </span>
                            )}
                          </div>

                          {/* Features Tags */}
                          {keyFeatures.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {keyFeatures.map((feature, idx) => (
                                <span key={idx} className="text-xs bg-indigo-900/30 text-indigo-400 px-2 py-0.5 rounded">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.rating || 0)
                                      ? 'text-yellow-400'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({product.reviewCount || 0})
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-xl font-bold text-indigo-400">
                                {formatPrice(price)}
                              </span>
                              {product.originalPrice > price && (
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                            {product.stock > 0 ? (
                              <span className="text-green-400 text-xs font-medium">In Stock</span>
                            ) : (
                              <span className="text-red-400 text-xs font-medium">Out of Stock</span>
                            )}
                          </div>

                          {/* Quick Add Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add to cart logic
                              console.log('Adding to cart:', product);
                            }}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <FaShoppingCart /> Add to Cart
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 border rounded-lg transition ${
                          currentPage === i + 1
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent'
                            : 'bg-gray-800 border-gray-700 text-white hover:border-indigo-500'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                      disabled={currentPage === pagination.pages}
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700"
              >
                <div className="text-6xl text-gray-600 mb-4">🧺</div>
                <h3 className="text-xl font-medium text-white mb-2">No laundry & cleaning products found</h3>
                <p className="text-gray-400">Try adjusting your filters or search term</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Featured Categories */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Washing Machines', icon: <FaWater />, type: 'Washing Machine', gradient: 'from-blue-600 to-blue-800' },
              { name: 'Dryers', icon: <FaWind />, type: 'Dryer', gradient: 'from-cyan-600 to-cyan-800' },
              { name: 'Washer-Dryer', icon: <FaCogs />, type: 'Washer-Dryer Combo', gradient: 'from-purple-600 to-purple-800' },
              { name: 'Irons', icon: <FaIndustry />, type: 'Iron', gradient: 'from-orange-600 to-orange-800' },
              { name: 'Vacuum Cleaners', icon: <FaBroom />, type: 'Vacuum Cleaner', gradient: 'from-green-600 to-green-800' },
              { name: 'Robot Vacuums', icon: <FaRobot />, type: 'Robot Vacuum', gradient: 'from-indigo-600 to-indigo-800' }
            ].map((cat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-r ${cat.gradient} rounded-xl p-4 text-white text-center cursor-pointer hover:shadow-xl transition-all`}
                onClick={() => setSelectedType(cat.type)}
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="font-bold text-sm">{cat.name}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Buying Guide */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Laundry & Cleaning Buying Guide</h3>
              <p className="text-white/80 mb-6">
                Make laundry day easier and your home cleaner with our premium appliances. 
                Check out our buying guides for expert advice.
              </p>
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition transform hover:scale-105">
                View Buying Guides
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Capacity Guide</h4>
                <p className="text-sm text-white/70">Choose the right size</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Energy Efficiency</h4>
                <p className="text-sm text-white/70">Save on electricity bills</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Smart Features</h4>
                <p className="text-sm text-white/70">Connect and control</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Maintenance Tips</h4>
                <p className="text-sm text-white/70">Extend product life</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Compare Modal */}
        <AnimatePresence>
          {showCompareModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowCompareModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gray-800/95 backdrop-blur-sm p-6 border-b border-gray-700 flex justify-between items-center">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Compare Laundry & Cleaning Products
                  </h2>
                  <button
                    onClick={() => setShowCompareModal(false)}
                    className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {compareList.map(productId => {
                      const product = products.find(p => p._id === productId);
                      if (!product) return null;
                      
                      return (
                        <div key={productId} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="h-32 object-contain mb-4 mx-auto"
                          />
                          <h3 className="font-semibold text-white mb-2 text-center line-clamp-2">{product.name}</h3>
                          <p className="text-indigo-400 font-bold mb-2 text-center">{formatPrice(product.finalPrice || product.price)}</p>
                          <button
                            onClick={() => {
                              setShowCompareModal(false);
                              navigate(`/laundry/${productId}`);
                            }}
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                          >
                            View Details
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LaundryCleaning;