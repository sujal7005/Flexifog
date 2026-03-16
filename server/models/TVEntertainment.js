// server/models/TVEntertainment.js
import mongoose from "mongoose";

const tvEntertainmentSchema = new mongoose.Schema({
    type: { 
        type: String,
        enum: ['Television', 'OLED TV', 'QLED TV', 'LED TV', 'Projector', 'Soundbar', 'Home Theater', 'Streaming Device', 'Display'],
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
        // Display Specifications
        screenSize: { type: String }, // e.g., "55 inch", "65 inch"
        resolution: { type: String }, // e.g., "4K Ultra HD", "8K", "Full HD"
        displayTechnology: { type: String }, // e.g., "OLED", "QLED", "LED", "LCD"
        refreshRate: { type: String }, // e.g., "120Hz", "60Hz"
        brightness: { type: String }, // e.g., "1000 nits"
        contrastRatio: { type: String }, // e.g., "5000:1"
        hdrSupport: { type: String }, // e.g., "HDR10, Dolby Vision, HLG"
        viewingAngle: { type: String }, // e.g., "178 degrees"
        responseTime: { type: String }, // e.g., "1ms"
        
        // Audio Specifications
        audioOutput: { type: String }, // e.g., "40W", "60W"
        speakerConfiguration: { type: String }, // e.g., "2.1 Channel", "5.1 Channel"
        audioTechnologies: [{ type: String }], // e.g., ["Dolby Atmos", "DTS:X", "Dolby Digital"]
        
        // Smart Features
        smartPlatform: { type: String }, // e.g., "webOS", "Tizen", "Android TV", "Roku"
        voiceAssistant: { type: String }, // e.g., "Alexa", "Google Assistant", "Bixby"
        streamingApps: [{ type: String }], // e.g., ["Netflix", "Prime Video", "YouTube", "Disney+"]
        screenMirroring: { type: Boolean, default: false },
        airplaySupport: { type: Boolean, default: false },
        
        // Connectivity
        hdmiPorts: { type: Number },
        hdmiVersion: { type: String }, // e.g., "2.1", "2.0"
        usbPorts: { type: Number },
        usbVersion: { type: String }, // e.g., "3.0", "2.0"
        ethernetPort: { type: Boolean, default: true },
        wifi: { type: Boolean, default: true },
        wifiStandard: { type: String }, // e.g., "WiFi 6", "WiFi 5"
        bluetooth: { type: Boolean, default: true },
        bluetoothVersion: { type: String }, // e.g., "5.0", "5.2"
        opticalAudioOut: { type: Boolean, default: false },
        headphoneJack: { type: Boolean, default: false },
        
        // Gaming Features
        vrrSupport: { type: Boolean, default: false }, // Variable Refresh Rate
        allmSupport: { type: Boolean, default: false }, // Auto Low Latency Mode
        gameMode: { type: Boolean, default: false },
        gsyncSupport: { type: Boolean, default: false },
        freesyncSupport: { type: Boolean, default: false },
        
        // Physical
        dimensionsWithStand: { type: String },
        dimensionsWithoutStand: { type: String },
        weightWithStand: { type: String },
        weightWithoutStand: { type: String },
        vesaMount: { type: String }, // e.g., "400x400mm"
        color: { type: String },
        bezelType: { type: String }, // e.g., "Thin", "Frameless"
        standType: { type: String }, // e.g., "Center Stand", "Feet"
        
        // Power
        powerConsumption: { type: String }, // e.g., "150W"
        standbyPower: { type: String }, // e.g., "0.5W"
        voltageRange: { type: String }, // e.g., "100-240V"
        
        // Projector Specific
        projectorType: { type: String }, // e.g., "DLP", "LCD", "LCoS"
        brightnessLumens: { type: String }, // e.g., "3000 ANSI lumens"
        throwRatio: { type: String }, // e.g., "1.2:1"
        lampLife: { type: String }, // e.g., "20000 hours"
        projectionSize: { type: String }, // e.g., "80-200 inches"
        
        // Soundbar Specific
        soundbarChannels: { type: String }, // e.g., "3.1.2", "5.1.2"
        subwooferIncluded: { type: Boolean, default: false },
        subwooferType: { type: String }, // e.g., "Wireless", "Wired"
        wallMountable: { type: Boolean, default: true },
        
        // Streaming Device Specific
        streamingDeviceType: { type: String }, // e.g., "Streaming Stick", "Set-Top Box"
        remoteType: { type: String }, // e.g., "Voice Remote", "IR Remote"
        storage: { type: String }, // e.g., "8GB", "16GB"
        ram: { type: String }, // e.g., "2GB"
        
        // General
        warranty: { type: String }, // e.g., "2 Years"
        includedAccessories: [{ type: String }], // e.g., ["Remote", "Power Cable", "Wall Mount"]
        energyRating: { type: String }, // e.g., "5 Star", "3 Star"
        yearReleased: { type: Number },
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

const TVEntertainment = mongoose.model('TVEntertainment', tvEntertainmentSchema);
export default TVEntertainment;