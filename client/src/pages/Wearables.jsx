// src/pages/Wearables.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FaClock,
  FaHeartbeat,
  FaRunning,
  FaBicycle,
  FaApple,
  FaAndroid,
  FaGoogle,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaFilter,
  FaSort,
  FaSearch,
  FaTimes,
  FaBluetoothB,
  FaWifi,
  FaExchangeAlt, // Replaced FaNfc with FaExchangeAlt
  FaBatteryFull,
  FaBatteryHalf,
  FaBatteryQuarter,
  FaBatteryEmpty,
  FaTachometerAlt,
  FaWater,
  FaThermometerHalf,
  FaSun,
  FaMoon,
  FaBell,
  FaMobileAlt,
  FaMusic,
  FaCamera,
  FaMicrophone,
  FaMapMarkerAlt,
  FaCompass,
  FaStopwatch,
  FaChartLine,
  FaWeight,
  FaRuler,
  FaFire,
  FaBed,
  FaUtensils,
  FaDumbbell,
  FaSwimmer,
  FaWalking,
  FaUser,
  FaUsers,
  FaWineBottle,
  FaCoffee,
  FaApple as FaAppleLogo,
  FaGooglePlay,
  FaAmazon,
  FaGripfire, // Replaced FaGarmin with FaGripfire
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaTh,
  FaList,
  FaUserCircle,
  FaGamepad,
  FaVolumeUp,
  FaVolumeMute,
  FaChevronDown,
  FaChevronUp,
  FaMobile, // Alternative for Samsung
  FaTablet, // Alternative for Samsung
  FaTv // Alternative for Samsung
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Create a custom Fitbit icon component since it's not in react-icons/fa
const FaFitbit = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7.5 12.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4.5 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4.5 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
  </svg>
);

// Create a custom Samsung icon component
const FaSamsung = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M8 8h8v8H8z" />
  </svg>
);

const FaXiaomi = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M8 8h2v2H8zM14 8h2v2h-2zM8 14h2v2H8zM14 14h2v2h-2z" />
  </svg>
);

const Wearables = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
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

  // Helper function for safe string conversion
  const safeToLowerCase = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value.toLowerCase();
    if (Array.isArray(value)) return value.map(item => String(item).toLowerCase()).join(' ');
    if (typeof value === 'object') return JSON.stringify(value).toLowerCase();
    return String(value).toLowerCase();
  };

  // Fetch wearable products
  useEffect(() => {
    const fetchWearableProducts = async () => {
      try {
        setLoading(true);
        // First try to fetch from dedicated wearables endpoint
        let response = await fetch(`${BASE_URL}/api/wearables`);
        
        if (!response.ok) {
          // Fallback to fetching from admin products and filtering
          response = await fetch(`${BASE_URL}/api/admin/products?limit=100`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          
          const data = await response.json();
          
          // Combine all product types and filter for wearable products
          const allProducts = [
            ...(data.prebuildPC || []),
            ...(data.officePC || []),
            ...(data.refurbishedProducts || []),
            ...(data.miniPCs || [])
          ];

          // Filter products that are wearable-related (based on category, name, or type)
          const wearableProducts = allProducts.filter(product => {
            const category = safeToLowerCase(product.category);
            const name = safeToLowerCase(product.name);
            const type = safeToLowerCase(product.type);
            const description = safeToLowerCase(product.description);
            
            return (
              category.includes('wearable') ||
              category.includes('watch') ||
              category.includes('fitness') ||
              category.includes('tracker') ||
              category.includes('band') ||
              category.includes('smartwatch') ||
              category.includes('activity') ||
              category.includes('health') ||
              name.includes('watch') ||
              name.includes('fitness') ||
              name.includes('tracker') ||
              name.includes('band') ||
              name.includes('wearable') ||
              name.includes('smartwatch') ||
              description.includes('wearable') ||
              description.includes('fitness tracker') ||
              description.includes('smartwatch')
            );
          });

          console.log('Wearable products fetched:', wearableProducts);
          setProducts(wearableProducts);
          setFilteredProducts(wearableProducts);
        } else {
          const data = await response.json();
          
          if (data.success && Array.isArray(data.products)) {
            setProducts(data.products);
            setFilteredProducts(data.products);
          } else if (Array.isArray(data)) {
            setProducts(data);
            setFilteredProducts(data);
          } else {
            setProducts([]);
            setFilteredProducts([]);
          }
        }
      } catch (err) {
        console.error('Error fetching wearable products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWearableProducts();
  }, []);

  // Extract unique filter options from products
  const filters = React.useMemo(() => {
    const brands = new Set();
    const types = new Set();
    const features = new Set();

    products.forEach(product => {
      if (product.brand) brands.add(product.brand);
      
      // Determine wearable type
      const name = safeToLowerCase(product.name);
      const category = safeToLowerCase(product.category);
      const description = safeToLowerCase(product.description);
      
      if (name.includes('smartwatch') || description.includes('smartwatch')) {
        types.add('Smartwatch');
      }
      if (name.includes('fitness') || name.includes('tracker') || description.includes('fitness tracker')) {
        types.add('Fitness Tracker');
      }
      if (name.includes('band') || category.includes('band')) {
        types.add('Activity Band');
      }
      if (name.includes('hybrid') || description.includes('hybrid')) {
        types.add('Hybrid Watch');
      }
      if (name.includes('gps') || description.includes('gps')) {
        types.add('GPS Watch');
      }
      if (name.includes('sports') || description.includes('sports')) {
        types.add('Sports Watch');
      }

      // Extract features from specs and description
      const specs = product.specs || {};
      
      if (specs.heartRateMonitor || description.includes('heart rate')) {
        features.add('Heart Rate Monitor');
      }
      if (specs.gps || description.includes('gps')) {
        features.add('GPS');
      }
      if (specs.waterResistant || description.includes('water resistant') || description.includes('swim')) {
        features.add('Water Resistant');
      }
      if (specs.sleepTracking || description.includes('sleep')) {
        features.add('Sleep Tracking');
      }
      if (specs.stepCounter || description.includes('step')) {
        features.add('Step Counter');
      }
      if (specs.calorieTracking || description.includes('calorie')) {
        features.add('Calorie Tracking');
      }
      if (specs.bloodOxygen || description.includes('spo2') || description.includes('blood oxygen')) {
        features.add('Blood Oxygen (SpO2)');
      }
      if (specs.ecg || description.includes('ecg') || description.includes('electrocardiogram')) {
        features.add('ECG');
      }
      if (specs.stressTracking || description.includes('stress')) {
        features.add('Stress Tracking');
      }
      if (specs.voiceAssistant || description.includes('voice assistant')) {
        features.add('Voice Assistant');
      }
      if (specs.musicControl || description.includes('music')) {
        features.add('Music Control');
      }
      if (specs.nfc || description.includes('nfc') || description.includes('contactless')) {
        features.add('NFC Payments');
      }
      if (specs.bluetoothCalls || description.includes('calls')) {
        features.add('Bluetooth Calls');
      }
      if (specs.alwaysOnDisplay || description.includes('always on')) {
        features.add('Always-On Display');
      }
      if (specs.batteryLife) {
        const batteryMatch = String(specs.batteryLife).match(/(\d+)/);
        if (batteryMatch) {
          const days = parseInt(batteryMatch[1]);
          if (days < 2) features.add('Battery: <2 days');
          else if (days < 5) features.add('Battery: 2-5 days');
          else if (days < 10) features.add('Battery: 5-10 days');
          else features.add('Battery: 10+ days');
        }
      }
    });

    return {
      brands: Array.from(brands).sort(),
      types: Array.from(types).sort(),
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
        const category = safeToLowerCase(product.category);
        return category.includes(safeToLowerCase(selectedCategory));
      });
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(product => {
        const name = safeToLowerCase(product.name);
        const description = safeToLowerCase(product.description);
        
        switch(selectedType) {
          case 'Smartwatch':
            return name.includes('smartwatch') || description.includes('smartwatch');
          case 'Fitness Tracker':
            return name.includes('fitness') || name.includes('tracker') || description.includes('fitness tracker');
          case 'Activity Band':
            return name.includes('band') || description.includes('activity band');
          case 'Hybrid Watch':
            return name.includes('hybrid') || description.includes('hybrid');
          case 'GPS Watch':
            return name.includes('gps') || description.includes('gps watch');
          case 'Sports Watch':
            return name.includes('sports') || description.includes('sports watch');
          default:
            return true;
        }
      });
    }

    // Apply brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
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
          if (feature.includes('Battery:')) {
            const batteryRange = feature.replace('Battery:', '').trim();
            const batteryMatch = String(specs.batteryLife || '').match(/(\d+)/);
            if (!batteryMatch) return false;
            
            const days = parseInt(batteryMatch[1]);
            if (batteryRange === '<2 days') return days < 2;
            if (batteryRange === '2-5 days') return days >= 2 && days < 5;
            if (batteryRange === '5-10 days') return days >= 5 && days < 10;
            if (batteryRange === '10+ days') return days >= 10;
            return true;
          }
          
          switch(feature) {
            case 'Heart Rate Monitor':
              return specs.heartRateMonitor || description.includes('heart rate');
            case 'GPS':
              return specs.gps || description.includes('gps');
            case 'Water Resistant':
              return specs.waterResistant || description.includes('water resistant') || description.includes('swim');
            case 'Sleep Tracking':
              return specs.sleepTracking || description.includes('sleep');
            case 'Step Counter':
              return specs.stepCounter || description.includes('step');
            case 'Calorie Tracking':
              return specs.calorieTracking || description.includes('calorie');
            case 'Blood Oxygen (SpO2)':
              return specs.bloodOxygen || description.includes('spo2') || description.includes('blood oxygen');
            case 'ECG':
              return specs.ecg || description.includes('ecg') || description.includes('electrocardiogram');
            case 'Stress Tracking':
              return specs.stressTracking || description.includes('stress');
            case 'Voice Assistant':
              return specs.voiceAssistant || description.includes('voice assistant');
            case 'Music Control':
              return specs.musicControl || description.includes('music');
            case 'NFC Payments':
              return specs.nfc || description.includes('nfc') || description.includes('contactless');
            case 'Bluetooth Calls':
              return specs.bluetoothCalls || description.includes('calls');
            case 'Always-On Display':
              return specs.alwaysOnDisplay || description.includes('always on');
            default:
              return description.includes(safeToLowerCase(feature));
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
  }, [products, searchTerm, selectedCategory, selectedType, selectedBrand, priceRange, selectedFeatures, sortBy]);

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
    navigate(`/wearables/${productId}`);
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

  // Get product type icon and color
  const getProductTypeInfo = (product) => {
    const name = safeToLowerCase(product.name);
    const description = safeToLowerCase(product.description);
    
    if (name.includes('smartwatch') || description.includes('smartwatch')) {
      return { 
        type: 'Smartwatch', 
        icon: <FaClock className="text-blue-400" />,
        color: 'bg-blue-900/30 text-blue-400'
      };
    }
    if (name.includes('fitness') || name.includes('tracker') || description.includes('fitness tracker')) {
      return { 
        type: 'Fitness Tracker', 
        icon: <FaHeartbeat className="text-green-400" />,
        color: 'bg-green-900/30 text-green-400'
      };
    }
    if (name.includes('band') || description.includes('activity band')) {
      return { 
        type: 'Activity Band', 
        icon: <FaRunning className="text-purple-400" />,
        color: 'bg-purple-900/30 text-purple-400'
      };
    }
    if (name.includes('hybrid') || description.includes('hybrid')) {
      return { 
        type: 'Hybrid Watch', 
        icon: <FaClock className="text-orange-400" />,
        color: 'bg-orange-900/30 text-orange-400'
      };
    }
    if (name.includes('gps') || description.includes('gps watch')) {
      return { 
        type: 'GPS Watch', 
        icon: <FaMapMarkerAlt className="text-red-400" />,
        color: 'bg-red-900/30 text-red-400'
      };
    }
    if (name.includes('sports') || description.includes('sports watch')) {
      return { 
        type: 'Sports Watch', 
        icon: <FaDumbbell className="text-yellow-400" />,
        color: 'bg-yellow-900/30 text-yellow-400'
      };
    }
    return { 
      type: 'Wearable', 
      icon: <FaClock className="text-gray-400" />,
      color: 'bg-gray-900/30 text-gray-400'
    };
  };

  // Get battery icon based on battery life
  const getBatteryIcon = (batteryLife) => {
    if (!batteryLife) return null;
    
    const batteryMatch = String(batteryLife).match(/(\d+)/);
    if (!batteryMatch) return null;
    
    const days = parseInt(batteryMatch[1]);
    
    if (days < 2) return <FaBatteryEmpty className="text-red-400" title="<2 days battery" />;
    if (days < 5) return <FaBatteryQuarter className="text-orange-400" title="2-5 days battery" />;
    if (days < 10) return <FaBatteryHalf className="text-yellow-400" title="5-10 days battery" />;
    return <FaBatteryFull className="text-green-400" title="10+ days battery" />;
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
          <p className="text-white text-lg font-medium mt-4">Loading wearable products...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we find the perfect fitness companion for you</p>
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
        <title>Wearables - Smartwatches, Fitness Trackers & Health Monitors | 7HubComputers</title>
        <meta name="description" content="Discover smartwatches, fitness trackers, and health monitoring devices from top brands. Track your health and fitness goals with our premium wearables." />
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
            <FaClock className="mr-4 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Wearables
            </span>
          </h1>
          <p className="text-lg text-gray-400">
            Discover smartwatches, fitness trackers, and health monitoring devices
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
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search smartwatches, fitness trackers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Types</option>
              {filters.types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Brands</option>
              {filters.brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
              <option value="discount">Best Discount</option>
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
                      onClick={() => {
                        setSelectedType('all');
                        setSelectedBrand('all');
                        setPriceRange({ min: 0, max: 100000 });
                        setSelectedFeatures([]);
                      }}
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Price Range */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                  <h3 className="font-semibold text-white mb-4">Price Range</h3>
                  <div className="space-y-4">
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
                </div>

                {/* Features */}
                {filters.features.length > 0 && (
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-4">Features</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {filters.features.map(feature => (
                        <label key={feature} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFeatures.includes(feature)}
                            onChange={() => toggleFeature(feature)}
                            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

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
                    const typeInfo = getProductTypeInfo(product);
                    const batteryIcon = getBatteryIcon(product.specs?.batteryLife);
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
                            <span className={`${typeInfo.color} text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1`}>
                              {typeInfo.icon} {typeInfo.type}
                            </span>
                          </div>

                          {/* Battery Icon */}
                          <div className="absolute bottom-3 left-3 z-10">
                            {batteryIcon}
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
                          
                          {/* Key Features Tags */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {product.specs?.heartRateMonitor && (
                              <span className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded flex items-center gap-1">
                                <FaHeartbeat /> HR
                              </span>
                            )}
                            {product.specs?.gps && (
                              <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded flex items-center gap-1">
                                <FaMapMarkerAlt /> GPS
                              </span>
                            )}
                            {product.specs?.waterResistant && (
                              <span className="text-xs bg-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded flex items-center gap-1">
                                <FaWater /> Water
                              </span>
                            )}
                            {product.specs?.bloodOxygen && (
                              <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded">
                                SpO2
                              </span>
                            )}
                            {product.specs?.nfc && (
                              <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded flex items-center gap-1">
                                <FaExchangeAlt /> NFC
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
                              console.log('Add to cart:', product);
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
                      className={`px-4 py-2 border rounded-lg transition ${
                        currentPage === 1
                          ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-800 border-gray-700 text-white hover:border-indigo-500'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 border rounded-lg transition ${
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
                      className={`px-4 py-2 border rounded-lg transition ${
                        currentPage === totalPages
                          ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-800 border-gray-700 text-white hover:border-indigo-500'
                      }`}
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
                <div className="text-6xl text-gray-600 mb-4">⌚</div>
                <h3 className="text-xl font-medium text-white mb-2">No wearable products found</h3>
                <p className="text-gray-400">Try adjusting your filters or search term</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Popular Brands */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Popular Brands
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Apple', icon: <FaAppleLogo className="text-3xl" />, color: 'from-gray-700 to-gray-900' },
              { name: 'Samsung', icon: <FaSamsung className="text-3xl" />, color: 'from-blue-600 to-blue-800' },
              { name: 'Fitbit', icon: <FaFitbit />, color: 'from-green-600 to-green-800' },
              { name: 'Garmin', icon: <FaGripfire className="text-3xl" />, color: 'from-red-600 to-red-800' },
              { name: 'Xiaomi', icon: <FaXiaomi className="text-3xl" />, color: 'from-orange-600 to-orange-800' },
              { name: 'Google', icon: <FaGoogle className="text-3xl" />, color: 'from-blue-500 to-blue-700' }
            ].map((brand, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-r ${brand.color} rounded-xl p-4 text-white text-center cursor-pointer hover:shadow-xl transition-all`}
                onClick={() => setSelectedBrand(brand.name)}
              >
                <div className="text-3xl mb-2">{brand.icon}</div>
                <h3 className="font-bold text-sm">{brand.name}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Health & Fitness Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 text-white"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Track Your Health & Fitness</h3>
              <p className="text-white/80 mb-6">
                Monitor your heart rate, track your steps, analyze your sleep, and achieve your fitness goals with our advanced wearables.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/20 p-3 rounded-lg flex items-center gap-2">
                  <FaHeartbeat className="text-red-400" /> Heart Rate
                </div>
                <div className="bg-white/20 p-3 rounded-lg flex items-center gap-2">
                  <FaRunning className="text-green-400" /> Steps
                </div>
                <div className="bg-white/20 p-3 rounded-lg flex items-center gap-2">
                  <FaBed className="text-blue-400" /> Sleep
                </div>
                <div className="bg-white/20 p-3 rounded-lg flex items-center gap-2">
                  <FaFire className="text-orange-400" /> Calories
                </div>
                <div className="bg-white/20 p-3 rounded-lg flex items-center gap-2">
                  <FaWater className="text-cyan-400" /> Hydration
                </div>
                <div className="bg-white/20 p-3 rounded-lg flex items-center gap-2">
                  <FaDumbbell className="text-yellow-400" /> Workout
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">24/7 Monitoring</h4>
                <p className="text-sm text-white/70">Continuous health tracking</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Smart Notifications</h4>
                <p className="text-sm text-white/70">Calls, messages, apps</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Long Battery Life</h4>
                <p className="text-sm text-white/70">Days of usage</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Water Resistant</h4>
                <p className="text-sm text-white/70">Swim-proof designs</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Compatibility */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Compatible With
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-gray-300">
              <FaAppleLogo className="text-3xl text-gray-300" />
              <span className="font-medium">iOS</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <FaAndroid className="text-3xl text-green-500" />
              <span className="font-medium">Android</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <FaGooglePlay className="text-3xl text-blue-500" />
              <span className="font-medium">Google Fit</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <FaApple className="text-3xl text-gray-300" />
              <span className="font-medium">Apple Health</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <FaBluetoothB className="text-3xl text-blue-500" />
              <span className="font-medium">Bluetooth</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <FaWifi className="text-3xl text-blue-500" />
              <span className="font-medium">WiFi</span>
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
                    Compare Wearables
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
                          
                          <div className="space-y-2 text-sm">
                            <p className="flex justify-between">
                              <span className="text-gray-400">Brand:</span>
                              <span className="text-white">{product.brand || 'Generic'}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Price:</span>
                              <span className="text-indigo-400 font-bold">{formatPrice(product.finalPrice || product.price)}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Battery:</span>
                              <span className="text-white">{product.specs?.batteryLife || 'N/A'}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Water Resistant:</span>
                              <span className="text-white">{product.specs?.waterResistant ? 'Yes' : 'No'}</span>
                            </p>
                          </div>

                          <button
                            onClick={() => {
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

export default Wearables;