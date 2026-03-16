// server/routes/pcComponentRoutes.js
import { Router } from 'express';
import multer from "multer";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  getPCComponents,
  getPCComponentById,
  createPCComponent,
  updatePCComponent,
  deletePCComponent,
  addPCComponentReview,
  getPCComponentsByBrand,
  getPCComponentsByType,
  getPCComponentsBySocket
} from '../controllers/pcComponentController.js';

const router = Router();

// Get the directory name properly for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueName = `${Date.now()}-${cleanName}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only ${allowedTypes.join(', ')} are allowed!`), false);
  }
};

// Create separate multer instances for different upload types
const uploadProduct = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
}).fields([
  { name: 'image', maxCount: 15 },
  { name: 'additionalImages', maxCount: 20 }
]);

const uploadReview = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for reviews
  fileFilter,
}).single('reviewImage');

// Middleware to handle product upload errors
const uploadProductMiddleware = (req, res, next) => {
  uploadProduct(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      console.error("Unknown upload error:", err);
      return res.status(500).json({ error: err.message });
    }
    next();
  });
};

// Middleware to handle review upload errors
const uploadReviewMiddleware = (req, res, next) => {
  uploadReview(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      console.error("Unknown upload error:", err);
      return res.status(500).json({ error: err.message });
    }
    next();
  });
};

// Public routes
router.get('/', getPCComponents);
router.get('/:id', getPCComponentById);
router.get('/brand/:brand', getPCComponentsByBrand);
router.get('/type/:type', getPCComponentsByType);
router.get('/socket/:socket', getPCComponentsBySocket);

// Protected routes (admin only) - you'll need to add auth middleware
router.post('/', uploadProductMiddleware, createPCComponent);
router.put('/:id', uploadProductMiddleware, updatePCComponent);
router.delete('/:id', deletePCComponent);
router.post('/:id/reviews', uploadReviewMiddleware, addPCComponentReview);

export default router;