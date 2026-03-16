import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const product = location.state?.product; // Retrieve product data from Cart
  const { cart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(product?.quantity || 1);
  const [step, setStep] = useState(1);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  const [userAddresses, setUserAddresses] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [paymentStatus, setPaymentStatus] = useState({
    success: '',
    error: '',
  });
  const [confirmation, setConfirmation] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [selectedRam, setSelectedRam] = useState(null);
  const [selectedStorage1, setSelectedStorage1] = useState(null);
  const [selectedStorage2, setSelectedStorage2] = useState(null);
  const [discountedPrice, setDiscountedPrice] = useState(product?.finalPrice);
  const [discountAmount, setDiscountAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = localStorage.getItem('user');
      if (!loggedInUser) return;

      try {
        const parsedUser = JSON.parse(loggedInUser);
        const userId = parsedUser?._id;

        if (!userId) return;

        const userResponse = await axios.get(`http://localhost:4000/api/users/${userId}`);
        const userData = userResponse.data;

        const addressResponse = await axios.get(`http://localhost:4000/api/users/${userId}/addresses`);
        const addresses = addressResponse.data;

        setUserDetails((prev) => ({
          ...prev,
          name: userData?.name || '',
          email: userData?.email || '',
          phoneNumber: userData?.phoneNumber || '',
          address: addresses?.length > 0
            ? {
              line1: addresses[0].line1 || '',
              line2: addresses[0].line2 || '',
              city: addresses[0].city || '',
              state: addresses[0].state || '',
              zip: addresses[0].zip || ''
            }
            : { line1: '', line2: '', city: '', state: '', zip: '' },
        }));

        setUserAddresses(Array.isArray(addresses) ? addresses : []);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      const cartProduct = cart.find((item) => item._id === product?._id);
      if (cartProduct) {
        setQuantity(cartProduct.quantity);
      }
    }
  }, [cart, product]);

  const calculateTotalPrice = () => {
    let basePrice = product?.finalPrice || 0;

    if (discountApplied) {
      basePrice -= discountAmount;
    }
  
    let ramPrice = selectedRam ? selectedRam.price : product?.specs?.ramOptions?.[0]?.price || 0;
    let storage1Price = selectedStorage1 ? selectedStorage1.price : product?.specs?.storage1Options?.[0]?.price || 0;
    let storage2Price = selectedStorage2 ? selectedStorage2.price : product?.specs?.storage2Options?.[0]?.price || 0;
  
    return basePrice + ramPrice + storage1Price + storage2Price;
  };
  
  useEffect(() => {
    setDiscountedPrice(calculateTotalPrice());
  }, [selectedRam, selectedStorage1, selectedStorage2, product, discountApplied, discountAmount]);

  const handleNextStep = () => {
    if (step === 1) {
      if (!userDetails.name || !userDetails.email || !userDetails.phoneNumber || !userDetails.address) {
        alert('Please fill in all user details.');
        return;
      }
    } else if (step === 2) {
      if (!paymentMethod) {
        alert('Please select a payment method.');
        return;
      }
      if (paymentMethod === 'creditCard' && (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv)) {
        alert('Please fill in all card details.');
        return;
      }
    }
    setStep((prevStep) => Math.min(prevStep + 1, 3));
  };

  const handlePreviousStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  const handleConfirmPayment = async () => {
    if (!userDetails.name || !userDetails.email || !userDetails.phoneNumber || !userDetails.address) {
      alert('All user details are required.');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }
    if (paymentMethod === 'creditCard' && (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv)) {
      alert('Please fill in all card details.');
      return;
    }

    const loggedInUserId = localStorage.getItem('user');
    const parsedUser = loggedInUserId ? JSON.parse(loggedInUserId) : null;

    const userWithUserId = {
      ...userDetails,
      userId: parsedUser ? parsedUser._id : null
    };

    if (!userWithUserId.userId) {
      alert('User is not logged in or userId is missing.');
      return;
    }

    const apiUrlMap = {
      paypal: '/api/create-paypal-order',
      creditCard: '/api/credit-card',
      gpay: '/api/google-pay',
      phonepay: '/api/phone-pay',
      paytm: '/api/paytm',
      netbanking: '/api/net-banking',
      cashOnDelivery: '/api/cash-on-delivery',
    };

    try {
      const apiUrl = apiUrlMap[paymentMethod];
      if (!apiUrl) {
        setPaymentStatus({ error: 'Invalid payment method', success: '' });
        return;
      }

      const response = await fetch(`http://localhost:4000${apiUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderDetails: {
            product,
            userDetails: userWithUserId,
            quantity,
            totalPrice: calculateTotalPrice(),
          },
        }),
      });

      if (response.ok) {
        setPaymentStatus({ success: 'Payment successful!', error: '' });
        navigate('/profile');
      } else {
        const error = await response.json();
        setPaymentStatus({ error: error.message || 'Payment failed.', success: '' });
      }
    } catch (err) {
      setPaymentStatus({ error: err.message, success: '' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(newQuantity > 0 ? newQuantity : 1);
  };

  const applyDiscount = async () => {
    if (discountCode.trim() === "") {
      setDiscountError("Please enter a discount code.");
      return;
    }
    const loggedInUserId = localStorage.getItem("user");
    const parsedUser = loggedInUserId ? JSON.parse(loggedInUserId) : null;
    const userId = parsedUser ? parsedUser._id : null;

    try {
      const response = await fetch("http://localhost:4000/api/apply-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCode, totalAmount: calculateTotalPrice(), userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setDiscountedPrice(data.discountedPrice);
        setDiscountAmount(data.discountValue);
        setDiscountApplied(true);
        setDiscountError("");
      } else {
        setDiscountError(data.error);
        setDiscountApplied(false);
      }
    } catch (error) {
      setDiscountError("Failed to apply discount. Try again.");
      console.error("Error:", error);
    }
  };

  // Progress bar component
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= stepNumber 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-20 h-1 mx-2 ${
                step > stepNumber ? 'bg-indigo-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>Details</span>
        <span>Payment</span>
        <span>Confirm</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
          <p className="mt-2 text-gray-600">Secure and easy checkout</p>
        </div>

        {/* Progress Bar */}
        <ProgressBar />

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Product Summary */}
          {product && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-gray-200">
              <div className="flex items-center space-x-6">
                <img
                  src={`http://localhost:4000/uploads/${product.image[0]?.split(/[\\/]/).pop()}`}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold text-indigo-600">
                        ₹{(discountApplied ? discountedPrice : calculateTotalPrice()).toFixed(2)}
                      </span>
                      {discountApplied && (
                        <span className="text-sm text-green-600 font-medium">
                          You save ₹{discountAmount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-gray-600">Qty:</label>
                      <select
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Status Messages */}
          {paymentStatus.success && (
            <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">{paymentStatus.success}</p>
            </div>
          )}
          {paymentStatus.error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">{paymentStatus.error}</p>
            </div>
          )}

          {/* Step 1: User Details */}
          {step === 1 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                    placeholder="Full Name"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                  />
                  <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                    placeholder="Email Address"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                  />
                </div>

                <input
                  type="tel"
                  name="phoneNumber"
                  value={userDetails.phoneNumber}
                  onChange={(e) => setUserDetails({...userDetails, phoneNumber: e.target.value})}
                  placeholder="Phone Number"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="line1"
                    value={userDetails.address?.line1 || ''}
                    onChange={handleChange}
                    placeholder="Address Line 1"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                  />
                  <input
                    type="text"
                    name="line2"
                    value={userDetails.address?.line2 || ''}
                    onChange={handleChange}
                    placeholder="Address Line 2 (Optional)"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    name="city"
                    value={userDetails.address?.city || ''}
                    onChange={handleChange}
                    placeholder="City"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                  />
                  <input
                    type="text"
                    name="state"
                    value={userDetails.address?.state || ''}
                    onChange={handleChange}
                    placeholder="State"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                  />
                  <input
                    type="text"
                    name="zip"
                    value={userDetails.address?.zip || ''}
                    onChange={handleChange}
                    placeholder="ZIP Code"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full col-span-2 md:col-span-1"
                  />
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="mt-8 w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>

              <div className="space-y-6">
                {/* Payment Method Selection */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { value: 'creditCard', label: 'Credit Card', icon: '💳' },
                    { value: 'gpay', label: 'Google Pay', icon: '📱' },
                    { value: 'phonepay', label: 'PhonePe', icon: '📲' },
                    { value: 'paytm', label: 'Paytm', icon: '💰' },
                    { value: 'paypal', label: 'PayPal', icon: '🌐' },
                    { value: 'netbanking', label: 'Net Banking', icon: '🏦' },
                    { value: 'cashOnDelivery', label: 'Cash on Delivery', icon: '💵' },
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value)}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center space-y-2 transition-all duration-200 ${
                        paymentMethod === method.value
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{method.label}</span>
                    </button>
                  ))}
                </div>

                {/* Credit Card Details */}
                {paymentMethod === 'creditCard' && (
                  <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-4">Card Details</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardChange}
                        placeholder="Card Number"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={handleCardChange}
                          placeholder="MM/YY"
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                        />
                        <input
                          type="text"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardChange}
                          placeholder="CVV"
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Discount Code Section */}
                <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">Have a discount code?</h3>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      onClick={applyDiscount}
                      disabled={discountApplied}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                        discountApplied
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {discountApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                  {discountError && (
                    <p className="mt-2 text-sm text-red-600">{discountError}</p>
                  )}
                  {discountApplied && (
                    <p className="mt-2 text-sm text-green-600">
                      🎉 Discount applied! You saved ₹{discountAmount}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={handlePreviousStep}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>

              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{calculateTotalPrice().toFixed(2)}</span>
                    </div>
                    {discountApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Quantity</span>
                      <span>{quantity}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-gray-900">
                      <span>Total</span>
                      <span className="text-xl text-indigo-600">
                        ₹{(calculateTotalPrice() * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">Shipping Details</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-medium">Name:</span> {userDetails.name}</p>
                    <p><span className="font-medium">Email:</span> {userDetails.email}</p>
                    <p><span className="font-medium">Phone:</span> {userDetails.phoneNumber}</p>
                    <p><span className="font-medium">Address:</span> {userDetails.address?.line1}, {userDetails.address?.line2}, {userDetails.address?.city}, {userDetails.address?.state} - {userDetails.address?.zip}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">Payment Method</h3>
                  <p className="text-gray-600 capitalize">{paymentMethod.replace(/([A-Z])/g, ' $1').trim()}</p>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={handlePreviousStep}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmPayment}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure payment powered by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;