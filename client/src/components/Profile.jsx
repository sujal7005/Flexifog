// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { generateInvoice } from '../utils/utils';

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
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser._id) {
      // Fetch user profile if user data exists in localStorage
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/users/${storedUser._id}`);
          setUser(response.data); // Set the updated user data
          setName(response.data.name || '');
          setPhoneNumber(response.data.phoneNumber || '');
          localStorage.setItem('user', JSON.stringify(response.data)); // Update localStorage with latest data

          // Optionally, fetch orders, addresses, transaction history
          fetchUserOrders(storedUser._id);
          fetchUserAddresses(storedUser._id);
          fetchTransactionHistory(storedUser._id);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile();
    } else {
      navigate('/signin'); // Redirect to sign-in if no user found in localStorage
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
    if (!userId) {
      console.error("User ID is not defined");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/api/users/${userId}/orders`);
      setUserOrders(Array.isArray(response.data) ? response.data : []);
      console.log('User Orders:', response.data);
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
    }
  };

  const fetchUserAddresses = async (userId) => {
    if (!userId) {
      console.error("User ID is not defined");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:4000/api/users/${userId}/addresses`);
      setUserAddresses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch user addresses:', error);
    }
  };

  const fetchTransactionHistory = async (userId) => {
    if (!userId) {
      console.error("User ID is not defined");
      return;
    }
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
    if (!user || !user._id) {
      console.error("User ID is not available");
      return;
    }

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
    if (!user || !user._id) {
      console.error("User ID is not available");
      return;
    }
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
    if (!user || !user._id) {
      console.error("User ID is not available");
      return;
    }
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
        alert('Order cancelled successfully');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order');
    }
  };

  const handleViewOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/users/orders/${orderId}`);
      if (response.data.success) {
        console.log("view order", response.data.order)
        setSelectedOrder(response.data.order);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      alert('Failed to fetch order details');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-500 text-black';
      case 'Shipped':
        return 'bg-blue-500 text-white';
      case 'Delivered':
        return 'bg-green-500 text-white';
      case 'Cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
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

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto mt-20 p-8 bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-400 drop-shadow-lg">My Profile</h2>

      <div className="flex flex-col sm:flex-row gap-6 p-4 sm:p-6">
        {/* Left Column: My Account */}
        <div className="flex-1 bg-gray-700 p-6 rounded-lg shadow-md transition hover:shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-white border-b pb-2">My Account</h3>
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-600 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Full Name"
              />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 bg-gray-600 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Phone Number"
              />
              <button
                onClick={handleEdit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md shadow-md transition"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p><strong>Full Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone Number:</strong> {user.phoneNumber || 'N/A'}</p>

              {/* Bonus Points */}
              <p className="text-xl font-semibold text-yellow-300 bg-yellow-800 p-3 rounded-lg shadow-md drop-shadow-[0_0_10px_rgba(255,223,0,0.7)]">
                <strong>Bonus Points:</strong> {user.bonusPoints}
              </p>

              {/* Discount Code Floating Box */}
              <div className="bg-gray-800 p-5 rounded-lg shadow-md border border-gray-700 mt-4 hover:shadow-green-400/50 transition">
                <h3 className="text-xl font-bold mb-2 text-white">Discount Code</h3>
                <p className="text-lg font-semibold text-green-400">{user.discountCode}</p>
                <p className="text-white">Expires on: {moment(user.discountExpiresAt).format("MMMM D, YYYY")}</p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md shadow-md transition duration-300"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Your Orders */}
        <div className="mt-6 flex-1 bg-gray-700 p-4 sm:p-6 rounded-lg sm:mt-0 shadow-md">
          <h3 className="text-3xl font-bold mb-4 text-white border-b pb-2">Your Orders</h3>
          {userOrders.length > 0 ? (
            <ul className="space-y-4">
              {userOrders.map((order) => (
                <div>
                  <li key={order._id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out border border-gray-600">
                    {/* Order Summary */}
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                      <p className="text-white font-semibold text-lg">Order ID: <span className="text-blue-400">{order._id}</span></p>
                      <p className={`font-semibold px-3 py-1 rounded-md text-white ${getStatusClass(order.status)} transition-all duration-500 ease-in-out`}>
                        {order.status}
                      </p>
                    </div>

                    <p className="text-sm text-white mb-2"><strong>Product Name:</strong> {order.product?.name}</p>
                    <p className="text-sm text-white mb-2"><strong>Order Date:</strong> {moment(order.date).format('MMM Do YYYY')}</p>
                    <p className="text-sm text-white mb-2"><strong>Payment Method:</strong> {order.paymentMethod}</p>

                    {/* Show More Section */}
                    {expandedOrder === order._id && (
                      <div className="mt-4 bg-gray-600 p-4 rounded-md transition duration-300 ease-in-out">
                        <h4 className="text-lg text-white font-semibold mb-2 border-b pb-2">Order Details</h4>
                        <p className="text-sm text-white mb-2"><strong>Delivery Date:</strong> {moment(order.deliveryDate).format("MMM Do YYYY")}</p>
                        <p className="text-sm text-white mb-2"><strong>Total Price:</strong> <span className="text-green-400 font-semibold">₹{order.totalPrice.toLocaleString()}</span></p>
                        <p className="text-sm text-white mb-2"><strong>Customer Name:</strong> {order.userDetails?.name}</p>
                        <p className="text-sm text-white mb-2"><strong>Customer Email:</strong> {order.userDetails?.email}</p>
                        <p className="text-sm text-white mb-2"><strong>Phone Number:</strong> {order.userDetails?.phoneNumber}</p>
                        <p className="text-sm text-white mb-2"><strong>Address:</strong>
                          {order.userDetails?.address?.street}, {order.userDetails?.address?.city},
                          {order.userDetails?.address?.state}, {order.userDetails?.address?.zipCode}
                        </p>
                        <p className="text-sm text-white"><strong>Product Type:</strong> {order.product?.type}</p>
                      </div>
                    )}

                    <div className='flex flex-wrap items-center space-x-3 mt-4'>
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                        onClick={() => handleViewOrderDetails(order._id)}
                      >
                        View Details
                      </button>

                      {/* Button to generate invoice */}
                      <button onClick={() => handleInvoiceGeneration(order)}
                        className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 ease-in-out">
                        Generate Invoice
                      </button>

                      {order.status !== 'Cancelled' && order.status !== "Delivered" && (
                        <button
                          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          Cancel Order
                        </button>
                      )}

                      {/* Toggle Show More Button */}
                      <button
                        className="ml-auto text-white text-sm underline hover:text-gray-300 transition duration-300"
                        onClick={() => toggleExpand(order._id)}
                      >
                        {expandedOrder === order._id ? "Show Less" : "Show More"}
                      </button>
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          ) : (
            <p>No orders found.</p>
          )}
        </div>
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-2xl p-6 rounded-lg shadow-lg relative max-h-screen overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Order Details</h2>
                <button
                  className="absolute top-4 right-4 text-red-500 hover:text-gray-800 text-2xl h-10 w-10 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded-full"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
              </div>

              {/* Product Details */}
              <div className="mb-6">
                <img
                  src={selectedOrder.product?.image
                    ? `http://localhost:4000/uploads/${selectedOrder.product.image[0].split('\\').pop()}`
                    : '/path/to/placeholder-image.jpg'}
                  alt={selectedOrder.product?.name}
                  className="w-full h-[300px] object-cover mb-4 rounded-lg shadow-md"
                />
                <p className="text-gray-800 dark:text-gray-300"><strong>Product Name:</strong> {selectedOrder.product?.name}</p>
                <p className="text-gray-800 dark:text-gray-300"><strong>Product Code:</strong> {selectedOrder.product?.code}</p>
                <p className="text-gray-800 dark:text-gray-300"><strong>Product Final Price:</strong> <span className="text-green-500 font-semibold">{selectedOrder?.totalPrice ? `₹${selectedOrder.totalPrice.toLocaleString()}` : "Price not available"}</span></p>
              </div>

              {/* User Info */}
              <div className="mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">User Information</h3>
                <p className="text-gray-700 dark:text-gray-300"><strong>Name:</strong> {selectedOrder.userDetails?.name}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Phone:</strong> {selectedOrder.userDetails?.phoneNumber}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Address:</strong> {`${selectedOrder.userDetails?.address.line1}, ${selectedOrder.userDetails?.address.line2}, ${selectedOrder.userDetails?.address.city}, ${selectedOrder.userDetails?.address.state}, ${selectedOrder.userDetails?.address.zip}`}</p>
              </div>

              {/* Order Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">Order Information</h3>
                <p className="text-gray-700 dark:text-gray-300"><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Order Date:</strong> {moment(selectedOrder.date).format('MMM Do YYYY')}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Delivery Date:</strong> {moment(selectedOrder.deliveryDate).format('MMM Do YYYY')}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Status:</strong>
                  <span className={`ml-2 px-3 py-1 rounded-full text-white ${selectedOrder.status === "Delivered" ? "bg-green-500" : selectedOrder.status === "Pending" ? "bg-yellow-500" : "bg-red-500"}`}>
                    {selectedOrder.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-1 flex flex-wrap justify-between gap-6 p-6">
        {/* Left Column: User Addresses */}
        <div className="flex-1 bg-gray-700 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-4">User Addresses</h3>
          {userAddresses.length > 0 ? (
            <ul className="space-y-3">
              {userAddresses.map((address, index) => (
                <li key={address.id || address._id || index} className="bg-gray-700 p-4 rounded-lg">
                  {editingAddressIndex === index ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingAddress.line1}
                        onChange={(e) => setEditingAddress({ ...editingAddress, line1: e.target.value })}
                        placeholder="Street Address or P.O. Box"
                        className="w-full px-4 py-2 bg-gray-600 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={editingAddress.line2}
                        onChange={(e) => setEditingAddress({ ...editingAddress, line2: e.target.value })}
                        placeholder="Apt, Suite, Unit, etc."
                        className="w-full px-4 py-2 bg-gray-600 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={editingAddress.city}
                        onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                        placeholder="City"
                        className="w-full px-4 py-2 bg-gray-600 text-gray-300 rounded-lg focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editingAddress.state}
                        onChange={(e) => setEditingAddress({ ...editingAddress, state: e.target.value })}
                        placeholder="State"
                        className="w-full px-4 py-2 bg-gray-600 text-gray-300 rounded-lg focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editingAddress.zip}
                        onChange={(e) => setEditingAddress({ ...editingAddress, zip: e.target.value })}
                        placeholder="ZIP Code"
                        className="w-full px-4 py-2 bg-gray-600 text-gray-300 rounded-lg focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(index)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingAddressIndex(null)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-300">
                        <strong>Address:</strong> {address.line1}, {address.line2}, {address.city}, {address.state} {address.zip}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingAddressIndex(index);
                            setEditingAddress(address);
                          }}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded-lg transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemove(index)}
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300">No addresses found.</p>
          )}
          {!isAddingAddress ? (
            <button
              onClick={() => setIsAddingAddress(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg mt-4 transition-all"
            >
              Add Address
            </button>
          ) : (
            <div className="space-y-3 mt-4">
              <input
                type="text"
                value={newAddress.line1}
                onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                placeholder="Street Address or P.O. Box"
                className="w-full px-4 py-2 bg-gray-600 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newAddress.line2}
                onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                placeholder="Apt, Suite, Unit, etc."
                className="w-full px-4 py-2 bg-gray-600 text-gray-300 rounded-lg focus:outline-none"
              />
              <input
                type="text"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                placeholder="City"
                className="w-full px-4 py-2 bg-gray-600 text-gray-300 rounded-lg focus:outline-none"
              />
              <input
                type="text"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                placeholder="State"
                className="w-full px-4 py-2 bg-gray-600 text-gray-300 rounded-lg focus:outline-none"
              />
              <input
                type="text"
                value={newAddress.zip}
                onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                placeholder="ZIP Code"
                className="w-full px-4 py-2 bg-gray-600 text-gray-300 rounded-lg focus:outline-none"
              />
              <button
                onClick={handleAddAddress}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all"
              >
                Save Address
              </button>
              <button
                onClick={() => setIsAddingAddress(false)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg mt-2 transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Transaction History */}
        <div className="flex-1 bg-gray-700 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-4">Transaction History</h3>
          {transactionHistory.length > 0 ? (
            <ul className="space-y-3">
              {transactionHistory.map((transaction, index) => (
                <li key={transaction.id || index} className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-300">
                    <strong>Transaction ID:</strong> {transaction._id}
                  </p>
                  <p className="text-gray-300">
                    <strong>Date:</strong> {moment(transaction.date).format("MMM Do YYYY")}
                  </p>
                  <p className="text-gray-300">
                    <strong>Amount:</strong> ₹{transaction.amount}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300">No transactions found.</p>
          )}
        </div>

        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg mt-6 transition-all"
        >
          Sign Out
        </button>
      </div>

    </div>
  );
};

export default Profile;