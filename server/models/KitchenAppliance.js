import mongoose from 'mongoose';

const kitchenApplianceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Appliance type is required'],
    enum: [
      'Refrigerator',
      'Oven',
      'Microwave',
      'Dishwasher',
      'Cooktop',
      'Range',
      'Freezer',
      'Wine Cooler',
      'Ice Maker',
      'Coffee Maker',
      'Kettle',
      'Toaster',
      'Blender',
      'Mixer',
      'Juicer',
      'Food Processor',
      'Air Fryer',
      'Slow Cooker',
      'Pressure Cooker',
      'Rice Cooker',
      'Induction Cooktop',
      'Chimney',
      'Water Purifier',
      'Dispenser',
      'Other'
    ]
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  finalPrice: {
    type: Number,
    min: [0, 'Final price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  images: [{
    type: String
  }],
  image: {
    type: String
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Specifications
  specs: {
    // General
    color: String,
    weight: String,
    dimensions: String,
    material: String,
    voltage: String,
    powerConsumption: String,
    warranty: String,
    
    // Refrigerator specific
    capacity: String, // e.g., "500L"
    energyRating: String, // e.g., "5 Star"
    defrostType: String, // e.g., "Frost Free", "Direct Cool"
    compressor: String, // e.g., "Inverter", "Normal"
    coolingTechnology: String,
    refrigeratorType: String, // e.g., "Double Door", "Side by Side", "French Door"
    freezerCapacity: String,
    iceMaker: Boolean,
    waterDispenser: Boolean,
    
    // Oven/Cooktop specific
    ovenType: String, // e.g., "Convection", "Conventional"
    capacity: String, // e.g., "60L"
    numberOfBurners: Number,
    burnerType: String, // e.g., "Gas", "Electric", "Induction"
    thermostatRange: String,
    timer: Boolean,
    selfCleaning: Boolean,
    
    // Microwave specific
    microwaveType: String, // e.g., "Solo", "Grill", "Convection"
    capacity: String, // e.g., "28L"
    powerLevels: Number,
    autoCook: Boolean,
    defrost: Boolean,
    turntable: Boolean,
    
    // Dishwasher specific
    placeSettings: Number, // e.g., 14
    washPrograms: Number,
    energyRating: String,
    waterConsumption: String, // e.g., "12L per cycle"
    noiseLevel: String, // e.g., "44dB"
    dryingSystem: String,
    
    // Small appliances specific
    wattage: String,
    capacity: String, // e.g., "1.5L" for kettle, "2L" for juicer
    speedSettings: Number,
    jarMaterial: String, // e.g., "Stainless Steel", "Glass"
    dishwasherSafe: Boolean,
    cordless: Boolean,
    filterType: String,
    
    // Water Purifier specific
    purificationTechnology: String, // e.g., "RO", "UV", "UF"
    storageCapacity: String,
    stages: Number,
    tdsController: Boolean,
    
    // Features
    smartFeatures: [String], // e.g., "WiFi", "Voice Control", "App Control"
    safetyFeatures: [String], // e.g., "Child Lock", "Auto Shut-off", "Overheat Protection"
  },
  
  features: [{
    type: String
  }],
  whatsInTheBox: [{
    type: String
  }],
  
  // Ratings and Reviews
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Status flags
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  popularity: {
    type: Number,
    default: 0
  },
  
  // SEO
  meta: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Calculate final price before saving
kitchenApplianceSchema.pre('save', function(next) {
  if (this.discount && this.discount > 0) {
    this.finalPrice = this.price - (this.price * this.discount / 100);
  } else if (this.originalPrice && this.originalPrice > this.price) {
    this.finalPrice = this.price;
  } else {
    this.finalPrice = this.price;
    this.originalPrice = this.price;
  }
  next();
});

// Update popularity when rating changes
kitchenApplianceSchema.methods.updatePopularity = function() {
  this.popularity = (this.ratings.average * this.ratings.count) / (this.ratings.count + 1);
};

// Add indexes for better query performance
kitchenApplianceSchema.index({ name: 'text', description: 'text', brand: 'text' });
kitchenApplianceSchema.index({ type: 1 });
kitchenApplianceSchema.index({ brand: 1 });
kitchenApplianceSchema.index({ price: 1 });
kitchenApplianceSchema.index({ popularity: -1 });
kitchenApplianceSchema.index({ createdAt: -1 });
kitchenApplianceSchema.index({ 'specs.energyRating': 1 });

const KitchenAppliance = mongoose.model('KitchenAppliance', kitchenApplianceSchema);
export default KitchenAppliance;