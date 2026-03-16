// src/pages/PC_Components.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaSdCard,
  FaBolt,
  FaFan,
  FaDesktop,
  FaGamepad,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaFilter,
  FaSort,
  FaSearch,
  FaTimes,
  FaTachometerAlt,
  FaThermometerHalf,
  FaUsb,
  FaEthernet,
  FaWifi,
  FaBluetooth,
  FaCogs,
  FaRuler,
  FaWeight,
  FaPalette,
  FaPlug,
  FaServer,
  FaDatabase,
  FaClock,
  FaShieldAlt,
  FaTools
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PCComponents = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    brands: [],
    types: [],
    sockets: [],
    chipsets: [],
    ramTypes: [],
    features: []
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 1
  });
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedSocket, setSelectedSocket] = useState('all');
  const [selectedChipset, setSelectedChipset] = useState('all');
  const [selectedRamType, setSelectedRamType] = useState('all');
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

  // Safe string conversion helper
  const safeToLowerCase = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value.toLowerCase();
    if (Array.isArray(value)) return value.map(item => String(item).toLowerCase()).join(' ');
    if (typeof value === 'object') return JSON.stringify(value).toLowerCase();
    return String(value).toLowerCase();
  };

  // Fetch PC component products
  useEffect(() => {
    const fetchPCComponents = async () => {
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
        if (selectedSocket !== 'all') params.append('socket', selectedSocket);
        if (selectedChipset !== 'all') params.append('chipset', selectedChipset);
        if (selectedRamType !== 'all') params.append('ramType', selectedRamType);
        if (searchTerm) params.append('search', searchTerm);
        
        const response = await fetch(`${BASE_URL}/api/components?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('PC Components API response:', data);
        
        // Handle different response formats
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
          setFilteredProducts(data.products);
          setPagination(data.pagination || {
            total: data.products.length,
            page: 1,
            limit: 12,
            pages: Math.ceil(data.products.length / 12)
          });
          
          // Extract filters from response if available
          setFilters({
            brands: data.filters?.brands || [],
            types: data.filters?.types || [],
            sockets: data.filters?.sockets || [],
            chipsets: data.filters?.chipsets || [],
            ramTypes: data.filters?.ramTypes || [],
            features: data.filters?.features || []
          });
        } else if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
          setPagination({
            total: data.length,
            page: 1,
            limit: 12,
            pages: Math.ceil(data.length / 12)
          });
        } else {
          console.error('Unexpected API response format:', data);
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (err) {
        console.error('Error fetching PC components:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPCComponents();
  }, [currentPage, sortBy, selectedType, selectedBrand, selectedSocket, selectedChipset, selectedRamType, searchTerm, priceRange.min, priceRange.max]);

  // Extract unique filter options from products (fallback if API doesn't provide filters)
  useEffect(() => {
    if (products.length > 0 && filters.brands.length === 0) {
      const brands = new Set();
      const types = new Set();
      const sockets = new Set();
      const chipsets = new Set();
      const ramTypes = new Set();
      const features = new Set();

      products.forEach(product => {
        if (product.brand) brands.add(product.brand);
        
        const name = safeToLowerCase(product.name);
        const category = safeToLowerCase(product.category);
        const specs = product.specs || {};
        
        // Determine component type
        if (name.includes('cpu') || name.includes('processor') || category.includes('cpu')) {
          types.add('CPU');
          if (specs.socket) sockets.add(specs.socket);
        }
        if (name.includes('gpu') || name.includes('graphics') || category.includes('gpu')) {
          types.add('GPU');
          if (specs.memory) features.add(`Memory: ${specs.memory}`);
        }
        if (name.includes('ram') || name.includes('memory') || category.includes('ram')) {
          types.add('RAM');
          if (specs.ramType) ramTypes.add(specs.ramType);
        }
        if (name.includes('ssd') || name.includes('hdd') || name.includes('storage') || category.includes('storage')) {
          types.add('Storage');
        }
        if (name.includes('motherboard') || category.includes('motherboard')) {
          types.add('Motherboard');
          if (specs.chipset) chipsets.add(specs.chipset);
          if (specs.cpuSocket) sockets.add(specs.cpuSocket);
        }
        if (name.includes('power supply') || name.includes('psu') || category.includes('psu')) {
          types.add('Power Supply');
          if (specs.wattage) features.add(`Wattage: ${specs.wattage}W`);
        }
        if (name.includes('cooler') || name.includes('cooling') || category.includes('cooler')) {
          types.add('Cooler');
        }
        if (name.includes('case') || name.includes('cabinet') || category.includes('case')) {
          types.add('Case');
        }

        // Extract features from specs
        if (specs.wifi) features.add('WiFi');
        if (specs.bluetooth) features.add('Bluetooth');
        if (specs.rgb) features.add('RGB Lighting');
        if (specs.fanless) features.add('Fanless');
        if (specs.modular) features.add('Modular');
        if (specs.overclocking) features.add('Overclockable');
      });

      setFilters({
        brands: Array.from(brands).sort(),
        types: Array.from(types).sort(),
        sockets: Array.from(sockets).sort(),
        chipsets: Array.from(chipsets).sort(),
        ramTypes: Array.from(ramTypes).sort(),
        features: Array.from(features).sort()
      });
    }
  }, [products]);

  // Apply filters and sorting (local filtering as backup)
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

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(product => {
        const name = safeToLowerCase(product.name);
        const category = safeToLowerCase(product.category);
        
        switch(selectedType) {
          case 'CPU':
            return name.includes('cpu') || name.includes('processor') || category.includes('cpu');
          case 'GPU':
            return name.includes('gpu') || name.includes('graphics') || category.includes('gpu');
          case 'RAM':
            return name.includes('ram') || name.includes('memory') || category.includes('ram');
          case 'Storage':
            return name.includes('ssd') || name.includes('hdd') || name.includes('storage') || category.includes('storage');
          case 'Motherboard':
            return name.includes('motherboard') || category.includes('motherboard');
          case 'Power Supply':
            return name.includes('power supply') || name.includes('psu') || category.includes('psu');
          case 'Cooler':
            return name.includes('cooler') || name.includes('cooling') || category.includes('cooler');
          case 'Case':
            return name.includes('case') || name.includes('cabinet') || category.includes('case');
          default:
            return true;
        }
      });
    }

    // Apply brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Apply socket filter
    if (selectedSocket !== 'all') {
      filtered = filtered.filter(product => {
        const specs = product.specs || {};
        return specs.socket === selectedSocket || specs.cpuSocket === selectedSocket;
      });
    }

    // Apply chipset filter
    if (selectedChipset !== 'all') {
      filtered = filtered.filter(product => {
        const specs = product.specs || {};
        return specs.chipset === selectedChipset;
      });
    }

    // Apply RAM type filter
    if (selectedRamType !== 'all') {
      filtered = filtered.filter(product => {
        const specs = product.specs || {};
        return specs.ramType === selectedRamType;
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
          if (feature.includes('Wattage:')) {
            const wattage = feature.replace('Wattage:', '').trim();
            return specs.wattage?.includes(wattage);
          }
          if (feature.includes('Memory:')) {
            const memory = feature.replace('Memory:', '').trim();
            return specs.memory?.includes(memory);
          }
          switch(feature) {
            case 'WiFi':
              return specs.wifi || description.includes('wifi');
            case 'Bluetooth':
              return specs.bluetooth || description.includes('bluetooth');
            case 'RGB Lighting':
              return specs.rgb || description.includes('rgb');
            case 'Fanless':
              return specs.fanless || description.includes('fanless');
            case 'Modular':
              return specs.modular || description.includes('modular');
            case 'Overclockable':
              return specs.overclocking || description.includes('overclock');
            default:
              return description.includes(feature.toLowerCase()) || 
                     Object.values(specs).some(val => String(val).toLowerCase().includes(feature.toLowerCase()));
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
  }, [products, searchTerm, selectedType, selectedBrand, selectedSocket, selectedChipset, selectedRamType, priceRange, selectedFeatures, sortBy]);

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
      } else if (prev.length < 4) {
        return [...prev, productId];
      }
      alert('You can compare up to 4 products at a time');
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
    navigate(`/components/${productId}`);
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

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get component type and icon
  const getComponentInfo = (product) => {
    const name = safeToLowerCase(product.name);
    const category = safeToLowerCase(product.category);
    const specs = product.specs || {};
    
    if (name.includes('cpu') || name.includes('processor') || category.includes('cpu')) {
      return { 
        type: 'CPU', 
        icon: <FaMicrochip className="text-blue-500" />,
        color: 'bg-blue-100 text-blue-800'
      };
    }
    if (name.includes('gpu') || name.includes('graphics') || category.includes('gpu')) {
      return { 
        type: 'GPU', 
        icon: <FaServer className="text-green-500" />,
        color: 'bg-green-100 text-green-800'
      };
    }
    if (name.includes('ram') || name.includes('memory') || category.includes('ram')) {
      return { 
        type: 'RAM', 
        icon: <FaMemory className="text-purple-500" />,
        color: 'bg-purple-100 text-purple-800'
      };
    }
    if (name.includes('ssd') || name.includes('hdd') || name.includes('storage') || category.includes('storage')) {
      return { 
        type: 'Storage', 
        icon: <FaHdd className="text-yellow-600" />,
        color: 'bg-yellow-100 text-yellow-800'
      };
    }
    if (name.includes('motherboard') || category.includes('motherboard')) {
      return { 
        type: 'Motherboard', 
        icon: <FaMicrochip className="text-indigo-500" />,
        color: 'bg-indigo-100 text-indigo-800'
      };
    }
    if (name.includes('power supply') || name.includes('psu') || category.includes('psu')) {
      return { 
        type: 'PSU', 
        icon: <FaBolt className="text-orange-500" />,
        color: 'bg-orange-100 text-orange-800'
      };
    }
    if (name.includes('cooler') || name.includes('cooling') || category.includes('cooler')) {
      return { 
        type: 'Cooler', 
        icon: <FaFan className="text-cyan-500" />,
        color: 'bg-cyan-100 text-cyan-800'
      };
    }
    if (name.includes('case') || name.includes('cabinet') || category.includes('case')) {
      return { 
        type: 'Case', 
        icon: <FaDesktop className="text-gray-600" />,
        color: 'bg-gray-100 text-gray-800'
      };
    }
    return { 
      type: 'Component', 
      icon: <FaCogs className="text-gray-500" />,
      color: 'bg-gray-100 text-gray-800'
    };
  };

  // Get key specs based on component type
  const getKeySpecs = (product) => {
    const info = getComponentInfo(product);
    const specs = product.specs || {};
    const specList = [];

    switch(info.type) {
      case 'CPU':
        if (specs.socket) specList.push({ label: 'Socket', value: specs.socket });
        if (specs.cores) specList.push({ label: 'Cores', value: specs.cores });
        if (specs.threads) specList.push({ label: 'Threads', value: specs.threads });
        if (specs.baseClock) specList.push({ label: 'Base Clock', value: specs.baseClock });
        if (specs.boostClock) specList.push({ label: 'Boost Clock', value: specs.boostClock });
        if (specs.tdp) specList.push({ label: 'TDP', value: `${specs.tdp}W` });
        break;
      case 'GPU':
        if (specs.memory) specList.push({ label: 'Memory', value: specs.memory });
        if (specs.memoryType) specList.push({ label: 'Memory Type', value: specs.memoryType });
        if (specs.coreClock) specList.push({ label: 'Core Clock', value: specs.coreClock });
        if (specs.tdp) specList.push({ label: 'TDP', value: `${specs.tdp}W` });
        break;
      case 'RAM':
        if (specs.ramType) specList.push({ label: 'Type', value: specs.ramType });
        if (specs.speed) specList.push({ label: 'Speed', value: specs.speed });
        if (specs.capacity) specList.push({ label: 'Capacity', value: specs.capacity });
        if (specs.casLatency) specList.push({ label: 'CAS Latency', value: specs.casLatency });
        break;
      case 'Storage':
        if (specs.capacity) specList.push({ label: 'Capacity', value: specs.capacity });
        if (specs.interface) specList.push({ label: 'Interface', value: specs.interface });
        if (specs.formFactor) specList.push({ label: 'Form Factor', value: specs.formFactor });
        if (specs.readSpeed) specList.push({ label: 'Read Speed', value: specs.readSpeed });
        if (specs.writeSpeed) specList.push({ label: 'Write Speed', value: specs.writeSpeed });
        break;
      case 'Motherboard':
        if (specs.cpuSocket) specList.push({ label: 'CPU Socket', value: specs.cpuSocket });
        if (specs.chipset) specList.push({ label: 'Chipset', value: specs.chipset });
        if (specs.ramType) specList.push({ label: 'RAM Type', value: specs.ramType });
        if (specs.ramSlots) specList.push({ label: 'RAM Slots', value: specs.ramSlots });
        if (specs.maxRam) specList.push({ label: 'Max RAM', value: specs.maxRam });
        if (specs.formFactor) specList.push({ label: 'Form Factor', value: specs.formFactor });
        break;
      case 'PSU':
        if (specs.wattage) specList.push({ label: 'Wattage', value: `${specs.wattage}W` });
        if (specs.efficiency) specList.push({ label: 'Efficiency', value: specs.efficiency });
        if (specs.modular) specList.push({ label: 'Modular', value: specs.modular ? 'Yes' : 'No' });
        break;
      case 'Cooler':
        if (specs.type) specList.push({ label: 'Type', value: specs.type });
        if (specs.fanSize) specList.push({ label: 'Fan Size', value: specs.fanSize });
        if (specs.noiseLevel) specList.push({ label: 'Noise Level', value: specs.noiseLevel });
        if (specs.airflow) specList.push({ label: 'Airflow', value: specs.airflow });
        break;
      case 'Case':
        if (specs.type) specList.push({ label: 'Type', value: specs.type });
        if (specs.color) specList.push({ label: 'Color', value: specs.color });
        if (specs.motherboardSupport) specList.push({ label: 'Mobo Support', value: specs.motherboardSupport });
        if (specs.psuSupport) specList.push({ label: 'PSU Support', value: specs.psuSupport });
        if (specs.gpuLength) specList.push({ label: 'Max GPU Length', value: specs.gpuLength });
        break;
      default:
        if (specs.specs) {
          const firstSpecs = Object.entries(specs).slice(0, 3);
          firstSpecs.forEach(([key, value]) => {
            if (value && key !== '_id') {
              specList.push({ 
                label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), 
                value: String(value) 
              });
            }
          });
        }
    }

    return specList.slice(0, 4); // Return top 4 specs
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
          <p className="text-white text-lg font-medium mt-4">Loading PC components...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we prepare the best components for you</p>
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
            <FaMicrochip className="mr-4 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              PC Components
            </span>
          </h1>
          <p className="text-lg text-gray-400">
            Build your dream PC with high-quality CPUs, GPUs, RAM, storage, and more
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
              placeholder="Search components..."
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
            {/* Component Type */}
            {filters.types.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <FaMicrochip className="mr-2 text-indigo-400" />
                  Component Type
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
                    <span className="text-gray-300">All Components</span>
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
                  {filters.brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
            )}

            {/* CPU Socket */}
            {filters.sockets.length > 0 && (selectedType === 'all' || selectedType === 'CPU' || selectedType === 'Motherboard') && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <FaPlug className="mr-2 text-indigo-400" />
                  CPU Socket
                </h3>
                <select
                  value={selectedSocket}
                  onChange={(e) => setSelectedSocket(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Sockets</option>
                  {filters.sockets.map(socket => (
                    <option key={socket} value={socket}>{socket}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Chipset */}
            {filters.chipsets.length > 0 && (selectedType === 'all' || selectedType === 'Motherboard') && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4">Chipset</h3>
                <select
                  value={selectedChipset}
                  onChange={(e) => setSelectedChipset(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Chipsets</option>
                  {filters.chipsets.map(chipset => (
                    <option key={chipset} value={chipset}>{chipset}</option>
                  ))}
                </select>
              </div>
            )}

            {/* RAM Type */}
            {filters.ramTypes.length > 0 && (selectedType === 'all' || selectedType === 'RAM' || selectedType === 'Motherboard') && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4">RAM Type</h3>
                <select
                  value={selectedRamType}
                  onChange={(e) => setSelectedRamType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All RAM Types</option>
                  {filters.ramTypes.map(ramType => (
                    <option key={ramType} value={ramType}>{ramType}</option>
                  ))}
                </select>
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
                setSelectedSocket('all');
                setSelectedChipset('all');
                setSelectedRamType('all');
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {currentProducts.map((product, index) => {
                    const componentInfo = getComponentInfo(product);
                    const keySpecs = getKeySpecs(product);
                    
                    return (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
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
                            <span className={`${componentInfo.color} text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1`}>
                              {componentInfo.icon} {componentInfo.type}
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
                          <div className="space-y-1 mb-3">
                            {keySpecs.map((spec, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span className="text-gray-500">{spec.label}:</span>
                                <span className="font-medium text-gray-300">{spec.value}</span>
                              </div>
                            ))}
                          </div>
                          
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
                                {formatPrice(product.finalPrice || product.price)}
                              </span>
                              {product.originalPrice > product.price && (
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
                            onClick={(e) => handleAddToCart(product, e)}
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
                <div className="text-6xl text-gray-600 mb-4">🔧</div>
                <h3 className="text-xl font-medium text-white mb-2">No components found</h3>
                <p className="text-gray-400">Try adjusting your filters or search term</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Component Categories */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Shop by Component
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { name: 'CPU', icon: <FaMicrochip />, color: 'from-blue-600 to-blue-700' },
              { name: 'GPU', icon: <FaServer />, color: 'from-green-600 to-green-700' },
              { name: 'RAM', icon: <FaMemory />, color: 'from-purple-600 to-purple-700' },
              { name: 'Storage', icon: <FaHdd />, color: 'from-yellow-600 to-yellow-700' },
              { name: 'Motherboard', icon: <FaMicrochip />, color: 'from-indigo-600 to-indigo-700' },
              { name: 'PSU', icon: <FaBolt />, color: 'from-orange-600 to-orange-700' },
              { name: 'Cooler', icon: <FaFan />, color: 'from-cyan-600 to-cyan-700' },
              { name: 'Case', icon: <FaDesktop />, color: 'from-gray-600 to-gray-700' }
            ].map((cat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-r ${cat.color} rounded-xl p-4 text-white text-center cursor-pointer hover:shadow-xl transition-all`}
                onClick={() => setSelectedType(cat.name)}
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <h3 className="font-bold text-sm">{cat.name}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Build Guide */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">PC Building Guide</h3>
              <p className="text-white/80 mb-6">
                New to PC building? Check out our comprehensive guides on how to choose compatible components and build your dream PC.
              </p>
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition transform hover:scale-105">
                View Building Guides
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Compatibility</h4>
                <p className="text-sm text-white/70">Ensure all parts work together</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Performance</h4>
                <p className="text-sm text-white/70">Balance your build</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Budget</h4>
                <p className="text-sm text-white/70">Get the best value</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Future Upgrades</h4>
                <p className="text-sm text-white/70">Plan for tomorrow</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {compareList.map(productId => {
                      const product = products.find(p => p._id === productId);
                      if (!product) return null;
                      
                      return (
                        <div key={productId} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="h-32 object-contain mb-4"
                          />
                          <h3 className="font-semibold text-white mb-2">{product.name}</h3>
                          <p className="text-indigo-400 font-bold mb-2">{formatPrice(product.finalPrice || product.price)}</p>
                          <button
                            onClick={() => navigate(`/components/${productId}`)}
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

export default PCComponents;