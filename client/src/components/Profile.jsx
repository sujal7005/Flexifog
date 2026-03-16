// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaShoppingBag, 
  FaCreditCard, 
  FaGift, 
  FaStar,
  FaCrown,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaMapPin,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
  FaDownload,
  FaEye,
  FaSignOutAlt,
  FaUserCircle,
  FaCoins,
  FaTag,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userOrders, setUserOrders] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [newAddress, setNewAddress] = useState({ line1: '', line2: '', city: '', state: '', zip: '' });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [editingAddress, setEditingAddress] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser._id) {
      const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`http://localhost:4000/api/users/${storedUser._id}`);
          setUser(response.data);
          setName(response.data.name || '');
          setPhoneNumber(response.data.phoneNumber || '');
          localStorage.setItem('user', JSON.stringify(response.data));

          await Promise.all([
            fetchUserOrders(storedUser._id),
            fetchUserAddresses(storedUser._id),
            fetchTransactionHistory(storedUser._id)
          ]);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserProfile();
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  const handleInvoiceGeneration = async (order) => {
    try {
      const response = await fetch(`http://localhost:4000/api/users/orders/generate-invoice-pdf/${order._id}`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${order._id}_invoice.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.log('Error generating invoice');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUserOrders = async (userId) => {
    if (!userId) return;
    try {
      const response = await axios.get(`http://localhost:4000/api/users/${userId}/orders`);
      setUserOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
    }
  };

  const fetchUserAddresses = async (userId) => {
    if (!userId) return;
    try {
      const response = await axios.get(`http://localhost:4000/api/users/${userId}/addresses`);
      setUserAddresses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch user addresses:', error);
    }
  };

  const fetchTransactionHistory = async (userId) => {
    if (!userId) return;
    try {
      const response = await axios.get(`http://localhost:4000/api/users/${userId}/transactions`);
      setTransactionHistory(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
    }
  };

  const handleEdit = async () => {
    const updatedUser = { userId: user._id, name, phoneNumber };

    try {
      const response = await axios.put(
        'http://localhost:4000/api/users/update-user',
        updatedUser,
      );

      if (response.data.success) {
        const updatedUserData = { ...user, ...updatedUser };
        setUser(updatedUserData);
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleAddAddress = async () => {
    if (!user || !user._id) return;

    const userId = user._id;
    try {
      const response = await axios.post(`http://localhost:4000/api/users/${userId}/add-address`, newAddress);
      if (response.data.success) {
        setUserAddresses([...userAddresses, response.data.address]);
        setNewAddress({ line1: '', line2: '', city: '', state: '', zip: '' });
        setIsAddingAddress(false);
      }
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  const handleSaveEdit = async (index) => {
    if (!user || !user._id) return;
    const userId = user._id;
    const addressToSave = editingAddress;

    try {
      const response = await axios.put(
        `http://localhost:4000/api/users/${userId}/update-address/${addressToSave._id}`,
        addressToSave
      );
      if (response.data.success) {
        const updatedAddresses = [...userAddresses];
        updatedAddresses[index] = response.data.address;
        setUserAddresses(updatedAddresses);
        setEditingAddressIndex(null);
        setEditingAddress({});
      }
    } catch (error) {
      console.error('Failed to save edited address:', error);
    }
  };

  const handleRemove = async (index) => {
    if (!user || !user._id) return;
    const userId = user._id;
    const addressToRemove = userAddresses[index];
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/users/${userId}/remove-address/${addressToRemove._id}`
      );
      if (response.data.success) {
        const updatedAddresses = userAddresses.filter((_, i) => i !== index);
        setUserAddresses(updatedAddresses);
      }
    } catch (error) {
      console.error('Failed to remove address:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/users/orders/${orderId}/cancel`);
      if (response.data.success) {
        setUserOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: 'Cancelled' } : order
          )
        );
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  const handleViewOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/users/orders/${orderId}`);
      if (response.data.success) {
        setSelectedOrder(response.data.order);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Shipped':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing':
        return <FaClock className="text-yellow-400" />;
      case 'Shipped':
        return <FaTruck className="text-blue-400" />;
      case 'Delivered':
        return <FaCheckCircle className="text-green-400" />;
      case 'Cancelled':
        return <FaTimesCircle className="text-red-400" />;
      default:
        return <FaBox className="text-gray-400" />;
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/signin');
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaUser /> },
    { id: 'orders', label: 'Orders', icon: <FaShoppingBag /> },
    { id: 'addresses', label: 'Addresses', icon: <FaMapMarkerAlt /> },
    { id: 'transactions', label: 'Transactions', icon: <FaCreditCard /> },
  ];

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-indigo-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-white text-lg font-medium mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20 pb-10">
      {/* Header */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-3xl"></div>
        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition" />
              <span>Back</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              My Profile
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-gray-900"></div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <span className="flex items-center gap-2 text-gray-400">
                  <FaEnvelope className="text-indigo-400" />
                  {user.email}
                </span>
                <span className="flex items-center gap-2 text-gray-400">
                  <FaPhone className="text-indigo-400" />
                  {user.phoneNumber || 'Not provided'}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-400">{userOrders.length}</div>
                <div className="text-xs text-gray-400">Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{user.bonusPoints || 0}</div>
                <div className="text-xs text-gray-400">Points</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-800/50 rounded-xl border border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaUserCircle className="text-indigo-400" />
                    Personal Information
                  </h3>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleEdit}
                          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <FaSave />
                          Save Changes
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                        >
                          <FaTimes />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-xl">
                        <FaUser className="text-indigo-400" />
                        <div>
                          <p className="text-sm text-gray-400">Full Name</p>
                          <p className="text-white font-semibold">{user.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-xl">
                        <FaEnvelope className="text-indigo-400" />
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white font-semibold">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-xl">
                        <FaPhone className="text-indigo-400" />
                        <div>
                          <p className="text-sm text-gray-400">Phone Number</p>
                          <p className="text-white font-semibold">{user.phoneNumber || 'Not provided'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <FaEdit />
                        Edit Profile
                      </button>
                    </div>
                  )}
                </motion.div>

                {/* Rewards Section */}
                <motion.div
                  variants={itemVariants}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaCrown className="text-yellow-400" />
                    Your Rewards
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Bonus Points */}
                    <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 p-6 rounded-xl border border-yellow-500/30">
                      <div className="flex items-center gap-3 mb-4">
                        <FaCoins className="text-3xl text-yellow-400" />
                        <div>
                          <p className="text-sm text-gray-400">Bonus Points</p>
                          <p className="text-3xl font-bold text-yellow-400">{user.bonusPoints || 0}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">Earn points with every purchase and redeem them for discounts!</p>
                    </div>

                    {/* Discount Code */}
                    {user.discountCode && (
                      <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-6 rounded-xl border border-green-500/30">
                        <div className="flex items-center gap-3 mb-4">
                          <FaTag className="text-3xl text-green-400" />
                          <div>
                            <p className="text-sm text-gray-400">Active Discount Code</p>
                            <p className="text-2xl font-bold text-green-400">{user.discountCode}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <FaCalendarAlt />
                          <span>Expires on: {moment(user.discountExpiresAt).format("MMMM D, YYYY")}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-white mb-6">My Orders</h3>
                {userOrders.length > 0 ? (
                  userOrders.map((order, index) => (
                    <motion.div
                      key={order._id}
                      variants={itemVariants}
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-indigo-500/50 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Order Image */}
                        <div className="lg:w-1/4">
                          <div className="relative h-32 bg-gray-900 rounded-xl overflow-hidden">
                            <img
                              src={order.product?.image 
                                ? `http://localhost:4000/uploads/${order.product.image[0].split(/[\\/]/).pop()}`
                                : '/placeholder-image.jpg'}
                              alt={order.product?.name}
                              className="w-full h-full object-cover"
                              onError={(e) => e.target.src = '/placeholder-image.jpg'}
                            />
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-white mb-2">{order.product?.name}</h4>
                              <p className="text-sm text-gray-400">Order ID: {order._id.slice(-8)}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border ${getStatusClass(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-400">Order Date</p>
                              <p className="text-sm text-white">{moment(order.date).format('MMM Do YYYY')}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Total Amount</p>
                              <p className="text-sm font-bold text-green-400">₹{order.totalPrice?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Payment</p>
                              <p className="text-sm text-white">{order.paymentMethod}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Delivery</p>
                              <p className="text-sm text-white">{moment(order.deliveryDate).format('MMM Do YYYY')}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => handleViewOrderDetails(order._id)}
                              className="px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600/30 transition flex items-center gap-2"
                            >
                              <FaEye />
                              View Details
                            </button>
                            <button
                              onClick={() => handleInvoiceGeneration(order)}
                              className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition flex items-center gap-2"
                            >
                              <FaDownload />
                              Invoice
                            </button>
                            {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition flex items-center gap-2"
                              >
                                <FaTimesCircle />
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-800/50 rounded-2xl">
                    <FaShoppingBag className="text-5xl text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No orders yet.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Saved Addresses</h3>
                  {!isAddingAddress && (
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition flex items-center gap-2"
                    >
                      <FaPlus />
                      Add Address
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userAddresses.map((address, index) => (
                    <motion.div
                      key={address._id || index}
                      variants={itemVariants}
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                    >
                      {editingAddressIndex === index ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingAddress.line1}
                            onChange={(e) => setEditingAddress({ ...editingAddress, line1: e.target.value })}
                            placeholder="Street Address"
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                          />
                          <input
                            type="text"
                            value={editingAddress.line2}
                            onChange={(e) => setEditingAddress({ ...editingAddress, line2: e.target.value })}
                            placeholder="Apt, Suite, etc."
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={editingAddress.city}
                              onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                              placeholder="City"
                              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                            />
                            <input
                              type="text"
                              value={editingAddress.state}
                              onChange={(e) => setEditingAddress({ ...editingAddress, state: e.target.value })}
                              placeholder="State"
                              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                            />
                          </div>
                          <input
                            type="text"
                            value={editingAddress.zip}
                            onChange={(e) => setEditingAddress({ ...editingAddress, zip: e.target.value })}
                            placeholder="ZIP Code"
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(index)}
                              className="flex-1 bg-green-600/20 text-green-400 py-2 rounded-lg hover:bg-green-600/30 transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingAddressIndex(null)}
                              className="flex-1 bg-red-600/20 text-red-400 py-2 rounded-lg hover:bg-red-600/30 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start gap-3 mb-4">
                            <FaMapPin className="text-indigo-400 text-xl mt-1" />
                            <div>
                              <p className="text-white">
                                {address.line1}, {address.line2}
                              </p>
                              <p className="text-gray-400">
                                {address.city}, {address.state} {address.zip}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingAddressIndex(index);
                                setEditingAddress(address);
                              }}
                              className="flex-1 bg-yellow-600/20 text-yellow-400 py-2 rounded-lg hover:bg-yellow-600/30 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleRemove(index)}
                              className="flex-1 bg-red-600/20 text-red-400 py-2 rounded-lg hover:bg-red-600/30 transition"
                            >
                              Remove
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}

                  {isAddingAddress && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/50"
                    >
                      <h4 className="text-lg font-semibold text-white mb-4">Add New Address</h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={newAddress.line1}
                          onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                          placeholder="Street Address"
                          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        />
                        <input
                          type="text"
                          value={newAddress.line2}
                          onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                          placeholder="Apt, Suite, etc."
                          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            placeholder="City"
                            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                          />
                          <input
                            type="text"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            placeholder="State"
                            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                          />
                        </div>
                        <input
                          type="text"
                          value={newAddress.zip}
                          onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                          placeholder="ZIP Code"
                          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleAddAddress}
                            className="flex-1 bg-green-600/20 text-green-400 py-2 rounded-lg hover:bg-green-600/30 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsAddingAddress(false)}
                            className="flex-1 bg-red-600/20 text-red-400 py-2 rounded-lg hover:bg-red-600/30 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
              >
                <h3 className="text-xl font-bold text-white mb-6">Transaction History</h3>
                {transactionHistory.length > 0 ? (
                  <div className="space-y-3">
                    {transactionHistory.map((transaction, index) => (
                      <motion.div
                        key={transaction._id || index}
                        variants={itemVariants}
                        className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700"
                      >
                        <div className="flex items-center gap-4">
                          <FaMoneyBillWave className="text-2xl text-green-400" />
                          <div>
                            <p className="text-sm text-gray-400">Transaction ID</p>
                            <p className="text-white font-mono">{transaction._id.slice(-8)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">{moment(transaction.date).format('MMM Do YYYY')}</p>
                          <p className="text-lg font-bold text-green-400">₹{transaction.amount}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaCreditCard className="text-5xl text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No transactions found.</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Sign Out Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleSignOut}
          className="mt-8 w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-4 rounded-xl font-semibold transition transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <FaSignOutAlt />
          Sign Out
        </motion.button>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gray-800/95 backdrop-blur-sm p-6 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Order Details
                </h2>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Product Image */}
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <img
                    src={selectedOrder.product?.image
                      ? `http://localhost:4000/uploads/${selectedOrder.product.image[0].split(/[\\/]/).pop()}`
                      : '/placeholder-image.jpg'}
                    alt={selectedOrder.product?.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Product Details */}
                <div className="bg-gray-900/50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-2">{selectedOrder.product?.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">Product Code: {selectedOrder.product?.code}</p>
                  <p className="text-2xl font-bold text-green-400">₹{selectedOrder.totalPrice?.toLocaleString()}</p>
                </div>

                {/* User Info */}
                <div className="bg-gray-900/50 p-4 rounded-xl">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <FaUserCircle className="text-indigo-400" />
                    Customer Information
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="text-gray-400">Name:</span> {selectedOrder.userDetails?.name}</p>
                    <p className="text-sm"><span className="text-gray-400">Phone:</span> {selectedOrder.userDetails?.phoneNumber}</p>
                    <p className="text-sm"><span className="text-gray-400">Email:</span> {selectedOrder.userDetails?.email}</p>
                    <p className="text-sm"><span className="text-gray-400">Address:</span> {`${selectedOrder.userDetails?.address.line1}, ${selectedOrder.userDetails?.address.city}, ${selectedOrder.userDetails?.address.state} ${selectedOrder.userDetails?.address.zip}`}</p>
                  </div>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Order ID</p>
                    <p className="text-sm text-white font-mono">{selectedOrder._id.slice(-8)}</p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Order Date</p>
                    <p className="text-sm text-white">{moment(selectedOrder.date).format('MMM Do YYYY')}</p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Payment Method</p>
                    <p className="text-sm text-white">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Delivery Date</p>
                    <p className="text-sm text-white">{moment(selectedOrder.deliveryDate).format('MMM Do YYYY')}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-gray-900/50 p-4 rounded-xl">
                  <p className="text-xs text-gray-400 mb-2">Order Status</p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusClass(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;