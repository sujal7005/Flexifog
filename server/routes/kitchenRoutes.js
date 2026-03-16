import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import KitchenAppliance from '../models/KitchenAppliance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'kitchen-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed (jpeg, jpg, png, webp)'));
    }
  }
});

// @desc    Get all kitchen appliances with filtering
// @route   GET /api/kitchen
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = 'popularity',
      type,
      brand,
      minPrice = 0,
      maxPrice = 1000000,
      search,
      energyRating,
      capacity,
      inStock,
      isFeatured
    } = req.query;

    let query = { isActive: true };

    // Type filter
    if (type && type !== 'all') {
      query.type = type;
    }

    // Brand filter
    if (brand && brand !== 'all') {
      query.brand = brand;
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Price filter
    query.finalPrice = { 
      $gte: parseInt(minPrice), 
      $lte: parseInt(maxPrice) 
    };

    // Energy rating filter
    if (energyRating && energyRating !== 'all') {
      query['specs.energyRating'] = energyRating;
    }

    // Capacity filter
    if (capacity && capacity !== 'all') {
      // Handle capacity ranges
      const capacityNum = parseInt(capacity);
      if (!isNaN(capacityNum)) {
        query['specs.capacity'] = { $regex: new RegExp(capacityNum, 'i') };
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

    // Get total count
    const total = await KitchenAppliance.countDocuments(query);

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

    const appliances = await KitchenAppliance.find(query)
      .sort(sortOption)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .select('-reviews -__v')
      .lean();

    // Get unique brands and types for filters
    const allBrands = await KitchenAppliance.distinct('brand', { isActive: true });
    const allTypes = await KitchenAppliance.distinct('type', { isActive: true });

    res.json({
      success: true,
      products: appliances,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      filters: {
        brands: allBrands,
        types: allTypes
      }
    });

  } catch (error) {
    console.error('Error in getKitchenAppliances:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch kitchen appliances',
      message: error.message 
    });
  }
});

// @desc    Get single kitchen appliance by ID
// @route   GET /api/kitchen/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const appliance = await KitchenAppliance.findById(req.params.id)
      .select('-__v')
      .lean();

    if (!appliance) {
      return res.status(404).json({ 
        success: false, 
        error: 'Kitchen appliance not found' 
      });
    }

    // Increment popularity
    await KitchenAppliance.findByIdAndUpdate(req.params.id, { $inc: { popularity: 1 } });

    // Get related products
    const related = await KitchenAppliance.find({
      _id: { $ne: req.params.id },
      type: appliance.type,
      isActive: true,
      finalPrice: {
        $gte: appliance.finalPrice * 0.7,
        $lte: appliance.finalPrice * 1.3
      }
    })
    .limit(4)
    .select('name brand finalPrice originalPrice images ratings average type')
    .lean();

    res.json({
      success: true,
      product: appliance,
      related
    });

  } catch (error) {
    console.error('Error in getKitchenApplianceById:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch kitchen appliance',
      message: error.message 
    });
  }
});

// ADMIN ROUTES

// @desc    Create new kitchen appliance
// @route   POST /api/kitchen/admin
// @access  Private/Admin
router.post('/admin', upload.array('images', 5), async (req, res) => {
  try {
    const applianceData = JSON.parse(JSON.stringify(req.body));

    // Handle images
    if (req.files && req.files.length > 0) {
      applianceData.images = req.files.map(file => file.filename);
      applianceData.image = applianceData.images[0];
    }

    // Generate SKU
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await KitchenAppliance.countDocuments();
    applianceData.sku = `KIT-${year}${month}-${(count + 1).toString().padStart(4, '0')}`;

    // Parse specs if it's a string
    if (typeof applianceData.specs === 'string') {
      try {
        applianceData.specs = JSON.parse(applianceData.specs);
      } catch (e) {
        applianceData.specs = {};
      }
    }

    const appliance = new KitchenAppliance(applianceData);
    await appliance.save();

    res.status(201).json({
      success: true,
      message: 'Kitchen appliance created successfully',
      product: appliance
    });

  } catch (error) {
    console.error('Error in createKitchenAppliance:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed',
        details: errors
      });
    }
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create kitchen appliance',
      message: error.message 
    });
  }
});

// @desc    Update kitchen appliance
// @route   PUT /api/kitchen/admin/:id
// @access  Private/Admin
router.put('/admin/:id', upload.array('images', 5), async (req, res) => {
  try {
    const appliance = await KitchenAppliance.findById(req.params.id);
    if (!appliance) {
      return res.status(404).json({ 
        success: false, 
        error: 'Kitchen appliance not found' 
      });
    }

    const updateData = JSON.parse(JSON.stringify(req.body));

    // Handle images
    if (req.files && req.files.length > 0) {
      // Delete old images
      if (appliance.images && appliance.images.length > 0) {
        appliance.images.forEach(img => {
          const imagePath = path.join(__dirname, '../uploads', img);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });
      }
      updateData.images = req.files.map(file => file.filename);
      updateData.image = updateData.images[0];
    }

    // Parse specs if it's a string
    if (typeof updateData.specs === 'string') {
      try {
        updateData.specs = JSON.parse(updateData.specs);
      } catch (e) {
        updateData.specs = {};
      }
    }

    const updated = await KitchenAppliance.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Kitchen appliance updated successfully',
      product: updated
    });

  } catch (error) {
    console.error('Error in updateKitchenAppliance:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed',
        details: errors
      });
    }
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update kitchen appliance',
      message: error.message 
    });
  }
});

// @desc    Delete kitchen appliance
// @route   DELETE /api/kitchen/admin/:id
// @access  Private/Admin
router.delete('/admin/:id', async (req, res) => {
  try {
    const appliance = await KitchenAppliance.findById(req.params.id);
    if (!appliance) {
      return res.status(404).json({ 
        success: false, 
        error: 'Kitchen appliance not found' 
      });
    }

    // Delete images
    if (appliance.images && appliance.images.length > 0) {
      appliance.images.forEach(img => {
        const imagePath = path.join(__dirname, '../uploads', img);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await appliance.deleteOne();

    res.json({
      success: true,
      message: 'Kitchen appliance deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteKitchenAppliance:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete kitchen appliance',
      message: error.message 
    });
  }
});

// @desc    Toggle featured status
// @route   PATCH /api/kitchen/admin/:id/featured
// @access  Private/Admin
router.patch('/admin/:id/featured', async (req, res) => {
  try {
    const appliance = await KitchenAppliance.findById(req.params.id);
    if (!appliance) {
      return res.status(404).json({ 
        success: false, 
        error: 'Kitchen appliance not found' 
      });
    }

    appliance.isFeatured = !appliance.isFeatured;
    await appliance.save();

    res.json({
      success: true,
      message: `Appliance ${appliance.isFeatured ? 'added to' : 'removed from'} featured`,
      isFeatured: appliance.isFeatured
    });

  } catch (error) {
    console.error('Error in toggleFeatured:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to toggle featured status',
      message: error.message 
    });
  }
});

// @desc    Update stock
// @route   PATCH /api/kitchen/admin/:id/stock
// @access  Private/Admin
router.patch('/admin/:id/stock', async (req, res) => {
  try {
    const { stock } = req.body;
    
    if (stock === undefined || stock < 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid stock value is required' 
      });
    }

    const appliance = await KitchenAppliance.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    ).select('name stock sku');

    if (!appliance) {
      return res.status(404).json({ 
        success: false, 
        error: 'Kitchen appliance not found' 
      });
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      product: appliance
    });

  } catch (error) {
    console.error('Error in updateStock:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update stock',
      message: error.message 
    });
  }
});

// @desc    Add review
// @route   POST /api/kitchen/:id/reviews
// @access  Private
router.post('/:id/reviews', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        error: 'Rating must be between 1 and 5' 
      });
    }

    const appliance = await KitchenAppliance.findById(req.params.id);
    if (!appliance) {
      return res.status(404).json({ 
        success: false, 
        error: 'Kitchen appliance not found' 
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = appliance.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ 
        success: false, 
        error: 'Product already reviewed by this user' 
      });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
      createdAt: Date.now()
    };

    appliance.reviews.push(review);
    appliance.ratings.count = appliance.reviews.length;
    appliance.ratings.average = 
      appliance.reviews.reduce((acc, item) => item.rating + acc, 0) / appliance.reviews.length;
    
    appliance.updatePopularity();
    await appliance.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      ratings: appliance.ratings
    });

  } catch (error) {
    console.error('Error in addReview:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add review',
      message: error.message 
    });
  }
});

export default router;