// server/models/PCComponent.js
import mongoose from "mongoose";

const pcComponentSchema = new mongoose.Schema({
    type: { 
        type: String,
        enum: ['CPU', 'GPU', 'RAM', 'SSD', 'HDD', 'Motherboard', 'Power Supply', 'CPU Cooler', 'Case', 'Component'],
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
        // Common
        series: { type: String },
        model: { type: String },
        releaseDate: { type: String },
        color: { type: String },
        rgb: { type: Boolean, default: false },
        
        // CPU Specific
        socket: { type: String }, // e.g., 'LGA1700', 'AM5'
        cores: { type: Number },
        threads: { type: Number },
        baseClock: { type: String }, // e.g., '3.5 GHz'
        boostClock: { type: String }, // e.g., '5.1 GHz'
        cache: { type: String }, // e.g., '36MB'
        tdp: { type: Number }, // in watts
        integratedGraphics: { type: Boolean, default: false },
        unlocked: { type: Boolean, default: false }, // for overclocking
        maxMemorySupport: { type: String }, // e.g., '128GB'
        memoryType: { type: String }, // e.g., 'DDR5', 'DDR4'
        pcieVersion: { type: String }, // e.g., '5.0'
        
        // GPU Specific
        chipset: { type: String }, // e.g., 'RTX 4090'
        memory: { type: String }, // e.g., '24GB'
        memoryType: { type: String }, // e.g., 'GDDR6X'
        memoryInterface: { type: String }, // e.g., '384-bit'
        coreClock: { type: String }, // e.g., '2.5 GHz'
        boostClock: { type: String }, // e.g., '2.7 GHz'
        cudaCores: { type: Number },
        rayTracingCores: { type: Number },
        tensorCores: { type: Number },
        tdp: { type: Number }, // in watts
        recommendedPsu: { type: String }, // e.g., '750W'
        hdmiPorts: { type: Number },
        displayPorts: { type: Number },
        length: { type: String }, // e.g., '350mm'
        width: { type: String },
        slots: { type: Number }, // e.g., 2.5, 3
        cooling: { type: String }, // e.g., 'Triple Fan', 'Blower'
        
        // RAM Specific
        ramType: { type: String }, // e.g., 'DDR4', 'DDR5'
        capacity: { type: String }, // e.g., '16GB', '32GB'
        speed: { type: String }, // e.g., '3200MHz', '6000MHz'
        casLatency: { type: String }, // e.g., 'CL16'
        timing: { type: String }, // e.g., '16-18-18-38'
        voltage: { type: String }, // e.g., '1.35V'
        heatSpreader: { type: Boolean, default: true },
        modules: { type: Number }, // e.g., 2 for dual channel kit
        
        // Storage Specific
        formFactor: { type: String }, // e.g., 'M.2 2280', '2.5"'
        interface: { type: String }, // e.g., 'NVMe PCIe 4.0', 'SATA III'
        capacity: { type: String }, // e.g., '1TB', '2TB'
        nandType: { type: String }, // e.g., 'TLC', 'QLC'
        readSpeed: { type: String }, // e.g., '7000 MB/s'
        writeSpeed: { type: String }, // e.g., '5000 MB/s'
        randomRead: { type: String }, // e.g., '1M IOPS'
        randomWrite: { type: String }, // e.g., '1M IOPS'
        endurance: { type: String }, // e.g., '600 TBW'
        dramCache: { type: Boolean, default: false },
        hddRpm: { type: Number }, // for HDD, e.g., 7200
        
        // Motherboard Specific
        cpuSocket: { type: String }, // e.g., 'LGA1700', 'AM5'
        chipset: { type: String }, // e.g., 'Z790', 'B650'
        formFactor: { type: String }, // e.g., 'ATX', 'Micro-ATX', 'Mini-ITX'
        memoryType: { type: String }, // e.g., 'DDR5', 'DDR4'
        memorySlots: { type: Number },
        maxMemory: { type: String }, // e.g., '128GB'
        pcieSlots: { type: String }, // e.g., '1 x PCIe 5.0 x16, 2 x PCIe 4.0 x16'
        m2Slots: { type: Number },
        sataPorts: { type: Number },
        usbPorts: { type: String },
        audioChip: { type: String },
        ethernet: { type: String }, // e.g., '2.5GbE'
        wifi: { type: Boolean, default: false },
        bluetooth: { type: Boolean, default: false },
        
        // Power Supply Specific
        wattage: { type: Number }, // e.g., 850
        efficiency: { type: String }, // e.g., '80+ Gold', '80+ Platinum'
        modular: { type: String }, // 'Full', 'Semi', 'Non'
        fanSize: { type: String }, // e.g., '120mm'
        pcieConnectors: { type: String },
        sataConnectors: { type: Number },
        molexConnectors: { type: Number },
        
        // Cooler Specific
        coolerType: { type: String }, // 'Air', 'Liquid AIO', 'Custom Loop'
        fanSize: { type: String }, // e.g., '120mm'
        fanSpeed: { type: String }, // e.g., '500-1800 RPM'
        noiseLevel: { type: String }, // e.g., '22 dBA'
        airflow: { type: String }, // e.g., '75 CFM'
        radiatorSize: { type: String }, // for AIO, e.g., '240mm', '360mm'
        socketCompatibility: { type: String }, // e.g., 'LGA1700, AM5'
        height: { type: String }, // for air coolers
        
        // Case Specific
        caseType: { type: String }, // 'Full Tower', 'Mid Tower', 'Mini Tower', 'SFF'
        motherboardSupport: { type: String }, // e.g., 'ATX, Micro-ATX, Mini-ITX'
        psuSupport: { type: String }, // e.g., 'ATX, SFX'
        maxGpuLength: { type: String }, // e.g., '350mm'
        maxCpuHeight: { type: String }, // e.g., '170mm'
        includedFans: { type: String },
        fanSupport: { type: String },
        radiatorSupport: { type: String },
        driveBays: { type: String },
        ioPorts: { type: String },
        temperedGlass: { type: Boolean, default: false },
        psuShroud: { type: Boolean, default: false },
        cableManagement: { type: Boolean, default: true },
        
        // General
        warranty: { type: String }, // e.g., '3 Years'
        dimensions: { type: String },
        weight: { type: String },
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

const PCComponent = mongoose.model('PCComponent', pcComponentSchema);
export default PCComponent;