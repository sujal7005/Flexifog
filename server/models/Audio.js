// server/models/Audio.js
import mongoose from "mongoose";

const audioSchema = new mongoose.Schema({
    type: { 
        type: String,
        enum: ['Headphones', 'Earbuds', 'Speakers', 'Soundbars', 'Microphones', 'Amplifiers', 'Audio'],
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
        url: { type: String, default: ""},
    }],
    keyFeatures: [{
        title: String,
        description: String
    }],
    specs: {
        // Audio Specifications
        driverSize: { type: String }, // e.g., "40mm"
        frequencyResponse: { type: String }, // e.g., "20Hz - 20kHz"
        impedance: { type: String }, // e.g., "32 Ohms"
        sensitivity: { type: String }, // e.g., "105dB"
        
        // Connectivity
        connectivity: [{ type: String }], // ['Bluetooth', 'Wired', 'Wireless', 'WiFi']
        bluetoothVersion: { type: String }, // e.g., "5.0"
        wirelessRange: { type: String }, // e.g., "10m"
        
        // Battery
        batteryLife: { type: String }, // e.g., "20 hours"
        chargingTime: { type: String }, // e.g., "2 hours"
        fastCharging: { type: Boolean, default: false },
        
        // Features
        noiseCancelling: { type: Boolean, default: false },
        waterResistant: { type: String }, // e.g., "IPX4", "IP67"
        builtInMic: { type: Boolean, default: false },
        voiceAssistant: { type: Boolean, default: false },
        multipointConnection: { type: Boolean, default: false },
        
        // Controls
        touchControls: { type: Boolean, default: false },
        buttonControls: { type: Boolean, default: true },
        
        // Physical
        weight: { type: String }, // e.g., "250g"
        color: { type: String },
        foldable: { type: Boolean, default: false },
        
        // For Speakers
        outputPower: { type: String }, // e.g., "20W"
        channels: { type: String }, // e.g., "2.0", "2.1", "5.1"
        subwoofer: { type: Boolean, default: false },
        
        // For Microphones
        polarPattern: { type: String }, // e.g., "Cardioid", "Omnidirectional"
        sampleRate: { type: String }, // e.g., "192kHz"
        bitDepth: { type: String }, // e.g., "24-bit"
    },
    otherTechnicalDetails: [
        {
            name: { type: String, required: true },
            value: { type: String, required: true },
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

const Audio = mongoose.model('Audio', audioSchema);
export default Audio;