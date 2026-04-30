// src/components/Header.jsx
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { 
  FaShoppingCart, 
  FaUserCircle,
  FaDesktop,
  FaLaptop,
  FaTv,
  FaHeadphones,
  FaTabletAlt,
  FaCamera,
  FaGamepad,
  FaMicrochip,
  FaServer,
  FaPrint,
  FaMemory,
  FaHdd,
  FaKeyboard,
  FaMouse,
  FaMobileAlt,
  FaTablet,
  FaSnowflake,
  FaRegSnowflake,
  FaTemperatureLow,
  FaUtensils,
  FaBlender,
  FaTint,
  FaWind,
  FaWater,
  FaClock,
  FaRegClock,
  FaRegSun,
  FaCouch,
  FaChair,
  FaFan,
  FaRegLightbulb,
  FaPlug,
  FaBolt
} from 'react-icons/fa';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { cartItems } = useContext(CartContext);
  const [suggestions, setSuggestions] = useState([]);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState({});
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.length > 0) {
      axios
        .get(`http://localhost:4000/api/admin/products?q=${searchTerm}`)
        .then((res) => {
          console.log("API Response:", res.data);
          const allProducts = [
            ...res.data.prebuildPC || [],
            ...res.data.officePC || [],
            ...res.data.refurbishedProducts || [],
            ...res.data.miniPCs || []
          ];
          setSuggestions(allProducts);
        })
        .catch((err) => {
          console.error("Error fetching suggestions:", err)
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setSuggestions([]);
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
    
    const endpoints = {
      'refurbished': `${BASE_URL}/api/admin/products?type=refurbished`,
      'mini-pc': `${BASE_URL}/api/admin/products?type=mini-pc`,
      'prebuilt': `${BASE_URL}/api/admin/products?type=prebuilt`,
      'office-pc': `${BASE_URL}/api/admin/products?type=office-pc`,
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

    return endpoints[type] || `${BASE_URL}/api/admin/products`;
  };

  const generateUrl = (product) => {
    let type = product.type || "";
    if (typeof type !== "string") {
      console.warn("Invalid type:", type);
      type = "pc";
    }
  
    let basePath = "pc";
    const lowerCaseType = type.toLowerCase();
  
    if (lowerCaseType.includes("mini pc")) {
      basePath = "mini-pcs";
    } else if (lowerCaseType.includes("refurbished")) {
      basePath = "refurbished";
    } else if (lowerCaseType.includes("laptop")) {
      basePath = "laptops";
    } else if (lowerCaseType.includes("display") || lowerCaseType.includes("monitor")) {
      basePath = "displays";
    } else if (lowerCaseType.includes("accessory") || lowerCaseType.includes("accessories")) {
      basePath = "accessories";
    } else if (lowerCaseType.includes("tablet")) {
      basePath = "tablets";
    } else if (lowerCaseType.includes("camera")) {
      basePath = "cameras";
    } else if (lowerCaseType.includes("audio") || lowerCaseType.includes("headphone")) {
      basePath = "audio";
    } else if (lowerCaseType.includes("gaming")) {
      basePath = "gaming";
    } else if (lowerCaseType.includes("mobile") || lowerCaseType.includes("phone")) {
      basePath = "mobiles";
    } else if (lowerCaseType.includes("tv") || lowerCaseType.includes("television")) {
      basePath = "tvs";
    } else if (lowerCaseType.includes("ac") || lowerCaseType.includes("air conditioner")) {
      basePath = "ac";
    } else if (lowerCaseType.includes("refrigerator") || lowerCaseType.includes("fridge")) {
      basePath = "refrigerators";
    } else if (lowerCaseType.includes("washing machine")) {
      basePath = "washing-machines";
    } else if (lowerCaseType.includes("microwave")) {
      basePath = "microwaves";
    }
  
    return `/${basePath}/${product._id}`;
  };

  
  const handleSuggestionClick = (product) => {
    const productUrl = generateUrl(product);
    navigate(productUrl);
    setSearchTerm('');
    setSuggestions([]);
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleAccountMenu = () => setIsAccountMenuOpen(!isAccountMenuOpen);

  const isLoggedIn = Boolean(localStorage.getItem('user'));

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setIsAccountMenuOpen(false);
    navigate('/');
  };

  // All electronic product categories with correct icon names
const electronicCategories = {
  // Mobile Devices Section
  mobiles: {
    name: 'Mobiles & Tablets',
    icon: <FaMobileAlt className="mr-2" />,
    subcategories: [
      { name: 'Smartphones', path: '/mobiles', icon: <FaMobileAlt /> },
      { name: 'Feature Phones', path: '/mobiles', icon: <FaMobileAlt /> },
      { name: 'Tablets', path: '/mobiles', icon: <FaTablet /> },
      { name: 'iPad', path: '/mobiles', icon: <FaTablet /> },
      { name: 'Android Tablets', path: '/mobiles', icon: <FaTablet /> },
      { name: 'Mobile Accessories', path: '/mobiles', icon: <FaMobileAlt /> },
      { name: 'Power Banks', path: '/mobiles', icon: <FaBolt /> },
      { name: 'Mobile Cases & Covers', path: '/mobiles', icon: <FaMobileAlt /> },
      { name: 'Screen Guards', path: '/mobiles', icon: <FaMobileAlt /> },
      { name: 'Mobile Chargers', path: '/mobiles', icon: <FaPlug /> },
    ]
  },
  laptops: {
    name: 'Laptops',
    icon: <FaLaptop className="mr-2" />,
    subcategories: [
      { name: 'Gaming Laptops', path: '/laptops', icon: <FaLaptop /> },
      { name: 'Ultrabooks', path: '/laptops', icon: <FaLaptop /> },
      { name: 'Business Laptops', path: '/laptops', icon: <FaLaptop /> },
      { name: 'Student Laptops', path: '/laptops', icon: <FaLaptop /> },
      { name: '2-in-1 Laptops', path: '/laptops', icon: <FaLaptop /> },
      { name: 'Refurbished Laptops', path: '/laptops', icon: <FaLaptop /> },
      { name: 'MacBooks', path: '/laptops', icon: <FaLaptop /> },
      { name: 'Laptop Accessories', path: '/laptops', icon: <FaLaptop /> },
    ]
  },
  computers: {
    name: 'Computers',
    icon: <FaDesktop className="mr-2" />,
    subcategories: [
      { name: 'Pre-Built PCs', path: '/prebuilt', icon: <FaServer /> },
      // { name: 'Custom PCs', path: '/custom-pc', icon: <FaMicrochip /> },
      { name: 'Mini PCs', path: '/mini-pcs', icon: <FaDesktop /> },
      // { name: 'All-in-One PCs', path: '/all-in-one-pcs', icon: <FaDesktop /> },
      { name: 'Office PCs', path: '/office-pcs', icon: <FaDesktop /> },
      // { name: 'Workstations', path: '/workstations', icon: <FaServer /> },
      // { name: 'Servers', path: '/servers', icon: <FaServer /> },
    ]
  },
  tvs: {
    name: 'TV & Entertainment',
    icon: <FaTv className="mr-2" />,
    subcategories: [
      { name: 'Smart TVs', path: '/tvs', icon: <FaTv /> },
      { name: '4K Ultra HD TVs', path: '/tvs', icon: <FaTv /> },
      { name: 'OLED TVs', path: '/tvs', icon: <FaTv /> },
      { name: 'QLED TVs', path: '/tvs', icon: <FaTv /> },
      { name: 'LED TVs', path: '/tvs', icon: <FaTv /> },
      { name: 'Gaming TVs', path: '/tvs', icon: <FaTv /> },
      { name: 'TV Stands & Mounts', path: '/tvs', icon: <FaTv /> },
      { name: 'Streaming Devices', path: '/tvs', icon: <FaTv /> },
    ]
  },
  displays: {
    name: 'Monitors & Displays',
    icon: <FaTv className="mr-2" />,
    subcategories: [
      { name: 'Gaming Monitors', path: '/displays', icon: <FaTv /> },
      { name: 'Professional Monitors', path: '/displays', icon: <FaTv /> },
      { name: 'Ultrawide Monitors', path: '/displays', icon: <FaTv /> },
      { name: '4K Monitors', path: '/displays', icon: <FaTv /> },
      { name: 'Portable Monitors', path: '/displays', icon: <FaTv /> },
      { name: 'Touchscreen Monitors', path: '/displays', icon: <FaTv /> },
      { name: 'Monitor Accessories', path: '/displays', icon: <FaTv /> },
    ]
  },
  // homeAppliances: {
  //   name: 'Home Appliances',
  //   icon: <FaSnowflake className="mr-2" />,
  //   subcategories: [
  //     { name: 'Air Conditioners (AC)', path: '/ac', icon: <FaSnowflake /> },
  //     { name: 'Split AC', path: '/ac', icon: <FaSnowflake /> },
  //     { name: 'Window AC', path: '/ac', icon: <FaSnowflake /> },
  //     { name: 'Portable AC', path: '/ac', icon: <FaRegSnowflake /> },
  //     { name: 'Refrigerators', path: '/ac', icon: <FaTemperatureLow /> },
  //     { name: 'Single Door Fridge', path: '/ac', icon: <FaTemperatureLow /> },
  //     { name: 'Double Door Fridge', path: '/ac', icon: <FaTemperatureLow /> },
  //     { name: 'Side-by-Side Fridge', path: '/ac', icon: <FaTemperatureLow /> },
  //     { name: 'French Door Fridge', path: '/ac', icon: <FaTemperatureLow /> },
  //     { name: 'Mini Fridges', path: '/ac', icon: <FaTemperatureLow /> },
  //   ]
  // },
  kitchenAppliances: {
    name: 'Kitchen Appliances',
    icon: <FaUtensils className="mr-2" />,
    subcategories: [
      { name: 'Microwave Ovens', path: '/kitchen', icon: <FaClock /> },
      { name: 'OTG', path: '/kitchen', icon: <FaRegClock /> },
      { name: 'Air Fryers', path: '/kitchen', icon: <FaWind /> },
      { name: 'Induction Cooktops', path: '/kitchen', icon: <FaRegSun /> },
      { name: 'Electric Kettles', path: '/kitchen', icon: <FaTint /> },
      { name: 'Mixer Grinders', path: '/kitchen', icon: <FaBlender /> },
      { name: 'Juicers', path: '/kitchen', icon: <FaTint /> },
      { name: 'Food Processors', path: '/kitchen', icon: <FaBlender /> },
      { name: 'Dishwashers', path: '/kitchen', icon: <FaWater /> },
      { name: 'Chimneys', path: '/kitchen', icon: <FaWind /> },
    ]
  },
  laundry: {
    name: 'Laundry & Cleaning',
    icon: <FaWater className="mr-2" />,
    subcategories: [
      { name: 'Washing Machines', path: '/laundry', icon: <FaWater /> },
      { name: 'Front Load', path: '/laundry', icon: <FaWater /> },
      { name: 'Top Load', path: '/laundry', icon: <FaWater /> },
      { name: 'Washer-Dryer Combo', path: '/laundry', icon: <FaWater /> },
      { name: 'Dryers', path: '/laundry', icon: <FaWind /> },
      { name: 'Vacuum Cleaners', path: '/laundry', icon: <FaWind /> },
      { name: 'Robot Vacuums', path: '/laundry', icon: <FaFan /> },
      { name: 'Steam Cleaners', path: '/laundry', icon: <FaWater /> },
    ]
  },
  components: {
    name: 'PC Components',
    icon: <FaMicrochip className="mr-2" />,
    subcategories: [
      { name: 'Processors (CPU)', path: '/components', icon: <FaMicrochip /> },
      { name: 'Graphics Cards (GPU)', path: '/components', icon: <FaMicrochip /> },
      { name: 'Motherboards', path: '/components', icon: <FaMicrochip /> },
      { name: 'RAM', path: '/components', icon: <FaMemory /> },
      { name: 'SSD', path: '/components', icon: <FaHdd /> },
      { name: 'HDD', path: '/components', icon: <FaHdd /> },
      { name: 'Power Supplies', path: '/components', icon: <FaBolt /> },
      { name: 'CPU Coolers', path: '/components', icon: <FaFan /> },
      { name: 'Computer Cases', path: '/components', icon: <FaDesktop /> },
      { name: 'Gaming Components', path: '/components', icon: <FaGamepad /> },
    ]
  },
  accessories: {
    name: 'Accessories',
    icon: <FaHeadphones className="mr-2" />,
    subcategories: [
      { name: 'Keyboards', path: '/accessories', icon: <FaKeyboard /> },
      { name: 'Mice', path: '/accessories', icon: <FaMouse /> },
      { name: 'Headsets', path: '/accessories', icon: <FaHeadphones /> },
      { name: 'Speakers', path: '/accessories', icon: <FaHeadphones /> },
      { name: 'Webcams', path: '/accessories', icon: <FaCamera /> },
      { name: 'Microphones', path: '/accessories', icon: <FaHeadphones /> },
      { name: 'USB Hubs', path: '/accessories', icon: <FaPlug /> },
      { name: 'Cables', path: '/accessories', icon: <FaPlug /> },
      { name: 'Adapters', path: '/accessories', icon: <FaPlug /> },
      { name: 'Gaming Accessories', path: '/accessories', icon: <FaGamepad /> },
    ]
  },
  audio: {
    name: 'Audio',
    icon: <FaHeadphones className="mr-2" />,
    subcategories: [
      { name: 'Headphones', path: '/audio', icon: <FaHeadphones /> },
      { name: 'Wireless Earbuds', path: '/audio', icon: <FaHeadphones /> },
      { name: 'True Wireless', path: '/audio', icon: <FaHeadphones /> },
      { name: 'Bluetooth Speakers', path: '/audio', icon: <FaHeadphones /> },
      { name: 'Home Theaters', path: '/audio', icon: <FaHeadphones /> },
      { name: 'Soundbars', path: '/audio', icon: <FaHeadphones /> },
      { name: 'Studio Monitors', path: '/audio', icon: <FaHeadphones /> },
      { name: 'Amplifiers', path: '/audio', icon: <FaHeadphones /> },
      { name: 'DJ Equipment', path: '/audio', icon: <FaHeadphones /> },
    ]
  },
  cameras: {
    name: 'Cameras',
    icon: <FaCamera className="mr-2" />,
    subcategories: [
      { name: 'DSLR Cameras', path: '/cameras', icon: <FaCamera /> },
      { name: 'Mirrorless Cameras', path: '/cameras', icon: <FaCamera /> },
      { name: 'Action Cameras', path: '/cameras', icon: <FaCamera /> },
      { name: 'Point & Shoot', path: '/cameras', icon: <FaCamera /> },
      { name: 'Professional Cameras', path: '/cameras', icon: <FaCamera /> },
      { name: 'Camera Lenses', path: '/cameras', icon: <FaCamera /> },
      { name: 'Camera Accessories', path: '/cameras', icon: <FaCamera /> },
      { name: 'Security Cameras', path: '/cameras', icon: <FaCamera /> },
      { name: 'Drone Cameras', path: '/cameras', icon: <FaCamera /> },
    ]
  },
};

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-900 text-white shadow-md h-20">
      <div className="container mx-auto flex justify-between items-center py-6 px-6 md:px-10">

        {/* Logo */}
        <Link to="/" className="text-lg md:text-xl font-bold tracking-wider text-indigo-400">
          Flexifog
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center w-1/2 relative">
          <input
            type="text"
            placeholder="Search for electronic products..."
            className="w-full px-3 py-1.5 bg-gray-800 text-gray-300 rounded-l-md focus:outline-none text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-gray-800 text-gray-300 text-xs rounded-md mt-1 shadow-lg max-h-96 overflow-y-auto z-50">
              {suggestions.map((product, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-700 cursor-pointer flex items-center gap-3"
                  onClick={() => handleSuggestionClick(product)}
                >
                  <img
                    src={`http://localhost:4000/uploads/${product.image[0].split(/[\\/]/).pop()}`}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md border border-gray-700"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-indigo-400 font-semibold">₹{product.finalPrice}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            type="submit"
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 text-xs"
          >
            Search
          </button>
        </form>

        {/* Nav Links for Desktop */}
        <nav className="hidden md:flex space-x-6 items-center text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative ${isActive ? 'text-indigo-400' : 'hover:text-gray-400'} transition duration-300`
            }
          >
            Home
          </NavLink>

          {/* All Categories Mega Menu - Full Width */}
          <div className="relative group">
            <span className="flex items-center cursor-pointer hover:text-gray-400 transition duration-300">
              All Categories
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1 h-4 w-4 transform transition-transform group-hover:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
            
            {/* Full Width Mega Menu Dropdown - Adjusted for more categories */}
            <div className="fixed left-0 right-0 top-20 mt-0 opacity-0 invisible group-hover:visible group-hover:opacity-100 bg-gray-900 shadow-2xl transition-all duration-500 z-50 border-t border-gray-700">
              <div className="container mx-auto px-6 py-4">
                <div className="grid grid-cols-4 gap-4">
                  {Object.values(electronicCategories).map((category, idx) => (
                    <div key={idx} className="mb-2">
                      <h3 className="text-indigo-400 font-semibold mb-2 flex items-center text-sm border-b border-gray-700 pb-1">
                        {category.icon}
                        {category.name}
                      </h3>
                      <ul className="space-y-1">
                        {category.subcategories.slice(0, 5).map((sub, subIdx) => (
                          <li key={subIdx}>
                            <NavLink
                              to={sub.path}
                              className="text-gray-300 hover:text-indigo-400 transition text-xs flex items-center group"
                            >
                              {sub.icon && <span className="mr-1 text-gray-500 group-hover:text-indigo-400 text-xs">{sub.icon}</span>}
                              <span className="text-xs">{sub.name}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                {/* View All Categories Link */}
                <div className="border-t border-gray-700 mt-2 pt-2 text-center">
                  <NavLink
                    to="/categories"
                    className="inline-flex items-center text-indigo-400 hover:text-indigo-300 text-xs font-medium"
                  >
                    Browse All Categories
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `relative ${isActive ? 'text-indigo-400' : 'hover:text-gray-400'} transition duration-300`
            }
          >
            About Us
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `relative ${isActive ? 'text-indigo-400' : 'hover:text-gray-400'} transition duration-300`
            }
          >
            Contact
          </NavLink>

          <NavLink
            to="/support"
            className={({ isActive }) =>
              `relative ${isActive ? 'text-indigo-400' : 'hover:text-gray-400'} transition duration-300`
            }
          >
            Support
          </NavLink>
        </nav>

        {/* Account and Cart Icons */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative flex items-center">
            <div className="relative">
              <FaShoppingCart className="text-gray-400 hover:text-indigo-400 transition duration-300" size={24} />
              {/* Display item count inside the cart icon */}
              {cartItems.length > 0 && (
                <span className="absolute inset-0 flex justify-center items-center text-xs font-bold text-white bg-red-600 rounded-full w-5 h-5" style={{ top: '-4px', right: '-6px' }}>
                  {cartItems.length}
                </span>
              )}
            </div>
          </Link>

          {/* My Account Dropdown */}
          <div className="relative">
            <button onClick={toggleAccountMenu} className="flex items-center space-x-1 text-gray-400 hover:text-indigo-400 transition duration-300">
              <FaUserCircle size={20} />
              <span className="text-xs">My Account</span>
            </button>
            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 text-white rounded-md shadow-lg text-xs">
                {isLoggedIn ? (
                  <>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700 text-xs">
                      Profile
                    </Link>
                    <button onClick={handleSignOut} className="w-full text-left px-4 py-2 hover:bg-gray-700 text-xs">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/signin" className="block px-4 py-2 hover:bg-gray-700 text-xs">
                    Sign In
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-400 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className={`w-6 h-6 transform transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <nav className="md:hidden bg-gray-800 py-3 transition-all duration-500 ease-in-out transform translate-y-0 animate-[fadeInSlideDown_0.5s_ease-in-out] max-h-[80vh] overflow-y-auto">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-4 py-2 text-center ${isActive ? 'underline text-indigo-400' : 'hover:bg-gray-700 text-gray-300'
              } text-sm`
            }
            onClick={toggleMenu}
          >
            Home
          </NavLink>

          {/* All Categories in Mobile */}
          <div className="relative">
            <button
              className="w-full flex items-center justify-between px-4 py-2 text-gray-300 hover:bg-gray-700 text-sm"
              onClick={() => setDropdownOpen((prev) => ({ ...prev, categories: !prev.categories }))}
            >
              <span>All Categories</span>
              <span
                className={`transform transition-transform duration-300 ${dropdownOpen.categories ? 'rotate-180' : ''
                  }`}
              >
                ▼
              </span>
            </button>
            
            {dropdownOpen.categories && (
              <div className="bg-gray-700 p-2">
                {Object.values(electronicCategories).map((category, idx) => (
                  <div key={idx} className="mb-2">
                    <button
                      className="w-full h-10 flex items-center justify-between px-2 py-1 text-gray-300 hover:bg-gray-600 text-xs"
                      onClick={() => setDropdownOpen((prev) => ({ ...prev, [category.name]: !prev[category.name] }))}
                    >
                      <span className="flex items-center">
                        {category.icon}
                        {category.name}
                      </span>
                      <span
                        className={`transform transition-transform duration-300 ${dropdownOpen[category.name] ? 'rotate-180' : ''
                          }`}
                      >
                        ▼
                      </span>
                    </button>
                    
                    {dropdownOpen[category.name] && (
                      <ul className="pl-4 mt-1">
                        {category.subcategories.map((sub, subIdx) => (
                          <li key={subIdx} className="py-1">
                            <NavLink
                              to={sub.path}
                              className="block text-gray-300 hover:text-indigo-400 text-xs flex items-center"
                              onClick={toggleMenu}
                            >
                              {sub.icon && <span className="mr-1 text-gray-400">{sub.icon}</span>}
                              {sub.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                
                <NavLink
                  to="/categories"
                  className="block px-2 py-2 text-indigo-400 hover:text-indigo-300 text-xs text-center border-t border-gray-600 mt-2 pt-2"
                  onClick={toggleMenu}
                >
                  View All Categories
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `block px-4 py-2 text-center ${isActive ? 'underline text-indigo-400' : 'hover:bg-gray-700 text-gray-300'
              } text-sm`
            }
            onClick={toggleMenu}
          >
            About Us
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `block px-4 py-2 text-center ${isActive ? 'underline text-indigo-400' : 'hover:bg-gray-700 text-gray-300'
              } text-sm`
            }
            onClick={toggleMenu}
          >
            Contact
          </NavLink>

          <NavLink
            to="/support"
            className={({ isActive }) =>
              `block px-4 py-2 text-center ${isActive ? 'underline text-indigo-400' : 'hover:bg-gray-700 text-gray-300'
              } text-sm`
            }
            onClick={toggleMenu}
          >
            Support
          </NavLink>
        </nav>
      )}
    </header>
  );
};

export default Header;