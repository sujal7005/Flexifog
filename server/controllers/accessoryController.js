import Accessory from '../models/Accessory.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all accessories with filtering, sorting, and pagination
// @route   GET /api/accessories
// @access  Public
export const getAccessories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = 'popularity',
      category,
      subcategory,
      search,
      minPrice = 0,
      maxPrice = 100000,
      brands,
      connectivity,
      features,
      inStock,
      isFeatured
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Subcategory filter
    if (subcategory && subcategory !== 'all') {
      query.subcategory = subcategory;
    }

    // Search filter (text search)
    if (search) {
      query.$text = { $search: search };
    }

    // Price filter
    query.finalPrice = { 
      $gte: parseInt(minPrice), 
      $lte: parseInt(maxPrice) 
    };

    // Brand filter
    if (brands) {
      const brandArray = brands.split(',').filter(b => b);
      if (brandArray.length > 0) {
        query.brand = { $in: brandArray };
      }
    }

    // Connectivity filter
    if (connectivity) {
      const connArray = connectivity.split(',').filter(c => c);
      if (connArray.length > 0) {
        query['specs.connectivity'] = { $in: connArray };
      }
    }

    // Features filter
    if (features) {
      const featureArray = features.split(',').filter(f => f);
      if (featureArray.length > 0) {
        query.features = { $in: featureArray };
      }
    }

    // In stock filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Featured filter
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    // Get total count for pagination
    const total = await Accessory.countDocuments(query);

    // Build sort options
    let sortOption = {};
    switch (sort) {
      case 'price-asc':
        sortOption = { finalPrice: 1 };
        break;
      case 'price-desc':
        sortOption = { finalPrice: -1 };
        break;
      case 'rating':
        sortOption = { 'ratings.average': -1, 'ratings.count': -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'name-asc':
        sortOption = { name: 1 };
        break;
      case 'name-desc':
        sortOption = { name: -1 };
        break;
      case 'popularity':
      default:
        sortOption = { popularity: -1, createdAt: -1 };
    }

    // Execute query with pagination
    const accessories = await Accessory.find(query)
      .sort(sortOption)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .select('-reviews -__v')
      .lean();

    // Get unique brands for filter
    const allBrands = await Accessory.distinct('brand', { isActive: true });

    // Get unique features for filter
    const allFeatures = await Accessory.distinct('features', { isActive: true });

    res.json({
      success: true,
      accessories,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      filters: {
        brands: allBrands,
        features: allFeatures.filter(f => f)
      }
    });

  } catch (error) {
    console.error('Error in getAccessories:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch accessories',
      message: error.message 
    });
  }
};

// @desc    Get single accessory by ID
// @route   GET /api/accessories/:id
// @access  Public
export const getAccessoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const accessory = await Accessory.findById(id)
      .select('-__v')
      .lean();

    if (!accessory) {
      return res.status(404).json({ 
        success: false, 
        error: 'Accessory not found' 
      });
    }

    // Increment popularity on view
    await Accessory.findByIdAndUpdate(id, { $inc: { popularity: 1 } });

    // Get related accessories (same category, similar price range)
    const relatedAccessories = await Accessory.find({
      _id: { $ne: id },
      category: accessory.category,
      isActive: true,
      finalPrice: {
        $gte: accessory.finalPrice * 0.7,
        $lte: accessory.finalPrice * 1.3
      }
    })
    .limit(4)
    .select('name brand finalPrice originalPrice images ratings average')
    .lean();

    res.json({
      success: true,
      accessory,
      relatedAccessories
    });

  } catch (error) {
    console.error('Error in getAccessoryById:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch accessory',
      message: error.message 
    });
  }
};

// @desc    Get accessories by category
// @route   GET /api/accessories/category/:category
// @access  Public
export const getAccessoriesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const accessories = await Accessory.find({ 
      category,
      isActive: true 
    })
    .limit(parseInt(limit))
    .select('name brand finalPrice originalPrice images ratings average')
    .lean();

    res.json({
      success: true,
      category,
      accessories
    });

  } catch (error) {
    console.error('Error in getAccessoriesByCategory:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch accessories by category',
      message: error.message 
    });
  }
};

// @desc    Get featured accessories
// @route   GET /api/accessories/featured
// @access  Public
export const getFeaturedAccessories = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const accessories = await Accessory.find({ 
      isFeatured: true,
      isActive: true,
      stock: { $gt: 0 }
    })
    .limit(parseInt(limit))
    .select('name brand finalPrice originalPrice images ratings average')
    .lean();

    res.json({
      success: true,
      accessories
    });

  } catch (error) {
    console.error('Error in getFeaturedAccessories:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch featured accessories',
      message: error.message 
    });
  }
};

// @desc    Search accessories
// @route   GET /api/accessories/search
// @access  Public
export const searchAccessories = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ 
        success: false, 
        error: 'Search query is required' 
      });
    }

    const accessories = await Accessory.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit))
    .select('name brand finalPrice images')
    .lean();

    res.json({
      success: true,
      accessories,
      count: accessories.length
    });

  } catch (error) {
    console.error('Error in searchAccessories:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search accessories',
      message: error.message 
    });
  }
};

// @desc    Add review to accessory
// @route   POST /api/accessories/:id/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        error: 'Rating must be between 1 and 5' 
      });
    }

    const accessory = await Accessory.findById(id);

    if (!accessory) {
      return res.status(404).json({ 
        success: false, 
        error: 'Accessory not found' 
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = accessory.reviews.find(
      review => review.user.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ 
        success: false, 
        error: 'Product already reviewed by this user' 
      });
    }

    // Add review
    const review = {
      user: userId,
      rating: Number(rating),
      comment,
      createdAt: Date.now()
    };

    accessory.reviews.push(review);

    // Update ratings
    accessory.ratings.count = accessory.reviews.length;
    accessory.ratings.average = 
      accessory.reviews.reduce((acc, item) => item.rating + acc, 0) / accessory.reviews.length;

    // Update popularity
    accessory.popularity = (accessory.ratings.average * accessory.ratings.count) / (accessory.ratings.count + 1);

    await accessory.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      ratings: accessory.ratings
    });

  } catch (error) {
    console.error('Error in addReview:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add review',
      message: error.message 
    });
  }
};

// @desc    Check stock availability
// @route   POST /api/accessories/check-stock
// @access  Public
export const checkStock = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Items array is required' 
      });
    }

    const stockStatus = await Promise.all(
      items.map(async (item) => {
        const accessory = await Accessory.findById(item.id).select('name stock');
        return {
          id: item.id,
          name: accessory?.name,
          requested: item.quantity,
          available: accessory?.stock || 0,
          inStock: accessory?.stock >= item.quantity,
          message: accessory?.stock >= item.quantity 
            ? 'In stock' 
            : `Only ${accessory?.stock || 0} available`
        };
      })
    );

    res.json({
      success: true,
      stockStatus
    });

  } catch (error) {
    console.error('Error in checkStock:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check stock',
      message: error.message 
    });
  }
};

// ADMIN CONTROLLERS

// @desc    Create new accessory
// @route   POST /api/accessories/admin
// @access  Private/Admin
export const createAccessory = async (req, res) => {
  try {
    const accessoryData = req.body;

    // Handle images
    if (req.files && req.files.length > 0) {
      accessoryData.images = req.files.map(file => file.filename);
      accessoryData.image = accessoryData.images[0];
    }

    // Generate SKU
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await Accessory.countDocuments();
    accessoryData.sku = `ACC-${year}${month}-${(count + 1).toString().padStart(4, '0')}`;

    const accessory = new Accessory(accessoryData);
    await accessory.save();

    res.status(201).json({
      success: true,
      message: 'Accessory created successfully',
      accessory
    });

  } catch (error) {
    console.error('Error in createAccessory:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create accessory',
      message: error.message 
    });
  }
};

// @desc    Update accessory
// @route   PUT /api/accessories/admin/:id
// @access  Private/Admin
export const updateAccessory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const accessory = await Accessory.findById(id);

    if (!accessory) {
      return res.status(404).json({ 
        success: false, 
        error: 'Accessory not found' 
      });
    }

    // Handle images
    if (req.files && req.files.length > 0) {
      // Delete old images
      if (accessory.images && accessory.images.length > 0) {
        accessory.images.forEach(img => {
          const imagePath = path.join(__dirname, '../uploads', img);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });
      }
      updateData.images = req.files.map(file => file.filename);
      updateData.image = updateData.images[0];
    }

    const updatedAccessory = await Accessory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Accessory updated successfully',
      accessory: updatedAccessory
    });

  } catch (error) {
    console.error('Error in updateAccessory:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update accessory',
      message: error.message 
    });
  }
};

// @desc    Delete accessory
// @route   DELETE /api/accessories/admin/:id
// @access  Private/Admin
export const deleteAccessory = async (req, res) => {
  try {
    const { id } = req.params;

    const accessory = await Accessory.findById(id);

    if (!accessory) {
      return res.status(404).json({ 
        success: false, 
        error: 'Accessory not found' 
      });
    }

    // Delete associated images
    if (accessory.images && accessory.images.length > 0) {
      accessory.images.forEach(img => {
        const imagePath = path.join(__dirname, '../uploads', img);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await accessory.deleteOne();

    res.json({
      success: true,
      message: 'Accessory deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteAccessory:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete accessory',
      message: error.message 
    });
  }
};

// @desc    Bulk delete accessories
// @route   POST /api/accessories/admin/bulk-delete
// @access  Private/Admin
export const bulkDeleteAccessories = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No accessory IDs provided' 
      });
    }

    // Delete images for all accessories
    const accessories = await Accessory.find({ _id: { $in: ids } });
    
    accessories.forEach(accessory => {
      if (accessory.images && accessory.images.length > 0) {
        accessory.images.forEach(img => {
          const imagePath = path.join(__dirname, '../uploads', img);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });
      }
    });

    await Accessory.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${ids.length} accessories deleted successfully`
    });

  } catch (error) {
    console.error('Error in bulkDeleteAccessories:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete accessories',
      message: error.message 
    });
  }
};

// @desc    Update stock
// @route   PATCH /api/accessories/admin/:id/stock
// @access  Private/Admin
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid stock value is required' 
      });
    }

    const accessory = await Accessory.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    ).select('name stock sku');

    if (!accessory) {
      return res.status(404).json({ 
        success: false, 
        error: 'Accessory not found' 
      });
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      accessory
    });

  } catch (error) {
    console.error('Error in updateStock:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update stock',
      message: error.message 
    });
  }
};

// @desc    Toggle featured status
// @route   PATCH /api/accessories/admin/:id/featured
// @access  Private/Admin
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const accessory = await Accessory.findById(id);

    if (!accessory) {
      return res.status(404).json({ 
        success: false, 
        error: 'Accessory not found' 
      });
    }

    accessory.isFeatured = !accessory.isFeatured;
    await accessory.save();

    res.json({
      success: true,
      message: `Accessory ${accessory.isFeatured ? 'added to' : 'removed from'} featured`,
      isFeatured: accessory.isFeatured
    });

  } catch (error) {
    console.error('Error in toggleFeatured:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to toggle featured status',
      message: error.message 
    });
  }
};