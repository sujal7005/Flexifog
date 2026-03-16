// server/models/Camera.js
import mongoose from "mongoose";

const cameraSchema = new mongoose.Schema({
    type: { 
        type: String,
        enum: ['DSLR', 'Mirrorless', 'Action Camera', 'Webcam', 'Point & Shoot', 'Security Camera', 'Lens', 'Camera Accessory'],
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
        // Sensor
        sensorType: { type: String }, // 'CMOS', 'CCD'
        sensorSize: { type: String }, // 'Full Frame', 'APS-C', 'Micro Four Thirds'
        megapixels: { type: String }, // '24.2MP'
        
        // Image
        imageProcessor: { type: String }, // 'DIGIC 8'
        isoRange: { type: String }, // '100-25600'
        shutterSpeed: { type: String }, // '30-1/4000 sec'
        continuousShooting: { type: String }, // '10 fps'
        
        // Video
        videoResolution: [{ type: String }], // ['4K', '1080p']
        videoFrameRates: { type: String }, // '24p, 30p, 60p'
        
        // Lens
        lensMount: { type: String }, // 'EF', 'RF', 'E-mount'
        focalLength: { type: String }, // '18-55mm'
        aperture: { type: String }, // 'f/3.5-5.6'
        
        // Focus
        autofocusPoints: { type: String }, // '45 points'
        faceDetection: { type: Boolean, default: false },
        eyeTracking: { type: Boolean, default: false },
        
        // Display
        screenSize: { type: String }, // '3.0"'
        screenResolution: { type: String }, // '1.04M dots'
        touchscreen: { type: Boolean, default: false },
        articulatingScreen: { type: Boolean, default: false }, // Flip/tilt screen
        
        // Viewfinder
        viewfinderType: { type: String }, // 'Optical', 'Electronic'
        viewfinderResolution: { type: String }, // '2.36M dots'
        
        // Connectivity
        wifi: { type: Boolean, default: false },
        bluetooth: { type: Boolean, default: false },
        nfc: { type: Boolean, default: false },
        hdmi: { type: Boolean, default: false },
        usbType: { type: String }, // 'USB-C', 'Micro USB'
        
        // Storage
        storageMedia: [{ type: String }], // ['SD', 'SDHC', 'SDXC']
        cardSlots: { type: Number, default: 1 },
        
        // Battery
        batteryType: { type: String }, // 'LP-E17'
        batteryLife: { type: String }, // '800 shots'
        
        // Physical
        weight: { type: String }, // '450g'
        dimensions: { type: String }, // '130 x 90 x 70mm'
        weatherSealed: { type: Boolean, default: false },
        
        // For Webcams
        resolution: { type: String }, // '1080p'
        frameRate: { type: String }, // '30fps'
        fieldOfView: { type: String }, // '78°'
        autofocus: { type: Boolean, default: false },
        lowLightCorrection: { type: Boolean, default: false },
        
        // For Action Cameras
        waterproof: { type: String }, // '10m'
        imageStabilization: { type: String }, // 'Electronic', 'Optical'
        builtInDisplay: { type: Boolean, default: false },
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

const Camera = mongoose.model('Camera', cameraSchema);
export default Camera;