import Display from '../models/Display.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all displays with filtering, sorting, and pagination
// @route   GET /api/displays
// @access  Public
export const getDisplays = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = 'popularity',
      category,
      search,
      minPrice = 0,
      maxPrice = 200000,
      brand,
      inStock,
      isFeatured
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Price filter - use price field instead of finalPrice
    query.price = { 
      $gte: parseInt(minPrice), 
      $lte: parseInt(maxPrice) 
    };

    // Brand filter
    if (brand && brand !== 'all') {
      query.brand = brand;
    }

    // In stock filter
    if (inStock === 'true') {
      query.inStock = true;
      query.stock = { $gt: 0 };
    }

    // Featured filter
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    // Get total count for pagination
    const total = await Display.countDocuments(query);

    // Build sort options
    let sortOption = {};
    switch (sort) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
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
    const displays = await Display.find(query)
      .sort(sortOption)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .select('-reviews -__v')
      .lean();

    // Get unique brands for filter
    const allBrands = await Display.distinct('brand', { isActive: true });

    res.json({
      success: true,
      displays,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      filters: {
        brands: allBrands
      }
    });

  } catch (error) {
    console.error('Error in getDisplays:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch displays',
      message: error.message 
    });
  }
};

// @desc    Get single display by ID
// @route   GET /api/displays/:id
// @access  Public
export const getDisplayById = async (req, res) => {
  try {
    const { id } = req.params;

    const display = await Display.findById(id)
      .select('-__v')
      .lean();

    if (!display) {
      return res.status(404).json({ 
        success: false, 
        error: 'Display not found' 
      });
    }

    // Increment popularity on view
    await Display.findByIdAndUpdate(id, { $inc: { popularity: 1 } });

    // Get related displays (same category, similar price range)
    const relatedDisplays = await Display.find({
      _id: { $ne: id },
      category: display.category,
      isActive: true,
      finalPrice: {
        $gte: display.finalPrice * 0.7,
        $lte: display.finalPrice * 1.3
      }
    })
    .limit(4)
    .select('name brand finalPrice originalPrice images ratings average specs.size specs.resolution specs.refreshRate')
    .lean();

    res.json({
      success: true,
      display,
      relatedDisplays
    });

  } catch (error) {
    console.error('Error in getDisplayById:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch display',
      message: error.message 
    });
  }
};

// @desc    Get displays by category
// @route   GET /api/displays/category/:category
// @access  Public
export const getDisplaysByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const displays = await Display.find({ 
      category,
      isActive: true 
    })
    .limit(parseInt(limit))
    .select('name brand finalPrice originalPrice images ratings average specs.size specs.resolution specs.refreshRate')
    .lean();

    res.json({
      success: true,
      category,
      displays
    });

  } catch (error) {
    console.error('Error in getDisplaysByCategory:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch displays by category',
      message: error.message 
    });
  }
};

// @desc    Get featured displays
// @route   GET /api/displays/featured
// @access  Public
export const getFeaturedDisplays = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const displays = await Display.find({ 
      isFeatured: true,
      isActive: true,
      stock: { $gt: 0 }
    })
    .limit(parseInt(limit))
    .select('name brand finalPrice originalPrice images ratings average specs.size specs.resolution specs.refreshRate')
    .lean();

    res.json({
      success: true,
      displays
    });

  } catch (error) {
    console.error('Error in getFeaturedDisplays:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch featured displays',
      message: error.message 
    });
  }
};

// @desc    Search displays
// @route   GET /api/displays/search
// @access  Public
export const searchDisplays = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ 
        success: false, 
        error: 'Search query is required' 
      });
    }

    const displays = await Display.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit))
    .select('name brand finalPrice images specs.size specs.resolution')
    .lean();

    res.json({
      success: true,
      displays,
      count: displays.length
    });

  } catch (error) {
    console.error('Error in searchDisplays:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search displays',
      message: error.message 
    });
  }
};

// @desc    Add review to display
// @route   POST /api/displays/:id/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, pros, cons } = req.body;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        error: 'Rating must be between 1 and 5' 
      });
    }

    const display = await Display.findById(id);

    if (!display) {
      return res.status(404).json({ 
        success: false, 
        error: 'Display not found' 
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = display.reviews.find(
      review => review.user.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ 
        success: false, 
        error: 'Display already reviewed by this user' 
      });
    }

    // Add review
    const review = {
      user: userId,
      rating: Number(rating),
      title,
      comment,
      pros: pros || [],
      cons: cons || [],
      createdAt: Date.now()
    };

    display.reviews.push(review);

    // Update ratings
    display.ratings.count = display.reviews.length;
    display.ratings.average = 
      display.reviews.reduce((acc, item) => item.rating + acc, 0) / display.reviews.length;

    // Update popularity
    display.popularity = (display.ratings.average * display.ratings.count) / (display.ratings.count + 1);

    await display.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      ratings: display.ratings
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
// @route   POST /api/displays/check-stock
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
        const display = await Display.findById(item.id).select('name stock');
        return {
          id: item.id,
          name: display?.name,
          requested: item.quantity,
          available: display?.stock || 0,
          inStock: display?.stock >= item.quantity,
          message: display?.stock >= item.quantity 
            ? 'In stock' 
            : `Only ${display?.stock || 0} available`
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

// @desc    Compare multiple displays
// @route   POST /api/displays/compare
// @access  Public
export const compareDisplays = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length < 2 || ids.length > 3) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide 2-3 display IDs to compare' 
      });
    }

    const displays = await Display.find({
      _id: { $in: ids },
      isActive: true
    }).lean();

    if (displays.length !== ids.length) {
      return res.status(404).json({ 
        success: false, 
        error: 'One or more displays not found' 
      });
    }

    // Format comparison data
    const comparison = {
      basic: {
        name: displays.map(d => d.name),
        brand: displays.map(d => d.brand),
        price: displays.map(d => d.finalPrice || d.price),
        category: displays.map(d => d.category)
      },
      specs: {
        size: displays.map(d => d.specs?.size || 'N/A'),
        resolution: displays.map(d => d.specs?.resolution || 'N/A'),
        panelType: displays.map(d => d.specs?.panelType || d.specs?.panel || 'N/A'),
        refreshRate: displays.map(d => d.specs?.refreshRate || 'N/A'),
        responseTime: displays.map(d => d.specs?.responseTime || 'N/A'),
        brightness: displays.map(d => d.specs?.brightness || 'N/A'),
        contrastRatio: displays.map(d => d.specs?.contrastRatio || 'N/A'),
        aspectRatio: displays.map(d => d.specs?.aspectRatio || 'N/A'),
        curved: displays.map(d => d.specs?.curved ? 'Yes' : 'No'),
        hdr: displays.map(d => d.specs?.hdr || 'No')
      },
      features: {
        gSync: displays.map(d => d.specs?.gSync ? 'Yes' : 'No'),
        freeSync: displays.map(d => d.specs?.freeSync ? 'Yes' : 'No'),
        builtInSpeakers: displays.map(d => d.specs?.builtInSpeakers ? 'Yes' : 'No'),
        usbTypeC: displays.map(d => d.specs?.usbTypeC ? 'Yes' : 'No'),
        vesaMount: displays.map(d => d.specs?.vesaMount || 'N/A')
      },
      ratings: displays.map(d => d.ratings?.average || 0),
      stock: displays.map(d => d.stock > 0 ? 'In Stock' : 'Out of Stock')
    };

    res.json({
      success: true,
      comparison
    });

  } catch (error) {
    console.error('Error in compareDisplays:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to compare displays',
      message: error.message 
    });
  }
};

// ADMIN CONTROLLERS

// @desc    Create new display
// @route   POST /api/displays/admin
// @access  Private/Admin
export const createDisplay = async (req, res) => {
  try {
    const displayData = req.body;
    console.log('Create display data received:', displayData);

    // Parse ALL JSON fields if they're strings
    const jsonFields = [
      'specs', 
      'features', 
      'ports',
      'keyFeatures', 
      'specifications', 
      'otherTechnicalDetails', 
      'notes', 
      'videos',
      'whatsInTheBox'
    ];

    jsonFields.forEach(field => {
      if (displayData[field] && typeof displayData[field] === 'string') {
        try {
          displayData[field] = JSON.parse(displayData[field]);
        } catch (e) {
          console.error(`Error parsing ${field}:`, e);
          // If parsing fails, set to empty array or object based on field
          if (field === 'specs') {
            displayData[field] = {};
          } else {
            displayData[field] = [];
          }
        }
      }
    });

    // Handle images
    if (req.files && req.files.length > 0) {
      displayData.images = req.files.map(file => file.filename);
      displayData.image = displayData.images[0];
    }

    // Convert string booleans to actual booleans
    if (displayData.featured !== undefined) {
      displayData.featured = displayData.featured === 'true';
    }
    
    if (displayData.inStock !== undefined) {
      displayData.inStock = displayData.inStock === 'yes';
    }

    // Convert string numbers to actual numbers
    const numberFields = ['price', 'originalPrice', 'quantity', 'discount', 'popularity'];
    numberFields.forEach(field => {
      if (displayData[field] !== undefined && displayData[field] !== '') {
        displayData[field] = Number(displayData[field]);
      }
    });

    // Generate SKU
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await Display.countDocuments();
    displayData.sku = `DISP-${year}${month}-${(count + 1).toString().padStart(4, '0')}`;

    const display = new Display(displayData);
    await display.save();

    res.status(201).json({
      success: true,
      message: 'Display created successfully',
      display
    });

  } catch (error) {
    console.error('Error in createDisplay:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create display',
      message: error.message 
    });
  }
};

// @desc    Update display
// @route   PUT /api/displays/admin/:id
// @access  Private/Admin
export const updateDisplay = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log('Update data received:', updateData);

    // Parse ALL JSON fields if they're strings
    const jsonFields = [
      'specs', 
      'features', 
      'ports',
      'keyFeatures', 
      'specifications', 
      'otherTechnicalDetails', 
      'notes', 
      'videos',
      'whatsInTheBox'
    ];

    jsonFields.forEach(field => {
      if (updateData[field] && typeof updateData[field] === 'string') {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (e) {
          console.error(`Error parsing ${field}:`, e);
          // If parsing fails, set to empty array or object based on field
          if (field === 'specs') {
            updateData[field] = {};
          } else {
            updateData[field] = [];
          }
        }
      }
    });

    const display = await Display.findById(id);

    if (!display) {
      return res.status(404).json({ 
        success: false, 
        error: 'Display not found' 
      });
    }

    // Handle existing images
    let existingImages = [];
    if (updateData.existingImages) {
      try {
        existingImages = JSON.parse(updateData.existingImages);
      } catch (e) {
        existingImages = [];
      }
    }

    // Handle new images
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => file.filename);
    }

    // Combine existing and new images
    updateData.images = [...existingImages, ...newImages];
    updateData.image = updateData.images[0] || display.image;

    // Convert string booleans to actual booleans
    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === 'true';
    }
    
    if (updateData.inStock !== undefined) {
      updateData.inStock = updateData.inStock === 'yes';
    }

    // Convert string numbers to actual numbers
    const numberFields = ['price', 'originalPrice', 'quantity', 'discount', 'popularity'];
    numberFields.forEach(field => {
      if (updateData[field] !== undefined && updateData[field] !== '') {
        updateData[field] = Number(updateData[field]);
      }
    });

    const updatedDisplay = await Display.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Display updated successfully',
      display: updatedDisplay
    });

  } catch (error) {
    console.error('Error in updateDisplay:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update display',
      message: error.message 
    });
  }
};

// @desc    Delete display
// @route   DELETE /api/displays/admin/:id
// @access  Private/Admin
export const deleteDisplay = async (req, res) => {
  try {
    const { id } = req.params;

    const display = await Display.findById(id);

    if (!display) {
      return res.status(404).json({ 
        success: false, 
        error: 'Display not found' 
      });
    }

    // Delete associated images
    if (display.images && display.images.length > 0) {
      display.images.forEach(img => {
        const imagePath = path.join(__dirname, '../uploads', img);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await display.deleteOne();

    res.json({
      success: true,
      message: 'Display deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteDisplay:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete display',
      message: error.message 
    });
  }
};

// @desc    Bulk delete displays
// @route   POST /api/displays/admin/bulk-delete
// @access  Private/Admin
export const bulkDeleteDisplays = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No display IDs provided' 
      });
    }

    // Delete images for all displays
    const displays = await Display.find({ _id: { $in: ids } });
    
    displays.forEach(display => {
      if (display.images && display.images.length > 0) {
        display.images.forEach(img => {
          const imagePath = path.join(__dirname, '../uploads', img);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });
      }
    });

    await Display.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${ids.length} displays deleted successfully`
    });

  } catch (error) {
    console.error('Error in bulkDeleteDisplays:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete displays',
      message: error.message 
    });
  }
};

// @desc    Update stock
// @route   PATCH /api/displays/admin/:id/stock
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

    const display = await Display.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    ).select('name stock sku');

    if (!display) {
      return res.status(404).json({ 
        success: false, 
        error: 'Display not found' 
      });
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      display
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
// @route   PATCH /api/displays/admin/:id/featured
// @access  Private/Admin
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const display = await Display.findById(id);

    if (!display) {
      return res.status(404).json({ 
        success: false, 
        error: 'Display not found' 
      });
    }

    display.isFeatured = !display.isFeatured;
    await display.save();

    res.json({
      success: true,
      message: `Display ${display.isFeatured ? 'added to' : 'removed from'} featured`,
      isFeatured: display.isFeatured
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