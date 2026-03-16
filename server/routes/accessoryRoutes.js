import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getAccessories,
  getAccessoryById,
  getAccessoriesByCategory,
  getFeaturedAccessories,
  searchAccessories,
  addReview,
  checkStock,
  createAccessory,
  updateAccessory,
  deleteAccessory,
  bulkDeleteAccessories,
  updateStock,
  toggleFeatured
} from '../controllers/accessoryController.js';
// import authMiddleware from '../middleware/authMiddleware.js';
// import adminMiddleware from '../middleware/adminMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `accessory-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const router = express.Router();

// ============= PUBLIC ROUTES =============

// Get all accessories with filters
router.get('/', getAccessories);

// Search accessories
router.get('/search', searchAccessories);

// Get featured accessories
router.get('/featured', getFeaturedAccessories);

// Get accessories by category
router.get('/category/:category', getAccessoriesByCategory);

// Check stock availability
router.post('/check-stock', checkStock);

// Get single accessory
router.get('/:id', getAccessoryById);

// ============= USER PROTECTED ROUTES =============

// Add review (requires authentication)
router.post('/:id/reviews', addReview);

// ============= ADMIN ROUTES =============

// Create new accessory
router.post(
  '/admin',
  upload.array('images', 5),
  createAccessory
);

// Update accessory
router.put(
  '/admin/:id',
  upload.array('images', 5),
  updateAccessory
);

// Update stock only
router.patch(
  '/admin/:id/stock',
  updateStock
);

// Toggle featured status
router.patch(
  '/admin/:id/featured',
  toggleFeatured
);

// Delete accessory
router.delete(
  '/admin/:id',
  deleteAccessory
);

// Bulk delete accessories
router.post(
  '/admin/bulk-delete',
  bulkDeleteAccessories
);

export default router;