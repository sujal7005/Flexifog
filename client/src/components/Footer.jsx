import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Support', href: '/support' },
      { name: 'FAQ', href: '/faq' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Returns Policy', href: '/returns' },
      { name: 'Shipping Info', href: '/shipping' },
    ],
    categories: [
      { name: 'Mobiles', href: '/mobiles' },
      { name: 'Laptops', href: '/laptops' },
      { name: 'TVs', href: '/tvs' },
      { name: 'Accessories', href: '/accessories' },
    ]
  };

  const socialLinks = [
    { icon: 'fab fa-facebook-f', href: 'https://facebook.com', label: 'Facebook' },
    { icon: 'fab fa-twitter', href: 'https://twitter.com', label: 'Twitter' },
    { icon: 'fab fa-instagram', href: 'https://instagram.com', label: 'Instagram' },
    { icon: 'fab fa-linkedin-in', href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: 'fab fa-youtube', href: 'https://youtube.com', label: 'YouTube' },
  ];

  const paymentIcons = [
    'fab fa-cc-visa',
    'fab fa-cc-mastercard',
    'fab fa-cc-amex',
    'fab fa-cc-paypal',
    'fab fa-google-pay',
    'fab fa-apple-pay',
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Flexifog
            </h2>
            <p className="text-gray-300 mb-6 max-w-md">
              Your one-stop destination for the latest electronics and gadgets. 
              We bring you the best products at competitive prices with exceptional customer service.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <i className="fas fa-map-marker-alt w-5 text-blue-400"></i>
                <span>123 Tech Street, Silicon Valley, CA 94025</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <i className="fas fa-phone-alt w-5 text-blue-400"></i>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <i className="fas fa-envelope w-5 text-blue-400"></i>
                <span>support@flexifog.com</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h5 className="text-lg font-semibold mb-4 text-white relative inline-block">
              Company
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-blue-500"></span>
            </h5>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                  >
                    <i className="fas fa-chevron-right text-xs mr-2 text-blue-400"></i>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h5 className="text-lg font-semibold mb-4 text-white relative inline-block">
              Legal
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-blue-500"></span>
            </h5>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                  >
                    <i className="fas fa-chevron-right text-xs mr-2 text-blue-400"></i>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h5 className="text-lg font-semibold mb-4 text-white relative inline-block">
              Shop Popular
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-blue-500"></span>
            </h5>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                  >
                    <i className="fas fa-chevron-right text-xs mr-2 text-blue-400"></i>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700 pt-10 mb-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h5 className="text-xl font-semibold mb-2">Subscribe to Our Newsletter</h5>
              <p className="text-gray-400">Get the latest updates on new products and exclusive offers</p>
            </div>
            
            <form
              className="flex flex-col sm:flex-row w-full lg:w-auto"
              onSubmit={async (e) => {
                e.preventDefault();
                const emailInput = e.target.elements.email;

                if (!emailInput || !emailInput.value) {
                  alert("Please enter a valid email.");
                  return;
                }

                const email = emailInput.value;

                try {
                  const response = await fetch("http://localhost:4000/api/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                  });

                  const result = await response.json();
                  alert(result.message);
                  emailInput.value = ''; // Clear input after success
                } catch (error) {
                  console.error("Error subscribing:", error);
                  alert("Failed to subscribe. Please try again later.");
                }
              }}
            >
              <div className="flex flex-col sm:flex-row w-full max-w-md">
                <div className="relative flex-grow">
                  <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 rounded-lg sm:rounded-r-none bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg sm:rounded-l-none font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">We accept:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {paymentIcons.map((icon, index) => (
                <i key={index} className={`${icon} text-2xl text-gray-400 hover:text-white transition-colors duration-300`}></i>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} Flexifog. All rights reserved. 
              <span className="block md:inline md:ml-2 text-gray-500">
                Built with <i className="fas fa-heart text-red-500 mx-1"></i> for tech enthusiasts
              </span>
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300 transform hover:scale-110 group"
                  aria-label={social.label}
                >
                  <i className={`${social.icon} text-gray-300 group-hover:text-white`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-xs text-gray-500">
            <span className="flex items-center">
              <i className="fas fa-shield-alt mr-2 text-blue-400"></i>
              Secure Shopping
            </span>
            <span className="flex items-center">
              <i className="fas fa-truck mr-2 text-blue-400"></i>
              Free Shipping
            </span>
            <span className="flex items-center">
              <i className="fas fa-undo-alt mr-2 text-blue-400"></i>
              30-Day Returns
            </span>
            <span className="flex items-center">
              <i className="fas fa-lock mr-2 text-blue-400"></i>
              100% Secure
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;