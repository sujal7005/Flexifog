import { React, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaStar, 
  FaRegStar, 
  FaStarHalfAlt,
  FaCheck,
  FaTruck,
  FaShieldAlt,
  FaHeadphones,
  FaUndo,
  FaGift,
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaBolt,
  FaDesktop,
  FaLaptop,
  FaMobile,
  FaTablet,
  FaTv,
  FaCamera,
  FaHeadphones as FaHeadphonesIcon,
  FaGamepad,
  FaRobot,
  FaCloud,
  FaServer,
  FaShoppingBag,
  FaUsers,
  FaAward,
  FaClock
} from 'react-icons/fa';

import bgVideo from "../assets/video/Screen Recording 2025-02-06 212028.mp4";

const Home = () => {
  const [products, setProducts] = useState({
    prebuiltPC: [],
    refurbishedLaptops: [],
    miniPCs: [],
    mobiles: [],
    laptops: [],
    tvs: [],
    displays: [],
    audio: [],
    cameras: [],
    components: [],
    accessories: [],
    kitchen: [],
    laundry: [],
    wearables: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dynamicText, setDynamicText] = useState("Welcome to Flexifog - Your Ultimate Tech Destination");
  const [backgroundImage, setBackgroundImage] = useState("https://t3.ftcdn.net/jpg/09/18/42/58/360_F_918425842_Ww2uHj43kH4KP1Agmo6H1nkUciN2kOGo.jpg");
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    customers: 1250,
    years: 5,
    satisfaction: 98
  });

  const BASE_URL = 'http://localhost:4000';

  useEffect(() => {
    const texts = [
      "Personal Computers (Desktops & Laptops)",
      "High-Performance Workstations",
      "Powerful Gaming PCs",
      "Reliable Servers for Your Needs",
      "Compact Mini PCs for Space-Saving",
      "Sleek All-in-One Computers",
      "Efficient Chromebooks for Everyday Use"
    ];

    const images = [
      "https://60a99bedadae98078522-a9b6cded92292ef3bace063619038eb1.ssl.cf2.rackcdn.net/images_CategoryPages_CategoryPromos_Cases_CASES_BuildN.png",
      "https://siriuspowerpc.com/wp-content/uploads/2023/06/CPU-Category-430x430.png",
      "https://www.yankodesign.com/images/design_news/2021/09/this-sci-fi-transparent-pc-case-is-a-symphony-of-performance-and-looks/Crystal-PC-Case-Concept-by-Alex-Casabo_Desktop-10.jpg",
    ];

    let index = 0;
    const intervalId = setInterval(() => {
      setDynamicText(texts[index]);
      setBackgroundImage(images[index]);
      index = (index + 1) % texts.length;
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        // Define all product endpoints
        const endpoints = [
          { name: 'prebuiltPC', url: `${BASE_URL}/api/admin/products?type=prebuilt` },
          { name: 'refurbishedLaptops', url: `${BASE_URL}/api/admin/products?type=refurbished` },
          { name: 'miniPCs', url: `${BASE_URL}/api/admin/products?type=mini-pc` },
          { name: 'mobiles', url: `${BASE_URL}/api/mobiles` },
          { name: 'laptops', url: `${BASE_URL}/api/laptops` },
          { name: 'tvs', url: `${BASE_URL}/api/tv` },
          { name: 'displays', url: `${BASE_URL}/api/displays` },
          { name: 'audio', url: `${BASE_URL}/api/audio` },
          { name: 'cameras', url: `${BASE_URL}/api/cameras` },
          { name: 'components', url: `${BASE_URL}/api/components` },
          { name: 'accessories', url: `${BASE_URL}/api/accessories` },
          { name: 'kitchen', url: `${BASE_URL}/api/kitchen` },
          { name: 'laundry', url: `${BASE_URL}/api/laundry` },
          { name: 'wearables', url: `${BASE_URL}/api/wearables` }
        ];

        // Fetch all endpoints in parallel
        const responses = await Promise.all(
          endpoints.map(async (endpoint) => {
            try {
              const res = await fetch(endpoint.url);
              const data = await res.json();
              return { name: endpoint.name, data };
            } catch (err) {
              console.log(`Error fetching ${endpoint.name}:`, err);
              return { name: endpoint.name, data: { products: [] } };
            }
          })
        );

        // Process responses
        const newProducts = {};

        responses.forEach(({ name, data }) => {
          let productArray = [];

          // Handle different response structures
          if (data.success && Array.isArray(data.products)) {
            productArray = data.products;
          } else if (Array.isArray(data)) {
            productArray = data;
          } else if (data.data && Array.isArray(data.data)) {
            productArray = data.data;
          } else if (data.prebuildPC) {
            productArray = data.prebuildPC;
          } else if (data.refurbishedProducts) {
            productArray = data.refurbishedProducts;
          } else if (data.miniPCs) {
            productArray = data.miniPCs;
          }

          newProducts[name] = productArray;
        });

        // Calculate total products
        const totalProducts = Object.values(newProducts).reduce(
          (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0
        );

        setProducts(newProducts);
        setStats(prev => ({
          ...prev,
          products: totalProducts,
          categories: Object.keys(newProducts).filter(key => newProducts[key]?.length > 0).length
        }));

      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';
    const filename = imagePath.split(/[\\/]/).pop();
    return `${BASE_URL}/uploads/${filename}`;
  };

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

  // Categories with icons
  const categories = [
    { name: 'Pre-Built PCs', key: 'prebuiltPC', icon: <FaDesktop />, color: 'from-blue-600 to-cyan-600', path: '/prebuilt' },
    { name: 'Refurbished Laptops', key: 'refurbishedLaptops', icon: <FaLaptop />, color: 'from-green-600 to-emerald-600', path: '/refurbished' },
    { name: 'Mini PCs', key: 'miniPCs', icon: <FaMicrochip />, color: 'from-purple-600 to-pink-600', path: '/mini-pcs' },
    { name: 'Mobiles', key: 'mobiles', icon: <FaMobile />, color: 'from-indigo-600 to-purple-600', path: '/mobiles' },
    { name: 'Laptops', key: 'laptops', icon: <FaLaptop />, color: 'from-orange-600 to-red-600', path: '/laptops' },
    { name: 'TVs', key: 'tvs', icon: <FaTv />, color: 'from-red-600 to-pink-600', path: '/tvs' },
    { name: 'Displays', key: 'displays', icon: <FaTv />, color: 'from-cyan-600 to-blue-600', path: '/displays' },
    { name: 'Audio', key: 'audio', icon: <FaHeadphonesIcon />, color: 'from-yellow-600 to-orange-600', path: '/audio' },
    { name: 'Cameras', key: 'cameras', icon: <FaCamera />, color: 'from-teal-600 to-green-600', path: '/cameras' },
    { name: 'Components', key: 'components', icon: <FaMicrochip />, color: 'from-gray-600 to-slate-600', path: '/components' },
    { name: 'Accessories', key: 'accessories', icon: <FaHeadphonesIcon />, color: 'from-amber-600 to-yellow-600', path: '/accessories' },
    { name: 'Kitchen', key: 'kitchen', icon: <FaGift />, color: 'from-lime-600 to-green-600', path: '/kitchen' },
    { name: 'Laundry', key: 'laundry', icon: <FaShieldAlt />, color: 'from-sky-600 to-blue-600', path: '/laundry' },
    { name: 'Wearables', key: 'wearables', icon: <FaClock />, color: 'from-violet-600 to-purple-600', path: '/wearables' }
  ];

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
          <p className="text-white text-lg font-medium mt-4">Loading amazing products...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we prepare your shopping experience</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 max-w-md">
          <div className="text-red-500 text-6xl mb-4">😕</div>
          <p className="text-red-400 text-xl mb-4">{error}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden pt-2.5">
      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center text-white flex items-center justify-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <motion.div
          className="relative text-center px-6 md:px-12 z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="mb-6"
          >
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold inline-block">
              🚀 Welcome to the Future of Shopping
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6"
            key={dynamicText}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {dynamicText}
            </span>
          </motion.h1>

          <motion.p
            className="mt-4 text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Your one-stop destination for all your electronic needs. 
            Discover thousands of products across {stats.categories}+ categories.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            <motion.a
              href="#categories"
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-8 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Now
              <FaArrowRight className="group-hover:translate-x-1 transition" />
            </motion.a>
            
            <motion.a
              href="#featured"
              className="group bg-transparent border-2 border-white/30 hover:border-white text-white py-4 px-8 rounded-full text-lg font-semibold transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Featured
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { label: 'Products', value: stats.products + '+', icon: <FaShoppingBag /> },
              { label: 'Categories', value: stats.categories, icon: <FaServer /> },
              { label: 'Happy Customers', value: stats.customers + '+', icon: <FaUsers /> },
              { label: 'Satisfaction', value: stats.satisfaction + '%', icon: <FaAward /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-3xl text-indigo-400 mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Video Section */}
      <section className="relative py-20 px-4 md:px-20">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"></div>
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            {/* Video Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <video
                autoPlay
                loop
                muted
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              >
                <source src={bgVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Content */}
            <div className="text-white">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
                <h2 className="text-4xl font-bold mt-4 mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Flexifog: Your Trusted Electronics Partner
                
                <div className="space-y-4 mb-8">
                  {[
                    `${stats.products}+ products across ${stats.categories} categories`,
                    'Premium quality products from top brands',
                    'Expert customer service and support',
                    'Secure payment and fast delivery',
                    'Satisfaction guaranteed'
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaCheck className="text-white text-xs" />
                      </div>
                      <span className="text-gray-300">{item}</span>
                    </motion.div>
                  ))}
                </div>

                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg"
                >
                  Learn More About Us
                  <FaArrowRight />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"></div>
        
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Shop by Category</span>
            <h2 className="text-4xl font-bold mt-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Browse Our Collections
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Explore our wide range of products across {stats.categories} different categories
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {categories.filter(cat => products[cat.key]?.length > 0).map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group cursor-pointer"
              >
                <Link to={category.path}>
                  <div className={`bg-gradient-to-br ${category.color} p-6 rounded-2xl text-center hover:shadow-xl transition-all duration-300`}>
                    <div className="text-4xl text-white mb-3 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-1">{category.name}</h3>
                    <p className="text-white/70 text-xs">{products[category.key]?.length || 0} items</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products - Pre-Built PCs */}
      {products.prebuiltPC?.length > 0 && (
        <section id="featured" className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"></div>
          
          <div className="relative container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Featured Collection</span>
              <h2 className="text-4xl font-bold mt-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Pre-Built Desktop PCs
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Ready-to-use systems optimized for performance and reliability
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {products.prebuiltPC.slice(0, 3).map((product, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {product.category || 'Pre-Built'}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-green-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                    <img
                      src={getImageUrl(product.image?.[0])}
                      alt={product.name}
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => e.target.src = '/placeholder-image.jpg'}
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {renderStars(product.rating || 4.5)}
                      </div>
                      <span className="text-gray-400 text-sm">({product.reviews?.length || 0})</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-indigo-400">
                        ₹{(product.finalPrice || product.price || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-4">
                      <Link
                        to={`/prebuilt/${product._id}`}
                        className="block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition transform hover:scale-105 text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                to="/prebuilt"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white px-8 py-4 rounded-xl font-semibold transition transform hover:scale-105"
              >
                View All Pre-Built PCs ({products.prebuiltPC.length})
                <FaArrowRight />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Mobile Phones Section */}
      {products.mobiles?.length > 0 && (
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"></div>
          
          <div className="relative container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Latest</span>
              <h2 className="text-4xl font-bold mt-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Smartphones & Tablets
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Discover the latest mobile technology
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.mobiles.slice(0, 4).map((product, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageUrl(product.image?.[0])}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => e.target.src = '/placeholder-image.jpg'}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-sm">
                        {renderStars(product.rating || 4)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-400">
                        ₹{(product.price || 0).toLocaleString()}
                      </span>
                      <Link
                        to={`/mobiles/${product._id}`}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Laptops Section */}
      {products.laptops?.length > 0 && (
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"></div>
          
          <div className="relative container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Portable Power</span>
              <h2 className="text-4xl font-bold mt-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Laptops
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Powerful laptops for work and play
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.laptops.slice(0, 3).map((product, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageUrl(product.image?.[0])}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => e.target.src = '/placeholder-image.jpg'}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-sm">
                        {renderStars(product.rating || 4)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-400">
                        ₹{(product.price || 0).toLocaleString()}
                      </span>
                      <Link
                        to={`/laptops/${product._id}`}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"></div>
        
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-4xl font-bold mt-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              The Flexifog Advantage
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: <FaMicrochip />, title: `${stats.products}+ Products`, desc: 'Wide selection across all categories' },
              { icon: <FaShieldAlt />, title: 'Quality Assured', desc: 'All products verified and tested' },
              { icon: <FaTruck />, title: 'Free Shipping', desc: 'On orders above ₹50,000' },
              { icon: <FaHeadphones />, title: '24/7 Support', desc: 'Round-the-clock customer service' },
              { icon: <FaUndo />, title: 'Easy Returns', desc: '30-day return policy' },
              { icon: <FaGift />, title: 'Special Bonuses', desc: 'Exclusive gifts with purchases' },
              { icon: <FaBolt />, title: 'Fast Delivery', desc: '3-5 business days delivery' },
              { icon: <FaAward />, title: `${stats.years}+ Years`, desc: 'Years of excellence in service' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-indigo-500/50 transition-all text-center group"
              >
                <div className="text-4xl text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"></div>
        
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-3xl p-12 border border-indigo-500/30 text-center"
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Stay Updated
            </h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter for the latest deals, new arrivals, and exclusive offers!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition transform hover:scale-105">
                Subscribe
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;