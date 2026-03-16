import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FaDesktop,
  FaGamepad,
  FaBriefcase,
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
  FaTachometerAlt,
  FaFan,
  FaCogs,
  FaServer,
  FaArrowLeft,
  FaArrowRight,
  FaGripfire,
  FaSnowflake,
  FaUsb,
  FaWifi,
  FaBluetoothB
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PreBuiltPCs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pcs, setPcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [category, setCategory] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcessor, setSelectedProcessor] = useState('all');
  const [selectedRam, setSelectedRam] = useState('all');
  const [selectedStorage, setSelectedStorage] = useState('all');
  const [selectedGpu, setSelectedGpu] = useState('all');
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
    const fetchPCs = async (page = 1, limit = 10) => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/api/admin/products?page=${page}&limit=${limit}`);
        const data = await response.json();
        console.log(data)
        
        // Combine prebuilt and office PCs
        const allPCs = [...(data.prebuildPC || []), ...(data.officePC || [])];
        
        // Remove duplicates based on _id
        const uniquePCs = [];
        const seenIds = new Set();
        
        allPCs.forEach(pc => {
          if (pc && pc._id && !seenIds.has(pc._id)) {
            seenIds.add(pc._id);
            uniquePCs.push(pc);
          }
        });
        
        setPcs(uniquePCs);
        setLoading(false);
      } catch (err) {
        console.log(err)
        setError("Failed to fetch Pre-Built PCs");
        setLoading(false);
      }
    };

    fetchPCs(1, 50);
  }, []);

  // Extract filter options from PCs
  const filters = React.useMemo(() => {
    const processors = new Set();
    const ramOptions = new Set();
    const storageOptions = new Set();
    const gpuOptions = new Set();
    const features = new Set();

    pcs.forEach(pc => {
      const specs = pc.specs || {};
      const description = safeToLowerCase(pc.description || '');
      const name = safeToLowerCase(pc.name || '');

      // Extract processor
      if (specs.cpu) {
        const cpuStr = safeToLowerCase(specs.cpu);
        if (cpuStr.includes('i3') || cpuStr.includes('i5') || 
            cpuStr.includes('i7') || cpuStr.includes('i9')) {
          processors.add('Intel Core');
        } else if (cpuStr.includes('ryzen')) {
          processors.add('AMD Ryzen');
        }
      }

      // Extract RAM from options
      if (specs.ramOptions && Array.isArray(specs.ramOptions)) {
        specs.ramOptions.forEach(option => {
          const ramMatch = String(option.value).match(/(\d+)\s*GB/i);
          if (ramMatch) {
            ramOptions.add(`${ramMatch[1]}GB`);
          }
        });
      }

      // Extract Storage from options
      if (specs.storage1Options && Array.isArray(specs.storage1Options)) {
        specs.storage1Options.forEach(option => {
          const storageMatch = String(option.value).match(/(\d+)\s*GB|\d+\s*TB/i);
          if (storageMatch) {
            storageOptions.add(storageMatch[0]);
          }
        });
      }
      if (specs.storage2Options && Array.isArray(specs.storage2Options)) {
        specs.storage2Options.forEach(option => {
          const storageMatch = String(option.value).match(/(\d+)\s*GB|\d+\s*TB/i);
          if (storageMatch) {
            storageOptions.add(storageMatch[0]);
          }
        });
      }

      // Extract GPU
      if (specs.graphiccard) {
        const gpuStr = safeToLowerCase(specs.graphiccard);
        if (gpuStr.includes('nvidia') || gpuStr.includes('geforce') || gpuStr.includes('rtx')) {
          gpuOptions.add('NVIDIA');
        } else if (gpuStr.includes('amd') || gpuStr.includes('radeon')) {
          gpuOptions.add('AMD');
        }
      }

      // Extract features
      if (description.includes('gaming') || name.includes('gaming')) features.add('Gaming');
      if (description.includes('office') || name.includes('office')) features.add('Office');
      if (description.includes('workstation') || name.includes('workstation')) features.add('Workstation');
      if (specs.liquidcooler || description.includes('liquid cool')) features.add('Liquid Cooling');
      if (specs.wifi || description.includes('wifi')) features.add('WiFi');
      if (specs.bluetooth || description.includes('bluetooth')) features.add('Bluetooth');
      if (specs.rgb || description.includes('rgb')) features.add('RGB Lighting');
    });

    return {
      processors: Array.from(processors).sort(),
      ramOptions: Array.from(ramOptions).sort((a, b) => parseInt(a) - parseInt(b)),
      storageOptions: Array.from(storageOptions).sort((a, b) => {
        const aVal = a.includes('TB') ? parseInt(a) * 1024 : parseInt(a);
        const bVal = b.includes('TB') ? parseInt(b) * 1024 : parseInt(b);
        return aVal - bVal;
      }),
      gpuOptions: Array.from(gpuOptions).sort(),
      features: Array.from(features).sort()
    };
  }, [pcs]);

  const calculateTotalPrice = (pc) => {
    const basePrice = pc?.finalPrice || pc?.price || 0;
    const ramPrice = pc?.specs?.ramOptions?.[0]?.price || 0;
    const storage1Price = pc?.specs?.storage1Options?.[0]?.price || 0;
    const storage2Price = pc?.specs?.storage2Options?.[0]?.price || 0;
    return basePrice + ramPrice + storage1Price + storage2Price;
  };

  const filteredPCs = Array.isArray(pcs)
    ? pcs
      .filter((pc) => {
        // Category filter
        if (category !== "All") {
          const name = safeToLowerCase(pc.name || '');
          const description = safeToLowerCase(pc.description || '');
          const categoryLower = safeToLowerCase(category);
          
          if (categoryLower.includes('gaming') && !name.includes('gaming') && !description.includes('gaming')) {
            return false;
          }
          if (categoryLower.includes('office') && !name.includes('office') && !description.includes('office')) {
            return false;
          }
          if (categoryLower.includes('all-rounder') && !name.includes('all-rounder') && !description.includes('all-rounder')) {
            return false;
          }
        }

        // Search filter
        if (searchTerm) {
          const searchLower = safeToLowerCase(searchTerm);
          const name = safeToLowerCase(pc.name);
          const description = safeToLowerCase(pc.description);
          if (!name.includes(searchLower) && !description.includes(searchLower)) {
            return false;
          }
        }

        // Processor filter
        if (selectedProcessor !== 'all') {
          const cpu = safeToLowerCase(pc.specs?.cpu || '');
          if (selectedProcessor === 'Intel Core' && !cpu.includes('i3') && !cpu.includes('i5') && 
              !cpu.includes('i7') && !cpu.includes('i9')) {
            return false;
          }
          if (selectedProcessor === 'AMD Ryzen' && !cpu.includes('ryzen')) {
            return false;
          }
        }

        // RAM filter
        if (selectedRam !== 'all') {
          const ramOptions = pc.specs?.ramOptions || [];
          const hasRam = ramOptions.some(option => 
            safeToLowerCase(option.value).includes(safeToLowerCase(selectedRam))
          );
          if (!hasRam) return false;
        }

        // Storage filter
        if (selectedStorage !== 'all') {
          const storage1Options = pc.specs?.storage1Options || [];
          const storage2Options = pc.specs?.storage2Options || [];
          const allStorage = [...storage1Options, ...storage2Options];
          const hasStorage = allStorage.some(option => 
            safeToLowerCase(option.value).includes(safeToLowerCase(selectedStorage))
          );
          if (!hasStorage) return false;
        }

        // GPU filter
        if (selectedGpu !== 'all') {
          const gpu = safeToLowerCase(pc.specs?.graphiccard || '');
          if (selectedGpu === 'NVIDIA' && !gpu.includes('nvidia') && !gpu.includes('geforce') && !gpu.includes('rtx')) {
            return false;
          }
          if (selectedGpu === 'AMD' && !gpu.includes('amd') && !gpu.includes('radeon')) {
            return false;
          }
        }

        // Price filter
        const totalPrice = calculateTotalPrice(pc);
        if (totalPrice < priceRange.min || totalPrice > priceRange.max) {
          return false;
        }

        // Features filter
        if (selectedFeatures.length > 0) {
          const description = safeToLowerCase(pc.description || '');
          const name = safeToLowerCase(pc.name || '');
          const specs = pc.specs || {};
          
          return selectedFeatures.every(feature => {
            switch(feature) {
              case 'Gaming':
                return name.includes('gaming') || description.includes('gaming');
              case 'Office':
                return name.includes('office') || description.includes('office');
              case 'Workstation':
                return name.includes('workstation') || description.includes('workstation');
              case 'Liquid Cooling':
                return specs.liquidcooler || description.includes('liquid cool');
              case 'WiFi':
                return specs.wifi || description.includes('wifi');
              case 'Bluetooth':
                return specs.bluetooth || description.includes('bluetooth');
              case 'RGB Lighting':
                return specs.rgb || description.includes('rgb');
              default:
                return true;
            }
          });
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = calculateTotalPrice(a);
        const priceB = calculateTotalPrice(b);
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
  const currentPCs = filteredPCs.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredPCs.length / productsPerPage);

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
    navigate(`/pc/${productId}`);
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

  const getCategoryIcon = (pc) => {
    const name = safeToLowerCase(pc.name || '');
    const description = safeToLowerCase(pc.description || '');
    
    if (name.includes('gaming') || description.includes('gaming')) {
      return { icon: <FaGamepad className="text-purple-400" />, color: 'from-purple-600 to-purple-800' };
    }
    if (name.includes('office') || description.includes('office')) {
      return { icon: <FaBriefcase className="text-blue-400" />, color: 'from-blue-600 to-blue-800' };
    }
    if (name.includes('workstation') || description.includes('workstation')) {
      return { icon: <FaServer className="text-orange-400" />, color: 'from-orange-600 to-orange-800' };
    }
    return { icon: <FaDesktop className="text-indigo-400" />, color: 'from-indigo-600 to-indigo-800' };
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
          <p className="text-white text-lg font-medium mt-4">Loading Pre-Built PCs...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we find the perfect PC for you</p>
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
        <title>Pre-Built PCs - Gaming, Office & Workstation PCs | 7HubComputers</title>
        <meta name="description" content="Explore high-performance pre-built PCs for gaming, office work, and professional needs." />
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
            <FaDesktop className="mr-4 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Pre-Built PCs
            </span>
          </h1>
          <p className="text-lg text-gray-400">
            Discover high-performance PCs for gaming, office, and professional work
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {filteredPCs.length} PCs found
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
                <span className="font-bold">{compareList.length} PC(s) selected for comparison</span>
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
              placeholder="Search PCs..."
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
                <FaDesktop className="mr-2 text-indigo-400" />
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
                  <span className="text-gray-300">All PCs</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="Gaming"
                    checked={category === "Gaming"}
                    onChange={handleCategoryChange}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-300 flex items-center">
                    <FaGamepad className="mr-2 text-purple-400" /> Gaming PCs
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="Office"
                    checked={category === "Office"}
                    onChange={handleCategoryChange}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-300 flex items-center">
                    <FaBriefcase className="mr-2 text-blue-400" /> Office PCs
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="Workstation"
                    checked={category === "Workstation"}
                    onChange={handleCategoryChange}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-300 flex items-center">
                    <FaServer className="mr-2 text-orange-400" /> Workstations
                  </span>
                </label>
              </div>
            </div>

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

            {/* GPU */}
            {filters.gpuOptions.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <FaGripfire className="mr-2 text-red-400" />
                  Graphics Card
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gpu"
                      value="all"
                      checked={selectedGpu === 'all'}
                      onChange={(e) => setSelectedGpu(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-300">All</span>
                  </label>
                  {filters.gpuOptions.map(gpu => (
                    <label key={gpu} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gpu"
                        value={gpu}
                        checked={selectedGpu === gpu}
                        onChange={(e) => setSelectedGpu(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-300">{gpu}</span>
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
                setSelectedProcessor('all');
                setSelectedRam('all');
                setSelectedStorage('all');
                setSelectedGpu('all');
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
            {currentPCs.length > 0 ? (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {currentPCs.map((pc, index) => {
                    const totalPrice = calculateTotalPrice(pc);
                    const categoryInfo = getCategoryIcon(pc);
                    
                    return (
                      <motion.div
                        key={pc._id}
                        variants={itemVariants}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl cursor-pointer group relative"
                        onClick={() => handleProductClick(pc._id)}
                      >
                        {/* Compare Checkbox */}
                        <div className="absolute top-3 left-3 z-20">
                          <label className="flex items-center space-x-2 cursor-pointer bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-600 hover:border-indigo-500 transition-all">
                            <input
                              type="checkbox"
                              checked={compareList.includes(pc._id)}
                              onChange={(e) => toggleCompare(pc._id, e)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-xs text-gray-300 font-medium">Compare</span>
                          </label>
                        </div>

                        {/* Product Image */}
                        <div className="relative h-48 bg-gray-900 p-4">
                          <img
                            src={getImageUrl(pc.image)}
                            alt={pc.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-image.jpg';
                            }}
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
                            {pc.discount > 0 && (
                              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                                -{pc.discount}%
                              </span>
                            )}
                            <span className={`bg-gradient-to-r ${categoryInfo.color} text-white text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center`}>
                              {categoryInfo.icon} {pc.category || 'PC'}
                            </span>
                          </div>

                          {/* Wishlist Button */}
                          <button
                            onClick={(e) => toggleWishlist(pc._id, e)}
                            className="absolute bottom-3 right-3 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 border border-gray-600 z-10"
                          >
                            <FaHeart className={wishlist.includes(pc._id) ? 'text-red-500' : 'text-gray-400'} />
                          </button>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition">
                            {pc.name}
                          </h3>
                          
                          {/* Key Specs */}
                          <div className="flex flex-wrap gap-2 text-xs mb-2">
                            {pc.specs?.cpu && (
                              <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                                <FaMicrochip className="mr-1 text-indigo-400 text-xs" /> {pc.specs.cpu}
                              </span>
                            )}
                            {pc.specs?.ramOptions?.[0] && (
                              <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                                <FaMemory className="mr-1 text-indigo-400 text-xs" /> {pc.specs.ramOptions[0].value}
                              </span>
                            )}
                            {pc.specs?.graphiccard && (
                              <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                                <FaGripfire className="mr-1 text-red-400 text-xs" /> GPU
                              </span>
                            )}
                          </div>

                          {/* Features Tags */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {pc.specs?.liquidcooler && (
                              <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded flex items-center">
                                <FaSnowflake className="mr-1 text-xs" /> Liquid Cooled
                              </span>
                            )}
                            {pc.specs?.wifi && (
                              <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded flex items-center">
                                <FaWifi className="mr-1 text-xs" /> WiFi
                              </span>
                            )}
                            {pc.specs?.bluetooth && (
                              <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded flex items-center">
                                <FaBluetoothB className="mr-1 text-xs" /> Bluetooth
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
                                    i < (pc.rating || 4)
                                      ? 'text-yellow-400'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({pc.reviews?.length || 0})
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-xl font-bold text-indigo-400">
                                {formatPrice(totalPrice)}
                              </span>
                              {pc.originalPrice > totalPrice && (
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                  {formatPrice(pc.originalPrice)}
                                </span>
                              )}
                            </div>
                            {pc.inStock ? (
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
                              console.log('Adding to cart:', pc);
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
                <div className="text-6xl text-gray-600 mb-4">🖥️</div>
                <h3 className="text-xl font-medium text-white mb-2">No PCs found</h3>
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
              onClick={() => setCategory("Gaming")}
            >
              <FaGamepad className="text-4xl mx-auto mb-3" />
              <h3 className="font-bold text-lg">Gaming PCs</h3>
              <p className="text-sm text-white/70 mt-2">High performance for gaming</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white text-center cursor-pointer hover:shadow-xl transition-all"
              onClick={() => setCategory("Office")}
            >
              <FaBriefcase className="text-4xl mx-auto mb-3" />
              <h3 className="font-bold text-lg">Office PCs</h3>
              <p className="text-sm text-white/70 mt-2">Reliable for daily work</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-xl p-6 text-white text-center cursor-pointer hover:shadow-xl transition-all"
              onClick={() => setCategory("Workstation")}
            >
              <FaServer className="text-4xl mx-auto mb-3" />
              <h3 className="font-bold text-lg">Workstations</h3>
              <p className="text-sm text-white/70 mt-2">Professional performance</p>
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
                    Compare PCs
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
                      const pc = pcs.find(p => p._id === productId);
                      if (!pc) return null;
                      
                      return (
                        <div key={productId} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                          <img
                            src={getImageUrl(pc.image)}
                            alt={pc.name}
                            className="h-32 object-contain mb-4 mx-auto"
                          />
                          <h3 className="font-semibold text-white mb-2 text-center line-clamp-2">{pc.name}</h3>
                          <p className="text-indigo-400 font-bold mb-2 text-center">{formatPrice(calculateTotalPrice(pc))}</p>
                          <button
                            onClick={() => {
                              setShowCompareModal(false);
                              navigate(`/pc/${productId}`);
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

export default PreBuiltPCs;