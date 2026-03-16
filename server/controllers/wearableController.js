// server/controllers/wearableController.js
import Wearable from "../models/Wearable.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all wearable products
export const getWearableProducts = async (req, res) => {
  const { 
    q, 
    type, 
    brand, 
    price, 
    features,
    os,
    waterResistant,
    hasGPS,
    hasHeartRate,
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
        { "specs.operatingSystem": { $regex: regex } },
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

    // Filter by water resistance
    if (waterResistant === 'true') {
      query["specs.waterResistant"] = { $exists: true, $ne: "" };
    }

    // Filter by GPS
    if (hasGPS === 'true') {
      query["specs.gps"] = true;
    }

    // Filter by heart rate monitor
    if (hasHeartRate === 'true') {
      query["specs.heartRateMonitor"] = true;
    }

    // Filter by features
    if (features && features !== "all") {
      const featureArray = features.split(',');
      featureArray.forEach(feature => {
        if (feature.includes('Battery:')) {
          const batteryRange = feature.replace('Battery:', '').trim();
          // Handle battery range filtering in code or add to query
        } else {
          switch(feature) {
            case 'Heart Rate Monitor':
              query["specs.heartRateMonitor"] = true;
              break;
            case 'GPS':
              query["specs.gps"] = true;
              break;
            case 'Water Resistant':
              query["specs.waterResistant"] = { $exists: true, $ne: "" };
              break;
            case 'Sleep Tracking':
              query["specs.sleepTracking"] = true;
              break;
            case 'Blood Oxygen (SpO2)':
              query["specs.bloodOxygenSensor"] = true;
              break;
            case 'ECG':
              query["specs.ecgSensor"] = true;
              break;
            case 'Stress Tracking':
              query["specs.stressTracking"] = true;
              break;
            case 'Voice Assistant':
              query["specs.voiceAssistant"] = true;
              break;
            case 'Music Control':
              query["specs.musicControl"] = true;
              break;
            case 'NFC Payments':
              query["specs.nfcPayments"] = true;
              break;
            case 'Bluetooth Calls':
              query["specs.callsViaWatch"] = true;
              break;
            case 'Always-On Display':
              query["specs.alwaysOnDisplay"] = true;
              break;
          }
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
    const total = await Wearable.countDocuments(query);

    // Fetch products with sorting
    const wearableProducts = await Wearable.find(query)
      .sort({ popularity: -1, dateAdded: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      success: true,
      products: wearableProducts,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalProducts: total,
        productsPerPage: limitNumber
      }
    });
  } catch (error) {
    console.error("Error fetching wearable products:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single wearable product by ID
export const getWearableProductById = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = new mongoose.Types.ObjectId(id);
    } else {
      query.productId = id;
    }

    const product = await Wearable.findOne(query);
    
    if (!product) {
      return res.status(404).json({ message: 'Wearable product not found' });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Error fetching wearable product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create new wearable product (admin only)
export const createWearableProduct = async (req, res) => {
  try {
    const {
      type, name, price, category, description, popularity,
      brand, stock, code, condition, discount, bonuses, dateAdded,
      keyFeatures, specifications, notes, originalPrice,
      
      // Display
      displayType, displaySize, screenResolution, alwaysOnDisplay, touchscreen, colorDisplay,
      
      // Physical
      caseMaterial, strapMaterial, strapSize, interchangeableStraps,
      dimensions, weight, colors,
      
      // Health Sensors
      heartRateMonitor, bloodOxygenSensor, ecgSensor, temperatureSensor,
      skinTemperatureSensor, respirationRate, stressTracking, sleepTracking,
      stepCounter, calorieTracking, distanceTracking, floorsClimbed, fallDetection,
      
      // Fitness Features
      workoutModes, workoutTracking, autoWorkoutDetection,
      gps, glonass, galileo, compass, altimeter, barometer,
      
      // Connectivity
      bluetooth, bluetoothVersion, wifi, nfc, mobileConnectivity,
      simSupport, esimSupport,
      
      // Smart Features
      operatingSystem, compatibleOS, voiceAssistant, voiceAssistantType,
      notifications, musicControl, musicStorage, onboardMusic,
      callsViaWatch, speaker, microphone, cameraControl, findMyPhone,
      
      // Payments
      nfcPayments, paymentServices,
      
      // Navigation
      maps, turnByTurnNavigation,
      
      // Water Resistance
      waterResistant, swimProof, swimTracking,
      
      // Battery
      batteryType, batteryCapacity, batteryLife, batteryLifeMode,
      chargingTime, wirelessCharging, fastCharging,
      
      // Sensors
      accelerometer, gyroscope, ambientLightSensor, proximitySensor,
      
      // General
      warranty, releaseYear, manufacturer, countryOfOrigin,
      
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

    let parsedWorkoutTracking = [];
    if (workoutTracking) {
      try {
        parsedWorkoutTracking = typeof workoutTracking === 'string' ? JSON.parse(workoutTracking) : 
                                (Array.isArray(workoutTracking) ? workoutTracking : [workoutTracking]);
      } catch (e) {
        parsedWorkoutTracking = workoutTracking ? [workoutTracking] : [];
      }
    }

    let parsedCompatibleOS = [];
    if (compatibleOS) {
      try {
        parsedCompatibleOS = typeof compatibleOS === 'string' ? JSON.parse(compatibleOS) : 
                             (Array.isArray(compatibleOS) ? compatibleOS : [compatibleOS]);
      } catch (e) {
        parsedCompatibleOS = compatibleOS ? [compatibleOS] : [];
      }
    }

    let parsedPaymentServices = [];
    if (paymentServices) {
      try {
        parsedPaymentServices = typeof paymentServices === 'string' ? JSON.parse(paymentServices) : 
                                (Array.isArray(paymentServices) ? paymentServices : [paymentServices]);
      } catch (e) {
        parsedPaymentServices = paymentServices ? [paymentServices] : [];
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
      type: type || 'Wearable',
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
        displayType: displayType || '',
        displaySize: displaySize || '',
        screenResolution: screenResolution || '',
        alwaysOnDisplay: alwaysOnDisplay === 'true',
        touchscreen: touchscreen !== 'false',
        colorDisplay: colorDisplay !== 'false',
        
        // Physical
        caseMaterial: caseMaterial || '',
        strapMaterial: strapMaterial || '',
        strapSize: strapSize || '',
        interchangeableStraps: interchangeableStraps === 'true',
        dimensions: dimensions || '',
        weight: weight || '',
        colors: parsedColors,
        
        // Health Sensors
        heartRateMonitor: heartRateMonitor === 'true',
        bloodOxygenSensor: bloodOxygenSensor === 'true',
        ecgSensor: ecgSensor === 'true',
        temperatureSensor: temperatureSensor === 'true',
        skinTemperatureSensor: skinTemperatureSensor === 'true',
        respirationRate: respirationRate === 'true',
        stressTracking: stressTracking === 'true',
        sleepTracking: sleepTracking === 'true',
        stepCounter: stepCounter !== 'false',
        calorieTracking: calorieTracking === 'true',
        distanceTracking: distanceTracking === 'true',
        floorsClimbed: floorsClimbed === 'true',
        fallDetection: fallDetection === 'true',
        
        // Fitness Features
        workoutModes: workoutModes ? Number(workoutModes) : undefined,
        workoutTracking: parsedWorkoutTracking,
        autoWorkoutDetection: autoWorkoutDetection === 'true',
        gps: gps === 'true',
        glonass: glonass === 'true',
        galileo: galileo === 'true',
        compass: compass === 'true',
        altimeter: altimeter === 'true',
        barometer: barometer === 'true',
        
        // Connectivity
        bluetooth: bluetooth !== 'false',
        bluetoothVersion: bluetoothVersion || '',
        wifi: wifi === 'true',
        nfc: nfc === 'true',
        mobileConnectivity: mobileConnectivity === 'true',
        simSupport: simSupport === 'true',
        esimSupport: esimSupport === 'true',
        
        // Smart Features
        operatingSystem: operatingSystem || '',
        compatibleOS: parsedCompatibleOS,
        voiceAssistant: voiceAssistant === 'true',
        voiceAssistantType: voiceAssistantType || '',
        notifications: notifications !== 'false',
        musicControl: musicControl === 'true',
        musicStorage: musicStorage === 'true',
        onboardMusic: onboardMusic || '',
        callsViaWatch: callsViaWatch === 'true',
        speaker: speaker === 'true',
        microphone: microphone === 'true',
        cameraControl: cameraControl === 'true',
        findMyPhone: findMyPhone === 'true',
        
        // Payments
        nfcPayments: nfcPayments === 'true',
        paymentServices: parsedPaymentServices,
        
        // Navigation
        maps: maps === 'true',
        turnByTurnNavigation: turnByTurnNavigation === 'true',
        
        // Water Resistance
        waterResistant: waterResistant || '',
        swimProof: swimProof === 'true',
        swimTracking: swimTracking === 'true',
        
        // Battery
        batteryType: batteryType || '',
        batteryCapacity: batteryCapacity || '',
        batteryLife: batteryLife || '',
        batteryLifeMode: batteryLifeMode || '',
        chargingTime: chargingTime || '',
        wirelessCharging: wirelessCharging === 'true',
        fastCharging: fastCharging === 'true',
        
        // Sensors
        accelerometer: accelerometer !== 'false',
        gyroscope: gyroscope === 'true',
        ambientLightSensor: ambientLightSensor === 'true',
        proximitySensor: proximitySensor === 'true',
        
        // General
        warranty: warranty || '',
        releaseYear: releaseYear ? Number(releaseYear) : undefined,
        manufacturer: manufacturer || '',
        countryOfOrigin: countryOfOrigin || '',
      }
    };

    // Remove undefined values from specs
    Object.keys(productData.specs).forEach(key => 
      productData.specs[key] === undefined && delete productData.specs[key]
    );

    const newProduct = new Wearable(productData);
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Wearable product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error("Error creating wearable product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update wearable product (admin only)
export const updateWearableProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const product = await Wearable.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Wearable product not found' });
    }

    const updates = { ...req.body };

    // Parse JSON fields
    ['keyFeatures', 'specifications', 'otherTechnicalDetails', 'notes', 'workoutTracking', 'compatibleOS', 'paymentServices', 'colors'].forEach(field => {
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
      'alwaysOnDisplay', 'touchscreen', 'colorDisplay', 'interchangeableStraps',
      'heartRateMonitor', 'bloodOxygenSensor', 'ecgSensor', 'temperatureSensor',
      'skinTemperatureSensor', 'respirationRate', 'stressTracking', 'sleepTracking',
      'stepCounter', 'calorieTracking', 'distanceTracking', 'floorsClimbed', 'fallDetection',
      'autoWorkoutDetection', 'gps', 'glonass', 'galileo', 'compass', 'altimeter', 'barometer',
      'bluetooth', 'wifi', 'nfc', 'mobileConnectivity', 'simSupport', 'esimSupport',
      'voiceAssistant', 'notifications', 'musicControl', 'musicStorage',
      'callsViaWatch', 'speaker', 'microphone', 'cameraControl', 'findMyPhone',
      'nfcPayments', 'maps', 'turnByTurnNavigation', 'swimProof', 'swimTracking',
      'wirelessCharging', 'fastCharging', 'accelerometer', 'gyroscope',
      'ambientLightSensor', 'proximitySensor'
    ];
    
    booleanFields.forEach(field => {
      if (updates[field] !== undefined) {
        updates.specs = updates.specs || {};
        updates.specs[field] = updates[field] === 'true' || updates[field] === true;
      }
    });

    // Handle numeric fields
    const numericFields = [
      'price', 'originalPrice', 'discount', 'popularity', 'workoutModes', 'releaseYear'
    ];
    
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

    const updatedProduct = await Wearable.findOneAndUpdate(
      query,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Wearable product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error("Error updating wearable product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete wearable product (admin only)
export const deleteWearableProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const product = await Wearable.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Wearable product not found' });
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

    await Wearable.deleteOne(query);

    res.json({
      success: true,
      message: 'Wearable product deleted successfully'
    });
  } catch (error) {
    console.error("Error deleting wearable product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add review to wearable product
export const addWearableReview = async (req, res) => {
  const { id } = req.params;
  const { reviewerName, rating, comment } = req.body;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const product = await Wearable.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Wearable product not found' });
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

// Get wearable products by brand
export const getWearableByBrand = async (req, res) => {
  const { brand } = req.params;

  try {
    const products = await Wearable.find({ brand: { $regex: new RegExp(brand, 'i') } })
      .sort({ popularity: -1 });

    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error("Error fetching wearable by brand:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get wearable products by type
export const getWearableByType = async (req, res) => {
  const { type } = req.params;

  try {
    const products = await Wearable.find({ type: { $regex: new RegExp(type, 'i') } })
      .sort({ popularity: -1 });

    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error("Error fetching wearable by type:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get wearable products by OS
export const getWearableByOS = async (req, res) => {
  const { os } = req.params;

  try {
    const products = await Wearable.find({ "specs.operatingSystem": { $regex: new RegExp(os, 'i') } })
      .sort({ popularity: -1 });

    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error("Error fetching wearable by OS:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get wearable products by features
export const getWearableByFeatures = async (req, res) => {
  const { features } = req.query;

  try {
    let query = {};
    
    if (features) {
      const featureArray = features.split(',');
      featureArray.forEach(feature => {
        switch(feature) {
          case 'heartRate':
            query["specs.heartRateMonitor"] = true;
            break;
          case 'gps':
            query["specs.gps"] = true;
            break;
          case 'waterResistant':
            query["specs.waterResistant"] = { $exists: true, $ne: "" };
            break;
          case 'bloodOxygen':
            query["specs.bloodOxygenSensor"] = true;
            break;
          case 'ecg':
            query["specs.ecgSensor"] = true;
            break;
          case 'nfc':
            query["specs.nfcPayments"] = true;
            break;
        }
      });
    }

    const products = await Wearable.find(query).sort({ popularity: -1 });

    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error("Error fetching wearable by features:", error);
    res.status(500).json({ message: error.message });
  }
};