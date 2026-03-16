// server/controllers/audioController.js
import Audio from "../models/Audio.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all audio products
export const getAudioProducts = async (req, res) => {
  const { 
    q, 
    type, 
    brand, 
    price, 
    connectivity, 
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
        { "specs.connectivity": { $regex: regex } },
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

    // Filter by connectivity
    if (connectivity && connectivity !== "all") {
      query["specs.connectivity"] = { $in: [connectivity] };
    }

    // Filter by features
    if (features && features !== "all") {
      const featureArray = features.split(',');
      featureArray.forEach(feature => {
        switch(feature) {
          case 'noiseCancelling':
            query["specs.noiseCancelling"] = true;
            break;
          case 'waterResistant':
            query["specs.waterResistant"] = { $exists: true, $ne: "" };
            break;
          case 'builtInMic':
            query["specs.builtInMic"] = true;
            break;
          case 'bluetooth':
            query["specs.connectivity"] = { $in: ['Bluetooth'] };
            break;
          case 'wireless':
            query["specs.connectivity"] = { $in: ['Wireless', 'Bluetooth', 'WiFi'] };
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
    const total = await Audio.countDocuments(query);

    // Fetch products with sorting
    const audioProducts = await Audio.find(query)
      .sort({ popularity: -1, dateAdded: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      success: true,
      products: audioProducts,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalProducts: total,
        productsPerPage: limitNumber
      }
    });
  } catch (error) {
    console.error("Error fetching audio products:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single audio product by ID
export const getAudioProductById = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = new mongoose.Types.ObjectId(id);
    } else {
      query.productId = id;
    }

    const product = await Audio.findOne(query);
    
    if (!product) {
      return res.status(404).json({ message: 'Audio product not found' });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Error fetching audio product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create new audio product (admin only)
export const createAudioProduct = async (req, res) => {
  try {
    const {
      type, name, price, category, description, popularity,
      brand, stock, code, condition, discount, bonuses, dateAdded,
      keyFeatures, specifications, notes, originalPrice,
      driverSize, frequencyResponse, impedance, sensitivity,
      connectivity, bluetoothVersion, wirelessRange,
      batteryLife, chargingTime, fastCharging,
      noiseCancelling, waterResistant, builtInMic,
      voiceAssistant, multipointConnection,
      touchControls, buttonControls,
      weight, color, foldable,
      outputPower, channels, subwoofer,
      polarPattern, sampleRate, bitDepth,
      otherTechnicalDetails
    } = req.body;

    // Generate unique IDs
    const productId = uuidv4();
    const customId = `${Date.now()}${Math.floor(Math.random() * 10000)}`;

    // Parse JSON fields with proper error handling and defaults
    let parsedKeyFeatures = [];
    if (keyFeatures) {
      try {
        parsedKeyFeatures = typeof keyFeatures === 'string' ? JSON.parse(keyFeatures) : keyFeatures;
        // Ensure it's an array
        if (!Array.isArray(parsedKeyFeatures)) {
          parsedKeyFeatures = [];
        }
      } catch (e) {
        console.error("Error parsing keyFeatures:", e);
        parsedKeyFeatures = [];
      }
    }

    let parsedSpecifications = [];
    if (specifications) {
      try {
        parsedSpecifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
        if (!Array.isArray(parsedSpecifications)) {
          parsedSpecifications = [];
        }
      } catch (e) {
        console.error("Error parsing specifications:", e);
        parsedSpecifications = [];
      }
    }

    // Handle otherTechnicalDetails - CRITICAL FIX
    let parsedOtherDetails = [];
    if (otherTechnicalDetails) {
      try {
        parsedOtherDetails = typeof otherTechnicalDetails === 'string' ? JSON.parse(otherTechnicalDetails) : otherTechnicalDetails;
        // Ensure it's an array
        if (!Array.isArray(parsedOtherDetails)) {
          parsedOtherDetails = [];
        }
        // Filter out empty entries
        parsedOtherDetails = parsedOtherDetails.filter(detail => 
          detail && (detail.name || detail.value)
        );
      } catch (e) {
        console.error("Error parsing otherTechnicalDetails:", e);
        parsedOtherDetails = [];
      }
    }

    // If parsedOtherDetails is empty, provide a default empty array (not required)
    // The model might have required validation, so we need to ensure we don't send empty objects

    let parsedNotes = [];
    if (notes) {
      try {
        parsedNotes = typeof notes === 'string' ? JSON.parse(notes) : (Array.isArray(notes) ? notes : [notes]);
        if (!Array.isArray(parsedNotes)) {
          parsedNotes = [];
        }
      } catch (e) {
        parsedNotes = notes ? [notes] : [];
      }
    }

    let parsedConnectivity = [];
    if (connectivity) {
      try {
        parsedConnectivity = typeof connectivity === 'string' ? JSON.parse(connectivity) : 
                            (Array.isArray(connectivity) ? connectivity : [connectivity]);
        if (!Array.isArray(parsedConnectivity)) {
          parsedConnectivity = [];
        }
      } catch (e) {
        parsedConnectivity = connectivity ? [connectivity] : [];
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

    // Build product data - ensure otherTechnicalDetails is properly handled
    const productData = {
      id: productId,
      productId,
      customId,
      type: type || 'Audio',
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category: Array.isArray(category) ? category : (category ? [category] : []),
      description: description || '',
      brand: brand || '',
      inStock: stock !== 'false',
      code: code || '',
      condition: condition || 'New',
      discount: discount ? Number(discount) : 0,
      bonuses: bonuses || '',
      dateAdded: dateAdded || new Date(),
      popularity: popularity ? Number(popularity) : 0,
      image: mainImageUrls,
      additionalImages: additionalImageUrls || [],
      keyFeatures: parsedKeyFeatures,
      specifications: parsedSpecifications,
      notes: parsedNotes,
      // Only include otherTechnicalDetails if it has valid entries
      ...(parsedOtherDetails.length > 0 && { otherTechnicalDetails: parsedOtherDetails }),
      specs: {
        driverSize: driverSize || '',
        frequencyResponse: frequencyResponse || '',
        impedance: impedance || '',
        sensitivity: sensitivity || '',
        connectivity: parsedConnectivity,
        bluetoothVersion: bluetoothVersion || '',
        wirelessRange: wirelessRange || '',
        batteryLife: batteryLife || '',
        chargingTime: chargingTime || '',
        fastCharging: fastCharging === 'true',
        noiseCancelling: noiseCancelling === 'true',
        waterResistant: waterResistant || '',
        builtInMic: builtInMic === 'true',
        voiceAssistant: voiceAssistant === 'true',
        multipointConnection: multipointConnection === 'true',
        touchControls: touchControls === 'true',
        buttonControls: buttonControls !== 'false',
        weight: weight || '',
        color: color || '',
        foldable: foldable === 'true',
        outputPower: outputPower || '',
        channels: channels || '',
        subwoofer: subwoofer === 'true',
        polarPattern: polarPattern || '',
        sampleRate: sampleRate || '',
        bitDepth: bitDepth || ''
      }
    };

    // Remove undefined values from specs
    Object.keys(productData.specs).forEach(key => 
      productData.specs[key] === undefined && delete productData.specs[key]
    );

    console.log("Product data to save:", JSON.stringify(productData, null, 2));

    const newProduct = new Audio(productData);
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Audio product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error("Error creating audio product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update audio product (admin only)
export const updateAudioProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const product = await Audio.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Audio product not found' });
    }

    const updates = { ...req.body };

    // Parse JSON fields
    ['keyFeatures', 'specifications', 'otherTechnicalDetails', 'notes'].forEach(field => {
      if (updates[field] && typeof updates[field] === 'string') {
        try {
          updates[field] = JSON.parse(updates[field]);
        } catch (e) {
          console.error(`Error parsing ${field}:`, e);
        }
      }
    });

    // Handle specs
    if (updates.connectivity) {
      try {
        updates.specs = updates.specs || {};
        updates.specs.connectivity = typeof updates.connectivity === 'string' 
          ? JSON.parse(updates.connectivity) 
          : updates.connectivity;
      } catch (e) {
        updates.specs = updates.specs || {};
        updates.specs.connectivity = [updates.connectivity];
      }
    }

    // Handle boolean fields
    const booleanFields = ['fastCharging', 'noiseCancelling', 'builtInMic', 'voiceAssistant', 
                          'multipointConnection', 'touchControls', 'buttonControls', 'foldable', 'subwoofer'];
    
    booleanFields.forEach(field => {
      if (updates[field] !== undefined) {
        updates.specs = updates.specs || {};
        updates.specs[field] = updates[field] === 'true' || updates[field] === true;
      }
    });

    // Handle numeric fields
    const numericFields = ['price', 'originalPrice', 'discount', 'popularity'];
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

    const updatedProduct = await Audio.findOneAndUpdate(
      query,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Audio product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error("Error updating audio product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete audio product (admin only)
export const deleteAudioProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const product = await Audio.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Audio product not found' });
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

    await Audio.deleteOne(query);

    res.json({
      success: true,
      message: 'Audio product deleted successfully'
    });
  } catch (error) {
    console.error("Error deleting audio product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add review to audio product
export const addAudioReview = async (req, res) => {
  const { id } = req.params;
  const { reviewerName, rating, comment } = req.body;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const product = await Audio.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Audio product not found' });
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

// Get audio products by brand
export const getAudioByBrand = async (req, res) => {
  const { brand } = req.params;

  try {
    const products = await Audio.find({ brand: { $regex: new RegExp(brand, 'i') } })
      .sort({ popularity: -1 });

    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error("Error fetching audio by brand:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get audio products by type
export const getAudioByType = async (req, res) => {
  const { type } = req.params;

  try {
    const products = await Audio.find({ type: { $regex: new RegExp(type, 'i') } })
      .sort({ popularity: -1 });

    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error("Error fetching audio by type:", error);
    res.status(500).json({ message: error.message });
  }
};