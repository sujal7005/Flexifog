// src/pages/Mobiles_&_Tablets.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaMobileAlt,
  FaTablet,
  FaApple,
  FaAndroid,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaFilter,
  FaSort,
  FaSearch,
  FaTimes,
  FaBatteryFull,
  FaBatteryHalf,
  FaBatteryQuarter,
  FaCamera,
  FaMicrochip,
  FaMemory,
  FaSimCard,
  FaWifi,
  FaBluetooth,
  FaFingerprint,
  FaLock,
  FaShieldAlt,
  FaTachometerAlt,
  FaBolt,
  FaWeight,
  FaRuler,
  FaPalette,
  FaWater,
  FaGamepad,
  FaHeadphones,
  FaUsb,
  FaSdCard,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MobilesAndTablets = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedOs, setSelectedOs] = useState('all');
  const [selectedRam, setSelectedRam] = useState('all');
  const [selectedStorage, setSelectedStorage] = useState('all');
  const [selectedBattery, setSelectedBattery] = useState('all');
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

  // Fetch mobile and tablet products
  useEffect(() => {
    const fetchMobileProducts = async () => {
      try {
        setLoading(true);
        // Fetch from the dedicated mobiles endpoint
        const response = await fetch(`${BASE_URL}/api/mobiles`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('Mobile API response:', data);
        
        // Check if the response has the expected structure
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
          setFilteredProducts(data.products);
        } else if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        } else {
          console.error('Unexpected API response format:', data);
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (err) {
        console.error('Error fetching mobile products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMobileProducts();
  }, []);

  // Extract unique filter options from products
  const filters = React.useMemo(() => {
    const brands = new Set();
    const types = new Set();
    const osTypes = new Set();
    const ramOptions = new Set();
    const storageOptions = new Set();
    const batteryOptions = new Set();
    const features = new Set();

    products.forEach(product => {
      if (product.brand) brands.add(product.brand);
      
      // Determine device type
      const name = product.name?.toLowerCase() || '';
      const categoryStr = getCategoryString(product.category);
      const description = product.description?.toLowerCase() || '';
      const specs = product.specs || {};
      
      if (name.includes('phone') || name.includes('mobile') || categoryStr.includes('phone')) {
        types.add('Smartphone');
      }
      if (name.includes('tablet') || name.includes('ipad') || categoryStr.includes('tablet')) {
        types.add('Tablet');
      }
      if (name.includes('fold') || description.includes('foldable')) {
        types.add('Foldable Phone');
      }
      if (name.includes('iphone')) {
        types.add('iPhone');
      }
      if (name.includes('ipad')) {
        types.add('iPad');
      }

      // Extract OS from specs
      const os = specs.operatingSystem || specs.os || '';
      if (os.toLowerCase().includes('ios') || os.toLowerCase().includes('iphone')) {
        osTypes.add('iOS');
      }
      if (os.toLowerCase().includes('android')) {
        osTypes.add('Android');
      }
      if (os.toLowerCase().includes('harmony')) {
        osTypes.add('HarmonyOS');
      }

      // Extract RAM
      const ram = specs.ram || '';
      const ramMatch = ram.match(/(\d+)\s*GB/i);
      if (ramMatch) {
        ramOptions.add(`${ramMatch[1]}GB`);
      }

      // Extract Storage
      const storage = specs.internalStorage || specs.storage || '';
      const storageMatch = storage.match(/(\d+)\s*GB|\d+\s*TB/i);
      if (storageMatch) {
        storageOptions.add(storageMatch[0]);
      }

      // Extract Battery
      const battery = specs.batteryCapacity || specs.battery || description;
      const batteryMatch = battery.match(/(\d+)\s*mAh/i);
      if (batteryMatch) {
        const capacity = parseInt(batteryMatch[1]);
        if (capacity < 3000) batteryOptions.add('< 3000mAh');
        else if (capacity < 4000) batteryOptions.add('3000-4000mAh');
        else if (capacity < 5000) batteryOptions.add('4000-5000mAh');
        else batteryOptions.add('5000mAh+');
      }

      // Extract features
      if (description.includes('5g') || specs['5g']) features.add('5G');
      if (description.includes('wireless charging') || specs.wirelessCharging) features.add('Wireless Charging');
      if (description.includes('fast charging') || specs.fastCharging) features.add('Fast Charging');
      if (description.includes('waterproof') || description.includes('water resistant') || specs.waterResistant) features.add('Water Resistant');
      if (description.includes('face unlock') || specs.faceUnlock) features.add('Face Unlock');
      if (description.includes('fingerprint') || specs.fingerprintSensor) features.add('Fingerprint Sensor');
      if (description.includes('nfc') || specs.nfc) features.add('NFC');
      if (description.includes('stylus') || specs.stylus) features.add('Stylus Support');
      if (description.includes('dual sim') || specs.dualSim) features.add('Dual SIM');
      if (description.includes('expandable storage') || specs.expandableStorage) features.add('Expandable Storage');
      if (description.includes('stereo speakers') || specs.stereoSpeakers) features.add('Stereo Speakers');
      if (description.includes('high refresh rate') || specs.refreshRate > 60) features.add('High Refresh Rate');
    });

    return {
      brands: Array.from(brands).sort(),
      types: Array.from(types).sort(),
      osTypes: Array.from(osTypes).sort(),
      ramOptions: Array.from(ramOptions).sort((a, b) => parseInt(a) - parseInt(b)),
      storageOptions: Array.from(storageOptions).sort((a, b) => {
        const aVal = a.includes('TB') ? parseInt(a) * 1024 : parseInt(a);
        const bVal = b.includes('TB') ? parseInt(b) * 1024 : parseInt(b);
        return aVal - bVal;
      }),
      batteryOptions: Array.from(batteryOptions).sort(),
      features: Array.from(features).sort()
    };
  }, [products]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        const categoryStr = getCategoryString(product.category);
        return categoryStr.includes(selectedCategory.toLowerCase());
      });
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(product => {
        const name = product.name?.toLowerCase() || '';
        const categoryStr = getCategoryString(product.category);
        const description = product.description?.toLowerCase() || '';
        
        switch(selectedType) {
          case 'Smartphone':
            return (name.includes('phone') || name.includes('mobile')) && !name.includes('tablet');
          case 'iPhone':
            return name.includes('iphone');
          case 'iPad':
            return name.includes('ipad');
          case 'Tablet':
            return name.includes('tablet') || name.includes('ipad') || categoryStr.includes('tablet');
          case 'Foldable Phone':
            return name.includes('fold') || description.includes('foldable');
          default:
            return true;
        }
      });
    }

    // Apply brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Apply OS filter
    if (selectedOs !== 'all') {
      filtered = filtered.filter(product => {
        const specs = product.specs || {};
        const os = (specs.operatingSystem || specs.os || '').toLowerCase();
        if (selectedOs === 'iOS') return os.includes('ios') || os.includes('iphone');
        if (selectedOs === 'Android') return os.includes('android');
        if (selectedOs === 'HarmonyOS') return os.includes('harmony');
        return true;
      });
    }

    // Apply RAM filter
    if (selectedRam !== 'all') {
      filtered = filtered.filter(product => {
        const ram = product.specs?.ram || '';
        return ram.includes(selectedRam);
      });
    }

    // Apply Storage filter
    if (selectedStorage !== 'all') {
      filtered = filtered.filter(product => {
        const storage = product.specs?.internalStorage || product.specs?.storage || '';
        return storage.includes(selectedStorage);
      });
    }

    // Apply Battery filter
    if (selectedBattery !== 'all') {
      filtered = filtered.filter(product => {
        const description = product.description?.toLowerCase() || '';
        const battery = product.specs?.batteryCapacity || product.specs?.battery || description;
        const batteryMatch = battery.match(/(\d+)\s*mAh/i);
        if (!batteryMatch) return false;
        
        const capacity = parseInt(batteryMatch[1]);
        if (selectedBattery === '< 3000mAh') return capacity < 3000;
        if (selectedBattery === '3000-4000mAh') return capacity >= 3000 && capacity < 4000;
        if (selectedBattery === '4000-5000mAh') return capacity >= 4000 && capacity < 5000;
        if (selectedBattery === '5000mAh+') return capacity >= 5000;
        return true;
      });
    }

    // Apply price filter
    filtered = filtered.filter(product => 
      (product.price || 0) >= priceRange.min && (product.price || 0) <= priceRange.max
    );

    // Apply features filter
    if (selectedFeatures.length > 0) {
      filtered = filtered.filter(product => {
        const description = product.description?.toLowerCase() || '';
        const specs = product.specs || {};
        
        return selectedFeatures.every(feature => {
          switch(feature) {
            case '5G':
              return description.includes('5g') || specs['5g'];
            case 'Wireless Charging':
              return description.includes('wireless charging') || specs.wirelessCharging;
            case 'Fast Charging':
              return description.includes('fast charging') || specs.fastCharging;
            case 'Water Resistant':
              return description.includes('waterproof') || description.includes('water resistant') || specs.waterResistant;
            case 'Face Unlock':
              return description.includes('face unlock') || specs.faceUnlock;
            case 'Fingerprint Sensor':
              return description.includes('fingerprint') || specs.fingerprintSensor;
            case 'NFC':
              return description.includes('nfc') || specs.nfc;
            case 'Dual SIM':
              return description.includes('dual sim') || specs.dualSim;
            case 'Expandable Storage':
              return description.includes('expandable') || specs.expandableStorage;
            case 'Stereo Speakers':
              return description.includes('stereo') || specs.stereoSpeakers;
            default:
              return description.includes(feature.toLowerCase());
          }
        });
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'discount':
          return (b.discount || 0) - (a.discount || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchTerm, selectedCategory, selectedType, selectedBrand, selectedOs, selectedRam, selectedStorage, selectedBattery, priceRange, selectedFeatures, sortBy]);

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
    navigate(`/mobiles/${productId}`);
  };

  // Handle add to cart
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    // Add to cart logic
    console.log('Adding to cart:', product);
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

  // Get product type badge
  const getProductType = (product) => {
    const name = product.name?.toLowerCase() || '';
    const categoryStr = getCategoryString(product.category);
    
    if (name.includes('iphone')) return 'iPhone';
    if (name.includes('ipad')) return 'iPad';
    if (name.includes('fold') || name.includes('foldable')) return 'Foldable';
    if (name.includes('tablet') || categoryStr.includes('tablet')) return 'Tablet';
    if (name.includes('phone') || name.includes('mobile')) return 'Smartphone';
    return 'Mobile';
  };

  // Get OS icon
  const getOsIcon = (product) => {
    const specs = product.specs || {};
    const os = (specs.operatingSystem || specs.os || '').toLowerCase();
    if (os.includes('ios') || os.includes('iphone')) return <FaApple className="text-gray-300" />;
    if (os.includes('android')) return <FaAndroid className="text-green-500" />;
    return null;
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
          <p className="text-white text-lg font-medium mt-4">Loading mobiles & tablets...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we find the best devices for you</p>
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
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center">
            <FaMobileAlt className="mr-4 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Mobiles & Tablets
            </span>
          </h1>
          <p className="text-lg text-gray-400">
            Discover the latest smartphones, iPhones, iPads, and tablets from top brands
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

        {/* Search and Mobile Filter Button */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search mobiles & tablets..."
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
            {/* Device Type */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <FaMobileAlt className="mr-2 text-indigo-400" />
                Device Type
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
                  <span className="text-gray-300">All Devices</span>
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

            {/* Operating System */}
            {filters.osTypes.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4">Operating System</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="os"
                      value="all"
                      checked={selectedOs === 'all'}
                      onChange={(e) => setSelectedOs(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">All</span>
                  </label>
                  {filters.osTypes.map(os => (
                    <label key={os} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="os"
                        value={os}
                        checked={selectedOs === os}
                        onChange={(e) => setSelectedOs(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-300">{os}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* RAM */}
            {filters.ramOptions.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <FaMemory className="mr-2 text-indigo-400" />
                  RAM
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="ram"
                      value="all"
                      checked={selectedRam === 'all'}
                      onChange={(e) => setSelectedRam(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">All</span>
                  </label>
                  {filters.ramOptions.map(ram => (
                    <label key={ram} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="ram"
                        value={ram}
                        checked={selectedRam === ram}
                        onChange={(e) => setSelectedRam(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-300">{ram}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Storage */}
            {filters.storageOptions.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <FaSdCard className="mr-2 text-indigo-400" />
                  Storage
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="storage"
                      value="all"
                      checked={selectedStorage === 'all'}
                      onChange={(e) => setSelectedStorage(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">All</span>
                  </label>
                  {filters.storageOptions.map(storage => (
                    <label key={storage} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="storage"
                        value={storage}
                        checked={selectedStorage === storage}
                        onChange={(e) => setSelectedStorage(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-300">{storage}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Battery */}
            {filters.batteryOptions.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <FaBatteryFull className="mr-2 text-indigo-400" />
                  Battery
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="battery"
                      value="all"
                      checked={selectedBattery === 'all'}
                      onChange={(e) => setSelectedBattery(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">All</span>
                  </label>
                  {filters.batteryOptions.map(battery => (
                    <label key={battery} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="battery"
                        value={battery}
                        checked={selectedBattery === battery}
                        onChange={(e) => setSelectedBattery(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-300">{battery}</span>
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
                    max="200000"
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
                setSelectedOs('all');
                setSelectedRam('all');
                setSelectedStorage('all');
                setSelectedBattery('all');
                setPriceRange({ min: 0, max: 200000 });
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
                  {currentProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      variants={itemVariants}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl cursor-pointer group relative"
                      onClick={() => handleProductClick(product._id)}
                    >
                      {/* Compare Checkbox - Fixed visibility */}
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

                        {/* OS Badge */}
                        <div className="absolute bottom-3 left-3 z-10">
                          {getOsIcon(product)}
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
                          {product.specs?.ram && (
                            <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                              <FaMemory className="mr-1 text-indigo-400" /> {product.specs.ram}
                            </span>
                          )}
                          {product.specs?.internalStorage && (
                            <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                              <FaSdCard className="mr-1 text-indigo-400" /> {product.specs.internalStorage}
                            </span>
                          )}
                          {product.specs?.batteryCapacity && (
                            <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                              <FaBatteryHalf className="mr-1 text-indigo-400" /> {product.specs.batteryCapacity}
                            </span>
                          )}
                        </div>

                        {/* Features Tags */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {product.description?.toLowerCase().includes('5g') && (
                            <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">5G</span>
                          )}
                          {product.description?.toLowerCase().includes('fast charging') && (
                            <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded">Fast Charging</span>
                          )}
                          {product.specs?.nfc && (
                            <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded">NFC</span>
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
                              {formatPrice(product.finalPrice || product.price || 0)}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                {formatPrice(product.originalPrice || 0)}
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
                          onClick={(e) => handleAddToCart(product, e)}
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <FaShoppingCart /> Add to Cart
                        </button>
                      </div>
                    </motion.div>
                  ))}
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
                <div className="text-6xl text-gray-600 mb-4">📱</div>
                <h3 className="text-xl font-medium text-white mb-2">No mobiles or tablets found</h3>
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
            Shop by Brand
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Apple', icon: <FaApple />, color: 'from-gray-700 to-gray-900' },
              { name: 'Samsung', icon: <FaMobileAlt />, color: 'from-blue-600 to-blue-800' },
              { name: 'OnePlus', icon: <FaBolt />, color: 'from-red-600 to-red-800' },
              { name: 'Xiaomi', icon: <FaMobileAlt />, color: 'from-orange-600 to-orange-800' },
              { name: 'Google', icon: <FaAndroid />, color: 'from-green-600 to-green-800' },
              { name: 'Realme', icon: <FaBolt />, color: 'from-yellow-600 to-yellow-800' }
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
              <h3 className="text-2xl font-bold mb-4">Mobile & Tablet Buying Guide</h3>
              <p className="text-white/80 mb-6">
                Find the perfect smartphone or tablet for your needs. Compare specs, read reviews, and get expert advice.
              </p>
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition transform hover:scale-105">
                View Buying Guides
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">5G Ready</h4>
                <p className="text-sm text-white/70">Future-proof connectivity</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Camera Quality</h4>
                <p className="text-sm text-white/70">Capture every moment</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Battery Life</h4>
                <p className="text-sm text-white/70">All-day power</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Performance</h4>
                <p className="text-sm text-white/70">Smooth multitasking</p>
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
                    Compare Products
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
                          <h3 className="font-semibold text-white mb-2 text-center">{product.name}</h3>
                          <p className="text-indigo-400 font-bold mb-2 text-center">{formatPrice(product.finalPrice || product.price)}</p>
                          <button
                            onClick={() => {
                              setShowCompareModal(false);
                              navigate(`/mobiles/${productId}`);
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

export default MobilesAndTablets;