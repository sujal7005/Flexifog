// src/pages/Cameras.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FaCamera,
  FaVideo,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaFilter,
  FaSort,
  FaSearch,
  FaTimes,
  FaWifi,
  FaBluetoothB,
  FaBolt,
  FaUsb,
  FaSdCard,
  FaEye,
  FaClock,
  FaBatteryFull,
  FaBatteryHalf,
  FaBatteryQuarter,
  FaRegSun,
  FaMoon,
  FaWater,
  FaTachometerAlt,
  FaRuler,
  FaWeight,
  FaMicrochip,
  FaHdd,
  FaMemory,
  FaCogs,
  FaMapPin,
  FaGlobe,
  FaSatellite,
  FaToolbox,
  FaArrowLeft,
  FaArrowRight,
  FaShieldAlt,
  FaSnowflake,
  FaSun,
  FaCloud,
  FaFilm,
  FaImage
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Cameras = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to safely convert any value to lowercase string
  const safeToLowerCase = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value.toLowerCase();
    if (Array.isArray(value)) return value.map(item => String(item).toLowerCase()).join(' ');
    if (typeof value === 'object') return JSON.stringify(value).toLowerCase();
    return String(value).toLowerCase();
  };
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedResolution, setSelectedResolution] = useState('all');
  const [selectedSensor, setSelectedSensor] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
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

  // Fetch camera products
  useEffect(() => {
    const fetchCameraProducts = async () => {
      try {
        setLoading(true);
        // Fetch from the dedicated cameras endpoint
        const response = await fetch(`${BASE_URL}/api/cameras`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch camera products');
        }
        
        const data = await response.json();
        console.log('Camera API response:', data);
        
        // Handle different response structures
        let cameraProducts = [];
        
        if (data.success && Array.isArray(data.products)) {
          // Response format: { success: true, products: [...] }
          cameraProducts = data.products;
        } else if (Array.isArray(data)) {
          // Response format: direct array
          cameraProducts = data;
        } else if (data.data && Array.isArray(data.data)) {
          // Response format: { data: [...] }
          cameraProducts = data.data;
        }

        console.log('Camera products fetched:', cameraProducts);
        setProducts(cameraProducts);
        setFilteredProducts(cameraProducts);
      } catch (err) {
        console.error('Error fetching camera products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCameraProducts();
  }, []);

  // Extract unique filter options from products
  const filters = React.useMemo(() => {
    const brands = new Set();
    const types = new Set();
    const resolutions = new Set();
    const sensors = new Set();
    const features = new Set();

    products.forEach(product => {
      if (product.brand) brands.add(product.brand);
      
      // Determine camera type based on product name/category
      const name = safeToLowerCase(product.name);
      const category = safeToLowerCase(product.category);
      const description = safeToLowerCase(product.description);
      const specs = product.specs || {};
      
      if (name.includes('dslr') || category.includes('dslr') || description.includes('dslr') || product.type === 'DSLR') {
        types.add('DSLR');
      }
      if (name.includes('mirrorless') || category.includes('mirrorless') || description.includes('mirrorless') || product.type === 'Mirrorless') {
        types.add('Mirrorless');
      }
      if (name.includes('action') || category.includes('action') || description.includes('action') || product.type === 'Action Camera') {
        types.add('Action Camera');
      }
      if (name.includes('webcam') || category.includes('webcam') || description.includes('webcam') || product.type === 'Webcam') {
        types.add('Webcam');
      }
      if (name.includes('point') || name.includes('shoot') || category.includes('compact') || product.type === 'Point & Shoot') {
        types.add('Point & Shoot');
      }
      if (name.includes('security') || category.includes('security') || description.includes('security') || product.type === 'Security Camera') {
        types.add('Security Camera');
      }
      if (name.includes('lens') || category.includes('lens') || product.type === 'Lens') {
        types.add('Lens');
      }

      // Extract resolution
      const resolution = specs.resolution || '';
      if (description.includes('4k') || description.includes('4K') || resolution.includes('4K')) {
        resolutions.add('4K');
        features.add('4K Video');
      }
      if (description.includes('1080p') || description.includes('Full HD') || resolution.includes('1080p')) {
        resolutions.add('1080p');
      }
      if (description.includes('6k') || description.includes('6K') || resolution.includes('6K')) {
        resolutions.add('6K');
      }
      if (description.includes('8k') || description.includes('8K') || resolution.includes('8K')) {
        resolutions.add('8K');
      }

      // Extract sensor type
      const sensor = safeToLowerCase(specs.sensor);
      if (description.includes('cmos') || sensor.includes('cmos')) {
        sensors.add('CMOS');
      }
      if (description.includes('ccd') || sensor.includes('ccd')) {
        sensors.add('CCD');
      }
      if (description.includes('full frame') || sensor.includes('full frame') || specs.sensorType === 'Full Frame') {
        sensors.add('Full Frame');
        features.add('Full Frame');
      }
      if (description.includes('aps-c') || sensor.includes('aps-c') || specs.sensorType === 'APS-C') {
        sensors.add('APS-C');
      }
      if (description.includes('micro four thirds') || sensor.includes('micro four thirds')) {
        sensors.add('Micro Four Thirds');
      }

      // Extract features
      if (description.includes('wifi') || description.includes('wi-fi') || specs.wifi) {
        features.add('WiFi');
      }
      if (description.includes('bluetooth') || specs.bluetooth) {
        features.add('Bluetooth');
      }
      if (description.includes('touch screen') || description.includes('touchscreen') || specs.touchScreen) {
        features.add('Touch Screen');
      }
      if (description.includes('waterproof') || description.includes('water resistant') || specs.waterproof) {
        features.add('Waterproof');
      }
      if (description.includes('image stabilization') || description.includes('image stabilisation') || specs.imageStabilization) {
        features.add('Image Stabilization');
      }
      if (description.includes('time lapse') || description.includes('timelapse') || specs.timeLapse) {
        features.add('Time Lapse');
      }
      if (description.includes('slow motion') || description.includes('slow-mo') || specs.slowMotion) {
        features.add('Slow Motion');
      }
      if (description.includes('live view') || description.includes('liveview') || specs.liveView) {
        features.add('Live View');
      }
      if (description.includes('weather sealed') || description.includes('weather-sealed') || specs.weatherSealed) {
        features.add('Weather Sealed');
      }
      if (description.includes('dual card') || description.includes('dual slot') || specs.dualCardSlots) {
        features.add('Dual Card Slots');
      }
      if (description.includes('built-in flash') || description.includes('built in flash') || specs.builtInFlash) {
        features.add('Built-in Flash');
      }
      if (description.includes('hot shoe') || description.includes('hotshoe') || specs.hotShoe) {
        features.add('Hot Shoe');
      }
    });

    return {
      brands: Array.from(brands).sort(),
      types: Array.from(types).sort(),
      resolutions: Array.from(resolutions).sort(),
      sensors: Array.from(sensors).sort(),
      features: Array.from(features).sort()
    };
  }, [products]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        safeToLowerCase(product.name).includes(searchLower) ||
        safeToLowerCase(product.description).includes(searchLower) ||
        safeToLowerCase(product.brand).includes(searchLower)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        const category = safeToLowerCase(product.category);
        return category.includes(selectedCategory.toLowerCase());
      });
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(product => {
        const name = safeToLowerCase(product.name);
        const category = safeToLowerCase(product.category);
        const description = safeToLowerCase(product.description);
        const productType = product.type || '';
        
        switch(selectedType) {
          case 'DSLR':
            return name.includes('dslr') || category.includes('dslr') || description.includes('dslr') || productType === 'DSLR';
          case 'Mirrorless':
            return name.includes('mirrorless') || category.includes('mirrorless') || description.includes('mirrorless') || productType === 'Mirrorless';
          case 'Action Camera':
            return name.includes('action') || category.includes('action') || description.includes('action') || productType === 'Action Camera';
          case 'Webcam':
            return name.includes('webcam') || category.includes('webcam') || description.includes('webcam') || productType === 'Webcam';
          case 'Point & Shoot':
            return (name.includes('point') && name.includes('shoot')) || category.includes('compact') || productType === 'Point & Shoot';
          case 'Security Camera':
            return name.includes('security') || category.includes('security') || description.includes('security') || productType === 'Security Camera';
          case 'Lens':
            return name.includes('lens') || category.includes('lens') || productType === 'Lens';
          default:
            return true;
        }
      });
    }

    // Apply brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Apply resolution filter
    if (selectedResolution !== 'all') {
      filtered = filtered.filter(product => {
        const description = safeToLowerCase(product.description);
        const specs = product.specs || {};
        const resolution = safeToLowerCase(specs.resolution);
        
        return description.includes(selectedResolution.toLowerCase()) || 
               resolution.includes(selectedResolution.toLowerCase());
      });
    }

    // Apply sensor filter
    if (selectedSensor !== 'all') {
      filtered = filtered.filter(product => {
        const description = safeToLowerCase(product.description);
        const specs = product.specs || {};
        const sensor = safeToLowerCase(specs.sensor);
        
        return description.includes(selectedSensor.toLowerCase()) || 
               sensor.includes(selectedSensor.toLowerCase()) ||
               specs.sensorType === selectedSensor;
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
            case '4K Video':
              return description.includes('4k') || specs.resolution?.includes('4K');
            case 'WiFi':
              return description.includes('wifi') || description.includes('wi-fi') || specs.wifi;
            case 'Bluetooth':
              return description.includes('bluetooth') || specs.bluetooth;
            case 'Touch Screen':
              return description.includes('touch screen') || description.includes('touchscreen') || specs.touchScreen;
            case 'Waterproof':
              return description.includes('waterproof') || description.includes('water resistant') || specs.waterproof;
            case 'Image Stabilization':
              return description.includes('image stabilization') || description.includes('image stabilisation') || specs.imageStabilization;
            case 'Full Frame':
              return description.includes('full frame') || specs.sensor?.toLowerCase().includes('full frame') || specs.sensorType === 'Full Frame';
            default:
              return description.includes(feature.toLowerCase());
          }
        });
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const priceA = a.finalPrice || a.price || 0;
      const priceB = b.finalPrice || b.price || 0;
      const popularityA = a.popularity || 0;
      const popularityB = b.popularity || 0;
      const discountA = a.discount || 0;
      const discountB = b.discount || 0;
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
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
        case 'rating':
          return ratingB - ratingA;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchTerm, selectedCategory, selectedType, selectedBrand, selectedResolution, selectedSensor, priceRange, selectedFeatures, sortBy]);

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
    navigate(`/cameras/${productId}`);
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
    const category = safeToLowerCase(product.category);
    const description = safeToLowerCase(product.description);
    const productType = product.type || '';
    
    if (productType === 'DSLR' || name.includes('dslr') || category.includes('dslr') || description.includes('dslr')) return 'DSLR';
    if (productType === 'Mirrorless' || name.includes('mirrorless') || category.includes('mirrorless') || description.includes('mirrorless')) return 'Mirrorless';
    if (productType === 'Action Camera' || name.includes('action') || category.includes('action') || description.includes('action')) return 'Action';
    if (productType === 'Webcam' || name.includes('webcam') || category.includes('webcam') || description.includes('webcam')) return 'Webcam';
    if (productType === 'Point & Shoot' || (name.includes('point') && name.includes('shoot')) || category.includes('compact')) return 'Point & Shoot';
    if (productType === 'Security Camera' || name.includes('security') || category.includes('security') || description.includes('security')) return 'Security';
    if (productType === 'Lens' || name.includes('lens') || category.includes('lens')) return 'Lens';
    return 'Camera';
  };

  // Get megapixels from specs
  const getMegapixels = (product) => {
    const name = safeToLowerCase(product.name);
    const description = safeToLowerCase(product.description);
    const specs = product.specs || {};
    
    const mpMatch = description.match(/(\d+)\s*mp/i) || name.match(/(\d+)\s*mp/i);
    if (mpMatch) return `${mpMatch[1]}MP`;
    
    if (specs.megapixels) return `${specs.megapixels}MP`;
    if (specs.resolution) return specs.resolution;
    
    return null;
  };

  // Get resolution badge
  const getResolutionBadge = (product) => {
    const description = safeToLowerCase(product.description);
    const specs = product.specs || {};
    
    if (description.includes('8k') || specs.resolution?.includes('8K')) {
      return { text: '8K', color: 'bg-red-900/30 text-red-400' };
    }
    if (description.includes('6k') || specs.resolution?.includes('6K')) {
      return { text: '6K', color: 'bg-orange-900/30 text-orange-400' };
    }
    if (description.includes('4k') || specs.resolution?.includes('4K')) {
      return { text: '4K', color: 'bg-purple-900/30 text-purple-400' };
    }
    if (description.includes('1080p') || specs.resolution?.includes('1080p')) {
      return { text: '1080p', color: 'bg-blue-900/30 text-blue-400' };
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
          <p className="text-white text-lg font-medium mt-4">Loading camera products...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we find the perfect gear for you</p>
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
        <title>Cameras & Photography - DSLR, Mirrorless, Action Cameras | 7HubComputers</title>
        <meta name="description" content="Discover DSLR, mirrorless, action cameras, and professional photography equipment from top brands." />
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
            <FaCamera className="mr-4 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Cameras & Photography
            </span>
          </h1>
          <p className="text-lg text-gray-400">
            Discover DSLR, mirrorless, action cameras, and professional photography equipment
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
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search cameras..."
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
            {/* Camera Types */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <FaCamera className="mr-2 text-indigo-400" />
                Camera Type
              </h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="all"
                    checked={selectedType === 'all'}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-300">All Cameras</span>
                </label>
                {filters.types.map(type => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={selectedType === type}
                      onChange={(e) => setSelectedType(e.target.value)}
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

            {/* Resolution */}
            {filters.resolutions.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <FaEye className="mr-2 text-indigo-400" />
                  Resolution
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="resolution"
                      value="all"
                      checked={selectedResolution === 'all'}
                      onChange={(e) => setSelectedResolution(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">All</span>
                  </label>
                  {filters.resolutions.map(res => (
                    <label key={res} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="resolution"
                        value={res}
                        checked={selectedResolution === res}
                        onChange={(e) => setSelectedResolution(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-300">{res}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Sensor Type */}
            {filters.sensors.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <FaMicrochip className="mr-2 text-indigo-400" />
                  Sensor Type
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sensor"
                      value="all"
                      checked={selectedSensor === 'all'}
                      onChange={(e) => setSelectedSensor(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">All</span>
                  </label>
                  {filters.sensors.map(sensor => (
                    <label key={sensor} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sensor"
                        value={sensor}
                        checked={selectedSensor === sensor}
                        onChange={(e) => setSelectedSensor(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-300">{sensor}</span>
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
                    max="500000"
                    step="5000"
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
                    max="500000"
                    step="5000"
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
                setSelectedResolution('all');
                setSelectedSensor('all');
                setPriceRange({ min: 0, max: 500000 });
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
                    const resolutionBadge = getResolutionBadge(product);
                    
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
                            {resolutionBadge && (
                              <span className={`${resolutionBadge.color} text-xs font-bold px-2 py-1 rounded shadow-lg`}>
                                {resolutionBadge.text}
                              </span>
                            )}
                            <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center">
                              {getProductType(product)}
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
                            {getMegapixels(product) && (
                              <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                                <FaImage className="mr-1 text-indigo-400 text-xs" /> {getMegapixels(product)}
                              </span>
                            )}
                            {product.specs?.sensorType && (
                              <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                                <FaMicrochip className="mr-1 text-indigo-400 text-xs" /> {product.specs.sensorType}
                              </span>
                            )}
                            {product.specs?.imageStabilization && (
                              <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                                <FaTachometerAlt className="mr-1 text-indigo-400 text-xs" /> Stabilized
                              </span>
                            )}
                          </div>

                          {/* Features Tags */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {product.specs?.wifi && (
                              <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded flex items-center">
                                <FaWifi className="mr-1 text-xs" /> WiFi
                              </span>
                            )}
                            {product.specs?.bluetooth && (
                              <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded flex items-center">
                                <FaBluetoothB className="mr-1 text-xs" /> Bluetooth
                              </span>
                            )}
                            {product.specs?.waterproof && (
                              <span className="text-xs bg-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded flex items-center">
                                <FaWater className="mr-1 text-xs" /> Waterproof
                              </span>
                            )}
                            {product.specs?.weatherSealed && (
                              <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded flex items-center">
                                <FaShieldAlt className="mr-1 text-xs" /> Weather Sealed
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
                <div className="text-6xl text-gray-600 mb-4">📷</div>
                <h3 className="text-xl font-medium text-white mb-2">No cameras found</h3>
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
            Shop by Camera Type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'DSLR', icon: <FaCamera />, count: filters.types.filter(t => t === 'DSLR').length || 25, color: 'from-purple-600 to-purple-800' },
              { name: 'Mirrorless', icon: <FaCamera />, count: filters.types.filter(t => t === 'Mirrorless').length || 18, color: 'from-blue-600 to-blue-800' },
              { name: 'Action', icon: <FaVideo />, count: filters.types.filter(t => t === 'Action Camera').length || 22, color: 'from-green-600 to-green-800' },
              { name: 'Webcam', icon: <FaEye />, count: filters.types.filter(t => t === 'Webcam').length || 15, color: 'from-red-600 to-red-800' },
              { name: 'Point & Shoot', icon: <FaCamera />, count: filters.types.filter(t => t === 'Point & Shoot').length || 28, color: 'from-yellow-600 to-yellow-800' },
              { name: 'Lens', icon: <FaCogs />, count: filters.types.filter(t => t === 'Lens').length || 35, color: 'from-indigo-600 to-indigo-800' }
            ].map((cat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-r ${cat.color} rounded-xl p-4 text-white text-center cursor-pointer hover:shadow-xl transition-all`}
                onClick={() => setSelectedType(cat.name === 'Action' ? 'Action Camera' : cat.name)}
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="font-bold text-sm">{cat.name}</h3>
                <p className="text-xs text-white/80">{cat.count} products</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Photography Tips */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Photography Tips & Guides</h3>
              <p className="text-white/80 mb-6">
                Whether you're a beginner or a professional, find the perfect camera for your needs. 
                Check out our buying guides and photography tips.
              </p>
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition transform hover:scale-105">
                View Buying Guides
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">DSLR vs Mirrorless</h4>
                <p className="text-sm text-white/70">Learn the differences</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Lens Guide</h4>
                <p className="text-sm text-white/70">Choose the right lens</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Budget Cameras</h4>
                <p className="text-sm text-white/70">Best cameras under ₹50,000</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Pro Equipment</h4>
                <p className="text-sm text-white/70">Professional gear</p>
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
                    Compare Cameras
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
                              navigate(`/cameras/${productId}`);
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

export default Cameras;