// server/models/Wearable.js
import mongoose from "mongoose";

const wearableSchema = new mongoose.Schema({
    type: { 
        type: String,
        enum: ['Smartwatch', 'Fitness Tracker', 'Activity Band', 'Hybrid Watch', 'GPS Watch', 'Sports Watch', 'Wearable'],
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
        displayType: { type: String }, // e.g., "AMOLED", "LCD", "OLED"
        displaySize: { type: String }, // e.g., "1.4 inch"
        screenResolution: { type: String }, // e.g., "454 x 454 pixels"
        alwaysOnDisplay: { type: Boolean, default: false },
        touchscreen: { type: Boolean, default: true },
        colorDisplay: { type: Boolean, default: true },
        
        // Physical
        caseMaterial: { type: String }, // e.g., "Stainless Steel", "Aluminum", "Plastic"
        strapMaterial: { type: String }, // e.g., "Silicone", "Leather", "Metal"
        strapSize: { type: String }, // e.g., "20mm", "22mm"
        interchangeableStraps: { type: Boolean, default: false },
        dimensions: { type: String }, // e.g., "45 x 45 x 12 mm"
        weight: { type: String }, // e.g., "50g"
        colors: [{ type: String }], // e.g., ["Black", "Silver", "Gold"]
        
        // Health Sensors
        heartRateMonitor: { type: Boolean, default: false },
        bloodOxygenSensor: { type: Boolean, default: false },
        ecgSensor: { type: Boolean, default: false },
        temperatureSensor: { type: Boolean, default: false },
        skinTemperatureSensor: { type: Boolean, default: false },
        respirationRate: { type: Boolean, default: false },
        stressTracking: { type: Boolean, default: false },
        sleepTracking: { type: Boolean, default: false },
        stepCounter: { type: Boolean, default: true },
        calorieTracking: { type: Boolean, default: false },
        distanceTracking: { type: Boolean, default: false },
        floorsClimbed: { type: Boolean, default: false },
        fallDetection: { type: Boolean, default: false },
        
        // Fitness Features
        workoutModes: { type: Number }, // Number of workout modes
        workoutTracking: [{ type: String }], // e.g., ["Running", "Cycling", "Swimming", "Yoga"]
        autoWorkoutDetection: { type: Boolean, default: false },
        gps: { type: Boolean, default: false },
        glonass: { type: Boolean, default: false },
        galileo: { type: Boolean, default: false },
        compass: { type: Boolean, default: false },
        altimeter: { type: Boolean, default: false },
        barometer: { type: Boolean, default: false },
        
        // Connectivity
        bluetooth: { type: Boolean, default: true },
        bluetoothVersion: { type: String }, // e.g., "5.0", "5.2"
        wifi: { type: Boolean, default: false },
        nfc: { type: Boolean, default: false },
        mobileConnectivity: { type: Boolean, default: false }, // Cellular/LTE
        simSupport: { type: Boolean, default: false },
        esimSupport: { type: Boolean, default: false },
        
        // Smart Features
        operatingSystem: { type: String }, // e.g., "watchOS", "Wear OS", "Tizen", "RTOS"
        compatibleOS: [{ type: String }], // e.g., ["iOS", "Android"]
        voiceAssistant: { type: Boolean, default: false },
        voiceAssistantType: { type: String }, // e.g., "Siri", "Google Assistant", "Alexa", "Bixby"
        notifications: { type: Boolean, default: true },
        musicControl: { type: Boolean, default: false },
        musicStorage: { type: Boolean, default: false },
        onboardMusic: { type: String }, // e.g., "4GB"
        callsViaWatch: { type: Boolean, default: false },
        speaker: { type: Boolean, default: false },
        microphone: { type: Boolean, default: false },
        cameraControl: { type: Boolean, default: false },
        findMyPhone: { type: Boolean, default: false },
        
        // Payments
        nfcPayments: { type: Boolean, default: false },
        paymentServices: [{ type: String }], // e.g., ["Google Pay", "Apple Pay", "Samsung Pay"]
        
        // Navigation
        maps: { type: Boolean, default: false },
        turnByTurnNavigation: { type: Boolean, default: false },
        
        // Water Resistance
        waterResistant: { type: String }, // e.g., "5 ATM", "IP68", "50m"
        swimProof: { type: Boolean, default: false },
        swimTracking: { type: Boolean, default: false },
        
        // Battery
        batteryType: { type: String }, // e.g., "Li-Ion", "Li-Po"
        batteryCapacity: { type: String }, // e.g., "300mAh"
        batteryLife: { type: String }, // e.g., "7 days", "18 hours"
        batteryLifeMode: { type: String }, // e.g., "Smartwatch mode", "Power save mode"
        chargingTime: { type: String }, // e.g., "2 hours"
        wirelessCharging: { type: Boolean, default: false },
        fastCharging: { type: Boolean, default: false },
        
        // Sensors (additional)
        accelerometer: { type: Boolean, default: true },
        gyroscope: { type: Boolean, default: false },
        ambientLightSensor: { type: Boolean, default: false },
        proximitySensor: { type: Boolean, default: false },
        
        // General
        warranty: { type: String }, // e.g., "1 Year"
        releaseYear: { type: Number },
        manufacturer: { type: String },
        countryOfOrigin: { type: String },
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

const Wearable = mongoose.model('Wearable', wearableSchema);
export default Wearable;