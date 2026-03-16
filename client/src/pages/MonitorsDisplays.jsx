// src/pages/MonitorsDisplays.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FaTv,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaDesktop,
  FaGamepad,
  FaRuler,
  FaWeight,
  FaTachometerAlt,
  FaClock,
  FaBolt,
  FaPlug,
  FaWifi,
  FaBluetooth,
  FaUsb,
  FaEye,
  FaPalette,
  FaSun,
  FaMoon,
  FaAdjust,
  FaArrowsAlt,
  FaExpand,
  FaCompress,
  FaTh,
  FaList,
  FaCheck,
  FaPlus,
  FaMinus,
  FaInfoCircle,
  FaBoxOpen,
  FaAward,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaCalendarAlt,
  FaStarHalf,
  FaStarHalfAlt,
  FaTabletAlt,
  FaMobileAlt,
  FaServer,
  FaVideo,
  FaMicrochip,
  FaRandom,
  FaExchangeAlt,
  FaHeadphones,
  FaVolumeUp,
  FaVolumeMute,
  FaPodcast,
  FaSatellite,
  FaSatelliteDish,
  FaBroadcastTower,
  FaRss,
  FaNetworkWired,
  FaEthernet,
  FaArrowLeft,
  FaArrowRight,
  FaBriefcase
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MonitorsDisplays = () => {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
  const [selectedSize, setSelectedSize] = useState([]);
  const [selectedResolution, setSelectedResolution] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState([]);
  const [selectedRefreshRate, setSelectedRefreshRate] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    price: true,
    size: true,
    resolution: true,
    panel: true,
    refreshRate: true,
    features: true
  });
  const [wishlist, setWishlist] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  
  const navigate = useNavigate();

  // Monitor categories
  const monitorCategories = [
    { id: 'all', name: 'All Monitors' },
    { id: 'gaming', name: 'Gaming Monitors' },
    { id: 'professional', name: 'Professional' },
    { id: 'ultrawide', name: 'Ultrawide' },
    { id: '4k', name: '4K Monitors' },
    { id: 'portable', name: 'Portable' },
    { id: 'touchscreen', name: 'Touchscreen' },
    { id: 'curved', name: 'Curved' },
    { id: 'office', name: 'Office/Business' }
  ];

  // Monitor sizes
  const monitorSizes = [
    'Under 24"',
    '24"-27"',
    '27"-32"',
    '32"-34"',
    '34"-38"',
    '38"+'
  ];

  // Resolutions
  const resolutions = [
    'HD (1366x768)',
    'Full HD (1920x1080)',
    '2K (2560x1440)',
    '4K (3840x2160)',
    '5K (5120x2880)',
    '8K (7680x4320)',
    'Ultrawide (2560x1080)',
    'Ultrawide (3440x1440)',
    'Super Ultrawide (5120x1440)'
  ];

  // Panel types
  const panelTypes = [
    'IPS',
    'VA',
    'TN',
    'OLED',
    'QLED',
    'Mini-LED',
    'PLS',
    'AHVA'
  ];

  // Refresh rates
  const refreshRates = [
    '60Hz',
    '75Hz',
    '100Hz',
    '144Hz',
    '165Hz',
    '240Hz',
    '360Hz',
    '480Hz'
  ];

  // Features
  const monitorFeatures = [
    'G-Sync',
    'FreeSync',
    'HDR',
    'HDR10',
    'HDR400',
    'HDR600',
    'HDR1000',
    'Built-in Speakers',
    'USB-C',
    'Thunderbolt',
    'KVM Switch',
    'PiP/PbP',
    'Height Adjustable',
    'Pivot',
    'Swivel',
    'VESA Mount',
    'Eye Care',
    'Flicker Free',
    'Blue Light Filter',
    'Adaptive Sync'
  ];

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

  // Fetch monitors from backend
  useEffect(() => {
    fetchMonitors();
  }, [page, sortBy, selectedCategory, searchTerm, priceRange.min, priceRange.max, selectedBrand, selectedSize, selectedResolution, selectedPanel, selectedRefreshRate, selectedFeatures]);

  const fetchMonitors = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page,
        limit: 12,
        sort: sortBy,
        category: selectedCategory !== 'all' ? selectedCategory : '',
        search: searchTerm,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        brand: selectedBrand !== 'all' ? selectedBrand : '',
        size: selectedSize.join(','),
        resolution: selectedResolution.join(','),
        panel: selectedPanel.join(','),
        refreshRate: selectedRefreshRate.join(','),
        features: selectedFeatures.join(',')
      });

      const response = await fetch(`http://localhost:4000/api/displays?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch monitors');
      }

      const data = await response.json();
      
      if (data.success) {
        setMonitors(data.displays || []);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.total || 0);
      } else if (Array.isArray(data)) {
        setMonitors(data);
        setTotalPages(Math.ceil(data.length / 12));
        setTotalProducts(data.length);
      } else {
        setMonitors([]);
      }
    } catch (error) {
      console.error('Error fetching monitors:', error);
      setError('Failed to load monitors. Please try again.');
    } finally {
      setLoading(false);
    }
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

  // Toggle compare list
  const toggleCompare = (productId, e) => {
    e.stopPropagation();
    setCompareList(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else if (prev.length < 3) {
        return [...prev, productId];
      } else {
        alert('You can compare up to 3 monitors at a time');
        return prev;
      }
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
    navigate(`/displays/${productId}`);
  };

  // Toggle filter section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle size selection
  const handleSizeChange = (size) => {
    setSelectedSize(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
    setPage(1);
  };

  // Handle resolution selection
  const handleResolutionChange = (resolution) => {
    setSelectedResolution(prev =>
      prev.includes(resolution)
        ? prev.filter(r => r !== resolution)
        : [...prev, resolution]
    );
    setPage(1);
  };

  // Handle panel selection
  const handlePanelChange = (panel) => {
    setSelectedPanel(prev =>
      prev.includes(panel)
        ? prev.filter(p => p !== panel)
        : [...prev, panel]
    );
    setPage(1);
  };

  // Handle refresh rate selection
  const handleRefreshRateChange = (rate) => {
    setSelectedRefreshRate(prev =>
      prev.includes(rate)
        ? prev.filter(r => r !== rate)
        : [...prev, rate]
    );
    setPage(1);
  };

  // Handle feature selection
  const handleFeatureChange = (feature) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
    setPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSearchTerm('');
    setPriceRange({ min: 0, max: 200000 });
    setSelectedSize([]);
    setSelectedResolution([]);
    setSelectedPanel([]);
    setSelectedRefreshRate([]);
    setSelectedFeatures([]);
    setPage(1);
  };

  // Get unique brands from monitors
  const getUniqueBrands = () => {
    const brands = monitors
      .map(m => m.brand)
      .filter((brand, index, self) => brand && self.indexOf(brand) === index);
    return brands.sort();
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get product image
  const getProductImage = (product) => {
    if (product.image) {
      if (Array.isArray(product.image) && product.image.length > 0) {
        const filename = product.image[0].split(/[\\/]/).pop();
        return `http://localhost:4000/uploads/${filename}`;
      } else if (typeof product.image === 'string') {
        const filename = product.image.split(/[\\/]/).pop();
        return `http://localhost:4000/uploads/${filename}`;
      }
    }
    if (product.images && product.images.length > 0) {
      const filename = product.images[0].split(/[\\/]/).pop();
      return `http://localhost:4000/uploads/${filename}`;
    }
    return '/placeholder-image.jpg';
  };

  // Get monitor specs
  const getMonitorSpecs = (product) => {
    const specs = product.specs || {};
    return [
      { label: 'Size', value: specs.size || specs.screenSize || 'N/A', icon: <FaRuler /> },
      { label: 'Resolution', value: specs.resolution || 'N/A', icon: <FaEye /> },
      { label: 'Panel', value: specs.panel || specs.panelType || 'N/A', icon: <FaTv /> },
      { label: 'Refresh Rate', value: specs.refreshRate || 'N/A', icon: <FaClock /> }
    ];
  };

  // Render rating stars
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half" className="text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-600" />);
    }

    return stars;
  };

  // Get panel icon based on type
  const getPanelIcon = (panelType) => {
    const panel = panelType?.toLowerCase() || '';
    if (panel.includes('ips')) return <FaDesktop className="text-blue-400" />;
    if (panel.includes('oled')) return <FaTv className="text-green-400" />;
    if (panel.includes('qled')) return <FaTv className="text-purple-400" />;
    if (panel.includes('va')) return <FaDesktop className="text-orange-400" />;
    return <FaTv className="text-gray-400" />;
  };

  // Get port icon based on port type
  const getPortIcon = (port) => {
    const portLower = port?.toLowerCase() || '';
    if (portLower.includes('usb')) return <FaUsb className="text-blue-400" />;
    if (portLower.includes('hdmi')) return <FaVideo className="text-red-400" />;
    if (portLower.includes('displayport')) return <FaDesktop className="text-purple-400" />;
    if (portLower.includes('thunderbolt')) return <FaBolt className="text-yellow-400" />;
    if (portLower.includes('audio') || portLower.includes('jack')) return <FaPlug className="text-green-400" />;
    if (portLower.includes('ethernet') || portLower.includes('lan')) return <FaNetworkWired className="text-blue-400" />;
    if (portLower.includes('wifi')) return <FaWifi className="text-blue-400" />;
    if (portLower.includes('bluetooth')) return <FaBluetooth className="text-indigo-400" />;
    return <FaPlug className="text-gray-400" />;
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
          <p className="text-white text-lg font-medium mt-4">Loading monitors & displays...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we find the perfect display for you</p>
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
            onClick={fetchMonitors}
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
        <title>Monitors & Displays - Gaming, Professional, 4K Monitors | 7HubComputers</title>
        <meta name="description" content="Discover the perfect monitor for work, gaming, or entertainment. Shop gaming monitors, professional displays, 4K, ultrawide, and more." />
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
            <FaTv className="mr-4 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Monitors & Displays
            </span>
          </h1>
          <p className="text-lg text-gray-400">
            Discover the perfect monitor for work, gaming, or entertainment
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {totalProducts} products found
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
                <span className="font-bold">{compareList.length} monitor(s) selected for comparison</span>
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

        {/* Search and Filter Bar */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search monitors by name, brand, or features..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 pl-10 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              {monitorCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setPage(1);
              }}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Brands</option>
              {getUniqueBrands().map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="popularity">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest First</option>
              <option value="name">Name</option>
              <option value="size-asc">Size: Small to Large</option>
              <option value="size-desc">Size: Large to Small</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition flex items-center gap-2"
            >
              <FaFilter />
              <span>Filters</span>
              {showFilters ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {/* Compare Mode Toggle */}
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-4 py-3 rounded-xl transition flex items-center gap-2 ${
                compareMode
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              <FaTh />
              <span>Compare</span>
              {compareList.length > 0 && (
                <span className="ml-1 bg-white text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* View Toggle */}
            <div className="flex border border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 transition ${viewMode === 'grid' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                title="Grid View"
              >
                <FaTh />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 transition ${viewMode === 'list' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                title="List View"
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="lg:w-80 space-y-4"
              >
                {/* Filter Header */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Filters</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Price Range */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                  <button
                    onClick={() => toggleSection('price')}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-white">Price Range</h3>
                    {expandedSections.price ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                  </button>
                  
                  {expandedSections.price && (
                    <div className="mt-4 space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-xs text-gray-400">Min (₹)</label>
                          <input
                            type="number"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            min="0"
                            step="1000"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-400">Max (₹)</label>
                          <input
                            type="number"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            min="0"
                            step="1000"
                          />
                        </div>
                      </div>
                      
                      <input
                        type="range"
                        min="0"
                        max="200000"
                        step="1000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        className="w-full accent-indigo-500"
                      />
                      
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{formatPrice(0)}</span>
                        <span>{formatPrice(200000)}+</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Screen Size */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                  <button
                    onClick={() => toggleSection('size')}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-white">Screen Size</h3>
                    {expandedSections.size ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                  </button>
                  
                  {expandedSections.size && (
                    <div className="mt-4 space-y-2">
                      {monitorSizes.map(size => (
                        <label key={size} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSize.includes(size)}
                            onChange={() => handleSizeChange(size)}
                            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-300">{size}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resolution */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                  <button
                    onClick={() => toggleSection('resolution')}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-white">Resolution</h3>
                    {expandedSections.resolution ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                  </button>
                  
                  {expandedSections.resolution && (
                    <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                      {resolutions.map(res => (
                        <label key={res} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedResolution.includes(res)}
                            onChange={() => handleResolutionChange(res)}
                            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-300">{res}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Panel Type */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                  <button
                    onClick={() => toggleSection('panel')}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-white">Panel Type</h3>
                    {expandedSections.panel ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                  </button>
                  
                  {expandedSections.panel && (
                    <div className="mt-4 space-y-2">
                      {panelTypes.map(panel => (
                        <label key={panel} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPanel.includes(panel)}
                            onChange={() => handlePanelChange(panel)}
                            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-300 flex items-center gap-1">
                            {getPanelIcon(panel)}
                            {panel}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Refresh Rate */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                  <button
                    onClick={() => toggleSection('refreshRate')}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-white">Refresh Rate</h3>
                    {expandedSections.refreshRate ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                  </button>
                  
                  {expandedSections.refreshRate && (
                    <div className="mt-4 space-y-2">
                      {refreshRates.map(rate => (
                        <label key={rate} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedRefreshRate.includes(rate)}
                            onChange={() => handleRefreshRateChange(rate)}
                            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-300">{rate}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                  <button
                    onClick={() => toggleSection('features')}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-white">Features</h3>
                    {expandedSections.features ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                  </button>
                  
                  {expandedSections.features && (
                    <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                      {monitorFeatures.map(feature => (
                        <label key={feature} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFeatures.includes(feature)}
                            onChange={() => handleFeatureChange(feature)}
                            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {monitors.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700"
              >
                <FaTv className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No Monitors Found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your filters or search term</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <>
                {/* Results Count */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-400">
                    Showing <span className="font-medium text-white">{monitors.length}</span> of{' '}
                    <span className="font-medium text-white">{totalProducts}</span> monitors
                  </p>
                  {(selectedSize.length > 0 || selectedResolution.length > 0 || selectedPanel.length > 0 || selectedRefreshRate.length > 0 || selectedFeatures.length > 0 || priceRange.min > 0 || priceRange.max < 200000) && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <FaTimes size={12} /> Clear Filters
                    </button>
                  )}
                </div>

                {/* Products */}
                <AnimatePresence mode="wait">
                  {viewMode === 'grid' ? (
                    <motion.div
                      key="grid"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                      {monitors.map((product, index) => {
                        const specs = getMonitorSpecs(product);
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
                                src={getProductImage(product)}
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
                                <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                                  {product.category || 'Monitor'}
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
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                                  {product.brand || 'Generic'}
                                </span>
                                {product.rating && (
                                  <div className="flex items-center gap-1">
                                    <div className="flex gap-0.5">
                                      {renderRating(product.rating)}
                                    </div>
                                    <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
                                  </div>
                                )}
                              </div>

                              <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                                {product.name}
                              </h3>

                              {/* Quick Specs */}
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                {specs.slice(0, 4).map((spec, idx) => (
                                  <div key={idx} className="text-xs">
                                    <span className="text-gray-500 flex items-center gap-1">
                                      <span className="text-indigo-400">{spec.icon}</span>
                                      {spec.label}:
                                    </span>
                                    <span className="font-medium text-gray-300">{spec.value}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Features Tags */}
                              {product.features && product.features.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {product.features.slice(0, 3).map((feature, idx) => (
                                    <span key={idx} className="text-[10px] bg-indigo-900/30 text-indigo-400 px-2 py-1 rounded-full">
                                      {feature}
                                    </span>
                                  ))}
                                  {product.features.length > 3 && (
                                    <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
                                      +{product.features.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Ports Preview */}
                              {product.specs?.ports && product.specs.ports.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {product.specs.ports.slice(0, 3).map((port, idx) => (
                                    <span key={idx} className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-full flex items-center gap-1">
                                      {getPortIcon(port)}
                                      {port}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Price and Actions */}
                              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                                <div>
                                  <span className="text-xl font-bold text-indigo-400">
                                    {formatPrice(price)}
                                  </span>
                                  {product.originalPrice > price && (
                                    <span className="text-xs text-gray-500 line-through ml-2 block">
                                      {formatPrice(product.originalPrice)}
                                    </span>
                                  )}
                                </div>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Add to cart logic
                                    console.log('Add to cart:', product);
                                  }}
                                  className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center"
                                >
                                  <FaShoppingCart size={16} />
                                </button>
                              </div>

                              {/* Stock Status */}
                              <div className="mt-2">
                                {product.stock > 0 ? (
                                  <p className="text-xs text-green-400 flex items-center gap-1">
                                    <FaCheck size={10} /> In Stock ({product.stock} available)
                                  </p>
                                ) : (
                                  <p className="text-xs text-red-400 flex items-center gap-1">
                                    <FaTimes size={10} /> Out of Stock
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="list"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {monitors.map((product, index) => {
                        const specs = getMonitorSpecs(product);
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

                            <div className="flex flex-col md:flex-row">
                              {/* Product Image */}
                              <div className="md:w-64 relative">
                                <div className="h-48 md:h-full bg-gray-900 p-4">
                                  <img
                                    src={getProductImage(product)}
                                    alt={product.name}
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/placeholder-image.jpg';
                                    }}
                                  />
                                </div>
                                
                                {/* Badges */}
                                <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
                                  {product.discount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                                      -{product.discount}%
                                    </span>
                                  )}
                                  <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                                    {product.category || 'Monitor'}
                                  </span>
                                </div>
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 p-6">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                                      {product.brand || 'Generic'}
                                    </span>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                      {product.name}
                                    </h3>
                                  </div>
                                  
                                  {product.rating && (
                                    <div className="flex items-center gap-1">
                                      <div className="flex gap-0.5">
                                        {renderRating(product.rating)}
                                      </div>
                                      <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
                                    </div>
                                  )}
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                  {product.description || 'Professional monitor for work and entertainment.'}
                                </p>

                                {/* Specs Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                  {specs.map((spec, idx) => (
                                    <div key={idx}>
                                      <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <span className="text-indigo-400">{spec.icon}</span>
                                        {spec.label}
                                      </p>
                                      <p className="text-sm font-medium text-gray-300">{spec.value}</p>
                                    </div>
                                  ))}
                                </div>

                                {/* Ports */}
                                {product.specs?.ports && product.specs.ports.length > 0 && (
                                  <div className="mb-4">
                                    <p className="text-xs text-gray-500 mb-2">Ports:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {product.specs.ports.map((port, idx) => (
                                        <span key={idx} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full flex items-center gap-1">
                                          {getPortIcon(port)}
                                          {port}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Features */}
                                {product.features && product.features.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {product.features.slice(0, 6).map((feature, idx) => (
                                      <span key={idx} className="text-xs bg-indigo-900/30 text-indigo-400 px-2 py-1 rounded-full">
                                        {feature}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Price and Actions */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                                  <div>
                                    <span className="text-2xl font-bold text-indigo-400">
                                      {formatPrice(price)}
                                    </span>
                                    {product.originalPrice > price && (
                                      <span className="text-xs text-gray-500 line-through ml-2">
                                        {formatPrice(product.originalPrice)}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <button
                                      onClick={(e) => toggleWishlist(product._id, e)}
                                      className="w-10 h-10 bg-gray-800 text-gray-400 rounded-lg hover:bg-red-900/30 hover:text-red-500 transition flex items-center justify-center"
                                    >
                                      <FaHeart className={wishlist.includes(product._id) ? 'text-red-500' : ''} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Add to cart logic
                                        console.log('Add to cart:', product);
                                      }}
                                      disabled={product.stock <= 0}
                                      className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${
                                        product.stock > 0
                                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                                          : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                      }`}
                                    >
                                      <FaShoppingCart size={16} />
                                      <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={`px-4 py-2 border rounded-lg transition ${
                        page === 1
                          ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-800 border-gray-700 text-white hover:border-indigo-500'
                      }`}
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 border rounded-lg transition ${
                          page === i + 1
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent'
                            : 'bg-gray-800 border-gray-700 text-white hover:border-indigo-500'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className={`px-4 py-2 border rounded-lg transition ${
                        page === totalPages
                          ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-800 border-gray-700 text-white hover:border-indigo-500'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Popular Categories */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { name: 'Gaming', icon: <FaGamepad />, color: 'from-purple-600 to-purple-800' },
              { name: 'Professional', icon: <FaDesktop />, color: 'from-blue-600 to-blue-800' },
              { name: 'Ultrawide', icon: <FaArrowsAlt />, color: 'from-green-600 to-green-800' },
              { name: '4K', icon: <FaEye />, color: 'from-red-600 to-red-800' },
              { name: 'Curved', icon: <FaDesktop />, color: 'from-orange-600 to-orange-800' },
              { name: 'Portable', icon: <FaMobileAlt />, color: 'from-yellow-600 to-yellow-800' },
              { name: 'Touchscreen', icon: <FaTv />, color: 'from-indigo-600 to-indigo-800' },
              { name: 'Office', icon: <FaBriefcase />, color: 'from-gray-600 to-gray-800' }
            ].map((cat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-r ${cat.color} rounded-xl p-4 text-white text-center cursor-pointer hover:shadow-xl transition-all`}
                onClick={() => setSelectedCategory(cat.name.toLowerCase())}
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
              <h3 className="text-2xl font-bold mb-4">Monitor Buying Guide</h3>
              <p className="text-white/80 mb-6">
                Find the perfect monitor for your needs. Whether you're a gamer, designer, or professional, we have the right display for you.
              </p>
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition transform hover:scale-105">
                View Buying Guides
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Gaming</h4>
                <p className="text-sm text-white/70">High refresh rates, low response time</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Professional</h4>
                <p className="text-sm text-white/70">Color accuracy, high resolution</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Ultrawide</h4>
                <p className="text-sm text-white/70">Immersive, multitasking</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Portable</h4>
                <p className="text-sm text-white/70">On-the-go productivity</p>
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
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gray-800/95 backdrop-blur-sm p-6 border-b border-gray-700 flex justify-between items-center">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Compare Monitors
                  </h2>
                  <button
                    onClick={() => setShowCompareModal(false)}
                    className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {compareList.map(productId => {
                      const product = monitors.find(m => m._id === productId);
                      if (!product) return null;
                      
                      return (
                        <div key={productId} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="h-32 object-contain mb-4 mx-auto"
                          />
                          <h3 className="font-semibold text-white mb-2 text-center line-clamp-2">{product.name}</h3>
                          
                          <div className="space-y-2 text-sm">
                            <p className="flex justify-between">
                              <span className="text-gray-400">Brand:</span>
                              <span className="text-white">{product.brand || 'Generic'}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Size:</span>
                              <span className="text-white">{product.specs?.size || product.specs?.screenSize || 'N/A'}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Resolution:</span>
                              <span className="text-white">{product.specs?.resolution || 'N/A'}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Panel:</span>
                              <span className="text-white">{product.specs?.panel || product.specs?.panelType || 'N/A'}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Refresh Rate:</span>
                              <span className="text-white">{product.specs?.refreshRate || 'N/A'}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Price:</span>
                              <span className="text-indigo-400 font-bold">{formatPrice(product.finalPrice || product.price)}</span>
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowCompareModal(false);
                              handleProductClick(productId);
                            }}
                            className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition"
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

export default MonitorsDisplays;