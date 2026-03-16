import mongoose from 'mongoose';

const laundryApplianceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Appliance type is required'],
    enum: [
      'Washing Machine',
      'Dryer',
      'Washer-Dryer Combo',
      'Iron',
      'Steam Iron',
      'Ironing Board',
      'Steamer',
      'Vacuum Cleaner',
      'Robot Vacuum',
      'Stick Vacuum',
      'Handheld Vacuum',
      'Wet-Dry Vacuum',
      'Carpet Cleaner',
      'Floor Cleaner',
      'Steam Mop',
      'Spin Mop',
      'Laundry Basket',
      'Drying Rack',
      'Laundry Sorter',
      'Fabric Steamer',
      'Garment Steamer',
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
    cordLength: String,
    
    // Washing Machine specific
    capacity: String, // e.g., "7kg", "8.5kg"
    loadType: String, // e.g., "Front Load", "Top Load"
    washingTechnology: String,
    spinSpeed: String, // e.g., "1200 RPM"
    energyRating: String, // e.g., "5 Star"
    waterConsumption: String, // e.g., "75L per cycle"
    programs: Number, // Number of wash programs
    temperatureControl: Boolean,
    delayStart: Boolean,
    childLock: Boolean,
    smartDiagnosis: Boolean,
    inverterMotor: Boolean,
    steamWash: Boolean,
    quickWash: Boolean,
    stainRemoval: Boolean,
    
    // Dryer specific
    dryingCapacity: String,
    dryingTechnology: String, // e.g., "Heat Pump", "Ventless"
    moistureSensor: Boolean,
    antiCrease: Boolean,
    
    // Vacuum Cleaner specific
    vacuumType: String, // e.g., "Bagless", "With Bag"
    suctionPower: String, // e.g., "250 AW"
    filterType: String, // e.g., "HEPA", "Washable"
    dustCapacity: String, // e.g., "1.5L"
    noiseLevel: String, // e.g., "75dB"
    attachments: [String],
    batteryLife: String, // for cordless models
    chargingTime: String,
    runtime: String,
    autoDocking: Boolean, // for robot vacuums
    mappingTechnology: String, // for robot vacuums
    appControl: Boolean,
    voiceControl: Boolean,
    scheduling: Boolean,
    multiFloorMapping: Boolean,
    
    // Iron specific
    ironType: String, // e.g., "Dry", "Steam", "Travel"
    soleplateType: String, // e.g., "Ceramic", "Non-stick"
    waterTankCapacity: String,
    steamOutput: String,
    verticalSteam: Boolean,
    antiDrip: Boolean,
    autoShutOff: Boolean,
    selfClean: Boolean,
    cordless: Boolean,
    
    // Floor Cleaner specific
    cleaningWidth: String,
    solutionTankCapacity: String,
    dirtyWaterTankCapacity: String,
    brushType: String,
    scrubbingBrushes: Number,
    dryingFunction: Boolean,
  },
  
  features: [{
    type: String
  }],
  whatsInTheBox: [{
    type: String
  }],
  compatibleWith: [{
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
laundryApplianceSchema.pre('save', function(next) {
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
laundryApplianceSchema.methods.updatePopularity = function() {
  this.popularity = (this.ratings.average * this.ratings.count) / (this.ratings.count + 1);
};

// Add indexes for better query performance
laundryApplianceSchema.index({ name: 'text', description: 'text', brand: 'text' });
laundryApplianceSchema.index({ type: 1 });
laundryApplianceSchema.index({ brand: 1 });
laundryApplianceSchema.index({ price: 1 });
laundryApplianceSchema.index({ popularity: -1 });
laundryApplianceSchema.index({ createdAt: -1 });
laundryApplianceSchema.index({ 'specs.energyRating': 1 });
laundryApplianceSchema.index({ 'specs.capacity': 1 });

const LaundryAppliance = mongoose.model('LaundryAppliance', laundryApplianceSchema);
export default LaundryAppliance;