// server/controllers/mobileController.js
import Mobile from "../models/Mobile.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all mobile products
export const getMobileProducts = async (req, res) => {
  const { 
    q, 
    type, 
    brand, 
    price, 
    os,
    ram,
    storage,
    battery,
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
        { "specs.processor": { $regex: regex } },
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

    // Filter by OS
    if (os && os !== "all") {
      query["specs.operatingSystem"] = { $regex: new RegExp(os, 'i') };
    }

    // Filter by RAM
    if (ram && ram !== "all") {
      query["specs.ram"] = { $regex: new RegExp(ram, 'i') };
    }

    // Filter by Storage
    if (storage && storage !== "all") {
      query["specs.internalStorage"] = { $regex: new RegExp(storage, 'i') };
    }

    // Filter by Battery
    if (battery && battery !== "all") {
      const batteryMatch = battery.match(/(\d+)/);
      if (batteryMatch) {
        const batteryValue = parseInt(batteryMatch[0]);
        if (battery.includes('<')) {
          query["specs.batteryCapacity"] = { $lt: batteryValue };
        } else if (battery.includes('+')) {
          query["specs.batteryCapacity"] = { $gte: batteryValue };
        } else if (battery.includes('-')) {
          const [min, max] = battery.split('-').map(b => parseInt(b.match(/(\d+)/)[0]));
          query["specs.batteryCapacity"] = { $gte: min, $lte: max };
        }
      }
    }

    // Filter by features
    if (features && features !== "all") {
      const featureArray = features.split(',');
      featureArray.forEach(feature => {
        switch(feature) {
          case '5G':
            query["specs.network"] = { $in: ['5G'] };
            break;
          case 'wirelessCharging':
            query["specs.wirelessCharging"] = true;
            break;
          case 'fastCharging':
            query["specs.fastCharging"] = { $exists: true, $ne: "" };
            break;
          case 'waterResistant':
            query["specs.waterResistant"] = { $exists: true, $ne: "" };
            break;
          case 'nfc':
            query["specs.nfc"] = true;
            break;
          case 'faceUnlock':
            query["specs.faceUnlock"] = true;
            break;
          case 'fingerprintSensor':
            query["specs.fingerprintSensor"] = true;
            break;
          case 'dualSim':
            query["specs.dualSim"] = true;
            break;
          case 'expandableStorage':
            query["specs.expandableStorage"] = true;
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
    const total = await Mobile.countDocuments(query);

    // Fetch products with sorting
    const mobileProducts = await Mobile.find(query)
      .sort({ popularity: -1, dateAdded: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      success: true,
      products: mobileProducts,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalProducts: total,
        productsPerPage: limitNumber
      }
    });
  } catch (error) {
    console.error("Error fetching mobile products:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single mobile product by ID
export const getMobileProductById = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = new mongoose.Types.ObjectId(id);
    } else {
      query.productId = id;
    }

    const product = await Mobile.findOne(query);
    
    if (!product) {
      return res.status(404).json({ message: 'Mobile product not found' });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Error fetching mobile product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create new mobile product (admin only)
export const createMobileProduct = async (req, res) => {
  try {
    const {
      type, name, price, category, description, popularity,
      brand, stock, code, condition, discount, bonuses, dateAdded,
      keyFeatures, specifications, notes, originalPrice,
      
      // Display
      displaySize, displayType, resolution, refreshRate, brightness, hdr,
      
      // Processor
      processor, processorBrand, processorCores, processorSpeed, gpu,
      
      // Memory
      ram, ramType, internalStorage, storageType, expandableStorage, maxStorage,
      
      // Camera
      rearCamera, rearCameraFeatures, frontCamera, frontCameraFeatures, videoRecording, cameraFeatures,
      
      // Battery
      batteryCapacity, batteryType, fastCharging, wirelessCharging, reverseCharging, chargingTime,
      
      // Connectivity
      network, simType, dualSim, wifi, bluetooth, nfc, gps, usbType,
      
      // OS
      operatingSystem, osVersion,
      
      // Sensors
      fingerprintSensor, fingerprintPosition, faceUnlock, accelerometer, gyroscope, proximity, compass, barometer,
      
      // Physical
      dimensions, weight, build, colors, waterResistant,
      
      // Audio
      speakers, headphoneJack, audioFeatures,
      
      // Additional Features
      stylus, desktopMode, samsungDex, applePencilSupport, keyboardSupport,
      applePencilGen, magicKeyboardSupport, smartConnector,
      
      otherTechnicalDetails
    } = req.body;

    // Generate unique IDs
    const productId = uuidv4();
    const customId = `${Date.now()}${Math.floor(Math.random() * 10000)}`;

    // Parse JSON fields with proper error handling
    let parsedKeyFeatures = [];
    if (keyFeatures) {
      try {
        parsedKeyFeatures = typeof keyFeatures === 'string' ? JSON.parse(keyFeatures) : keyFeatures;
        if (!Array.isArray(parsedKeyFeatures)) parsedKeyFeatures = [];
      } catch (e) {
        console.error("Error parsing keyFeatures:", e);
      }
    }

    let parsedSpecifications = [];
    if (specifications) {
      try {
        parsedSpecifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
        if (!Array.isArray(parsedSpecifications)) parsedSpecifications = [];
      } catch (e) {
        console.error("Error parsing specifications:", e);
      }
    }

    let parsedOtherDetails = [];
    if (otherTechnicalDetails) {
      try {
        parsedOtherDetails = typeof otherTechnicalDetails === 'string' ? JSON.parse(otherTechnicalDetails) : otherTechnicalDetails;
        if (Array.isArray(parsedOtherDetails)) {
          parsedOtherDetails = parsedOtherDetails.filter(detail => detail && (detail.name || detail.value))
            .map(detail => ({ name: detail.name || '', value: detail.value || '' }));
        }
      } catch (e) {
        console.error("Error parsing otherTechnicalDetails:", e);
      }
    }

    let parsedNotes = [];
    if (notes) {
      try {
        parsedNotes = typeof notes === 'string' ? JSON.parse(notes) : (Array.isArray(notes) ? notes : [notes]);
      } catch (e) {
        parsedNotes = notes ? [notes] : [];
      }
    }

    let parsedNetwork = [];
    if (network) {
      try {
        parsedNetwork = typeof network === 'string' ? JSON.parse(network) : 
                       (Array.isArray(network) ? network : [network]);
      } catch (e) {
        parsedNetwork = network ? [network] : [];
      }
    }

    let parsedColors = [];
    if (colors) {
      try {
        parsedColors = typeof colors === 'string' ? JSON.parse(colors) : 
                      (Array.isArray(colors) ? colors : [colors]);
      } catch (e) {
        parsedColors = colors ? [colors] : [];
      }
    }

    let parsedCameraFeatures = [];
    if (cameraFeatures) {
      try {
        parsedCameraFeatures = typeof cameraFeatures === 'string' ? JSON.parse(cameraFeatures) : 
                              (Array.isArray(cameraFeatures) ? cameraFeatures : [cameraFeatures]);
      } catch (e) {
        parsedCameraFeatures = cameraFeatures ? [cameraFeatures] : [];
      }
    }

    let parsedAudioFeatures = [];
    if (audioFeatures) {
      try {
        parsedAudioFeatures = typeof audioFeatures === 'string' ? JSON.parse(audioFeatures) : 
                             (Array.isArray(audioFeatures) ? audioFeatures : [audioFeatures]);
      } catch (e) {
        parsedAudioFeatures = audioFeatures ? [audioFeatures] : [];
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
      type: type || 'Smartphone',
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
      ...(parsedOtherDetails.length > 0 && { otherTechnicalDetails: parsedOtherDetails }),
      specs: {
        // Display
        displaySize: displaySize || '',
        displayType: displayType || '',
        resolution: resolution || '',
        refreshRate: refreshRate || '',
        brightness: brightness || '',
        hdr: hdr === 'true',
        
        // Processor
        processor: processor || '',
        processorBrand: processorBrand || '',
        processorCores: processorCores || '',
        processorSpeed: processorSpeed || '',
        gpu: gpu || '',
        
        // Memory
        ram: ram || '',
        ramType: ramType || '',
        internalStorage: internalStorage || '',
        storageType: storageType || '',
        expandableStorage: expandableStorage === 'true',
        maxStorage: maxStorage || '',
        
        // Camera
        rearCamera: rearCamera || '',
        rearCameraFeatures: rearCameraFeatures || '',
        frontCamera: frontCamera || '',
        frontCameraFeatures: frontCameraFeatures || '',
        videoRecording: videoRecording || '',
        cameraFeatures: parsedCameraFeatures,
        
        // Battery
        batteryCapacity: batteryCapacity || '',
        batteryType: batteryType || '',
        fastCharging: fastCharging || '',
        wirelessCharging: wirelessCharging === 'true',
        reverseCharging: reverseCharging === 'true',
        chargingTime: chargingTime || '',
        
        // Connectivity
        network: parsedNetwork,
        simType: simType || '',
        dualSim: dualSim === 'true',
        wifi: wifi || '',
        bluetooth: bluetooth || '',
        nfc: nfc === 'true',
        gps: gps !== 'false',
        usbType: usbType || '',
        
        // OS
        operatingSystem: operatingSystem || '',
        osVersion: osVersion || '',
        
        // Sensors
        fingerprintSensor: fingerprintSensor === 'true',
        fingerprintPosition: fingerprintPosition || '',
        faceUnlock: faceUnlock === 'true',
        accelerometer: accelerometer !== 'false',
        gyroscope: gyroscope !== 'false',
        proximity: proximity !== 'false',
        compass: compass !== 'false',
        barometer: barometer === 'true',
        
        // Physical
        dimensions: dimensions || '',
        weight: weight || '',
        build: build || '',
        colors: parsedColors,
        waterResistant: waterResistant || '',
        
        // Audio
        speakers: speakers || '',
        headphoneJack: headphoneJack === 'true',
        audioFeatures: parsedAudioFeatures,
        
        // Additional Features
        stylus: stylus === 'true',
        desktopMode: desktopMode === 'true',
        samsungDex: samsungDex === 'true',
        applePencilSupport: applePencilSupport === 'true',
        keyboardSupport: keyboardSupport === 'true',
        applePencilGen: applePencilGen || '',
        magicKeyboardSupport: magicKeyboardSupport === 'true',
        smartConnector: smartConnector === 'true',
      }
    };

    // Remove undefined values from specs
    Object.keys(productData.specs).forEach(key => 
      productData.specs[key] === undefined && delete productData.specs[key]
    );

    const newProduct = new Mobile(productData);
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Mobile product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error("Error creating mobile product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update mobile product (admin only)
export const updateMobileProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const product = await Mobile.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Mobile product not found' });
    }

    const updates = { ...req.body };

    // Parse JSON fields
    ['keyFeatures', 'specifications', 'otherTechnicalDetails', 'notes', 'network', 'colors', 'cameraFeatures', 'audioFeatures'].forEach(field => {
      if (updates[field] && typeof updates[field] === 'string') {
        try {
          updates[field] = JSON.parse(updates[field]);
        } catch (e) {
          console.error(`Error parsing ${field}:`, e);
        }
      }
    });

    // Handle otherTechnicalDetails specially
    if (updates.otherTechnicalDetails) {
      try {
        let parsedOtherDetails = updates.otherTechnicalDetails;
        if (Array.isArray(parsedOtherDetails)) {
          parsedOtherDetails = parsedOtherDetails.filter(detail => detail && (detail.name || detail.value))
            .map(detail => ({ name: detail.name || '', value: detail.value || '' }));
          
          if (parsedOtherDetails.length > 0) {
            updates.otherTechnicalDetails = parsedOtherDetails;
          } else {
            delete updates.otherTechnicalDetails;
          }
        }
      } catch (e) {
        console.error("Error parsing otherTechnicalDetails:", e);
        delete updates.otherTechnicalDetails;
      }
    }

    // Handle boolean fields
    const booleanFields = [
      'hdr', 'expandableStorage', 'wirelessCharging', 'reverseCharging', 'dualSim',
      'nfc', 'gps', 'fingerprintSensor', 'faceUnlock', 'accelerometer', 'gyroscope',
      'proximity', 'compass', 'barometer', 'headphoneJack', 'stylus', 'desktopMode',
      'samsungDex', 'applePencilSupport', 'keyboardSupport', 'magicKeyboardSupport',
      'smartConnector'
    ];
    
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

    const updatedProduct = await Mobile.findOneAndUpdate(
      query,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Mobile product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error("Error updating mobile product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete mobile product (admin only)
export const deleteMobileProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const product = await Mobile.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Mobile product not found' });
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

    await Mobile.deleteOne(query);

    res.json({
      success: true,
      message: 'Mobile product deleted successfully'
    });
  } catch (error) {
    console.error("Error deleting mobile product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add review to mobile product
export const addMobileReview = async (req, res) => {
  const { id } = req.params;
  const { reviewerName, rating, comment } = req.body;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const product = await Mobile.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Mobile product not found' });
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

// Get mobile products by brand
export const getMobileByBrand = async (req, res) => {
  const { brand } = req.params;

  try {
    const products = await Mobile.find({ brand: { $regex: new RegExp(brand, 'i') } })
      .sort({ popularity: -1 });

    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error("Error fetching mobile by brand:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get mobile products by type
export const getMobileByType = async (req, res) => {
  const { type } = req.params;

  try {
    const products = await Mobile.find({ type: { $regex: new RegExp(type, 'i') } })
      .sort({ popularity: -1 });

    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error("Error fetching mobile by type:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get mobile products by OS
export const getMobileByOS = async (req, res) => {
  const { os } = req.params;

  try {
    const products = await Mobile.find({ "specs.operatingSystem": { $regex: new RegExp(os, 'i') } })
      .sort({ popularity: -1 });

    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error("Error fetching mobile by OS:", error);
    res.status(500).json({ message: error.message });
  }
};