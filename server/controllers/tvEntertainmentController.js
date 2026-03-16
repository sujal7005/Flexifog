// server/controllers/tvEntertainmentController.js
import TVEntertainment from "../models/TVEntertainment.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all TV & entertainment products
export const getTVProducts = async (req, res) => {
  const { 
    q, 
    type, 
    brand, 
    price, 
    resolution,
    screenSize,
    technology,
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
        { "specs.displayTechnology": { $regex: regex } },
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

    // Filter by resolution
    if (resolution && resolution !== "all") {
      const resolutionRegex = new RegExp(resolution, 'i');
      query.$or = [
        { "specs.resolution": resolutionRegex },
        { name: resolutionRegex },
        { description: resolutionRegex }
      ];
    }

    // Filter by screen size
    if (screenSize && screenSize !== "all") {
      let sizeQuery = {};
      
      if (screenSize === 'Under 32"') {
        sizeQuery = { "specs.screenSize": { $lt: 32 } };
      } else if (screenSize === '32" - 42"') {
        sizeQuery = { "specs.screenSize": { $gte: 32, $lt: 43 } };
      } else if (screenSize === '43" - 54"') {
        sizeQuery = { "specs.screenSize": { $gte: 43, $lt: 55 } };
      } else if (screenSize === '55" - 64"') {
        sizeQuery = { "specs.screenSize": { $gte: 55, $lt: 65 } };
      } else if (screenSize === '65" - 74"') {
        sizeQuery = { "specs.screenSize": { $gte: 65, $lt: 75 } };
      } else if (screenSize === '75" and above') {
        sizeQuery = { "specs.screenSize": { $gte: 75 } };
      }
      
      query = { ...query, ...sizeQuery };
    }

    // Filter by display technology
    if (technology && technology !== "all") {
      query["specs.displayTechnology"] = { $regex: new RegExp(technology, 'i') };
    }

    // Filter by features
    if (features && features !== "all") {
      const featureArray = features.split(',');
      featureArray.forEach(feature => {
        switch(feature) {
          case 'Smart TV':
            query["specs.smartPlatform"] = { $exists: true, $ne: "" };
            break;
          case '4K':
            query.$or = [
              { "specs.resolution": { $regex: /4k/i } },
              { name: { $regex: /4k/i } },
              { description: { $regex: /4k/i } }
            ];
            break;
          case '8K':
            query.$or = [
              { "specs.resolution": { $regex: /8k/i } },
              { name: { $regex: /8k/i } },
              { description: { $regex: /8k/i } }
            ];
            break;
          case 'HDR':
            query["specs.hdrSupport"] = { $exists: true, $ne: "" };
            break;
          case 'Dolby Atmos':
            query["specs.audioTechnologies"] = { $in: ['Dolby Atmos'] };
            break;
          case '120Hz Refresh Rate':
            query["specs.refreshRate"] = { $regex: /120/i };
            break;
          case 'Gaming Mode':
            query["specs.gameMode"] = true;
            break;
          case 'VRR':
            query["specs.vrrSupport"] = true;
            break;
          case 'HDMI 2.1':
            query["specs.hdmiVersion"] = { $regex: /2.1/i };
            break;
          case 'WiFi':
            query["specs.wifi"] = true;
            break;
          case 'Bluetooth':
            query["specs.bluetooth"] = true;
            break;
          case 'Voice Control':
            query["specs.voiceAssistant"] = { $exists: true, $ne: "" };
            break;
          case 'Wall Mountable':
            query["specs.vesaMount"] = { $exists: true, $ne: "" };
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
    const total = await TVEntertainment.countDocuments(query);

    // Fetch products with sorting
    const tvProducts = await TVEntertainment.find(query)
      .sort({ popularity: -1, dateAdded: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      success: true,
      products: tvProducts,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalProducts: total,
        productsPerPage: limitNumber
      }
    });
  } catch (error) {
    console.error("Error fetching TV products:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single TV product by ID
export const getTVProductById = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = new mongoose.Types.ObjectId(id);
    } else {
      query.productId = id;
    }

    const product = await TVEntertainment.findOne(query);
    
    if (!product) {
      return res.status(404).json({ message: 'TV product not found' });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Error fetching TV product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create new TV product (admin only)
export const createTVProduct = async (req, res) => {
  try {
    const {
      type, name, price, category, description, popularity,
      brand, stock, code, condition, discount, bonuses, dateAdded,
      keyFeatures, specifications, notes, originalPrice,
      
      // Display Specifications
      screenSize, resolution, displayTechnology, refreshRate,
      brightness, contrastRatio, hdrSupport, viewingAngle, responseTime,
      
      // Audio Specifications
      audioOutput, speakerConfiguration, audioTechnologies,
      
      // Smart Features
      smartPlatform, voiceAssistant, streamingApps,
      screenMirroring, airplaySupport,
      
      // Connectivity
      hdmiPorts, hdmiVersion, usbPorts, usbVersion,
      ethernetPort, wifi, wifiStandard, bluetooth, bluetoothVersion,
      opticalAudioOut, headphoneJack,
      
      // Gaming Features
      vrrSupport, allmSupport, gameMode, gsyncSupport, freesyncSupport,
      
      // Physical
      dimensionsWithStand, dimensionsWithoutStand,
      weightWithStand, weightWithoutStand, vesaMount,
      color, bezelType, standType,
      
      // Power
      powerConsumption, standbyPower, voltageRange,
      
      // Projector Specific
      projectorType, brightnessLumens, throwRatio, lampLife, projectionSize,
      
      // Soundbar Specific
      soundbarChannels, subwooferIncluded, subwooferType, wallMountable,
      
      // Streaming Device Specific
      streamingDeviceType, remoteType, storage, ram,
      
      // General
      warranty, includedAccessories, energyRating, yearReleased,
      
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

    let parsedAudioTechnologies = [];
    if (audioTechnologies) {
      try {
        parsedAudioTechnologies = typeof audioTechnologies === 'string' ? JSON.parse(audioTechnologies) : 
                                  (Array.isArray(audioTechnologies) ? audioTechnologies : [audioTechnologies]);
      } catch (e) {
        parsedAudioTechnologies = audioTechnologies ? [audioTechnologies] : [];
      }
    }

    let parsedStreamingApps = [];
    if (streamingApps) {
      try {
        parsedStreamingApps = typeof streamingApps === 'string' ? JSON.parse(streamingApps) : 
                             (Array.isArray(streamingApps) ? streamingApps : [streamingApps]);
      } catch (e) {
        parsedStreamingApps = streamingApps ? [streamingApps] : [];
      }
    }

    let parsedIncludedAccessories = [];
    if (includedAccessories) {
      try {
        parsedIncludedAccessories = typeof includedAccessories === 'string' ? JSON.parse(includedAccessories) : 
                                   (Array.isArray(includedAccessories) ? includedAccessories : [includedAccessories]);
      } catch (e) {
        parsedIncludedAccessories = includedAccessories ? [includedAccessories] : [];
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
      type: type || 'Television',
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
        // Display Specifications
        screenSize: screenSize || '',
        resolution: resolution || '',
        displayTechnology: displayTechnology || '',
        refreshRate: refreshRate || '',
        brightness: brightness || '',
        contrastRatio: contrastRatio || '',
        hdrSupport: hdrSupport || '',
        viewingAngle: viewingAngle || '',
        responseTime: responseTime || '',
        
        // Audio Specifications
        audioOutput: audioOutput || '',
        speakerConfiguration: speakerConfiguration || '',
        audioTechnologies: parsedAudioTechnologies,
        
        // Smart Features
        smartPlatform: smartPlatform || '',
        voiceAssistant: voiceAssistant || '',
        streamingApps: parsedStreamingApps,
        screenMirroring: screenMirroring === 'true',
        airplaySupport: airplaySupport === 'true',
        
        // Connectivity
        hdmiPorts: hdmiPorts ? Number(hdmiPorts) : undefined,
        hdmiVersion: hdmiVersion || '',
        usbPorts: usbPorts ? Number(usbPorts) : undefined,
        usbVersion: usbVersion || '',
        ethernetPort: ethernetPort !== 'false',
        wifi: wifi !== 'false',
        wifiStandard: wifiStandard || '',
        bluetooth: bluetooth !== 'false',
        bluetoothVersion: bluetoothVersion || '',
        opticalAudioOut: opticalAudioOut === 'true',
        headphoneJack: headphoneJack === 'true',
        
        // Gaming Features
        vrrSupport: vrrSupport === 'true',
        allmSupport: allmSupport === 'true',
        gameMode: gameMode === 'true',
        gsyncSupport: gsyncSupport === 'true',
        freesyncSupport: freesyncSupport === 'true',
        
        // Physical
        dimensionsWithStand: dimensionsWithStand || '',
        dimensionsWithoutStand: dimensionsWithoutStand || '',
        weightWithStand: weightWithStand || '',
        weightWithoutStand: weightWithoutStand || '',
        vesaMount: vesaMount || '',
        color: color || '',
        bezelType: bezelType || '',
        standType: standType || '',
        
        // Power
        powerConsumption: powerConsumption || '',
        standbyPower: standbyPower || '',
        voltageRange: voltageRange || '',
        
        // Projector Specific
        projectorType: projectorType || '',
        brightnessLumens: brightnessLumens || '',
        throwRatio: throwRatio || '',
        lampLife: lampLife || '',
        projectionSize: projectionSize || '',
        
        // Soundbar Specific
        soundbarChannels: soundbarChannels || '',
        subwooferIncluded: subwooferIncluded === 'true',
        subwooferType: subwooferType || '',
        wallMountable: wallMountable !== 'false',
        
        // Streaming Device Specific
        streamingDeviceType: streamingDeviceType || '',
        remoteType: remoteType || '',
        storage: storage || '',
        ram: ram || '',
        
        // General
        warranty: warranty || '',
        includedAccessories: parsedIncludedAccessories,
        energyRating: energyRating || '',
        yearReleased: yearReleased ? Number(yearReleased) : undefined,
      }
    };

    // Remove undefined values from specs
    Object.keys(productData.specs).forEach(key => 
      productData.specs[key] === undefined && delete productData.specs[key]
    );

    const newProduct = new TVEntertainment(productData);
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'TV product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error("Error creating TV product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update TV product (admin only)
export const updateTVProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const product = await TVEntertainment.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'TV product not found' });
    }

    const updates = { ...req.body };

    // Parse JSON fields
    ['keyFeatures', 'specifications', 'otherTechnicalDetails', 'notes', 'audioTechnologies', 'streamingApps', 'includedAccessories'].forEach(field => {
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
      'screenMirroring', 'airplaySupport', 'ethernetPort', 'wifi', 'bluetooth',
      'opticalAudioOut', 'headphoneJack', 'vrrSupport', 'allmSupport', 'gameMode',
      'gsyncSupport', 'freesyncSupport', 'subwooferIncluded', 'wallMountable'
    ];
    
    booleanFields.forEach(field => {
      if (updates[field] !== undefined) {
        updates.specs = updates.specs || {};
        updates.specs[field] = updates[field] === 'true' || updates[field] === true;
      }
    });

    // Handle numeric fields
    const numericFields = [
      'price', 'originalPrice', 'discount', 'popularity', 'hdmiPorts', 'usbPorts', 'yearReleased'
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

    const updatedProduct = await TVEntertainment.findOneAndUpdate(
      query,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'TV product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error("Error updating TV product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete TV product (admin only)
export const deleteTVProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const product = await TVEntertainment.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'TV product not found' });
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

    await TVEntertainment.deleteOne(query);

    res.json({
      success: true,
      message: 'TV product deleted successfully'
    });
  } catch (error) {
    console.error("Error deleting TV product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add review to TV product
export const addTVReview = async (req, res) => {
  const { id } = req.params;
  const { reviewerName, rating, comment } = req.body;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const product = await TVEntertainment.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'TV product not found' });
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

// Get TV products by brand
export const getTVByBrand = async (req, res) => {
  const { brand } = req.params;

  try {
    const products = await TVEntertainment.find({ brand: { $regex: new RegExp(brand, 'i') } })
      .sort({ popularity: -1 });

    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error("Error fetching TV by brand:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get TV products by type
export const getTVByType = async (req, res) => {
  const { type } = req.params;

  try {
    const products = await TVEntertainment.find({ type: { $regex: new RegExp(type, 'i') } })
      .sort({ popularity: -1 });

    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error("Error fetching TV by type:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get TV products by resolution
export const getTVByResolution = async (req, res) => {
  const { resolution } = req.params;

  try {
    const products = await TVEntertainment.find({
      $or: [
        { "specs.resolution": { $regex: new RegExp(resolution, 'i') } },
        { name: { $regex: new RegExp(resolution, 'i') } },
        { description: { $regex: new RegExp(resolution, 'i') } }
      ]
    }).sort({ popularity: -1 });

    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error("Error fetching TV by resolution:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get TV products by screen size range
export const getTVByScreenSize = async (req, res) => {
  const { min, max } = req.query;

  try {
    let query = {};
    
    if (min && max) {
      query["specs.screenSize"] = { $gte: Number(min), $lte: Number(max) };
    } else if (min) {
      query["specs.screenSize"] = { $gte: Number(min) };
    } else if (max) {
      query["specs.screenSize"] = { $lte: Number(max) };
    }

    const products = await TVEntertainment.find(query).sort({ "specs.screenSize": -1 });

    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error("Error fetching TV by screen size:", error);
    res.status(500).json({ message: error.message });
  }
};