import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getDisplays,
  getDisplayById,
  getDisplaysByCategory,
  getFeaturedDisplays,
  searchDisplays,
  addReview,
  checkStock,
  compareDisplays,
  createDisplay,
  updateDisplay,
  deleteDisplay,
  bulkDeleteDisplays,
  updateStock,
  toggleFeatured
} from '../controllers/displayController.js';
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
    cb(null, `display-${uniqueSuffix}${ext}`);
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

// Get all displays with filters
router.get('/', getDisplays);

// Search displays
router.get('/search', searchDisplays);

// Get featured displays
router.get('/featured', getFeaturedDisplays);

// Get displays by category
router.get('/category/:category', getDisplaysByCategory);

// Compare displays
router.post('/compare', compareDisplays);

// Check stock availability
router.post('/check-stock', checkStock);

// Get single display
router.get('/:id', getDisplayById);

// ============= USER PROTECTED ROUTES =============

// Add review (requires authentication)
router.post('/:id/reviews', addReview);

// ============= ADMIN ROUTES =============

// Create new display
router.post(
  '/admin',
  upload.array('images', 5),
  createDisplay
);

// Update display
router.put(
  '/admin/:id',
  upload.array('images', 5),
  updateDisplay
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

// Delete display
router.delete(
  '/admin/:id',
  deleteDisplay
);

// Bulk delete displays
router.post(
  '/admin/bulk-delete',
  bulkDeleteDisplays
);

export default router;