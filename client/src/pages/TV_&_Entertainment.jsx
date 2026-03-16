// src/pages/TV_Entertainment.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FaTv,
  FaFilm,
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
  FaUsb,
  FaRuler,
  FaWeight,
  FaPalette,
  FaPlug,
  FaGamepad,
  FaMusic,
  FaHeadphones,
  FaVolumeUp,
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaClock,
  FaTachometerAlt,
  FaBolt,
  FaCogs,
  FaSatellite,
  FaBroadcastTower,
  FaCloud,
  FaApple,
  FaAndroid,
  FaGoogle,
  FaAmazon,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaTh,
  FaList,
  FaChevronDown,
  FaChevronUp,
  FaMobileAlt,
  FaTabletAlt,
  FaDesktop,
  FaVolumeMute,
  FaPodcast
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const TVEntertainment = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedResolution, setSelectedResolution] = useState('all');
  const [selectedScreenSize, setSelectedScreenSize] = useState('all');
  const [selectedTechnology, setSelectedTechnology] = useState('all');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000000 });
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

  // Helper function to safely convert any value to lowercase string
  const safeToLowerCase = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value.toLowerCase();
    if (Array.isArray(value)) return value.map(item => String(item).toLowerCase()).join(' ');
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value.toString();
    return '';
  };

  // Helper function to safely get category as string
  const getCategoryString = (category) => {
    if (!category) return '';
    if (Array.isArray(category)) {
      return category.map(item => safeToLowerCase(item)).join(' ');
    }
    if (typeof category === 'string') {
      return category.toLowerCase();
    }
    if (typeof category === 'object') {
      return JSON.stringify(category).toLowerCase();
    }
    return '';
  };

  // Fetch TV and entertainment products
  useEffect(() => {
    const fetchTVProducts = async () => {
      try {
        setLoading(true);
        // Fetch from the dedicated tv endpoint
        const response = await fetch(`${BASE_URL}/api/tv`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('TV API response:', data);
        
        // Check if the response has the expected structure
        if (data.success && Array.isArray(data.products)) {
          console.log('Products found:', data.products.length);
          
          // Sanitize products to ensure all fields are safe
          const sanitizedProducts = data.products.map(product => ({
            _id: product._id || product.id || '',
            name: product.name || '',
            brand: product.brand || '',
            description: product.description || '',
            category: product.category || [],
            specs: product.specs || {},
            price: product.price || 0,
            originalPrice: product.originalPrice || 0,
            finalPrice: product.finalPrice || product.price || 0,
            discount: product.discount || 0,
            inStock: product.inStock !== undefined ? product.inStock : true,
            stock: product.stock || 0,
            image: product.image || [],
            rating: product.rating || 4,
            reviews: product.reviews || [],
            reviewCount: product.reviews?.length || 0,
            popularity: product.popularity || 0,
            type: product.type || 'Television'
          }));
          
          console.log('Sanitized products:', sanitizedProducts);
          setProducts(sanitizedProducts);
          setFilteredProducts(sanitizedProducts);
        } else if (Array.isArray(data)) {
          console.log('Products found (array):', data.length);
          
          const sanitizedProducts = data.map(product => ({
            _id: product._id || product.id || '',
            name: product.name || '',
            brand: product.brand || '',
            description: product.description || '',
            category: product.category || [],
            specs: product.specs || {},
            price: product.price || 0,
            originalPrice: product.originalPrice || 0,
            finalPrice: product.finalPrice || product.price || 0,
            discount: product.discount || 0,
            inStock: product.inStock !== undefined ? product.inStock : true,
            stock: product.stock || 0,
            image: product.image || [],
            rating: product.rating || 4,
            reviews: product.reviews || [],
            reviewCount: product.reviews?.length || 0,
            popularity: product.popularity || 0,
            type: product.type || 'Television'
          }));
          
          setProducts(sanitizedProducts);
          setFilteredProducts(sanitizedProducts);
        } else {
          console.error('Unexpected API response format:', data);
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (err) {
        console.error('Error fetching TV products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTVProducts();
  }, []);

  // Extract unique filter options from products
  const filters = React.useMemo(() => {
    const brands = new Set();
    const types = new Set();
    const resolutions = new Set();
    const screenSizes = new Set();
    const technologies = new Set();
    const features = new Set();

    products.forEach(product => {
      if (product.brand) brands.add(product.brand);
      
      const name = safeToLowerCase(product.name);
      const categoryStr = getCategoryString(product.category);
      const description = safeToLowerCase(product.description);
      const specs = product.specs || {};
      
      // Determine type from product.type or name
      const productType = product.type || '';
      
      if (productType === 'Television' || name.includes('tv') || name.includes('television') || categoryStr.includes('tv')) {
        types.add('Television');
      }
      if (productType === 'OLED TV' || name.includes('oled') || description.includes('oled') || safeToLowerCase(specs.displayTechnology).includes('oled')) {
        types.add('OLED TV');
        technologies.add('OLED');
      }
      if (productType === 'QLED TV' || name.includes('qled') || description.includes('qled') || safeToLowerCase(specs.displayTechnology).includes('qled')) {
        types.add('QLED TV');
        technologies.add('QLED');
      }
      if (productType === 'LED TV' || name.includes('led') || description.includes('led') || safeToLowerCase(specs.displayTechnology).includes('led')) {
        types.add('LED TV');
        technologies.add('LED');
      }
      if (productType === 'Projector' || name.includes('projector') || categoryStr.includes('projector')) {
        types.add('Projector');
      }
      if (productType === 'Soundbar' || name.includes('soundbar') || categoryStr.includes('soundbar')) {
        types.add('Soundbar');
      }
      if (productType === 'Home Theater' || name.includes('home theater') || categoryStr.includes('home theater')) {
        types.add('Home Theater');
      }
      if (productType === 'Streaming Device' || name.includes('streaming') || categoryStr.includes('streaming')) {
        types.add('Streaming Device');
      }

      // Resolution
      if (specs.resolution) {
        if (specs.resolution.includes('4K') || specs.resolution.includes('2160')) resolutions.add('4K');
        if (specs.resolution.includes('8K') || specs.resolution.includes('4320')) resolutions.add('8K');
      }
      if (name.includes('4k') || description.includes('4k')) resolutions.add('4K');
      if (name.includes('8k') || description.includes('8k')) resolutions.add('8K');

      // Extract screen size
      const screenSizeStr = specs.screenSize || '';
      const sizeMatch = screenSizeStr.match(/(\d+)/) || 
                       name.match(/(\d+)\s*inch|\d+\s*"/i) || 
                       description.match(/(\d+)\s*inch|\d+\s*"/i);
      if (sizeMatch) {
        const size = parseInt(sizeMatch[1] || sizeMatch[0]);
        if (size < 32) screenSizes.add('Under 32"');
        else if (size < 43) screenSizes.add('32" - 42"');
        else if (size < 55) screenSizes.add('43" - 54"');
        else if (size < 65) screenSizes.add('55" - 64"');
        else if (size < 75) screenSizes.add('65" - 74"');
        else screenSizes.add('75" and above');
      }

      // Extract features
      if (description.includes('smart tv') || description.includes('smart') || specs.smartPlatform) {
        features.add('Smart TV');
      }
      if (description.includes('hdr') || description.includes('high dynamic range') || specs.hdrSupport) {
        features.add('HDR');
      }
      if (description.includes('dolby vision') || (specs.hdrSupport && safeToLowerCase(specs.hdrSupport).includes('dolby vision'))) {
        features.add('Dolby Vision');
      }
      if (description.includes('dolby atmos') || (specs.audioTechnologies && specs.audioTechnologies.includes('Dolby Atmos'))) {
        features.add('Dolby Atmos');
      }
      if (description.includes('120hz') || description.includes('120Hz') || (specs.refreshRate && specs.refreshRate.includes('120'))) {
        features.add('120Hz Refresh Rate');
      }
      if (description.includes('gaming') || description.includes('game mode') || specs.gameMode) {
        features.add('Gaming Mode');
      }
      if (description.includes('vrr') || description.includes('variable refresh rate') || specs.vrrSupport) {
        features.add('VRR');
      }
      if (description.includes('hdmi 2.1') || (specs.hdmiVersion && specs.hdmiVersion.includes('2.1'))) {
        features.add('HDMI 2.1');
      }
      if (description.includes('wifi') || description.includes('wi-fi') || specs.wifi) {
        features.add('WiFi');
      }
      if (description.includes('bluetooth') || specs.bluetooth) {
        features.add('Bluetooth');
      }
      if (description.includes('voice control') || description.includes('voice assistant') || specs.voiceAssistant) {
        features.add('Voice Control');
      }
      if (description.includes('wall mount') || description.includes('wall mountable') || specs.vesaMount) {
        features.add('Wall Mountable');
      }
    });

    return {
      brands: Array.from(brands).sort(),
      types: Array.from(types).sort(),
      resolutions: Array.from(resolutions).sort(),
      screenSizes: Array.from(screenSizes).sort((a, b) => {
        // Custom sort for screen sizes
        const order = ['Under 32"', '32" - 42"', '43" - 54"', '55" - 64"', '65" - 74"', '75" and above'];
        return order.indexOf(a) - order.indexOf(b);
      }),
      technologies: Array.from(technologies).sort(),
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
        const description = safeToLowerCase(product.description);
        const specs = product.specs || {};
        const productType = product.type || '';
        
        switch(selectedType) {
          case 'Television':
            return productType === 'Television' || 
                   name.includes('tv') || 
                   name.includes('television') || 
                   categoryStr.includes('tv');
          case 'OLED TV':
            return productType === 'OLED TV' || 
                   name.includes('oled') || 
                   description.includes('oled') || 
                   safeToLowerCase(specs.displayTechnology).includes('oled');
          case 'QLED TV':
            return productType === 'QLED TV' || 
                   name.includes('qled') || 
                   description.includes('qled') || 
                   safeToLowerCase(specs.displayTechnology).includes('qled');
          case 'LED TV':
            return productType === 'LED TV' || 
                   (name.includes('led') || description.includes('led') || safeToLowerCase(specs.displayTechnology).includes('led'));
          case 'Projector':
            return productType === 'Projector' || 
                   name.includes('projector') || 
                   categoryStr.includes('projector') || 
                   specs.projectorType;
          case 'Soundbar':
            return productType === 'Soundbar' || 
                   name.includes('soundbar') || 
                   categoryStr.includes('soundbar');
          case 'Home Theater':
            return productType === 'Home Theater' || 
                   name.includes('home theater') || 
                   categoryStr.includes('home theater');
          case 'Streaming Device':
            return productType === 'Streaming Device' || 
                   name.includes('streaming') || 
                   categoryStr.includes('streaming');
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
        const name = safeToLowerCase(product.name);
        const description = safeToLowerCase(product.description);
        const specs = product.specs || {};
        return name.includes(safeToLowerCase(selectedResolution)) || 
               description.includes(safeToLowerCase(selectedResolution)) ||
               (specs.resolution && specs.resolution.includes(selectedResolution));
      });
    }

    // Apply screen size filter
    if (selectedScreenSize !== 'all') {
      filtered = filtered.filter(product => {
        const specs = product.specs || {};
        const name = safeToLowerCase(product.name);
        const description = safeToLowerCase(product.description);
        
        // Try to get screen size from specs first
        let screenSizeStr = specs.screenSize || '';
        const sizeMatch = screenSizeStr.match(/(\d+)/) || 
                         name.match(/(\d+)\s*inch|\d+\s*"/i) || 
                         description.match(/(\d+)\s*inch|\d+\s*"/i);
        
        if (!sizeMatch) return false;
        
        const size = parseInt(sizeMatch[1] || sizeMatch[0]);
        
        switch(selectedScreenSize) {
          case 'Under 32"':
            return size < 32;
          case '32" - 42"':
            return size >= 32 && size < 43;
          case '43" - 54"':
            return size >= 43 && size < 55;
          case '55" - 64"':
            return size >= 55 && size < 65;
          case '65" - 74"':
            return size >= 65 && size < 75;
          case '75" and above':
            return size >= 75;
          default:
            return true;
        }
      });
    }

    // Apply technology filter
    if (selectedTechnology !== 'all') {
      filtered = filtered.filter(product => {
        const name = safeToLowerCase(product.name);
        const description = safeToLowerCase(product.description);
        const specs = product.specs || {};
        const techLower = safeToLowerCase(selectedTechnology);
        return name.includes(techLower) || 
               description.includes(techLower) ||
               safeToLowerCase(specs.displayTechnology).includes(techLower);
      });
    }

    // Apply price filter
    filtered = filtered.filter(product => 
      (product.price || 0) >= priceRange.min && (product.price || 0) <= priceRange.max
    );

    // Apply features filter
    if (selectedFeatures.length > 0) {
      filtered = filtered.filter(product => {
        const name = safeToLowerCase(product.name);
        const description = safeToLowerCase(product.description);
        const specs = product.specs || {};
        
        return selectedFeatures.every(feature => {
          switch(feature) {
            case '4K':
              return name.includes('4k') || description.includes('4k') || (specs.resolution && specs.resolution.includes('4K'));
            case '8K':
              return name.includes('8k') || description.includes('8k') || (specs.resolution && specs.resolution.includes('8K'));
            case 'Smart TV':
              return description.includes('smart tv') || description.includes('smart') || specs.smartPlatform;
            case 'HDR':
              return description.includes('hdr') || description.includes('high dynamic range') || specs.hdrSupport;
            case 'Dolby Vision':
              return description.includes('dolby vision') || (specs.hdrSupport && safeToLowerCase(specs.hdrSupport).includes('dolby vision'));
            case 'Dolby Atmos':
              return description.includes('dolby atmos') || (specs.audioTechnologies && specs.audioTechnologies.includes('Dolby Atmos'));
            case '120Hz Refresh Rate':
              return description.includes('120hz') || description.includes('120Hz') || (specs.refreshRate && specs.refreshRate.includes('120'));
            case 'Gaming Mode':
              return description.includes('gaming') || description.includes('game mode') || specs.gameMode;
            case 'VRR':
              return description.includes('vrr') || description.includes('variable refresh rate') || specs.vrrSupport;
            case 'HDMI 2.1':
              return description.includes('hdmi 2.1') || (specs.hdmiVersion && specs.hdmiVersion.includes('2.1'));
            case 'WiFi':
              return description.includes('wifi') || description.includes('wi-fi') || specs.wifi;
            case 'Bluetooth':
              return description.includes('bluetooth') || specs.bluetooth;
            case 'Voice Control':
              return description.includes('voice control') || description.includes('voice assistant') || specs.voiceAssistant;
            case 'Wall Mountable':
              return description.includes('wall mount') || description.includes('wall mountable') || specs.vesaMount;
            default:
              return description.includes(safeToLowerCase(feature)) || 
                     name.includes(safeToLowerCase(feature));
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
        case 'screen-size':
          // Extract screen size for sorting
          const getSize = (product) => {
            const specs = product.specs || {};
            const name = product.name || '';
            const description = product.description || '';
            
            // Try to get screen size from specs first
            let screenSizeStr = specs.screenSize || '';
            const match = screenSizeStr.match(/(\d+)/) || 
                         name.match(/(\d+)\s*inch|\d+\s*"/i) || 
                         description.match(/(\d+)\s*inch|\d+\s*"/i);
            return match ? parseInt(match[1] || match[0]) : 0;
          };
          return getSize(b) - getSize(a);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchTerm, selectedCategory, selectedType, selectedBrand, selectedResolution, selectedScreenSize, selectedTechnology, priceRange, selectedFeatures, sortBy]);

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
    navigate(`/tv/${productId}`);
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
    const specs = product.specs || {};
    const productType = product.type || '';
    
    if (productType === 'OLED TV' || name.includes('oled') || description.includes('oled') || safeToLowerCase(specs.displayTechnology).includes('oled')) {
      return { type: 'OLED TV', icon: <FaTv className="text-purple-400" />, color: 'bg-purple-900/30 text-purple-400' };
    }
    if (productType === 'QLED TV' || name.includes('qled') || description.includes('qled') || safeToLowerCase(specs.displayTechnology).includes('qled')) {
      return { type: 'QLED TV', icon: <FaTv className="text-blue-400" />, color: 'bg-blue-900/30 text-blue-400' };
    }
    if (productType === 'LED TV' || name.includes('led') || description.includes('led') || safeToLowerCase(specs.displayTechnology).includes('led')) {
      return { type: 'LED TV', icon: <FaTv className="text-green-400" />, color: 'bg-green-900/30 text-green-400' };
    }
    if (productType === 'Television' || name.includes('tv') || name.includes('television')) {
      return { type: 'TV', icon: <FaTv className="text-indigo-400" />, color: 'bg-indigo-900/30 text-indigo-400' };
    }
    if (productType === 'Projector' || name.includes('projector')) {
      return { type: 'Projector', icon: <FaVideo className="text-orange-400" />, color: 'bg-orange-900/30 text-orange-400' };
    }
    if (productType === 'Soundbar' || name.includes('soundbar')) {
      return { type: 'Soundbar', icon: <FaVolumeUp className="text-red-400" />, color: 'bg-red-900/30 text-red-400' };
    }
    if (productType === 'Home Theater' || name.includes('home theater')) {
      return { type: 'Home Theater', icon: <FaMusic className="text-yellow-400" />, color: 'bg-yellow-900/30 text-yellow-400' };
    }
    if (productType === 'Streaming Device' || name.includes('streaming')) {
      return { type: 'Streaming Device', icon: <FaFilm className="text-pink-400" />, color: 'bg-pink-900/30 text-pink-400' };
    }
    return { type: 'Display', icon: <FaTv className="text-gray-400" />, color: 'bg-gray-900/30 text-gray-400' };
  };

  // Extract screen size
  const getScreenSize = (product) => {
    const specs = product.specs || {};
    const name = product.name || '';
    const description = product.description || '';
    
    // Try to get screen size from specs first
    if (specs.screenSize) {
      const match = specs.screenSize.match(/(\d+)\s*inch|\d+\s*"/i);
      if (match) return match[0];
    }
    
    const match = name.match(/(\d+)\s*inch|\d+\s*"/i) || 
                 description.match(/(\d+)\s*inch|\d+\s*"/i);
    return match ? match[0] : null;
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
          <p className="text-white text-lg font-medium mt-4">Loading TV & entertainment products...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we find the perfect entertainment setup for you</p>
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
        <title>TV & Entertainment - Televisions, Projectors, Soundbars & More | 7HubComputers</title>
        <meta name="description" content="Discover the latest TVs, projectors, soundbars, and home entertainment systems from top brands. Experience cinema at home." />
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
              TV & Entertainment
            </span>
          </h1>
          <p className="text-lg text-gray-400">
            Discover the latest TVs, projectors, soundbars, and home entertainment systems
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
                placeholder="Search TVs, projectors, soundbars..."
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
              <option value="screen-size">Screen Size (Large to Small)</option>
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
                        setSelectedResolution('all');
                        setSelectedScreenSize('all');
                        setSelectedTechnology('all');
                        setPriceRange({ min: 0, max: 2000000 });
                        setSelectedFeatures([]);
                      }}
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Product Type */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                  <h3 className="font-semibold text-white mb-4 flex items-center">
                    <FaTv className="mr-2 text-indigo-400" />
                    Product Type
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="all"
                        checked={selectedType === 'all'}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-300">All Types</span>
                    </label>
                    {filters.types.map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={selectedType === type}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                        />
                        <span className="text-gray-300">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                {filters.brands.length > 0 && (
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-4">Brands</h3>
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
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-4">Resolution</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="resolution"
                          value="all"
                          checked={selectedResolution === 'all'}
                          onChange={(e) => setSelectedResolution(e.target.value)}
                          className="text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                        />
                        <span className="text-gray-300">All</span>
                      </label>
                      {filters.resolutions.map(res => (
                        <label key={res} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="resolution"
                            value={res}
                            checked={selectedResolution === res}
                            onChange={(e) => setSelectedResolution(e.target.value)}
                            className="text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                          />
                          <span className="text-gray-300">{res}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Screen Size */}
                {filters.screenSizes.length > 0 && (
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-4 flex items-center">
                      <FaRuler className="mr-2 text-indigo-400" />
                      Screen Size
                    </h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="screenSize"
                          value="all"
                          checked={selectedScreenSize === 'all'}
                          onChange={(e) => setSelectedScreenSize(e.target.value)}
                          className="text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                        />
                        <span className="text-gray-300">All</span>
                      </label>
                      {filters.screenSizes.map(size => (
                        <label key={size} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="screenSize"
                            value={size}
                            checked={selectedScreenSize === size}
                            onChange={(e) => setSelectedScreenSize(e.target.value)}
                            className="text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                          />
                          <span className="text-gray-300">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Display Technology */}
                {filters.technologies.length > 0 && (
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-4">Display Technology</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="technology"
                          value="all"
                          checked={selectedTechnology === 'all'}
                          onChange={(e) => setSelectedTechnology(e.target.value)}
                          className="text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                        />
                        <span className="text-gray-300">All</span>
                      </label>
                      {filters.technologies.map(tech => (
                        <label key={tech} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="technology"
                            value={tech}
                            checked={selectedTechnology === tech}
                            onChange={(e) => setSelectedTechnology(e.target.value)}
                            className="text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                          />
                          <span className="text-gray-300">{tech}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

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
                          step="10000"
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
                          step="10000"
                        />
                      </div>
                    </div>
                    
                    <input
                      type="range"
                      min="0"
                      max="2000000"
                      step="10000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full accent-indigo-500"
                    />
                    
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{formatPrice(0)}</span>
                      <span>{formatPrice(2000000)}+</span>
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
                    const screenSize = getScreenSize(product);
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
                            {screenSize && (
                              <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                                <FaRuler className="mr-1 text-indigo-400" /> {screenSize}
                              </span>
                            )}
                            {product.specs?.resolution && (
                              <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                                <FaTv className="mr-1 text-indigo-400" /> {product.specs.resolution}
                              </span>
                            )}
                            {product.specs?.refreshRate && (
                              <span className="bg-gray-700 px-2 py-1 rounded flex items-center text-gray-300">
                                <FaTachometerAlt className="mr-1 text-indigo-400" /> {product.specs.refreshRate}
                              </span>
                            )}
                          </div>

                          {/* Features Tags */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {product.description?.toLowerCase().includes('smart') && (
                              <span className="text-xs bg-indigo-900/30 text-indigo-400 px-2 py-0.5 rounded">Smart TV</span>
                            )}
                            {product.description?.toLowerCase().includes('4k') && (
                              <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">4K</span>
                            )}
                            {product.description?.toLowerCase().includes('hdr') && (
                              <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded">HDR</span>
                            )}
                            {product.specs?.hdmiPorts && (
                              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                                {product.specs.hdmiPorts} HDMI
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
                <div className="text-6xl text-gray-600 mb-4">📺</div>
                <h3 className="text-xl font-medium text-white mb-2">No TV or entertainment products found</h3>
                <p className="text-gray-400">Try adjusting your filters or search term</p>
                <p className="text-sm text-gray-500 mt-2">Products in state: {products.length}</p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { name: 'Samsung', icon: <FaTv />, color: 'from-blue-600 to-blue-800' },
              { name: 'LG', icon: <FaTv />, color: 'from-red-600 to-red-800' },
              { name: 'Sony', icon: <FaTv />, color: 'from-gray-700 to-gray-900' },
              { name: 'Panasonic', icon: <FaTv />, color: 'from-blue-500 to-blue-700' },
              { name: 'TCL', icon: <FaTv />, color: 'from-green-600 to-green-800' },
              { name: 'Xiaomi', icon: <FaMobileAlt />, color: 'from-orange-600 to-orange-800' },
              { name: 'OnePlus', icon: <FaMobileAlt />, color: 'from-red-600 to-red-800' },
              { name: 'Philips', icon: <FaTv />, color: 'from-blue-400 to-blue-600' }
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

        {/* Streaming Services */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Streaming Services</h3>
              <p className="text-white/80 mb-6">
                Enjoy your favorite content with built-in streaming apps. Compatible with all major platforms.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/20 p-3 rounded-lg flex items-center gap-2">
                  <span className="text-red-400 font-bold">N</span> Netflix
                </div>
                <div className="bg-white/20 p-3 rounded-lg flex items-center gap-2">
                  <span className="text-red-400 font-bold">YT</span> YouTube
                </div>
                <div className="bg-white/20 p-3 rounded-lg flex items-center gap-2">
                  <FaAmazon className="text-yellow-400" /> Prime Video
                </div>
                <div className="bg-white/20 p-3 rounded-lg flex items-center gap-2">
                  <span className="text-green-400 font-bold">S</span> Spotify
                </div>
                <div className="bg-white/20 p-3 rounded-lg flex items-center gap-2">
                  <FaApple className="text-gray-300" /> Apple TV
                </div>
                <div className="bg-white/20 p-3 rounded-lg flex items-center gap-2">
                  <FaGoogle className="text-blue-400" /> Google TV
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Smart Features</h4>
                <p className="text-sm text-white/70">Voice control, app store, screen mirroring</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Gaming Ready</h4>
                <p className="text-sm text-white/70">Low latency, VRR, Game Mode</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Audio Excellence</h4>
                <p className="text-sm text-white/70">Dolby Atmos, DTS, surround sound</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h4 className="font-bold mb-2">Connectivity</h4>
                <p className="text-sm text-white/70">HDMI 2.1, eARC, WiFi 6, Bluetooth</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Buying Guide */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            TV Buying Guide
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRuler className="text-2xl text-indigo-400" />
              </div>
              <h4 className="font-bold text-white mb-2">Screen Size</h4>
              <p className="text-sm text-gray-400">Choose based on viewing distance and room size</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTv className="text-2xl text-indigo-400" />
              </div>
              <h4 className="font-bold text-white mb-2">Display Technology</h4>
              <p className="text-sm text-gray-400">OLED for perfect blacks, QLED for brightness</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFilm className="text-2xl text-indigo-400" />
              </div>
              <h4 className="font-bold text-white mb-2">Resolution</h4>
              <p className="text-sm text-gray-400">4K for most content, 8K for future-proofing</p>
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
                    Compare TV & Entertainment
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
                              <span className="text-gray-400">Size:</span>
                              <span className="text-white">{getScreenSize(product) || 'N/A'}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Resolution:</span>
                              <span className="text-white">{product.specs?.resolution || 'N/A'}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Price:</span>
                              <span className="text-indigo-400 font-bold">{formatPrice(product.finalPrice || product.price)}</span>
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

export default TVEntertainment;