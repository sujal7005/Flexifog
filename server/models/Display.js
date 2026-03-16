import mongoose from 'mongoose';

const displaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  model: {
    type: String,
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
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'gaming',
      'professional',
      'ultrawide',
      '4k',
      'portable',
      'touchscreen',
      'curved',
      'office',
      'budget'
    ]
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  features: [{
    type: String
  }],
  ports: [{
    type: String
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 0
  },
  quantity: {
    type: Number,
    default: 0
  },
  code: {
    type: String,
    trim: true
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
  bonuses: {
    type: String
  },
  dateAdded: {
    type: Date
  },
  popularity: {
    type: Number,
    default: 0
  },
  condition: {
    type: String,
    default: 'New'
  },
  featured: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  specs: {
    size: String,
    screenSize: String,
    resolution: String,
    panelType: String,
    panel: String,
    refreshRate: String,
    responseTime: String,
    brightness: String,
    contrastRatio: String,
    aspectRatio: String,
    colorGamut: String,
    viewingAngle: String,
    hdr: String,
    curved: Boolean,
    touchscreen: Boolean,
    gSync: Boolean,
    freeSync: Boolean,
    builtInSpeakers: Boolean,
    usbTypeC: Boolean,
    vesaMount: String,
    weight: String,
    dimensions: String,
    color: String,
    warranty: String
  },
  images: [{
    type: String
  }],
  image: {
    type: String
  },
  additionalImages: [{
    type: String
  }],
  keyFeatures: [{
    title: String,
    description: String
  }],
  specifications: [{
    title: String,
    specs: [{
      name: String,
      value: String
    }]
  }],
  otherTechnicalDetails: [{
    name: String,
    value: String
  }],
  notes: [String],
  videos: [{
    title: String,
    url: String
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
    title: String,
    comment: String,
    pros: [String],
    cons: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
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
displaySchema.pre('save', function(next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.finalPrice = this.price;
  } else {
    this.finalPrice = this.price;
    this.originalPrice = this.price;
  }
  next();
});

// Add indexes for better query performance
displaySchema.index({ name: 'text', description: 'text', brand: 'text' });
displaySchema.index({ category: 1 });
displaySchema.index({ brand: 1 });
displaySchema.index({ price: 1 });
displaySchema.index({ finalPrice: 1 });
displaySchema.index({ isFeatured: 1 });
displaySchema.index({ isActive: 1 });

const Display = mongoose.model('Display', displaySchema);
export default Display;