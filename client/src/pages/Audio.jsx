// src/pages/Audio.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaHeadphones,
  FaBluetoothB,
  FaWifi,
  FaMicrophone,
  FaMusic,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaFilter,
  FaSort,
  FaSearch,
  FaTimes,
  FaCheck,
  FaBatteryFull,
  FaBatteryHalf,
  FaBatteryQuarter,
  FaUsb,
  FaClock,
  FaTachometerAlt,
  FaVolumeUp,
  FaPodcast,
  FaMicrophoneAlt,
  FaGamepad,
  FaMobileAlt,
  FaLaptop,
  FaTv,
  FaCrown,
  FaFire,
  FaBolt,
  FaArrowLeft,
  FaArrowRight,
  FaRuler,
  FaWeight,
  FaPalette,
  FaShieldAlt,
  FaWater
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Audio = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedConnectivity, setSelectedConnectivity] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

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

  // Safe string conversion helper
  const safeToLowerCase = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value.toLowerCase();
    if (Array.isArray(value)) return value.map(item => String(item).toLowerCase()).join(' ');
    if (typeof value === 'object') return JSON.stringify(value).toLowerCase();
    return String(value).toLowerCase();
  };

  // Helper function to safely get category as string
  const getCategoryString = (category) => {
    if (!category) return '';
    if (Array.isArray(category)) {
      return category.join(' ').toLowerCase();
    }
    if (typeof category === 'string') {
      return category.toLowerCase();
    }
    return '';
  };

  // Fetch audio products
  useEffect(() => {
    const fetchAudioProducts = async () => {
      try {
        setLoading(true);
        // Fetch audio products from the dedicated audio endpoint
        const response = await fetch(`${BASE_URL}/api/audio`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('Audio API response:', data);
        
        // Check if the response has the expected structure
        if (data.success && Array.isArray(data.products)) {
          // The API returns products in data.products
          setProducts(data.products);
          setFilteredProducts(data.products);
        } else if (Array.isArray(data)) {
          // If the API returns an array directly
          setProducts(data);
          setFilteredProducts(data);
        } else {
          console.error('Unexpected API response format:', data);
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (err) {
        console.error('Error fetching audio products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAudioProducts();
  }, []);

  // Extract unique filter options from products
  const filters = React.useMemo(() => {
    const brands = new Set();
    const types = new Set();
    const connectivity = new Set();
    const features = new Set();

    products.forEach(product => {
      if (product.brand) brands.add(product.brand);
      
      // Determine audio type based on product name/category
      const name = safeToLowerCase(product.name);
      const categoryStr = getCategoryString(product.category);
      const description = safeToLowerCase(product.description);
      const specs = product.specs || {};
      
      if (name.includes('headphone') || name.includes('headset') || categoryStr.includes('headphone')) {
        types.add('Headphones');
      }
      if (name.includes('earbud') || name.includes('earpod') || categoryStr.includes('earbud')) {
        types.add('Earbuds');
      }
      if (name.includes('speaker') || categoryStr.includes('speaker')) {
        types.add('Speakers');
      }
      if (name.includes('soundbar') || categoryStr.includes('soundbar')) {
        types.add('Soundbars');
      }
      if (name.includes('microphone') || categoryStr.includes('microphone')) {
        types.add('Microphones');
      }
      if (name.includes('amplifier') || name.includes('amp') || categoryStr.includes('amplifier')) {
        types.add('Amplifiers');
      }

      // Extract connectivity from product specs or description
      if (specs.bluetooth || description.includes('bluetooth')) {
        connectivity.add('Bluetooth');
        features.add('Bluetooth');
      }
      if (specs.wifi || description.includes('wifi') || description.includes('wi-fi')) {
        connectivity.add('WiFi');
        features.add('WiFi');
      }
      if (description.includes('wireless')) {
        connectivity.add('Wireless');
        features.add('Wireless');
      }
      if (description.includes('wired') || description.includes('cable')) {
        connectivity.add('Wired');
      }
      
      // Extract features
      if (description.includes('noise cancelling') || description.includes('noise-cancelling') || specs.noiseCancelling) {
        features.add('Noise Cancelling');
      }
      if (description.includes('waterproof') || description.includes('water resistant') || specs.waterResistant) {
        features.add('Water Resistant');
      }
      if (description.includes('bass') || specs.bass) {
        features.add('Deep Bass');
      }
      if (description.includes('microphone') || description.includes('mic') || specs.builtInMic) {
        features.add('Built-in Mic');
      }
      if (description.includes('long battery') || specs.batteryLife > 10) {
        features.add('Long Battery Life');
      }
      if (description.includes('fast charging') || specs.fastCharging) {
        features.add('Fast Charging');
      }
      if (description.includes('gaming') || specs.gaming) {
        features.add('Gaming');
      }
      if (description.includes('studio') || specs.studio) {
        features.add('Studio Quality');
      }
    });

    return {
      brands: Array.from(brands).sort(),
      types: Array.from(types).sort(),
      connectivity: Array.from(connectivity).sort(),
      features: Array.from(features).sort()
    };
  }, [products]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Apply search
    if (searchTerm) {
      const searchLower = safeToLowerCase(searchTerm);
      filtered = filtered.filter(product =>
        safeToLowerCase(product.name).includes(searchLower) ||
        safeToLowerCase(product.description).includes(searchLower) ||
        safeToLowerCase(product.brand).includes(searchLower)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        const categoryStr = getCategoryString(product.category);
        return categoryStr.includes(safeToLowerCase(selectedCategory));
      });
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(product => {
        const name = safeToLowerCase(product.name);
        const categoryStr = getCategoryString(product.category);
        const typeLower = safeToLowerCase(selectedType);
        
        switch(selectedType) {
          case 'Headphones':
            return name.includes('headphone') || name.includes('headset') || categoryStr.includes('headphone');
          case 'Earbuds':
            return name.includes('earbud') || name.includes('earpod') || categoryStr.includes('earbud');
          case 'Speakers':
            return name.includes('speaker') || categoryStr.includes('speaker');
          case 'Soundbars':
            return name.includes('soundbar') || categoryStr.includes('soundbar');
          case 'Microphones':
            return name.includes('microphone') || categoryStr.includes('microphone');
          case 'Amplifiers':
            return name.includes('amplifier') || name.includes('amp') || categoryStr.includes('amplifier');
          default:
            return true;
        }
      });
    }

    // Apply brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Apply connectivity filter
    if (selectedConnectivity !== 'all') {
      filtered = filtered.filter(product => {
        const description = safeToLowerCase(product.description);
        const specs = product.specs || {};
        const connLower = safeToLowerCase(selectedConnectivity);
        
        switch(selectedConnectivity) {
          case 'Bluetooth':
            return specs.bluetooth || description.includes('bluetooth');
          case 'WiFi':
            return specs.wifi || description.includes('wifi') || description.includes('wi-fi');
          case 'Wireless':
            return description.includes('wireless');
          case 'Wired':
            return description.includes('wired') || description.includes('cable');
          default:
            return true;
        }
      });
    }

    // Apply price filter
    filtered = filtered.filter(product => 
      (product.price || 0) >= priceRange.min && (product.price || 0) <= priceRange.max
    );

    // Apply features filter
    if (selectedFeatures.length > 0) {
      filtered = filtered.filter(product => {
        const description = safeToLowerCase(product.description);
        const specs = product.specs || {};
        
        return selectedFeatures.every(feature => {
          switch(feature) {
            case 'Noise Cancelling':
              return description.includes('noise cancelling') || description.includes('noise-cancelling') || specs.noiseCancelling;
            case 'Water Resistant':
              return description.includes('waterproof') || description.includes('water resistant') || specs.waterResistant;
            case 'Deep Bass':
              return description.includes('bass') || specs.bass;
            case 'Built-in Mic':
              return description.includes('microphone') || description.includes('mic') || specs.builtInMic;
            case 'Bluetooth':
              return description.includes('bluetooth') || specs.bluetooth;
            case 'Wireless':
              return description.includes('wireless');
            case 'Long Battery Life':
              return description.includes('long battery') || specs.batteryLife > 10;
            case 'Fast Charging':
              return description.includes('fast charging') || specs.fastCharging;
            case 'Gaming':
              return description.includes('gaming') || specs.gaming;
            case 'Studio Quality':
              return description.includes('studio') || specs.studio;
            default:
              return description.includes(safeToLowerCase(feature));
          }
        });
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const priceA = a.price || 0;
      const priceB = b.price || 0;
      const popularityA = a.popularity || 0;
      const popularityB = b.popularity || 0;
      const discountA = a.discount || 0;
      const discountB = b.discount || 0;
      const nameA = a.name || '';
      const nameB = b.name || '';

      switch(sortBy) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'name':
          return nameA.localeCompare(nameB);
        case 'popularity':
          return popularityB - popularityA;
        case 'discount':
          return discountB - discountA;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchTerm, selectedCategory, selectedType, selectedBrand, selectedConnectivity, priceRange, selectedFeatures, sortBy]);

  // Toggle feature selection
  const toggleFeature = (feature) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
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
    navigate(`/audio/${productId}`);
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

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get product type badge
  const getProductType = (product) => {
    const name = safeToLowerCase(product.name);
    const categoryStr = getCategoryString(product.category);
    
    if (name.includes('headphone') || name.includes('headset') || categoryStr.includes('headphone')) return 'Headphones';
    if (name.includes('earbud') || categoryStr.includes('earbud')) return 'Earbuds';
    if (name.includes('speaker') || categoryStr.includes('speaker')) return 'Speaker';
    if (name.includes('soundbar') || categoryStr.includes('soundbar')) return 'Soundbar';
    if (name.includes('microphone') || categoryStr.includes('microphone')) return 'Microphone';
    if (name.includes('amplifier') || name.includes('amp')) return 'Amplifier';
    return 'Audio';
  };

  // Get connectivity icon
  const getConnectivityIcon = (product) => {
    const specs = product.specs || {};
    const description = safeToLowerCase(product.description);
    
    if (specs.bluetooth || description.includes('bluetooth')) {
      return <FaBluetoothB className="text-blue-400" title="Bluetooth" />;
    }
    if (specs.wifi || description.includes('wifi')) {
      return <FaWifi className="text-blue-400" title="WiFi" />;
    }
    if (description.includes('wireless')) {
      return <FaWifi className="text-blue-400" title="Wireless" />;
    }
    return null;
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
          <p className="text-white text-lg font-medium mt-4">Loading audio products...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we find the perfect audio gear for you</p>
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
      <header>
        <title>Audio Products - Headphones, Speakers, Earbuds & More | 7HubComputers</title>
        <meta name="description" content="Discover premium audio products including headphones, speakers, earbuds, soundbars, and professional audio gear." />
      </header>

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center">
            <FaHeadphones className="mr-4 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Audio Products
            </span>
          </h1>
          <p className="text-lg text-gray-400">
            Discover premium headphones, speakers, earbuds, and audio accessories
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {filteredProducts.length} products found
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
                onClick={() => setCompareList([])}
                className="text-white/80 hover:text-white transition"
              >
                <FaTimes />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search audio products..."
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
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
              <option value="discount">Best Discount</option>
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
            {/* Categories */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <FaHeadphones className="mr-2 text-indigo-400" />
                Categories
              </h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={selectedCategory === 'all'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-300">All Audio</span>
                </label>
                {filters.types.map(type => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={type}
                      checked={selectedCategory === type}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">{type}</span>
                  </label>
                ))}
              </div>
            </div>

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
                  {filters.brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Connectivity */}
            {filters.connectivity.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <FaBluetoothB className="mr-2 text-indigo-400" />
                  Connectivity
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="connectivity"
                      value="all"
                      checked={selectedConnectivity === 'all'}
                      onChange={(e) => setSelectedConnectivity(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">All</span>
                  </label>
                  {filters.connectivity.map(conn => (
                    <label key={conn} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="connectivity"
                        value={conn}
                        checked={selectedConnectivity === conn}
                        onChange={(e) => setSelectedConnectivity(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-300">{conn}</span>
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
                    max="100000"
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
                    max="100000"
                    step="1000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            {filters.features.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4">Features</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filters.features.map(feature => (
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
            )}

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedType('all');
                setSelectedBrand('all');
                setSelectedConnectivity('all');
                setPriceRange({ min: 0, max: 100000 });
                setSelectedFeatures([]);
                setSortBy('popularity');
                setSearchTerm('');
              }}
              className="w-full px-4 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Reset All Filters
            </button>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            {currentProducts.length > 0 ? (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {currentProducts.map((product, index) => {
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
                            <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center">
                              {getProductType(product)}
                            </span>
                          </div>

                          {/* Connectivity Icon */}
                          <div className="absolute bottom-3 left-3 z-10">
                            {getConnectivityIcon(product)}
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
                          
                          {/* Features */}
                          <div className="flex flex-wrap gap-2 text-xs mb-2">
                            {product.specs?.bluetooth && (
                              <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                                <FaBluetoothB className="mr-1 text-blue-400" /> Bluetooth
                              </span>
                            )}
                            {product.specs?.wifi && (
                              <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                                <FaWifi className="mr-1 text-blue-400" /> WiFi
                              </span>
                            )}
                            {product.specs?.batteryLife && (
                              <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                                <FaBatteryHalf className="mr-1 text-green-400" /> {product.specs.batteryLife}
                              </span>
                            )}
                          </div>

                          {/* Feature Tags */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {product.specs?.noiseCancelling && (
                              <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded">Noise Cancelling</span>
                            )}
                            {product.specs?.waterResistant && (
                              <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded flex items-center">
                                <FaWater className="mr-1 text-xs" /> Water Resistant
                              </span>
                            )}
                            {product.specs?.builtInMic && (
                              <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded flex items-center">
                                <FaMicrophone className="mr-1 text-xs" /> Built-in Mic
                              </span>
                            )}
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < (product.rating || 4)
                                      ? 'text-yellow-400'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({product.reviews?.length || 0})
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
                            {product.inStock ? (
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
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
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
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
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
                <div className="text-6xl text-gray-600 mb-4">🎧</div>
                <h3 className="text-xl font-medium text-white mb-2">No audio products found</h3>
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
              { name: 'Headphones', icon: <FaHeadphones />, count: filters.types.filter(t => t.includes('Headphone')).length || 45, color: 'from-purple-600 to-purple-800' },
              { name: 'Earbuds', icon: <FaMusic />, count: filters.types.filter(t => t.includes('Earbud')).length || 32, color: 'from-blue-600 to-blue-800' },
              { name: 'Speakers', icon: <FaVolumeUp />, count: filters.types.filter(t => t.includes('Speaker')).length || 28, color: 'from-green-600 to-green-800' },
              { name: 'Soundbars', icon: <FaTv />, count: filters.types.filter(t => t.includes('Soundbar')).length || 18, color: 'from-red-600 to-red-800' },
              { name: 'Microphones', icon: <FaMicrophoneAlt />, count: filters.types.filter(t => t.includes('Microphone')).length || 22, color: 'from-yellow-600 to-yellow-800' },
              { name: 'Amplifiers', icon: <FaBolt />, count: filters.types.filter(t => t.includes('Amplifier')).length || 15, color: 'from-indigo-600 to-indigo-800' }
            ].map((cat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-r ${cat.color} rounded-xl p-4 text-white text-center cursor-pointer hover:shadow-xl transition-all`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="font-bold text-sm">{cat.name}</h3>
                <p className="text-xs text-white/80">{cat.count} products</p>
              </motion.div>
            ))}
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
                    Compare Audio Products
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
                              navigate(`/audio/${productId}`);
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

export default Audio;