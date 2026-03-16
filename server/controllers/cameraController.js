// server/controllers/cameraController.js
import Camera from "../models/Camera.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all camera products
export const getCameraProducts = async (req, res) => {
  const { 
    q, 
    type, 
    brand, 
    price, 
    sensor, 
    resolution,
    features,
    inStock,
    page = 1, 
    limit = 20 
  } = req.query;

  try {
    let query = {};

    // Search by name or description
    if (q && q.trim() !== "") {
      const regex = new RegExp(q, "i");
      query.$or = [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
        { brand: { $regex: regex } },
        { "specs.sensorType": { $regex: regex } },
      ];
    }

    // Filter by type
    if (type && type !== "all") {
      query.type = type;
    }

    // Filter by brand
    if (brand && brand !== "all") {
      query.brand = brand;
    }

    // Filter by sensor type
    if (sensor && sensor !== "all") {
      query["specs.sensorType"] = { $regex: new RegExp(sensor, 'i') };
    }

    // Filter by video resolution
    if (resolution && resolution !== "all") {
      query["specs.videoResolution"] = { $in: [resolution] };
    }

    // Filter by features
    if (features && features !== "all") {
      const featureArray = features.split(',');
      featureArray.forEach(feature => {
        switch(feature) {
          case 'wifi':
            query["specs.wifi"] = true;
            break;
          case 'bluetooth':
            query["specs.bluetooth"] = true;
            break;
          case 'touchscreen':
            query["specs.touchscreen"] = true;
            break;
          case 'weatherSealed':
            query["specs.weatherSealed"] = true;
            break;
          case 'imageStabilization':
            query["specs.imageStabilization"] = { $exists: true, $ne: "" };
            break;
          case '4k':
            query["specs.videoResolution"] = { $in: ['4K'] };
            break;
        }
      });
    }

    // Filter by price range
    if (price) {
      const [min, max] = price.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        query.price = { $gte: min, $lte: max };
      } else if (!isNaN(min)) {
        query.price = { $gte: min };
      }
    }

    // Filter by stock
    if (inStock === 'true') {
      query.inStock = true;
    } else if (inStock === 'false') {
      query.inStock = false;
    }

    // Pagination
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 20;
    const skip = (pageNumber - 1) * limitNumber;

    // Get total count for pagination
    const total = await Camera.countDocuments(query);

    // Fetch products with sorting
    const cameraProducts = await Camera.find(query)
      .sort({ popularity: -1, dateAdded: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      success: true,
      products: cameraProducts,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalProducts: total,
        productsPerPage: limitNumber
      }
    });
  } catch (error) {
    console.error("Error fetching camera products:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single camera product by ID
export const getCameraProductById = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = new mongoose.Types.ObjectId(id);
    } else {
      query.productId = id;
    }

    const product = await Camera.findOne(query);
    
    if (!product) {
      return res.status(404).json({ message: 'Camera product not found' });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Error fetching camera product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create new camera product (admin only)
export const createCameraProduct = async (req, res) => {
  try {
    const {
      type, name, price, category, description, popularity,
      brand, stock, code, condition, discount, bonuses, dateAdded,
      keyFeatures, specifications, notes, originalPrice,
      sensorType, sensorSize, megapixels,
      imageProcessor, isoRange, shutterSpeed, continuousShooting,
      videoResolution, videoFrameRates,
      lensMount, focalLength, aperture,
      autofocusPoints, faceDetection, eyeTracking,
      screenSize, screenResolution, touchscreen, articulatingScreen,
      viewfinderType, viewfinderResolution,
      wifi, bluetooth, nfc, hdmi, usbType,
      storageMedia, cardSlots,
      batteryType, batteryLife,
      weight, dimensions, weatherSealed,
      resolution, frameRate, fieldOfView, autofocus, lowLightCorrection,
      waterproof, imageStabilization, builtInDisplay,
      otherTechnicalDetails
    } = req.body;

    // Generate unique IDs
    const productId = uuidv4();
    const customId = `${Date.now()}${Math.floor(Math.random() * 10000)}`;

    // Parse JSON fields
    let parsedKeyFeatures = [];
    if (keyFeatures) {
      try {
        parsedKeyFeatures = typeof keyFeatures === 'string' ? JSON.parse(keyFeatures) : keyFeatures;
      } catch (e) {
        console.error("Error parsing keyFeatures:", e);
      }
    }

    let parsedSpecifications = [];
    if (specifications) {
      try {
        parsedSpecifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
      } catch (e) {
        console.error("Error parsing specifications:", e);
      }
    }

    let parsedOtherDetails = [];
    if (otherTechnicalDetails) {
      try {
        parsedOtherDetails = typeof otherTechnicalDetails === 'string' ? JSON.parse(otherTechnicalDetails) : otherTechnicalDetails;
      } catch (e) {
        console.error("Error parsing otherTechnicalDetails:", e);
      }
    }

    let parsedNotes = [];
    if (notes) {
      try {
        parsedNotes = typeof notes === 'string' ? JSON.parse(notes) : (Array.isArray(notes) ? notes : [notes]);
      } catch (e) {
        parsedNotes = [notes];
      }
    }

    let parsedVideoResolution = [];
    if (videoResolution) {
      try {
        parsedVideoResolution = typeof videoResolution === 'string' ? JSON.parse(videoResolution) : 
                               (Array.isArray(videoResolution) ? videoResolution : [videoResolution]);
      } catch (e) {
        parsedVideoResolution = [videoResolution];
      }
    }

    let parsedStorageMedia = [];
    if (storageMedia) {
      try {
        parsedStorageMedia = typeof storageMedia === 'string' ? JSON.parse(storageMedia) : 
                            (Array.isArray(storageMedia) ? storageMedia : [storageMedia]);
      } catch (e) {
        parsedStorageMedia = [storageMedia];
      }
    }

    // Handle uploaded files
    const files = req.files || {};
    const mainImageFiles = files.image || [];
    const additionalImageFiles = files.additionalImages || [];

    const mainImageUrls = mainImageFiles.map(file => file.path);
    const additionalImageUrls = additionalImageFiles.map(file => file.path);

    if (mainImageUrls.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    // Build product data
    const productData = {
      id: productId,
      productId,
      customId,
      type: type || 'Camera',
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category: Array.isArray(category) ? category : [category],
      description,
      brand,
      inStock: stock !== 'false',
      code,
      condition: condition || 'New',
      discount: discount ? Number(discount) : 0,
      bonuses: bonuses || '',
      dateAdded: dateAdded || new Date(),
      popularity: popularity ? Number(popularity) : 0,
      image: mainImageUrls,
      additionalImages: additionalImageUrls,
      keyFeatures: parsedKeyFeatures,
      specifications: parsedSpecifications,
      notes: parsedNotes,
      otherTechnicalDetails: parsedOtherDetails,
      specs: {
        sensorType,
        sensorSize,
        megapixels,
        imageProcessor,
        isoRange,
        shutterSpeed,
        continuousShooting,
        videoResolution: parsedVideoResolution,
        videoFrameRates,
        lensMount,
        focalLength,
        aperture,
        autofocusPoints,
        faceDetection: faceDetection === 'true',
        eyeTracking: eyeTracking === 'true',
        screenSize,
        screenResolution,
        touchscreen: touchscreen === 'true',
        articulatingScreen: articulatingScreen === 'true',
        viewfinderType,
        viewfinderResolution,
        wifi: wifi === 'true',
        bluetooth: bluetooth === 'true',
        nfc: nfc === 'true',
        hdmi: hdmi === 'true',
        usbType,
        storageMedia: parsedStorageMedia,
        cardSlots: cardSlots ? Number(cardSlots) : 1,
        batteryType,
        batteryLife,
        weight,
        dimensions,
        weatherSealed: weatherSealed === 'true',
        resolution,
        frameRate,
        fieldOfView,
        autofocus: autofocus === 'true',
        lowLightCorrection: lowLightCorrection === 'true',
        waterproof,
        imageStabilization,
        builtInDisplay: builtInDisplay === 'true'
      }
    };

    // Remove undefined values
    Object.keys(productData.specs).forEach(key => 
      productData.specs[key] === undefined && delete productData.specs[key]
    );

    const newProduct = new Camera(productData);
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Camera product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error("Error creating camera product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update camera product (admin only)
export const updateCameraProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const product = await Camera.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Camera product not found' });
    }

    const updates = { ...req.body };

    // Parse JSON fields
    ['keyFeatures', 'specifications', 'otherTechnicalDetails', 'notes', 'videoResolution', 'storageMedia'].forEach(field => {
      if (updates[field] && typeof updates[field] === 'string') {
        try {
          updates[field] = JSON.parse(updates[field]);
        } catch (e) {
          console.error(`Error parsing ${field}:`, e);
        }
      }
    });

    // Handle specs
    const specFields = [
      'sensorType', 'sensorSize', 'megapixels', 'imageProcessor', 'isoRange',
      'shutterSpeed', 'continuousShooting', 'videoFrameRates', 'lensMount',
      'focalLength', 'aperture', 'autofocusPoints', 'screenSize', 'screenResolution',
      'viewfinderType', 'viewfinderResolution', 'usbType', 'batteryType', 'batteryLife',
      'weight', 'dimensions', 'resolution', 'frameRate', 'fieldOfView', 'waterproof',
      'imageStabilization'
    ];

    specFields.forEach(field => {
      if (updates[field] !== undefined) {
        updates.specs = updates.specs || {};
        updates.specs[field] = updates[field];
      }
    });

    // Handle boolean fields
    const booleanFields = [
      'faceDetection', 'eyeTracking', 'touchscreen', 'articulatingScreen',
      'wifi', 'bluetooth', 'nfc', 'hdmi', 'weatherSealed', 'autofocus',
      'lowLightCorrection', 'builtInDisplay'
    ];
    
    booleanFields.forEach(field => {
      if (updates[field] !== undefined) {
        updates.specs = updates.specs || {};
        updates.specs[field] = updates[field] === 'true' || updates[field] === true;
      }
    });

    // Handle array fields
    if (updates.videoResolution) {
      updates.specs = updates.specs || {};
      updates.specs.videoResolution = Array.isArray(updates.videoResolution) 
        ? updates.videoResolution 
        : [updates.videoResolution];
    }

    if (updates.storageMedia) {
      updates.specs = updates.specs || {};
      updates.specs.storageMedia = Array.isArray(updates.storageMedia) 
        ? updates.storageMedia 
        : [updates.storageMedia];
    }

    // Handle numeric fields
    const numericFields = ['price', 'originalPrice', 'discount', 'popularity', 'cardSlots'];
    numericFields.forEach(field => {
      if (updates[field] !== undefined) {
        updates[field] = Number(updates[field]);
      }
    });

    // Handle stock
    if (updates.stock !== undefined) {
      updates.inStock = updates.stock === 'true' || updates.stock === true;
    }

    // Handle files
    const files = req.files || {};
    const mainImageFiles = files.image || [];
    const additionalImageFiles = files.additionalImages || [];

    if (mainImageFiles.length > 0) {
      updates.image = mainImageFiles.map(file => file.path);
    }

    if (additionalImageFiles.length > 0) {
      updates.additionalImages = [
        ...(product.additionalImages || []),
        ...additionalImageFiles.map(file => file.path)
      ];
    }

    const updatedProduct = await Camera.findOneAndUpdate(
      query,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Camera product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error("Error updating camera product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete camera product (admin only)
export const deleteCameraProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const product = await Camera.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Camera product not found' });
    }

    // Delete associated images
    const allImages = [
      ...(product.image || []),
      ...(product.additionalImages || [])
    ];

    allImages.forEach((imagePath) => {
      const filename = path.basename(imagePath);
      const fullPath = path.resolve('uploads', filename);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    await Camera.deleteOne(query);

    res.json({
      success: true,
      message: 'Camera product deleted successfully'
    });
  } catch (error) {
    console.error("Error deleting camera product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add review to camera product
export const addCameraReview = async (req, res) => {
  const { id } = req.params;
  const { reviewerName, rating, comment } = req.body;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const product = await Camera.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Camera product not found' });
    }

    const reviewImage = req.file ? req.file.path : null;

    const newReview = {
      reviewerName,
      rating: Number(rating),
      comment,
      reviewImage,
      date: new Date()
    };

    product.reviews.push(newReview);
    await product.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      review: newReview
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get camera products by brand
export const getCameraByBrand = async (req, res) => {
  const { brand } = req.params;

  try {
    const products = await Camera.find({ brand: { $regex: new RegExp(brand, 'i') } })
      .sort({ popularity: -1 });

    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error("Error fetching camera by brand:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get camera products by type
export const getCameraByType = async (req, res) => {
  const { type } = req.params;

  try {
    const products = await Camera.find({ type: { $regex: new RegExp(type, 'i') } })
      .sort({ popularity: -1 });

    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error("Error fetching camera by type:", error);
    res.status(500).json({ message: error.message });
  }
};