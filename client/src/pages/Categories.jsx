// src/pages/Categories.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'react-icons/fa';

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalSubcategories: 0
  });

  const BASE_URL = `http://${window.location.hostname}:4000`;

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/categories`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        
        if (data.success) {
          // Convert array to object for easier access
          const categoriesObj = {};
          data.categories.forEach(cat => {
            categoriesObj[cat.id] = cat;
          });
          
          setCategories(categoriesObj);
          setTotals(data.totals);
          
          // Set featured categories
          const featured = data.categories.filter(cat => cat.featured);
          setFeaturedCategories(featured.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Helper function to get icon component
  const getIcon = (iconName, className = "text-3xl") => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  // Filter categories based on search
  const filteredCategories = Object.values(categories).filter(category => {
    if (selectedCategory !== 'all' && category.id !== selectedCategory) return false;
    if (searchTerm) {
      return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
             category.subcategories.some(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return true;
  });

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'count') return b.productCount - a.productCount;
    return 0;
  });

  if (loading) {
    return (
      <div className="bg-gray-50 pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">😕</div>
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="border-b-2 border-gray-200 pb-8 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            All Categories
          </h1>
          <p className="text-lg text-gray-600">
            Browse through our extensive collection of electronic products including mobiles, laptops, TVs, home appliances, and more
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-900"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-900"
            >
              <option value="all">All Categories</option>
              {Object.values(categories).map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-900"
            >
              <option value="name">Sort by Name</option>
              <option value="count">Sort by Product Count</option>
            </select>
          </div>
        </div>

        {/* Featured Categories */}
        {!searchTerm && selectedCategory === 'all' && featuredCategories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Icons.FaStar className="text-yellow-400 mr-2" />
              Featured Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.id}`}
                  className="group relative bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`text-4xl text-${category.color.split('-')[1]}-500`}>
                        {getIcon(category.icon)}
                      </div>
                      <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                        {category.productCount} products
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.slice(0, 3).map((sub, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {sub.name}
                        </span>
                      ))}
                      {category.subcategories.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          +{category.subcategories.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Categories Grid */}
        <div className="space-y-8">
          {sortedCategories.length > 0 ? (
            sortedCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Category Header */}
                <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{getIcon(category.icon)}</div>
                      <div>
                        <h2 className="text-2xl font-bold">{category.name}</h2>
                        <p className="text-white/80 text-sm">{category.description}</p>
                      </div>
                    </div>
                    <Link
                      to={`/categories/${category.id}`}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                    >
                      View All
                    </Link>
                  </div>
                </div>

                {/* Subcategories Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {category.subcategories.map((sub, index) => (
                      <Link
                        key={index}
                        to={sub.path}
                        className="group flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all"
                      >
                        <div className={`text-${category.color.split('-')[1]}-500 group-hover:text-indigo-600 transition-colors`}>
                          {getIcon(sub.icon, "text-xl")}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {sub.name}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">🔍</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600">Try adjusting your search or filter</p>
            </div>
          )}
        </div>

        {/* Category Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {totals.totalProducts}
            </div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {totals.totalCategories}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {totals.totalSubcategories}
            </div>
            <div className="text-sm text-gray-600">Subcategories</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {featuredCategories.length}
            </div>
            <div className="text-sm text-gray-600">Featured</div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-white/80 mb-6">Get notified about new products and exclusive offers</p>
            <form className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;