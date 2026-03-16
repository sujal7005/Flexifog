// routes/categoryRoutes.js

import express from 'express';
import PrebuiltPC from '../models/PreBuildPC.js';
import OfficePC from "../models/Office-PC.js";
import RefurbishedLaptop from "../models/RefurbishedLaptop.js";
import MiniPCs from '../models/MiniPC.js';
import Display from '../models/Display.js';
import Mobile from '../models/Mobile.js';
import Audio from '../models/Audio.js';
import Camera from '../models/Camera.js';
import KitchenAppliance from '../models/KitchenAppliance.js';
import LaundryAppliance from '../models/LaundryAppliance.js';
import PCComponent from "../models/PCComponent.js";
import TVEntertainment from '../models/TVEntertainment.js';
import Wearable from '../models/Wearable.js';
import Accessory from '../models/Accessory.js';

const router = express.Router();

// Get all categories with product counts
router.get('/api/categories', async (req, res) => {
  try {
    const categories = [
      {
        id: 'mobiles',
        name: 'Mobiles & Tablets',
        icon: 'FaMobileAlt',
        color: 'from-indigo-500 to-indigo-600',
        description: 'Smartphones, tablets, and mobile accessories',
        featured: true,
        subcategories: [
          { name: 'Smartphones', path: '/mobiles', icon: 'FaMobileAlt' },
          { name: 'Feature Phones', path: '/mobiles/feature-phones', icon: 'FaMobileAlt' },
          { name: 'Tablets', path: '/tablets', icon: 'FaTablet' },
          { name: 'iPad', path: '/tablets/ipad', icon: 'FaApple' },
          { name: 'Android Tablets', path: '/tablets/android', icon: 'FaAndroid' },
          { name: 'Power Banks', path: '/mobiles/power-banks', icon: 'FaBolt' },
          { name: 'Mobile Cases', path: '/mobiles/cases', icon: 'FaMobileAlt' },
          { name: 'Screen Guards', path: '/mobiles/screen-guards', icon: 'FaEye' },
          { name: 'Mobile Chargers', path: '/mobiles/chargers', icon: 'FaPlug' },
          { name: 'Mobile Accessories', path: '/mobiles/accessories', icon: 'FaToolbox' },
        ]
      },
      {
        id: 'laptops',
        name: 'Laptops',
        icon: 'FaLaptop',
        color: 'from-purple-500 to-purple-600',
        description: 'Portable computing solutions for every need',
        featured: true,
        subcategories: [
          { name: 'Gaming Laptops', path: '/laptops/gaming', icon: 'FaGamepad' },
          { name: 'Ultrabooks', path: '/laptops/ultrabooks', icon: 'FaLaptop' },
          { name: 'Business Laptops', path: '/laptops/business', icon: 'FaBriefcase' },
          { name: 'Student Laptops', path: '/laptops/student', icon: 'FaGraduationCap' },
          { name: '2-in-1 Laptops', path: '/laptops/2-in-1', icon: 'FaTabletAlt' },
          { name: 'Refurbished Laptops', path: '/laptops/refurbished', icon: 'FaRecycle' },
          { name: 'MacBooks', path: '/laptops/macbook', icon: 'FaApple' },
          { name: 'Laptop Accessories', path: '/laptops/accessories', icon: 'FaToolbox' },
        ]
      },
      {
        id: 'tvs',
        name: 'TV & Entertainment',
        icon: 'FaTv',
        color: 'from-green-500 to-green-600',
        description: 'Televisions, projectors, and streaming devices',
        featured: true,
        subcategories: [
          { name: 'Smart TVs', path: '/tvs/smart', icon: 'FaTv' },
          { name: '4K Ultra HD TVs', path: '/tvs/4k', icon: 'FaTv' },
          { name: 'OLED TVs', path: '/tvs/oled', icon: 'FaTv' },
          { name: 'QLED TVs', path: '/tvs/qled', icon: 'FaTv' },
          { name: 'LED TVs', path: '/tvs/led', icon: 'FaTv' },
          { name: 'Gaming TVs', path: '/tvs/gaming', icon: 'FaGamepad' },
          { name: 'Projectors', path: '/projectors', icon: 'FaVideo' },
          { name: 'TV Stands & Mounts', path: '/tvs/accessories', icon: 'FaCouch' },
          { name: 'Streaming Devices', path: '/tvs/streaming', icon: 'FaWifi' },
          { name: 'Soundbars', path: '/audio/soundbars', icon: 'FaHeadphones' },
        ]
      },
      {
        id: 'displays',
        name: 'Monitors & Displays',
        icon: 'FaTv',
        color: 'from-teal-500 to-teal-600',
        description: 'High-quality monitors for work and play',
        featured: true,
        subcategories: [
          { name: 'Gaming Monitors', path: '/displays/gaming', icon: 'FaGamepad' },
          { name: 'Professional Monitors', path: '/displays/professional', icon: 'FaBriefcase' },
          { name: 'Ultrawide Monitors', path: '/displays/ultrawide', icon: 'FaTv' },
          { name: '4K Monitors', path: '/displays/4k', icon: 'FaTv' },
          { name: 'Portable Monitors', path: '/displays/portable', icon: 'FaMobileAlt' },
          { name: 'Touchscreen Monitors', path: '/displays/touchscreen', icon: 'FaEye' },
          { name: 'Monitor Accessories', path: '/displays/accessories', icon: 'FaToolbox' },
        ]
      },
      {
        id: 'kitchenAppliances',
        name: 'Kitchen Appliances',
        icon: 'FaUtensils',
        color: 'from-orange-500 to-orange-600',
        description: 'Microwaves, mixers, and kitchen essentials',
        featured: true,
        subcategories: [
          { name: 'Microwave Ovens', path: '/kitchen/microwaves', icon: 'FaClock' },
          { name: 'OTG', path: '/kitchen/otg', icon: 'FaRegClock' },
          { name: 'Air Fryers', path: '/kitchen/air-fryers', icon: 'FaWind' },
          { name: 'Induction Cooktops', path: '/kitchen/induction', icon: 'FaRegSun' },
          { name: 'Electric Kettles', path: '/kitchen/kettles', icon: 'FaTint' },
          { name: 'Mixer Grinders', path: '/kitchen/mixers', icon: 'FaBlender' },
          { name: 'Juicers', path: '/kitchen/juicers', icon: 'FaTint' },
          { name: 'Food Processors', path: '/kitchen/processors', icon: 'FaCogs' },
          { name: 'Dishwashers', path: '/kitchen/dishwashers', icon: 'FaWater' },
          { name: 'Chimneys', path: '/kitchen/chimneys', icon: 'FaFan' },
        ]
      },
      {
        id: 'laundry',
        name: 'Laundry & Cleaning',
        icon: 'FaWater',
        color: 'from-cyan-500 to-cyan-600',
        description: 'Washing machines, dryers, and cleaning appliances',
        featured: true,
        subcategories: [
          { name: 'Washing Machines', path: '/laundry', icon: 'FaWater' },
          { name: 'Front Load', path: '/laundry/front-load', icon: 'FaWater' },
          { name: 'Top Load', path: '/laundry/top-load', icon: 'FaWater' },
          { name: 'Washer-Dryer Combo', path: '/laundry/combo', icon: 'FaWater' },
          { name: 'Dryers', path: '/laundry/dryers', icon: 'FaWind' },
          { name: 'Vacuum Cleaners', path: '/cleaning/vacuum', icon: 'FaFan' },
          { name: 'Robot Vacuums', path: '/cleaning/robot-vacuum', icon: 'FaRobot' },
          { name: 'Steam Cleaners', path: '/cleaning/steam', icon: 'FaWater' },
          { name: 'Cleaning Accessories', path: '/cleaning/accessories', icon: 'FaToolbox' },
        ]
      },
      {
        id: 'components',
        name: 'PC Components',
        icon: 'FaMicrochip',
        color: 'from-yellow-500 to-yellow-600',
        description: 'Build your dream PC with top-quality components',
        featured: true,
        subcategories: [
          { name: 'Processors (CPU)', path: '/components/cpu', icon: 'FaMicrochip' },
          { name: 'Graphics Cards (GPU)', path: '/components/gpu', icon: 'FaMemory' },
          { name: 'Motherboards', path: '/components/motherboard', icon: 'FaMicrochip' },
          { name: 'RAM', path: '/components/ram', icon: 'FaMemory' },
          { name: 'SSD', path: '/components/ssd', icon: 'FaHdd' },
          { name: 'HDD', path: '/components/hdd', icon: 'FaHdd' },
          { name: 'Power Supplies', path: '/components/psu', icon: 'FaBolt' },
          { name: 'CPU Coolers', path: '/components/cooler', icon: 'FaFan' },
          { name: 'Computer Cases', path: '/components/case', icon: 'FaDesktop' },
        ]
      },
      {
        id: 'accessories',
        name: 'Accessories',
        icon: 'FaHeadphones',
        color: 'from-red-500 to-red-600',
        description: 'Enhance your setup with premium accessories',
        featured: true,
        subcategories: [
          { name: 'Keyboards', path: '/accessories/keyboards', icon: 'FaKeyboard' },
          { name: 'Mice', path: '/accessories/mice', icon: 'FaMouse' },
          { name: 'Headsets', path: '/accessories/headsets', icon: 'FaHeadphones' },
          { name: 'Speakers', path: '/accessories/speakers', icon: 'FaDesktop' },
          { name: 'Webcams', path: '/accessories/webcams', icon: 'FaCamera' },
          { name: 'Microphones', path: '/accessories/microphones', icon: 'FaMicrophone' },
          { name: 'USB Hubs', path: '/accessories/usb-hubs', icon: 'FaUsb' },
          { name: 'Cables', path: '/accessories/cables', icon: 'FaPlug' },
          { name: 'Adapters', path: '/accessories/adapters', icon: 'FaUsb' },
        ]
      },
      {
        id: 'gaming',
        name: 'Gaming',
        icon: 'FaGamepad',
        color: 'from-pink-500 to-pink-600',
        description: 'Gear up for victory with gaming equipment',
        featured: true,
        subcategories: [
          { name: 'Gaming PCs', path: '/gaming/pcs', icon: 'FaDesktop' },
          { name: 'Gaming Laptops', path: '/gaming/laptops', icon: 'FaLaptop' },
          { name: 'Gaming Monitors', path: '/gaming/monitors', icon: 'FaTv' },
          { name: 'Gaming Keyboards', path: '/gaming/keyboards', icon: 'FaKeyboard' },
          { name: 'Gaming Mice', path: '/gaming/mice', icon: 'FaMouse' },
          { name: 'Gaming Headsets', path: '/gaming/headsets', icon: 'FaHeadphones' },
          { name: 'Gaming Chairs', path: '/gaming/chairs', icon: 'FaChair' },
          { name: 'Controllers', path: '/gaming/controllers', icon: 'FaGamepad' },
        ]
      },
      {
        id: 'audio',
        name: 'Audio',
        icon: 'FaHeadphones',
        color: 'from-teal-500 to-teal-600',
        description: 'Premium sound solutions for every listener',
        featured: true,
        subcategories: [
          { name: 'Headphones', path: '/audio/headphones', icon: 'FaHeadphones' },
          { name: 'Wireless Earbuds', path: '/audio/earbuds', icon: 'FaHeadphones' },
          { name: 'True Wireless', path: '/audio/tws', icon: 'FaHeadphones' },
          { name: 'Bluetooth Speakers', path: '/audio/bluetooth', icon: 'FaBluetooth' },
          { name: 'Home Theaters', path: '/audio/home-theater', icon: 'FaDesktop' },
          { name: 'Soundbars', path: '/audio/soundbars', icon: 'FaDesktop' },
          { name: 'Studio Monitors', path: '/audio/studio-monitors', icon: 'FaDesktop' },
          { name: 'Amplifiers', path: '/audio/amplifiers', icon: 'FaMicrochip' },
          { name: 'DJ Equipment', path: '/audio/dj', icon: 'FaMusic' },
        ]
      },
      {
        id: 'cameras',
        name: 'Cameras',
        icon: 'FaCamera',
        color: 'from-cyan-500 to-cyan-600',
        description: 'Capture life\'s moments with precision',
        featured: true,
        subcategories: [
          { name: 'DSLR Cameras', path: '/cameras/dslr', icon: 'FaCamera' },
          { name: 'Mirrorless Cameras', path: '/cameras/mirrorless', icon: 'FaCamera' },
          { name: 'Action Cameras', path: '/cameras/action', icon: 'FaVideo' },
          { name: 'Point & Shoot', path: '/cameras/compact', icon: 'FaCamera' },
          { name: 'Professional Cameras', path: '/cameras/professional', icon: 'FaCamera' },
          { name: 'Camera Lenses', path: '/cameras/lenses', icon: 'FaCamera' },
          { name: 'Camera Accessories', path: '/cameras/accessories', icon: 'FaToolbox' },
          { name: 'Security Cameras', path: '/cameras/security', icon: 'FaEye' },
          { name: 'Drone Cameras', path: '/cameras/drones', icon: 'FaPlane' },
        ]
      },
      {
        id: 'wearables',
        name: 'Wearables',
        icon: 'FaClock',
        color: 'from-violet-500 to-violet-600',
        description: 'Tech on the go - smartwatches and fitness trackers',
        featured: true,
        subcategories: [
          { name: 'Smartwatches', path: '/wearables/smartwatches', icon: 'FaClock' },
          { name: 'Fitness Trackers', path: '/wearables/fitness', icon: 'FaHeartbeat' },
          { name: 'VR Headsets', path: '/wearables/vr', icon: 'FaGlasses' },
          { name: 'AR Glasses', path: '/wearables/ar', icon: 'FaEye' },
          { name: 'Smart Rings', path: '/wearables/rings', icon: 'FaGem' },
          { name: 'Smart Glasses', path: '/wearables/glasses', icon: 'FaGlasses' },
        ]
      }
    ];

    // Get product counts for each category using the correct model names
    const [
      prebuiltCount,
      officeCount,
      miniCount,
      refurbishedCount,
      displayCount,
      mobileCount,
      audioCount,
      cameraCount,
      kitchenCount,
      laundryCount,
      componentCount,
      tvCount,
      wearableCount,
      accessoryCount
    ] = await Promise.all([
      PrebuiltPC.countDocuments(),
      OfficePC.countDocuments(),
      MiniPCs.countDocuments(),
      RefurbishedLaptop.countDocuments(),
      Display.countDocuments(),
      Mobile.countDocuments(),
      Audio.countDocuments(),
      Camera.countDocuments(),
      KitchenAppliance.countDocuments(),
      LaundryAppliance.countDocuments(),
      PCComponent.countDocuments(),
      TVEntertainment.countDocuments(),
      Wearable.countDocuments(),
      Accessory.countDocuments()
    ]);

    // Calculate laptop total
    const laptopTotal = prebuiltCount + officeCount + miniCount + refurbishedCount;

    // Update product counts for categories using the correct variable names
    categories[0].productCount = mobileCount + accessoryCount; // Mobiles
    categories[1].productCount = laptopTotal; // Laptops
    categories[2].productCount = tvCount; // TV & Entertainment
    categories[3].productCount = displayCount; // Monitors
    categories[4].productCount = kitchenCount; // Kitchen Appliances
    categories[5].productCount = laundryCount; // Laundry
    categories[6].productCount = componentCount; // PC Components
    categories[7].productCount = accessoryCount; // Accessories
    categories[8].productCount = laptopTotal; // Gaming
    categories[9].productCount = audioCount; // Audio
    categories[10].productCount = cameraCount; // Cameras
    categories[11].productCount = wearableCount; // Wearables

    // Calculate total products
    const totalProducts = 
      mobileCount + laptopTotal + tvCount + displayCount + 
      kitchenCount + laundryCount + componentCount + accessoryCount + 
      audioCount + cameraCount + wearableCount;

    res.json({
      success: true,
      categories,
      totals: {
        totalProducts,
        totalCategories: categories.length,
        totalSubcategories: categories.reduce((acc, cat) => acc + cat.subcategories.length, 0)
      }
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET accessories by subcategory (THIS MUST COME BEFORE THE :ID ROUTE)
router.get('/api/accessories/subcategory/:subcategory', async (req, res) => {
  try {
    const { subcategory } = req.params;
    
    // Validate that the subcategory exists in your enum
    const validSubcategories = [
      'keyboards', 'mice', 'mouse-pads', 'stylus', 'graphic-tablets', 'scanners', 
      'barcode-scanners', 'biometric', 'headphones', 'earbuds', 'speakers', 
      'microphones', 'soundbars', 'amplifiers', 'dac', 'studio-monitors',
      'external-ssd', 'external-hdd', 'usb-drives', 'memory-cards', 'card-readers', 
      'nas', 'docking-stations', 'routers', 'switches', 'modems', 'access-points', 
      'network-cards', 'cables', 'adapters', 'range-extenders', 'usb-cables', 
      'hdmi-cables', 'displayport-cables', 'audio-cables', 'power-cables', 
      'converters', 'splitters', 'case-fans', 'cpu-coolers', 'liquid-cooling', 
      'thermal-paste', 'fan-controllers', 'ups', 'power-strips', 'surge-protectors', 
      'power-adapters', 'batteries', 'chargers', 'gaming-keyboards', 'gaming-mice', 
      'gaming-headsets', 'gaming-controllers', 'gaming-chairs', 'streaming-gear'
    ];
    
    if (!validSubcategories.includes(subcategory)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid subcategory'
      });
    }
    
    const accessories = await Accessory.find({ 
      subcategory: subcategory,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: accessories.length,
      data: accessories
    });
  } catch (error) {
    console.error('Error fetching accessories by subcategory:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET audio products by subcategory (THIS MUST COME BEFORE THE :ID ROUTE)
router.get('/api/audio/subcategory/:subcategory', async (req, res) => {
  try {
    const { subcategory } = req.params;
    
    // Validate audio subcategories
    const validSubcategories = [
      'headphones', 'earbuds', 'tws', 'bluetooth', 'home-theater', 
      'soundbars', 'studio-monitors', 'amplifiers', 'dj'
    ];
    
    if (!validSubcategories.includes(subcategory)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid audio subcategory'
      });
    }
    
    const audioProducts = await Audio.find({ 
      subcategory: subcategory,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: audioProducts.length,
      data: audioProducts
    });
  } catch (error) {
    console.error('Error fetching audio products by subcategory:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;