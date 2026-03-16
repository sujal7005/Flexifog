// src/pages/Accessories.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FaKeyboard,
  FaMouse,
  FaHeadphones,
  FaMicrophone,
  FaCamera,
  FaGamepad,
  FaUsb,
  FaPlug,
  FaBolt,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaBoxOpen,
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaDesktop,
  FaLaptop,
  FaTv,
  FaWifi,
  FaBluetooth,
  FaBatteryFull,
  FaBatteryHalf,
  FaBatteryQuarter,
  FaBatteryEmpty,
  FaTools,
  FaCogs,
  FaPalette,
  FaRuler,
  FaWeight,
  FaTachometerAlt,
  FaVolumeUp,
  FaVolumeDown,
  FaVolumeMute,
  FaRedo,
  FaUndo,
  FaSync,
  FaDownload,
  FaUpload,
  FaSave,
  FaPrint,
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaCloud,
  FaCloudUploadAlt,
  FaCloudDownloadAlt,
  FaCloudMoon,
  FaCloudSun,
  FaSun,
  FaMoon,
  FaStar as FaStarOutline,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaTh,
  FaList
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Accessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedConnectivity, setSelectedConnectivity] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subcategory: true,
    brand: true,
    price: true,
    connectivity: true,
    features: true
  });
  const [wishlist, setWishlist] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  
  const navigate = useNavigate();

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

  // Accessory categories with icons
  const accessoryCategories = [
    { id: 'all', name: 'All Accessories', icon: <FaBoxOpen /> },
    { id: 'input-devices', name: 'Input Devices', icon: <FaKeyboard /> },
    { id: 'audio', name: 'Audio', icon: <FaHeadphones /> },
    { id: 'storage', name: 'Storage', icon: <FaHdd /> },
    { id: 'networking', name: 'Networking', icon: <FaWifi /> },
    { id: 'cables', name: 'Cables & Adapters', icon: <FaPlug /> },
    { id: 'cooling', name: 'Cooling', icon: <FaBolt /> },
    { id: 'power', name: 'Power', icon: <FaBolt /> },
    { id: 'gaming', name: 'Gaming', icon: <FaGamepad /> },
    { id: 'other', name: 'Other', icon: <FaTools /> }
  ];

  // Subcategories based on main category
  const getSubcategories = () => {
    switch(selectedCategory) {
      case 'input-devices':
        return [
          { id: 'all', name: 'All Input Devices' },
          { id: 'keyboards', name: 'Keyboards' },
          { id: 'mice', name: 'Mice' },
          { id: 'mouse-pads', name: 'Mouse Pads' },
          { id: 'stylus', name: 'Stylus Pens' },
          { id: 'graphic-tablets', name: 'Graphic Tablets' },
          { id: 'scanners', name: 'Scanners' },
          { id: 'barcode-scanners', name: 'Barcode Scanners' },
          { id: 'biometric', name: 'Biometric Devices' }
        ];
      case 'audio':
        return [
          { id: 'all', name: 'All Audio' },
          { id: 'headphones', name: 'Headphones' },
          { id: 'earbuds', name: 'Earbuds' },
          { id: 'speakers', name: 'Speakers' },
          { id: 'microphones', name: 'Microphones' },
          { id: 'soundbars', name: 'Soundbars' },
          { id: 'amplifiers', name: 'Amplifiers' },
          { id: 'dac', name: 'DACs' },
          { id: 'studio-monitors', name: 'Studio Monitors' }
        ];
      case 'storage':
        return [
          { id: 'all', name: 'All Storage' },
          { id: 'external-ssd', name: 'External SSDs' },
          { id: 'external-hdd', name: 'External HDDs' },
          { id: 'usb-drives', name: 'USB Drives' },
          { id: 'memory-cards', name: 'Memory Cards' },
          { id: 'card-readers', name: 'Card Readers' },
          { id: 'nas', name: 'NAS Devices' },
          { id: 'docking-stations', name: 'Docking Stations' }
        ];
      case 'networking':
        return [
          { id: 'all', name: 'All Networking' },
          { id: 'routers', name: 'Routers' },
          { id: 'switches', name: 'Switches' },
          { id: 'modems', name: 'Modems' },
          { id: 'access-points', name: 'Access Points' },
          { id: 'network-cards', name: 'Network Cards' },
          { id: 'cables', name: 'Network Cables' },
          { id: 'adapters', name: 'Network Adapters' },
          { id: 'range-extenders', name: 'Range Extenders' }
        ];
      case 'cables':
        return [
          { id: 'all', name: 'All Cables' },
          { id: 'usb-cables', name: 'USB Cables' },
          { id: 'hdmi-cables', name: 'HDMI Cables' },
          { id: 'displayport-cables', name: 'DisplayPort Cables' },
          { id: 'audio-cables', name: 'Audio Cables' },
          { id: 'power-cables', name: 'Power Cables' },
          { id: 'adapters', name: 'Adapters' },
          { id: 'converters', name: 'Converters' },
          { id: 'splitters', name: 'Splitters' }
        ];
      case 'cooling':
        return [
          { id: 'all', name: 'All Cooling' },
          { id: 'case-fans', name: 'Case Fans' },
          { id: 'cpu-coolers', name: 'CPU Coolers' },
          { id: 'liquid-cooling', name: 'Liquid Cooling' },
          { id: 'thermal-paste', name: 'Thermal Paste' },
          { id: 'fan-controllers', name: 'Fan Controllers' }
        ];
      case 'power':
        return [
          { id: 'all', name: 'All Power' },
          { id: 'ups', name: 'UPS' },
          { id: 'power-strips', name: 'Power Strips' },
          { id: 'surge-protectors', name: 'Surge Protectors' },
          { id: 'power-adapters', name: 'Power Adapters' },
          { id: 'batteries', name: 'Batteries' },
          { id: 'chargers', name: 'Chargers' }
        ];
      case 'gaming':
        return [
          { id: 'all', name: 'All Gaming' },
          { id: 'gaming-keyboards', name: 'Gaming Keyboards' },
          { id: 'gaming-mice', name: 'Gaming Mice' },
          { id: 'gaming-headsets', name: 'Gaming Headsets' },
          { id: 'gaming-controllers', name: 'Gaming Controllers' },
          { id: 'gaming-chairs', name: 'Gaming Chairs' },
          { id: 'mouse-pads', name: 'Gaming Mouse Pads' },
          { id: 'streaming-gear', name: 'Streaming Gear' }
        ];
      default:
        return [{ id: 'all', name: 'All Accessories' }];
    }
  };

  // Fetch accessories from backend
  useEffect(() => {
    fetchAccessories();
  }, [page, sortBy, selectedCategory, selectedSubcategory, searchTerm, priceRange.min, priceRange.max, selectedBrands, selectedConnectivity, selectedFeatures]);

  const fetchAccessories = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page,
        limit: 12,
        sort: sortBy,
        category: selectedCategory !== 'all' ? selectedCategory : '',
        subcategory: selectedSubcategory !== 'all' ? selectedSubcategory : '',
        search: searchTerm,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        brands: selectedBrands.join(','),
        connectivity: selectedConnectivity.join(','),
        features: selectedFeatures.join(',')
      });

      const response = await fetch(`http://localhost:4000/api/accessories?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch accessories');
      }

      const data = await response.json();
      
      if (data.success) {
        setAccessories(data.accessories || []);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.total || 0);
      } else if (Array.isArray(data)) {
        setAccessories(data);
        setTotalPages(Math.ceil(data.length / 12));
        setTotalProducts(data.length);
      } else {
        setAccessories([]);
      }
    } catch (error) {
      console.error('Error fetching accessories:', error);
      setError('Failed to load accessories. Please try again.');
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

  // Toggle compare
  const toggleCompare = (productId, e) => {
    e.stopPropagation();
    setCompareList(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else if (prev.length < 3) {
        return [...prev, productId];
      } else {
        alert('You can compare up to 3 accessories at a time');
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
    navigate(`/accessories/${productId}`);
  };

  // Toggle filter section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle brand selection
  const handleBrandChange = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
    setPage(1);
  };

  // Handle connectivity selection
  const handleConnectivityChange = (connectivity) => {
    setSelectedConnectivity(prev =>
      prev.includes(connectivity)
        ? prev.filter(c => c !== connectivity)
        : [...prev, connectivity]
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
    setSelectedSubcategory('all');
    setSearchTerm('');
    setPriceRange({ min: 0, max: 100000 });
    setSelectedBrands([]);
    setSelectedConnectivity([]);
    setSelectedFeatures([]);
    setPage(1);
  };

  // Get unique brands from accessories
  const getUniqueBrands = () => {
    const brands = accessories
      .map(a => a.brand)
      .filter((brand, index, self) => brand && self.indexOf(brand) === index);
    return brands.sort();
  };

  // Get unique connectivity options
  const getUniqueConnectivity = () => {
    const connectivityOptions = [
      'Wired',
      'Wireless',
      'Bluetooth',
      'USB-C',
      'USB-A',
      'HDMI',
      'DisplayPort',
      'Thunderbolt',
      'WiFi',
      'RF',
      'Optical'
    ];
    return connectivityOptions;
  };

  // Get unique features
  const getUniqueFeatures = () => {
    const features = accessories
      .flatMap(a => a.features || [])
      .filter((feature, index, self) => feature && self.indexOf(feature) === index);
    return features.length > 0 ? features : [
      'RGB Lighting',
      'Mechanical',
      'Mechanical Switches',
      'Programmable',
      'Ergonomic',
      'Portable',
      'Waterproof',
      'Dustproof',
      'Noise Cancelling',
      'Surround Sound',
      'Hot Swappable',
      'Wireless Charging'
    ];
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
    return '/placeholder-image.jpg';
  };

  // Get product URL
  const getProductUrl = (product) => {
    return `/accessories/${product._id}`;
  };

  // Get icon based on accessory type
  const getAccessoryIcon = (product) => {
    const category = product.category?.toLowerCase() || '';
    const name = product.name?.toLowerCase() || '';
    
    if (category.includes('keyboard') || name.includes('keyboard')) return <FaKeyboard className="text-indigo-400" />;
    if (category.includes('mouse') || name.includes('mouse')) return <FaMouse className="text-indigo-400" />;
    if (category.includes('headphone') || name.includes('headphone')) return <FaHeadphones className="text-indigo-400" />;
    if (category.includes('microphone') || name.includes('microphone')) return <FaMicrophone className="text-indigo-400" />;
    if (category.includes('camera') || name.includes('camera')) return <FaCamera className="text-indigo-400" />;
    if (category.includes('game') || name.includes('game')) return <FaGamepad className="text-indigo-400" />;
    if (category.includes('usb') || name.includes('usb')) return <FaUsb className="text-indigo-400" />;
    if (category.includes('cable') || name.includes('cable')) return <FaPlug className="text-indigo-400" />;
    if (category.includes('storage') || name.includes('ssd') || name.includes('hdd')) return <FaHdd className="text-indigo-400" />;
    if (category.includes('network') || name.includes('router') || name.includes('wifi')) return <FaWifi className="text-indigo-400" />;
    return <FaBoxOpen className="text-indigo-400" />;
  };

  // Get product specs
  const getProductSpecs = (product) => {
    const specs = product.specs || {};
    return [
      { label: 'Brand', value: product.brand || 'Generic' },
      { label: 'Connectivity', value: specs.connectivity || specs.connection || 'Wired' },
      { label: 'Compatibility', value: specs.compatibility || 'Windows/Mac' },
      { label: 'Warranty', value: specs.warranty || '1 Year' }
    ];
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
          <p className="text-white text-lg font-medium mt-4">Loading accessories...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we find the perfect accessories for you</p>
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
            onClick={fetchAccessories}
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
        <title>Computer Accessories - Keyboards, Mice, Headphones & More | 7HubComputers</title>
        <meta name="description" content="Enhance your setup with our wide range of high-quality computer accessories including keyboards, mice, headphones, storage devices, and more." />
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
            <FaBoxOpen className="mr-4 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Computer Accessories
            </span>
          </h1>
          <p className="text-lg text-gray-400">
            Enhance your setup with our wide range of high-quality accessories
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
                <span className="font-bold">{compareList.length} accessory(s) selected for comparison</span>
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
                placeholder="Search accessories..."
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
                setSelectedSubcategory('all');
                setPage(1);
              }}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              {accessoryCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Subcategory Filter */}
            {selectedCategory !== 'all' && (
              <select
                value={selectedSubcategory}
                onChange={(e) => {
                  setSelectedSubcategory(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                {getSubcategories().map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            )}

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
                            step="100"
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
                            step="100"
                          />
                        </div>
                      </div>
                      
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        className="w-full accent-indigo-500"
                      />
                      
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{formatPrice(0)}</span>
                        <span>{formatPrice(100000)}+</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Brands */}
                {getUniqueBrands().length > 0 && (
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                    <button
                      onClick={() => toggleSection('brand')}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <h3 className="font-semibold text-white">Brands</h3>
                      {expandedSections.brand ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                    </button>
                    
                    {expandedSections.brand && (
                      <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                        {getUniqueBrands().map(brand => (
                          <label key={brand} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={() => handleBrandChange(brand)}
                              className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-300">{brand}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Connectivity */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                  <button
                    onClick={() => toggleSection('connectivity')}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-white">Connectivity</h3>
                    {expandedSections.connectivity ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                  </button>
                  
                  {expandedSections.connectivity && (
                    <div className="mt-4 space-y-2">
                      {getUniqueConnectivity().map(conn => (
                        <label key={conn} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedConnectivity.includes(conn)}
                            onChange={() => handleConnectivityChange(conn)}
                            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-300">{conn}</span>
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
                      {getUniqueFeatures().map(feature => (
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
            {accessories.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700"
              >
                <FaBoxOpen className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No Accessories Found</h3>
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
                    Showing <span className="font-medium text-white">{accessories.length}</span> of{' '}
                    <span className="font-medium text-white">{totalProducts}</span> accessories
                  </p>
                  {(selectedBrands.length > 0 || selectedConnectivity.length > 0 || selectedFeatures.length > 0 || priceRange.min > 0 || priceRange.max < 100000) && (
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
                      {accessories.map((product, index) => {
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
                                <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                                  {getAccessoryIcon(product)}
                                  <span>{product.category || 'Accessory'}</span>
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
                                  <div className="flex items-center gap-1 text-amber-400">
                                    <FaStar size={12} />
                                    <span className="text-xs font-medium">{product.rating}</span>
                                  </div>
                                )}
                              </div>

                              <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                                {product.name}
                              </h3>

                              {/* Quick Specs */}
                              <div className="flex flex-wrap gap-1 mb-3">
                                {product.specs?.connectivity && (
                                  <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
                                    {product.specs.connectivity}
                                  </span>
                                )}
                                {product.specs?.color && (
                                  <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-full flex items-center gap-1">
                                    <FaPalette size={8} /> {product.specs.color}
                                  </span>
                                )}
                                {product.specs?.weight && (
                                  <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-full flex items-center gap-1">
                                    <FaWeight size={8} /> {product.specs.weight}
                                  </span>
                                )}
                              </div>

                              {/* Features */}
                              {product.features && product.features.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {product.features.slice(0, 2).map((feature, idx) => (
                                    <span key={idx} className="text-[10px] bg-indigo-900/30 text-indigo-400 px-2 py-1 rounded-full">
                                      {feature}
                                    </span>
                                  ))}
                                  {product.features.length > 2 && (
                                    <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
                                      +{product.features.length - 2}
                                    </span>
                                  )}
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
                      {accessories.map((product, index) => {
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
                              <div className="md:w-48 relative">
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
                                  <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                                    {getAccessoryIcon(product)}
                                    <span>{product.category || 'Accessory'}</span>
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
                                    <div className="flex items-center gap-1 text-amber-400">
                                      <FaStar size={14} />
                                      <span className="text-sm font-medium">{product.rating}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                  {product.description || 'High-quality accessory for your setup.'}
                                </p>

                                {/* Specs Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                  {getProductSpecs(product).map((spec, idx) => (
                                    <div key={idx}>
                                      <p className="text-xs text-gray-500">{spec.label}</p>
                                      <p className="text-sm font-medium text-gray-300">{spec.value}</p>
                                    </div>
                                  ))}
                                </div>

                                {/* Features */}
                                {product.features && product.features.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {product.features.slice(0, 4).map((feature, idx) => (
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {accessoryCategories.slice(1).map((cat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-white text-center cursor-pointer hover:shadow-xl transition-all"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setShowFilters(true);
                }}
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
              <h3 className="text-2xl font-bold mb-4">Accessories Buying Guide</h3>
              <p className="text-white/80 mb-6">
                Enhance your computing experience with the right accessories. From mechanical keyboards to high-precision mice, find everything you need.
              </p>
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition transform hover:scale-105">
                View Buying Guides
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Mechanical Keyboards</h4>
                <p className="text-sm text-white/70">Find your perfect switch</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Gaming Mice</h4>
                <p className="text-sm text-white/70">DPI, sensors, and ergonomics</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Headphones</h4>
                <p className="text-sm text-white/70">Wired vs wireless</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Storage</h4>
                <p className="text-sm text-white/70">SSD, HDD, or external</p>
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
                    Compare Accessories
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
                      const product = accessories.find(a => a._id === productId);
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
                              <span className="text-gray-400">Connectivity:</span>
                              <span className="text-white">{product.specs?.connectivity || 'Wired'}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Compatibility:</span>
                              <span className="text-white">{product.specs?.compatibility || 'Windows/Mac'}</span>
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

export default Accessories;