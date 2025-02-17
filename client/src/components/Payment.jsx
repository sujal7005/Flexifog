import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const product = location.state?.product; // Retrieve product data from Cart
  const { cart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(product.quantity || 1);
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
        // console.log('User addresses:', addresses);

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
    // If the product is from the cart, update the quantity from the cart
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      const cartProduct = cart.find((item) => item._id === product._id);
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
  
    // Adding selected options if available
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
      // Validate user details before proceeding
      if (!userDetails.name || !userDetails.email || !userDetails.phoneNumber || !userDetails.address) {
        alert('Please fill in all user details.');
        return;
      }
    } else if (step === 2) {
      // Validate payment method
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
    // console.log('Logged in user from localStorage:', loggedInUserId);

    const parsedUser = loggedInUserId ? JSON.parse(loggedInUserId) : null;
    // console.log('Parsed user:', parsedUser);

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
    // Simulate payment confirmation

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
      console.log('Sending data:', { product, userDetails: userWithUserId, totalPrice: calculateTotalPrice(), });

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
        [name]: value,  // Update the specific field in the address object
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

  // Function to apply discount dynamically
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

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow-lg transition-all duration-500 ease-in-out transform hover:scale-105">
      <h2 className="text-2xl font-bold mb-4 text-center animate-fade-in">Payment Process</h2>

      {paymentStatus.success && (
        <div className="p-4 bg-green-500 text-white rounded animate-bounce">
          {paymentStatus.success}
        </div>
      )}
      {paymentStatus.error && (
        <div className="p-4 bg-red-500 text-white rounded animate-shake">
          {paymentStatus.error}
        </div>
      )}

      {/* Display selected product details */}
      {product && (
        <div className="flex flex-col md:flex-row items-center gap-6 animate-slide-up">

          {/* Left Side - Product Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={`http://localhost:4000/uploads/${product.image[0].split('\\').pop()}`}
              alt={product.name}
              className="w-40 h-40 object-cover rounded-lg shadow-md border border-gray-500 transition-transform duration-300 hover:scale-110"
            />
          </div>

          {/* Right Side - Product Details */}
          <div className="w-full md:w-1/2">
            <h3 className="text-xl font-bold">
              {product?.name || 'No Name Available'}
            </h3>
            <p>{product.description}</p>
            <p className="font-semibold text-lg">
              Price: ₹{discountApplied ? discountedPrice.toFixed(2) : (calculateTotalPrice() * quantity).toFixed(2)}
            </p>
            {discountApplied && (
              <p className="text-green-400">Discount Applied: ₹{discountAmount} off 🎉</p>
            )}
            {/* {console.log(product)} */}
            {/* Quantity Selection */}
            <div className="flex items-center mt-3">
              <label className="font-semibold mr-2">Quantity:</label>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 text-center border border-gray-500 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 1: User Details */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h3 className="text-xl font-semibold mb-4">Enter Your Details</h3>
          {['name', 'email', 'phoneNumber'].map((field) => (
            <input
              key={field}
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              value={userDetails[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="p-2 border border-gray-500 rounded w-full mb-2 text-black focus:ring-2 focus:ring-blue-500"
            />
          ))}

          {/* Separate inputs for each address field */}
          {['line1', 'line2', 'city', 'state', 'zip'].map((field) => (
            <div key={field} className="mb-4 animate-slide-up">
              <label htmlFor={field} className="block text-sm font-medium text-white">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                type="text"
                name={field}
                value={userDetails.address?.[field] || ''}
                onChange={(e) => handleChange({ target: { name: field, value: e.target.value } })}
                placeholder={`Enter your ${field}`}
                className="p-2 border border-gray-500 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
          ))}

          <button
            onClick={handleNextStep}
            className="bg-blue-500 text-white p-2 rounded w-full mt-4 transition-all duration-300 hover:bg-blue-600 hover:scale-105">
            Next
          </button>
        </div>
      )}

      {/* Step 2: Payment Method Selection */}
      {step === 2 && (
        <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 w-full max-w-lg mx-auto border border-gray-300 animate-fade-in">
          <h3 className="text-2xl font-bold text-gray-800 mb-5 text-center animate-slide-down">
            Select Payment Method
          </h3>

          {/* Payment Method Dropdown */}
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="p-3 border border-gray-400 rounded-lg w-full mb-5 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-transform transform hover:scale-105 duration-200 ease-in-out"
          >
            <option value="">Choose a payment method</option>
            <option value="creditCard">Credit Card</option>
            <option value="gpay">Google Pay</option>
            <option value="phonepay">Phone Pay</option>
            <option value="paytm">Paytm</option>
            <option value="paypal">PayPal</option>
            <option value="netbanking">Net Banking</option>
            <option value="cashOnDelivery">Cash on Delivery</option>
          </select>

          {/* Credit Card Fields */}
          {paymentMethod === "creditCard" && (
            <div className="space-y-3">
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardChange}
                placeholder="Card Number"
                className="p-3 border border-gray-400 rounded-lg w-full text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-transform transform hover:scale-105 duration-200 ease-in-ou"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleCardChange}
                  placeholder="MM/YY"
                  className="p-3 border border-gray-400 rounded-lg w-1/2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-transform transform hover:scale-105 duration-200 ease-in-out"
                />
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  placeholder="CVV"
                  className="p-3 border border-gray-400 rounded-lg w-1/2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-transform transform hover:scale-105 duration-200 ease-in-out"
                />
              </div>
            </div>
          )}

          {/* Discount Code Section */}
          <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-300 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 animate-slide-up">
              Apply Discount Code
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder="Enter discount code"
                className="p-3 border border-gray-400 rounded-lg w-full text-gray-700 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-transform transform hover:scale-105 duration-200 ease-in-out"
              />
              <button
                onClick={applyDiscount}
                disabled={discountApplied}
                className={`p-3 rounded-lg w-1/3 font-semibold transition-transform transform ${discountApplied
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white hover:scale-110 duration-200 ease-in-out"
                  }`}
              >
                {discountApplied ? "Applied" : "Apply"}
              </button>
            </div>
            {discountError && <p className="text-red-500 mt-2 animate-pulse">{discountError}</p>}
            {discountApplied && (
              <p className="text-green-500 mt-2 animate-slide-up">
                🎉 Discount Applied! ₹{product.originalPrice - discountedPrice} off <br />
                <span className="font-bold">New Price: ₹{discountedPrice.toFixed(2)}</span>
              </p>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 animate-fade-in">
            <button
              onClick={handlePreviousStep}
              className="w-1/3 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-transform transform hover:scale-105 duration-200 ease-in-out font-semibold"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="w-1/3 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-110 duration-200 ease-in-out font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      )}


      {/* Step 3: Confirm Payment */}
      {step === 3 && (
        <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 w-full max-w-lg mx-auto border border-gray-300 transition-all duration-500 ease-in-out transform scale-95 hover:scale-100 animate-fadeIn">

          {/* Heading */}
          <h3 className="text-2xl font-bold text-gray-800 mb-5 text-center animate-slideUp">Confirm Purchase</h3>

          {/* User Details */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-300 transition-all duration-500 ease-in-out hover:shadow-md">
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Name:</span> {userDetails.name}
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Email:</span> {userDetails.email}
            </p>
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Phone:</span> {userDetails.phoneNumber}
            </p>
            <p className="mb-4 text-gray-700">
              <span className="font-semibold">Payment Method:</span> {paymentMethod}
            </p>
          </div>

          {/* Confirmation Message or Button */}
          {confirmation ? (
            <p className="text-green-500 font-semibold mt-4 animate-fadeIn">✅ Payment Confirmed!</p>
          ) : (
            <button onClick={handleConfirmPayment} className="w-full p-3 mt-4 bg-green-500 text-white rounded-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-green-600 focus:ring-2 focus:ring-green-400">
              Confirm Payment
            </button>
          )}
          <button onClick={handlePreviousStep} className="w-full p-3 mt-2 bg-gray-500 text-white rounded-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-600 focus:ring-2 focus:ring-gray-400">
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;