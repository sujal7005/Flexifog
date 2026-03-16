// server/controllers/pcComponentController.js
import PCComponent from "../models/PCComponent.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all PC components
export const getPCComponents = async (req, res) => {
  const { 
    q, 
    type, 
    brand, 
    price, 
    socket,
    chipset,
    ramType,
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
        { "specs.socket": { $regex: regex } },
        { "specs.chipset": { $regex: regex } },
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

    // Filter by socket
    if (socket && socket !== "all") {
      query.$or = [
        { "specs.socket": socket },
        { "specs.cpuSocket": socket }
      ];
    }

    // Filter by chipset
    if (chipset && chipset !== "all") {
      query["specs.chipset"] = chipset;
    }

    // Filter by RAM type
    if (ramType && ramType !== "all") {
      query["specs.ramType"] = ramType;
    }

    // Filter by features
    if (features && features !== "all") {
      const featureArray = features.split(',');
      featureArray.forEach(feature => {
        if (feature.includes('Wattage:')) {
          const wattage = feature.replace('Wattage:', '').trim();
          query["specs.wattage"] = Number(wattage);
        } else if (feature.includes('Memory:')) {
          const memory = feature.replace('Memory:', '').trim();
          query["specs.memory"] = { $regex: memory, $options: 'i' };
        } else {
          switch(feature) {
            case 'WiFi':
              query["specs.wifi"] = true;
              break;
            case 'Bluetooth':
              query["specs.bluetooth"] = true;
              break;
            case 'RGB Lighting':
              query["specs.rgb"] = true;
              break;
            case 'Fanless':
              query["specs.fanless"] = true;
              break;
            case 'Modular':
              query["specs.modular"] = { $in: ['Full', 'Semi'] };
              break;
            case 'Overclockable':
              query["specs.unlocked"] = true;
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
    const total = await PCComponent.countDocuments(query);

    // Fetch products with sorting
    const components = await PCComponent.find(query)
      .sort({ popularity: -1, dateAdded: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      success: true,
      products: components,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalProducts: total,
        productsPerPage: limitNumber
      }
    });
  } catch (error) {
    console.error("Error fetching PC components:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single PC component by ID
export const getPCComponentById = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = new mongoose.Types.ObjectId(id);
    } else {
      query.productId = id;
    }

    const component = await PCComponent.findOne(query);
    
    if (!component) {
      return res.status(404).json({ message: 'PC component not found' });
    }

    res.json({
      success: true,
      product: component
    });
  } catch (error) {
    console.error("Error fetching PC component:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create new PC component (admin only)
export const createPCComponent = async (req, res) => {
  try {
    const {
      type, name, price, category, description, popularity,
      brand, stock, code, condition, discount, bonuses, dateAdded,
      keyFeatures, specifications, notes, originalPrice,
      
      // Common
      series, model, releaseDate, color, rgb,
      
      // CPU Specific
      socket, cores, threads, baseClock, boostClock, cache, tdp,
      integratedGraphics, unlocked, maxMemorySupport, memoryType, pcieVersion,
      
      // GPU Specific
      chipset, memory, memoryType: gpuMemoryType, memoryInterface,
      coreClock, boostClock: gpuBoostClock, cudaCores,
      rayTracingCores, tensorCores, tdp: gpuTdp, recommendedPsu,
      hdmiPorts, displayPorts, length, width, slots, cooling,
      
      // RAM Specific
      ramType, capacity, speed, casLatency, timing, voltage,
      heatSpreader, modules,
      
      // Storage Specific
      formFactor, interface: storageInterface, capacity: storageCapacity,
      nandType, readSpeed, writeSpeed, randomRead, randomWrite,
      endurance, dramCache, hddRpm,
      
      // Motherboard Specific
      cpuSocket, chipset: moboChipset, formFactor: moboFormFactor,
      memoryType: moboMemoryType, memorySlots, maxMemory,
      pcieSlots, m2Slots, sataPorts, usbPorts, audioChip,
      ethernet, wifi, bluetooth,
      
      // Power Supply Specific
      wattage, efficiency, modular, fanSize: psuFanSize,
      pcieConnectors, sataConnectors, molexConnectors,
      
      // Cooler Specific
      coolerType, fanSize: coolerFanSize, fanSpeed, noiseLevel,
      airflow, radiatorSize, socketCompatibility, height,
      
      // Case Specific
      caseType, motherboardSupport, psuSupport, maxGpuLength,
      maxCpuHeight, includedFans, fanSupport, radiatorSupport,
      driveBays, ioPorts, temperedGlass, psuShroud, cableManagement,
      
      // General
      warranty, dimensions, weight,
      
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

    // Handle uploaded files
    const files = req.files || {};
    const mainImageFiles = files.image || [];
    const additionalImageFiles = files.additionalImages || [];

    const mainImageUrls = mainImageFiles.map(file => file.path);
    const additionalImageUrls = additionalImageFiles.map(file => file.path);

    if (mainImageUrls.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    // Build product data based on component type
    const productData = {
      id: productId,
      productId,
      customId,
      type: type || 'Component',
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
        // Common
        series: series || '',
        model: model || '',
        releaseDate: releaseDate || '',
        color: color || '',
        rgb: rgb === 'true',
        
        // CPU Specific
        socket: socket || '',
        cores: cores ? Number(cores) : undefined,
        threads: threads ? Number(threads) : undefined,
        baseClock: baseClock || '',
        boostClock: boostClock || '',
        cache: cache || '',
        tdp: tdp ? Number(tdp) : (gpuTdp ? Number(gpuTdp) : undefined),
        integratedGraphics: integratedGraphics === 'true',
        unlocked: unlocked === 'true',
        maxMemorySupport: maxMemorySupport || '',
        memoryType: memoryType || gpuMemoryType || moboMemoryType || '',
        pcieVersion: pcieVersion || '',
        
        // GPU Specific
        chipset: chipset || moboChipset || '',
        memory: memory || '',
        memoryInterface: memoryInterface || '',
        coreClock: coreClock || '',
        boostClock: gpuBoostClock || '',
        cudaCores: cudaCores ? Number(cudaCores) : undefined,
        rayTracingCores: rayTracingCores ? Number(rayTracingCores) : undefined,
        tensorCores: tensorCores ? Number(tensorCores) : undefined,
        recommendedPsu: recommendedPsu || '',
        hdmiPorts: hdmiPorts ? Number(hdmiPorts) : undefined,
        displayPorts: displayPorts ? Number(displayPorts) : undefined,
        length: length || '',
        width: width || '',
        slots: slots ? Number(slots) : undefined,
        cooling: cooling || '',
        
        // RAM Specific
        ramType: ramType || '',
        capacity: capacity || storageCapacity || '',
        speed: speed || '',
        casLatency: casLatency || '',
        timing: timing || '',
        voltage: voltage || '',
        heatSpreader: heatSpreader === 'true',
        modules: modules ? Number(modules) : undefined,
        
        // Storage Specific
        formFactor: formFactor || moboFormFactor || '',
        interface: storageInterface || '',
        nandType: nandType || '',
        readSpeed: readSpeed || '',
        writeSpeed: writeSpeed || '',
        randomRead: randomRead || '',
        randomWrite: randomWrite || '',
        endurance: endurance || '',
        dramCache: dramCache === 'true',
        hddRpm: hddRpm ? Number(hddRpm) : undefined,
        
        // Motherboard Specific
        cpuSocket: cpuSocket || socket || '',
        chipset: chipset || moboChipset || '',
        formFactor: formFactor || moboFormFactor || caseType || '',
        memorySlots: memorySlots ? Number(memorySlots) : undefined,
        maxMemory: maxMemory || maxMemorySupport || '',
        pcieSlots: pcieSlots || '',
        m2Slots: m2Slots ? Number(m2Slots) : undefined,
        sataPorts: sataPorts ? Number(sataPorts) : undefined,
        usbPorts: usbPorts || '',
        audioChip: audioChip || '',
        ethernet: ethernet || '',
        wifi: wifi === 'true',
        bluetooth: bluetooth === 'true',
        
        // Power Supply Specific
        wattage: wattage ? Number(wattage) : undefined,
        efficiency: efficiency || '',
        modular: modular || '',
        fanSize: psuFanSize || coolerFanSize || '',
        pcieConnectors: pcieConnectors || '',
        sataConnectors: sataConnectors ? Number(sataConnectors) : undefined,
        molexConnectors: molexConnectors ? Number(molexConnectors) : undefined,
        
        // Cooler Specific
        coolerType: coolerType || '',
        fanSpeed: fanSpeed || '',
        noiseLevel: noiseLevel || '',
        airflow: airflow || '',
        radiatorSize: radiatorSize || '',
        socketCompatibility: socketCompatibility || '',
        height: height || maxCpuHeight || '',
        
        // Case Specific
        caseType: caseType || '',
        motherboardSupport: motherboardSupport || '',
        psuSupport: psuSupport || '',
        maxGpuLength: maxGpuLength || length || '',
        maxCpuHeight: maxCpuHeight || height || '',
        includedFans: includedFans || '',
        fanSupport: fanSupport || '',
        radiatorSupport: radiatorSupport || '',
        driveBays: driveBays || '',
        ioPorts: ioPorts || '',
        temperedGlass: temperedGlass === 'true',
        psuShroud: psuShroud === 'true',
        cableManagement: cableManagement !== 'false',
        
        // General
        warranty: warranty || '',
        dimensions: dimensions || '',
        weight: weight || '',
      }
    };

    // Remove undefined values from specs
    Object.keys(productData.specs).forEach(key => 
      productData.specs[key] === undefined && delete productData.specs[key]
    );

    const newComponent = new PCComponent(productData);
    await newComponent.save();

    res.status(201).json({
      success: true,
      message: 'PC component created successfully',
      product: newComponent
    });
  } catch (error) {
    console.error("Error creating PC component:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update PC component (admin only)
export const updatePCComponent = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const component = await PCComponent.findOne(query);
    if (!component) {
      return res.status(404).json({ message: 'PC component not found' });
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

    // Handle numeric fields
    const numericFields = [
      'price', 'originalPrice', 'discount', 'popularity', 
      'cores', 'threads', 'tdp', 'cudaCores', 'rayTracingCores', 'tensorCores',
      'hdmiPorts', 'displayPorts', 'slots', 'modules', 'memorySlots', 'm2Slots',
      'sataPorts', 'wattage', 'sataConnectors', 'molexConnectors', 'hddRpm'
    ];
    
    numericFields.forEach(field => {
      if (updates[field] !== undefined) {
        updates[field] = Number(updates[field]);
      }
    });

    // Handle boolean fields
    const booleanFields = [
      'rgb', 'integratedGraphics', 'unlocked', 'heatSpreader', 'dramCache',
      'wifi', 'bluetooth', 'temperedGlass', 'psuShroud', 'cableManagement'
    ];
    
    booleanFields.forEach(field => {
      if (updates[field] !== undefined) {
        updates[field] = updates[field] === 'true' || updates[field] === true;
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
        ...(component.additionalImages || []),
        ...additionalImageFiles.map(file => file.path)
      ];
    }

    const updatedComponent = await PCComponent.findOneAndUpdate(
      query,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'PC component updated successfully',
      product: updatedComponent
    });
  } catch (error) {
    console.error("Error updating PC component:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete PC component (admin only)
export const deletePCComponent = async (req, res) => {
  const { id } = req.params;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const component = await PCComponent.findOne(query);
    if (!component) {
      return res.status(404).json({ message: 'PC component not found' });
    }

    // Delete associated images
    const allImages = [
      ...(component.image || []),
      ...(component.additionalImages || [])
    ];

    allImages.forEach((imagePath) => {
      const filename = path.basename(imagePath);
      const fullPath = path.resolve('uploads', filename);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    await PCComponent.deleteOne(query);

    res.json({
      success: true,
      message: 'PC component deleted successfully'
    });
  } catch (error) {
    console.error("Error deleting PC component:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add review to PC component
export const addPCComponentReview = async (req, res) => {
  const { id } = req.params;
  const { reviewerName, rating, comment } = req.body;

  try {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.productId = id;
    }

    const component = await PCComponent.findOne(query);
    if (!component) {
      return res.status(404).json({ message: 'PC component not found' });
    }

    const reviewImage = req.file ? req.file.path : null;

    const newReview = {
      reviewerName,
      rating: Number(rating),
      comment,
      reviewImage,
      date: new Date()
    };

    component.reviews.push(newReview);
    await component.save();

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

// Get PC components by brand
export const getPCComponentsByBrand = async (req, res) => {
  const { brand } = req.params;

  try {
    const components = await PCComponent.find({ brand: { $regex: new RegExp(brand, 'i') } })
      .sort({ popularity: -1 });

    res.json({
      success: true,
      products: components,
      count: components.length
    });
  } catch (error) {
    console.error("Error fetching PC components by brand:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get PC components by type
export const getPCComponentsByType = async (req, res) => {
  const { type } = req.params;

  try {
    const components = await PCComponent.find({ type: { $regex: new RegExp(type, 'i') } })
      .sort({ popularity: -1 });

    res.json({
      success: true,
      products: components,
      count: components.length
    });
  } catch (error) {
    console.error("Error fetching PC components by type:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get PC components by socket
export const getPCComponentsBySocket = async (req, res) => {
  const { socket } = req.params;

  try {
    const components = await PCComponent.find({
      $or: [
        { "specs.socket": socket },
        { "specs.cpuSocket": socket }
      ]
    }).sort({ popularity: -1 });

    res.json({
      success: true,
      products: components,
      count: components.length
    });
  } catch (error) {
    console.error("Error fetching PC components by socket:", error);
    res.status(500).json({ message: error.message });
  }
};