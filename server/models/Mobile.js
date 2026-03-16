// server/models/Mobile.js
import mongoose from "mongoose";

const mobileSchema = new mongoose.Schema({
    type: { 
        type: String,
        enum: ['Smartphone', 'iPhone', 'Tablet', 'iPad', 'Foldable Phone', 'Feature Phone', 'Mobile Accessory'],
        required: true,
    },
    id: { type: String, required: true },
    customId: { type: String, unique: true },
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: [String], required: true },
    brand: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    additionalImages: { type: [String], default: [] },
    videos: [{
        title: { type: String, default: "" },
        url: { type: String, default: "" }
    }],
    keyFeatures: [{
        title: String,
        description: String
    }],
    specs: {
        // Display
        displaySize: { type: String }, // e.g., "6.7 inch"
        displayType: { type: String }, // e.g., "AMOLED", "LCD", "Retina"
        resolution: { type: String }, // e.g., "2778 x 1284 pixels"
        refreshRate: { type: String }, // e.g., "120Hz"
        brightness: { type: String }, // e.g., "1000 nits"
        hdr: { type: Boolean, default: false },
        
        // Processor
        processor: { type: String }, // e.g., "A16 Bionic", "Snapdragon 8 Gen 2"
        processorBrand: { type: String }, // e.g., "Apple", "Qualcomm", "MediaTek"
        processorCores: { type: String }, // e.g., "8-core"
        processorSpeed: { type: String }, // e.g., "3.46 GHz"
        gpu: { type: String }, // e.g., "Apple GPU", "Adreno 740"
        
        // Memory
        ram: { type: String }, // e.g., "8GB"
        ramType: { type: String }, // e.g., "LPDDR5"
        internalStorage: { type: String }, // e.g., "256GB"
        storageType: { type: String }, // e.g., "NVMe", "UFS 3.1"
        expandableStorage: { type: Boolean, default: false },
        maxStorage: { type: String }, // e.g., "1TB"
        
        // Camera
        rearCamera: { type: String }, // e.g., "48MP + 12MP + 12MP"
        rearCameraFeatures: { type: String }, // e.g., "OIS, PDAF, Night mode"
        frontCamera: { type: String }, // e.g., "12MP"
        frontCameraFeatures: { type: String }, // e.g., "Portrait mode, 4K video"
        videoRecording: { type: String }, // e.g., "4K @ 60fps"
        cameraFeatures: [{ type: String }], // ['Night mode', 'Portrait', 'Pro mode']
        
        // Battery
        batteryCapacity: { type: String }, // e.g., "4500 mAh"
        batteryType: { type: String }, // e.g., "Li-Ion", "Li-Po"
        fastCharging: { type: String }, // e.g., "45W"
        wirelessCharging: { type: Boolean, default: false },
        reverseCharging: { type: Boolean, default: false },
        chargingTime: { type: String }, // e.g., "0-100% in 60 min"
        
        // Connectivity
        network: [{ type: String }], // ['5G', '4G', '3G', '2G']
        simType: { type: String }, // 'Nano-SIM', 'eSIM'
        dualSim: { type: Boolean, default: false },
        wifi: { type: String }, // e.g., "Wi-Fi 6E"
        bluetooth: { type: String }, // e.g., "5.3"
        nfc: { type: Boolean, default: false },
        gps: { type: Boolean, default: true },
        usbType: { type: String }, // 'USB-C', 'Lightning'
        
        // OS
        operatingSystem: { type: String }, // 'iOS', 'Android', 'HarmonyOS'
        osVersion: { type: String }, // e.g., "iOS 17", "Android 14"
        
        // Sensors
        fingerprintSensor: { type: Boolean, default: false },
        fingerprintPosition: { type: String }, // 'Under display', 'Side-mounted', 'Rear'
        faceUnlock: { type: Boolean, default: false },
        accelerometer: { type: Boolean, default: true },
        gyroscope: { type: Boolean, default: true },
        proximity: { type: Boolean, default: true },
        compass: { type: Boolean, default: true },
        barometer: { type: Boolean, default: false },
        
        // Physical
        dimensions: { type: String }, // e.g., "160.7 x 77.6 x 7.9 mm"
        weight: { type: String }, // e.g., "240g"
        build: { type: String }, // e.g., "Glass front, glass back, aluminum frame"
        colors: [{ type: String }], // ['Black', 'White', 'Gold']
        waterResistant: { type: String }, // e.g., "IP68"
        
        // Audio
        speakers: { type: String }, // 'Stereo', 'Mono'
        headphoneJack: { type: Boolean, default: false },
        audioFeatures: [{ type: String }], // ['Dolby Atmos', 'Hi-Res Audio']
        
        // Additional Features
        stylus: { type: Boolean, default: false },
        desktopMode: { type: Boolean, default: false },
        samsungDex: { type: Boolean, default: false },
        applePencilSupport: { type: Boolean, default: false },
        keyboardSupport: { type: Boolean, default: false },
        
        // For Tablets/iPad
        applePencilGen: { type: String }, // '1st gen', '2nd gen', 'USB-C'
        magicKeyboardSupport: { type: Boolean, default: false },
        smartConnector: { type: Boolean, default: false },
    },
    otherTechnicalDetails: [
        {
            name: { type: String },
            value: { type: String },
        }
    ],
    specifications: [{
        title: String,
        specs: [{
          name: String,
          value: String
        }]
    }],
    notes: { type: [String], default: [] },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    category: [{ type: String, required: true }],
    inStock: { type: Boolean, default: true },
    popularity: { type: Number, default: 0 },
    originalPrice: { type: Number },
    discount: { type: Number, default: 0 },
    dateAdded: { type: Date, default: Date.now },
    bonuses: { type: String, default: "" },
    reviews: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            reviewerName: { type: String, required: true },
            rating: { type: Number, min: 1, max: 5, required: true },
            comment: { type: String },
            reviewImage: { type: String },
            date: { type: Date, default: Date.now },
        }
    ],
});

const Mobile = mongoose.model('Mobile', mobileSchema);
export default Mobile;