import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaTrash, 
  FaArrowLeft, 
  FaPlus, 
  FaMinus,
  FaTag,
  FaShieldAlt,
  FaTruck,
  FaCreditCard,
  FaGift,
  FaPercent,
  FaArrowRight,
  FaRegHeart,
  FaHeart,
  FaStar,
  FaStarHalfAlt
} from 'react-icons/fa';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  // Calculate prices
  const subtotal = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => {
        const price = item.price || item.finalPrice || item.totalPrice || 0;
        const quantity = item.quantity || 1;
        return total + price * quantity;
      }, 0)
    : 0;

  const shipping = subtotal > 50000 ? 0 : 499;
  const tax = subtotal * 0.18; // 18% GST
  const discount = promoApplied ? subtotal * promoDiscount : 0;
  const total = subtotal + shipping + tax - discount;

  // Fetch recommendations based on cart items
  useEffect(() => {
    if (cartItems.length > 0) {
      // Simulated recommendations - replace with actual API call
      const mockRecommendations = [
        { id: 1, name: 'Wireless Mouse', price: 1499, image: '/mouse.jpg', rating: 4.5 },
        { id: 2, name: 'Gaming Keyboard', price: 3499, image: '/keyboard.jpg', rating: 4.8 },
        { id: 3, name: 'USB-C Hub', price: 1999, image: '/hub.jpg', rating: 4.3 },
        { id: 4, name: 'Laptop Stand', price: 2499, image: '/stand.jpg', rating: 4.6 },
      ];
      setRecommendations(mockRecommendations);
    }
  }, [cartItems]);

  const handleBuyNow = (product) => {
    navigate('/payment', { state: { product, quantity: product.quantity || 1 } });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const incrementQuantity = (id, quantity) => {
    if (quantity < 10) updateQuantity(id, quantity + 1);
  };

  const decrementQuantity = (id, quantity) => {
    if (quantity > 1) updateQuantity(id, quantity - 1);
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setPromoApplied(true);
      setPromoDiscount(0.1); // 10% off
    } else if (promoCode.toUpperCase() === 'SAVE20') {
      setPromoApplied(true);
      setPromoDiscount(0.2); // 20% off
    } else {
      alert('Invalid promo code');
    }
  };

  const toggleWishlist = (itemId) => {
    setWishlistItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';
    const filename = imagePath.split(/[\\/]/).pop();
    return `http://localhost:4000/uploads/${filename}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400 text-xs" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 text-xs" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-600 text-xs" />);
    }
    return stars;
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition" />
            <span>Continue Shopping</span>
          </button>

          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
                <FaShoppingCart className="text-8xl text-gray-700 mx-auto mb-6 relative z-10" />
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Your Cart is Empty
              </h2>
              <p className="text-gray-400 mb-8">
                Looks like you haven't added anything to your cart yet.
                <br />
                Explore our amazing collection and find something special!
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
              >
                Start Shopping
                <FaArrowRight />
              </button>
            </div>

            {/* Featured Categories */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Electronics', 'Fashion', 'Home', 'Sports'].map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/category/${cat.toLowerCase()}`)}
                  className="bg-gray-800/30 hover:bg-gray-800/50 p-4 rounded-xl border border-gray-700 transition group"
                >
                  <div className="text-indigo-400 text-2xl mb-2 group-hover:scale-110 transition">
                    {idx === 0 && '💻'}
                    {idx === 1 && '👕'}
                    {idx === 2 && '🏠'}
                    {idx === 3 && '⚽'}
                  </div>
                  <span className="text-gray-300 text-sm">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition" />
              <span>Continue Shopping</span>
            </button>
            <div className="flex items-center gap-3">
              <FaShoppingCart className="text-indigo-400 text-xl" />
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)} items
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => {
              const price = item.price || item.finalPrice || item.totalPrice || 0;
              const quantity = item.quantity || 1;
              const itemTotal = price * quantity;
              const isWishlisted = wishlistItems.includes(item.id);

              return (
                <div
                  key={`${item.id}-${index}`}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="relative md:w-1/4">
                      <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl overflow-hidden">
                        <img
                          src={getImageUrl(item.image?.[0] || item.image)}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <button
                        onClick={() => toggleWishlist(item.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-800 transition"
                      >
                        {isWishlisted ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart className="text-gray-400" />
                        )}
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
                          {item.brand && (
                            <span className="inline-block bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full text-sm mb-3">
                              {item.brand}
                            </span>
                          )}
                          {item.description && (
                            <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
                          )}
                          
                          {/* Selected Specs */}
                          {item.selectedSpecs && Object.keys(item.selectedSpecs).length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {Object.entries(item.selectedSpecs).map(([key, value]) => (
                                <span key={key} className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-400">
                            ₹{itemTotal.toLocaleString()}
                          </div>
                          {item.originalPrice && item.originalPrice > price && (
                            <div className="text-sm text-gray-500 line-through">
                              ₹{(item.originalPrice * quantity).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity and Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-700">
                        <div className="flex items-center gap-4">
                          <span className="text-gray-400 text-sm">Quantity:</span>
                          <div className="flex items-center bg-gray-900 rounded-lg border border-gray-700">
                            <button
                              onClick={() => decrementQuantity(item.id, quantity)}
                              disabled={quantity <= 1}
                              className="px-3 py-2 hover:bg-gray-800 rounded-l-lg transition disabled:opacity-50"
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="w-12 text-center font-semibold">{quantity}</span>
                            <button
                              onClick={() => incrementQuantity(item.id, quantity)}
                              disabled={quantity >= 10}
                              className="px-3 py-2 hover:bg-gray-800 rounded-r-lg transition disabled:opacity-50"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                          {quantity >= 10 && (
                            <span className="text-xs text-yellow-600">Max quantity reached</span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition flex items-center justify-center gap-2"
                          >
                            <FaTrash className="text-sm" />
                            <span className="sm:hidden">Remove</span>
                          </button>
                          <button
                            onClick={() => handleBuyNow(item)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition flex items-center justify-center gap-2"
                          >
                            <FaCreditCard className="text-sm" />
                            <span className="sm:hidden">Buy Now</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Clear Cart Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={clearCart}
                className="px-6 py-3 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition flex items-center gap-2"
              >
                <FaTrash />
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Summary Card */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FaTag className="text-indigo-400" />
                  Order Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)</span>
                    <span className="text-white">₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-green-400">FREE</span>
                    ) : (
                      <span className="text-white">₹{shipping.toLocaleString()}</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between text-gray-400">
                    <span>Tax (18% GST)</span>
                    <span className="text-white">₹{tax.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        ₹{total.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Inclusive of all taxes</p>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mt-6">
                  <label className="block text-sm text-gray-400 mb-2">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={!promoCode || promoApplied}
                      className="px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600/30 transition disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                      <FaGift /> Promo code applied successfully!
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Try: SAVE10 (10% off) or SAVE20 (20% off)
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <FaCreditCard />
                  Proceed to Checkout
                </button>

                {/* Payment Methods */}
                <div className="mt-6 flex items-center justify-center gap-3">
                  <img src="/visa.svg" alt="Visa" className="h-6 opacity-50 hover:opacity-100 transition" />
                  <img src="/mastercard.svg" alt="Mastercard" className="h-6 opacity-50 hover:opacity-100 transition" />
                  <img src="/amex.svg" alt="Amex" className="h-6 opacity-50 hover:opacity-100 transition" />
                  <img src="/paypal.svg" alt="PayPal" className="h-6 opacity-50 hover:opacity-100 transition" />
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <FaTruck className="text-indigo-400" />
                  Delivery Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-400">
                    <FaShieldAlt className="text-green-400" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <FaTruck className="text-blue-400" />
                    <span>Free shipping on orders above ₹50,000</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <FaGift className="text-purple-400" />
                    <span>Estimated delivery: 3-5 business days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              You Might Also Like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendations.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-indigo-500/50 transition-all cursor-pointer group"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <div className="aspect-square bg-gray-700 rounded-lg mb-3 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center text-4xl">
                      {item.icon || '📦'}
                    </div>
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1 group-hover:text-indigo-400 transition">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(item.rating)}
                    <span className="text-xs text-gray-500 ml-1">({item.rating})</span>
                  </div>
                  <p className="text-indigo-400 font-bold">₹{item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .cart-item {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Cart;