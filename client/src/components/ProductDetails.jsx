import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useStripe } from '@stripe/react-stripe-js';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShoppingCart, 
  FaBolt, 
  FaStar, 
  FaRegStar, 
  FaStarHalfAlt,
  FaCheck,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaHeadphones,
  FaShare,
  FaHeart,
  FaRegHeart,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaEnvelope,
  FaPrint,
  FaDownload,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
  FaCamera,
  FaClipboardList,
  FaBoxOpen,
  FaCalendarAlt,
  FaTag,
  FaRulerCombined,
  FaWeightHanging,
  FaPalette,
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaBolt as FaPower,
  FaWifi,
  FaBluetoothB,
  FaGift,
  FaAward,
  FaCertificate
} from 'react-icons/fa';

const ProductDetails = () => {
  const stripe = useStripe();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, updateQuantity } = useContext(CartContext);

  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLargeImage, setShowLargeImage] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSpecs, setSelectedSpecs] = useState({});

  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [newReview, setNewReview] = useState("");
  const reviewsSectionRef = useRef(null);
  const [newImage, setNewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const imageRef = useRef(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

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

  // Determine product type from URL path
  const getProductType = () => {
    const path = location.pathname;
    if (path.includes('refurbished')) return 'refurbished';
    if (path.includes('mini-pcs')) return 'mini-pc';
    if (path.includes('prebuilt')) return 'prebuilt';
    if (path.includes('office-pc')) return 'office-pc';
    if (path.includes('accessories')) return 'accessory';
    if (path.includes('audio')) return 'audio';
    if (path.includes('cameras')) return 'camera';
    if (path.includes('kitchen')) return 'kitchen';
    if (path.includes('laundry')) return 'laundry';
    if (path.includes('mobiles')) return 'mobile';
    if (path.includes('displays')) return 'display';
    if (path.includes('components')) return 'component';
    if (path.includes('tv')) return 'tv';
    if (path.includes('wearables')) return 'wearable';
    return 'product';
  };

  // Get the correct API endpoint based on product type
  const getApiEndpoint = () => {
    const type = getProductType();

    console.log('Product type detected:', type); // Debug log
  
    // First, let's check if we're on a PC product route
    const path = location.pathname;
    console.log('Current path:', path); // Debug log

    const endpoints = {
      // PC Products - Need to fetch from the products API
      'refurbished': `${BASE_URL}/api/admin/products?type=refurbished`,
      'mini-pc': `${BASE_URL}/api/admin/products?type=mini-pc`,
      'prebuilt': `${BASE_URL}/api/admin/products?type=prebuilt`,
      'office-pc': `${BASE_URL}/api/admin/products?type=office-pc`,

      // Other products - Direct ID-based endpoints
      'accessory': `${BASE_URL}/api/accessories/${id}`,
      'audio': `${BASE_URL}/api/audio/${id}`,
      'camera': `${BASE_URL}/api/cameras/${id}`,
      'kitchen': `${BASE_URL}/api/kitchen/${id}`,
      'laundry': `${BASE_URL}/api/laundry/${id}`,
      'mobile': `${BASE_URL}/api/mobiles/${id}`,
      'display': `${BASE_URL}/api/displays/${id}`,
      'component': `${BASE_URL}/api/components/${id}`,
      'tv': `${BASE_URL}/api/tv/${id}`,
      'wearable': `${BASE_URL}/api/wearables/${id}`,
    };
    
    return endpoints[type]  || `${BASE_URL}/api/admin/products`;;
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
      
        const endpoint = getApiEndpoint();
        console.log('Fetching from:', endpoint);
      
        const response = await fetch(endpoint);
      
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }
      
        const data = await response.json();
        console.log('API Response:', data);
      
        let productData = null;

         // Handle different response structures based on product type
      const type = getProductType();
      
              if (data.success) {
        // Check for type-specific product fields
        if (type === 'accessory' && data.accessory) {
          productData = data.accessory;
          console.log('Found accessory data');
        } else if (type === 'audio' && data.audio) {
          productData = data.audio;
        } else if (type === 'camera' && data.camera) {
          productData = data.camera;
        } else if (type === 'kitchen' && data.kitchenAppliance) {
          productData = data.kitchenAppliance;
        } else if (type === 'laundry' && data.laundryAppliance) {
          productData = data.laundryAppliance;
        } else if (type === 'mobile' && data.mobile) {
          productData = data.mobile;
        } else if (type === 'display' && data.display) {
          productData = data.display;
        } else if (type === 'component' && data.component) {
          productData = data.component;
        } else if (type === 'tv' && data.tv) {
          productData = data.tv;
        } else if (type === 'wearable' && data.wearable) {
          productData = data.wearable;
        } else if (data.product) {
          productData = data.product;
        } else if (data.products && Array.isArray(data.products)) {
          productData = data.products.find(p => p._id === id || p.id === id);
        } else if (data.data && Array.isArray(data.data)) {
          productData = data.data.find(p => p._id === id || p.id === id);
        }
      } else if (data._id || data.id) {
        productData = data;
      } else if (Array.isArray(data)) {
        productData = data.find(p => p._id === id || p.id === id);
      }

      // Special handling for PC products that might be in different arrays
      if (!productData && data.prebuildPC) {
        productData = data.prebuildPC.find(p => p._id === id);
      }
      if (!productData && data.officePC) {
        productData = data.officePC.find(p => p._id === id);
      }
      if (!productData && data.miniPCs) {
        productData = data.miniPCs.find(p => p._id === id);
      }
      if (!productData && data.refurbishedProducts) {
        productData = data.refurbishedProducts.find(p => p._id === id);
      }

      if (productData) {
        console.log('Product found:', productData);
        
        // Ensure image is always an array
        if (productData.image && !Array.isArray(productData.image)) {
          productData.image = [productData.image];
        } else if (!productData.image) {
          productData.image = [];
        }
        
        setProduct(productData);
        setReviews(productData.reviews || []);
        
        // Initialize selected specs
        if (productData.specs) {
          const initialSpecs = {};
          Object.entries(productData.specs).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              initialSpecs[key] = value[0]._id || value[0].value;
            }
          });
          setSelectedSpecs(initialSpecs);
        }
        
        // Set default color if available
        if (productData.specs?.colors?.length > 0) {
          setSelectedColor(productData.specs.colors[0]);
        }
        
        // Fetch related products
        fetchRelatedProducts(productData.type, productData.category, productData._id);
      } else {
        console.log('Product not found in response');
        setError('Product not found');
      }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchRelatedProducts = async (type, category, currentId) => {
      try {
        // Only fetch if we have valid parameters
        if (!type && !category) return;
      
        // Determine the correct endpoint based on product type
        let endpoint = '';
      
        // Map type to correct API endpoint
        if (type?.toLowerCase().includes('tv')) {
          endpoint = `${BASE_URL}/api/tv?limit=4`;
        } else if (type?.toLowerCase().includes('display') || type?.toLowerCase().includes('monitor')) {
          endpoint = `${BASE_URL}/api/displays?limit=4`;
        } else if (type?.toLowerCase().includes('mobile') || type?.toLowerCase().includes('phone')) {
          endpoint = `${BASE_URL}/api/mobiles?limit=4`;
        } else if (type?.toLowerCase().includes('audio')) {
          endpoint = `${BASE_URL}/api/audio?limit=4`;
        } else if (type?.toLowerCase().includes('camera')) {
          endpoint = `${BASE_URL}/api/cameras?limit=4`;
        } else if (type?.toLowerCase().includes('component')) {
          endpoint = `${BASE_URL}/api/components?limit=4`;
        } else if (type?.toLowerCase().includes('accessory')) {
          endpoint = `${BASE_URL}/api/accessories?limit=4`;
        } else if (type?.toLowerCase().includes('kitchen')) {
          endpoint = `${BASE_URL}/api/kitchen?limit=4`;
        } else if (type?.toLowerCase().includes('laundry')) {
          endpoint = `${BASE_URL}/api/laundry?limit=4`;
        } else if (type?.toLowerCase().includes('wearable')) {
          endpoint = `${BASE_URL}/api/wearables?limit=4`;
        } else {
          // For PC products, use the products API
          endpoint = `${BASE_URL}/api/admin/products?limit=4`;
        }
      
        const response = await fetch(endpoint);
      
        if (!response.ok) {
          throw new Error('Failed to fetch related products');
        }
      
        const data = await response.json();
      
        // Handle different response structures
        let relatedItems = [];
        if (data.success) {
          // Handle PC products response
          if (data.prebuildPC) relatedItems = [...relatedItems, ...data.prebuildPC];
          if (data.officePC) relatedItems = [...relatedItems, ...data.officePC];
          if (data.miniPCs) relatedItems = [...relatedItems, ...data.miniPCs];
          if (data.refurbishedProducts) relatedItems = [...relatedItems, ...data.refurbishedProducts];
          if (data.products) relatedItems = [...relatedItems, ...data.products];
        } else if (Array.isArray(data)) {
          relatedItems = data;
        } else if (data.data && Array.isArray(data.data)) {
          relatedItems = data.data;
        }
      
        // Filter out the current product
        const filtered = relatedItems.filter(item => item._id !== currentId);
        setRelatedProducts(filtered.slice(0, 4));
      
      } catch (error) {
        console.error('Error fetching related products:', error);
        // Don't set error state for related products - just log it
      }
    };
  
    if (id) {
      fetchProduct();
    }
  }, [id, location.pathname]);

  // Auto-scrolling for images
  useEffect(() => {
    if (!product?.image?.length) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === product.image.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [product?.image]);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-indigo-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-white text-lg font-medium mt-4">Loading product details...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we prepare your product</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 max-w-md">
          <div className="text-red-500 text-6xl mb-4">😕</div>
          <p className="text-red-400 text-xl mb-4">{error || 'Product not found'}</p>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105 shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = product.image || [];
  const {
    name,
    code,
    description,
    condition,
    specs = {},
    finalPrice,
    originalPrice,
    discount,
    otherTechnicalDetails = [],
    bonuses,
    inStock,
    rating = 0,
    reviewCount = reviews.length,
    brand,
    warranty,
    features = []
  } = product;

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
      updateQuantity(product.id, quantity - 1);
    }
  };

  const getSelectedSpecsPrice = () => {
    let price = finalPrice || product.price || 0;

    Object.entries(selectedSpecs).forEach(([category, selectedValue]) => {
      const specOptions = specs[category];
      if (specOptions && Array.isArray(specOptions)) {
        const selectedOption = specOptions.find(opt => opt._id === selectedValue || opt.value === selectedValue);
        if (selectedOption) {
          price += selectedOption.price || 0;
        }
      }
    });

    return price;
  };

  const handleSpecChange = (category, value) => {
    setSelectedSpecs(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const handlePreviousImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    navigate('/cart');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';
    const filename = imagePath.split(/[\\/]/).pop();
    return `${BASE_URL}/uploads/${filename}`;
  };

  const downloadQuotation = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/download-quotation/${product._id}`);
      if (!response.ok) throw new Error("Failed to fetch quotation");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Quotation-${product.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download Error:", error);
    }
  };

  const handleConfirmPayment = () => {
    navigate('/payment', { state: { product, quantity, selectedSpecs } });
  };

  const handleThumbnailClick = (index) => {
    setModalImageIndex(index);
    setShowLargeImage(true);
  };

  const handleCancelImage = () => {
    setShowLargeImage(false);
    setModalImageIndex(null);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }
    return stars;
  };

  const shareProduct = (platform) => {
    const url = window.location.href;
    const text = `Check out this product: ${product.name}`;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      email: `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(text + '\n\n' + url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const currentPrice = getSelectedSpecsPrice();

  return (
    <>
      <Helmet>
        <title>{name} | 7HubComputers - Premium Electronics</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={name} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={images[0] ? getImageUrl(images[0]) : ''} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Floating Header */}
        <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition group"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className="text-gray-400 hover:text-indigo-400 transition"
                  >
                    <FaShare />
                  </button>
                  <AnimatePresence>
                    {showShareOptions && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute right-0 mt-2 bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-2 flex gap-2"
                      >
                        <button onClick={() => shareProduct('facebook')} className="p-2 hover:bg-gray-700 rounded-lg text-blue-500">
                          <FaFacebook />
                        </button>
                        <button onClick={() => shareProduct('twitter')} className="p-2 hover:bg-gray-700 rounded-lg text-sky-400">
                          <FaTwitter />
                        </button>
                        <button onClick={() => shareProduct('whatsapp')} className="p-2 hover:bg-gray-700 rounded-lg text-green-500">
                          <FaWhatsapp />
                        </button>
                        <button onClick={() => shareProduct('email')} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400">
                          <FaEnvelope />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <button onClick={() => navigate('/')} className="hover:text-indigo-400 transition">Home</button>
            <span>/</span>
            <button onClick={() => navigate('/categories')} className="hover:text-indigo-400 transition">Categories</button>
            <span>/</span>
            <span className="text-indigo-400">{name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Images */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* Main Image with Zoom */}
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden group border border-gray-700">
                <div 
                  ref={imageRef}
                  className="relative aspect-square flex items-center justify-center cursor-zoom-in"
                  onMouseEnter={() => setShowZoom(true)}
                  onMouseLeave={() => setShowZoom(false)}
                  onMouseMove={handleMouseMove}
                  onClick={() => handleThumbnailClick(currentImageIndex)}
                >
                  {images.length > 0 ? (
                    <>
                      <img
                        src={getImageUrl(images[currentImageIndex])}
                        alt={name}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Zoom Lens */}
                      <AnimatePresence>
                        {showZoom && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute w-32 h-32 border-2 border-indigo-500 rounded-full pointer-events-none"
                            style={{
                              left: `${zoomPosition.x}%`,
                              top: `${zoomPosition.y}%`,
                              transform: 'translate(-50%, -50%)',
                              background: `url(${getImageUrl(images[currentImageIndex])})`,
                              backgroundSize: '300%',
                              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                            }}
                          />
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <div className="text-gray-500 flex flex-col items-center gap-2">
                      <FaCamera className="text-4xl" />
                      <span>No image available</span>
                    </div>
                  )}

                  {/* Image Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePreviousImage(); }}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition opacity-0 group-hover:opacity-100"
                      >
                        <FaArrowLeft />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition opacity-0 group-hover:opacity-100"
                      >
                        <FaArrowRight />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}

                  {/* Discount Badge */}
                  {originalPrice > currentPrice && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                      {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-indigo-500 scale-105 shadow-lg'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right Column - Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Brand & Stock Status */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  {brand && (
                    <span className="bg-indigo-600/20 text-indigo-400 px-4 py-2 rounded-lg font-semibold border border-indigo-500/30">
                      {brand}
                    </span>
                  )}
                  <span className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                    inStock 
                      ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-600/20 text-red-400 border border-red-500/30'
                  }`}>
                    {inStock ? <FaCheck className="text-green-400" /> : <FaTimes className="text-red-400" />}
                    {inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                  </span>
                </div>
                {condition && (
                  <span className="bg-yellow-600/20 text-yellow-400 px-4 py-2 rounded-lg border border-yellow-500/30">
                    {condition}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {name}
              </h1>

              {/* SKU & Rating */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                {code && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <FaTag className="text-indigo-400" />
                    <span>SKU: {code}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex gap-1 text-xl">
                    {renderStars(rating)}
                  </div>
                  <span className="text-gray-400">({reviewCount} reviews)</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    ₹{currentPrice.toLocaleString()}
                  </div>
                  {originalPrice > currentPrice && (
                    <>
                      <div className="text-2xl text-gray-500 line-through">
                        ₹{originalPrice.toLocaleString()}
                      </div>
                      <div className="bg-green-600/20 text-green-400 px-4 py-2 rounded-full font-semibold border border-green-500/30">
                        Save ₹{(originalPrice - currentPrice).toLocaleString()}
                      </div>
                    </>
                  )}
                </div>
                {bonuses && (
                  <div className="mt-4 flex items-center gap-2 text-indigo-400 bg-indigo-600/10 p-3 rounded-lg">
                    <FaGift />
                    <span>+ {bonuses} bonuses included!</span>
                  </div>
                )}
              </div>

              {/* Quick Features */}
              {features && features.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                      <FaCheck className="text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="text-gray-300 leading-relaxed">{description}</p>

              {/* Specifications Selector */}
              {Object.entries(specs).map(([key, value]) => {
                if (!value || !Array.isArray(value) || value.length === 0) return null;
                if (!['ramOptions', 'storage1Options', 'storage2Options', 'colors', 'sizes'].includes(key)) return null;

                return (
                  <div key={key} className="space-y-3">
                    <label className="block text-sm font-medium text-gray-400 uppercase tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {value.map((option, idx) => {
                        const isSelected = selectedSpecs[key] === (option._id || option.value);
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSpecChange(key, option._id || option.value)}
                            className={`px-4 py-2 rounded-lg border-2 transition transform hover:scale-105 ${
                              isSelected
                                ? 'border-indigo-500 bg-indigo-600/20 text-indigo-400'
                                : 'border-gray-700 hover:border-gray-600 text-gray-400'
                            }`}
                          >
                            {option.value || option}
                            {option.price > 0 && ` (+₹${option.price})`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700">
                    <button
                      onClick={handleDecrease}
                      className="px-4 py-3 hover:bg-gray-700 rounded-l-lg transition disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="w-16 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={handleIncrease}
                      className="px-4 py-3 hover:bg-gray-700 rounded-r-lg transition"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <span className="text-gray-400">
                    {inStock ? `${product.stock || 'Many'} available` : 'Out of stock'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <FaShoppingCart />
                  ADD TO CART
                </button>
                {inStock && (
                  <button
                    onClick={handleConfirmPayment}
                    disabled={!stripe}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FaBolt />
                    BUY NOW
                  </button>
                )}
              </div>

              {/* Additional Actions */}
              <div className="flex items-center justify-center gap-4 pt-2">
                {getProductType() === 'prebuilt' && (
                  <button
                    onClick={downloadQuotation}
                    className="text-gray-400 hover:text-indigo-400 transition flex items-center gap-2"
                  >
                    <FaDownload />
                    Download Quotation
                  </button>
                )}
                <button
                  onClick={() => window.print()}
                  className="text-gray-400 hover:text-indigo-400 transition flex items-center gap-2"
                >
                  <FaPrint />
                  Print Details
                </button>
              </div>

              {/* Service Guarantees */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-800">
                <div className="text-center group">
                  <FaTruck className="text-2xl text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition" />
                  <p className="text-xs text-gray-400">Free Shipping</p>
                </div>
                <div className="text-center group">
                  <FaShieldAlt className="text-2xl text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition" />
                  <p className="text-xs text-gray-400">{warranty || '2 Year'} Warranty</p>
                </div>
                <div className="text-center group">
                  <FaUndo className="text-2xl text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition" />
                  <p className="text-xs text-gray-400">30 Day Returns</p>
                </div>
                <div className="text-center group">
                  <FaHeadphones className="text-2xl text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition" />
                  <p className="text-xs text-gray-400">24/7 Support</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="border-b border-gray-800">
              <div className="flex gap-8 overflow-x-auto pb-2">
                {['description', 'specifications', 'reviews', 'warranty'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-2 font-medium capitalize transition relative ${
                      activeTab === tab
                        ? 'text-indigo-400'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-8">
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="prose prose-invert max-w-none"
                  >
                    <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
                    
                    {otherTechnicalDetails.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {otherTechnicalDetails.map((detail, idx) => (
                            <div key={idx} className="bg-gray-800/50 p-4 rounded-lg">
                              <span className="text-indigo-400 font-medium">{detail.name}:</span>
                              <span className="text-gray-300 ml-2">{detail.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.notes?.length > 0 && (
                      <div className="mt-8 bg-yellow-600/10 border border-yellow-600/30 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-yellow-600 mb-4">Important Notes</h3>
                        <ul className="space-y-2">
                          {product.notes.map((note, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-yellow-200">
                              <FaCheck className="text-yellow-600 mt-1 flex-shrink-0" />
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'specifications' && (
                  <motion.div
                    key="specifications"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {Object.entries(specs).map(([key, value]) => {
                      if (!value || key === '_id' || key === '__v' || key.includes('Options')) return null;

                      const getIcon = (key) => {
                        const iconMap = {
                          processor: <FaMicrochip />,
                          cpu: <FaMicrochip />,
                          ram: <FaMemory />,
                          memory: <FaMemory />,
                          storage: <FaHdd />,
                          hdd: <FaHdd />,
                          ssd: <FaHdd />,
                          power: <FaPower />,
                          psu: <FaPower />,
                          wifi: <FaWifi />,
                          bluetooth: <FaBluetoothB />,
                          color: <FaPalette />,
                          colour: <FaPalette />,
                          weight: <FaWeightHanging />,
                          dimensions: <FaRulerCombined />
                        };
                        return iconMap[key.toLowerCase()] || <FaBoxOpen />;
                      };

                      return (
                        <div key={key} className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-indigo-400 text-xl">{getIcon(key)}</span>
                            <h4 className="font-medium text-gray-400 uppercase tracking-wider">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </h4>
                          </div>
                          <div className="text-gray-300">
                            {typeof value === 'object' ? (
                              <div className="space-y-2">
                                {Object.entries(value).map(([k, v]) => (
                                  <div key={k} className="flex justify-between">
                                    <span className="text-gray-500">{k}:</span>
                                    <span>{String(v)}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-lg">{String(value)}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    ref={reviewsSectionRef}
                  >
                    {/* Review Form */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-8 border border-gray-700">
                      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <FaStar className="text-yellow-500" />
                        Write a Review
                      </h3>
                      
                      {/* Star Rating */}
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-gray-400">Your Rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setReviewRating(star)}
                              className={`text-3xl transition transform hover:scale-110 ${
                                reviewRating >= star ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Review Input */}
                      <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="Share your experience with this product..."
                        className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-indigo-500 mb-4 resize-none"
                        rows="4"
                      />

                      {/* Image Upload */}
                      <div className="mb-6">
                        <label className="block text-gray-400 mb-2">Add Image (Optional)</label>
                        <div className="flex items-center gap-4">
                          <label className="cursor-pointer bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 transition">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setImageFile(file);
                                  setNewImage(URL.createObjectURL(file));
                                }
                              }}
                              className="hidden"
                            />
                            Choose File
                          </label>
                          {newImage && (
                            <div className="relative">
                              <img src={newImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                              <button
                                onClick={() => {
                                  setNewImage(null);
                                  setImageFile(null);
                                }}
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 text-xs"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          if (!newReview.trim() || reviewRating === 0) return;
                          
                          const formData = new FormData();
                          formData.append('rating', reviewRating);
                          formData.append('comment', newReview);
                          if (imageFile) formData.append('image', imageFile);

                          try {
                            const response = await fetch(`${BASE_URL}/api/products/${product._id}/reviews`, {
                              method: 'POST',
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                              },
                              body: formData,
                            });

                            if (response.ok) {
                              const data = await response.json();
                              setReviews([data.review, ...reviews]);
                              setNewReview('');
                              setNewImage(null);
                              setImageFile(null);
                              setReviewRating(0);
                            }
                          } catch (error) {
                            console.error('Error submitting review:', error);
                          }
                        }}
                        disabled={!newReview.trim() || reviewRating === 0}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition transform hover:scale-105 disabled:opacity-50"
                      >
                        Submit Review
                      </button>
                    </div>

                    {/* Existing Reviews */}
                    {reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                                  <span className="font-bold">
                                    {(review.username || review.user?.name || 'A').charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-semibold">{review.username || review.user?.name || 'Anonymous'}</span>
                                  <div className="flex gap-1 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <span
                                        key={i}
                                        className={`text-sm ${
                                          i < review.rating ? 'text-yellow-500' : 'text-gray-600'
                                        }`}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                <FaCalendarAlt className="inline mr-1" />
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-300 mb-4">{review.text || review.comment}</p>
                            {review.image && (
                              <img
                                src={getImageUrl(review.image)}
                                alt="Review"
                                className="w-24 h-24 object-cover rounded-lg border border-gray-700"
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-800/30 rounded-xl">
                        <FaStar className="text-5xl text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No reviews yet. Be the first to review this product!</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'warranty' && (
                  <motion.div
                    key="warranty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <FaShieldAlt className="text-5xl text-indigo-500" />
                      <div>
                        <h3 className="text-2xl font-bold">Warranty Information</h3>
                        <p className="text-gray-400">{warranty || 'Standard manufacturer warranty applies'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-indigo-400 mb-2">Coverage</h4>
                        <p className="text-gray-300">Manufacturing defects and hardware failures</p>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-indigo-400 mb-2">Duration</h4>
                        <p className="text-gray-300">{warranty || '1 year'} from date of purchase</p>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-indigo-400 mb-2">Service Type</h4>
                        <p className="text-gray-300">Carry-in or On-site (depending on location)</p>
                      </div>
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-indigo-400 mb-2">Customer Support</h4>
                        <p className="text-gray-300">24/7 toll-free helpline: 1800-123-4567</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                You Might Also Like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all cursor-pointer"
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={getImageUrl(item.image?.[0])}
                        alt={item.name}
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-white mb-2 line-clamp-1">{item.name}</h4>
                      <p className="text-indigo-400 font-bold">₹{(item.price || 0).toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showLargeImage && modalImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
            onClick={handleCancelImage}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-6xl mx-auto p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getImageUrl(images[modalImageIndex])}
                alt={name}
                className="max-h-[90vh] max-w-full object-contain rounded-lg"
              />
              
              {/* Close Button */}
              <button
                onClick={handleCancelImage}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition"
              >
                <FaTimes />
              </button>
              
              {/* Modal Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setModalImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition"
                  >
                    <FaArrowLeft />
                  </button>
                  <button
                    onClick={() => setModalImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition"
                  >
                    <FaArrowRight />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
                {modalImageIndex + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductDetails; 