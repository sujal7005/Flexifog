import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  FaLaptop,
  FaGamepad,
  FaBriefcase,
  FaGraduationCap,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaFilter,
  FaSort,
  FaSearch,
  FaTimes,
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaBolt,
  FaBatteryFull,
  FaBatteryHalf,
  FaBatteryQuarter,
  FaTachometerAlt,
  FaWeightHanging,
  FaRuler,
  FaPalette,
  FaWifi,
  FaBluetoothB,
  FaUsb,
  FaSdCard,
  FaArrowLeft,
  FaArrowRight,
  FaTemperatureLow
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Laptop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedProcessor, setSelectedProcessor] = useState('all');
  const [selectedRam, setSelectedRam] = useState('all');
  const [selectedStorage, setSelectedStorage] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 300000 });
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
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

  useEffect(() => {
    const fetchLaptops = async (page = 1, limit = 10) => {
      setLoading(true);
      setLaptops([]);
      try {
        // Fetch from multiple endpoints to get all laptop types
        const endpoints = [
          `${BASE_URL}/api/admin/products?type=refurbished`
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint => 
            fetch(endpoint)
              .then(res => res.json())
              .catch(err => {
                console.log(`Error fetching from ${endpoint}:`, err);
                return { products: [] };
              })
          )
        );

        let allLaptops = [];

        responses.forEach((data, index) => {
          if (index === 0) {
            // Refurbished products
            if (data.refurbishedProducts) {
              allLaptops = [...allLaptops, ...data.refurbishedProducts];
            }
          } else if (index === 1) {
            // Laptops endpoint
            if (data.success && Array.isArray(data.products)) {
              allLaptops = [...allLaptops, ...data.products];
            } else if (Array.isArray(data)) {
              allLaptops = [...allLaptops, ...data];
            }
          }
        });

        // Remove duplicates based on _id
        const uniqueLaptops = [];
        const seenIds = new Set();
        
        allLaptops.forEach(laptop => {
          if (laptop && laptop._id && !seenIds.has(laptop._id)) {
            seenIds.add(laptop._id);
            uniqueLaptops.push(laptop);
          }
        });

        setLaptops(uniqueLaptops);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching laptops:', error);
        setError('An error occurred. Please try again.');
        setLoading(false);
      }
    };

    fetchLaptops(1, 20);
  }, []);

  // Extract filter options from laptops
  const filters = React.useMemo(() => {
    const brands = new Set();
    const processors = new Set();
    const ramOptions = new Set();
    const storageOptions = new Set();
    const features = new Set();

    laptops.forEach(laptop => {
      if (laptop.brand) brands.add(laptop.brand);
      
      const name = laptop.name?.toLowerCase() || '';
      const specs = laptop.specs || {};
      const description = laptop.description?.toLowerCase() || '';

      // Extract processor
      if (specs.processor) {
        const processorStr = safeToLowerCase(specs.processor);
        if (processorStr.includes('i3') || processorStr.includes('i5') || 
            processorStr.includes('i7') || processorStr.includes('i9')) {
          processors.add('Intel Core');
        } else if (processorStr.includes('ryzen')) {
          processors.add('AMD Ryzen');
        } else if (processorStr.includes('m1') || processorStr.includes('m2') || 
                   processorStr.includes('m3')) {
          processors.add('Apple Silicon');
        }
      }

      // Extract RAM
      const ram = specs.ram || specs.memory || '';
      const ramMatch = String(ram).match(/(\d+)\s*GB/i);
      if (ramMatch) {
        ramOptions.add(`${ramMatch[1]}GB`);
      }

      // Extract Storage
      const storage = specs.storage || specs.ssd || specs.hdd || '';
      const storageMatch = String(storage).match(/(\d+)\s*GB|\d+\s*TB/i);
      if (storageMatch) {
        storageOptions.add(storageMatch[0]);
      }

      // Extract features
      if (description.includes('touch') || specs.touchscreen) features.add('Touchscreen');
      if (description.includes('gaming') || specs.gaming) features.add('Gaming');
      if (description.includes('business') || specs.business) features.add('Business');
      if (description.includes('student') || specs.student) features.add('Student');
      if (description.includes('lightweight') || specs.lightweight) features.add('Lightweight');
      if (description.includes('long battery') || specs.batteryLife > 8) features.add('Long Battery Life');
      if (description.includes('backlit') || specs.backlitKeyboard) features.add('Backlit Keyboard');
      if (description.includes('fingerprint') || specs.fingerprint) features.add('Fingerprint Reader');
    });

    return {
      brands: Array.from(brands).sort(),
      processors: Array.from(processors).sort(),
      ramOptions: Array.from(ramOptions).sort((a, b) => parseInt(a) - parseInt(b)),
      storageOptions: Array.from(storageOptions).sort((a, b) => {
        const aVal = a.includes('TB') ? parseInt(a) * 1024 : parseInt(a);
        const bVal = b.includes('TB') ? parseInt(b) * 1024 : parseInt(b);
        return aVal - bVal;
      }),
      features: Array.from(features).sort()
    };
  }, [laptops]);

  const categoryArray = category.split(",").map((cat) => cat.trim());

  const filteredLaptops = Array.isArray(laptops)
    ? laptops
      .filter((laptop) => {
        // Category filter
        if (category !== "All" && !categoryArray.includes(laptop.category)) {
          return false;
        }

        // Search filter
        if (searchTerm) {
          const searchLower = safeToLowerCase(searchTerm);
          const name = safeToLowerCase(laptop.name);
          const brand = safeToLowerCase(laptop.brand);
          const description = safeToLowerCase(laptop.description);
          
          if (!name.includes(searchLower) && !brand.includes(searchLower) && !description.includes(searchLower)) {
            return false;
          }
        }

        // Brand filter
        if (selectedBrand !== 'all' && laptop.brand !== selectedBrand) {
          return false;
        }

        // Processor filter
        if (selectedProcessor !== 'all') {
          const processor = safeToLowerCase(laptop.specs?.processor || '');
          if (selectedProcessor === 'Intel Core' && !processor.includes('i3') && !processor.includes('i5') && 
              !processor.includes('i7') && !processor.includes('i9')) {
            return false;
          }
          if (selectedProcessor === 'AMD Ryzen' && !processor.includes('ryzen')) {
            return false;
          }
          if (selectedProcessor === 'Apple Silicon' && !processor.includes('m1') && !processor.includes('m2') && 
              !processor.includes('m3')) {
            return false;
          }
        }

        // RAM filter
        if (selectedRam !== 'all') {
          const ram = safeToLowerCase(laptop.specs?.ram || laptop.specs?.memory || '');
          if (!ram.includes(safeToLowerCase(selectedRam))) {
            return false;
          }
        }

        // Storage filter
        if (selectedStorage !== 'all') {
          const storage = safeToLowerCase(laptop.specs?.storage || laptop.specs?.ssd || laptop.specs?.hdd || '');
          if (!storage.includes(safeToLowerCase(selectedStorage))) {
            return false;
          }
        }

        // Price filter
        const price = laptop.finalPrice || laptop.price || 0;
        if (price < priceRange.min || price > priceRange.max) {
          return false;
        }

        // Features filter
        if (selectedFeatures.length > 0) {
          const description = safeToLowerCase(laptop.description || '');
          const specs = laptop.specs || {};
          
          return selectedFeatures.every(feature => {
            switch(feature) {
              case 'Touchscreen':
                return description.includes('touch') || specs.touchscreen;
              case 'Gaming':
                return description.includes('gaming') || specs.gaming;
              case 'Business':
                return description.includes('business') || specs.business;
              case 'Student':
                return description.includes('student') || specs.student;
              case 'Lightweight':
                return description.includes('lightweight') || specs.lightweight;
              case 'Long Battery Life':
                return description.includes('long battery') || specs.batteryLife > 8;
              case 'Backlit Keyboard':
                return description.includes('backlit') || specs.backlitKeyboard;
              case 'Fingerprint Reader':
                return description.includes('fingerprint') || specs.fingerprint;
              default:
                return true;
            }
          });
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.finalPrice || a.price || 0;
        const priceB = b.finalPrice || b.price || 0;
        const popularityA = a.popularity || 0;
        const popularityB = b.popularity || 0;
        const dateA = new Date(a.dateAdded || 0);
        const dateB = new Date(b.dateAdded || 0);

        switch(sortOption) {
          case "price-low":
            return priceA - priceB;
          case "price-high":
            return priceB - priceA;
          case "popularity":
            return popularityB - popularityA;
          case "newest":
            return dateB - dateA;
          default:
            return 0;
        }
      })
    : [];

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentLaptops = filteredLaptops.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredLaptops.length / productsPerPage);

  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);

  const toggleFeature = (feature) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const toggleWishlist = (productId, e) => {
    e.stopPropagation();
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

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

  const handleCompare = () => {
    if (compareList.length < 2) {
      alert('Please select at least 2 products to compare');
      return;
    }
    setShowCompareModal(true);
  };

  const handleProductClick = (productId) => {
    navigate(`/laptops/${productId}`);
  };

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getCategoryIcon = (category) => {
    if (!category) return <FaLaptop className="text-indigo-400" />;
    
    const catStr = safeToLowerCase(category);
    if (catStr.includes('gaming')) return <FaGamepad className="text-purple-400" />;
    if (catStr.includes('business')) return <FaBriefcase className="text-blue-400" />;
    if (catStr.includes('student')) return <FaGraduationCap className="text-green-400" />;
    return <FaLaptop className="text-indigo-400" />;
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
          <p className="text-white text-lg font-medium mt-4">Loading laptops...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we find the perfect laptop for you</p>
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
        <title>Laptops - Buy Gaming, Business & Student Laptops | 7HubComputers</title>
        <meta name="description" content="Explore our collection of gaming, business, and student laptops at the best prices." />
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
            <FaLaptop className="mr-4 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Laptops
            </span>
          </h1>
          <p className="text-lg text-gray-400">
            Discover the perfect laptop for gaming, business, or study
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {filteredLaptops.length} laptops found
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
                <span className="font-bold">{compareList.length} laptop(s) selected for comparison</span>
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
              placeholder="Search laptops..."
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
              value={sortOption}
              onChange={handleSortChange}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popularity">Most Popular</option>
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
                <FaLaptop className="mr-2 text-indigo-400" />
                Categories
              </h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="All"
                    checked={category === "All"}
                    onChange={handleCategoryChange}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-300">All Laptops</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="Gaming Laptop"
                    checked={category === "Gaming Laptop"}
                    onChange={handleCategoryChange}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-300 flex items-center">
                    <FaGamepad className="mr-2 text-purple-400" /> Gaming Laptops
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="Business Laptop"
                    checked={category === "Business Laptop"}
                    onChange={handleCategoryChange}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-300 flex items-center">
                    <FaBriefcase className="mr-2 text-blue-400" /> Business Laptops
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="Student Laptop"
                    checked={category === "Student Laptop"}
                    onChange={handleCategoryChange}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-300 flex items-center">
                    <FaGraduationCap className="mr-2 text-green-400" /> Student Laptops
                  </span>
                </label>
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

            {/* Processor */}
            {filters.processors.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <FaMicrochip className="mr-2 text-indigo-400" />
                  Processor
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="processor"
                      value="all"
                      checked={selectedProcessor === 'all'}
                      onChange={(e) => setSelectedProcessor(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">All</span>
                  </label>
                  {filters.processors.map(proc => (
                    <label key={proc} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="processor"
                        value={proc}
                        checked={selectedProcessor === proc}
                        onChange={(e) => setSelectedProcessor(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-300">{proc}</span>
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
                  <FaHdd className="mr-2 text-indigo-400" />
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

            {/* Price Range */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Price Range</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Min: {formatPrice(priceRange.min)}</label>
                  <input
                    type="range"
                    min="0"
                    max="300000"
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
                    max="300000"
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
                setCategory("All");
                setSelectedBrand('all');
                setSelectedProcessor('all');
                setSelectedRam('all');
                setSelectedStorage('all');
                setPriceRange({ min: 0, max: 300000 });
                setSelectedFeatures([]);
                setSearchTerm('');
              }}
              className="w-full px-4 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Reset All Filters
            </button>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            {currentLaptops.length > 0 ? (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {currentLaptops.map((laptop, index) => (
                    <motion.div
                      key={laptop._id}
                      variants={itemVariants}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl cursor-pointer group relative"
                      onClick={() => handleProductClick(laptop._id)}
                    >
                      {/* Compare Checkbox */}
                      <div className="absolute top-3 left-3 z-20">
                        <label className="flex items-center space-x-2 cursor-pointer bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-600 hover:border-indigo-500 transition-all">
                          <input
                            type="checkbox"
                            checked={compareList.includes(laptop._id)}
                            onChange={(e) => toggleCompare(laptop._id, e)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                          />
                          <span className="text-xs text-gray-300 font-medium">Compare</span>
                        </label>
                      </div>

                      {/* Product Image */}
                      <div className="relative h-48 bg-gray-900 p-4">
                        <img
                          src={getImageUrl(laptop.image)}
                          alt={laptop.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
                          {laptop.discount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                              -{laptop.discount}%
                            </span>
                          )}
                          <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center">
                            {getCategoryIcon(laptop.category)} {laptop.category || 'Laptop'}
                          </span>
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => toggleWishlist(laptop._id, e)}
                          className="absolute bottom-3 right-3 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 border border-gray-600 z-10"
                        >
                          <FaHeart className={wishlist.includes(laptop._id) ? 'text-red-500' : 'text-gray-400'} />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition">
                          {laptop.name}
                        </h3>
                        
                        {/* Key Specs */}
                        <div className="flex flex-wrap gap-2 text-xs mb-2">
                          {laptop.specs?.processor && (
                            <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                              <FaMicrochip className="mr-1 text-indigo-400 text-xs" /> {laptop.specs.processor}
                            </span>
                          )}
                          {laptop.specs?.ram && (
                            <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                              <FaMemory className="mr-1 text-indigo-400 text-xs" /> {laptop.specs.ram}
                            </span>
                          )}
                          {laptop.specs?.storage && (
                            <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                              <FaHdd className="mr-1 text-indigo-400 text-xs" /> {laptop.specs.storage}
                            </span>
                          )}
                        </div>

                        {/* Features Tags */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {laptop.specs?.touchscreen && (
                            <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded">Touchscreen</span>
                          )}
                          {laptop.specs?.backlitKeyboard && (
                            <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded">Backlit</span>
                          )}
                          {laptop.specs?.fingerprint && (
                            <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">Fingerprint</span>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`w-4 h-4 ${
                                  i < (laptop.rating || 4)
                                    ? 'text-yellow-400'
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            ({laptop.reviews?.length || 0})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-xl font-bold text-indigo-400">
                              {formatPrice(laptop.finalPrice || laptop.price || 0)}
                            </span>
                            {laptop.originalPrice > (laptop.finalPrice || laptop.price) && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                {formatPrice(laptop.originalPrice || 0)}
                              </span>
                            )}
                          </div>
                          {laptop.inStock ? (
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
                            console.log('Adding to cart:', laptop);
                          }}
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
                <div className="text-6xl text-gray-600 mb-4">💻</div>
                <h3 className="text-xl font-medium text-white mb-2">No laptops found</h3>
                <p className="text-gray-400">Try adjusting your filters or search term</p>
              </motion.div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white text-center cursor-pointer hover:shadow-xl transition-all"
              onClick={() => setCategory("Gaming Laptop")}
            >
              <FaGamepad className="text-4xl mx-auto mb-3" />
              <h3 className="font-bold text-lg">Gaming Laptops</h3>
              <p className="text-sm text-white/70 mt-2">High performance for gaming</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white text-center cursor-pointer hover:shadow-xl transition-all"
              onClick={() => setCategory("Business Laptop")}
            >
              <FaBriefcase className="text-4xl mx-auto mb-3" />
              <h3 className="font-bold text-lg">Business Laptops</h3>
              <p className="text-sm text-white/70 mt-2">Professional and reliable</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white text-center cursor-pointer hover:shadow-xl transition-all"
              onClick={() => setCategory("Student Laptop")}
            >
              <FaGraduationCap className="text-4xl mx-auto mb-3" />
              <h3 className="font-bold text-lg">Student Laptops</h3>
              <p className="text-sm text-white/70 mt-2">Perfect for education</p>
            </motion.div>
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
                    Compare Laptops
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
                      const laptop = laptops.find(p => p._id === productId);
                      if (!laptop) return null;
                      
                      return (
                        <div key={productId} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                          <img
                            src={getImageUrl(laptop.image)}
                            alt={laptop.name}
                            className="h-32 object-contain mb-4 mx-auto"
                          />
                          <h3 className="font-semibold text-white mb-2 text-center line-clamp-2">{laptop.name}</h3>
                          <p className="text-indigo-400 font-bold mb-2 text-center">{formatPrice(laptop.finalPrice || laptop.price)}</p>
                          <button
                            onClick={() => {
                              setShowCompareModal(false);
                              navigate(`/laptops/${productId}`);
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

export default Laptop;