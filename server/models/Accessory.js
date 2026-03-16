import mongoose from 'mongoose';

const accessorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'input-devices',
      'audio',
      'storage',
      'networking',
      'cables',
      'cooling',
      'power',
      'gaming',
      'other'
    ]
  },
  subcategory: {
    type: String,
    enum: [
      // Input Devices
      'keyboards', 'mice', 'mouse-pads', 'stylus', 'graphic-tablets', 'scanners', 'barcode-scanners', 'biometric',
      // Audio
      'headphones', 'earbuds', 'speakers', 'microphones', 'soundbars', 'amplifiers', 'dac', 'studio-monitors',
      // Storage
      'external-ssd', 'external-hdd', 'usb-drives', 'memory-cards', 'card-readers', 'nas', 'docking-stations',
      // Networking
      'routers', 'switches', 'modems', 'access-points', 'network-cards', 'cables', 'adapters', 'range-extenders',
      // Cables
      'usb-cables', 'hdmi-cables', 'displayport-cables', 'audio-cables', 'power-cables', 'converters', 'splitters',
      // Cooling
      'case-fans', 'cpu-coolers', 'liquid-cooling', 'thermal-paste', 'fan-controllers',
      // Power
      'ups', 'power-strips', 'surge-protectors', 'power-adapters', 'batteries', 'chargers',
      // Gaming
      'gaming-keyboards', 'gaming-mice', 'gaming-headsets', 'gaming-controllers', 'gaming-chairs', 'streaming-gear'
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
  specs: {
    // General
    connectivity: String,
    compatibility: String,
    color: String,
    weight: String,
    dimensions: String,
    material: String,
    
    // Keyboards & Mice
    switchType: String,
    keyCount: Number,
    backlight: String,
    dpi: String,
    sensor: String,
    buttons: Number,
    
    // Audio
    driverSize: String,
    frequencyResponse: String,
    impedance: String,
    sensitivity: String,
    noiseCancelling: Boolean,
    microphone: Boolean,
    batteryLife: String,
    
    // Storage
    capacity: String,
    interface: String,
    readSpeed: String,
    writeSpeed: String,
    formFactor: String,
    
    // Networking
    speed: String,
    frequency: String,
    ports: String,
    antennas: Number,
    
    // Cables
    length: String,
    connectorType: String,
    shielding: String,
    
    // Cooling
    fanSize: String,
    fanSpeed: String,
    airflow: String,
    noiseLevel: String,
    rgb: Boolean,
    
    // Power
    wattage: Number,
    efficiency: String,
    output: String,
    input: String,
    
    // Warranty
    warranty: String
  },
  features: [{
    type: String
  }],
  compatibility: [{
    type: String
  }],
  whatsInTheBox: [{
    type: String
  }],
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
  popularity: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  meta: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Calculate final price before saving
accessorySchema.pre('save', function(next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.finalPrice = this.price;
  } else {
    this.finalPrice = this.price;
    this.originalPrice = this.price;
  }
  next();
});

// Update popularity when rating changes
accessorySchema.methods.updatePopularity = function() {
  this.popularity = (this.ratings.average * this.ratings.count) / (this.ratings.count + 1);
};

// Add indexes for better query performance
accessorySchema.index({ name: 'text', description: 'text', brand: 'text' });
accessorySchema.index({ category: 1, subcategory: 1 });
accessorySchema.index({ price: 1 });
accessorySchema.index({ brand: 1 });
accessorySchema.index({ popularity: -1 });
accessorySchema.index({ createdAt: -1 });
accessorySchema.index({ 'specs.connectivity': 1 });
accessorySchema.index({ features: 1 });

const Accessory = mongoose.model('Accessory', accessorySchema);
export default Accessory;