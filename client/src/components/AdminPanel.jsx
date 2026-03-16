import React, { useState, useEffect, useRef } from "react";
import { FaArrowDown, FaArrowUp, FaBars, FaTimes, FaHome, FaShoppingCart, FaUsers, FaTags, FaBox, FaEnvelope, FaInfoCircle, FaHistory, FaSignOutAlt, FaChartBar, FaHeadphones, FaCamera, FaMobileAlt, FaMicrochip, FaTv, FaClock, FaFire, FaSnowflake, FaWineBottle, FaCoffee, FaBlender, FaTint, FaBolt, FaTshirt, FaWater, FaWind, FaBroom, FaIndustry, FaStickyNote } from 'react-icons/fa';
import { io } from "socket.io-client";
import DashboardGraphs from "./DashboardGraphs";
import DiscountCode from './DiscountCode';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', phoneNumber: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(Number(localStorage.getItem("countdown")) || 10800);
  const timeoutRef = useRef(null);
  const [loginHistory, setLoginHistory] = useState([]);
  const [socket, setSocket] = useState(null);
  const [position, setPosition] = useState({ x: 6, y: 115 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recipient, setRecipient] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    type: "",
    name: '',
    price: '',
    category: '',
    description: '',
    image: null,
    popularity: 0,
    ram: '',
    storage: '',
    ramOptions: [{ value: "", price: "" }],
    storage1Options: [{ value: "", price: "" }],
    storage2Options: [{ value: "", price: "" }],
    otherTechnicalDetails: [{ name: "", value: "" }],
    notes: [""],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [subscribers, setSubscribers] = useState([]);
  const [messageHistory, setMessageHistory] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState([]);
  const [locationInfo, setLocationInfo] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenforLocation, setIsOpenforLocation] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  const [audioProducts, setAudioProducts] = useState([]);
  const [cameraProducts, setCameraProducts] = useState([]);
  const [audioFormData, setAudioFormData] = useState({
    id: "",
    type: "Headphones",
    name: "",
    price: "",
    originalPrice: "",
    brand: "",
    category: "",
    description: "",
    image: null,
    additionalImages: [],
    stock: "yes",
    code: "",
    discount: "",
    bonuses: "",
    dateAdded: "",
    popularity: "0",
    condition: "New",

    // Audio specific fields
    driverSize: "",
    frequencyResponse: "",
    impedance: "",
    sensitivity: "",
    connectivity: [],
    bluetoothVersion: "",
    wirelessRange: "",
    batteryLife: "",
    chargingTime: "",
    fastCharging: false,
    noiseCancelling: false,
    waterResistant: "",
    builtInMic: false,
    voiceAssistant: false,
    multipointConnection: false,
    touchControls: false,
    buttonControls: true,
    weight: "",
    color: "",
    foldable: false,
    outputPower: "",
    channels: "",
    subwoofer: false,
    polarPattern: "",
    sampleRate: "",
    bitDepth: "",

    // Common fields
    keyFeatures: [{ title: "", description: "" }],
    specifications: [{ title: "", specs: [{ name: "", value: "" }] }],
    otherTechnicalDetails: [{ name: "", value: "" }],
    notes: [""],
    videos: [{ title: "", url: "" }],
  });

  const [cameraFormData, setCameraFormData] = useState({
    id: "",
    type: "DSLR",
    name: "",
    price: "",
    originalPrice: "",
    brand: "",
    category: "",
    description: "",
    image: null,
    additionalImages: [],
    stock: "yes",
    code: "",
    discount: "",
    bonuses: "",
    dateAdded: "",
    popularity: "0",
    condition: "New",

    // Camera specific fields
    sensorType: "",
    sensorSize: "",
    megapixels: "",
    imageProcessor: "",
    isoRange: "",
    shutterSpeed: "",
    continuousShooting: "",
    videoResolution: [],
    videoFrameRates: "",
    lensMount: "",
    focalLength: "",
    aperture: "",
    autofocusPoints: "",
    faceDetection: false,
    eyeTracking: false,
    screenSize: "",
    screenResolution: "",
    touchscreen: false,
    articulatingScreen: false,
    viewfinderType: "",
    viewfinderResolution: "",
    wifi: false,
    bluetooth: false,
    nfc: false,
    hdmi: false,
    usbType: "",
    storageMedia: [],
    cardSlots: "1",
    batteryType: "",
    batteryLife: "",
    weight: "",
    dimensions: "",
    weatherSealed: false,
    resolution: "",
    frameRate: "",
    fieldOfView: "",
    autofocus: false,
    lowLightCorrection: false,
    waterproof: "",
    imageStabilization: "",
    builtInDisplay: false,

    // Common fields
    keyFeatures: [{ title: "", description: "" }],
    specifications: [{ title: "", specs: [{ name: "", value: "" }] }],
    otherTechnicalDetails: [{ name: "", value: "" }],
    notes: [""],
    videos: [{ title: "", url: "" }],
  });

  const [isEditingAudio, setIsEditingAudio] = useState(false);
  const [isEditingCamera, setIsEditingCamera] = useState(false);
  const [audioImagePreview, setAudioImagePreview] = useState([]);
  const [cameraImagePreview, setCameraImagePreview] = useState([]);
  const [audioSearchTerm, setAudioSearchTerm] = useState('');
  const [cameraSearchTerm, setCameraSearchTerm] = useState('');
  const [audioTypeFilter, setAudioTypeFilter] = useState('all');
  const [cameraTypeFilter, setCameraTypeFilter] = useState('all');

  const [mobileProducts, setMobileProducts] = useState([]);
  const [mobileFormData, setMobileFormData] = useState({
    id: "",
    type: "Smartphone",
    name: "",
    price: "",
    originalPrice: "",
    brand: "",
    category: "",
    description: "",
    image: null,
    additionalImages: [],
    stock: "yes",
    code: "",
    discount: "",
    bonuses: "",
    dateAdded: "",
    popularity: "0",
    condition: "New",

    // Display
    displaySize: "",
    displayType: "",
    resolution: "",
    refreshRate: "",
    brightness: "",
    hdr: false,

    // Processor
    processor: "",
    processorBrand: "",
    processorCores: "",
    processorSpeed: "",
    gpu: "",

    // Memory
    ram: "",
    ramType: "",
    internalStorage: "",
    storageType: "",
    expandableStorage: false,
    maxStorage: "",

    // Camera
    rearCamera: "",
    rearCameraFeatures: "",
    frontCamera: "",
    frontCameraFeatures: "",
    videoRecording: "",
    cameraFeatures: [],

    // Battery
    batteryCapacity: "",
    batteryType: "",
    fastCharging: "",
    wirelessCharging: false,
    reverseCharging: false,
    chargingTime: "",

    // Connectivity
    network: [],
    simType: "",
    dualSim: false,
    wifi: "",
    bluetooth: "",
    nfc: false,
    gps: true,
    usbType: "",

    // OS
    operatingSystem: "",
    osVersion: "",

    // Sensors
    fingerprintSensor: false,
    fingerprintPosition: "",
    faceUnlock: false,
    accelerometer: true,
    gyroscope: true,
    proximity: true,
    compass: true,
    barometer: false,

    // Physical
    dimensions: "",
    weight: "",
    build: "",
    colors: [],
    waterResistant: "",

    // Audio
    speakers: "",
    headphoneJack: false,
    audioFeatures: [],

    // Additional Features
    stylus: false,
    desktopMode: false,
    samsungDex: false,
    applePencilSupport: false,
    keyboardSupport: false,
    applePencilGen: "",
    magicKeyboardSupport: false,
    smartConnector: false,

    // Common fields
    keyFeatures: [{ title: "", description: "" }],
    specifications: [{ title: "", specs: [{ name: "", value: "" }] }],
    otherTechnicalDetails: [{ name: "", value: "" }],
    notes: [""],
    videos: [{ title: "", url: "" }],
  });

  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [mobileImagePreview, setMobileImagePreview] = useState([]);
  const [mobileSearchTerm, setMobileSearchTerm] = useState('');
  const [mobileTypeFilter, setMobileTypeFilter] = useState('all');
  const [mobileBrandFilter, setMobileBrandFilter] = useState('all');
  const [mobileOsFilter, setMobileOsFilter] = useState('all');

  // Mobile types for filter
  const mobileTypes = ['Smartphone', 'iPhone', 'Tablet', 'iPad', 'Foldable Phone', 'Feature Phone'];

  const [pcComponentProducts, setPcComponentProducts] = useState([]);
  const [pcComponentFormData, setPcComponentFormData] = useState({
    id: "",
    type: "CPU",
    name: "",
    price: "",
    originalPrice: "",
    brand: "",
    category: "",
    description: "",
    image: null,
    additionalImages: [],
    stock: "yes",
    code: "",
    discount: "",
    bonuses: "",
    dateAdded: "",
    popularity: "0",
    condition: "New",

    // Common
    series: "",
    model: "",
    releaseDate: "",
    color: "",
    rgb: false,

    // CPU Specific
    socket: "",
    cores: "",
    threads: "",
    baseClock: "",
    boostClock: "",
    cache: "",
    tdp: "",
    integratedGraphics: false,
    unlocked: false,
    maxMemorySupport: "",
    memoryType: "",
    pcieVersion: "",

    // GPU Specific
    gpuChipset: "", // Changed from 'chipset' to avoid duplicate
    gpuMemory: "", // Changed from 'memory' to avoid duplicate
    gpuMemoryType: "", // Changed from 'memoryType' to avoid duplicate
    gpuMemoryInterface: "", // Changed from 'memoryInterface' to avoid duplicate
    gpuCoreClock: "", // Changed from 'coreClock' to avoid duplicate
    gpuBoostClock: "", // Changed from 'boostClock' to avoid duplicate
    cudaCores: "",
    rayTracingCores: "",
    tensorCores: "",
    gpuTdp: "", // Changed from 'tdp' to avoid duplicate
    recommendedPsu: "",
    hdmiPorts: "",
    displayPorts: "",
    length: "",
    width: "",
    slots: "",
    cooling: "",

    // RAM Specific
    ramType: "",
    ramCapacity: "", // Changed from 'capacity' to avoid duplicate
    ramSpeed: "", // Changed from 'speed' to avoid duplicate
    casLatency: "",
    timing: "",
    voltage: "",
    heatSpreader: true,
    modules: "",

    // Storage Specific
    storageFormFactor: "", // Changed from 'formFactor' to avoid duplicate
    storageInterface: "", // Changed from 'interface' to avoid duplicate
    storageCapacity: "", // Changed from 'capacity' to avoid duplicate
    nandType: "",
    readSpeed: "",
    writeSpeed: "",
    randomRead: "",
    randomWrite: "",
    endurance: "",
    dramCache: false,
    hddRpm: "",

    // Motherboard Specific
    cpuSocket: "",
    motherboardChipset: "", // Changed from 'chipset' to avoid duplicate
    motherboardFormFactor: "", // Changed from 'formFactor' to avoid duplicate
    memorySlots: "",
    maxMemory: "",
    pcieSlots: "",
    m2Slots: "",
    sataPorts: "",
    usbPorts: "",
    audioChip: "",
    ethernet: "",
    wifi: false,
    bluetooth: false,

    // Power Supply Specific
    wattage: "",
    efficiency: "",
    modular: "",
    psuFanSize: "", // Changed from 'fanSize' to avoid duplicate
    pcieConnectors: "",
    sataConnectors: "",
    molexConnectors: "",

    // Cooler Specific
    coolerType: "",
    coolerFanSize: "", // Changed from 'fanSize' to avoid duplicate
    fanSpeed: "",
    noiseLevel: "",
    airflow: "",
    radiatorSize: "",
    socketCompatibility: "",
    coolerHeight: "", // Changed from 'height' to avoid duplicate

    // Case Specific
    caseType: "",
    motherboardSupport: "",
    psuSupport: "",
    maxGpuLength: "",
    maxCpuHeight: "",
    includedFans: "",
    fanSupport: "",
    radiatorSupport: "",
    driveBays: "",
    ioPorts: "",
    temperedGlass: false,
    psuShroud: false,
    cableManagement: true,

    // General
    warranty: "",
    dimensions: "",
    weight: "",

    // Common fields
    keyFeatures: [{ title: "", description: "" }],
    specifications: [{ title: "", specs: [{ name: "", value: "" }] }],
    otherTechnicalDetails: [{ name: "", value: "" }],
    notes: [""],
    videos: [{ title: "", url: "" }],
  });

  const [isEditingPCComponent, setIsEditingPCComponent] = useState(false);
  const [pcComponentImagePreview, setPcComponentImagePreview] = useState([]);
  const [pcComponentSearchTerm, setPcComponentSearchTerm] = useState('');
  const [pcComponentTypeFilter, setPcComponentTypeFilter] = useState('all');
  const [pcComponentBrandFilter, setPcComponentBrandFilter] = useState('all');
  const [pcComponentSocketFilter, setPcComponentSocketFilter] = useState('all');

  // PC Component types for filter
  const pcComponentTypes = ['CPU', 'GPU', 'RAM', 'SSD', 'HDD', 'Motherboard', 'Power Supply', 'CPU Cooler', 'Case'];

  // Accessories state
  const [accessoryProducts, setAccessoryProducts] = useState([]);
  // Replace your existing accessoryFormData with this updated version
  const [accessoryFormData, setAccessoryFormData] = useState({
    id: "",
    name: "",
    category: "",
    subcategory: "",
    brand: "",
    price: "",
    originalPrice: "",
    description: "",
    shortDescription: "",
    image: null,
    additionalImages: [],
    stock: 0,  // Changed from "yes"/"no" to number
    sku: "",

    // Specs object
    specs: {
      // General
      connectivity: "",
      compatibility: "",
      color: "",
      weight: "",
      dimensions: "",
      material: "",

      // Keyboards & Mice
      switchType: "",
      keyCount: "",
      backlight: "",
      dpi: "",
      sensor: "",
      buttons: "",

      // Audio
      driverSize: "",
      frequencyResponse: "",
      impedance: "",
      sensitivity: "",
      noiseCancelling: false,
      microphone: false,
      batteryLife: "",

      // Storage
      capacity: "",
      interface: "",
      readSpeed: "",
      writeSpeed: "",
      formFactor: "",

      // Networking
      speed: "",
      frequency: "",
      ports: "",
      antennas: "",

      // Cables
      length: "",
      connectorType: "",
      shielding: "",

      // Cooling
      fanSize: "",
      fanSpeed: "",
      airflow: "",
      noiseLevel: "",
      rgb: false,

      // Power
      wattage: "",
      efficiency: "",
      output: "",
      input: "",

      // Warranty
      warranty: ""
    },

    features: [],
    compatibility: [],
    whatsInTheBox: [],
    isFeatured: false,
    isActive: true,
    tags: [],
    meta: {
      title: "",
      description: "",
      keywords: []
    }
  });
  
  const [isEditingAccessory, setIsEditingAccessory] = useState(false);
  const [accessoryImagePreview, setAccessoryImagePreview] = useState([]);
  const [accessorySearchTerm, setAccessorySearchTerm] = useState('');
  const [accessoryCategoryFilter, setAccessoryCategoryFilter] = useState('all');
  const [accessoryBrandFilter, setAccessoryBrandFilter] = useState('all');

  const accessoryCategories = [
    'input-devices',
    'audio',
    'storage',
    'networking',
    'cables',
    'cooling',
    'power',
    'gaming',
    'other'
  ];

  // Get accessory type icon and color
  const getAccessoryCategoryColor = (category) => {
    const colors = {
      'Cables': 'bg-blue-600',
      'Chargers': 'bg-green-600',
      'Cases': 'bg-purple-600',
      'Storage': 'bg-yellow-600',
      'Audio': 'bg-red-600',
      'Gaming': 'bg-indigo-600',
      'default': 'bg-gray-600'
    };

    if (category?.includes('Cable')) return colors.Cables;
    if (category?.includes('Charger') || category?.includes('Power')) return colors.Chargers;
    if (category?.includes('Case') || category?.includes('Cover')) return colors.Cases;
    if (category?.includes('Drive') || category?.includes('Card')) return colors.Storage;
    if (category?.includes('Audio') || category?.includes('Head')) return colors.Audio;
    if (category?.includes('Gaming')) return colors.Gaming;
    return colors.default;
  };

  // Update subcategories to match schema enum
  const accessorySubcategories = {
    'input-devices': ['keyboards', 'mice', 'mouse-pads', 'stylus', 'graphic-tablets', 'scanners', 'barcode-scanners', 'biometric'],
    'audio': ['headphones', 'earbuds', 'speakers', 'microphones', 'soundbars', 'amplifiers', 'dac', 'studio-monitors'],
    'storage': ['external-ssd', 'external-hdd', 'usb-drives', 'memory-cards', 'card-readers', 'nas', 'docking-stations'],
    'networking': ['routers', 'switches', 'modems', 'access-points', 'network-cards', 'cables', 'adapters', 'range-extenders'],
    'cables': ['usb-cables', 'hdmi-cables', 'displayport-cables', 'audio-cables', 'power-cables', 'converters', 'splitters'],
    'cooling': ['case-fans', 'cpu-coolers', 'liquid-cooling', 'thermal-paste', 'fan-controllers'],
    'power': ['ups', 'power-strips', 'surge-protectors', 'power-adapters', 'batteries', 'chargers'],
    'gaming': ['gaming-keyboards', 'gaming-mice', 'gaming-headsets', 'gaming-controllers', 'gaming-chairs', 'streaming-gear'],
    'other': []
  };

  // Get category display names for UI
  const getCategoryDisplayName = (category) => {
    const displayNames = {
      'input-devices': 'Input Devices',
      'audio': 'Audio',
      'storage': 'Storage',
      'networking': 'Networking',
      'cables': 'Cables',
      'cooling': 'Cooling',
      'power': 'Power',
      'gaming': 'Gaming',
      'other': 'Other'
    };
    return displayNames[category] || category;
  };

  // Get subcategory display names for UI
  const getSubcategoryDisplayName = (subcategory) => {
    const displayNames = {
      'keyboards': 'Keyboards',
      'mice': 'Mice',
      'mouse-pads': 'Mouse Pads',
      'stylus': 'Stylus',
      'graphic-tablets': 'Graphic Tablets',
      'scanners': 'Scanners',
      'barcode-scanners': 'Barcode Scanners',
      'biometric': 'Biometric',
      'headphones': 'Headphones',
      'earbuds': 'Earbuds',
      'speakers': 'Speakers',
      'microphones': 'Microphones',
      'soundbars': 'Soundbars',
      'amplifiers': 'Amplifiers',
      'dac': 'DAC',
      'studio-monitors': 'Studio Monitors',
      'external-ssd': 'External SSD',
      'external-hdd': 'External HDD',
      'usb-drives': 'USB Drives',
      'memory-cards': 'Memory Cards',
      'card-readers': 'Card Readers',
      'nas': 'NAS',
      'docking-stations': 'Docking Stations',
      'routers': 'Routers',
      'switches': 'Switches',
      'modems': 'Modems',
      'access-points': 'Access Points',
      'network-cards': 'Network Cards',
      'range-extenders': 'Range Extenders',
      'usb-cables': 'USB Cables',
      'hdmi-cables': 'HDMI Cables',
      'displayport-cables': 'DisplayPort Cables',
      'audio-cables': 'Audio Cables',
      'power-cables': 'Power Cables',
      'converters': 'Converters',
      'splitters': 'Splitters',
      'case-fans': 'Case Fans',
      'cpu-coolers': 'CPU Coolers',
      'liquid-cooling': 'Liquid Cooling',
      'thermal-paste': 'Thermal Paste',
      'fan-controllers': 'Fan Controllers',
      'ups': 'UPS',
      'power-strips': 'Power Strips',
      'surge-protectors': 'Surge Protectors',
      'power-adapters': 'Power Adapters',
      'batteries': 'Batteries',
      'chargers': 'Chargers',
      'gaming-keyboards': 'Gaming Keyboards',
      'gaming-mice': 'Gaming Mice',
      'gaming-headsets': 'Gaming Headsets',
      'gaming-controllers': 'Gaming Controllers',
      'gaming-chairs': 'Gaming Chairs',
      'streaming-gear': 'Streaming Gear'
    };
    return displayNames[subcategory] || subcategory;
  };

  // Fetch accessory products
  const fetchAccessoryProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/accessories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();

      if (data.success && Array.isArray(data.accessories)) {
        setAccessoryProducts(data.accessories);
      } else if (Array.isArray(data)) {
        setAccessoryProducts(data);
      } else if (data.data && Array.isArray(data.data)) {
        setAccessoryProducts(data.data);
      } else {
        console.error('Unexpected API response format:', data);
        setAccessoryProducts([]);
      }
    } catch (error) {
      console.error("Error fetching accessory products:", error);
      setError("Failed to load accessory products");
    }
  };

  // Load accessory products on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchAccessoryProducts();
    }
  }, [isAuthenticated]);

  const handleAccessoryInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle nested specs fields
    if (name.startsWith('specs.')) {
      const specsField = name.replace('specs.', '');
      setAccessoryFormData(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specsField]: type === 'checkbox' ? checked : value
        }
      }));
    }
    // Handle array fields
    else if (name === 'features' || name === 'compatibility' || name === 'whatsInTheBox' || name === 'tags') {
      const values = value.split(',').map(item => item.trim()).filter(item => item !== '');
      setAccessoryFormData(prev => ({ ...prev, [name]: values }));
    }
    // Handle meta fields
    else if (name.startsWith('meta.')) {
      const metaField = name.replace('meta.', '');
      setAccessoryFormData(prev => ({
        ...prev,
        meta: {
          ...prev.meta,
          [metaField]: metaField === 'keywords' ? value.split(',').map(k => k.trim()).filter(k => k !== '') : value
        }
      }));
    }
    else if (type === 'checkbox') {
      setAccessoryFormData(prev => ({ ...prev, [name]: checked }));
    }
    else {
      setAccessoryFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAccessoryImageChange = (e) => {
    const imageFiles = e.target.files;
    if (imageFiles && imageFiles.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validFiles = Array.from(imageFiles).filter(file => allowedTypes.includes(file.type));

      if (validFiles.length !== imageFiles.length) {
        alert('Some files are invalid. Only JPEG, PNG, GIF, and WEBP are allowed.');
        return;
      }

      const previewUrls = validFiles.map(file => URL.createObjectURL(file));
      setAccessoryImagePreview(prev => [...prev, ...previewUrls]);

      setAccessoryFormData(prev => ({
        ...prev,
        image: Array.isArray(prev.image) ? [...prev.image, ...validFiles] : [...validFiles],
      }));
    }
  };

  const handleAccessoryImageRemove = (index) => {
    setAccessoryImagePreview(prev => prev.filter((_, i) => i !== index));
    setAccessoryFormData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }));
  };

  const resetAccessoryForm = () => {
    setAccessoryFormData({
      id: "",
      name: "",
      category: "",
      subcategory: "",
      brand: "",
      price: "",
      originalPrice: "",
      description: "",
      shortDescription: "",
      image: null,
      additionalImages: [],
      stock: 0,
      sku: "",
      specs: {
        connectivity: "",
        compatibility: "",
        color: "",
        weight: "",
        dimensions: "",
        material: "",
        switchType: "",
        keyCount: "",
        backlight: "",
        dpi: "",
        sensor: "",
        buttons: "",
        driverSize: "",
        frequencyResponse: "",
        impedance: "",
        sensitivity: "",
        noiseCancelling: false,
        microphone: false,
        batteryLife: "",
        capacity: "",
        interface: "",
        readSpeed: "",
        writeSpeed: "",
        formFactor: "",
        speed: "",
        frequency: "",
        ports: "",
        antennas: "",
        length: "",
        connectorType: "",
        shielding: "",
        fanSize: "",
        fanSpeed: "",
        airflow: "",
        noiseLevel: "",
        rgb: false,
        wattage: "",
        efficiency: "",
        output: "",
        input: "",
        warranty: ""
      },
      features: [],
      compatibility: [],
      whatsInTheBox: [],
      isFeatured: false,
      isActive: true,
      tags: [],
      meta: {
        title: "",
        description: "",
        keywords: []
      }
    });
    setAccessoryImagePreview([]);
    setIsEditingAccessory(false);
  };

  const handleAccessorySubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Prepare data - convert stock to number
      const accessoryData = {
        ...accessoryFormData,
        stock: Number(accessoryFormData.stock) || 0
      };

      // Append all fields
      Object.keys(accessoryData).forEach(key => {
        if (key === 'image' || key === 'additionalImages' || key === 'specs' || key === 'meta') return;

        if (Array.isArray(accessoryData[key])) {
          if (accessoryData[key].length > 0) {
            formDataToSend.append(key, JSON.stringify(accessoryData[key]));
          }
        } else if (accessoryData[key] !== undefined && accessoryData[key] !== null && accessoryData[key] !== '') {
          formDataToSend.append(key, accessoryData[key].toString());
        }
      });

      // Append specs object
      if (accessoryData.specs) {
        // Clean up empty values
        const cleanedSpecs = {};
        Object.keys(accessoryData.specs).forEach(key => {
          if (accessoryData.specs[key] !== undefined && accessoryData.specs[key] !== null && accessoryData.specs[key] !== '') {
            cleanedSpecs[key] = accessoryData.specs[key];
          }
        });
        if (Object.keys(cleanedSpecs).length > 0) {
          formDataToSend.append('specs', JSON.stringify(cleanedSpecs));
        }
      }

      // Append meta object
      if (accessoryData.meta) {
        const cleanedMeta = {};
        Object.keys(accessoryData.meta).forEach(key => {
          if (accessoryData.meta[key] !== undefined && accessoryData.meta[key] !== null && accessoryData.meta[key] !== '') {
            cleanedMeta[key] = accessoryData.meta[key];
          }
        });
        if (Object.keys(cleanedMeta).length > 0) {
          formDataToSend.append('meta', JSON.stringify(cleanedMeta));
        }
      }

      // Append images
      if (accessoryData.image && accessoryData.image.length > 0) {
        accessoryData.image.forEach(file => {
          if (file instanceof File) {
            formDataToSend.append('images', file);
          }
        });
      }

      const url = accessoryData.id
        ? `${BASE_URL}/api/accessories/admin/${accessoryData.id}`
        : `${BASE_URL}/api/accessories/admin`;

      const method = accessoryData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || "Failed to save accessory");
      }

      alert(accessoryData.id ? "Accessory updated successfully!" : "Accessory created successfully!");

      fetchAccessoryProducts();
      resetAccessoryForm();
    } catch (error) {
      console.error("Error saving accessory:", error);
      setError(error.message || "Failed to save accessory");
    }
  };

  const handleEditAccessory = (product) => {
    setAccessoryFormData({
      id: product._id || product.id,
      type: product.type || "Accessory",
      name: product.name || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      brand: product.brand || "",
      category: product.category || "",
      subcategory: product.subcategory || "",
      description: product.description || "",
      image: product.image || null,
      additionalImages: product.additionalImages || [],
      stock: product.inStock ? "yes" : "no",
      quantity: product.quantity || product.stock || 0,
      code: product.code || product.sku || "",
      discount: product.discount || "",
      bonuses: product.bonuses || "",
      dateAdded: product.dateAdded ? product.dateAdded.split('T')[0] : "",
      popularity: product.popularity || "0",
      condition: product.condition || "New",
      isFeatured: product.isFeatured || false,
      isActive: product.isActive !== false,

      // Accessory specific fields
      compatibility: product.specs?.compatibility || "",
      connectivity: product.specs?.connectivity || [],
      features: product.features || product.specs?.features || [],
      material: product.specs?.material || "",
      color: product.specs?.color || "",
      dimensions: product.specs?.dimensions || "",
      weight: product.specs?.weight || "",
      warranty: product.specs?.warranty || "",
      model: product.model || "",
      series: product.series || "",

      cableLength: product.specs?.cableLength || "",
      batteryType: product.specs?.batteryType || "",
      batteryLife: product.specs?.batteryLife || "",
      chargingTime: product.specs?.chargingTime || "",
      wirelessRange: product.specs?.wirelessRange || "",
      bluetoothVersion: product.specs?.bluetoothVersion || "",
      waterResistant: product.specs?.waterResistant || "",

      keyFeatures: product.keyFeatures || [{ title: "", description: "" }],
      specifications: product.specifications || [{ title: "", specs: [{ name: "", value: "" }] }],
      otherTechnicalDetails: product.otherTechnicalDetails || [{ name: "", value: "" }],
      notes: product.notes || [""],
      videos: product.videos || [{ title: "", url: "" }],
    });

    // Handle image previews
    let imageUrls = [];
    if (product.image && Array.isArray(product.image) && product.image.length > 0) {
      imageUrls = product.image.map(img => 
        img.startsWith('http') ? img : `${BASE_URL}/uploads/${img.split('/').pop()}`
      );
    } else if (product.image && typeof product.image === 'string') {
      imageUrls = [product.image.startsWith('http') ? product.image : `${BASE_URL}/uploads/${product.image.split('/').pop()}`];
    } else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      imageUrls = product.images.map(img => 
        img.startsWith('http') ? img : `${BASE_URL}/uploads/${img.split('/').pop()}`
      );
    }

    setAccessoryImagePreview(imageUrls);
    setIsEditingAccessory(true);
  };

  const handleDeleteAccessory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this accessory?")) return;

    try {
      const response = await fetch(`${BASE_URL}/api/accessories/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete accessory");

      alert("Accessory deleted successfully!");
      fetchAccessoryProducts();
    } catch (error) {
      console.error("Error deleting accessory:", error);
      setError("Failed to delete accessory");
    }
  };

  const handleToggleAccessoryFeatured = async (id, currentFeatured) => {
    try {
      const response = await fetch(`${BASE_URL}/api/accessories/admin/${id}/featured`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });

      if (!response.ok) throw new Error("Failed to toggle featured status");

      alert(`Accessory ${!currentFeatured ? 'added to' : 'removed from'} featured`);
      fetchAccessoryProducts();
    } catch (error) {
      console.error("Error toggling featured status:", error);
      setError("Failed to toggle featured status");
    }
  };

  const [tvProducts, setTvProducts] = useState([]);
  const [tvFormData, setTvFormData] = useState({
    id: "",
    type: "Television",
    name: "",
    price: "",
    originalPrice: "",
    brand: "",
    category: "",
    description: "",
    image: null,
    additionalImages: [],
    stock: "yes",
    code: "",
    discount: "",
    bonuses: "",
    dateAdded: "",
    popularity: "0",
    condition: "New",

    // Display Specifications
    screenSize: "",
    resolution: "",
    displayTechnology: "",
    refreshRate: "",
    brightness: "",
    contrastRatio: "",
    hdrSupport: "",
    viewingAngle: "",
    responseTime: "",

    // Audio Specifications
    audioOutput: "",
    speakerConfiguration: "",
    audioTechnologies: [],

    // Smart Features
    smartPlatform: "",
    voiceAssistant: "",
    streamingApps: [],
    screenMirroring: false,
    airplaySupport: false,

    // Connectivity
    hdmiPorts: "",
    hdmiVersion: "",
    usbPorts: "",
    usbVersion: "",
    ethernetPort: true,
    wifi: true,
    wifiStandard: "",
    bluetooth: true,
    bluetoothVersion: "",
    opticalAudioOut: false,
    headphoneJack: false,

    // Gaming Features
    vrrSupport: false,
    allmSupport: false,
    gameMode: false,
    gsyncSupport: false,
    freesyncSupport: false,

    // Physical
    dimensionsWithStand: "",
    dimensionsWithoutStand: "",
    weightWithStand: "",
    weightWithoutStand: "",
    vesaMount: "",
    color: "",
    bezelType: "",
    standType: "",

    // Power
    powerConsumption: "",
    standbyPower: "",
    voltageRange: "",

    // Projector Specific
    projectorType: "",
    brightnessLumens: "",
    throwRatio: "",
    lampLife: "",
    projectionSize: "",

    // Soundbar Specific
    soundbarChannels: "",
    subwooferIncluded: false,
    subwooferType: "",
    wallMountable: true,

    // Streaming Device Specific
    streamingDeviceType: "",
    remoteType: "",
    storage: "",
    ram: "",

    // General
    warranty: "",
    includedAccessories: [],
    energyRating: "",
    yearReleased: "",

    // Common fields
    keyFeatures: [{ title: "", description: "" }],
    specifications: [{ title: "", specs: [{ name: "", value: "" }] }],
    otherTechnicalDetails: [{ name: "", value: "" }],
    notes: [""],
    videos: [{ title: "", url: "" }],
  });

  const [isEditingTV, setIsEditingTV] = useState(false);
  const [tvImagePreview, setTvImagePreview] = useState([]);
  const [tvSearchTerm, setTvSearchTerm] = useState('');
  const [tvTypeFilter, setTvTypeFilter] = useState('all');
  const [tvBrandFilter, setTvBrandFilter] = useState('all');
  const [tvResolutionFilter, setTvResolutionFilter] = useState('all');
  const [tvScreenSizeFilter, setTvScreenSizeFilter] = useState('all');

  // TV types for filter
  const tvTypes = ['Television', 'OLED TV', 'QLED TV', 'LED TV', 'Projector', 'Soundbar', 'Home Theater', 'Streaming Device'];

  // Resolutions for filter
  const tvResolutions = ['4K', '8K', 'Full HD', 'HD Ready'];

  // Screen size ranges for filter
  const tvScreenSizes = ['Under 32"', '32" - 42"', '43" - 54"', '55" - 64"', '65" - 74"', '75" and above'];

  const [wearableProducts, setWearableProducts] = useState([]);
  const [wearableFormData, setWearableFormData] = useState({
    id: "",
    type: "Smartwatch",
    name: "",
    price: "",
    originalPrice: "",
    brand: "",
    category: "",
    description: "",
    image: null,
    additionalImages: [],
    stock: "yes",
    code: "",
    discount: "",
    bonuses: "",
    dateAdded: "",
    popularity: "0",
    condition: "New",

    // Display
    displayType: "",
    displaySize: "",
    screenResolution: "",
    alwaysOnDisplay: false,
    touchscreen: true,
    colorDisplay: true,

    // Physical
    caseMaterial: "",
    strapMaterial: "",
    strapSize: "",
    interchangeableStraps: false,
    dimensions: "",
    weight: "",
    colors: [],

    // Health Sensors
    heartRateMonitor: false,
    bloodOxygenSensor: false,
    ecgSensor: false,
    temperatureSensor: false,
    skinTemperatureSensor: false,
    respirationRate: false,
    stressTracking: false,
    sleepTracking: false,
    stepCounter: true,
    calorieTracking: false,
    distanceTracking: false,
    floorsClimbed: false,
    fallDetection: false,

    // Fitness Features
    workoutModes: "",
    workoutTracking: [],
    autoWorkoutDetection: false,
    gps: false,
    glonass: false,
    galileo: false,
    compass: false,
    altimeter: false,
    barometer: false,

    // Connectivity
    bluetooth: true,
    bluetoothVersion: "",
    wifi: false,
    nfc: false,
    mobileConnectivity: false,
    simSupport: false,
    esimSupport: false,

    // Smart Features
    operatingSystem: "",
    compatibleOS: [],
    voiceAssistant: false,
    voiceAssistantType: "",
    notifications: true,
    musicControl: false,
    musicStorage: false,
    onboardMusic: "",
    callsViaWatch: false,
    speaker: false,
    microphone: false,
    cameraControl: false,
    findMyPhone: false,

    // Payments
    nfcPayments: false,
    paymentServices: [],

    // Navigation
    maps: false,
    turnByTurnNavigation: false,

    // Water Resistance
    waterResistant: "",
    swimProof: false,
    swimTracking: false,

    // Battery
    batteryType: "",
    batteryCapacity: "",
    batteryLife: "",
    batteryLifeMode: "",
    chargingTime: "",
    wirelessCharging: false,
    fastCharging: false,

    // Sensors
    accelerometer: true,
    gyroscope: false,
    ambientLightSensor: false,
    proximitySensor: false,

    // General
    warranty: "",
    releaseYear: "",
    manufacturer: "",
    countryOfOrigin: "",

    // Common fields
    keyFeatures: [{ title: "", description: "" }],
    specifications: [{ title: "", specs: [{ name: "", value: "" }] }],
    otherTechnicalDetails: [{ name: "", value: "" }],
    notes: [""],
    videos: [{ title: "", url: "" }],
  });

  const [isEditingWearable, setIsEditingWearable] = useState(false);
  const [wearableImagePreview, setWearableImagePreview] = useState([]);
  const [wearableSearchTerm, setWearableSearchTerm] = useState('');
  const [wearableTypeFilter, setWearableTypeFilter] = useState('all');
  const [wearableBrandFilter, setWearableBrandFilter] = useState('all');
  const [wearableOsFilter, setWearableOsFilter] = useState('all');
  const [wearableFeatureFilter, setWearableFeatureFilter] = useState('all');

  // Wearable types for filter
  const wearableTypes = ['Smartwatch', 'Fitness Tracker', 'Activity Band', 'Hybrid Watch', 'GPS Watch', 'Sports Watch'];

  // OS types for filter
  const wearableOsTypes = ['watchOS', 'Wear OS', 'Tizen', 'RTOS', 'HarmonyOS'];

  // Features for filter
  const wearableFeatures = [
    'Heart Rate Monitor', 'GPS', 'Water Resistant', 'Sleep Tracking', 'Blood Oxygen (SpO2)',
    'ECG', 'Stress Tracking', 'Voice Assistant', 'Music Control', 'NFC Payments',
    'Bluetooth Calls', 'Always-On Display'
  ];

  const [displayProducts, setDisplayProducts] = useState([]);
  const [displayFormData, setDisplayFormData] = useState({
    id: "",
    name: "",
    brand: "",
    model: "",
    price: "",
    originalPrice: "",
    category: "gaming",
    description: "",
    features: [],
    ports: [],
    resolution: "",
    screenSize: "",
    panelType: "",
    refreshRate: "",
    responseTime: "",
    brightness: "",
    contrastRatio: "",
    aspectRatio: "",
    colorGamut: "",
    viewingAngle: "",
    hdrSupport: "",
    adaptiveSync: "",
    curved: false,
    touchscreen: false,
    vesaMount: "",
    dimensions: "",
    weight: "",
    color: "",
    warranty: "",
    inStock: "yes",
    quantity: "",
    code: "",
    discount: "",
    bonuses: "",
    dateAdded: "",
    popularity: "0",
    condition: "New",
    featured: false,
    image: null,
    additionalImages: [],

    // Common fields
    keyFeatures: [{ title: "", description: "" }],
    specifications: [{ title: "", specs: [{ name: "", value: "" }] }],
    otherTechnicalDetails: [{ name: "", value: "" }],
    notes: [""],
    videos: [{ title: "", url: "" }],
  });

  const [isEditingDisplay, setIsEditingDisplay] = useState(false);
  const [displayImagePreview, setDisplayImagePreview] = useState([]);
  const [displaySearchTerm, setDisplaySearchTerm] = useState('');
  const [displayCategoryFilter, setDisplayCategoryFilter] = useState('all');
  const [displayBrandFilter, setDisplayBrandFilter] = useState('all');

  // Display categories for filter
  const displayCategories = ['gaming', 'professional', 'ultrawide', 'office', 'portable', 'touchscreen', '4k', 'curved'];

  // Kitchen Appliances state
  const [kitchenProducts, setKitchenProducts] = useState([]);
  const [kitchenFormData, setKitchenFormData] = useState({
    id: "",
    name: "",
    type: "",
    brand: "",
    price: "",
    originalPrice: "",
    description: "",
    shortDescription: "",
    image: null,
    additionalImages: [],
    stock: 0,
    sku: "",
    discount: 0,

    // Specifications
    specs: {
      // General
      color: "",
      weight: "",
      dimensions: "",
      material: "",
      voltage: "",
      powerConsumption: "",
      warranty: "",

      // Refrigerator specific
      capacity: "",
      energyRating: "",
      defrostType: "",
      compressor: "",
      coolingTechnology: "",
      refrigeratorType: "",
      freezerCapacity: "",
      iceMaker: false,
      waterDispenser: false,

      // Oven/Cooktop specific
      ovenType: "",
      numberOfBurners: "",
      burnerType: "",
      thermostatRange: "",
      timer: false,
      selfCleaning: false,

      // Microwave specific
      microwaveType: "",
      powerLevels: "",
      autoCook: false,
      defrost: false,
      turntable: false,

      // Dishwasher specific
      placeSettings: "",
      washPrograms: "",
      waterConsumption: "",
      noiseLevel: "",
      dryingSystem: "",

      // Small appliances specific
      wattage: "",
      speedSettings: "",
      jarMaterial: "",
      dishwasherSafe: false,
      cordless: false,
      filterType: "",

      // Water Purifier specific
      purificationTechnology: "",
      storageCapacity: "",
      stages: "",
      tdsController: false,

      // Features
      smartFeatures: [],
      safetyFeatures: [],
    },

    features: [],
    whatsInTheBox: [],
    isFeatured: false,
    isActive: true,
    meta: {
      title: "",
      description: "",
      keywords: []
    }
  });

  const [isEditingKitchen, setIsEditingKitchen] = useState(false);
  const [kitchenImagePreview, setKitchenImagePreview] = useState([]);
  const [kitchenSearchTerm, setKitchenSearchTerm] = useState('');
  const [kitchenTypeFilter, setKitchenTypeFilter] = useState('all');
  const [kitchenBrandFilter, setKitchenBrandFilter] = useState('all');
  const [kitchenEnergyFilter, setKitchenEnergyFilter] = useState('all');

  // Kitchen appliance types
  const kitchenTypes = [
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
    'Dispenser'
  ];

  // Get appliance icon
  const getKitchenIcon = (type) => {
    const icons = {
      'Refrigerator': '❄️',
      'Oven': '🔥',
      'Microwave': '⚡',
      'Dishwasher': '💧',
      'Cooktop': '🔥',
      'Freezer': '❄️',
      'Wine Cooler': '🍷',
      'Coffee Maker': '☕',
      'Kettle': '🫖',
      'Toaster': '🍞',
      'Blender': '🥤',
      'Mixer': '🥣',
      'Juicer': '🍊',
      'Food Processor': '🔪',
      'Air Fryer': '🍟',
      'Slow Cooker': '🍲',
      'Pressure Cooker': '🍲',
      'Rice Cooker': '🍚',
      'Water Purifier': '💧'
    };
    return icons[type] || '🔧';
  };

  // Get appliance color
  const getKitchenColor = (type) => {
    const colors = {
      'Refrigerator': 'bg-blue-600',
      'Oven': 'bg-red-600',
      'Microwave': 'bg-orange-600',
      'Dishwasher': 'bg-cyan-600',
      'Cooktop': 'bg-red-600',
      'Freezer': 'bg-blue-600',
      'Wine Cooler': 'bg-purple-600',
      'Coffee Maker': 'bg-amber-600',
      'Blender': 'bg-green-600',
      'Air Fryer': 'bg-yellow-600',
      'Water Purifier': 'bg-blue-600'
    };
    return colors[type] || 'bg-gray-600';
  };

  // Laundry state
  const [laundryProducts, setLaundryProducts] = useState([]);
  const [laundryFormData, setLaundryFormData] = useState({
    id: "",
    name: "",
    type: "",
    brand: "",
    price: "",
    originalPrice: "",
    description: "",
    shortDescription: "",
    image: null,
    additionalImages: [],
    stock: 0,
    sku: "",
    discount: 0,

    // Specifications
    specs: {
      // General
      color: "",
      weight: "",
      dimensions: "",
      material: "",
      voltage: "",
      powerConsumption: "",
      warranty: "",
      cordLength: "",

      // Washing Machine specific
      capacity: "",
      loadType: "",
      washingTechnology: "",
      spinSpeed: "",
      energyRating: "",
      waterConsumption: "",
      programs: "",
      temperatureControl: false,
      delayStart: false,
      childLock: false,
      smartDiagnosis: false,
      inverterMotor: false,
      steamWash: false,
      quickWash: false,
      stainRemoval: false,

      // Dryer specific
      dryingCapacity: "",
      dryingTechnology: "",
      moistureSensor: false,
      antiCrease: false,

      // Vacuum Cleaner specific
      vacuumType: "",
      suctionPower: "",
      filterType: "",
      dustCapacity: "",
      noiseLevel: "",
      attachments: [],
      batteryLife: "",
      chargingTime: "",
      runtime: "",
      autoDocking: false,
      mappingTechnology: "",
      appControl: false,
      voiceControl: false,
      scheduling: false,
      multiFloorMapping: false,

      // Iron specific
      ironType: "",
      soleplateType: "",
      waterTankCapacity: "",
      steamOutput: "",
      verticalSteam: false,
      antiDrip: false,
      autoShutOff: false,
      selfClean: false,
      cordless: false,

      // Floor Cleaner specific
      cleaningWidth: "",
      solutionTankCapacity: "",
      dirtyWaterTankCapacity: "",
      brushType: "",
      scrubbingBrushes: "",
      dryingFunction: false,
    },

    features: [],
    whatsInTheBox: [],
    compatibleWith: [],
    isFeatured: false,
    isActive: true,
    meta: {
      title: "",
      description: "",
      keywords: []
    }
  });

  const [isEditingLaundry, setIsEditingLaundry] = useState(false);
  const [laundryImagePreview, setLaundryImagePreview] = useState([]);
  const [laundrySearchTerm, setLaundrySearchTerm] = useState('');
  const [laundryTypeFilter, setLaundryTypeFilter] = useState('all');
  const [laundryBrandFilter, setLaundryBrandFilter] = useState('all');
  const [laundryLoadTypeFilter, setLaundryLoadTypeFilter] = useState('all');
  const [laundryEnergyFilter, setLaundryEnergyFilter] = useState('all');

  // Laundry appliance types
  const laundryTypes = [
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
    'Garment Steamer'
  ];

  // Load types for washing machines
  const loadTypes = ['Front Load', 'Top Load', 'Semi-Automatic', 'Fully Automatic'];

  // Energy ratings
  const energyRatings = ['5 Star', '4 Star', '3 Star', '2 Star', '1 Star'];

  // Get appliance icon
  const getLaundryIcon = (type) => {
    const icons = {
      'Washing Machine': '🧺',
      'Dryer': '🌀',
      'Washer-Dryer Combo': '🧺🌀',
      'Iron': '🔫',
      'Steam Iron': '💨',
      'Vacuum Cleaner': '🧹',
      'Robot Vacuum': '🤖',
      'Carpet Cleaner': '🧼',
      'Floor Cleaner': '🧽'
    };
    return icons[type] || '🧺';
  };

  // Get appliance color
  const getLaundryColor = (type) => {
    const colors = {
      'Washing Machine': 'bg-blue-600',
      'Dryer': 'bg-cyan-600',
      'Washer-Dryer Combo': 'bg-purple-600',
      'Iron': 'bg-orange-600',
      'Steam Iron': 'bg-orange-600',
      'Vacuum Cleaner': 'bg-green-600',
      'Robot Vacuum': 'bg-indigo-600',
      'Carpet Cleaner': 'bg-green-600',
      'Floor Cleaner': 'bg-green-600'
    };
    return colors[type] || 'bg-gray-600';
  };

  // Fetch laundry products
  const fetchLaundryProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/laundry`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      console.log('Laundry API response:', data);

      if (data.success && Array.isArray(data.products)) {
        setLaundryProducts(data.products);
      } else if (Array.isArray(data)) {
        setLaundryProducts(data);
      } else {
        console.error('Unexpected API response format:', data);
        setLaundryProducts([]);
      }
    } catch (error) {
      console.error("Error fetching laundry products:", error);
      setError("Failed to load laundry products");
    }
  };

  // Load laundry products on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchLaundryProducts();
    }
  }, [isAuthenticated]);

  // Laundry form handlers
  const handleLaundryInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle nested specs fields
    if (name.startsWith('specs.')) {
      const specsField = name.replace('specs.', '');

      // Handle array fields
      if (specsField === 'attachments') {
        const arrayValue = value.split(',')
          .map(item => item.trim())
          .filter(item => item !== '');
        setLaundryFormData(prev => ({
          ...prev,
          specs: {
            ...prev.specs,
            [specsField]: arrayValue
          }
        }));
      } else {
        setLaundryFormData(prev => ({
          ...prev,
          specs: {
            ...prev.specs,
            [specsField]: type === 'checkbox' ? checked : value
          }
        }));
      }
    }
    // Handle array fields at root level
    else if (name === 'features' || name === 'whatsInTheBox' || name === 'compatibleWith') {
      const arrayValue = value.split(',')
        .map(item => item.trim())
        .filter(item => item !== '');
      setLaundryFormData(prev => ({ ...prev, [name]: arrayValue }));
    }
    // Handle meta fields
    else if (name.startsWith('meta.')) {
      const metaField = name.replace('meta.', '');
      setLaundryFormData(prev => ({
        ...prev,
        meta: {
          ...prev.meta,
          [metaField]: metaField === 'keywords' ? 
            value.split(',').map(k => k.trim()).filter(k => k !== '') : 
            value
        }
      }));
    }
    else if (type === 'checkbox') {
      setLaundryFormData(prev => ({ ...prev, [name]: checked }));
    }
    else {
      setLaundryFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLaundryImageChange = (e) => {
    const imageFiles = e.target.files;
    if (imageFiles && imageFiles.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validFiles = Array.from(imageFiles).filter(file => allowedTypes.includes(file.type));

      if (validFiles.length !== imageFiles.length) {
        alert('Some files are invalid. Only JPEG, PNG, GIF, and WEBP are allowed.');
        return;
      }

      const previewUrls = validFiles.map(file => URL.createObjectURL(file));
      setLaundryImagePreview(prev => [...prev, ...previewUrls]);

      setLaundryFormData(prev => ({
        ...prev,
        image: Array.isArray(prev.image) ? [...prev.image, ...validFiles] : [...validFiles],
      }));
    }
  };

  const handleLaundryImageRemove = (index) => {
    setLaundryImagePreview(prev => prev.filter((_, i) => i !== index));
    setLaundryFormData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }));
  };

  const resetLaundryForm = () => {
    setLaundryFormData({
      id: "",
      name: "",
      type: "",
      brand: "",
      price: "",
      originalPrice: "",
      description: "",
      shortDescription: "",
      image: null,
      additionalImages: [],
      stock: 0,
      sku: "",
      discount: 0,
      specs: {
        color: "",
        weight: "",
        dimensions: "",
        material: "",
        voltage: "",
        powerConsumption: "",
        warranty: "",
        cordLength: "",
        capacity: "",
        loadType: "",
        washingTechnology: "",
        spinSpeed: "",
        energyRating: "",
        waterConsumption: "",
        programs: "",
        temperatureControl: false,
        delayStart: false,
        childLock: false,
        smartDiagnosis: false,
        inverterMotor: false,
        steamWash: false,
        quickWash: false,
        stainRemoval: false,
        dryingCapacity: "",
        dryingTechnology: "",
        moistureSensor: false,
        antiCrease: false,
        vacuumType: "",
        suctionPower: "",
        filterType: "",
        dustCapacity: "",
        noiseLevel: "",
        attachments: [],
        batteryLife: "",
        chargingTime: "",
        runtime: "",
        autoDocking: false,
        mappingTechnology: "",
        appControl: false,
        voiceControl: false,
        scheduling: false,
        multiFloorMapping: false,
        ironType: "",
        soleplateType: "",
        waterTankCapacity: "",
        steamOutput: "",
        verticalSteam: false,
        antiDrip: false,
        autoShutOff: false,
        selfClean: false,
        cordless: false,
        cleaningWidth: "",
        solutionTankCapacity: "",
        dirtyWaterTankCapacity: "",
        brushType: "",
        scrubbingBrushes: "",
        dryingFunction: false,
      },
      features: [],
      whatsInTheBox: [],
      compatibleWith: [],
      isFeatured: false,
      isActive: true,
      meta: {
        title: "",
        description: "",
        keywords: []
      }
    });
    setLaundryImagePreview([]);
    setIsEditingLaundry(false);
  };

  const handleLaundrySubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Prepare data
      const laundryData = {
        ...laundryFormData,
        stock: Number(laundryFormData.stock) || 0,
        discount: Number(laundryFormData.discount) || 0,
        price: Number(laundryFormData.price) || 0,
        originalPrice: Number(laundryFormData.originalPrice) || 0
      };

      // Append all fields
      Object.keys(laundryData).forEach(key => {
        if (key === 'image' || key === 'additionalImages' || key === 'specs' || key === 'meta') return;

        if (Array.isArray(laundryData[key])) {
          if (laundryData[key].length > 0) {
            formDataToSend.append(key, JSON.stringify(laundryData[key]));
          }
        } else if (laundryData[key] !== undefined && laundryData[key] !== null && laundryData[key] !== '') {
          formDataToSend.append(key, laundryData[key].toString());
        }
      });

      // Append specs object
      if (laundryData.specs) {
        const cleanedSpecs = {};
        Object.keys(laundryData.specs).forEach(key => {
          if (laundryData.specs[key] !== undefined && laundryData.specs[key] !== null && laundryData.specs[key] !== '') {
            cleanedSpecs[key] = laundryData.specs[key];
          }
        });
        if (Object.keys(cleanedSpecs).length > 0) {
          formDataToSend.append('specs', JSON.stringify(cleanedSpecs));
        }
      }

      // Append meta object
      if (laundryData.meta) {
        const cleanedMeta = {};
        Object.keys(laundryData.meta).forEach(key => {
          if (laundryData.meta[key] !== undefined && laundryData.meta[key] !== null && laundryData.meta[key] !== '') {
            cleanedMeta[key] = laundryData.meta[key];
          }
        });
        if (Object.keys(cleanedMeta).length > 0) {
          formDataToSend.append('meta', JSON.stringify(cleanedMeta));
        }
      }

      // Append images
      if (laundryData.image && laundryData.image.length > 0) {
        laundryData.image.forEach(file => {
          if (file instanceof File) {
            formDataToSend.append('images', file);
          }
        });
      }

      const url = laundryData.id
        ? `${BASE_URL}/api/laundry/admin/${laundryData.id}`
        : `${BASE_URL}/api/laundry/admin`;

      const method = laundryData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.details?.join(', ') || responseData.error || "Failed to save laundry appliance");
      }

      alert(laundryData.id ? "Laundry appliance updated successfully!" : "Laundry appliance created successfully!");

      fetchLaundryProducts();
      resetLaundryForm();
    } catch (error) {
      console.error("Error saving laundry appliance:", error);
      setError(error.message || "Failed to save laundry appliance");
    }
  };

  const handleEditLaundry = (product) => {
    setLaundryFormData({
      id: product._id || product.id,
      name: product.name || "",
      type: product.type || "",
      brand: product.brand || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      image: product.image || null,
      additionalImages: product.additionalImages || [],
      stock: product.stock || 0,
      sku: product.sku || product.code || "",
      discount: product.discount || 0,

      // Map specs from product.specs
      specs: {
        color: product.specs?.color || "",
        weight: product.specs?.weight || "",
        dimensions: product.specs?.dimensions || "",
        material: product.specs?.material || "",
        voltage: product.specs?.voltage || "",
        powerConsumption: product.specs?.powerConsumption || "",
        warranty: product.specs?.warranty || "",
        cordLength: product.specs?.cordLength || "",
        capacity: product.specs?.capacity || "",
        loadType: product.specs?.loadType || "",
        washingTechnology: product.specs?.washingTechnology || "",
        spinSpeed: product.specs?.spinSpeed || "",
        energyRating: product.specs?.energyRating || "",
        waterConsumption: product.specs?.waterConsumption || "",
        programs: product.specs?.programs || "",
        temperatureControl: product.specs?.temperatureControl || false,
        delayStart: product.specs?.delayStart || false,
        childLock: product.specs?.childLock || false,
        smartDiagnosis: product.specs?.smartDiagnosis || false,
        inverterMotor: product.specs?.inverterMotor || false,
        steamWash: product.specs?.steamWash || false,
        quickWash: product.specs?.quickWash || false,
        stainRemoval: product.specs?.stainRemoval || false,
        dryingCapacity: product.specs?.dryingCapacity || "",
        dryingTechnology: product.specs?.dryingTechnology || "",
        moistureSensor: product.specs?.moistureSensor || false,
        antiCrease: product.specs?.antiCrease || false,
        vacuumType: product.specs?.vacuumType || "",
        suctionPower: product.specs?.suctionPower || "",
        filterType: product.specs?.filterType || "",
        dustCapacity: product.specs?.dustCapacity || "",
        noiseLevel: product.specs?.noiseLevel || "",
        attachments: product.specs?.attachments || [],
        batteryLife: product.specs?.batteryLife || "",
        chargingTime: product.specs?.chargingTime || "",
        runtime: product.specs?.runtime || "",
        autoDocking: product.specs?.autoDocking || false,
        mappingTechnology: product.specs?.mappingTechnology || "",
        appControl: product.specs?.appControl || false,
        voiceControl: product.specs?.voiceControl || false,
        scheduling: product.specs?.scheduling || false,
        multiFloorMapping: product.specs?.multiFloorMapping || false,
        ironType: product.specs?.ironType || "",
        soleplateType: product.specs?.soleplateType || "",
        waterTankCapacity: product.specs?.waterTankCapacity || "",
        steamOutput: product.specs?.steamOutput || "",
        verticalSteam: product.specs?.verticalSteam || false,
        antiDrip: product.specs?.antiDrip || false,
        autoShutOff: product.specs?.autoShutOff || false,
        selfClean: product.specs?.selfClean || false,
        cordless: product.specs?.cordless || false,
        cleaningWidth: product.specs?.cleaningWidth || "",
        solutionTankCapacity: product.specs?.solutionTankCapacity || "",
        dirtyWaterTankCapacity: product.specs?.dirtyWaterTankCapacity || "",
        brushType: product.specs?.brushType || "",
        scrubbingBrushes: product.specs?.scrubbingBrushes || "",
        dryingFunction: product.specs?.dryingFunction || false,
      },

      features: product.features || [],
      whatsInTheBox: product.whatsInTheBox || [],
      compatibleWith: product.compatibleWith || [],
      isFeatured: product.isFeatured || false,
      isActive: product.isActive !== false,
      meta: {
        title: product.meta?.title || "",
        description: product.meta?.description || "",
        keywords: product.meta?.keywords || []
      }
    });

    // Handle image previews
    let imageUrls = [];
    if (product.image && Array.isArray(product.image) && product.image.length > 0) {
      imageUrls = product.image.map(img => 
        img.startsWith('http') ? img : `${BASE_URL}/uploads/${img.split('/').pop()}`
      );
    } else if (product.image && typeof product.image === 'string') {
      imageUrls = [product.image.startsWith('http') ? product.image : `${BASE_URL}/uploads/${product.image.split('/').pop()}`];
    } else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      imageUrls = product.images.map(img => 
        img.startsWith('http') ? img : `${BASE_URL}/uploads/${img.split('/').pop()}`
      );
    }

    setLaundryImagePreview(imageUrls);
    setIsEditingLaundry(true);
  };

  const handleDeleteLaundry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this laundry appliance?")) return;

    try {
      const response = await fetch(`${BASE_URL}/api/laundry/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete laundry appliance");

      alert("Laundry appliance deleted successfully!");
      fetchLaundryProducts();
    } catch (error) {
      console.error("Error deleting laundry appliance:", error);
      setError("Failed to delete laundry appliance");
    }
  };

  const handleToggleLaundryFeatured = async (id, currentFeatured) => {
    try {
      const response = await fetch(`${BASE_URL}/api/laundry/admin/${id}/featured`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });

      if (!response.ok) throw new Error("Failed to toggle featured status");

      alert(`Laundry appliance ${!currentFeatured ? 'added to' : 'removed from'} featured`);
      fetchLaundryProducts();
    } catch (error) {
      console.error("Error toggling featured status:", error);
      setError("Failed to toggle featured status");
    }
  };

  // Fetch kitchen products
  const fetchKitchenProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/kitchen`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      console.log('Kitchen API response:', data);

      if (data.success && Array.isArray(data.products)) {
        // No need to modify the data, keep as is
        setKitchenProducts(data.products);
      } else if (Array.isArray(data)) {
        setKitchenProducts(data);
      } else if (data.data && Array.isArray(data.data)) {
        setKitchenProducts(data.data);
      } else {
        console.error('Unexpected API response format:', data);
        setKitchenProducts([]);
      }
    } catch (error) {
      console.error("Error fetching kitchen products:", error);
      setError("Failed to load kitchen products");
    }
  };

  // Load kitchen products on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchKitchenProducts();
    }
  }, [isAuthenticated]);

  // Kitchen form handlers
  const handleKitchenInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle nested specs fields
    if (name.startsWith('specs.')) {
      const specsField = name.replace('specs.', '');

      // Check if this is an array field
      if (specsField === 'smartFeatures' || specsField === 'safetyFeatures') {
        // Convert comma-separated string to array
        const arrayValue = value.split(',')
          .map(item => item.trim())
          .filter(item => item !== '');

        setKitchenFormData(prev => ({
          ...prev,
          specs: {
            ...prev.specs,
            [specsField]: arrayValue
          }
        }));
      } else {
        setKitchenFormData(prev => ({
          ...prev,
          specs: {
            ...prev.specs,
            [specsField]: type === 'checkbox' ? checked : value
          }
        }));
      }
    }
    // Handle array fields at root level
    else if (name === 'features' || name === 'whatsInTheBox') {
      const arrayValue = value.split(',')
        .map(item => item.trim())
        .filter(item => item !== '');

      setKitchenFormData(prev => ({ ...prev, [name]: arrayValue }));
    }
    // Handle meta fields
    else if (name.startsWith('meta.')) {
      const metaField = name.replace('meta.', '');
      setKitchenFormData(prev => ({
        ...prev,
        meta: {
          ...prev.meta,
          [metaField]: metaField === 'keywords' ? 
            value.split(',').map(k => k.trim()).filter(k => k !== '') : 
            value
        }
      }));
    }
    else if (type === 'checkbox') {
      setKitchenFormData(prev => ({ ...prev, [name]: checked }));
    }
    else {
      setKitchenFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleKitchenImageChange = (e) => {
    const imageFiles = e.target.files;
    if (imageFiles && imageFiles.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validFiles = Array.from(imageFiles).filter(file => allowedTypes.includes(file.type));

      if (validFiles.length !== imageFiles.length) {
        alert('Some files are invalid. Only JPEG, PNG, GIF, and WEBP are allowed.');
        return;
      }

      const previewUrls = validFiles.map(file => URL.createObjectURL(file));
      setKitchenImagePreview(prev => [...prev, ...previewUrls]);

      setKitchenFormData(prev => ({
        ...prev,
        image: Array.isArray(prev.image) ? [...prev.image, ...validFiles] : [...validFiles],
      }));
    }
  };

  const handleKitchenImageRemove = (index) => {
    setKitchenImagePreview(prev => prev.filter((_, i) => i !== index));
    setKitchenFormData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }));
  };

  const resetKitchenForm = () => {
    setKitchenFormData({
      id: "",
      name: "",
      type: "",
      brand: "",
      price: "",
      originalPrice: "",
      description: "",
      shortDescription: "",
      image: null,
      additionalImages: [],
      stock: 0,
      sku: "",
      discount: 0,
      specs: {
        color: "",
        weight: "",
        dimensions: "",
        material: "",
        voltage: "",
        powerConsumption: "",
        warranty: "",
        capacity: "",
        energyRating: "",
        defrostType: "",
        compressor: "",
        coolingTechnology: "",
        refrigeratorType: "",
        freezerCapacity: "",
        iceMaker: false,
        waterDispenser: false,
        ovenType: "",
        numberOfBurners: "",
        burnerType: "",
        thermostatRange: "",
        timer: false,
        selfCleaning: false,
        microwaveType: "",
        powerLevels: "",
        autoCook: false,
        defrost: false,
        turntable: false,
        placeSettings: "",
        washPrograms: "",
        waterConsumption: "",
        noiseLevel: "",
        dryingSystem: "",
        wattage: "",
        speedSettings: "",
        jarMaterial: "",
        dishwasherSafe: false,
        cordless: false,
        filterType: "",
        purificationTechnology: "",
        storageCapacity: "",
        stages: "",
        tdsController: false,
        smartFeatures: [],
        safetyFeatures: [],
      },
      features: [],
      whatsInTheBox: [],
      isFeatured: false,
      isActive: true,
      meta: {
        title: "",
        description: "",
        keywords: []
      }
    });
    setKitchenImagePreview([]);
    setIsEditingKitchen(false);
  };

  const handleKitchenSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Prepare data
      const kitchenData = {
        ...kitchenFormData,
        stock: Number(kitchenFormData.stock) || 0,
        discount: Number(kitchenFormData.discount) || 0,
        price: Number(kitchenFormData.price) || 0,
        originalPrice: Number(kitchenFormData.originalPrice) || 0
      };

      // Append all fields
      Object.keys(kitchenData).forEach(key => {
        if (key === 'image' || key === 'additionalImages' || key === 'specs' || key === 'meta') return;

        if (Array.isArray(kitchenData[key])) {
          if (kitchenData[key].length > 0) {
            formDataToSend.append(key, JSON.stringify(kitchenData[key]));
          }
        } else if (kitchenData[key] !== undefined && kitchenData[key] !== null && kitchenData[key] !== '') {
          formDataToSend.append(key, kitchenData[key].toString());
        }
      });

      // Append specs object
      if (kitchenData.specs) {
        const cleanedSpecs = {};
        Object.keys(kitchenData.specs).forEach(key => {
          if (kitchenData.specs[key] !== undefined && kitchenData.specs[key] !== null && kitchenData.specs[key] !== '') {
            cleanedSpecs[key] = kitchenData.specs[key];
          }
        });
        if (Object.keys(cleanedSpecs).length > 0) {
          formDataToSend.append('specs', JSON.stringify(cleanedSpecs));
        }
      }

      // Append meta object
      if (kitchenData.meta) {
        const cleanedMeta = {};
        Object.keys(kitchenData.meta).forEach(key => {
          if (kitchenData.meta[key] !== undefined && kitchenData.meta[key] !== null && kitchenData.meta[key] !== '') {
            cleanedMeta[key] = kitchenData.meta[key];
          }
        });
        if (Object.keys(cleanedMeta).length > 0) {
          formDataToSend.append('meta', JSON.stringify(cleanedMeta));
        }
      }

      // Append images
      if (kitchenData.image && kitchenData.image.length > 0) {
        kitchenData.image.forEach(file => {
          if (file instanceof File) {
            formDataToSend.append('images', file);
          }
        });
      }

      const url = kitchenData.id
        ? `${BASE_URL}/api/kitchen/admin/${kitchenData.id}`
        : `${BASE_URL}/api/kitchen/admin`;

      const method = kitchenData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.details?.join(', ') || responseData.error || "Failed to save kitchen appliance");
      }

      alert(kitchenData.id ? "Kitchen appliance updated successfully!" : "Kitchen appliance created successfully!");

      fetchKitchenProducts();
      resetKitchenForm();
    } catch (error) {
      console.error("Error saving kitchen appliance:", error);
      setError(error.message || "Failed to save kitchen appliance");
    }
  };

  const handleEditKitchen = (product) => {
    setKitchenFormData({
      id: product._id || product.id,
      name: product.name || "",
      type: product.type || "",
      brand: product.brand || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      image: product.image || null,
      additionalImages: product.additionalImages || [],
      stock: product.stock || 0,
      sku: product.sku || product.code || "",
      discount: product.discount || 0,

      // Map specs from product.specs
      specs: {
        color: product.specs?.color || "",
        weight: product.specs?.weight || "",
        dimensions: product.specs?.dimensions || "",
        material: product.specs?.material || "",
        voltage: product.specs?.voltage || "",
        powerConsumption: product.specs?.powerConsumption || "",
        warranty: product.specs?.warranty || "",
        capacity: product.specs?.capacity || "",
        energyRating: product.specs?.energyRating || "",
        defrostType: product.specs?.defrostType || "",
        compressor: product.specs?.compressor || "",
        coolingTechnology: product.specs?.coolingTechnology || "",
        refrigeratorType: product.specs?.refrigeratorType || "",
        freezerCapacity: product.specs?.freezerCapacity || "",
        iceMaker: product.specs?.iceMaker || false,
        waterDispenser: product.specs?.waterDispenser || false,
        ovenType: product.specs?.ovenType || "",
        numberOfBurners: product.specs?.numberOfBurners || "",
        burnerType: product.specs?.burnerType || "",
        thermostatRange: product.specs?.thermostatRange || "",
        timer: product.specs?.timer || false,
        selfCleaning: product.specs?.selfCleaning || false,
        microwaveType: product.specs?.microwaveType || "",
        powerLevels: product.specs?.powerLevels || "",
        autoCook: product.specs?.autoCook || false,
        defrost: product.specs?.defrost || false,
        turntable: product.specs?.turntable || false,
        placeSettings: product.specs?.placeSettings || "",
        washPrograms: product.specs?.washPrograms || "",
        waterConsumption: product.specs?.waterConsumption || "",
        noiseLevel: product.specs?.noiseLevel || "",
        dryingSystem: product.specs?.dryingSystem || "",
        wattage: product.specs?.wattage || "",
        speedSettings: product.specs?.speedSettings || "",
        jarMaterial: product.specs?.jarMaterial || "",
        dishwasherSafe: product.specs?.dishwasherSafe || false,
        cordless: product.specs?.cordless || false,
        filterType: product.specs?.filterType || "",
        purificationTechnology: product.specs?.purificationTechnology || "",
        storageCapacity: product.specs?.storageCapacity || "",
        stages: product.specs?.stages || "",
        tdsController: product.specs?.tdsController || false,
        smartFeatures: Array.isArray(product.specs?.smartFeatures) 
          ? product.specs.smartFeatures 
          : (product.specs?.smartFeatures ? [product.specs.smartFeatures] : []),
        safetyFeatures: Array.isArray(product.specs?.safetyFeatures) 
          ? product.specs.safetyFeatures 
          : (product.specs?.safetyFeatures ? [product.specs.safetyFeatures] : []),
      },

      features: Array.isArray(product.features) 
        ? product.features 
        : (product.features ? [product.features] : []),
      whatsInTheBox: Array.isArray(product.whatsInTheBox) 
        ? product.whatsInTheBox 
        : (product.whatsInTheBox ? [product.whatsInTheBox] : []),
      isFeatured: product.isFeatured || false,
      isActive: product.isActive !== false,
      meta: {
        title: product.meta?.title || "",
        description: product.meta?.description || "",
        keywords: product.meta?.keywords || []
      }
    });

    // Handle image previews
    let imageUrls = [];
    if (product.image && Array.isArray(product.image) && product.image.length > 0) {
      imageUrls = product.image.map(img => 
        img.startsWith('http') ? img : `${BASE_URL}/uploads/${img.split('/').pop()}`
      );
    } else if (product.image && typeof product.image === 'string') {
      imageUrls = [product.image.startsWith('http') ? product.image : `${BASE_URL}/uploads/${product.image.split('/').pop()}`];
    } else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      imageUrls = product.images.map(img => 
        img.startsWith('http') ? img : `${BASE_URL}/uploads/${img.split('/').pop()}`
      );
    }

    setKitchenImagePreview(imageUrls);
    setIsEditingKitchen(true);
  };

  const handleDeleteKitchen = async (id) => {
    if (!window.confirm("Are you sure you want to delete this kitchen appliance?")) return;

    try {
      const response = await fetch(`${BASE_URL}/api/kitchen/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete kitchen appliance");

      alert("Kitchen appliance deleted successfully!");
      fetchKitchenProducts();
    } catch (error) {
      console.error("Error deleting kitchen appliance:", error);
      setError("Failed to delete kitchen appliance");
    }
  };

  const handleToggleKitchenFeatured = async (id, currentFeatured) => {
    try {
      const response = await fetch(`${BASE_URL}/api/kitchen/admin/${id}/featured`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });

      if (!response.ok) throw new Error("Failed to toggle featured status");

      alert(`Kitchen appliance ${!currentFeatured ? 'added to' : 'removed from'} featured`);
      fetchKitchenProducts();
    } catch (error) {
      console.error("Error toggling featured status:", error);
      setError("Failed to toggle featured status");
    }
  };

  const getDisplayCategoryColor = (category) => {
    switch(category) {
      case 'gaming':
        return 'bg-red-600';
      case 'professional':
        return 'bg-purple-600';
      case 'ultrawide':
        return 'bg-blue-600';
      case 'office':
        return 'bg-green-600';
      case 'portable':
        return 'bg-orange-600';
      case 'touchscreen':
        return 'bg-indigo-600';
      case '4k':
        return 'bg-yellow-600';
      case 'curved':
        return 'bg-pink-600';
      default:
        return 'bg-gray-600';
    }
  };

  // Fetch display products
  const fetchDisplayProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/displays`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      console.log('Display API response:', data);
    
      // Check if the response has the expected structure
      if (data.success && Array.isArray(data.displays)) {
        // Map the data to ensure all fields are present
        const mappedDisplays = data.displays.map(display => ({
          ...display,
          inStock: display.inStock ? 'yes' : 'no',
          featured: display.featured || display.isFeatured || false,
          // Ensure specs fields are accessible at top level for display
          screenSize: display.specs?.size || display.specs?.screenSize || display.screenSize,
          resolution: display.specs?.resolution || display.resolution,
          panelType: display.specs?.panelType || display.specs?.panel || display.panelType,
          refreshRate: display.specs?.refreshRate || display.refreshRate,
          curved: display.specs?.curved || display.curved,
          touchscreen: display.specs?.touchscreen || display.touchscreen,
        }));
        setDisplayProducts(mappedDisplays);
      } else if (Array.isArray(data)) {
        setDisplayProducts(data);
      } else if (data.data && Array.isArray(data.data)) {
        setDisplayProducts(data.data);
      } else {
        console.error('Unexpected API response format:', data);
        setDisplayProducts([]);
      }
    } catch (error) {
      console.error("Error fetching display products:", error);
      setError("Failed to load display products");
    }
  };

  // Load display products on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchDisplayProducts();
    }
  }, [isAuthenticated]);

  // Display form handlers
  const handleDisplayInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle array fields
    const arrayFields = ['features', 'ports'];
    if (arrayFields.includes(name)) {
      const values = value.split(',').map(item => item.trim());
      setDisplayFormData(prev => ({ ...prev, [name]: values }));
    } else if (type === 'checkbox') {
      setDisplayFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setDisplayFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDisplayImageChange = (e) => {
    const imageFiles = e.target.files;
    if (imageFiles && imageFiles.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validFiles = Array.from(imageFiles).filter(file => allowedTypes.includes(file.type));

      if (validFiles.length !== imageFiles.length) {
        alert('Some files are invalid. Only JPEG, PNG, GIF, and WEBP are allowed.');
        return;
      }

      const previewUrls = validFiles.map(file => URL.createObjectURL(file));
      setDisplayImagePreview(prev => [...prev, ...previewUrls]);

      setDisplayFormData(prev => ({
        ...prev,
        image: Array.isArray(prev.image) ? [...prev.image, ...validFiles] : [...validFiles],
      }));
    }
  };

  const handleDisplayImageRemove = (index) => {
    setDisplayImagePreview(prev => prev.filter((_, i) => i !== index));
    setDisplayFormData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }));
  };

  const resetDisplayForm = () => {
    setDisplayFormData({
      id: "",
      name: "",
      brand: "",
      model: "",
      price: "",
      originalPrice: "",
      category: "gaming",
      description: "",
      features: [],
      ports: [],
      resolution: "",
      screenSize: "",
      panelType: "",
      refreshRate: "",
      responseTime: "",
      brightness: "",
      contrastRatio: "",
      aspectRatio: "",
      colorGamut: "",
      viewingAngle: "",
      hdrSupport: "",
      adaptiveSync: "",
      curved: false,
      touchscreen: false,
      vesaMount: "",
      dimensions: "",
      weight: "",
      color: "",
      warranty: "",
      inStock: "yes",
      quantity: "",
      code: "",
      discount: "",
      bonuses: "",
      dateAdded: "",
      popularity: "0",
      condition: "New",
      featured: false,
      image: null,
      additionalImages: [],
      keyFeatures: [{ title: "", description: "" }],
      specifications: [{ title: "", specs: [{ name: "", value: "" }] }],
      otherTechnicalDetails: [{ name: "", value: "" }],
      notes: [""],
      videos: [{ title: "", url: "" }],
    });
    setDisplayImagePreview([]);
    setIsEditingDisplay(false);
  };

  const handleDisplaySubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();

      // First, collect all specs-related fields into a specs object
      const specsFields = {
        size: displayFormData.screenSize,
        resolution: displayFormData.resolution,
        panelType: displayFormData.panelType,
        refreshRate: displayFormData.refreshRate,
        responseTime: displayFormData.responseTime,
        brightness: displayFormData.brightness,
        contrastRatio: displayFormData.contrastRatio,
        aspectRatio: displayFormData.aspectRatio,
        colorGamut: displayFormData.colorGamut,
        viewingAngle: displayFormData.viewingAngle,
        hdr: displayFormData.hdrSupport,
        curved: displayFormData.curved,
        gSync: displayFormData.adaptiveSync?.toLowerCase().includes('g-sync'),
        freeSync: displayFormData.adaptiveSync?.toLowerCase().includes('free-sync'),
        builtInSpeakers: displayFormData.features?.includes('Speakers'),
        usbTypeC: displayFormData.ports?.includes('USB-C'),
        vesaMount: displayFormData.vesaMount,
        weight: displayFormData.weight,
        dimensions: displayFormData.dimensions,
        color: displayFormData.color,
        warranty: displayFormData.warranty
      };

      // Remove empty specs fields
      Object.keys(specsFields).forEach(key => {
        if (specsFields[key] === undefined || specsFields[key] === null || specsFields[key] === '') {
          delete specsFields[key];
        }
      });

      // Append basic fields (non-specs fields)
      const basicFields = {
        id: displayFormData.id,
        name: displayFormData.name,
        brand: displayFormData.brand,
        model: displayFormData.model,
        price: displayFormData.price,
        originalPrice: displayFormData.originalPrice,
        category: displayFormData.category,
        description: displayFormData.description,
        inStock: displayFormData.inStock,
        quantity: displayFormData.quantity,
        code: displayFormData.code,
        discount: displayFormData.discount,
        bonuses: displayFormData.bonuses,
        dateAdded: displayFormData.dateAdded,
        popularity: displayFormData.popularity,
        condition: displayFormData.condition,
        featured: displayFormData.featured,
      };

      // Append basic fields
      Object.keys(basicFields).forEach(key => {
        if (basicFields[key] !== undefined && basicFields[key] !== null && basicFields[key] !== '') {
          formDataToSend.append(key, basicFields[key]);
        }
      });

      // Append specs object as JSON string
      if (Object.keys(specsFields).length > 0) {
        formDataToSend.append('specs', JSON.stringify(specsFields));
      }

      // Handle array fields (features, ports, etc.)
      const arrayFields = {
        features: displayFormData.features,
        ports: displayFormData.ports,
        keyFeatures: displayFormData.keyFeatures,
        specifications: displayFormData.specifications,
        otherTechnicalDetails: displayFormData.otherTechnicalDetails,
        notes: displayFormData.notes,
        videos: displayFormData.videos
      };

      Object.keys(arrayFields).forEach(key => {
        if (Array.isArray(arrayFields[key]) && arrayFields[key].length > 0) {
          // Filter out empty values
          const filteredArray = arrayFields[key].filter(item => 
            item && (typeof item !== 'string' || item.trim() !== '')
          );
          if (filteredArray.length > 0) {
            formDataToSend.append(key, JSON.stringify(filteredArray));
          }
        }
      });

      // Handle images (same as before)
      let existingImages = [];
      let newImages = [];

      if (displayFormData.image) {
        if (Array.isArray(displayFormData.image)) {
          displayFormData.image.forEach(item => {
            if (typeof item === 'string') {
              existingImages.push(item);
            } else if (item instanceof File) {
              newImages.push(item);
            }
          });
        } else if (typeof displayFormData.image === 'string') {
          existingImages.push(displayFormData.image);
        } else if (displayFormData.image instanceof File) {
          newImages.push(displayFormData.image);
        }
      }

      if (displayFormData.additionalImages && displayFormData.additionalImages.length > 0) {
        displayFormData.additionalImages.forEach(item => {
          if (typeof item === 'string') {
            existingImages.push(item);
          } else if (item instanceof File) {
            newImages.push(item);
          }
        });
      }

      if (existingImages.length > 0) {
        formDataToSend.append('existingImages', JSON.stringify(existingImages));
      }

      if (newImages.length > 0) {
        newImages.forEach(file => {
          if (file instanceof File) {
            formDataToSend.append('images', file);
          }
        });
      }

      // Debug log
      console.log('FormData contents:');
      for (let pair of formDataToSend.entries()) {
        if (pair[0] === 'images') {
          console.log(pair[0], pair[1].name);
        } else {
          console.log(pair[0], pair[1]);
        }
      }

      const url = displayFormData.id
        ? `${BASE_URL}/api/displays/admin/${displayFormData.id}`
        : `${BASE_URL}/api/displays/admin`;

      const method = displayFormData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save display product");
      }

      const responseData = await response.json();
      console.log('Display save response:', responseData);

      alert(displayFormData.id ? "Display product updated successfully!" : "Display product created successfully!");

      fetchDisplayProducts();
      resetDisplayForm();
    } catch (error) {
      console.error("Error saving display product:", error);
      setError(error.message || "Failed to save display product");
    }
  };

  const handleEditDisplay = (product) => {
    setDisplayFormData({
      id: product._id || product.id,
      name: product.name || "",
      brand: product.brand || "",
      model: product.model || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      category: product.category || "gaming",
      description: product.description || "",
      features: product.features || [],
      ports: product.ports || [],
      // Map from specs object
      resolution: product.specs?.resolution || "",
      screenSize: product.specs?.size || product.specs?.screenSize || "",
      panelType: product.specs?.panelType || product.specs?.panel || "",
      refreshRate: product.specs?.refreshRate || "",
      responseTime: product.specs?.responseTime || "",
      brightness: product.specs?.brightness || "",
      contrastRatio: product.specs?.contrastRatio || "",
      aspectRatio: product.specs?.aspectRatio || "",
      colorGamut: product.specs?.colorGamut || "",
      viewingAngle: product.specs?.viewingAngle || "",
      hdrSupport: product.specs?.hdr || "",
      adaptiveSync: product.specs?.gSync ? 'G-Sync' : (product.specs?.freeSync ? 'FreeSync' : ''),
      curved: product.specs?.curved || false,
      touchscreen: product.specs?.touchscreen || false,
      vesaMount: product.specs?.vesaMount || "",
      dimensions: product.specs?.dimensions || "",
      weight: product.specs?.weight || "",
      color: product.specs?.color || "",
      warranty: product.specs?.warranty || "",
      inStock: product.inStock ? "yes" : "no",
      quantity: product.quantity || "",
      code: product.code || "",
      discount: product.discount || "",
      bonuses: product.bonuses || "",
      dateAdded: product.dateAdded ? product.dateAdded.split('T')[0] : "",
      popularity: product.popularity || "0",
      condition: product.condition || "New",
      featured: product.featured || product.isFeatured || false,
      image: product.image || null,
      additionalImages: product.additionalImages || [],
      keyFeatures: product.keyFeatures || [{ title: "", description: "" }],
      specifications: product.specifications || [{ title: "", specs: [{ name: "", value: "" }] }],
      otherTechnicalDetails: product.otherTechnicalDetails || [{ name: "", value: "" }],
      notes: product.notes || [""],
      videos: product.videos || [{ title: "", url: "" }],
    });

    // Handle image previews
    let imageUrls = [];
    let imageFiles = [];

    if (product.image && Array.isArray(product.image) && product.image.length > 0) {
      imageUrls = product.image.map(img => 
        img.startsWith('http') ? img : `${BASE_URL}/uploads/${img.split('/').pop()}`
      );
      imageFiles = product.image;
    } else if (product.image && typeof product.image === 'string') {
      imageUrls = [product.image.startsWith('http') 
        ? product.image 
        : `${BASE_URL}/uploads/${product.image.split('/').pop()}`];
      imageFiles = [product.image];
    } else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      imageUrls = product.images.map(img => 
        img.startsWith('http') ? img : `${BASE_URL}/uploads/${img.split('/').pop()}`
      );
      imageFiles = product.images;
    }

    setDisplayImagePreview(imageUrls);
    setDisplayFormData(prev => ({
      ...prev,
      image: imageFiles,
    }));
    setIsEditingDisplay(true);
  };

  const handleDeleteDisplay = async (id) => {
    if (!window.confirm("Are you sure you want to delete this display product?")) return;

    try {
      const response = await fetch(`${BASE_URL}/api/displays/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete display product");

      alert("Display product deleted successfully!");
      fetchDisplayProducts();
    } catch (error) {
      console.error("Error deleting display product:", error);
      setError("Failed to delete display product");
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      const response = await fetch(`${BASE_URL}/api/displays/admin/${id}/featured`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      if (!response.ok) throw new Error("Failed to toggle featured status");

      alert(`Display ${!currentFeatured ? 'added to' : 'removed from'} featured`);
      fetchDisplayProducts();
    } catch (error) {
      console.error("Error toggling featured status:", error);
      setError("Failed to toggle featured status");
    }
  };

  // Filter display products
  const filteredDisplayProducts = displayProducts.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(displaySearchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(displaySearchTerm.toLowerCase()) ||
                         product.model?.toLowerCase().includes(displaySearchTerm.toLowerCase());

    const matchesCategory = displayCategoryFilter === 'all' || 
                           product.category === displayCategoryFilter ||
                           (Array.isArray(product.category) && product.category.includes(displayCategoryFilter));

    const matchesBrand = displayBrandFilter === 'all' || product.brand === displayBrandFilter;

    return matchesSearch && matchesCategory && matchesBrand;
  });

  // Get unique brands for filter
  const displayBrands = [...new Set(displayProducts.map(p => p.brand).filter(Boolean))];

  // Fetch wearable products
  const fetchWearableProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/wearables`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setWearableProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching wearable products:", error);
      setError("Failed to load wearable products");
    }
  };

  // Load wearable products on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchWearableProducts();
    }
  }, [isAuthenticated]);

  // Wearable form handlers
  const handleWearableInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle array fields
    const arrayFields = ['colors', 'workoutTracking', 'compatibleOS', 'paymentServices'];
    if (arrayFields.includes(name)) {
      const values = value.split(',').map(item => item.trim());
      setWearableFormData(prev => ({ ...prev, [name]: values }));
    } else if (type === 'checkbox') {
      setWearableFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setWearableFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleWearableImageChange = (e) => {
    const imageFiles = e.target.files;
    if (imageFiles && imageFiles.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validFiles = Array.from(imageFiles).filter(file => allowedTypes.includes(file.type));

      if (validFiles.length !== imageFiles.length) {
        alert('Some files are invalid. Only JPEG, PNG, GIF, and WEBP are allowed.');
        return;
      }

      const previewUrls = validFiles.map(file => URL.createObjectURL(file));
      setWearableImagePreview(prev => [...prev, ...previewUrls]);

      setWearableFormData(prev => ({
        ...prev,
        image: Array.isArray(prev.image) ? [...prev.image, ...validFiles] : [...validFiles],
      }));
    }
  };

  const handleWearableImageRemove = (index) => {
    setWearableImagePreview(prev => prev.filter((_, i) => i !== index));
    setWearableFormData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }));
  };

  const resetWearableForm = () => {
    setWearableFormData({
      id: "",
      type: "Smartwatch",
      name: "",
      price: "",
      originalPrice: "",
      brand: "",
      category: "",
      description: "",
      image: null,
      additionalImages: [],
      stock: "yes",
      code: "",
      discount: "",
      bonuses: "",
      dateAdded: "",
      popularity: "0",
      condition: "New",

      // Display
      displayType: "",
      displaySize: "",
      screenResolution: "",
      alwaysOnDisplay: false,
      touchscreen: true,
      colorDisplay: true,

      // Physical
      caseMaterial: "",
      strapMaterial: "",
      strapSize: "",
      interchangeableStraps: false,
      dimensions: "",
      weight: "",
      colors: [],

      // Health Sensors
      heartRateMonitor: false,
      bloodOxygenSensor: false,
      ecgSensor: false,
      temperatureSensor: false,
      skinTemperatureSensor: false,
      respirationRate: false,
      stressTracking: false,
      sleepTracking: false,
      stepCounter: true,
      calorieTracking: false,
      distanceTracking: false,
      floorsClimbed: false,
      fallDetection: false,

      // Fitness Features
      workoutModes: "",
      workoutTracking: [],
      autoWorkoutDetection: false,
      gps: false,
      glonass: false,
      galileo: false,
      compass: false,
      altimeter: false,
      barometer: false,

      // Connectivity
      bluetooth: true,
      bluetoothVersion: "",
      wifi: false,
      nfc: false,
      mobileConnectivity: false,
      simSupport: false,
      esimSupport: false,

      // Smart Features
      operatingSystem: "",
      compatibleOS: [],
      voiceAssistant: false,
      voiceAssistantType: "",
      notifications: true,
      musicControl: false,
      musicStorage: false,
      onboardMusic: "",
      callsViaWatch: false,
      speaker: false,
      microphone: false,
      cameraControl: false,
      findMyPhone: false,

      // Payments
      nfcPayments: false,
      paymentServices: [],

      // Navigation
      maps: false,
      turnByTurnNavigation: false,

      // Water Resistance
      waterResistant: "",
      swimProof: false,
      swimTracking: false,

      // Battery
      batteryType: "",
      batteryCapacity: "",
      batteryLife: "",
      batteryLifeMode: "",
      chargingTime: "",
      wirelessCharging: false,
      fastCharging: false,

      // Sensors
      accelerometer: true,
      gyroscope: false,
      ambientLightSensor: false,
      proximitySensor: false,

      // General
      warranty: "",
      releaseYear: "",
      manufacturer: "",
      countryOfOrigin: "",

      // Common fields
      keyFeatures: [{ title: "", description: "" }],
      specifications: [{ title: "", specs: [{ name: "", value: "" }] }],
      otherTechnicalDetails: [{ name: "", value: "" }],
      notes: [""],
      videos: [{ title: "", url: "" }],
    });
    setWearableImagePreview([]);
    setIsEditingWearable(false);
  };

  const handleWearableSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Append all basic fields
      Object.keys(wearableFormData).forEach(key => {
        if (key === 'image' || key === 'additionalImages') return;

        // Handle array fields by stringifying them
        const arrayFields = ['colors', 'workoutTracking', 'compatibleOS', 'paymentServices', 'keyFeatures', 'specifications', 'otherTechnicalDetails', 'notes', 'videos'];
        if (arrayFields.includes(key)) {
          if (Array.isArray(wearableFormData[key]) && wearableFormData[key].length > 0) {
            formDataToSend.append(key, JSON.stringify(wearableFormData[key]));
          }
        } else {
          formDataToSend.append(key, wearableFormData[key]);
        }
      });

      // Append images
      if (wearableFormData.image && wearableFormData.image.length > 0) {
        wearableFormData.image.forEach(file => {
          if (file instanceof File) {
            formDataToSend.append('image', file);
          }
        });
      }

      const url = wearableFormData.id
        ? `${BASE_URL}/api/wearables/${wearableFormData.id}`
        : `${BASE_URL}/api/wearables`;

      const method = wearableFormData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to save wearable product");

      alert(wearableFormData.id ? "Wearable product updated successfully!" : "Wearable product created successfully!");

      fetchWearableProducts();
      resetWearableForm();
    } catch (error) {
      console.error("Error saving wearable product:", error);
      setError("Failed to save wearable product");
    }
  };

  const handleEditWearable = (product) => {
    setWearableFormData({
      id: product._id,
      type: product.type || "Smartwatch",
      name: product.name || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      brand: product.brand || "",
      category: Array.isArray(product.category) ? product.category.join(', ') : product.category || "",
      description: product.description || "",
      image: product.image || null,
      additionalImages: product.additionalImages || [],
      stock: product.inStock ? "yes" : "no",
      code: product.code || "",
      discount: product.discount || "",
      bonuses: product.bonuses || "",
      dateAdded: product.dateAdded ? product.dateAdded.split('T')[0] : "",
      popularity: product.popularity || "0",
      condition: product.condition || "New",

      // Display
      displayType: product.specs?.displayType || "",
      displaySize: product.specs?.displaySize || "",
      screenResolution: product.specs?.screenResolution || "",
      alwaysOnDisplay: product.specs?.alwaysOnDisplay || false,
      touchscreen: product.specs?.touchscreen !== false,
      colorDisplay: product.specs?.colorDisplay !== false,

      // Physical
      caseMaterial: product.specs?.caseMaterial || "",
      strapMaterial: product.specs?.strapMaterial || "",
      strapSize: product.specs?.strapSize || "",
      interchangeableStraps: product.specs?.interchangeableStraps || false,
      dimensions: product.specs?.dimensions || "",
      weight: product.specs?.weight || "",
      colors: product.specs?.colors || [],

      // Health Sensors
      heartRateMonitor: product.specs?.heartRateMonitor || false,
      bloodOxygenSensor: product.specs?.bloodOxygenSensor || false,
      ecgSensor: product.specs?.ecgSensor || false,
      temperatureSensor: product.specs?.temperatureSensor || false,
      skinTemperatureSensor: product.specs?.skinTemperatureSensor || false,
      respirationRate: product.specs?.respirationRate || false,
      stressTracking: product.specs?.stressTracking || false,
      sleepTracking: product.specs?.sleepTracking || false,
      stepCounter: product.specs?.stepCounter !== false,
      calorieTracking: product.specs?.calorieTracking || false,
      distanceTracking: product.specs?.distanceTracking || false,
      floorsClimbed: product.specs?.floorsClimbed || false,
      fallDetection: product.specs?.fallDetection || false,

      // Fitness Features
      workoutModes: product.specs?.workoutModes || "",
      workoutTracking: product.specs?.workoutTracking || [],
      autoWorkoutDetection: product.specs?.autoWorkoutDetection || false,
      gps: product.specs?.gps || false,
      glonass: product.specs?.glonass || false,
      galileo: product.specs?.galileo || false,
      compass: product.specs?.compass || false,
      altimeter: product.specs?.altimeter || false,
      barometer: product.specs?.barometer || false,

      // Connectivity
      bluetooth: product.specs?.bluetooth !== false,
      bluetoothVersion: product.specs?.bluetoothVersion || "",
      wifi: product.specs?.wifi || false,
      nfc: product.specs?.nfc || false,
      mobileConnectivity: product.specs?.mobileConnectivity || false,
      simSupport: product.specs?.simSupport || false,
      esimSupport: product.specs?.esimSupport || false,

      // Smart Features
      operatingSystem: product.specs?.operatingSystem || "",
      compatibleOS: product.specs?.compatibleOS || [],
      voiceAssistant: product.specs?.voiceAssistant || false,
      voiceAssistantType: product.specs?.voiceAssistantType || "",
      notifications: product.specs?.notifications !== false,
      musicControl: product.specs?.musicControl || false,
      musicStorage: product.specs?.musicStorage || false,
      onboardMusic: product.specs?.onboardMusic || "",
      callsViaWatch: product.specs?.callsViaWatch || false,
      speaker: product.specs?.speaker || false,
      microphone: product.specs?.microphone || false,
      cameraControl: product.specs?.cameraControl || false,
      findMyPhone: product.specs?.findMyPhone || false,

      // Payments
      nfcPayments: product.specs?.nfcPayments || false,
      paymentServices: product.specs?.paymentServices || [],

      // Navigation
      maps: product.specs?.maps || false,
      turnByTurnNavigation: product.specs?.turnByTurnNavigation || false,

      // Water Resistance
      waterResistant: product.specs?.waterResistant || "",
      swimProof: product.specs?.swimProof || false,
      swimTracking: product.specs?.swimTracking || false,

      // Battery
      batteryType: product.specs?.batteryType || "",
      batteryCapacity: product.specs?.batteryCapacity || "",
      batteryLife: product.specs?.batteryLife || "",
      batteryLifeMode: product.specs?.batteryLifeMode || "",
      chargingTime: product.specs?.chargingTime || "",
      wirelessCharging: product.specs?.wirelessCharging || false,
      fastCharging: product.specs?.fastCharging || false,

      // Sensors
      accelerometer: product.specs?.accelerometer !== false,
      gyroscope: product.specs?.gyroscope || false,
      ambientLightSensor: product.specs?.ambientLightSensor || false,
      proximitySensor: product.specs?.proximitySensor || false,

      // General
      warranty: product.specs?.warranty || "",
      releaseYear: product.specs?.releaseYear || "",
      manufacturer: product.specs?.manufacturer || "",
      countryOfOrigin: product.specs?.countryOfOrigin || "",

      // Common fields
      keyFeatures: product.keyFeatures || [{ title: "", description: "" }],
      specifications: product.specifications || [{ title: "", specs: [{ name: "", value: "" }] }],
      otherTechnicalDetails: product.otherTechnicalDetails || [{ name: "", value: "" }],
      notes: product.notes || [""],
      videos: product.videos || [{ title: "", url: "" }],
    });

    if (product.image && product.image.length > 0) {
      const imageUrls = product.image.map(img => 
        img.startsWith('http') ? img : `${BASE_URL}/uploads/${img.split('/').pop()}`
      );
      setWearableImagePreview(imageUrls);
    }

    setIsEditingWearable(true);
  };

  const handleDeleteWearable = async (id) => {
    if (!window.confirm("Are you sure you want to delete this wearable product?")) return;

    try {
      const response = await fetch(`${BASE_URL}/api/wearables/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete wearable product");

      alert("Wearable product deleted successfully!");
      fetchWearableProducts();
    } catch (error) {
      console.error("Error deleting wearable product:", error);
      setError("Failed to delete wearable product");
    }
  };

  // Filter wearable products
  const filteredWearableProducts = wearableProducts.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(wearableSearchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(wearableSearchTerm.toLowerCase());

    const matchesType = wearableTypeFilter === 'all' || product.type === wearableTypeFilter;
    const matchesBrand = wearableBrandFilter === 'all' || product.brand === wearableBrandFilter;

    let matchesOs = true;
    if (wearableOsFilter !== 'all') {
      matchesOs = product.specs?.operatingSystem?.toLowerCase().includes(wearableOsFilter.toLowerCase());
    }

    let matchesFeature = true;
    if (wearableFeatureFilter !== 'all') {
      const specs = product.specs || {};
      switch(wearableFeatureFilter) {
        case 'Heart Rate Monitor':
          matchesFeature = specs.heartRateMonitor;
          break;
        case 'GPS':
          matchesFeature = specs.gps;
          break;
        case 'Water Resistant':
          matchesFeature = specs.waterResistant;
          break;
        case 'Sleep Tracking':
          matchesFeature = specs.sleepTracking;
          break;
        case 'Blood Oxygen (SpO2)':
          matchesFeature = specs.bloodOxygenSensor;
          break;
        case 'ECG':
          matchesFeature = specs.ecgSensor;
          break;
        case 'Stress Tracking':
          matchesFeature = specs.stressTracking;
          break;
        case 'Voice Assistant':
          matchesFeature = specs.voiceAssistant;
          break;
        case 'Music Control':
          matchesFeature = specs.musicControl;
          break;
        case 'NFC Payments':
          matchesFeature = specs.nfcPayments;
          break;
        case 'Bluetooth Calls':
          matchesFeature = specs.callsViaWatch;
          break;
        case 'Always-On Display':
          matchesFeature = specs.alwaysOnDisplay;
          break;
        default:
          matchesFeature = true;
      }
    }

    return matchesSearch && matchesType && matchesBrand && matchesOs && matchesFeature;
  });

  // Get unique brands for filter
  const wearableBrands = [...new Set(wearableProducts.map(p => p.brand).filter(Boolean))];

  // Get product type icon and color
  const getWearableTypeInfo = (type) => {
    switch(type) {
      case 'Smartwatch':
        return { icon: '⌚', color: 'bg-blue-600', textColor: 'text-blue-100' };
      case 'Fitness Tracker':
        return { icon: '🏃', color: 'bg-green-600', textColor: 'text-green-100' };
      case 'Activity Band':
        return { icon: '📿', color: 'bg-purple-600', textColor: 'text-purple-100' };
      case 'Hybrid Watch':
        return { icon: '⌚', color: 'bg-orange-600', textColor: 'text-orange-100' };
      case 'GPS Watch':
        return { icon: '🗺️', color: 'bg-red-600', textColor: 'text-red-100' };
      case 'Sports Watch':
        return { icon: '⚽', color: 'bg-yellow-600', textColor: 'text-yellow-100' };
      default:
        return { icon: '⌚', color: 'bg-gray-600', textColor: 'text-gray-100' };
    }
  };

  // Fetch TV products
  const fetchTVProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/tv`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setTvProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching TV products:", error);
      setError("Failed to load TV products");
    }
  };

  // Load TV products on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchTVProducts();
    }
  }, [isAuthenticated]);

  // TV form handlers
  const handleTVInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle array fields
    const arrayFields = ['audioTechnologies', 'streamingApps', 'includedAccessories'];
    if (arrayFields.includes(name)) {
      const values = value.split(',').map(item => item.trim());
      setTvFormData(prev => ({ ...prev, [name]: values }));
    } else if (type === 'checkbox') {
      setTvFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setTvFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTVImageChange = (e) => {
    const imageFiles = e.target.files;
    if (imageFiles && imageFiles.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validFiles = Array.from(imageFiles).filter(file => allowedTypes.includes(file.type));

      if (validFiles.length !== imageFiles.length) {
        alert('Some files are invalid. Only JPEG, PNG, GIF, and WEBP are allowed.');
        return;
      }

      const previewUrls = validFiles.map(file => URL.createObjectURL(file));
      setTvImagePreview(prev => [...prev, ...previewUrls]);

      setTvFormData(prev => ({
        ...prev,
        image: Array.isArray(prev.image) ? [...prev.image, ...validFiles] : [...validFiles],
      }));
    }
  };

  const handleTVImageRemove = (index) => {
    setTvImagePreview(prev => prev.filter((_, i) => i !== index));
    setTvFormData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }));
  };

  const resetTVForm = () => {
    setTvFormData({
      id: "",
      type: "Television",
      name: "",
      price: "",
      originalPrice: "",
      brand: "",
      category: "",
      description: "",
      image: null,
      additionalImages: [],
      stock: "yes",
      code: "",
      discount: "",
      bonuses: "",
      dateAdded: "",
      popularity: "0",
      condition: "New",

      // Display Specifications
      screenSize: "",
      resolution: "",
      displayTechnology: "",
      refreshRate: "",
      brightness: "",
      contrastRatio: "",
      hdrSupport: "",
      viewingAngle: "",
      responseTime: "",

      // Audio Specifications
      audioOutput: "",
      speakerConfiguration: "",
      audioTechnologies: [],

      // Smart Features
      smartPlatform: "",
      voiceAssistant: "",
      streamingApps: [],
      screenMirroring: false,
      airplaySupport: false,

      // Connectivity
      hdmiPorts: "",
      hdmiVersion: "",
      usbPorts: "",
      usbVersion: "",
      ethernetPort: true,
      wifi: true,
      wifiStandard: "",
      bluetooth: true,
      bluetoothVersion: "",
      opticalAudioOut: false,
      headphoneJack: false,

      // Gaming Features
      vrrSupport: false,
      allmSupport: false,
      gameMode: false,
      gsyncSupport: false,
      freesyncSupport: false,

      // Physical
      dimensionsWithStand: "",
      dimensionsWithoutStand: "",
      weightWithStand: "",
      weightWithoutStand: "",
      vesaMount: "",
      color: "",
      bezelType: "",
      standType: "",

      // Power
      powerConsumption: "",
      standbyPower: "",
      voltageRange: "",

      // Projector Specific
      projectorType: "",
      brightnessLumens: "",
      throwRatio: "",
      lampLife: "",
      projectionSize: "",

      // Soundbar Specific
      soundbarChannels: "",
      subwooferIncluded: false,
      subwooferType: "",
      wallMountable: true,

      // Streaming Device Specific
      streamingDeviceType: "",
      remoteType: "",
      storage: "",
      ram: "",

      // General
      warranty: "",
      includedAccessories: [],
      energyRating: "",
      yearReleased: "",

      // Common fields
      keyFeatures: [{ title: "", description: "" }],
      specifications: [{ title: "", specs: [{ name: "", value: "" }] }],
      otherTechnicalDetails: [{ name: "", value: "" }],
      notes: [""],
      videos: [{ title: "", url: "" }],
    });
    setTvImagePreview([]);
    setIsEditingTV(false);
  };

  const handleTVSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Append all basic fields
      Object.keys(tvFormData).forEach(key => {
        if (key === 'image' || key === 'additionalImages') return;

        // Handle array fields by stringifying them
        const arrayFields = ['audioTechnologies', 'streamingApps', 'includedAccessories', 'keyFeatures', 'specifications', 'otherTechnicalDetails', 'notes', 'videos'];
        if (arrayFields.includes(key)) {
          if (Array.isArray(tvFormData[key]) && tvFormData[key].length > 0) {
            formDataToSend.append(key, JSON.stringify(tvFormData[key]));
          }
        } else {
          formDataToSend.append(key, tvFormData[key]);
        }
      });

      // Append images
      if (tvFormData.image && tvFormData.image.length > 0) {
        tvFormData.image.forEach(file => {
          if (file instanceof File) {
            formDataToSend.append('image', file);
          }
        });
      }

      const url = tvFormData.id
        ? `${BASE_URL}/api/tv/${tvFormData.id}`
        : `${BASE_URL}/api/tv`;

      const method = tvFormData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to save TV product");

      alert(tvFormData.id ? "TV product updated successfully!" : "TV product created successfully!");

      fetchTVProducts();
      resetTVForm();
    } catch (error) {
      console.error("Error saving TV product:", error);
      setError("Failed to save TV product");
    }
  };

  const handleEditTV = (product) => {
    setTvFormData({
      id: product._id,
      type: product.type || "Television",
      name: product.name || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      brand: product.brand || "",
      category: Array.isArray(product.category) ? product.category.join(', ') : product.category || "",
      description: product.description || "",
      image: product.image || null,
      additionalImages: product.additionalImages || [],
      stock: product.inStock ? "yes" : "no",
      code: product.code || "",
      discount: product.discount || "",
      bonuses: product.bonuses || "",
      dateAdded: product.dateAdded ? product.dateAdded.split('T')[0] : "",
      popularity: product.popularity || "0",
      condition: product.condition || "New",

      // Display Specifications
      screenSize: product.specs?.screenSize || "",
      resolution: product.specs?.resolution || "",
      displayTechnology: product.specs?.displayTechnology || "",
      refreshRate: product.specs?.refreshRate || "",
      brightness: product.specs?.brightness || "",
      contrastRatio: product.specs?.contrastRatio || "",
      hdrSupport: product.specs?.hdrSupport || "",
      viewingAngle: product.specs?.viewingAngle || "",
      responseTime: product.specs?.responseTime || "",

      // Audio Specifications
      audioOutput: product.specs?.audioOutput || "",
      speakerConfiguration: product.specs?.speakerConfiguration || "",
      audioTechnologies: product.specs?.audioTechnologies || [],

      // Smart Features
      smartPlatform: product.specs?.smartPlatform || "",
      voiceAssistant: product.specs?.voiceAssistant || "",
      streamingApps: product.specs?.streamingApps || [],
      screenMirroring: product.specs?.screenMirroring || false,
      airplaySupport: product.specs?.airplaySupport || false,

      // Connectivity
      hdmiPorts: product.specs?.hdmiPorts || "",
      hdmiVersion: product.specs?.hdmiVersion || "",
      usbPorts: product.specs?.usbPorts || "",
      usbVersion: product.specs?.usbVersion || "",
      ethernetPort: product.specs?.ethernetPort !== false,
      wifi: product.specs?.wifi !== false,
      wifiStandard: product.specs?.wifiStandard || "",
      bluetooth: product.specs?.bluetooth !== false,
      bluetoothVersion: product.specs?.bluetoothVersion || "",
      opticalAudioOut: product.specs?.opticalAudioOut || false,
      headphoneJack: product.specs?.headphoneJack || false,

      // Gaming Features
      vrrSupport: product.specs?.vrrSupport || false,
      allmSupport: product.specs?.allmSupport || false,
      gameMode: product.specs?.gameMode || false,
      gsyncSupport: product.specs?.gsyncSupport || false,
      freesyncSupport: product.specs?.freesyncSupport || false,

      // Physical
      dimensionsWithStand: product.specs?.dimensionsWithStand || "",
      dimensionsWithoutStand: product.specs?.dimensionsWithoutStand || "",
      weightWithStand: product.specs?.weightWithStand || "",
      weightWithoutStand: product.specs?.weightWithoutStand || "",
      vesaMount: product.specs?.vesaMount || "",
      color: product.specs?.color || "",
      bezelType: product.specs?.bezelType || "",
      standType: product.specs?.standType || "",

      // Power
      powerConsumption: product.specs?.powerConsumption || "",
      standbyPower: product.specs?.standbyPower || "",
      voltageRange: product.specs?.voltageRange || "",

      // Projector Specific
      projectorType: product.specs?.projectorType || "",
      brightnessLumens: product.specs?.brightnessLumens || "",
      throwRatio: product.specs?.throwRatio || "",
      lampLife: product.specs?.lampLife || "",
      projectionSize: product.specs?.projectionSize || "",

      // Soundbar Specific
      soundbarChannels: product.specs?.soundbarChannels || "",
      subwooferIncluded: product.specs?.subwooferIncluded || false,
      subwooferType: product.specs?.subwooferType || "",
      wallMountable: product.specs?.wallMountable !== false,

      // Streaming Device Specific
      streamingDeviceType: product.specs?.streamingDeviceType || "",
      remoteType: product.specs?.remoteType || "",
      storage: product.specs?.storage || "",
      ram: product.specs?.ram || "",

      // General
      warranty: product.specs?.warranty || "",
      includedAccessories: product.specs?.includedAccessories || [],
      energyRating: product.specs?.energyRating || "",
      yearReleased: product.specs?.yearReleased || "",

      // Common fields
      keyFeatures: product.keyFeatures || [{ title: "", description: "" }],
      specifications: product.specifications || [{ title: "", specs: [{ name: "", value: "" }] }],
      otherTechnicalDetails: product.otherTechnicalDetails || [{ name: "", value: "" }],
      notes: product.notes || [""],
      videos: product.videos || [{ title: "", url: "" }],
    });

    if (product.image && product.image.length > 0) {
      const imageUrls = product.image.map(img => 
        img.startsWith('http') ? img : `${BASE_URL}/uploads/${img.split('/').pop()}`
      );
      setTvImagePreview(imageUrls);
    }

    setIsEditingTV(true);
  };

  const handleDeleteTV = async (id) => {
    if (!window.confirm("Are you sure you want to delete this TV product?")) return;

    try {
      const response = await fetch(`${BASE_URL}/api/tv/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete TV product");

      alert("TV product deleted successfully!");
      fetchTVProducts();
    } catch (error) {
      console.error("Error deleting TV product:", error);
      setError("Failed to delete TV product");
    }
  };

  // Filter TV products
  const filteredTVProducts = tvProducts.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(tvSearchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(tvSearchTerm.toLowerCase());

    const matchesType = tvTypeFilter === 'all' || product.type === tvTypeFilter;
    const matchesBrand = tvBrandFilter === 'all' || product.brand === tvBrandFilter;

    let matchesResolution = true;
    if (tvResolutionFilter !== 'all') {
      const resolution = product.specs?.resolution?.toLowerCase() || '';
      matchesResolution = resolution.includes(tvResolutionFilter.toLowerCase());
    }

    let matchesScreenSize = true;
    if (tvScreenSizeFilter !== 'all') {
      const sizeMatch = product.specs?.screenSize?.match(/(\d+)/);
      if (sizeMatch) {
        const size = parseInt(sizeMatch[1]);
        if (tvScreenSizeFilter === 'Under 32"') matchesScreenSize = size < 32;
        else if (tvScreenSizeFilter === '32" - 42"') matchesScreenSize = size >= 32 && size < 43;
        else if (tvScreenSizeFilter === '43" - 54"') matchesScreenSize = size >= 43 && size < 55;
        else if (tvScreenSizeFilter === '55" - 64"') matchesScreenSize = size >= 55 && size < 65;
        else if (tvScreenSizeFilter === '65" - 74"') matchesScreenSize = size >= 65 && size < 75;
        else if (tvScreenSizeFilter === '75" and above') matchesScreenSize = size >= 75;
      }
    }

    return matchesSearch && matchesType && matchesBrand && matchesResolution && matchesScreenSize;
  });

  // Get unique brands for filter
  const tvBrands = [...new Set(tvProducts.map(p => p.brand).filter(Boolean))];

  // Get product type icon and color
  const getTVTypeInfo = (type) => {
    switch(type) {
      case 'OLED TV':
        return { icon: '🖥️', color: 'bg-purple-600', textColor: 'text-purple-100' };
      case 'QLED TV':
        return { icon: '🖥️', color: 'bg-blue-600', textColor: 'text-blue-100' };
      case 'LED TV':
        return { icon: '🖥️', color: 'bg-green-600', textColor: 'text-green-100' };
      case 'Television':
        return { icon: '📺', color: 'bg-indigo-600', textColor: 'text-indigo-100' };
      case 'Projector':
        return { icon: '📽️', color: 'bg-orange-600', textColor: 'text-orange-100' };
      case 'Soundbar':
        return { icon: '🔊', color: 'bg-red-600', textColor: 'text-red-100' };
      case 'Home Theater':
        return { icon: '🎬', color: 'bg-yellow-600', textColor: 'text-yellow-100' };
      case 'Streaming Device':
        return { icon: '📱', color: 'bg-pink-600', textColor: 'text-pink-100' };
      default:
        return { icon: '📺', color: 'bg-gray-600', textColor: 'text-gray-100' };
    }
  };

  // Fetch PC component products
  const fetchPCComponentProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/components`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPcComponentProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching PC components:", error);
      setError("Failed to load PC components");
    }
  };

  // Load PC components on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchPCComponentProducts();
    }
  }, [isAuthenticated]);

  // PC Component form handlers
  const handlePCComponentInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setPcComponentFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setPcComponentFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePCComponentImageChange = (e) => {
    const imageFiles = e.target.files;
    if (imageFiles && imageFiles.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validFiles = Array.from(imageFiles).filter(file => allowedTypes.includes(file.type));

      if (validFiles.length !== imageFiles.length) {
        alert('Some files are invalid. Only JPEG, PNG, GIF, and WEBP are allowed.');
        return;
      }

      const previewUrls = validFiles.map(file => URL.createObjectURL(file));
      setPcComponentImagePreview(prev => [...prev, ...previewUrls]);

      setPcComponentFormData(prev => ({
        ...prev,
        image: Array.isArray(prev.image) ? [...prev.image, ...validFiles] : [...validFiles],
      }));
    }
  };

  const handlePCComponentImageRemove = (index) => {
    setPcComponentImagePreview(prev => prev.filter((_, i) => i !== index));
    setPcComponentFormData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }));
  };

  const resetPCComponentForm = () => {
    setPcComponentFormData({
      id: "",
      type: "CPU",
      name: "",
      price: "",
      originalPrice: "",
      brand: "",
      category: "",
      description: "",
      image: null,
      additionalImages: [],
      stock: "yes",
      code: "",
      discount: "",
      bonuses: "",
      dateAdded: "",
      popularity: "0",
      condition: "New",
      series: "",
      model: "",
      releaseDate: "",
      color: "",
      rgb: false,
      socket: "",
      cores: "",
      threads: "",
      baseClock: "",
      boostClock: "",
      cache: "",
      tdp: "",
      integratedGraphics: false,
      unlocked: false,
      maxMemorySupport: "",
      memoryType: "",
      pcieVersion: "",
      // GPU Specific - using the new names
      gpuChipset: "",
      gpuMemory: "",
      gpuMemoryType: "",
      gpuMemoryInterface: "",
      gpuCoreClock: "",
      gpuBoostClock: "",
      cudaCores: "",
      rayTracingCores: "",
      tensorCores: "",
      gpuTdp: "",
      recommendedPsu: "",
      hdmiPorts: "",
      displayPorts: "",
      length: "",
      width: "",
      slots: "",
      cooling: "",
      // RAM Specific
      ramType: "",
      ramCapacity: "",
      ramSpeed: "",
      casLatency: "",
      timing: "",
      voltage: "",
      heatSpreader: true,
      modules: "",
      // Storage Specific
      storageFormFactor: "",
      storageInterface: "",
      storageCapacity: "",
      nandType: "",
      readSpeed: "",
      writeSpeed: "",
      randomRead: "",
      randomWrite: "",
      endurance: "",
      dramCache: false,
      hddRpm: "",
      // Motherboard Specific
      cpuSocket: "",
      motherboardChipset: "",
      motherboardFormFactor: "",
      memorySlots: "",
      maxMemory: "",
      pcieSlots: "",
      m2Slots: "",
      sataPorts: "",
      usbPorts: "",
      audioChip: "",
      ethernet: "",
      wifi: false,
      bluetooth: false,
      // Power Supply Specific
      wattage: "",
      efficiency: "",
      modular: "",
      psuFanSize: "",
      pcieConnectors: "",
      sataConnectors: "",
      molexConnectors: "",
      // Cooler Specific
      coolerType: "",
      coolerFanSize: "",
      fanSpeed: "",
      noiseLevel: "",
      airflow: "",
      radiatorSize: "",
      socketCompatibility: "",
      coolerHeight: "",
      // Case Specific
      caseType: "",
      motherboardSupport: "",
      psuSupport: "",
      maxGpuLength: "",
      maxCpuHeight: "",
      includedFans: "",
      fanSupport: "",
      radiatorSupport: "",
      driveBays: "",
      ioPorts: "",
      temperedGlass: false,
      psuShroud: false,
      cableManagement: true,
      // General
      warranty: "",
      dimensions: "",
      weight: "",
      // Common fields
      keyFeatures: [{ title: "", description: "" }],
      specifications: [{ title: "", specs: [{ name: "", value: "" }] }],
      otherTechnicalDetails: [{ name: "", value: "" }],
      notes: [""],
      videos: [{ title: "", url: "" }],
    });
    setPcComponentImagePreview([]);
    setIsEditingPCComponent(false);
  };

  const handlePCComponentSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Append all basic fields
      Object.keys(pcComponentFormData).forEach(key => {
        if (key === 'image' || key === 'additionalImages') return;

        // Handle array fields by stringifying them
        const arrayFields = ['keyFeatures', 'specifications', 'otherTechnicalDetails', 'notes', 'videos'];
        if (arrayFields.includes(key)) {
          if (Array.isArray(pcComponentFormData[key]) && pcComponentFormData[key].length > 0) {
            formDataToSend.append(key, JSON.stringify(pcComponentFormData[key]));
          }
        } else {
          formDataToSend.append(key, pcComponentFormData[key]);
        }
      });

      // Append images
      if (pcComponentFormData.image && pcComponentFormData.image.length > 0) {
        pcComponentFormData.image.forEach(file => {
          if (file instanceof File) {
            formDataToSend.append('image', file);
          }
        });
      }

      const url = pcComponentFormData.id
        ? `${BASE_URL}/api/components/${pcComponentFormData.id}`
        : `${BASE_URL}/api/components`;

      const method = pcComponentFormData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to save PC component");

      alert(pcComponentFormData.id ? "PC Component updated successfully!" : "PC Component created successfully!");

      fetchPCComponentProducts();
      resetPCComponentForm();
    } catch (error) {
      console.error("Error saving PC component:", error);
      setError("Failed to save PC component");
    }
  };

  const handleEditPCComponent = (product) => {
    setPcComponentFormData({
      id: product._id,
      type: product.type || "CPU",
      name: product.name || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      brand: product.brand || "",
      category: Array.isArray(product.category) ? product.category.join(', ') : product.category || "",
      description: product.description || "",
      image: product.image || null,
      additionalImages: product.additionalImages || [],
      stock: product.inStock ? "yes" : "no",
      code: product.code || "",
      discount: product.discount || "",
      bonuses: product.bonuses || "",
      dateAdded: product.dateAdded ? product.dateAdded.split('T')[0] : "",
      popularity: product.popularity || "0",
      condition: product.condition || "New",

      // Common
      series: product.specs?.series || "",
      model: product.specs?.model || "",
      releaseDate: product.specs?.releaseDate || "",
      color: product.specs?.color || "",
      rgb: product.specs?.rgb || false,

      // CPU Specific
      socket: product.specs?.socket || "",
      cores: product.specs?.cores || "",
      threads: product.specs?.threads || "",
      baseClock: product.specs?.baseClock || "",
      boostClock: product.specs?.boostClock || "",
      cache: product.specs?.cache || "",
      tdp: product.specs?.tdp || "",
      integratedGraphics: product.specs?.integratedGraphics || false,
      unlocked: product.specs?.unlocked || false,
      maxMemorySupport: product.specs?.maxMemorySupport || "",
      memoryType: product.specs?.memoryType || "",
      pcieVersion: product.specs?.pcieVersion || "",

      // GPU Specific - map to new names
      gpuChipset: product.specs?.chipset || "",
      gpuMemory: product.specs?.memory || "",
      gpuMemoryType: product.specs?.memoryType || "",
      gpuMemoryInterface: product.specs?.memoryInterface || "",
      gpuCoreClock: product.specs?.coreClock || "",
      gpuBoostClock: product.specs?.boostClock || "",
      cudaCores: product.specs?.cudaCores || "",
      rayTracingCores: product.specs?.rayTracingCores || "",
      tensorCores: product.specs?.tensorCores || "",
      gpuTdp: product.specs?.tdp || "",
      recommendedPsu: product.specs?.recommendedPsu || "",
      hdmiPorts: product.specs?.hdmiPorts || "",
      displayPorts: product.specs?.displayPorts || "",
      length: product.specs?.length || "",
      width: product.specs?.width || "",
      slots: product.specs?.slots || "",
      cooling: product.specs?.cooling || "",

      // RAM Specific - map to new names
      ramType: product.specs?.ramType || "",
      ramCapacity: product.specs?.capacity || "",
      ramSpeed: product.specs?.speed || "",
      casLatency: product.specs?.casLatency || "",
      timing: product.specs?.timing || "",
      voltage: product.specs?.voltage || "",
      heatSpreader: product.specs?.heatSpreader !== false,
      modules: product.specs?.modules || "",

      // Storage Specific - map to new names
      storageFormFactor: product.specs?.formFactor || "",
      storageInterface: product.specs?.interface || "",
      storageCapacity: product.specs?.capacity || "",
      nandType: product.specs?.nandType || "",
      readSpeed: product.specs?.readSpeed || "",
      writeSpeed: product.specs?.writeSpeed || "",
      randomRead: product.specs?.randomRead || "",
      randomWrite: product.specs?.randomWrite || "",
      endurance: product.specs?.endurance || "",
      dramCache: product.specs?.dramCache || false,
      hddRpm: product.specs?.hddRpm || "",

      // Motherboard Specific - map to new names
      cpuSocket: product.specs?.cpuSocket || "",
      motherboardChipset: product.specs?.chipset || "",
      motherboardFormFactor: product.specs?.formFactor || "",
      memorySlots: product.specs?.memorySlots || "",
      maxMemory: product.specs?.maxMemory || "",
      pcieSlots: product.specs?.pcieSlots || "",
      m2Slots: product.specs?.m2Slots || "",
      sataPorts: product.specs?.sataPorts || "",
      usbPorts: product.specs?.usbPorts || "",
      audioChip: product.specs?.audioChip || "",
      ethernet: product.specs?.ethernet || "",
      wifi: product.specs?.wifi || false,
      bluetooth: product.specs?.bluetooth || false,

      // Power Supply Specific - map to new names
      wattage: product.specs?.wattage || "",
      efficiency: product.specs?.efficiency || "",
      modular: product.specs?.modular || "",
      psuFanSize: product.specs?.fanSize || "",
      pcieConnectors: product.specs?.pcieConnectors || "",
      sataConnectors: product.specs?.sataConnectors || "",
      molexConnectors: product.specs?.molexConnectors || "",

      // Cooler Specific - map to new names
      coolerType: product.specs?.coolerType || "",
      coolerFanSize: product.specs?.fanSize || "",
      fanSpeed: product.specs?.fanSpeed || "",
      noiseLevel: product.specs?.noiseLevel || "",
      airflow: product.specs?.airflow || "",
      radiatorSize: product.specs?.radiatorSize || "",
      socketCompatibility: product.specs?.socketCompatibility || "",
      coolerHeight: product.specs?.height || "",

      // Case Specific - map to new names
      caseType: product.specs?.caseType || "",
      motherboardSupport: product.specs?.motherboardSupport || "",
      psuSupport: product.specs?.psuSupport || "",
      maxGpuLength: product.specs?.maxGpuLength || "",
      maxCpuHeight: product.specs?.maxCpuHeight || "",
      includedFans: product.specs?.includedFans || "",
      fanSupport: product.specs?.fanSupport || "",
      radiatorSupport: product.specs?.radiatorSupport || "",
      driveBays: product.specs?.driveBays || "",
      ioPorts: product.specs?.ioPorts || "",
      temperedGlass: product.specs?.temperedGlass || false,
      psuShroud: product.specs?.psuShroud || false,
      cableManagement: product.specs?.cableManagement !== false,

      // General
      warranty: product.specs?.warranty || "",
      dimensions: product.specs?.dimensions || "",
      weight: product.specs?.weight || "",

      // Common fields
      keyFeatures: product.keyFeatures || [{ title: "", description: "" }],
      specifications: product.specifications || [{ title: "", specs: [{ name: "", value: "" }] }],
      otherTechnicalDetails: product.otherTechnicalDetails || [{ name: "", value: "" }],
      notes: product.notes || [""],
      videos: product.videos || [{ title: "", url: "" }],
    });

    if (product.image && product.image.length > 0) {
      const imageUrls = product.image.map(img => 
        img.startsWith('http') ? img : `${BASE_URL}/uploads/${img.split('/').pop()}`
      );
      setPcComponentImagePreview(imageUrls);
    }

    setIsEditingPCComponent(true);
  };

  const handleDeletePCComponent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PC component?")) return;

    try {
      const response = await fetch(`${BASE_URL}/api/components/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete PC component");

      alert("PC Component deleted successfully!");
      fetchPCComponentProducts();
    } catch (error) {
      console.error("Error deleting PC component:", error);
      setError("Failed to delete PC component");
    }
  };

  // Filter PC component products
  const filteredPCComponentProducts = pcComponentProducts.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(pcComponentSearchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(pcComponentSearchTerm.toLowerCase());
    const matchesType = pcComponentTypeFilter === 'all' || product.type === pcComponentTypeFilter;
    const matchesBrand = pcComponentBrandFilter === 'all' || product.brand === pcComponentBrandFilter;

    let matchesSocket = true;
    if (pcComponentSocketFilter !== 'all') {
      matchesSocket = product.specs?.socket === pcComponentSocketFilter || 
                      product.specs?.cpuSocket === pcComponentSocketFilter;
    }

    return matchesSearch && matchesType && matchesBrand && matchesSocket;
  });

  // Get unique brands for filter
  const pcComponentBrands = [...new Set(pcComponentProducts.map(p => p.brand).filter(Boolean))];

  // Get unique sockets for filter
  const pcComponentSockets = [...new Set(pcComponentProducts.flatMap(p => 
    [p.specs?.socket, p.specs?.cpuSocket].filter(Boolean)
  ))];

  // Get component icon and color
  const getComponentInfo = (type) => {
    switch(type) {
      case 'CPU':
        return { icon: '💻', color: 'bg-blue-600' };
      case 'GPU':
        return { icon: '🎮', color: 'bg-green-600' };
      case 'RAM':
        return { icon: '🧠', color: 'bg-purple-600' };
      case 'SSD':
      case 'HDD':
        return { icon: '💾', color: 'bg-yellow-600' };
      case 'Motherboard':
        return { icon: '🔌', color: 'bg-indigo-600' };
      case 'Power Supply':
        return { icon: '⚡', color: 'bg-orange-600' };
      case 'CPU Cooler':
        return { icon: '❄️', color: 'bg-cyan-600' };
      case 'Case':
        return { icon: '🖥️', color: 'bg-gray-600' };
      default:
        return { icon: '🔧', color: 'bg-gray-600' };
    }
  };

  // Fetch mobile products
  const fetchMobileProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/mobiles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setMobileProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching mobile products:", error);
      setError("Failed to load mobile products");
    }
  };

  // Load mobile products on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchMobileProducts();
    }
  }, [isAuthenticated]);

  // Mobile form handlers
  const handleMobileInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle array fields
    const arrayFields = ['network', 'colors', 'cameraFeatures', 'audioFeatures'];
    if (arrayFields.includes(name)) {
      const values = value.split(',').map(item => item.trim());
      setMobileFormData(prev => ({ ...prev, [name]: values }));
    } else if (type === 'checkbox') {
      setMobileFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setMobileFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMobileImageChange = (e) => {
    const imageFiles = e.target.files;
    if (imageFiles && imageFiles.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validFiles = Array.from(imageFiles).filter(file => allowedTypes.includes(file.type));

      if (validFiles.length !== imageFiles.length) {
        alert('Some files are invalid. Only JPEG, PNG, GIF, and WEBP are allowed.');
        return;
      }

      const previewUrls = validFiles.map(file => URL.createObjectURL(file));
      setMobileImagePreview(prev => [...prev, ...previewUrls]);

      setMobileFormData(prev => ({
        ...prev,
        image: Array.isArray(prev.image) ? [...prev.image, ...validFiles] : [...validFiles],
      }));
    }
  };

  const handleMobileImageRemove = (index) => {
    setMobileImagePreview(prev => prev.filter((_, i) => i !== index));
    setMobileFormData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }));
  };

  const resetMobileForm = () => {
    setMobileFormData({
      id: "",
      type: "Smartphone",
      name: "",
      price: "",
      originalPrice: "",
      brand: "",
      category: "",
      description: "",
      image: null,
      additionalImages: [],
      stock: "yes",
      code: "",
      discount: "",
      bonuses: "",
      dateAdded: "",
      popularity: "0",
      condition: "New",
      displaySize: "",
      displayType: "",
      resolution: "",
      refreshRate: "",
      brightness: "",
      hdr: false,
      processor: "",
      processorBrand: "",
      processorCores: "",
      processorSpeed: "",
      gpu: "",
      ram: "",
      ramType: "",
      internalStorage: "",
      storageType: "",
      expandableStorage: false,
      maxStorage: "",
      rearCamera: "",
      rearCameraFeatures: "",
      frontCamera: "",
      frontCameraFeatures: "",
      videoRecording: "",
      cameraFeatures: [],
      batteryCapacity: "",
      batteryType: "",
      fastCharging: "",
      wirelessCharging: false,
      reverseCharging: false,
      chargingTime: "",
      network: [],
      simType: "",
      dualSim: false,
      wifi: "",
      bluetooth: "",
      nfc: false,
      gps: true,
      usbType: "",
      operatingSystem: "",
      osVersion: "",
      fingerprintSensor: false,
      fingerprintPosition: "",
      faceUnlock: false,
      accelerometer: true,
      gyroscope: true,
      proximity: true,
      compass: true,
      barometer: false,
      dimensions: "",
      weight: "",
      build: "",
      colors: [],
      waterResistant: "",
      speakers: "",
      headphoneJack: false,
      audioFeatures: [],
      stylus: false,
      desktopMode: false,
      samsungDex: false,
      applePencilSupport: false,
      keyboardSupport: false,
      applePencilGen: "",
      magicKeyboardSupport: false,
      smartConnector: false,
      keyFeatures: [{ title: "", description: "" }],
      specifications: [{ title: "", specs: [{ name: "", value: "" }] }],
      otherTechnicalDetails: [{ name: "", value: "" }],
      notes: [""],
      videos: [{ title: "", url: "" }],
    });
    setMobileImagePreview([]);
    setIsEditingMobile(false);
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Append all basic fields
      Object.keys(mobileFormData).forEach(key => {
        if (key === 'image' || key === 'additionalImages') return;

        // Handle array fields by stringifying them
        const arrayFields = ['network', 'colors', 'cameraFeatures', 'audioFeatures', 'keyFeatures', 'specifications', 'otherTechnicalDetails', 'notes', 'videos'];
        if (arrayFields.includes(key)) {
          if (Array.isArray(mobileFormData[key]) && mobileFormData[key].length > 0) {
            formDataToSend.append(key, JSON.stringify(mobileFormData[key]));
          }
        } else {
          formDataToSend.append(key, mobileFormData[key]);
        }
      });

      // Append images
      if (mobileFormData.image && mobileFormData.image.length > 0) {
        mobileFormData.image.forEach(file => {
          if (file instanceof File) {
            formDataToSend.append('image', file);
          }
        });
      }

      const url = mobileFormData.id
        ? `${BASE_URL}/api/mobiles/${mobileFormData.id}`
        : `${BASE_URL}/api/mobiles`;

      const method = mobileFormData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to save mobile product");

      alert(mobileFormData.id ? "Mobile product updated successfully!" : "Mobile product created successfully!");

      fetchMobileProducts();
      resetMobileForm();
    } catch (error) {
      console.error("Error saving mobile product:", error);
      setError("Failed to save mobile product");
    }
  };

  const handleEditMobile = (product) => {
    setMobileFormData({
      id: product._id,
      type: product.type || "Smartphone",
      name: product.name || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      brand: product.brand || "",
      category: Array.isArray(product.category) ? product.category.join(', ') : product.category || "",
      description: product.description || "",
      image: product.image || null,
      additionalImages: product.additionalImages || [],
      stock: product.inStock ? "yes" : "no",
      code: product.code || "",
      discount: product.discount || "",
      bonuses: product.bonuses || "",
      dateAdded: product.dateAdded ? product.dateAdded.split('T')[0] : "",
      popularity: product.popularity || "0",
      condition: product.condition || "New",

      // Display
      displaySize: product.specs?.displaySize || "",
      displayType: product.specs?.displayType || "",
      resolution: product.specs?.resolution || "",
      refreshRate: product.specs?.refreshRate || "",
      brightness: product.specs?.brightness || "",
      hdr: product.specs?.hdr || false,

      // Processor
      processor: product.specs?.processor || "",
      processorBrand: product.specs?.processorBrand || "",
      processorCores: product.specs?.processorCores || "",
      processorSpeed: product.specs?.processorSpeed || "",
      gpu: product.specs?.gpu || "",

      // Memory
      ram: product.specs?.ram || "",
      ramType: product.specs?.ramType || "",
      internalStorage: product.specs?.internalStorage || "",
      storageType: product.specs?.storageType || "",
      expandableStorage: product.specs?.expandableStorage || false,
      maxStorage: product.specs?.maxStorage || "",

      // Camera
      rearCamera: product.specs?.rearCamera || "",
      rearCameraFeatures: product.specs?.rearCameraFeatures || "",
      frontCamera: product.specs?.frontCamera || "",
      frontCameraFeatures: product.specs?.frontCameraFeatures || "",
      videoRecording: product.specs?.videoRecording || "",
      cameraFeatures: product.specs?.cameraFeatures || [],

      // Battery
      batteryCapacity: product.specs?.batteryCapacity || "",
      batteryType: product.specs?.batteryType || "",
      fastCharging: product.specs?.fastCharging || "",
      wirelessCharging: product.specs?.wirelessCharging || false,
      reverseCharging: product.specs?.reverseCharging || false,
      chargingTime: product.specs?.chargingTime || "",

      // Connectivity
      network: product.specs?.network || [],
      simType: product.specs?.simType || "",
      dualSim: product.specs?.dualSim || false,
      wifi: product.specs?.wifi || "",
      bluetooth: product.specs?.bluetooth || "",
      nfc: product.specs?.nfc || false,
      gps: product.specs?.gps !== false,
      usbType: product.specs?.usbType || "",

      // OS
      operatingSystem: product.specs?.operatingSystem || "",
      osVersion: product.specs?.osVersion || "",

      // Sensors
      fingerprintSensor: product.specs?.fingerprintSensor || false,
      fingerprintPosition: product.specs?.fingerprintPosition || "",
      faceUnlock: product.specs?.faceUnlock || false,
      accelerometer: product.specs?.accelerometer !== false,
      gyroscope: product.specs?.gyroscope !== false,
      proximity: product.specs?.proximity !== false,
      compass: product.specs?.compass !== false,
      barometer: product.specs?.barometer || false,

      // Physical
      dimensions: product.specs?.dimensions || "",
      weight: product.specs?.weight || "",
      build: product.specs?.build || "",
      colors: product.specs?.colors || [],
      waterResistant: product.specs?.waterResistant || "",

      // Audio
      speakers: product.specs?.speakers || "",
      headphoneJack: product.specs?.headphoneJack || false,
      audioFeatures: product.specs?.audioFeatures || [],

      // Additional Features
      stylus: product.specs?.stylus || false,
      desktopMode: product.specs?.desktopMode || false,
      samsungDex: product.specs?.samsungDex || false,
      applePencilSupport: product.specs?.applePencilSupport || false,
      keyboardSupport: product.specs?.keyboardSupport || false,
      applePencilGen: product.specs?.applePencilGen || "",
      magicKeyboardSupport: product.specs?.magicKeyboardSupport || false,
      smartConnector: product.specs?.smartConnector || false,

      // Common fields
      keyFeatures: product.keyFeatures || [{ title: "", description: "" }],
      specifications: product.specifications || [{ title: "", specs: [{ name: "", value: "" }] }],
      otherTechnicalDetails: product.otherTechnicalDetails || [{ name: "", value: "" }],
      notes: product.notes || [""],
      videos: product.videos || [{ title: "", url: "" }],
    });

    if (product.image && product.image.length > 0) {
      const imageUrls = product.image.map(img => 
        img.startsWith('http') ? img : `${BASE_URL}/uploads/${img.split('/').pop()}`
      );
      setMobileImagePreview(imageUrls);
    }

    setIsEditingMobile(true);
  };

  const handleDeleteMobile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mobile product?")) return;

    try {
      const response = await fetch(`${BASE_URL}/api/mobiles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete mobile product");

      alert("Mobile product deleted successfully!");
      fetchMobileProducts();
    } catch (error) {
      console.error("Error deleting mobile product:", error);
      setError("Failed to delete mobile product");
    }
  };

  // Filter mobile products
  const filteredMobileProducts = mobileProducts.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(mobileSearchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(mobileSearchTerm.toLowerCase());
    const matchesType = mobileTypeFilter === 'all' || product.type === mobileTypeFilter;
    const matchesBrand = mobileBrandFilter === 'all' || product.brand === mobileBrandFilter;
    const matchesOs = mobileOsFilter === 'all' || product.specs?.operatingSystem?.toLowerCase().includes(mobileOsFilter.toLowerCase());
    return matchesSearch && matchesType && matchesBrand && matchesOs;
  });

  // Get unique brands for filter
  const mobileBrands = [...new Set(mobileProducts.map(p => p.brand).filter(Boolean))];

  // Filter orders based on the search query
  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Menu items configuration
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
    { id: 'pending-orders', label: 'Pending Orders', icon: <FaShoppingCart /> },
    { id: 'manage-users', label: 'Manage Users', icon: <FaUsers /> },
    { id: 'discount-codes', label: 'Discount Codes', icon: <FaTags /> },
    { id: 'manage-products', label: 'Manage Products', icon: <FaBox /> },
    { id: 'manage-audio', label: 'Manage Audio', icon: <FaHeadphones /> },
    { id: 'manage-cameras', label: 'Manage Cameras', icon: <FaCamera /> },
    { id: 'manage-displays', label: 'Manage Displays', icon: <FaTv /> },
    { id: 'manage-mobiles', label: 'Manage Mobiles', icon: <FaMobileAlt /> },
    { id: 'manage-components', label: 'Manage PC Components', icon: <FaMicrochip /> },
    { id: 'manage-tv', label: 'Manage TV & Entertainment', icon: <FaTv /> },
    { id: 'manage-wearables', label: 'Manage Wearables', icon: <FaClock /> },
    { id: 'manage-accessories', label: 'Manage Accessories', icon: <FaBox /> },
    { id: 'manage-kitchen', label: 'Manage Kitchen Appliances', icon: <FaFire /> },
    { id: 'manage-laundry', label: 'Manage Laundry', icon: <FaTshirt /> },
    { id: 'newsletter', label: 'Newsletter', icon: <FaEnvelope /> },
    { id: 'device-info', label: 'Device Info', icon: <FaInfoCircle /> },
    { id: 'location-info', label: 'Location Info', icon: <FaInfoCircle /> },
    { id: 'login-history', label: 'Login History', icon: <FaHistory /> },
  ];

  const BASE_URL = `http://${window.location.hostname}:4000`;

  // Fetch audio products
  const fetchAudioProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/audio`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAudioProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching audio products:", error);
      setError("Failed to load audio products");
    }
  };

  // Fetch camera products
  const fetchCameraProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/cameras`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCameraProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching camera products:", error);
      setError("Failed to load camera products");
    }
  };

  // Load products on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchAudioProducts();
      fetchCameraProducts();
    }
  }, [isAuthenticated]);

  // Audio form handlers
  const handleAudioInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'connectivity' || name === 'videoResolution' || name === 'storageMedia') {
      // Handle array fields
      const values = value.split(',').map(item => item.trim());
      setAudioFormData(prev => ({ ...prev, [name]: values }));
    } else if (type === 'checkbox') {
      setAudioFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setAudioFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAudioImageChange = (e) => {
    const imageFiles = e.target.files;
    if (imageFiles && imageFiles.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validFiles = Array.from(imageFiles).filter(file => allowedTypes.includes(file.type));

      if (validFiles.length !== imageFiles.length) {
        alert('Some files are invalid. Only JPEG, PNG, GIF, and WEBP are allowed.');
        return;
      }

      const previewUrls = validFiles.map(file => URL.createObjectURL(file));
      setAudioImagePreview(prev => [...prev, ...previewUrls]);

      setAudioFormData(prev => ({
        ...prev,
        image: Array.isArray(prev.image) ? [...prev.image, ...validFiles] : [...validFiles],
      }));
    }
  };

  const handleAudioImageRemove = (index) => {
    setAudioImagePreview(prev => prev.filter((_, i) => i !== index));
    setAudioFormData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }));
  };

  const resetAudioForm = () => {
    setAudioFormData({
      id: "",
      type: "Headphones",
      name: "",
      price: "",
      originalPrice: "",
      brand: "",
      category: "",
      description: "",
      image: null,
      additionalImages: [],
      stock: "yes",
      code: "",
      discount: "",
      bonuses: "",
      dateAdded: "",
      popularity: "0",
      condition: "New",
      driverSize: "",
      frequencyResponse: "",
      impedance: "",
      sensitivity: "",
      connectivity: [],
      bluetoothVersion: "",
      wirelessRange: "",
      batteryLife: "",
      chargingTime: "",
      fastCharging: false,
      noiseCancelling: false,
      waterResistant: "",
      builtInMic: false,
      voiceAssistant: false,
      multipointConnection: false,
      touchControls: false,
      buttonControls: true,
      weight: "",
      color: "",
      foldable: false,
      outputPower: "",
      channels: "",
      subwoofer: false,
      polarPattern: "",
      sampleRate: "",
      bitDepth: "",
      keyFeatures: [{ title: "", description: "" }],
      specifications: [{ title: "", specs: [{ name: "", value: "" }] }],
      otherTechnicalDetails: [{ name: "", value: "" }],
      notes: [""],
      videos: [{ title: "", url: "" }],
    });
    setAudioImagePreview([]);
    setIsEditingAudio(false);
  };

  const handleAudioSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Append all basic fields
      Object.keys(audioFormData).forEach(key => {
        if (key === 'image' || key === 'additionalImages') return;

        if (key === 'keyFeatures' || key === 'specifications' || key === 'otherTechnicalDetails' || 
            key === 'notes' || key === 'videos' || key === 'connectivity') {
          if (Array.isArray(audioFormData[key])) {
            formDataToSend.append(key, JSON.stringify(audioFormData[key]));
          }
        } else {
          formDataToSend.append(key, audioFormData[key]);
        }
      });

      // Append images
      if (audioFormData.image && audioFormData.image.length > 0) {
        audioFormData.image.forEach(file => {
          if (file instanceof File) {
            formDataToSend.append('image', file);
          }
        });
      }

      const url = audioFormData.id
        ? `${BASE_URL}/api/audio/${audioFormData.id}`
        : `${BASE_URL}/api/audio`;

      const method = audioFormData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to save audio product");

      alert(audioFormData.id ? "Audio product updated successfully!" : "Audio product created successfully!");

      fetchAudioProducts();
      resetAudioForm();
    } catch (error) {
      console.error("Error saving audio product:", error);
      setError("Failed to save audio product");
    }
  };

  const handleEditAudio = (product) => {
    setAudioFormData({
      id: product._id,
      type: product.type || "Headphones",
      name: product.name || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      brand: product.brand || "",
      category: Array.isArray(product.category) ? product.category.join(', ') : product.category || "",
      description: product.description || "",
      image: product.image || null,
      additionalImages: product.additionalImages || [],
      stock: product.inStock ? "yes" : "no",
      code: product.code || "",
      discount: product.discount || "",
      bonuses: product.bonuses || "",
      dateAdded: product.dateAdded ? product.dateAdded.split('T')[0] : "",
      popularity: product.popularity || "0",
      condition: product.condition || "New",

      // Audio specific fields
      driverSize: product.specs?.driverSize || "",
      frequencyResponse: product.specs?.frequencyResponse || "",
      impedance: product.specs?.impedance || "",
      sensitivity: product.specs?.sensitivity || "",
      connectivity: product.specs?.connectivity || [],
      bluetoothVersion: product.specs?.bluetoothVersion || "",
      wirelessRange: product.specs?.wirelessRange || "",
      batteryLife: product.specs?.batteryLife || "",
      chargingTime: product.specs?.chargingTime || "",
      fastCharging: product.specs?.fastCharging || false,
      noiseCancelling: product.specs?.noiseCancelling || false,
      waterResistant: product.specs?.waterResistant || "",
      builtInMic: product.specs?.builtInMic || false,
      voiceAssistant: product.specs?.voiceAssistant || false,
      multipointConnection: product.specs?.multipointConnection || false,
      touchControls: product.specs?.touchControls || false,
      buttonControls: product.specs?.buttonControls !== false,
      weight: product.specs?.weight || "",
      color: product.specs?.color || "",
      foldable: product.specs?.foldable || false,
      outputPower: product.specs?.outputPower || "",
      channels: product.specs?.channels || "",
      subwoofer: product.specs?.subwoofer || false,
      polarPattern: product.specs?.polarPattern || "",
      sampleRate: product.specs?.sampleRate || "",
      bitDepth: product.specs?.bitDepth || "",

      // Common fields
      keyFeatures: product.keyFeatures || [{ title: "", description: "" }],
      specifications: product.specifications || [{ title: "", specs: [{ name: "", value: "" }] }],
      otherTechnicalDetails: product.otherTechnicalDetails || [{ name: "", value: "" }],
      notes: product.notes || [""],
      videos: product.videos || [{ title: "", url: "" }],
    });

    if (product.image && product.image.length > 0) {
      const imageUrls = product.image.map(img => 
        img.startsWith('http') ? img : `${BASE_URL}/uploads/${img.split('/').pop()}`
      );
      setAudioImagePreview(imageUrls);
    }

    setIsEditingAudio(true);
  };

  const handleDeleteAudio = async (id) => {
    if (!window.confirm("Are you sure you want to delete this audio product?")) return;

    try {
      const response = await fetch(`${BASE_URL}/api/audio/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete audio product");

      alert("Audio product deleted successfully!");
      fetchAudioProducts();
    } catch (error) {
      console.error("Error deleting audio product:", error);
      setError("Failed to delete audio product");
    }
  };

  // Camera form handlers
  const handleCameraInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'videoResolution' || name === 'storageMedia') {
      const values = value.split(',').map(item => item.trim());
      setCameraFormData(prev => ({ ...prev, [name]: values }));
    } else if (type === 'checkbox') {
      setCameraFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setCameraFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCameraImageChange = (e) => {
    const imageFiles = e.target.files;
    if (imageFiles && imageFiles.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validFiles = Array.from(imageFiles).filter(file => allowedTypes.includes(file.type));

      if (validFiles.length !== imageFiles.length) {
        alert('Some files are invalid. Only JPEG, PNG, GIF, and WEBP are allowed.');
        return;
      }

      const previewUrls = validFiles.map(file => URL.createObjectURL(file));
      setCameraImagePreview(prev => [...prev, ...previewUrls]);

      setCameraFormData(prev => ({
        ...prev,
        image: Array.isArray(prev.image) ? [...prev.image, ...validFiles] : [...validFiles],
      }));
    }
  };

  const handleCameraImageRemove = (index) => {
    setCameraImagePreview(prev => prev.filter((_, i) => i !== index));
    setCameraFormData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }));
  };

  const resetCameraForm = () => {
    setCameraFormData({
      id: "",
      type: "DSLR",
      name: "",
      price: "",
      originalPrice: "",
      brand: "",
      category: "",
      description: "",
      image: null,
      additionalImages: [],
      stock: "yes",
      code: "",
      discount: "",
      bonuses: "",
      dateAdded: "",
      popularity: "0",
      condition: "New",
      sensorType: "",
      sensorSize: "",
      megapixels: "",
      imageProcessor: "",
      isoRange: "",
      shutterSpeed: "",
      continuousShooting: "",
      videoResolution: [],
      videoFrameRates: "",
      lensMount: "",
      focalLength: "",
      aperture: "",
      autofocusPoints: "",
      faceDetection: false,
      eyeTracking: false,
      screenSize: "",
      screenResolution: "",
      touchscreen: false,
      articulatingScreen: false,
      viewfinderType: "",
      viewfinderResolution: "",
      wifi: false,
      bluetooth: false,
      nfc: false,
      hdmi: false,
      usbType: "",
      storageMedia: [],
      cardSlots: "1",
      batteryType: "",
      batteryLife: "",
      weight: "",
      dimensions: "",
      weatherSealed: false,
      resolution: "",
      frameRate: "",
      fieldOfView: "",
      autofocus: false,
      lowLightCorrection: false,
      waterproof: "",
      imageStabilization: "",
      builtInDisplay: false,
      keyFeatures: [{ title: "", description: "" }],
      specifications: [{ title: "", specs: [{ name: "", value: "" }] }],
      otherTechnicalDetails: [{ name: "", value: "" }],
      notes: [""],
      videos: [{ title: "", url: "" }],
    });
    setCameraImagePreview([]);
    setIsEditingCamera(false);
  };

  const handleCameraSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      Object.keys(cameraFormData).forEach(key => {
        if (key === 'image' || key === 'additionalImages') return;

        if (key === 'keyFeatures' || key === 'specifications' || key === 'otherTechnicalDetails' || 
            key === 'notes' || key === 'videos' || key === 'videoResolution' || key === 'storageMedia') {
          if (Array.isArray(cameraFormData[key])) {
            formDataToSend.append(key, JSON.stringify(cameraFormData[key]));
          }
        } else {
          formDataToSend.append(key, cameraFormData[key]);
        }
      });

      if (cameraFormData.image && cameraFormData.image.length > 0) {
        cameraFormData.image.forEach(file => {
          if (file instanceof File) {
            formDataToSend.append('image', file);
          }
        });
      }

      const url = cameraFormData.id
        ? `${BASE_URL}/api/cameras/${cameraFormData.id}`
        : `${BASE_URL}/api/cameras`;

      const method = cameraFormData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to save camera product");

      alert(cameraFormData.id ? "Camera product updated successfully!" : "Camera product created successfully!");

      fetchCameraProducts();
      resetCameraForm();
    } catch (error) {
      console.error("Error saving camera product:", error);
      setError("Failed to save camera product");
    }
  };

  const handleEditCamera = (product) => {
    setCameraFormData({
      id: product._id,
      type: product.type || "DSLR",
      name: product.name || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      brand: product.brand || "",
      category: Array.isArray(product.category) ? product.category.join(', ') : product.category || "",
      description: product.description || "",
      image: product.image || null,
      additionalImages: product.additionalImages || [],
      stock: product.inStock ? "yes" : "no",
      code: product.code || "",
      discount: product.discount || "",
      bonuses: product.bonuses || "",
      dateAdded: product.dateAdded ? product.dateAdded.split('T')[0] : "",
      popularity: product.popularity || "0",
      condition: product.condition || "New",

      // Camera specific fields
      sensorType: product.specs?.sensorType || "",
      sensorSize: product.specs?.sensorSize || "",
      megapixels: product.specs?.megapixels || "",
      imageProcessor: product.specs?.imageProcessor || "",
      isoRange: product.specs?.isoRange || "",
      shutterSpeed: product.specs?.shutterSpeed || "",
      continuousShooting: product.specs?.continuousShooting || "",
      videoResolution: product.specs?.videoResolution || [],
      videoFrameRates: product.specs?.videoFrameRates || "",
      lensMount: product.specs?.lensMount || "",
      focalLength: product.specs?.focalLength || "",
      aperture: product.specs?.aperture || "",
      autofocusPoints: product.specs?.autofocusPoints || "",
      faceDetection: product.specs?.faceDetection || false,
      eyeTracking: product.specs?.eyeTracking || false,
      screenSize: product.specs?.screenSize || "",
      screenResolution: product.specs?.screenResolution || "",
      touchscreen: product.specs?.touchscreen || false,
      articulatingScreen: product.specs?.articulatingScreen || false,
      viewfinderType: product.specs?.viewfinderType || "",
      viewfinderResolution: product.specs?.viewfinderResolution || "",
      wifi: product.specs?.wifi || false,
      bluetooth: product.specs?.bluetooth || false,
      nfc: product.specs?.nfc || false,
      hdmi: product.specs?.hdmi || false,
      usbType: product.specs?.usbType || "",
      storageMedia: product.specs?.storageMedia || [],
      cardSlots: product.specs?.cardSlots || "1",
      batteryType: product.specs?.batteryType || "",
      batteryLife: product.specs?.batteryLife || "",
      weight: product.specs?.weight || "",
      dimensions: product.specs?.dimensions || "",
      weatherSealed: product.specs?.weatherSealed || false,
      resolution: product.specs?.resolution || "",
      frameRate: product.specs?.frameRate || "",
      fieldOfView: product.specs?.fieldOfView || "",
      autofocus: product.specs?.autofocus || false,
      lowLightCorrection: product.specs?.lowLightCorrection || false,
      waterproof: product.specs?.waterproof || "",
      imageStabilization: product.specs?.imageStabilization || "",
      builtInDisplay: product.specs?.builtInDisplay || false,

      // Common fields
      keyFeatures: product.keyFeatures || [{ title: "", description: "" }],
      specifications: product.specifications || [{ title: "", specs: [{ name: "", value: "" }] }],
      otherTechnicalDetails: product.otherTechnicalDetails || [{ name: "", value: "" }],
      notes: product.notes || [""],
      videos: product.videos || [{ title: "", url: "" }],
    });

    if (product.image && product.image.length > 0) {
      const imageUrls = product.image.map(img => 
        img.startsWith('http') ? img : `${BASE_URL}/uploads/${img.split('/').pop()}`
      );
      setCameraImagePreview(imageUrls);
    }

    setIsEditingCamera(true);
  };

  const handleDeleteCamera = async (id) => {
    if (!window.confirm("Are you sure you want to delete this camera product?")) return;

    try {
      const response = await fetch(`${BASE_URL}/api/cameras/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete camera product");

      alert("Camera product deleted successfully!");
      fetchCameraProducts();
    } catch (error) {
      console.error("Error deleting camera product:", error);
      setError("Failed to delete camera product");
    }
  };

  // Filter audio products
  const filteredAudioProducts = audioProducts.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(audioSearchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(audioSearchTerm.toLowerCase());
    const matchesType = audioTypeFilter === 'all' || product.type === audioTypeFilter;
    return matchesSearch && matchesType;
  });

  // Filter camera products
  const filteredCameraProducts = cameraProducts.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(cameraSearchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(cameraSearchTerm.toLowerCase());
    const matchesType = cameraTypeFilter === 'all' || product.type === cameraTypeFilter;
    return matchesSearch && matchesType;
  });

  // Audio types for filter
  const audioTypes = ['Headphones', 'Earbuds', 'Speakers', 'Soundbars', 'Microphones', 'Amplifiers'];

  // Camera types for filter
  const cameraTypes = ['DSLR', 'Mirrorless', 'Action Camera', 'Webcam', 'Point & Shoot', 'Security Camera', 'Lens'];

  useEffect(() => {
    // Connect to Socket.io server 
    const socketConnection = io("http://localhost:4000", {
      transports: ["polling", "websocket"],
      withCredentials: true,
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        const socketUserId = localStorage.getItem('user');
        if (!socketUserId) {
          console.log("No userId found in localStorage!");
        } else {
          socket.emit("user-online", socketUserId);
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/admin/device-info");
        const data = await response.json();
        setDeviceInfo(data);
      } catch (error) {
        console.error("Error fetching device info:", error);
      }
    };

    const fetchLocationInfo = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/admin/location");
        const data = await response.json();
        setLocationInfo(data);
      } catch (error) {
        console.error("Error fetching location info:", error);
      }
    };

    fetchDeviceInfo();
    fetchLocationInfo();
  }, []);

  useEffect(() => {
    const fetchProducts = async (page = 1, limit = 10) => {
      try {
        const response = await fetch(`http://localhost:4000/api/admin/products?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        const allProducts = [
          ...data.prebuildPC,
          ...data.refurbishedProducts,
          ...data.miniPCs,
          ...data.officePC,
        ].filter(product => product && product.type);

        console.log("All Products:", allProducts);
        setProducts(allProducts);

        const uniqueCategories = [...new Set(allProducts.map((product) => product.type))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error(error);
        setError("Unable to load products. Please try again.");
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/admin/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load users. Please try again.");
      }
    };

    const fetchPendingOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.userId;

        const response = await fetch(`http://localhost:4000/api/users/${userId}/orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch pending orders');

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
        setError('Unable to fetch pending orders');
      }
    };

    const fetchData = async () => {
      try {
        const [subResponse, msgResponse] = await Promise.all([
          fetch("http://localhost:4000/api/subscribers"),
          fetch("http://localhost:4000/api/message-history"),
        ]);

        setSubscribers(await subResponse.json());
        setMessageHistory(await msgResponse.json());
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      }
    };

    fetchProducts(1, 10);
    fetchUsers();
    fetchPendingOrders();
    fetchData();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setIsAuthenticated(false);
            localStorage.removeItem("token");
          }
          throw new Error("Failed to fetch dashboard data");
        }

        const stats = await response.json();
        setDashboardStats(stats);
      } catch (error) {
        console.error(error);
        setError("Unable to load dashboard stats. Please try again.");
      }
    };

    const fetchLoginHistory = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/admin/login-history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch login history");
        }

        const data = await response.json();
        setLoginHistory(data.loginHistory);
      } catch (error) {
        console.error(error);
        setError("Unable to load login history. Please try again.");
      }
    };

    if (isAuthenticated) {
      fetchStats();
      fetchLoginHistory();
    }
  }, [isAuthenticated]);

  const setLogoutTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsAuthenticated(false);
      setCountdown(0);
      localStorage.setItem("countdown", 0);
      alert("Session timed out due to inactivity.");
    }, countdown * 1000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }

    const resetTimeoutOnActivity = () => {
      setLogoutTimeout();
    };

    window.addEventListener("mousemove", resetTimeoutOnActivity);
    window.addEventListener("keydown", resetTimeoutOnActivity);

    const intervalId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(intervalId);
          setIsAuthenticated(false);
          localStorage.removeItem("countdown");
          return 0;
        }
        const newCountdown = prev - 1;
        localStorage.setItem("countdown", newCountdown);
        return newCountdown;
      });
    }, 1000);

    setLogoutTimeout();

    return () => {
      window.removeEventListener("mousemove", resetTimeoutOnActivity);
      window.removeEventListener("keydown", resetTimeoutOnActivity);
      clearInterval(intervalId);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const intervalId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(intervalId);
          setIsAuthenticated(false);
          setError("Session timed out due to inactivity.");
          localStorage.removeItem("countdown");
          return 0;
        }
        const newCountdown = prev - 1;
        localStorage.setItem("countdown", newCountdown);
        return newCountdown;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  };

  const handleImageChange = (e) => {
    const imageFiles = e.target.files;

    if (imageFiles && imageFiles.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const validFiles = Array.from(imageFiles).filter(file => allowedTypes.includes(file.type));

      if (validFiles.length !== imageFiles.length) {
        alert('Some files are invalid. Only JPEG, PNG, and GIF are allowed.');
        return;
      }

      const previewUrls = validFiles.map(file => URL.createObjectURL(file));

      setImagePreview((prev) => [...prev, ...previewUrls]);

      setFormData((prevData) => ({
        ...prevData,
        image: Array.isArray(prevData.image) ? [...prevData.image, ...validFiles] : [...validFiles],
      }));
    } else {
      console.log("No files selected or invalid input");
    }
  };

  const handleImageRemove = (index) => {
    setImagePreview(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error("Failed to add user");
      const data = await response.json();
      setUsers(data.users);
      setNewUser({ name: '', email: '', password: '', phoneNumber: '' });
    } catch (error) {
      console.error(error);
      setError("Unable to add user. Please try again.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to delete user");
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error(error);
      setError("Unable to delete user. Please try again.");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditedUser({
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!editedUser.username || !editedUser.email || !editedUser.phoneNumber || !editedUser.password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/admin/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) throw new Error("Failed to update user");
      const updatedUser = await response.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );

      setEditingUser(null);
      setEditedUser({ username: '', email: '', password: '', phoneNumber: '' });
    } catch (error) {
      console.error(error);
      setError("Unable to update user. Please try again.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const buildFormData = (formData) => {
    const formDataToSend = new FormData();

    if (["pre-built PC", "refurbished laptop", "mini PC", "office PC"].includes(formData.type)) {
      formData.id = formData.id || `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    }

    if (!formData.id) {
      formData.id = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
      console.log("Generated ID:", formData.id);
    }

    if (!formData.customId) {
      formData.customId = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
      console.log("Generated customId:", formData.customId);
    }

    formData.stock = formData.stock === "no" ? false : true;

    Object.keys(formData).forEach((key) => {
      if (!['notes', 'otherTechnicalDetails', 'image'].includes(key)) {
        formDataToSend.append(key, formData[key]);
      }
    });

    const appendOptions = (options, key) => {
      if (Array.isArray(options) && options.length > 0) {
        options.forEach((option, index) => {
          const serializedOption = JSON.stringify(option);
          formDataToSend.append(`${key}[${index}]`, serializedOption);
        });
      } else {
        console.error(`${key} is not an array or is undefined.`, options);
      }
    };

    if (["Pre-Built PC"].includes(formData.type)) {
      appendOptions(formData.ramOptions, "ramOptions");
      appendOptions(formData.storage1Options, "storage1Options");
      appendOptions(formData.storage2Options, "storage2Options");
    }

    const productTypeFields = {
      "pre-built PC": ["platform", "motherboard", "ramOptions", "storage1Options", "storage2Options",
        "liquidcooler", "graphiccard", "smps", "cabinet"],
      "refurbished laptop": ["ram", "storage", "graphiccard", "display", "os", "condition"],
      "mini PC": ["platform", "ram", "storage", "graphiccard", "motherboard", "smps", "cabinet"],
      "office PC": ["platform", "motherboard", "ram", "storage", "graphiccard", "smps", "cabinet"],
    };

    (productTypeFields[formData.type] || []).forEach((field) => {
      formDataToSend.append(field, formData[field]);
    });

    if (formData.image) {
      const images = Array.isArray(formData.image) ? formData.image : [formData.image];
      images.forEach((file) => {
        if (file instanceof File) {
          formDataToSend.append("image", file);
        } else {
          console.error("Non-file object found in image array", file);
        }
      });
    } else {
      console.error("No image found in formData.");
    }

    if (formData.notes) {
      if (Array.isArray(formData.notes)) {
        formDataToSend.append("notes", JSON.stringify(formData.notes));
      } else if (typeof formData.notes === "string") {
        formDataToSend.append("notes", formData.notes);
      }
    }
    if (formData.otherTechnicalDetails) {
      formDataToSend.append("otherTechnicalDetails", JSON.stringify(formData.otherTechnicalDetails));
    }

    console.log("Final FormData to be sent:");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}: ${value}`);
    }

    return formDataToSend;
  };

  const submitProduct = async (url, method, formDataToSend) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error Details:", errorDetails);
        throw new Error(`Failed to save product: ${errorDetails.message || response.statusText}`);
      }

      const data = await response.json();
      alert('Product created successfully');
      console.log(`${method === "POST" ? "Created" : "Updated"} product successfully:`, data);
      return data;
    } catch (error) {
      console.error("Error in product submission:", error);
      throw error;
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing) {
      formData.id = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    }

    const isEditOperation = isEditing && formData.id;

    try {
      const formDataToSend = buildFormData(formData);
      const method = isEditOperation ? "PUT" : "POST";
      console.log(formData.type);

      const url = isEditOperation
        ? `http://localhost:4000/api/admin/products/${encodeURIComponent(formData.type)}/${formData.id}`
        : "http://localhost:4000/api/admin/products/add";

      console.log("Final URL:", url);
      console.log("Request Method:", method);
      console.log("FormDataToSend:", formDataToSend);

      const result = await submitProduct(url, method, formDataToSend);

      setProducts(result.products);
      setFormData({
        id: null,
        type: "",
        name: "",
        price: "",
        category: "",
        description: "",
        image: null,
        ramOptions: [{ value: "", price: "" }],
        storage1Options: [{ value: "", price: "" }],
        storage2Options: [{ value: "", price: "" }],
        otherTechnicalDetails: [{ name: "", value: "" }],
        notes: [""],
      });
      setIsEditing(false);
      setImagePreview(null);
    } catch (error) {
      setError(error.message || "Unable to save product. Please try again.");
    }
  };

  const handleDelete = async (id, productType) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/products/${productType}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to delete product");

      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error(error);
      setError("Unable to delete product. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const newCountdown = 10800;
    localStorage.setItem("countdown", newCountdown);
    setCountdown(newCountdown);

    try {
      const response = await fetch("http://localhost:4000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid credentials");
        }
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      setCredentials({ username: "", password: "" });

      const loginEvent = {
        username: credentials.username,
        date: new Date().toLocaleString(),
      };
      setLoginHistory((prevHistory) => [loginEvent, ...prevHistory]);

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    setCountdown(0);
    localStorage.setItem("countdown", 0);
    alert("You have logged out successfully.");
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error('Failed to update order status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updateDeliveryDate = async (orderId, newDate) => {
    try {
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}/delivery-date`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ deliveryDate: new Date(newDate).toISOString() }),
      });

      if (!response.ok) throw new Error('Failed to update delivery date');

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, deliveryDate: newDate } : order
        )
      );
    } catch (error) {
      console.error(error);
      setError('Unable to update delivery date');
    }
  };

  const updateOrderState = async (orderId, action) => {
    try {
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}/state`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        console.log(`Order ${action} successfully:`, updatedOrder);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, status: action === 'confirmed' ? 'Confirmed' : 'Cancelled' }
              : order
          )
        );
      } else {
        console.error('Failed to update order state:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating order state:', error);
    }
  };

  const handleOtherTechnicalDetailsChange = (index, field, value) => {
    const updatedDetails = [...formData.otherTechnicalDetails];
    updatedDetails[index][field] = value;
    setFormData({ ...formData, otherTechnicalDetails: updatedDetails });
  };

  const addOtherTechnicalDetail = () => {
    setFormData(prevData => ({
      ...prevData,
      otherTechnicalDetails: [
        ...prevData.otherTechnicalDetails,
        { name: "", value: "" },
      ],
    }));
  };

  const removeOtherTechnicalDetail = (index) => {
    const updatedDetails = formData.otherTechnicalDetails.filter((_, i) => i !== index);
    setFormData({ ...formData, otherTechnicalDetails: updatedDetails });
  };

  const handleNotesChange = (index, value) => {
    const updatedNotes = [...formData.notes];
    updatedNotes[index] = value;
    setFormData({ ...formData, notes: updatedNotes });
  };

  const addNote = () => {
    setFormData({ ...formData, notes: [...formData.notes, ""] });
  };

  const removeNote = (index) => {
    const updatedNotes = formData.notes.filter((_, i) => i !== index);
    setFormData({ ...formData, notes: updatedNotes });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: recipient.split(',').map((email) => email.trim()),
          subject,
          message,
        }),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setRecipient("");
        setSubject("");
        setMessage("");
        const historyResponse = await fetch("http://localhost:4000/api/message-history");
        setMessageHistory(await historyResponse.json());
      } else {
        console.error("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDynamicChange = (e, index, field) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedField = [...prevData[field]];
      updatedField[index][name.includes("Price") ? "price" : "value"] = value;
      return { ...prevData, [field]: updatedField };
    });
  };

  const addField = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], { value: "", price: "" }],
    }));
  };

  const removeField = (field, index) => {
    setFormData((prevData) => {
      const updatedField = [...prevData[field]];
      updatedField.splice(index, 1);
      return { ...prevData, [field]: updatedField };
    });
  };

  const toggleBox = () => setIsOpen(!isOpen);
  const toggleBox1 = () => setIsOpenforLocation((prev) => !prev);

  const handleDeletedeviceinformation = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/device-info', { method: 'DELETE' });

      if (response.ok) {
        setDeviceInfo([]);
        alert('All device information has been deleted.');
      } else {
        const errorData = await response.json();
        alert('Error: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error deleting device information:', error);
      alert('Failed to delete device information.');
    }
  };

  const handleDeletelocationinformation = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/location-info', { method: 'DELETE' });

      if (response.ok) {
        setLocationInfo([]);
        alert('All location information has been deleted.');
      } else {
        const errorData = await response.json();
        alert('Error: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error deleting location information:', error);
      alert('Failed to delete location information.');
    }
  }

  const toggleHistory = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedOrders.length === 0) {
      alert("Please select orders to delete.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/admin/orders/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderIds: selectedOrders }),
      });

      if (response.ok) {
        alert("Orders deleted successfully!");
        setOrders((prevOrders) => prevOrders.filter((order) => !selectedOrders.includes(order._id)));
        setSelectedOrders([]);
      } else {
        alert("Failed to delete orders.");
      }
    } catch (error) {
      console.error("Error deleting orders:", error);
    }
  };

  const deleteAllLoginHistory = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/admin/clear-login-history", {
        method: "DELETE",
      });

      if (response.ok) {
        alert("All login history has been deleted.");
        setLoginHistory([]);
      } else {
        console.error("Failed to delete login history");
      }
    } catch (error) {
      console.error("Error deleting login history:", error);
    }
  };

  // Add these state variables
  const [notes, setNotes] = useState([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '', createdAt: '' });
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [notesSearchTerm, setNotesSearchTerm] = useState('');
  
  // Add these functions
  const fetchNotes = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/notes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError("Failed to load notes");
    }
  };
  
  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/admin/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: currentNote.title,
          content: currentNote.content
        }),
      });
      
      if (!response.ok) throw new Error('Failed to add note');
      
      const data = await response.json();
      setNotes([data.note, ...notes]);
      resetNoteForm();
    } catch (error) {
      console.error("Error adding note:", error);
      setError("Failed to add note");
    }
  };
  
  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/admin/notes/${currentNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: currentNote.title,
          content: currentNote.content
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update note');
      
      const data = await response.json();
      setNotes(notes.map(note => note._id === currentNote.id ? data.note : note));
      resetNoteForm();
    } catch (error) {
      console.error("Error updating note:", error);
      setError("Failed to update note");
    }
  };
  
  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    
    try {
      const response = await fetch(`${BASE_URL}/api/admin/notes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to delete note');
      
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete note");
    }
  };
  
  const resetNoteForm = () => {
    setCurrentNote({ id: null, title: '', content: '', createdAt: '' });
    setIsEditingNote(false);
  };
  
  const handleEditNote = (note) => {
    setCurrentNote({
      id: note._id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt
    });
    setIsEditingNote(true);
  };
  
  // Add useEffect to fetch notes
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated]);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
              {dashboardStats ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="p-6 bg-gray-800 rounded-md shadow-md">
                    <h3 className="text-xl font-medium">Total Users</h3>
                    <p className="text-2xl font-bold mt-2">{dashboardStats.totalUsers}</p>
                  </div>
                  <div className="p-6 bg-gray-800 rounded-md shadow-md">
                    <h3 className="text-xl font-medium">Total Products</h3>
                    <p className="text-2xl font-bold mt-2">{dashboardStats.totalProducts}</p>
                  </div>
                  <div className="p-6 bg-gray-800 rounded-md shadow-md">
                    <h3 className="text-xl font-medium">Pending Orders</h3>
                    <p className="text-2xl font-bold mt-2">{dashboardStats.pendingOrders}</p>
                  </div>
                  <div className="p-6 bg-gray-800 rounded-md shadow-md">
                    <h3 className="text-xl font-medium">Online Users</h3>
                    <p className="text-2xl font-bold mt-2">{dashboardStats.totalOnlineUsers}</p>
                  </div>
                </div>
              ) : (
                <p className="text-red-500">Loading dashboard stats...</p>
              )}
              <DashboardGraphs />
            </section>
          </div>
        );

      case 'pending-orders':
        return (
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Pending Orders</h2>
            {error && <p className="error text-red-500">{error}</p>}
            <div className="bg-gray-800 p-6 rounded-md shadow-md">
              <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <input
                  type="text"
                  placeholder="Search by Order ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700 text-gray-300 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/3"
                />
                {filteredOrders.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="py-2 px-4 bg-red-500 text-gray-900 rounded-md hover:bg-red-600 transition whitespace-nowrap"
                  >
                    Delete Selected Orders
                  </button>
                )}
              </div>
              
              {filteredOrders.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-700">
                  <div className="max-h-[500px] overflow-y-auto">
                    <table className="w-full text-sm text-gray-300 min-w-[1200px]">
                      <thead className="bg-gray-700 sticky top-0 z-10">
                        <tr>
                          <th className="py-3 px-2 text-center w-12">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedOrders(filteredOrders.map(order => order._id));
                                } else {
                                  setSelectedOrders([]);
                                }
                              }}
                              checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                              className="w-4 h-4"
                            />
                          </th>
                          <th className="py-3 px-2 w-40">Order ID</th>
                          <th className="py-3 px-2 w-48">Product Details</th>
                          <th className="py-3 px-2 w-64">User Details</th>
                          <th className="py-3 px-2 w-32">Payment</th>
                          <th className="py-3 px-2 w-24">Price (₹)</th>
                          <th className="py-3 px-2 w-28">Order Date</th>
                          <th className="py-3 px-2 w-32">Delivery Date</th>
                          <th className="py-3 px-2 w-32">Status</th>
                          <th className="py-3 px-2 w-32 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr
                            key={order._id}
                            className={`border-b border-gray-700 hover:bg-gray-750 ${
                              order.status === "Pending"
                                ? "bg-red-900/30 hover:bg-red-900/50"
                                : order.status === "Processing"
                                ? "bg-yellow-900/30 hover:bg-yellow-900/50"
                                : order.status === "Shipped"
                                ? "bg-blue-900/30 hover:bg-blue-900/50"
                                : order.status === "Delivered"
                                ? "bg-green-900/30 hover:bg-green-900/50"
                                : order.status === "Cancelled"
                                ? "bg-gray-700/50 hover:bg-gray-700/70"
                                : "bg-gray-800 hover:bg-gray-750"
                            }`}
                          >
                            {/* Select Checkbox */}
                            <td className="py-3 px-2 text-center">
                              <input
                                type="checkbox"
                                checked={selectedOrders.includes(order._id)}
                                onChange={() => handleSelectOrder(order._id)}
                                className="w-4 h-4"
                              />
                            </td>
                          
                            {/* Order ID */}
                            <td className="py-3 px-2">
                              <div className="font-mono text-xs truncate" title={order._id}>
                                {order._id.substring(0, 12)}...
                              </div>
                            </td>
                          
                            {/* Product Details */}
                            <td className="py-3 px-2">
                              <div className="space-y-1">
                                <p className="font-semibold text-sm truncate" title={order.product.name}>
                                  {order.product.name}
                                </p>
                                <p className="text-xs text-gray-400 truncate" title={`Code: ${order.product.code}`}>
                                  Code: {order.product.code}
                                </p>
                              </div>
                            </td>
                          
                            {/* User Details */}
                            <td className="py-3 px-2">
                              <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                                <p className="text-xs">
                                  <span className="font-medium">Name:</span> {order.userDetails.name}
                                </p>
                                <p className="text-xs truncate" title={order.userDetails.email}>
                                  <span className="font-medium">Email:</span> {order.userDetails.email}
                                </p>
                                <p className="text-xs">
                                  <span className="font-medium">Phone:</span> {order.userDetails.phoneNumber}
                                </p>
                                <div className="text-xs text-gray-400 mt-1 line-clamp-2" 
                                     title={`${order.userDetails.address.line1}, ${order.userDetails.address.line2}, ${order.userDetails.address.city}, ${order.userDetails.address.state}, ${order.userDetails.address.zip}`}>
                                  <span className="font-medium">Address:</span> {`${order.userDetails.address.line1}, ${order.userDetails.address.city}`}
                                </div>
                              </div>
                            </td>
                          
                            {/* Payment Method */}
                            <td className="py-3 px-2">
                              <span className="text-xs px-2 py-1 bg-gray-700 rounded-md">
                                {order.paymentMethod}
                              </span>
                            </td>
                          
                            {/* Final Price */}
                            <td className="py-3 px-2 font-semibold">
                              ₹{order.totalPrice}
                            </td>
                          
                            {/* Order Date */}
                            <td className="py-3 px-2 text-xs">
                              {new Date(order.date).toLocaleDateString('en-IN')}
                            </td>
                          
                            {/* Delivery Date */}
                            <td className="py-3 px-2">
                              <input
                                type="date"
                                value={order.deliveryDate && !isNaN(new Date(order.deliveryDate).getTime())
                                  ? new Date(order.deliveryDate).toISOString().split('T')[0]
                                  : ""
                                }
                                onChange={(e) => updateDeliveryDate(order._id, e.target.value)}
                                className="w-full text-xs bg-gray-700 text-gray-300 py-1 px-2 rounded-md border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </td>
                              
                            {/* Status */}
                            <td className="py-3 px-2">
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                className="w-full text-xs bg-gray-700 text-gray-300 py-1 px-2 rounded-md border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                              
                            {/* Actions */}
                            <td className="py-3 px-2">
                              <div className="flex flex-col sm:flex-row gap-1 justify-center">
                                <button
                                  onClick={() => updateOrderState(order._id, 'confirmed')}
                                  className="px-2 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition flex-1 text-center"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => updateOrderState(order._id, 'cancelled')}
                                  className="px-2 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition flex-1 text-center"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No pending orders found.</p>
                </div>
              )}
            </div>
          </section>
        );

      case 'manage-users':
        return (
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
            <div className="bg-gray-800 p-6 rounded-md shadow-md">
              {users && users.length > 0 ? (
                <div className="overflow-x-auto max-h-[150px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="p-3 text-indigo-400">Username</th>
                        <th className="p-3 text-indigo-400">Email</th>
                        <th className="p-3 text-indigo-400">Phone</th>
                        <th className="p-3 text-indigo-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="border-t border-gray-600">
                          <td className="p-3">{user.name}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">{user.phoneNumber}</td>
                          <td className="p-3 flex space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No users found. Please add users.</p>
              )}
            </div>

            {editingUser && (
              <form onSubmit={handleUpdateUser} className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Edit User</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="username"
                    value={editedUser.username}
                    onChange={handleInputChange}
                    className="p-3 bg-gray-700 rounded-md text-gray-200"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    className="p-3 bg-gray-700 rounded-md text-gray-200"
                    required
                  />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editedUser.phoneNumber}
                    onChange={handleInputChange}
                    className="p-3 bg-gray-700 rounded-md text-gray-200"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    value={editedUser.password}
                    onChange={handleInputChange}
                    className="p-3 bg-gray-700 rounded-md text-gray-200"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </form>
            )}

            <form onSubmit={handleAddUser} className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Add New User</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Username"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className="p-3 bg-gray-700 rounded-md text-gray-200"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="p-3 bg-gray-700 rounded-md text-gray-200"
                  required
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="p-3 bg-gray-700 rounded-md text-gray-200 w-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={newUser.phoneNumber}
                  onChange={handleInputChange}
                  className="p-3 bg-gray-700 rounded-md text-gray-200"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Add User
              </button>
            </form>
          </section>
        );

      case 'discount-codes':
        return <DiscountCode />;

      case 'manage-products':
        return (
          <section className="relative">
            <h2 className="text-2xl font-semibold mb-4">
              Manage Products{" "}
              <span className="text-2x1">({dashboardStats?.totalProducts})</span>
            </h2>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-md bg-gray-700 text-white w-full md:w-1/2"
              />
            </div>

            <div className="bg-gray-800 p-6 rounded-md shadow-md grid grid-cols-1 gap-6 md:grid-cols-2 justify-items-center">
              {categories && categories.length > 0 ? (
                categories.map((category) => {
                  const filteredProducts = Array.isArray(products)
                    ? products.filter(product =>
                      product.type === category &&
                      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.code.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    : [];

                  return (
                    <div key={category} className="bg-gray-800 p-6 rounded-md shadow-lg w-full max-w-full md:max-w-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-medium mb-4">{category}</h3>
                        <div className="relative bg-gray-800 p-6 rounded-lg shadow-lg w-36 h-16 md:w-40 md:h-18 flex justify-center items-center border border-gray-700 hover:shadow-indigo-500/50 transition duration-300 ease-in-out transform hover:scale-105">
                          {!isEditing && (
                            <button
                              onClick={() => {
                                setIsEditing(true)
                                setFormData({
                                  id: null,
                                  type: "",
                                  name: "",
                                  price: "",
                                  category: "",
                                  description: "",
                                  image: null,
                                  ramOptions: [{ value: "", price: "" }],
                                  storage1Options: [{ value: "", price: "" }],
                                  storage2Options: [{ value: "", price: "" }],
                                  otherTechnicalDetails: [{ name: "", value: "" }],
                                  notes: [""],
                                });
                              }}
                              className="bg-indigo-500 text-white p-4 w-10 h-10 rounded-full flex justify-center items-center text-3xl font-bold hover:bg-indigo-600 transition transform hover:scale-110 hover:shadow-indigo-500/50 shadow-lg"
                            >
                              +
                            </button>
                          )}
                        </div>
                      </div>
                      {filteredProducts.length > 0 ? (
                        <>
                          <p className="text-gray-300 mb-4">Total Products: {filteredProducts.length}</p>
                          <ul className="space-y-4" style={{ maxHeight: 'calc(3 * 10rem)', overflowY: 'auto' }}>
                            {filteredProducts.map((product) => (
                              <li
                                key={product._id}
                                className="p-4 bg-gray-700 rounded-md flex flex-col md:flex-row justify-between items-center space-x-0 md:space-x-4 space-y-4 md:space-y-0"
                              >
                                <div className="flex-shrink-0">
                                  {product.image && Array.isArray(product.image) && product.image.length > 0 && (
                                    <img
                                      src={`http://localhost:4000/uploads/${product.image[0].split(/[\\/]/).pop()}`}
                                      alt={product.name}
                                      loading="lazy"
                                      className="w-16 h-16 object-cover rounded-md"
                                    />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-md font-semibold text-white">{product.type}</h3>
                                  <h4 className="text-lg font-semibold text-white">{product.name}</h4>
                                  <p className="text-sm text-gray-300">{product.description}</p>
                                  <p className="text-sm font-medium text-green-400">Price: ₹{product.price}</p>
                                  <p className="text-sm text-gray-400">Category: {product.category}</p>
                                </div>
                                <div className="space-x-2">
                                  <button
                                    onClick={() => {
                                      const formattedDate = product.dateAdded.split("T")[0];
                                      const processedImage = Array.isArray(product.image)
                                        ? product.image.map((img) =>
                                          img.includes("uploads")
                                            ? `http://localhost:4000/uploads/${img.split(/[\\/]/).pop()}`
                                            : img
                                        )
                                        : [];

                                      setFormData({
                                        id: product._id,
                                        name: product.name,
                                        price: product.price,
                                        image: product.image,
                                        originalPrice: product.originalPrice,
                                        brand: product.brand,
                                        category: product.category,
                                        description: product.description,
                                        stock: product.inStock ? "yes" : "no",
                                        code: product.code,
                                        discount: product.discount,
                                        bonuses: product.bonuses,
                                        dateAdded: formattedDate,
                                        popularity: product.popularity,
                                        otherTechnicalDetails: product.otherTechnicalDetails,
                                        notes: product.notes,
                                        condition: product.condition,
                                        cpu: product.specs.cpu,
                                        graphiccard: product.specs.graphiccard || product.specs.GraphicCard,
                                        display: product.specs.display,
                                        os: product.specs.os,
                                        platform: product.specs.platform,
                                        motherboard: product.specs.motherboard,
                                        ram: product.specs.ram,
                                        ramOptions: Array.isArray(product.specs.ramOptions) ? product.specs.ramOptions : [],
                                        storage: product.specs.storage,
                                        storage1Options: Array.isArray(product.specs.storage1Options) ? product.specs.storage1Options : [],
                                        storage2Options: Array.isArray(product.specs.storage2Options) ? product.specs.storage2Options : [],
                                        liquidcooler: product.specs.liquidcooler,
                                        smps: product.specs.smps,
                                        cabinet: product.specs.cabinet,
                                        type: product.type,
                                      })
                                      setImagePreview(processedImage);
                                      setIsEditing(true)
                                    }}
                                    className="py-1 px-3 bg-indigo-500 text-gray-900 rounded-md hover:bg-indigo-600 transition"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(product._id, 'prebuild')}
                                    className="py-1 px-3 bg-red-500 text-gray-900 rounded-md hover:bg-red-600 transition"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                          <p className="text-gray-400 text-lg">No products available in this category.</p>
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setFormData({
                                id: null,
                                type: category,
                                name: "",
                                price: "",
                                category: "",
                                description: "",
                                image: null,
                                ramOptions: [{ value: "", price: "" }],
                                storage1Options: [{ value: "", price: "" }],
                                storage2Options: [{ value: "", price: "" }],
                                otherTechnicalDetails: [{ name: "", value: "" }],
                                notes: [""],
                              });
                            }}
                            className="bg-indigo-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-600 transition transform hover:scale-105 shadow-lg"
                          >
                            ➕ Add First Product
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <p className="text-gray-400 text-lg">No products available.</p>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setFormData({
                        id: null,
                        type: "",
                        name: "",
                        price: "",
                        category: "",
                        description: "",
                        image: null,
                        ramOptions: [{ value: "", price: "" }],
                        storage1Options: [{ value: "", price: "" }],
                        storage2Options: [{ value: "", price: "" }],
                        otherTechnicalDetails: [{ name: "", value: "" }],
                        notes: [""],
                      });
                    }}
                    className="bg-indigo-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-600 transition transform hover:scale-105 shadow-lg"
                  >
                    ➕ Add First Product
                  </button>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full flex flex-col justify-between h-[90vh]">
                  <h3 className="text-xl font-medium mb-4">{formData.id ? "Edit Product" : "Add Product"}</h3>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="py-2 px-4 mb-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                  <form onSubmit={handleProductSubmit} encType="multipart/form-data" className="flex-grow flex flex-col space-y-4 overflow-y-auto">
                    <div>
                      <label className="block text-sm mb-1">Product Type</label>
                      <select
                        name="type"
                        value={formData.type || ""}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                        required
                      >
                        <option value="" disabled>Select Product Type</option>
                        <option value="Pre-Built PC">Pre-Built PC</option>
                        <option value="Office PC">Office PC</option>
                        <option value="Refurbished Laptop">Refurbished Laptop</option>
                        <option value="Mini PC">Mini PC</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Product Image</label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                        multiple
                      />
                      {imagePreview && imagePreview.length > 0 && (
                        <div className="mt-4 flex flex-wrap">
                          {imagePreview.map((preview, index) => (
                            <div key={index} className="relative mb-1 mr-2">
                              <button
                                type="button"
                                onClick={() => handleImageRemove(index)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                              >
                                X
                              </button>
                              <img
                                key={index}
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                loading="lazy"
                                className="max-w-xs max-h-32 mr-2 mb-1"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price || ""}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1 text-white">Original Price</label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice || ""}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Brand</label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand || ""}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Category</label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category || ""}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Description</label>
                      <textarea
                        name="description"
                        value={formData.description || ""}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Stock</label>
                      <div className="flex items-center space-x-4">
                        <div>
                          <label htmlFor="stockYes" className="mr-2 text-sm">Yes</label>
                          <input
                            type="radio"
                            id="stockYes"
                            name="stock"
                            value="yes"
                            checked={formData.stock === "yes"}
                            onChange={handleFormChange}
                            className="text-indigo-400"
                          />
                        </div>
                        <div>
                          <label htmlFor="stockNo" className="mr-2 text-sm">No</label>
                          <input
                            type="radio"
                            id="stockNo"
                            name="stock"
                            value="no"
                            checked={formData.stock === "no"}
                            onChange={handleFormChange}
                            className="text-indigo-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-1 text-white">Code</label>
                      <input
                        type="text"
                        name="code"
                        value={formData.code || ""}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1 text-white">Discount</label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount || ""}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1 text-white">Bonuses</label>
                      <textarea
                        name="bonuses"
                        placeholder="e.g., free accessories, extended warranty"
                        value={formData.bonuses || ""}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Product Date</label>
                      <input
                        type="date"
                        name="dateAdded"
                        value={formData.dateAdded || ""}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Popularity</label>
                      <input
                        type="number"
                        name="popularity"
                        value={formData.popularity || ""}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Condition</label>
                      <input
                        type="text"
                        name="condition"
                        value={formData.condition || ""}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">CPU</label>
                      <input
                        type="text"
                        name="cpu"
                        placeholder="e.g., Intel i5, Ryzen 7"
                        value={formData.cpu || ""}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Graphic Card</label>
                      <input
                        type="text"
                        name="graphiccard"
                        placeholder="e.g., Arc A380 - Intel 6GB"
                        value={formData.graphiccard || ""}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                      />
                    </div>

                    {["Mini PC", "Pre-Built PC", "Office PC"].includes(formData.type) && (
                      <>
                        <div>
                          <label className="block text-sm mb-1">PlatForm</label>
                          <input
                            type="text"
                            name="platform"
                            placeholder="e.g., AMD, Intel"
                            value={formData.platform || ""}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm mb-1">Motherboard</label>
                          <input
                            type="text"
                            name="motherboard"
                            placeholder="e.g., MSI B450 Tomahawk"
                            value={formData.motherboard || ""}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                          />
                        </div>

                        {["Mini PC", "Office PC"].includes(formData.type) && (
                          <>
                            <div>
                              <label className="block text-sm mb-1">RAM</label>
                              <input
                                type="text"
                                name="ram"
                                placeholder="e.g., 8GB, 16GB"
                                value={formData.ram || ""}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                              />
                            </div>

                            <div>
                              <label className="block text-sm mb-1">Storage</label>
                              <input
                                type="text"
                                name="storage"
                                placeholder="e.g., 512GB SSD, 1TB HDD"
                                value={formData.storage || ""}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                              />
                            </div>
                          </>
                        )}

                        <div>
                          <label className="block text-sm mb-1">SMPS</label>
                          <input
                            type="text"
                            name="smps"
                            placeholder="e.g., Deepcool - PK450D Bronze"
                            value={formData.smps || ""}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm mb-1">Cabinet</label>
                          <input
                            type="text"
                            name="cabinet"
                            placeholder="e.g., NZXT H510"
                            value={formData.cabinet || ""}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                          />
                        </div>

                        {formData.type === "Pre-Built PC" && (
                          <>
                            <div>
                              <h3 className="text-lg font-semibold mb-4">RAM Configurations</h3>
                              {(formData.ramOptions || []).map((ram, index) => (
                                <div key={index} className="grid grid-cols-2 gap-4 items-center mb-6">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">RAM</label>
                                    <input
                                      type="text"
                                      name="value"
                                      placeholder="e.g., 8GB, 16GB"
                                      value={ram.value || ""}
                                      onChange={(e) => handleDynamicChange(e, index, "ramOptions")}
                                      className="w-full px-4 py-2 bg-gray-700 text-indigo-400 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Price</label>
                                    <input
                                      type="number"
                                      name={`ramPrice_${index}`}
                                      placeholder="e.g., 14000"
                                      value={ram.price || ""}
                                      onChange={(e) => handleDynamicChange(e, index, "ramOptions")}
                                      className="w-full px-4 py-2 bg-gray-700 text-indigo-400 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => removeField("ramOptions", index)}
                                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => addField("ramOptions")}
                                className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                              >
                                Add RAM Option
                              </button>
                            </div>

                            <div>
                              <h3 className="text-lg font-semibold mb-2">Storage1 Configurations</h3>
                              {formData.storage1Options?.map((storage, index) => (
                                <div key={index} className="grid grid-cols-2 gap-4 items-center mb-4">
                                  <div>
                                    <label className="block text-sm mb-1">Storage1</label>
                                    <input
                                      type="text"
                                      name={`storage1_${index}`}
                                      placeholder="e.g., 512GB SSD, 1TB HDD"
                                      value={storage.value || ""}
                                      onChange={(e) => handleDynamicChange(e, index, "storage1Options")}
                                      className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm mb-1">Price</label>
                                    <input
                                      type="number"
                                      name={`storage1Price_${index}`}
                                      placeholder="e.g., 14000"
                                      value={storage.price || ""}
                                      onChange={(e) => handleDynamicChange(e, index, "storage1Options")}
                                      className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                                    />
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => removeField("storage1Options", index)}
                                      className="px-4 py-2 bg-red-600 text-white rounded-md"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => addField("storage1Options")}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                              >
                                Add Storage 1 Option
                              </button>
                            </div>

                            <div>
                              <h3 className="text-lg font-semibold mb-2">Storage2 Configurations</h3>
                              {formData.storage2Options?.map((storage, index) => (
                                <div key={index} className="grid grid-cols-2 gap-4 items-center mb-4">
                                  <div>
                                    <label className="block text-sm mb-1">Storage2</label>
                                    <input
                                      type="text"
                                      name={`storage2_${index}`}
                                      placeholder="e.g., 512GB SSD, 1TB HDD"
                                      value={storage.value || ""}
                                      onChange={(e) => handleDynamicChange(e, index, "storage2Options")}
                                      className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm mb-1">Price</label>
                                    <input
                                      type="number"
                                      name={`storage2Price_${index}`}
                                      placeholder="e.g., 14000"
                                      value={storage.price || ""}
                                      onChange={(e) => handleDynamicChange(e, index, "storage2Options")}
                                      className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                                    />
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => removeField("storage2Options", index)}
                                      className="px-4 py-2 bg-red-600 text-white rounded-md"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => addField("storage2Options")}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                              >
                                Add Storage 2 Option
                              </button>
                            </div>

                            <div>
                              <label className="block text-sm mb-1">Liquid Cooler</label>
                              <input
                                type="text"
                                name="liquidcooler"
                                placeholder="e.g., Cooler Master Hyper 212"
                                value={formData.liquidcooler || ""}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                              />
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {formData.type === "Refurbished Laptop" && (
                      <>
                        <div>
                          <label className="block text-sm mb-1">RAM</label>
                          <input
                            type="text"
                            name="ram"
                            placeholder="e.g., 8GB, 16GB"
                            value={formData.ram || ""}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm mb-1">Storage</label>
                          <input
                            type="text"
                            name="storage"
                            placeholder="e.g., 256GB SSD, 1TB HDD"
                            value={formData.storage || ""}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm mb-1">Display</label>
                          <input
                            type="text"
                            name="display"
                            placeholder="e.g., 15.6-inch FHD"
                            value={formData.display || ""}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm mb-1">Operating System</label>
                          <input
                            type="text"
                            name="os"
                            placeholder="e.g., Windows 10, Linux"
                            value={formData.os || ""}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                          />
                        </div>
                      </>
                    )}

                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-indigo-400">Other Technical Details</h3>
                      {formData.otherTechnicalDetails && formData.otherTechnicalDetails.length > 0
                        ? formData.otherTechnicalDetails.map((detail, index) => (
                          <div key={index} className="flex items-center gap-4 mb-2">
                            <input
                              type="text"
                              name="name"
                              placeholder="Detail Name (e.g., WIFI)"
                              value={detail.name}
                              onChange={(e) => handleOtherTechnicalDetailsChange(index, "name", e.target.value)}
                              className="w-1/2 px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                            />
                            <input
                              type="text"
                              name="value"
                              placeholder="Detail Value (e.g., 802.11ax Wi-Fi 6)"
                              value={detail.value}
                              onChange={(e) => handleOtherTechnicalDetailsChange(index, "value", e.target.value)}
                              className="w-1/2 px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeOtherTechnicalDetail(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))
                        : null}
                      <button
                        type="button"
                        onClick={addOtherTechnicalDetail}
                        className="px-4 py-2 mt-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
                      >
                        Add Detail
                      </button>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-indigo-400">Notes</h3>
                      {formData.notes && formData.notes.length > 0 ? (
                        formData.notes.map((note, index) => (
                          <div key={index} className="flex items-center gap-4 mb-2">
                            <textarea
                              name="note"
                              placeholder="Note"
                              value={note}
                              onChange={(e) => handleNotesChange(index, e.target.value)}
                              className="w-full px-3 py-2 bg-gray-700 text-indigo-400 rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeNote(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      ) : (
                        <p>No notes available</p>
                      )}

                      <button
                        type="button"
                        onClick={addNote}
                        className="px-4 py-2 mt-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
                      >
                        Add Note
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="py-2 px-4 bg-indigo-500 text-gray-900 font-semibold rounded-md hover:bg-indigo-600 transition"
                    >
                      {formData.id ? "Update Product" : "Create Product"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </section>
        );

      case 'manage-displays':
        return renderDisplayManagement();

      case 'manage-audio':
        return renderAudioManagement(); // You'll need to create this function

      case 'manage-cameras':
        return renderCameraManagement();

      case 'manage-mobiles':
        return renderMobileManagement();

      case 'manage-components':
        return renderPCComponentManagement();

      case 'manage-tv':
        return renderTVManagement();

      case 'manage-wearables':
        return renderWearableManagement();

      case 'manage-accessories':
        return renderAccessoryManagement();

      case 'manage-kitchen':
        return renderKitchenManagement();

      case 'manage-laundry':
        return renderLaundryManagement();

      case 'newsletter':
        return (
          <section className="mb-6">
            <div className="mx-auto bg-gray-800 shadow-md rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-6 text-2x1">
                Subscribers <span className="text-2x1">({subscribers.length})</span>
              </h1>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="border border-gray-300 p-3 text-left text-2x1">Email</th>
                      <th className="border border-gray-300 p-3 text-left text-2x1">Subscribed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.length > 0 ? (
                      subscribers.map((subscriber) => (
                        <tr key={subscriber._id} className="hover:bg-gray-950">
                          <td className="border border-gray-300 text-white p-3">{subscriber.email}</td>
                          <td className="border border-gray-300 text-white p-3">
                            {new Date(subscriber.subscribedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="border border-gray-300 p-3 text-center text-gray-500"
                        >
                          No subscribers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4">Send a Message</h2>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Recipient Email (comma-separated for multiple)"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    rows="5"
                    required
                  ></textarea>
                  <button className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
                    Send Message
                  </button>
                </form>
              </div>

              <div className="border border-gray-300 rounded-md shadow-md">
                <div
                  className="flex items-center justify-between p-4 bg-gray-100 cursor-pointer"
                  onClick={toggleHistory}
                >
                  <h2 className="text-xl font-bold">Message History</h2>
                  <span>
                    {isCollapsed ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 15.75L12 8.25l-7.5 7.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 9.75L12 13.25l3.75-3.5"
                        />
                      </svg>
                    )}
                  </span>
                </div>

                {!isCollapsed && (
                  <div className="p-4 space-y-4">
                    {messageHistory.map((msg) => (
                      <div
                        key={msg._id}
                        className="p-4 border border-gray-300 rounded-md shadow-sm"
                      >
                        <h3 className="font-bold">{msg.subject}</h3>
                        <p>{msg.message}</p>
                        <p className="text-sm text-gray-500">
                          Sent At: {new Date(msg.sentAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'device-info':
        return (
          <section className="my-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold mb-4">
                Device Information{" "}
                <span className="text-sm text-gray-500">({deviceInfo.length} entries)</span>
              </h3>
              <div className="flex items-center space-x-4">
                <button onClick={toggleBox} className="text-gray-500">
                  {isOpen ? <FaArrowUp /> : <FaArrowDown />}
                </button>
                {deviceInfo.length > 0 && (
                  <button
                    onClick={handleDeletedeviceinformation}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg text-sm mt-4"
                  >
                    Delete All
                  </button>
                )}
              </div>
            </div>

            {isOpen && (
              <ul className="space-y-4">
                {deviceInfo.length > 0 ? (
                  deviceInfo.map((info, index) => (
                    <li
                      key={index}
                      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                    >
                      <p className="text-lg text-gray-700">
                        User Agent: <span className="font-medium">{info.userAgent}</span>
                      </p>
                      <p className="text-lg text-gray-700">
                        Platform: <span className="font-medium">{info.platform}</span>
                      </p>
                      <p className="text-lg text-gray-700">
                        Screen Resolution:{" "}
                        <span className="font-medium">
                          {info.screenResolution.width}x{info.screenResolution.height}
                        </span>
                      </p>
                      <p className="text-lg text-gray-700">
                        Created At:{" "}
                        <span className="font-medium">
                          {new Date(info.createdAt).toLocaleString()}
                        </span>
                      </p>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No device information available.</p>
                )}
              </ul>
            )}
          </section>
        );

      case 'location-info':
        return (
          <section className="my-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold mb-4">
                Location Information{" "}
                <span className="text-sm text-gray-500">({locationInfo.length} entries)</span>
              </h3>
              <div className="flex items-center space-x-4">
                <button onClick={toggleBox1} className="text-gray-500">
                  {isOpenforLocation ? <FaArrowUp /> : <FaArrowDown />}
                </button>
                {locationInfo.length > 0 && (
                  <button
                    onClick={handleDeletelocationinformation}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg text-sm mt-4"
                  >
                    Delete All
                  </button>
                )}
              </div>
            </div>

            {isOpenforLocation && (
              <ul className="space-y-4">
                {locationInfo.length > 0 ? (
                  locationInfo.map((info, index) => (
                    <li
                      key={index}
                      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                    >
                      <p className="text-lg text-gray-700">
                        Latitude: <span className="font-medium">{info.latitude}</span>
                      </p>
                      <p className="text-lg text-gray-700">
                        Longitude: <span className="font-medium">{info.longitude}</span>
                      </p>
                      <p className="text-lg text-gray-700">
                        Created At:{" "}
                        <span className="font-medium">
                          {new Date(info.createdAt).toLocaleString()}
                        </span>
                      </p>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No location information available.</p>
                )}
              </ul>
            )}
          </section>
        );

      case 'login-history':
        return (
          <section className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Login History</h2>

              {loginHistory.length > 0 && (
                <button
                  onClick={deleteAllLoginHistory}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg text-sm mt-4"
                >
                  Delete All
                </button>
              )}
            </div>

            {loginHistory.length > 0 ? (
              <div className="space-y-4">
                {loginHistory.map((event, index) => (
                  <div key={index} className="p-4 bg-gray-800 rounded-md shadow-md">
                    <p className="text-lg font-medium">{event.username}</p>
                    <p className="text-sm text-gray-400">{event.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-red-500">No login history available.</p>
            )}
          </section>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-xl text-gray-400">Select a section from the menu</p>
          </div>
        );
    }
  };

  // Render Audio Management
  const renderAudioManagement = () => (
    <section className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Manage Audio Products <span className="text-sm text-gray-400">({audioProducts.length} total)</span>
        </h2>
        <button
          onClick={() => {
            resetAudioForm();
            setIsEditingAudio(true);
          }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add New Audio Product
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search audio products by name or brand..."
          value={audioSearchTerm}
          onChange={(e) => setAudioSearchTerm(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={audioTypeFilter}
          onChange={(e) => setAudioTypeFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Audio Types</option>
          {audioTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        {filteredAudioProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAudioProducts.map((product) => (
              <div key={product._id} className="bg-gray-700 rounded-lg p-4 hover:shadow-xl transition">
                {/* Product Image */}
                <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-600 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={`${BASE_URL}/uploads/${product.image[0].split('/').pop()}`}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 text-xs font-bold bg-indigo-600 text-white rounded mb-2">
                    {product.type}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                <p className="text-sm text-gray-300 mb-2">Brand: {product.brand || 'N/A'}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xl font-bold text-green-400">₹{product.price?.toLocaleString()}</p>
                  <p className={`text-sm ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>

                {/* Quick Specs Preview */}
                <div className="text-xs text-gray-300 mb-4 space-y-1 border-t border-gray-600 pt-2">
                  {product.specs?.driverSize && <p>Driver: {product.specs.driverSize}</p>}
                  {product.specs?.connectivity && (
                    <p>Connectivity: {Array.isArray(product.specs.connectivity) 
                      ? product.specs.connectivity.join(', ') 
                      : product.specs.connectivity}</p>
                  )}
                  {product.specs?.batteryLife && <p>Battery: {product.specs.batteryLife}</p>}
                  {product.specs?.noiseCancelling && (
                    <p className="text-indigo-400">✓ Noise Cancelling</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEditAudio(product)}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAudio(product._id)}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No audio products found.</p>
            <button
              onClick={() => {
                resetAudioForm();
                setIsEditingAudio(true);
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Add Your First Audio Product
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Audio Modal */}
      {isEditingAudio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-white">
                {audioFormData.id ? "Edit Audio Product" : "Add New Audio Product"}
              </h3>
              <button
                onClick={resetAudioForm}
                className="w-10 h-10 bg-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAudioSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Product Type *</label>
                  <select
                    name="type"
                    value={audioFormData.type}
                    onChange={handleAudioInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="Headphones">Headphones</option>
                    <option value="Earbuds">Earbuds</option>
                    <option value="Speakers">Speakers</option>
                    <option value="Soundbars">Soundbars</option>
                    <option value="Microphones">Microphones</option>
                    <option value="Amplifiers">Amplifiers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={audioFormData.name}
                    onChange={handleAudioInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    value={audioFormData.brand}
                    onChange={handleAudioInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={audioFormData.price}
                    onChange={handleAudioInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Original Price (₹)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={audioFormData.originalPrice}
                    onChange={handleAudioInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={audioFormData.category}
                    onChange={handleAudioInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Wireless, Gaming, Studio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Stock</label>
                  <select
                    name="stock"
                    value={audioFormData.stock}
                    onChange={handleAudioInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="yes">In Stock</option>
                    <option value="no">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Code/SKU</label>
                  <input
                    type="text"
                    name="code"
                    value={audioFormData.code}
                    onChange={handleAudioInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={audioFormData.discount}
                    onChange={handleAudioInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Condition</label>
                  <input
                    type="text"
                    name="condition"
                    value={audioFormData.condition}
                    onChange={handleAudioInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={audioFormData.description}
                    onChange={handleAudioInputChange}
                    rows="3"
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Audio Specifications */}
              <div className="border-t border-gray-600 pt-4">
                <h4 className="text-lg font-semibold text-white mb-4">Audio Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Driver Size</label>
                    <input
                      type="text"
                      name="driverSize"
                      value={audioFormData.driverSize}
                      onChange={handleAudioInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 40mm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Frequency Response</label>
                    <input
                      type="text"
                      name="frequencyResponse"
                      value={audioFormData.frequencyResponse}
                      onChange={handleAudioInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 20Hz - 20kHz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Impedance</label>
                    <input
                      type="text"
                      name="impedance"
                      value={audioFormData.impedance}
                      onChange={handleAudioInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 32 Ohms"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Sensitivity</label>
                    <input
                      type="text"
                      name="sensitivity"
                      value={audioFormData.sensitivity}
                      onChange={handleAudioInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 105dB"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Connectivity</label>
                    <input
                      type="text"
                      name="connectivity"
                      value={audioFormData.connectivity.join(', ')}
                      onChange={handleAudioInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Bluetooth, Wired, Wireless"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Bluetooth Version</label>
                    <input
                      type="text"
                      name="bluetoothVersion"
                      value={audioFormData.bluetoothVersion}
                      onChange={handleAudioInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 5.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Wireless Range</label>
                    <input
                      type="text"
                      name="wirelessRange"
                      value={audioFormData.wirelessRange}
                      onChange={handleAudioInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 10m"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Battery Life</label>
                    <input
                      type="text"
                      name="batteryLife"
                      value={audioFormData.batteryLife}
                      onChange={handleAudioInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 20 hours"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Charging Time</label>
                    <input
                      type="text"
                      name="chargingTime"
                      value={audioFormData.chargingTime}
                      onChange={handleAudioInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 2 hours"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={audioFormData.weight}
                      onChange={handleAudioInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 250g"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Color</label>
                    <input
                      type="text"
                      name="color"
                      value={audioFormData.color}
                      onChange={handleAudioInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Water Resistance</label>
                    <input
                      type="text"
                      name="waterResistant"
                      value={audioFormData.waterResistant}
                      onChange={handleAudioInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., IPX4, IP67"
                    />
                  </div>

                  {audioFormData.type === 'Speakers' || audioFormData.type === 'Soundbars' ? (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Output Power</label>
                        <input
                          type="text"
                          name="outputPower"
                          value={audioFormData.outputPower}
                          onChange={handleAudioInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 20W"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Channels</label>
                        <input
                          type="text"
                          name="channels"
                          value={audioFormData.channels}
                          onChange={handleAudioInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 2.0, 2.1, 5.1"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="subwoofer"
                          checked={audioFormData.subwoofer}
                          onChange={handleAudioInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm font-bold text-gray-300">Includes Subwoofer</label>
                      </div>
                    </>
                  ) : null}

                  {audioFormData.type === 'Microphones' ? (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Polar Pattern</label>
                        <input
                          type="text"
                          name="polarPattern"
                          value={audioFormData.polarPattern}
                          onChange={handleAudioInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., Cardioid, Omnidirectional"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Sample Rate</label>
                        <input
                          type="text"
                          name="sampleRate"
                          value={audioFormData.sampleRate}
                          onChange={handleAudioInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 192kHz"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Bit Depth</label>
                        <input
                          type="text"
                          name="bitDepth"
                          value={audioFormData.bitDepth}
                          onChange={handleAudioInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 24-bit"
                        />
                      </div>
                    </>
                  ) : null}
                </div>

                {/* Checkbox Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="fastCharging"
                      checked={audioFormData.fastCharging}
                      onChange={handleAudioInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Fast Charging</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="noiseCancelling"
                      checked={audioFormData.noiseCancelling}
                      onChange={handleAudioInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Noise Cancelling</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="builtInMic"
                      checked={audioFormData.builtInMic}
                      onChange={handleAudioInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Built-in Microphone</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="voiceAssistant"
                      checked={audioFormData.voiceAssistant}
                      onChange={handleAudioInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Voice Assistant</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="multipointConnection"
                      checked={audioFormData.multipointConnection}
                      onChange={handleAudioInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Multipoint Connection</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="touchControls"
                      checked={audioFormData.touchControls}
                      onChange={handleAudioInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Touch Controls</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="buttonControls"
                      checked={audioFormData.buttonControls}
                      onChange={handleAudioInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Button Controls</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="foldable"
                      checked={audioFormData.foldable}
                      onChange={handleAudioInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Foldable</label>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="border-t border-gray-600 pt-4">
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Product Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAudioImageChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  multiple
                />
                {audioImagePreview.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {audioImagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <button
                          type="button"
                          onClick={() => handleAudioImageRemove(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border-2 border-gray-600"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                  {audioFormData.id ? "Update Audio Product" : "Create Audio Product"}
                </button>
                <button
                  type="button"
                  onClick={resetAudioForm}
                  className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );

  // Render Camera Management
  const renderCameraManagement = () => (
    <section className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Manage Camera Products <span className="text-sm text-gray-400">({cameraProducts.length} total)</span>
        </h2>
        <button
          onClick={() => {
            resetCameraForm();
            setIsEditingCamera(true);
          }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add New Camera Product
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search camera products by name or brand..."
          value={cameraSearchTerm}
          onChange={(e) => setCameraSearchTerm(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={cameraTypeFilter}
          onChange={(e) => setCameraTypeFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Camera Types</option>
          {cameraTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        {filteredCameraProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCameraProducts.map((product) => (
              <div key={product._id} className="bg-gray-700 rounded-lg p-4 hover:shadow-xl transition">
                {/* Product Image */}
                <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-600 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={`${BASE_URL}/uploads/${product.image[0].split('/').pop()}`}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 text-xs font-bold bg-indigo-600 text-white rounded mb-2">
                    {product.type}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                <p className="text-sm text-gray-300 mb-2">Brand: {product.brand || 'N/A'}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xl font-bold text-green-400">₹{product.price?.toLocaleString()}</p>
                  <p className={`text-sm ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>

                {/* Quick Specs Preview */}
                <div className="text-xs text-gray-300 mb-4 space-y-1 border-t border-gray-600 pt-2">
                  {product.specs?.megapixels && <p>Megapixels: {product.specs.megapixels}</p>}
                  {product.specs?.sensorType && <p>Sensor: {product.specs.sensorType}</p>}
                  {product.specs?.videoResolution && (
                    <p>Video: {Array.isArray(product.specs.videoResolution) 
                      ? product.specs.videoResolution.join(', ') 
                      : product.specs.videoResolution}</p>
                  )}
                  {product.specs?.wifi && (
                    <p className="text-indigo-400">✓ WiFi</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEditCamera(product)}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCamera(product._id)}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No camera products found.</p>
            <button
              onClick={() => {
                resetCameraForm();
                setIsEditingCamera(true);
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Add Your First Camera Product
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Camera Modal */}
      {isEditingCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-white">
                {cameraFormData.id ? "Edit Camera Product" : "Add New Camera Product"}
              </h3>
              <button
                onClick={resetCameraForm}
                className="w-10 h-10 bg-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCameraSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Product Type *</label>
                  <select
                    name="type"
                    value={cameraFormData.type}
                    onChange={handleCameraInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="DSLR">DSLR</option>
                    <option value="Mirrorless">Mirrorless</option>
                    <option value="Action Camera">Action Camera</option>
                    <option value="Webcam">Webcam</option>
                    <option value="Point & Shoot">Point & Shoot</option>
                    <option value="Security Camera">Security Camera</option>
                    <option value="Lens">Lens</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={cameraFormData.name}
                    onChange={handleCameraInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    value={cameraFormData.brand}
                    onChange={handleCameraInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={cameraFormData.price}
                    onChange={handleCameraInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Original Price (₹)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={cameraFormData.originalPrice}
                    onChange={handleCameraInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={cameraFormData.category}
                    onChange={handleCameraInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Professional, Beginner, Vlogging"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Stock</label>
                  <select
                    name="stock"
                    value={cameraFormData.stock}
                    onChange={handleCameraInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="yes">In Stock</option>
                    <option value="no">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Code/SKU</label>
                  <input
                    type="text"
                    name="code"
                    value={cameraFormData.code}
                    onChange={handleCameraInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={cameraFormData.discount}
                    onChange={handleCameraInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={cameraFormData.description}
                    onChange={handleCameraInputChange}
                    rows="3"
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Camera Specifications */}
              <div className="border-t border-gray-600 pt-4">
                <h4 className="text-lg font-semibold text-white mb-4">Camera Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Sensor Type</label>
                    <input
                      type="text"
                      name="sensorType"
                      value={cameraFormData.sensorType}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., CMOS, CCD"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Sensor Size</label>
                    <input
                      type="text"
                      name="sensorSize"
                      value={cameraFormData.sensorSize}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Full Frame, APS-C"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Megapixels</label>
                    <input
                      type="text"
                      name="megapixels"
                      value={cameraFormData.megapixels}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 24.2MP"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Image Processor</label>
                    <input
                      type="text"
                      name="imageProcessor"
                      value={cameraFormData.imageProcessor}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., DIGIC 8"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">ISO Range</label>
                    <input
                      type="text"
                      name="isoRange"
                      value={cameraFormData.isoRange}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 100-25600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Shutter Speed</label>
                    <input
                      type="text"
                      name="shutterSpeed"
                      value={cameraFormData.shutterSpeed}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 30-1/4000 sec"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Continuous Shooting</label>
                    <input
                      type="text"
                      name="continuousShooting"
                      value={cameraFormData.continuousShooting}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 10 fps"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Video Resolution</label>
                    <input
                      type="text"
                      name="videoResolution"
                      value={cameraFormData.videoResolution.join(', ')}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 4K, 1080p"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Video Frame Rates</label>
                    <input
                      type="text"
                      name="videoFrameRates"
                      value={cameraFormData.videoFrameRates}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 24p, 30p, 60p"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Lens Mount</label>
                    <input
                      type="text"
                      name="lensMount"
                      value={cameraFormData.lensMount}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., EF, RF, E-mount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Focal Length</label>
                    <input
                      type="text"
                      name="focalLength"
                      value={cameraFormData.focalLength}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 18-55mm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Aperture</label>
                    <input
                      type="text"
                      name="aperture"
                      value={cameraFormData.aperture}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., f/3.5-5.6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Autofocus Points</label>
                    <input
                      type="text"
                      name="autofocusPoints"
                      value={cameraFormData.autofocusPoints}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 45 points"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Screen Size</label>
                    <input
                      type="text"
                      name="screenSize"
                      value={cameraFormData.screenSize}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 3.0\"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Screen Resolution</label>
                    <input
                      type="text"
                      name="screenResolution"
                      value={cameraFormData.screenResolution}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 1.04M dots"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Viewfinder Type</label>
                    <input
                      type="text"
                      name="viewfinderType"
                      value={cameraFormData.viewfinderType}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Optical, Electronic"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Viewfinder Resolution</label>
                    <input
                      type="text"
                      name="viewfinderResolution"
                      value={cameraFormData.viewfinderResolution}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 2.36M dots"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">USB Type</label>
                    <input
                      type="text"
                      name="usbType"
                      value={cameraFormData.usbType}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., USB-C, Micro USB"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Storage Media</label>
                    <input
                      type="text"
                      name="storageMedia"
                      value={cameraFormData.storageMedia.join(', ')}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., SD, SDHC, SDXC"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Card Slots</label>
                    <input
                      type="number"
                      name="cardSlots"
                      value={cameraFormData.cardSlots}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="1"
                      max="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Battery Type</label>
                    <input
                      type="text"
                      name="batteryType"
                      value={cameraFormData.batteryType}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., LP-E17"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Battery Life</label>
                    <input
                      type="text"
                      name="batteryLife"
                      value={cameraFormData.batteryLife}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 800 shots"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={cameraFormData.weight}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 450g"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Dimensions</label>
                    <input
                      type="text"
                      name="dimensions"
                      value={cameraFormData.dimensions}
                      onChange={handleCameraInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 130 x 90 x 70mm"
                    />
                  </div>

                  {cameraFormData.type === 'Webcam' ? (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Resolution</label>
                        <input
                          type="text"
                          name="resolution"
                          value={cameraFormData.resolution}
                          onChange={handleCameraInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 1080p"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Frame Rate</label>
                        <input
                          type="text"
                          name="frameRate"
                          value={cameraFormData.frameRate}
                          onChange={handleCameraInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 30fps"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Field of View</label>
                        <input
                          type="text"
                          name="fieldOfView"
                          value={cameraFormData.fieldOfView}
                          onChange={handleCameraInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 78°"
                        />
                      </div>
                    </>
                  ) : null}

                  {cameraFormData.type === 'Action Camera' ? (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Waterproof</label>
                        <input
                          type="text"
                          name="waterproof"
                          value={cameraFormData.waterproof}
                          onChange={handleCameraInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 10m"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Image Stabilization</label>
                        <input
                          type="text"
                          name="imageStabilization"
                          value={cameraFormData.imageStabilization}
                          onChange={handleCameraInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., Electronic, Optical"
                        />
                      </div>
                    </>
                  ) : null}
                </div>

                {/* Checkbox Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="faceDetection"
                      checked={cameraFormData.faceDetection}
                      onChange={handleCameraInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Face Detection</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="eyeTracking"
                      checked={cameraFormData.eyeTracking}
                      onChange={handleCameraInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Eye Tracking</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="touchscreen"
                      checked={cameraFormData.touchscreen}
                      onChange={handleCameraInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Touchscreen</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="articulatingScreen"
                      checked={cameraFormData.articulatingScreen}
                      onChange={handleCameraInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Articulating Screen</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="wifi"
                      checked={cameraFormData.wifi}
                      onChange={handleCameraInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">WiFi</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="bluetooth"
                      checked={cameraFormData.bluetooth}
                      onChange={handleCameraInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Bluetooth</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="nfc"
                      checked={cameraFormData.nfc}
                      onChange={handleCameraInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">NFC</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="hdmi"
                      checked={cameraFormData.hdmi}
                      onChange={handleCameraInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">HDMI</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="weatherSealed"
                      checked={cameraFormData.weatherSealed}
                      onChange={handleCameraInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Weather Sealed</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="autofocus"
                      checked={cameraFormData.autofocus}
                      onChange={handleCameraInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Autofocus</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="lowLightCorrection"
                      checked={cameraFormData.lowLightCorrection}
                      onChange={handleCameraInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Low Light Correction</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="builtInDisplay"
                      checked={cameraFormData.builtInDisplay}
                      onChange={handleCameraInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Built-in Display</label>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="border-t border-gray-600 pt-4">
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Product Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCameraImageChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  multiple
                />
                {cameraImagePreview.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cameraImagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <button
                          type="button"
                          onClick={() => handleCameraImageRemove(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border-2 border-gray-600"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                  {cameraFormData.id ? "Update Camera Product" : "Create Camera Product"}
                </button>
                <button
                  type="button"
                  onClick={resetCameraForm}
                  className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );

  // Render Mobile Management
  const renderMobileManagement = () => (
    <section className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Manage Mobiles & Tablets <span className="text-sm text-gray-400">({mobileProducts.length} total)</span>
        </h2>
        <button
          onClick={() => {
            resetMobileForm();
            setIsEditingMobile(true);
          }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add New Mobile/Tablet
        </button>
      </div>
        
      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={mobileSearchTerm}
          onChange={(e) => setMobileSearchTerm(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
  
        <select
          value={mobileTypeFilter}
          onChange={(e) => setMobileTypeFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Types</option>
          {mobileTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        
        <select
          value={mobileBrandFilter}
          onChange={(e) => setMobileBrandFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Brands</option>
          {mobileBrands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
        
        <select
          value={mobileOsFilter}
          onChange={(e) => setMobileOsFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All OS</option>
          <option value="iOS">iOS</option>
          <option value="Android">Android</option>
          <option value="HarmonyOS">HarmonyOS</option>
        </select>
      </div>
        
      {/* Products Grid */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        {filteredMobileProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMobileProducts.map((product) => (
              <div key={product._id} className="bg-gray-700 rounded-lg p-4 hover:shadow-xl transition">
                {/* Product Image */}
                <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-600 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={`${BASE_URL}/uploads/${product.image[0].split('/').pop()}`}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 text-xs font-bold bg-indigo-600 text-white rounded mb-2">
                    {product.type}
                  </span>
                  {product.specs?.operatingSystem?.toLowerCase().includes('ios') && (
                    <span className="ml-2 inline-block px-2 py-1 text-xs font-bold bg-gray-600 text-white rounded">
                      iOS
                    </span>
                  )}
                  {product.specs?.operatingSystem?.toLowerCase().includes('android') && (
                    <span className="ml-2 inline-block px-2 py-1 text-xs font-bold bg-green-600 text-white rounded">
                      Android
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                <p className="text-sm text-gray-300 mb-2">Brand: {product.brand || 'N/A'}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xl font-bold text-green-400">₹{product.price?.toLocaleString()}</p>
                  <p className={`text-sm ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
                
                {/* Quick Specs Preview */}
                <div className="text-xs text-gray-300 mb-4 space-y-1 border-t border-gray-600 pt-2">
                  {product.specs?.displaySize && <p>Display: {product.specs.displaySize}</p>}
                  {product.specs?.processor && <p>Processor: {product.specs.processor}</p>}
                  {product.specs?.ram && <p>RAM: {product.specs.ram}</p>}
                  {product.specs?.internalStorage && <p>Storage: {product.specs.internalStorage}</p>}
                  {product.specs?.batteryCapacity && <p>Battery: {product.specs.batteryCapacity}</p>}
                  {product.specs?.rearCamera && <p>Camera: {product.specs.rearCamera}</p>}
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEditMobile(product)}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMobile(product._id)}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No mobile products found.</p>
            <button
              onClick={() => {
                resetMobileForm();
                setIsEditingMobile(true);
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Add Your First Mobile/Tablet
            </button>
          </div>
        )}
      </div>
      
      {/* Add/Edit Mobile Modal */}
      {isEditingMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-800 z-10 pb-2">
              <h3 className="text-xl font-medium text-white">
                {mobileFormData.id ? "Edit Mobile/Tablet" : "Add New Mobile/Tablet"}
              </h3>
              <button
                onClick={resetMobileForm}
                className="w-10 h-10 bg-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-600"
              >
                <FaTimes />
              </button>
            </div>
      
            <form onSubmit={handleMobileSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Product Type *</label>
                    <select
                      name="type"
                      value={mobileFormData.type}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="Smartphone">Smartphone</option>
                      <option value="iPhone">iPhone</option>
                      <option value="Tablet">Tablet</option>
                      <option value="iPad">iPad</option>
                      <option value="Foldable Phone">Foldable Phone</option>
                      <option value="Feature Phone">Feature Phone</option>
                    </select>
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={mobileFormData.name}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Brand *</label>
                    <input
                      type="text"
                      name="brand"
                      value={mobileFormData.brand}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={mobileFormData.price}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      min="0"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Original Price (₹)</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={mobileFormData.originalPrice}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="0"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={mobileFormData.category}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Flagship, Mid-range, Budget"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Stock</label>
                    <select
                      name="stock"
                      value={mobileFormData.stock}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="yes">In Stock</option>
                      <option value="no">Out of Stock</option>
                    </select>
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Code/SKU</label>
                    <input
                      type="text"
                      name="code"
                      value={mobileFormData.code}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={mobileFormData.discount}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      max="100"
                    />
                  </div>
      
                  <div className="md:col-span-3">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={mobileFormData.description}
                      onChange={handleMobileInputChange}
                      rows="3"
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
      
              {/* Display Specifications */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Display</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Display Size</label>
                    <input
                      type="text"
                      name="displaySize"
                      value={mobileFormData.displaySize}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 6.7 inch"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Display Type</label>
                    <input
                      type="text"
                      name="displayType"
                      value={mobileFormData.displayType}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., AMOLED, LCD"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Resolution</label>
                    <input
                      type="text"
                      name="resolution"
                      value={mobileFormData.resolution}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 2778 x 1284"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Refresh Rate</label>
                    <input
                      type="text"
                      name="refreshRate"
                      value={mobileFormData.refreshRate}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 120Hz"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Brightness</label>
                    <input
                      type="text"
                      name="brightness"
                      value={mobileFormData.brightness}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 1000 nits"
                    />
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="hdr"
                      checked={mobileFormData.hdr}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">HDR Support</label>
                  </div>
                </div>
              </div>
      
              {/* Processor */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Processor</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Processor</label>
                    <input
                      type="text"
                      name="processor"
                      value={mobileFormData.processor}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., A16 Bionic"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Processor Brand</label>
                    <input
                      type="text"
                      name="processorBrand"
                      value={mobileFormData.processorBrand}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Apple, Qualcomm"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Cores</label>
                    <input
                      type="text"
                      name="processorCores"
                      value={mobileFormData.processorCores}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 8-core"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Processor Speed</label>
                    <input
                      type="text"
                      name="processorSpeed"
                      value={mobileFormData.processorSpeed}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 3.46 GHz"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">GPU</label>
                    <input
                      type="text"
                      name="gpu"
                      value={mobileFormData.gpu}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Apple GPU"
                    />
                  </div>
                </div>
              </div>
      
              {/* Memory & Storage */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Memory & Storage</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">RAM</label>
                    <input
                      type="text"
                      name="ram"
                      value={mobileFormData.ram}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 8GB"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">RAM Type</label>
                    <input
                      type="text"
                      name="ramType"
                      value={mobileFormData.ramType}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., LPDDR5"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Internal Storage</label>
                    <input
                      type="text"
                      name="internalStorage"
                      value={mobileFormData.internalStorage}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 256GB"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Storage Type</label>
                    <input
                      type="text"
                      name="storageType"
                      value={mobileFormData.storageType}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., NVMe, UFS 3.1"
                    />
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="expandableStorage"
                      checked={mobileFormData.expandableStorage}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Expandable Storage</label>
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Max Storage</label>
                    <input
                      type="text"
                      name="maxStorage"
                      value={mobileFormData.maxStorage}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 1TB"
                    />
                  </div>
                </div>
              </div>
      
              {/* Camera */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Camera</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Rear Camera</label>
                    <input
                      type="text"
                      name="rearCamera"
                      value={mobileFormData.rearCamera}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 48MP + 12MP + 12MP"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Rear Camera Features</label>
                    <input
                      type="text"
                      name="rearCameraFeatures"
                      value={mobileFormData.rearCameraFeatures}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., OIS, PDAF"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Front Camera</label>
                    <input
                      type="text"
                      name="frontCamera"
                      value={mobileFormData.frontCamera}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 12MP"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Front Camera Features</label>
                    <input
                      type="text"
                      name="frontCameraFeatures"
                      value={mobileFormData.frontCameraFeatures}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Portrait mode"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Video Recording</label>
                    <input
                      type="text"
                      name="videoRecording"
                      value={mobileFormData.videoRecording}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 4K @ 60fps"
                    />
                  </div>
      
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Camera Features</label>
                    <input
                      type="text"
                      name="cameraFeatures"
                      value={mobileFormData.cameraFeatures.join(', ')}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Night mode, Portrait, Pro mode"
                    />
                  </div>
                </div>
              </div>
      
              {/* Battery */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Battery</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Battery Capacity</label>
                    <input
                      type="text"
                      name="batteryCapacity"
                      value={mobileFormData.batteryCapacity}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 4500 mAh"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Battery Type</label>
                    <input
                      type="text"
                      name="batteryType"
                      value={mobileFormData.batteryType}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Li-Ion"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Fast Charging</label>
                    <input
                      type="text"
                      name="fastCharging"
                      value={mobileFormData.fastCharging}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 45W"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Charging Time</label>
                    <input
                      type="text"
                      name="chargingTime"
                      value={mobileFormData.chargingTime}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 0-100% in 60 min"
                    />
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="wirelessCharging"
                      checked={mobileFormData.wirelessCharging}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Wireless Charging</label>
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="reverseCharging"
                      checked={mobileFormData.reverseCharging}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Reverse Charging</label>
                  </div>
                </div>
              </div>
      
              {/* Connectivity */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Connectivity</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Network</label>
                    <input
                      type="text"
                      name="network"
                      value={mobileFormData.network.join(', ')}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 5G, 4G, 3G"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">SIM Type</label>
                    <input
                      type="text"
                      name="simType"
                      value={mobileFormData.simType}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Nano-SIM, eSIM"
                    />
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="dualSim"
                      checked={mobileFormData.dualSim}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Dual SIM</label>
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">WiFi</label>
                    <input
                      type="text"
                      name="wifi"
                      value={mobileFormData.wifi}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Wi-Fi 6E"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Bluetooth</label>
                    <input
                      type="text"
                      name="bluetooth"
                      value={mobileFormData.bluetooth}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 5.3"
                    />
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="nfc"
                      checked={mobileFormData.nfc}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">NFC</label>
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="gps"
                      checked={mobileFormData.gps}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">GPS</label>
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">USB Type</label>
                    <input
                      type="text"
                      name="usbType"
                      value={mobileFormData.usbType}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., USB-C, Lightning"
                    />
                  </div>
                </div>
              </div>
      
              {/* OS */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Operating System</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">OS</label>
                    <input
                      type="text"
                      name="operatingSystem"
                      value={mobileFormData.operatingSystem}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., iOS, Android"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">OS Version</label>
                    <input
                      type="text"
                      name="osVersion"
                      value={mobileFormData.osVersion}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., iOS 17, Android 14"
                    />
                  </div>
                </div>
              </div>
      
              {/* Sensors */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Sensors</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="fingerprintSensor"
                      checked={mobileFormData.fingerprintSensor}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Fingerprint Sensor</label>
                  </div>
      
                  <div>
                    <input
                      type="text"
                      name="fingerprintPosition"
                      value={mobileFormData.fingerprintPosition}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Position (e.g., Under display)"
                    />
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="faceUnlock"
                      checked={mobileFormData.faceUnlock}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Face Unlock</label>
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="accelerometer"
                      checked={mobileFormData.accelerometer}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Accelerometer</label>
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="gyroscope"
                      checked={mobileFormData.gyroscope}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Gyroscope</label>
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="proximity"
                      checked={mobileFormData.proximity}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Proximity</label>
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="compass"
                      checked={mobileFormData.compass}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Compass</label>
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="barometer"
                      checked={mobileFormData.barometer}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Barometer</label>
                  </div>
                </div>
              </div>
      
              {/* Physical */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Physical</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Dimensions</label>
                    <input
                      type="text"
                      name="dimensions"
                      value={mobileFormData.dimensions}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 160.7 x 77.6 x 7.9 mm"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={mobileFormData.weight}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 240g"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Build</label>
                    <input
                      type="text"
                      name="build"
                      value={mobileFormData.build}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Glass front, aluminum frame"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Colors</label>
                    <input
                      type="text"
                      name="colors"
                      value={mobileFormData.colors.join(', ')}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Black, White, Gold"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Water Resistance</label>
                    <input
                      type="text"
                      name="waterResistant"
                      value={mobileFormData.waterResistant}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., IP68"
                    />
                  </div>
                </div>
              </div>
      
              {/* Audio */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Audio</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Speakers</label>
                    <input
                      type="text"
                      name="speakers"
                      value={mobileFormData.speakers}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Stereo"
                    />
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="headphoneJack"
                      checked={mobileFormData.headphoneJack}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Headphone Jack</label>
                  </div>
      
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Audio Features</label>
                    <input
                      type="text"
                      name="audioFeatures"
                      value={mobileFormData.audioFeatures.join(', ')}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Dolby Atmos, Hi-Res Audio"
                    />
                  </div>
                </div>
              </div>
      
              {/* Additional Features */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Additional Features</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="stylus"
                      checked={mobileFormData.stylus}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Stylus Support</label>
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="desktopMode"
                      checked={mobileFormData.desktopMode}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Desktop Mode</label>
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="samsungDex"
                      checked={mobileFormData.samsungDex}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Samsung DeX</label>
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="applePencilSupport"
                      checked={mobileFormData.applePencilSupport}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Apple Pencil Support</label>
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="keyboardSupport"
                      checked={mobileFormData.keyboardSupport}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Keyboard Support</label>
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="magicKeyboardSupport"
                      checked={mobileFormData.magicKeyboardSupport}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Magic Keyboard Support</label>
                  </div>
      
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="smartConnector"
                      checked={mobileFormData.smartConnector}
                      onChange={handleMobileInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Smart Connector</label>
                  </div>
                </div>
      
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Apple Pencil Generation</label>
                    <input
                      type="text"
                      name="applePencilGen"
                      value={mobileFormData.applePencilGen}
                      onChange={handleMobileInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 2nd gen"
                    />
                  </div>
                </div>
              </div>
      
              {/* Images */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Product Images</h4>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Images (Select multiple)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMobileImageChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  multiple
                />
                {mobileImagePreview.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {mobileImagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <button
                          type="button"
                          onClick={() => handleMobileImageRemove(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border-2 border-gray-600"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-gray-800 py-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                  {mobileFormData.id ? "Update Mobile/Tablet" : "Create Mobile/Tablet"}
                </button>
                <button
                  type="button"
                  onClick={resetMobileForm}
                  className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );

  // Render PC Component Management
  const renderPCComponentManagement = () => (
    <section className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Manage PC Components <span className="text-sm text-gray-400">({pcComponentProducts.length} total)</span>
        </h2>
        <button
          onClick={() => {
            resetPCComponentForm();
            setIsEditingPCComponent(true);
          }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add New Component
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={pcComponentSearchTerm}
          onChange={(e) => setPcComponentSearchTerm(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={pcComponentTypeFilter}
          onChange={(e) => setPcComponentTypeFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Types</option>
          {pcComponentTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={pcComponentBrandFilter}
          onChange={(e) => setPcComponentBrandFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Brands</option>
          {pcComponentBrands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        <select
          value={pcComponentSocketFilter}
          onChange={(e) => setPcComponentSocketFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Sockets</option>
          {pcComponentSockets.map(socket => (
            <option key={socket} value={socket}>{socket}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        {filteredPCComponentProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPCComponentProducts.map((product) => {
              const componentInfo = getComponentInfo(product.type);

              return (
                <div key={product._id} className="bg-gray-700 rounded-lg p-4 hover:shadow-xl transition">
                  {/* Product Image */}
                  <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-600 flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={`${BASE_URL}/uploads/${product.image[0].split('/').pop()}`}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="mb-2">
                    <span className={`inline-block px-2 py-1 text-xs font-bold text-white rounded mb-2 ${componentInfo.color}`}>
                      {componentInfo.icon} {product.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-300 mb-2">Brand: {product.brand || 'N/A'}</p>

                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xl font-bold text-green-400">₹{product.price?.toLocaleString()}</p>
                    <p className={`text-sm ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>

                  {/* Quick Specs Preview - Dynamic based on type */}
                  <div className="text-xs text-gray-300 mb-4 space-y-1 border-t border-gray-600 pt-2">
                    {product.type === 'CPU' && (
                      <>
                        {product.specs?.socket && <p>Socket: {product.specs.socket}</p>}
                        {product.specs?.cores && <p>Cores: {product.specs.cores}</p>}
                        {product.specs?.threads && <p>Threads: {product.specs.threads}</p>}
                        {product.specs?.baseClock && <p>Base Clock: {product.specs.baseClock}</p>}
                        {product.specs?.boostClock && <p>Boost Clock: {product.specs.boostClock}</p>}
                      </>
                    )}
                    {product.type === 'GPU' && (
                      <>
                        {product.specs?.chipset && <p>Chipset: {product.specs.chipset}</p>}
                        {product.specs?.memory && <p>Memory: {product.specs.memory}</p>}
                        {product.specs?.coreClock && <p>Core Clock: {product.specs.coreClock}</p>}
                        {product.specs?.tdp && <p>TDP: {product.specs.tdp}W</p>}
                      </>
                    )}
                    {product.type === 'RAM' && (
                      <>
                        {product.specs?.ramType && <p>Type: {product.specs.ramType}</p>}
                        {product.specs?.capacity && <p>Capacity: {product.specs.capacity}</p>}
                        {product.specs?.speed && <p>Speed: {product.specs.speed}</p>}
                        {product.specs?.casLatency && <p>CAS: {product.specs.casLatency}</p>}
                      </>
                    )}
                    {(product.type === 'SSD' || product.type === 'HDD') && (
                      <>
                        {product.specs?.capacity && <p>Capacity: {product.specs.capacity}</p>}
                        {product.specs?.interface && <p>Interface: {product.specs.interface}</p>}
                        {product.specs?.readSpeed && <p>Read: {product.specs.readSpeed}</p>}
                        {product.specs?.writeSpeed && <p>Write: {product.specs.writeSpeed}</p>}
                      </>
                    )}
                    {product.type === 'Motherboard' && (
                      <>
                        {product.specs?.cpuSocket && <p>Socket: {product.specs.cpuSocket}</p>}
                        {product.specs?.chipset && <p>Chipset: {product.specs.chipset}</p>}
                        {product.specs?.formFactor && <p>Form Factor: {product.specs.formFactor}</p>}
                        {product.specs?.memorySlots && <p>RAM Slots: {product.specs.memorySlots}</p>}
                      </>
                    )}
                    {product.type === 'Power Supply' && (
                      <>
                        {product.specs?.wattage && <p>Wattage: {product.specs.wattage}W</p>}
                        {product.specs?.efficiency && <p>Efficiency: {product.specs.efficiency}</p>}
                        {product.specs?.modular && <p>Modular: {product.specs.modular}</p>}
                      </>
                    )}
                    {product.type === 'CPU Cooler' && (
                      <>
                        {product.specs?.coolerType && <p>Type: {product.specs.coolerType}</p>}
                        {product.specs?.fanSize && <p>Fan Size: {product.specs.fanSize}</p>}
                        {product.specs?.noiseLevel && <p>Noise: {product.specs.noiseLevel}</p>}
                      </>
                    )}
                    {product.type === 'Case' && (
                      <>
                        {product.specs?.caseType && <p>Type: {product.specs.caseType}</p>}
                        {product.specs?.motherboardSupport && <p>Mobo Support: {product.specs.motherboardSupport}</p>}
                        {product.specs?.maxGpuLength && <p>Max GPU: {product.specs.maxGpuLength}</p>}
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditPCComponent(product)}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePCComponent(product._id)}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No PC components found.</p>
            <button
              onClick={() => {
                resetPCComponentForm();
                setIsEditingPCComponent(true);
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Add Your First Component
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit PC Component Modal */}
      {isEditingPCComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-800 z-10 pb-2">
              <h3 className="text-xl font-medium text-white">
                {pcComponentFormData.id ? "Edit PC Component" : "Add New PC Component"}
              </h3>
              <button
                onClick={resetPCComponentForm}
                className="w-10 h-10 bg-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handlePCComponentSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Component Type *</label>
                    <select
                      name="type"
                      value={pcComponentFormData.type}
                      onChange={handlePCComponentInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="CPU">CPU</option>
                      <option value="GPU">GPU</option>
                      <option value="RAM">RAM</option>
                      <option value="SSD">SSD</option>
                      <option value="HDD">HDD</option>
                      <option value="Motherboard">Motherboard</option>
                      <option value="Power Supply">Power Supply</option>
                      <option value="CPU Cooler">CPU Cooler</option>
                      <option value="Case">Case</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={pcComponentFormData.name}
                      onChange={handlePCComponentInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Brand *</label>
                    <input
                      type="text"
                      name="brand"
                      value={pcComponentFormData.brand}
                      onChange={handlePCComponentInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={pcComponentFormData.price}
                      onChange={handlePCComponentInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Original Price (₹)</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={pcComponentFormData.originalPrice}
                      onChange={handlePCComponentInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={pcComponentFormData.category}
                      onChange={handlePCComponentInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Gaming, Professional"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Stock</label>
                    <select
                      name="stock"
                      value={pcComponentFormData.stock}
                      onChange={handlePCComponentInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="yes">In Stock</option>
                      <option value="no">Out of Stock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Code/SKU</label>
                    <input
                      type="text"
                      name="code"
                      value={pcComponentFormData.code}
                      onChange={handlePCComponentInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={pcComponentFormData.discount}
                      onChange={handlePCComponentInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={pcComponentFormData.description}
                      onChange={handlePCComponentInputChange}
                      rows="3"
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Component Specific Specifications - Dynamic based on type */}
              {pcComponentFormData.type === 'CPU' && (
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">CPU Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Socket</label>
                      <input
                        type="text"
                        name="socket"
                        value={pcComponentFormData.socket}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., LGA1700, AM5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Cores</label>
                      <input
                        type="number"
                        name="cores"
                        value={pcComponentFormData.cores}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 8"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Threads</label>
                      <input
                        type="number"
                        name="threads"
                        value={pcComponentFormData.threads}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 16"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Base Clock</label>
                      <input
                        type="text"
                        name="baseClock"
                        value={pcComponentFormData.baseClock}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 3.5 GHz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Boost Clock</label>
                      <input
                        type="text"
                        name="boostClock"
                        value={pcComponentFormData.boostClock}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 5.1 GHz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Cache</label>
                      <input
                        type="text"
                        name="cache"
                        value={pcComponentFormData.cache}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 36MB"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">TDP (W)</label>
                      <input
                        type="number"
                        name="tdp"
                        value={pcComponentFormData.tdp}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 125"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Max Memory</label>
                      <input
                        type="text"
                        name="maxMemorySupport"
                        value={pcComponentFormData.maxMemorySupport}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 128GB"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Memory Type</label>
                      <input
                        type="text"
                        name="memoryType"
                        value={pcComponentFormData.memoryType}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., DDR5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">PCIe Version</label>
                      <input
                        type="text"
                        name="pcieVersion"
                        value={pcComponentFormData.pcieVersion}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 5.0"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="integratedGraphics"
                        checked={pcComponentFormData.integratedGraphics}
                        onChange={handlePCComponentInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">Integrated Graphics</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="unlocked"
                        checked={pcComponentFormData.unlocked}
                        onChange={handlePCComponentInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">Unlocked (Overclockable)</label>
                    </div>
                  </div>
                </div>
              )}

              {pcComponentFormData.type === 'GPU' && (
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">GPU Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Chipset</label>
                      <input
                        type="text"
                        name="chipset"
                        value={pcComponentFormData.chipset}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., RTX 4090"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Memory</label>
                      <input
                        type="text"
                        name="memory"
                        value={pcComponentFormData.memory}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 24GB"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Memory Type</label>
                      <input
                        type="text"
                        name="memoryType"
                        value={pcComponentFormData.memoryType}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., GDDR6X"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Memory Interface</label>
                      <input
                        type="text"
                        name="memoryInterface"
                        value={pcComponentFormData.memoryInterface}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 384-bit"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Core Clock</label>
                      <input
                        type="text"
                        name="coreClock"
                        value={pcComponentFormData.coreClock}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 2.5 GHz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Boost Clock</label>
                      <input
                        type="text"
                        name="boostClock"
                        value={pcComponentFormData.boostClock}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 2.7 GHz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">CUDA Cores</label>
                      <input
                        type="number"
                        name="cudaCores"
                        value={pcComponentFormData.cudaCores}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 16384"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Ray Tracing Cores</label>
                      <input
                        type="number"
                        name="rayTracingCores"
                        value={pcComponentFormData.rayTracingCores}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Tensor Cores</label>
                      <input
                        type="number"
                        name="tensorCores"
                        value={pcComponentFormData.tensorCores}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">TDP (W)</label>
                      <input
                        type="number"
                        name="tdp"
                        value={pcComponentFormData.tdp}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 450"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Recommended PSU</label>
                      <input
                        type="text"
                        name="recommendedPsu"
                        value={pcComponentFormData.recommendedPsu}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 850W"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">HDMI Ports</label>
                      <input
                        type="number"
                        name="hdmiPorts"
                        value={pcComponentFormData.hdmiPorts}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">DisplayPorts</label>
                      <input
                        type="number"
                        name="displayPorts"
                        value={pcComponentFormData.displayPorts}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Length</label>
                      <input
                        type="text"
                        name="length"
                        value={pcComponentFormData.length}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 350mm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Width</label>
                      <input
                        type="text"
                        name="width"
                        value={pcComponentFormData.width}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Slots</label>
                      <input
                        type="number"
                        name="slots"
                        value={pcComponentFormData.slots}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Cooling</label>
                      <input
                        type="text"
                        name="cooling"
                        value={pcComponentFormData.cooling}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Triple Fan"
                      />
                    </div>
                  </div>
                </div>
              )}

              {pcComponentFormData.type === 'RAM' && (
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">RAM Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">RAM Type</label>
                      <input
                        type="text"
                        name="ramType"
                        value={pcComponentFormData.ramType}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., DDR5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Capacity</label>
                      <input
                        type="text"
                        name="capacity"
                        value={pcComponentFormData.capacity}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 32GB"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Speed</label>
                      <input
                        type="text"
                        name="speed"
                        value={pcComponentFormData.speed}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 6000MHz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">CAS Latency</label>
                      <input
                        type="text"
                        name="casLatency"
                        value={pcComponentFormData.casLatency}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., CL30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Timing</label>
                      <input
                        type="text"
                        name="timing"
                        value={pcComponentFormData.timing}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 30-38-38-96"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Voltage</label>
                      <input
                        type="text"
                        name="voltage"
                        value={pcComponentFormData.voltage}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 1.35V"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Modules</label>
                      <input
                        type="number"
                        name="modules"
                        value={pcComponentFormData.modules}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 2"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="heatSpreader"
                        checked={pcComponentFormData.heatSpreader}
                        onChange={handlePCComponentInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">Heat Spreader</label>
                    </div>
                  </div>
                </div>
              )}

              {(pcComponentFormData.type === 'SSD' || pcComponentFormData.type === 'HDD') && (
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Storage Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Form Factor</label>
                      <input
                        type="text"
                        name="formFactor"
                        value={pcComponentFormData.formFactor}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., M.2 2280"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Interface</label>
                      <input
                        type="text"
                        name="interface"
                        value={pcComponentFormData.interface}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., NVMe PCIe 4.0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Capacity</label>
                      <input
                        type="text"
                        name="capacity"
                        value={pcComponentFormData.capacity}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 1TB"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">NAND Type</label>
                      <input
                        type="text"
                        name="nandType"
                        value={pcComponentFormData.nandType}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., TLC"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Read Speed</label>
                      <input
                        type="text"
                        name="readSpeed"
                        value={pcComponentFormData.readSpeed}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 7000 MB/s"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Write Speed</label>
                      <input
                        type="text"
                        name="writeSpeed"
                        value={pcComponentFormData.writeSpeed}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 5000 MB/s"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Endurance (TBW)</label>
                      <input
                        type="text"
                        name="endurance"
                        value={pcComponentFormData.endurance}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 600"
                      />
                    </div>
                    {pcComponentFormData.type === 'HDD' && (
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">RPM</label>
                        <input
                          type="number"
                          name="hddRpm"
                          value={pcComponentFormData.hddRpm}
                          onChange={handlePCComponentInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 7200"
                        />
                      </div>
                    )}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="dramCache"
                        checked={pcComponentFormData.dramCache}
                        onChange={handlePCComponentInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">DRAM Cache</label>
                    </div>
                  </div>
                </div>
              )}

              {pcComponentFormData.type === 'Motherboard' && (
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Motherboard Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">CPU Socket</label>
                      <input
                        type="text"
                        name="cpuSocket"
                        value={pcComponentFormData.cpuSocket}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., LGA1700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Chipset</label>
                      <input
                        type="text"
                        name="chipset"
                        value={pcComponentFormData.chipset}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Z790"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Form Factor</label>
                      <input
                        type="text"
                        name="formFactor"
                        value={pcComponentFormData.formFactor}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., ATX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Memory Slots</label>
                      <input
                        type="number"
                        name="memorySlots"
                        value={pcComponentFormData.memorySlots}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Max Memory</label>
                      <input
                        type="text"
                        name="maxMemory"
                        value={pcComponentFormData.maxMemory}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 128GB"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">PCIe Slots</label>
                      <input
                        type="text"
                        name="pcieSlots"
                        value={pcComponentFormData.pcieSlots}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 1 x PCIe 5.0 x16"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">M.2 Slots</label>
                      <input
                        type="number"
                        name="m2Slots"
                        value={pcComponentFormData.m2Slots}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">SATA Ports</label>
                      <input
                        type="number"
                        name="sataPorts"
                        value={pcComponentFormData.sataPorts}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">USB Ports</label>
                      <input
                        type="text"
                        name="usbPorts"
                        value={pcComponentFormData.usbPorts}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 2x USB 3.2, 4x USB 2.0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Audio Chip</label>
                      <input
                        type="text"
                        name="audioChip"
                        value={pcComponentFormData.audioChip}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Realtek ALC1220"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Ethernet</label>
                      <input
                        type="text"
                        name="ethernet"
                        value={pcComponentFormData.ethernet}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 2.5GbE"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="wifi"
                        checked={pcComponentFormData.wifi}
                        onChange={handlePCComponentInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">WiFi</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="bluetooth"
                        checked={pcComponentFormData.bluetooth}
                        onChange={handlePCComponentInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">Bluetooth</label>
                    </div>
                  </div>
                </div>
              )}

              {pcComponentFormData.type === 'Power Supply' && (
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Power Supply Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Wattage</label>
                      <input
                        type="number"
                        name="wattage"
                        value={pcComponentFormData.wattage}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 850"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Efficiency</label>
                      <input
                        type="text"
                        name="efficiency"
                        value={pcComponentFormData.efficiency}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 80+ Gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Modular</label>
                      <select
                        name="modular"
                        value={pcComponentFormData.modular}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select</option>
                        <option value="Full">Full Modular</option>
                        <option value="Semi">Semi Modular</option>
                        <option value="Non">Non Modular</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Fan Size</label>
                      <input
                        type="text"
                        name="fanSize"
                        value={pcComponentFormData.fanSize}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 120mm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">PCIe Connectors</label>
                      <input
                        type="text"
                        name="pcieConnectors"
                        value={pcComponentFormData.pcieConnectors}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 4 x 6+2 pin"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">SATA Connectors</label>
                      <input
                        type="number"
                        name="sataConnectors"
                        value={pcComponentFormData.sataConnectors}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Molex Connectors</label>
                      <input
                        type="number"
                        name="molexConnectors"
                        value={pcComponentFormData.molexConnectors}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {pcComponentFormData.type === 'CPU Cooler' && (
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Cooler Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Cooler Type</label>
                      <select
                        name="coolerType"
                        value={pcComponentFormData.coolerType}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select</option>
                        <option value="Air">Air Cooler</option>
                        <option value="Liquid AIO">Liquid AIO</option>
                        <option value="Custom Loop">Custom Loop</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Fan Size</label>
                      <input
                        type="text"
                        name="fanSize"
                        value={pcComponentFormData.fanSize}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 120mm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Fan Speed</label>
                      <input
                        type="text"
                        name="fanSpeed"
                        value={pcComponentFormData.fanSpeed}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 500-1800 RPM"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Noise Level</label>
                      <input
                        type="text"
                        name="noiseLevel"
                        value={pcComponentFormData.noiseLevel}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 22 dBA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Airflow</label>
                      <input
                        type="text"
                        name="airflow"
                        value={pcComponentFormData.airflow}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 75 CFM"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Radiator Size</label>
                      <input
                        type="text"
                        name="radiatorSize"
                        value={pcComponentFormData.radiatorSize}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 360mm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Socket Compatibility</label>
                      <input
                        type="text"
                        name="socketCompatibility"
                        value={pcComponentFormData.socketCompatibility}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., LGA1700, AM5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Height</label>
                      <input
                        type="text"
                        name="height"
                        value={pcComponentFormData.height}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 158mm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {pcComponentFormData.type === 'Case' && (
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Case Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Case Type</label>
                      <select
                        name="caseType"
                        value={pcComponentFormData.caseType}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select</option>
                        <option value="Full Tower">Full Tower</option>
                        <option value="Mid Tower">Mid Tower</option>
                        <option value="Mini Tower">Mini Tower</option>
                        <option value="SFF">Small Form Factor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Motherboard Support</label>
                      <input
                        type="text"
                        name="motherboardSupport"
                        value={pcComponentFormData.motherboardSupport}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., ATX, Micro-ATX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">PSU Support</label>
                      <input
                        type="text"
                        name="psuSupport"
                        value={pcComponentFormData.psuSupport}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., ATX, SFX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Max GPU Length</label>
                      <input
                        type="text"
                        name="maxGpuLength"
                        value={pcComponentFormData.maxGpuLength}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 350mm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Max CPU Height</label>
                      <input
                        type="text"
                        name="maxCpuHeight"
                        value={pcComponentFormData.maxCpuHeight}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 170mm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Included Fans</label>
                      <input
                        type="text"
                        name="includedFans"
                        value={pcComponentFormData.includedFans}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 3 x 120mm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Fan Support</label>
                      <input
                        type="text"
                        name="fanSupport"
                        value={pcComponentFormData.fanSupport}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 6 x 120mm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Radiator Support</label>
                      <input
                        type="text"
                        name="radiatorSupport"
                        value={pcComponentFormData.radiatorSupport}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 360mm front"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Drive Bays</label>
                      <input
                        type="text"
                        name="driveBays"
                        value={pcComponentFormData.driveBays}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 2 x 3.5\, 4 x 2.5\"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">I/O Ports</label>
                      <input
                        type="text"
                        name="ioPorts"
                        value={pcComponentFormData.ioPorts}
                        onChange={handlePCComponentInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., USB 3.2, USB-C"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="temperedGlass"
                        checked={pcComponentFormData.temperedGlass}
                        onChange={handlePCComponentInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">Tempered Glass</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="psuShroud"
                        checked={pcComponentFormData.psuShroud}
                        onChange={handlePCComponentInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">PSU Shroud</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="cableManagement"
                        checked={pcComponentFormData.cableManagement}
                        onChange={handlePCComponentInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">Cable Management</label>
                    </div>
                  </div>
                </div>
              )}

              {/* General Specifications */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">General Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Series</label>
                    <input
                      type="text"
                      name="series"
                      value={pcComponentFormData.series}
                      onChange={handlePCComponentInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Core i9, Ryzen 9"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Model</label>
                    <input
                      type="text"
                      name="model"
                      value={pcComponentFormData.model}
                      onChange={handlePCComponentInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 13900K, 7950X"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Release Date</label>
                    <input
                      type="text"
                      name="releaseDate"
                      value={pcComponentFormData.releaseDate}
                      onChange={handlePCComponentInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 2023"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Color</label>
                    <input
                      type="text"
                      name="color"
                      value={pcComponentFormData.color}
                      onChange={handlePCComponentInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Black, White"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Warranty</label>
                    <input
                      type="text"
                      name="warranty"
                      value={pcComponentFormData.warranty}
                      onChange={handlePCComponentInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 3 Years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Dimensions</label>
                    <input
                      type="text"
                      name="dimensions"
                      value={pcComponentFormData.dimensions}
                      onChange={handlePCComponentInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 305 x 244 mm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={pcComponentFormData.weight}
                      onChange={handlePCComponentInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 1.5 kg"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="rgb"
                      checked={pcComponentFormData.rgb}
                      onChange={handlePCComponentInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">RGB Lighting</label>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Product Images</h4>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Images (Select multiple)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePCComponentImageChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  multiple
                />
                {pcComponentImagePreview.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pcComponentImagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <button
                          type="button"
                          onClick={() => handlePCComponentImageRemove(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border-2 border-gray-600"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-gray-800 py-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                  {pcComponentFormData.id ? "Update PC Component" : "Create PC Component"}
                </button>
                <button
                  type="button"
                  onClick={resetPCComponentForm}
                  className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );

  // Render TV Management
  const renderTVManagement = () => (
    <section className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Manage TV & Entertainment <span className="text-sm text-gray-400">({tvProducts.length} total)</span>
        </h2>
        <button
          onClick={() => {
            resetTVForm();
            setIsEditingTV(true);
          }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add New TV Product
        </button>
      </div>
        
      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={tvSearchTerm}
          onChange={(e) => setTvSearchTerm(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 col-span-1 md:col-span-2"
        />
  
        <select
          value={tvTypeFilter}
          onChange={(e) => setTvTypeFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Types</option>
          {tvTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        
        <select
          value={tvBrandFilter}
          onChange={(e) => setTvBrandFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Brands</option>
          {tvBrands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
        
        <select
          value={tvResolutionFilter}
          onChange={(e) => setTvResolutionFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Resolutions</option>
          {tvResolutions.map(res => (
            <option key={res} value={res}>{res}</option>
          ))}
        </select>
        
        <select
          value={tvScreenSizeFilter}
          onChange={(e) => setTvScreenSizeFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Sizes</option>
          {tvScreenSizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
        
      {/* Products Grid */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        {filteredTVProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTVProducts.map((product) => {
              const typeInfo = getTVTypeInfo(product.type);
              
              return (
                <div key={product._id} className="bg-gray-700 rounded-lg p-4 hover:shadow-xl transition">
                  {/* Product Image */}
                  <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-600 flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={`${BASE_URL}/uploads/${product.image[0].split('/').pop()}`}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="mb-2">
                    <span className={`inline-block px-2 py-1 text-xs font-bold text-white rounded mb-2 ${typeInfo.color}`}>
                      {typeInfo.icon} {product.type}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-300 mb-2">Brand: {product.brand || 'N/A'}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xl font-bold text-green-400">₹{product.price?.toLocaleString()}</p>
                    <p className={`text-sm ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                  
                  {/* Quick Specs Preview */}
                  <div className="text-xs text-gray-300 mb-4 space-y-1 border-t border-gray-600 pt-2">
                    {product.specs?.screenSize && (
                      <p>Screen Size: {product.specs.screenSize}</p>
                    )}
                    {product.specs?.resolution && (
                      <p>Resolution: {product.specs.resolution}</p>
                    )}
                    {product.specs?.displayTechnology && (
                      <p>Technology: {product.specs.displayTechnology}</p>
                    )}
                    {product.specs?.refreshRate && (
                      <p>Refresh Rate: {product.specs.refreshRate}</p>
                    )}
                    {product.specs?.smartPlatform && (
                      <p>Smart Platform: {product.specs.smartPlatform}</p>
                    )}
                    {product.specs?.hdmiPorts && (
                      <p>HDMI: {product.specs.hdmiPorts} ports</p>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditTV(product)}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTV(product._id)}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No TV products found.</p>
            <button
              onClick={() => {
                resetTVForm();
                setIsEditingTV(true);
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Add Your First TV Product
            </button>
          </div>
        )}
      </div>
      
      {/* Add/Edit TV Modal */}
      {isEditingTV && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-800 z-10 pb-2">
              <h3 className="text-xl font-medium text-white">
                {tvFormData.id ? "Edit TV Product" : "Add New TV Product"}
              </h3>
              <button
                onClick={resetTVForm}
                className="w-10 h-10 bg-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-600"
              >
                <FaTimes />
              </button>
            </div>
      
            <form onSubmit={handleTVSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Product Type *</label>
                    <select
                      name="type"
                      value={tvFormData.type}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="Television">Television</option>
                      <option value="OLED TV">OLED TV</option>
                      <option value="QLED TV">QLED TV</option>
                      <option value="LED TV">LED TV</option>
                      <option value="Projector">Projector</option>
                      <option value="Soundbar">Soundbar</option>
                      <option value="Home Theater">Home Theater</option>
                      <option value="Streaming Device">Streaming Device</option>
                    </select>
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={tvFormData.name}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Brand *</label>
                    <input
                      type="text"
                      name="brand"
                      value={tvFormData.brand}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={tvFormData.price}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      min="0"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Original Price (₹)</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={tvFormData.originalPrice}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="0"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={tvFormData.category}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Home Theater, Gaming"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Stock</label>
                    <select
                      name="stock"
                      value={tvFormData.stock}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="yes">In Stock</option>
                      <option value="no">Out of Stock</option>
                    </select>
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Code/SKU</label>
                    <input
                      type="text"
                      name="code"
                      value={tvFormData.code}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
      
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={tvFormData.discount}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      max="100"
                    />
                  </div>
      
                  <div className="md:col-span-3">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={tvFormData.description}
                      onChange={handleTVInputChange}
                      rows="3"
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
      
              {/* Display Specifications */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Display Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Screen Size</label>
                    <input
                      type="text"
                      name="screenSize"
                      value={tvFormData.screenSize}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 55 inch"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Resolution</label>
                    <input
                      type="text"
                      name="resolution"
                      value={tvFormData.resolution}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 4K Ultra HD"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Display Technology</label>
                    <select
                      name="displayTechnology"
                      value={tvFormData.displayTechnology}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select</option>
                      <option value="OLED">OLED</option>
                      <option value="QLED">QLED</option>
                      <option value="LED">LED</option>
                      <option value="LCD">LCD</option>
                      <option value="Plasma">Plasma</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Refresh Rate</label>
                    <input
                      type="text"
                      name="refreshRate"
                      value={tvFormData.refreshRate}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 120Hz"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Brightness</label>
                    <input
                      type="text"
                      name="brightness"
                      value={tvFormData.brightness}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 1000 nits"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Contrast Ratio</label>
                    <input
                      type="text"
                      name="contrastRatio"
                      value={tvFormData.contrastRatio}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 5000:1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">HDR Support</label>
                    <input
                      type="text"
                      name="hdrSupport"
                      value={tvFormData.hdrSupport}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., HDR10, Dolby Vision"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Viewing Angle</label>
                    <input
                      type="text"
                      name="viewingAngle"
                      value={tvFormData.viewingAngle}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 178 degrees"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Response Time</label>
                    <input
                      type="text"
                      name="responseTime"
                      value={tvFormData.responseTime}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 1ms"
                    />
                  </div>
                </div>
              </div>
      
              {/* Audio Specifications */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Audio Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Audio Output</label>
                    <input
                      type="text"
                      name="audioOutput"
                      value={tvFormData.audioOutput}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 40W"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Speaker Configuration</label>
                    <input
                      type="text"
                      name="speakerConfiguration"
                      value={tvFormData.speakerConfiguration}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 2.1 Channel"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Audio Technologies</label>
                    <input
                      type="text"
                      name="audioTechnologies"
                      value={tvFormData.audioTechnologies.join(', ')}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Dolby Atmos, DTS:X"
                    />
                  </div>
                </div>
              </div>
      
              {/* Smart Features */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Smart Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Smart Platform</label>
                    <input
                      type="text"
                      name="smartPlatform"
                      value={tvFormData.smartPlatform}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., webOS, Tizen"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Voice Assistant</label>
                    <input
                      type="text"
                      name="voiceAssistant"
                      value={tvFormData.voiceAssistant}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Alexa, Google Assistant"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Streaming Apps</label>
                    <input
                      type="text"
                      name="streamingApps"
                      value={tvFormData.streamingApps.join(', ')}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Netflix, Prime Video, YouTube"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="screenMirroring"
                      checked={tvFormData.screenMirroring}
                      onChange={handleTVInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Screen Mirroring</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="airplaySupport"
                      checked={tvFormData.airplaySupport}
                      onChange={handleTVInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">AirPlay Support</label>
                  </div>
                </div>
              </div>
      
              {/* Connectivity */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Connectivity</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">HDMI Ports</label>
                    <input
                      type="number"
                      name="hdmiPorts"
                      value={tvFormData.hdmiPorts}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">HDMI Version</label>
                    <input
                      type="text"
                      name="hdmiVersion"
                      value={tvFormData.hdmiVersion}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 2.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">USB Ports</label>
                    <input
                      type="number"
                      name="usbPorts"
                      value={tvFormData.usbPorts}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">USB Version</label>
                    <input
                      type="text"
                      name="usbVersion"
                      value={tvFormData.usbVersion}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 3.0"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="ethernetPort"
                      checked={tvFormData.ethernetPort}
                      onChange={handleTVInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Ethernet Port</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="wifi"
                      checked={tvFormData.wifi}
                      onChange={handleTVInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">WiFi</label>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">WiFi Standard</label>
                    <input
                      type="text"
                      name="wifiStandard"
                      value={tvFormData.wifiStandard}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., WiFi 6"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="bluetooth"
                      checked={tvFormData.bluetooth}
                      onChange={handleTVInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Bluetooth</label>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Bluetooth Version</label>
                    <input
                      type="text"
                      name="bluetoothVersion"
                      value={tvFormData.bluetoothVersion}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 5.0"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="opticalAudioOut"
                      checked={tvFormData.opticalAudioOut}
                      onChange={handleTVInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Optical Audio Out</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="headphoneJack"
                      checked={tvFormData.headphoneJack}
                      onChange={handleTVInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Headphone Jack</label>
                  </div>
                </div>
              </div>
      
              {/* Gaming Features */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Gaming Features</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="vrrSupport"
                      checked={tvFormData.vrrSupport}
                      onChange={handleTVInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">VRR Support</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="allmSupport"
                      checked={tvFormData.allmSupport}
                      onChange={handleTVInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">ALLM Support</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="gameMode"
                      checked={tvFormData.gameMode}
                      onChange={handleTVInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Game Mode</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="gsyncSupport"
                      checked={tvFormData.gsyncSupport}
                      onChange={handleTVInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">G-SYNC Support</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="freesyncSupport"
                      checked={tvFormData.freesyncSupport}
                      onChange={handleTVInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">FreeSync Support</label>
                  </div>
                </div>
              </div>
      
              {/* Physical Specifications */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Physical Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Dimensions (with stand)</label>
                    <input
                      type="text"
                      name="dimensionsWithStand"
                      value={tvFormData.dimensionsWithStand}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 1230 x 780 x 250 mm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Dimensions (without stand)</label>
                    <input
                      type="text"
                      name="dimensionsWithoutStand"
                      value={tvFormData.dimensionsWithoutStand}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 1230 x 710 x 50 mm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Weight (with stand)</label>
                    <input
                      type="text"
                      name="weightWithStand"
                      value={tvFormData.weightWithStand}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 18.5 kg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Weight (without stand)</label>
                    <input
                      type="text"
                      name="weightWithoutStand"
                      value={tvFormData.weightWithoutStand}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 16.2 kg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">VESA Mount</label>
                    <input
                      type="text"
                      name="vesaMount"
                      value={tvFormData.vesaMount}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 400x400 mm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Color</label>
                    <input
                      type="text"
                      name="color"
                      value={tvFormData.color}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Black, Silver"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Bezel Type</label>
                    <input
                      type="text"
                      name="bezelType"
                      value={tvFormData.bezelType}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Thin, Frameless"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Stand Type</label>
                    <input
                      type="text"
                      name="standType"
                      value={tvFormData.standType}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Center Stand, Feet"
                    />
                  </div>
                </div>
              </div>
      
              {/* Power Specifications */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Power Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Power Consumption</label>
                    <input
                      type="text"
                      name="powerConsumption"
                      value={tvFormData.powerConsumption}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 150W"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Standby Power</label>
                    <input
                      type="text"
                      name="standbyPower"
                      value={tvFormData.standbyPower}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 0.5W"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Voltage Range</label>
                    <input
                      type="text"
                      name="voltageRange"
                      value={tvFormData.voltageRange}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 100-240V"
                    />
                  </div>
                </div>
              </div>
      
              {/* Projector Specific (if type is Projector) */}
              {tvFormData.type === 'Projector' && (
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Projector Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Projector Type</label>
                      <input
                        type="text"
                        name="projectorType"
                        value={tvFormData.projectorType}
                        onChange={handleTVInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., DLP, LCD"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Brightness (Lumens)</label>
                      <input
                        type="text"
                        name="brightnessLumens"
                        value={tvFormData.brightnessLumens}
                        onChange={handleTVInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 3000 ANSI"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Throw Ratio</label>
                      <input
                        type="text"
                        name="throwRatio"
                        value={tvFormData.throwRatio}
                        onChange={handleTVInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 1.2:1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Lamp Life</label>
                      <input
                        type="text"
                        name="lampLife"
                        value={tvFormData.lampLife}
                        onChange={handleTVInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 20000 hours"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Projection Size</label>
                      <input
                        type="text"
                        name="projectionSize"
                        value={tvFormData.projectionSize}
                        onChange={handleTVInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 80-200 inches"
                      />
                    </div>
                  </div>
                </div>
              )}
  
              {/* Soundbar Specific (if type is Soundbar) */}
              {tvFormData.type === 'Soundbar' && (
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Soundbar Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Soundbar Channels</label>
                      <input
                        type="text"
                        name="soundbarChannels"
                        value={tvFormData.soundbarChannels}
                        onChange={handleTVInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 3.1.2"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="subwooferIncluded"
                        checked={tvFormData.subwooferIncluded}
                        onChange={handleTVInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">Subwoofer Included</label>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Subwoofer Type</label>
                      <input
                        type="text"
                        name="subwooferType"
                        value={tvFormData.subwooferType}
                        onChange={handleTVInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Wireless"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="wallMountable"
                        checked={tvFormData.wallMountable}
                        onChange={handleTVInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">Wall Mountable</label>
                    </div>
                  </div>
                </div>
              )}
  
              {/* Streaming Device Specific (if type is Streaming Device) */}
              {tvFormData.type === 'Streaming Device' && (
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Streaming Device Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Device Type</label>
                      <input
                        type="text"
                        name="streamingDeviceType"
                        value={tvFormData.streamingDeviceType}
                        onChange={handleTVInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Streaming Stick"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Remote Type</label>
                      <input
                        type="text"
                        name="remoteType"
                        value={tvFormData.remoteType}
                        onChange={handleTVInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Voice Remote"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Storage</label>
                      <input
                        type="text"
                        name="storage"
                        value={tvFormData.storage}
                        onChange={handleTVInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 8GB"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">RAM</label>
                      <input
                        type="text"
                        name="ram"
                        value={tvFormData.ram}
                        onChange={handleTVInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 2GB"
                      />
                    </div>
                  </div>
                </div>
              )}
  
              {/* General */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">General</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Warranty</label>
                    <input
                      type="text"
                      name="warranty"
                      value={tvFormData.warranty}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 2 Years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Energy Rating</label>
                    <input
                      type="text"
                      name="energyRating"
                      value={tvFormData.energyRating}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 5 Star"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Year Released</label>
                    <input
                      type="number"
                      name="yearReleased"
                      value={tvFormData.yearReleased}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 2023"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Included Accessories</label>
                    <input
                      type="text"
                      name="includedAccessories"
                      value={tvFormData.includedAccessories.join(', ')}
                      onChange={handleTVInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Remote, Power Cable"
                    />
                  </div>
                </div>
              </div>
            
              {/* Images */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Product Images</h4>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Images (Select multiple)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTVImageChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  multiple
                />
                {tvImagePreview.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tvImagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <button
                          type="button"
                          onClick={() => handleTVImageRemove(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border-2 border-gray-600"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-gray-800 py-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                  {tvFormData.id ? "Update TV Product" : "Create TV Product"}
                </button>
                <button
                  type="button"
                  onClick={resetTVForm}
                  className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );

  // Render Wearable Management
  const renderWearableManagement = () => (
    <section className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Manage Wearables <span className="text-sm text-gray-400">({wearableProducts.length} total)</span>
        </h2>
        <button
          onClick={() => {
            resetWearableForm();
            setIsEditingWearable(true);
          }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add New Wearable
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={wearableSearchTerm}
          onChange={(e) => setWearableSearchTerm(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 col-span-1 md:col-span-2"
        />

        <select
          value={wearableTypeFilter}
          onChange={(e) => setWearableTypeFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Types</option>
          {wearableTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={wearableBrandFilter}
          onChange={(e) => setWearableBrandFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Brands</option>
          {wearableBrands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        <select
          value={wearableOsFilter}
          onChange={(e) => setWearableOsFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All OS</option>
          {wearableOsTypes.map(os => (
            <option key={os} value={os}>{os}</option>
          ))}
        </select>

        <select
          value={wearableFeatureFilter}
          onChange={(e) => setWearableFeatureFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Features</option>
          {wearableFeatures.map(feature => (
            <option key={feature} value={feature}>{feature}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        {filteredWearableProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWearableProducts.map((product) => {
              const typeInfo = getWearableTypeInfo(product.type);

              return (
                <div key={product._id} className="bg-gray-700 rounded-lg p-4 hover:shadow-xl transition">
                  {/* Product Image */}
                  <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-600 flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={`${BASE_URL}/uploads/${product.image[0].split('/').pop()}`}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="mb-2">
                    <span className={`inline-block px-2 py-1 text-xs font-bold text-white rounded mb-2 ${typeInfo.color}`}>
                      {typeInfo.icon} {product.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-300 mb-2">Brand: {product.brand || 'N/A'}</p>

                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xl font-bold text-green-400">₹{product.price?.toLocaleString()}</p>
                    <p className={`text-sm ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>

                  {/* Quick Specs Preview */}
                  <div className="text-xs text-gray-300 mb-4 space-y-1 border-t border-gray-600 pt-2">
                    {product.specs?.displaySize && (
                      <p>Display: {product.specs.displaySize}</p>
                    )}
                    {product.specs?.batteryLife && (
                      <p>Battery: {product.specs.batteryLife}</p>
                    )}
                    {product.specs?.operatingSystem && (
                      <p>OS: {product.specs.operatingSystem}</p>
                    )}
                    {product.specs?.waterResistant && (
                      <p>Water Resistant: {product.specs.waterResistant}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.specs?.heartRateMonitor && (
                        <span className="px-1 bg-red-900/30 text-red-300 rounded text-xs">HR</span>
                      )}
                      {product.specs?.gps && (
                        <span className="px-1 bg-blue-900/30 text-blue-300 rounded text-xs">GPS</span>
                      )}
                      {product.specs?.bloodOxygenSensor && (
                        <span className="px-1 bg-purple-900/30 text-purple-300 rounded text-xs">SpO2</span>
                      )}
                      {product.specs?.ecgSensor && (
                        <span className="px-1 bg-green-900/30 text-green-300 rounded text-xs">ECG</span>
                      )}
                      {product.specs?.nfcPayments && (
                        <span className="px-1 bg-yellow-900/30 text-yellow-300 rounded text-xs">NFC</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditWearable(product)}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteWearable(product._id)}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No wearable products found.</p>
            <button
              onClick={() => {
                resetWearableForm();
                setIsEditingWearable(true);
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Add Your First Wearable
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Wearable Modal */}
      {isEditingWearable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-800 z-10 pb-2">
              <h3 className="text-xl font-medium text-white">
                {wearableFormData.id ? "Edit Wearable" : "Add New Wearable"}
              </h3>
              <button
                onClick={resetWearableForm}
                className="w-10 h-10 bg-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleWearableSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Product Type *</label>
                    <select
                      name="type"
                      value={wearableFormData.type}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="Smartwatch">Smartwatch</option>
                      <option value="Fitness Tracker">Fitness Tracker</option>
                      <option value="Activity Band">Activity Band</option>
                      <option value="Hybrid Watch">Hybrid Watch</option>
                      <option value="GPS Watch">GPS Watch</option>
                      <option value="Sports Watch">Sports Watch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={wearableFormData.name}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Brand *</label>
                    <input
                      type="text"
                      name="brand"
                      value={wearableFormData.brand}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={wearableFormData.price}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Original Price (₹)</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={wearableFormData.originalPrice}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={wearableFormData.category}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Fitness, Lifestyle, Sports"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Stock</label>
                    <select
                      name="stock"
                      value={wearableFormData.stock}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="yes">In Stock</option>
                      <option value="no">Out of Stock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Code/SKU</label>
                    <input
                      type="text"
                      name="code"
                      value={wearableFormData.code}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={wearableFormData.discount}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={wearableFormData.description}
                      onChange={handleWearableInputChange}
                      rows="3"
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Display Specifications */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Display</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Display Type</label>
                    <input
                      type="text"
                      name="displayType"
                      value={wearableFormData.displayType}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., AMOLED, LCD"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Display Size</label>
                    <input
                      type="text"
                      name="displaySize"
                      value={wearableFormData.displaySize}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 1.4 inch"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Screen Resolution</label>
                    <input
                      type="text"
                      name="screenResolution"
                      value={wearableFormData.screenResolution}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 454 x 454"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="alwaysOnDisplay"
                      checked={wearableFormData.alwaysOnDisplay}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Always-On Display</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="touchscreen"
                      checked={wearableFormData.touchscreen}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Touchscreen</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="colorDisplay"
                      checked={wearableFormData.colorDisplay}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Color Display</label>
                  </div>
                </div>
              </div>

              {/* Physical Specifications */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Physical</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Case Material</label>
                    <input
                      type="text"
                      name="caseMaterial"
                      value={wearableFormData.caseMaterial}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Stainless Steel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Strap Material</label>
                    <input
                      type="text"
                      name="strapMaterial"
                      value={wearableFormData.strapMaterial}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Silicone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Strap Size</label>
                    <input
                      type="text"
                      name="strapSize"
                      value={wearableFormData.strapSize}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 20mm"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="interchangeableStraps"
                      checked={wearableFormData.interchangeableStraps}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Interchangeable Straps</label>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Dimensions</label>
                    <input
                      type="text"
                      name="dimensions"
                      value={wearableFormData.dimensions}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 45 x 45 x 12 mm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={wearableFormData.weight}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 50g"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Colors</label>
                    <input
                      type="text"
                      name="colors"
                      value={wearableFormData.colors.join(', ')}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Black, Silver, Gold"
                    />
                  </div>
                </div>
              </div>

              {/* Health Sensors */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Health Sensors</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="heartRateMonitor"
                      checked={wearableFormData.heartRateMonitor}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Heart Rate Monitor</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="bloodOxygenSensor"
                      checked={wearableFormData.bloodOxygenSensor}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Blood Oxygen (SpO2)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="ecgSensor"
                      checked={wearableFormData.ecgSensor}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">ECG Sensor</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="temperatureSensor"
                      checked={wearableFormData.temperatureSensor}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Temperature Sensor</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="skinTemperatureSensor"
                      checked={wearableFormData.skinTemperatureSensor}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Skin Temperature</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="respirationRate"
                      checked={wearableFormData.respirationRate}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Respiration Rate</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="stressTracking"
                      checked={wearableFormData.stressTracking}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Stress Tracking</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="sleepTracking"
                      checked={wearableFormData.sleepTracking}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Sleep Tracking</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="stepCounter"
                      checked={wearableFormData.stepCounter}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Step Counter</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="calorieTracking"
                      checked={wearableFormData.calorieTracking}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Calorie Tracking</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="distanceTracking"
                      checked={wearableFormData.distanceTracking}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Distance Tracking</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="floorsClimbed"
                      checked={wearableFormData.floorsClimbed}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Floors Climbed</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="fallDetection"
                      checked={wearableFormData.fallDetection}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Fall Detection</label>
                  </div>
                </div>
              </div>

              {/* Fitness Features */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Fitness Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Workout Modes</label>
                    <input
                      type="number"
                      name="workoutModes"
                      value={wearableFormData.workoutModes}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 20"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Workout Tracking</label>
                    <input
                      type="text"
                      name="workoutTracking"
                      value={wearableFormData.workoutTracking.join(', ')}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Running, Cycling, Swimming"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="autoWorkoutDetection"
                      checked={wearableFormData.autoWorkoutDetection}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Auto Workout Detection</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="gps"
                      checked={wearableFormData.gps}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">GPS</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="glonass"
                      checked={wearableFormData.glonass}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">GLONASS</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="galileo"
                      checked={wearableFormData.galileo}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Galileo</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="compass"
                      checked={wearableFormData.compass}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Compass</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="altimeter"
                      checked={wearableFormData.altimeter}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Altimeter</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="barometer"
                      checked={wearableFormData.barometer}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Barometer</label>
                  </div>
                </div>
              </div>

              {/* Connectivity */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Connectivity</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="bluetooth"
                      checked={wearableFormData.bluetooth}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Bluetooth</label>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Bluetooth Version</label>
                    <input
                      type="text"
                      name="bluetoothVersion"
                      value={wearableFormData.bluetoothVersion}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 5.0"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="wifi"
                      checked={wearableFormData.wifi}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">WiFi</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="nfc"
                      checked={wearableFormData.nfc}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">NFC</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="mobileConnectivity"
                      checked={wearableFormData.mobileConnectivity}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Mobile Connectivity</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="simSupport"
                      checked={wearableFormData.simSupport}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">SIM Support</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="esimSupport"
                      checked={wearableFormData.esimSupport}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">eSIM Support</label>
                  </div>
                </div>
              </div>

              {/* Smart Features */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Smart Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Operating System</label>
                    <input
                      type="text"
                      name="operatingSystem"
                      value={wearableFormData.operatingSystem}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., watchOS, Wear OS"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Compatible OS</label>
                    <input
                      type="text"
                      name="compatibleOS"
                      value={wearableFormData.compatibleOS.join(', ')}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., iOS, Android"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="voiceAssistant"
                      checked={wearableFormData.voiceAssistant}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Voice Assistant</label>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Voice Assistant Type</label>
                    <input
                      type="text"
                      name="voiceAssistantType"
                      value={wearableFormData.voiceAssistantType}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Siri, Google Assistant"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={wearableFormData.notifications}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Notifications</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="musicControl"
                      checked={wearableFormData.musicControl}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Music Control</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="musicStorage"
                      checked={wearableFormData.musicStorage}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Music Storage</label>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Onboard Music</label>
                    <input
                      type="text"
                      name="onboardMusic"
                      value={wearableFormData.onboardMusic}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 4GB"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="callsViaWatch"
                      checked={wearableFormData.callsViaWatch}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Calls via Watch</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="speaker"
                      checked={wearableFormData.speaker}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Speaker</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="microphone"
                      checked={wearableFormData.microphone}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Microphone</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="cameraControl"
                      checked={wearableFormData.cameraControl}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Camera Control</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="findMyPhone"
                      checked={wearableFormData.findMyPhone}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Find My Phone</label>
                  </div>
                </div>
              </div>

              {/* Payments */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Payments</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="nfcPayments"
                      checked={wearableFormData.nfcPayments}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">NFC Payments</label>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Payment Services</label>
                    <input
                      type="text"
                      name="paymentServices"
                      value={wearableFormData.paymentServices.join(', ')}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Google Pay, Apple Pay"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="maps"
                      checked={wearableFormData.maps}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Maps</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="turnByTurnNavigation"
                      checked={wearableFormData.turnByTurnNavigation}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Turn-by-Turn Navigation</label>
                  </div>
                </div>
              </div>

              {/* Water Resistance */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Water Resistance</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Water Resistance Rating</label>
                    <input
                      type="text"
                      name="waterResistant"
                      value={wearableFormData.waterResistant}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 5 ATM, IP68"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="swimProof"
                      checked={wearableFormData.swimProof}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Swim Proof</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="swimTracking"
                      checked={wearableFormData.swimTracking}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Swim Tracking</label>
                  </div>
                </div>
              </div>

              {/* Battery */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Battery</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Battery Type</label>
                    <input
                      type="text"
                      name="batteryType"
                      value={wearableFormData.batteryType}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Li-Ion"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Battery Capacity</label>
                    <input
                      type="text"
                      name="batteryCapacity"
                      value={wearableFormData.batteryCapacity}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 300mAh"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Battery Life</label>
                    <input
                      type="text"
                      name="batteryLife"
                      value={wearableFormData.batteryLife}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 7 days"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Battery Life Mode</label>
                    <input
                      type="text"
                      name="batteryLifeMode"
                      value={wearableFormData.batteryLifeMode}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Smartwatch mode"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Charging Time</label>
                    <input
                      type="text"
                      name="chargingTime"
                      value={wearableFormData.chargingTime}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 2 hours"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="wirelessCharging"
                      checked={wearableFormData.wirelessCharging}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Wireless Charging</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="fastCharging"
                      checked={wearableFormData.fastCharging}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Fast Charging</label>
                  </div>
                </div>
              </div>

              {/* Additional Sensors */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Additional Sensors</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="accelerometer"
                      checked={wearableFormData.accelerometer}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Accelerometer</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="gyroscope"
                      checked={wearableFormData.gyroscope}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Gyroscope</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="ambientLightSensor"
                      checked={wearableFormData.ambientLightSensor}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Ambient Light Sensor</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="proximitySensor"
                      checked={wearableFormData.proximitySensor}
                      onChange={handleWearableInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Proximity Sensor</label>
                  </div>
                </div>
              </div>

              {/* General */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">General</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Warranty</label>
                    <input
                      type="text"
                      name="warranty"
                      value={wearableFormData.warranty}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 1 Year"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Release Year</label>
                    <input
                      type="number"
                      name="releaseYear"
                      value={wearableFormData.releaseYear}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 2023"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Manufacturer</label>
                    <input
                      type="text"
                      name="manufacturer"
                      value={wearableFormData.manufacturer}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Country of Origin</label>
                    <input
                      type="text"
                      name="countryOfOrigin"
                      value={wearableFormData.countryOfOrigin}
                      onChange={handleWearableInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Product Images</h4>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Images (Select multiple)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleWearableImageChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  multiple
                />
                {wearableImagePreview.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {wearableImagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <button
                          type="button"
                          onClick={() => handleWearableImageRemove(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border-2 border-gray-600"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-gray-800 py-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                  {wearableFormData.id ? "Update Wearable" : "Create Wearable"}
                </button>
                <button
                  type="button"
                  onClick={resetWearableForm}
                  className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );

  // Render Display Management
  const renderDisplayManagement = () => (
    <section className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Manage Displays <span className="text-sm text-gray-400">({displayProducts.length} total)</span>
        </h2>
        <button
          onClick={() => {
            resetDisplayForm();
            setIsEditingDisplay(true);
          }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add New Display
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by name, brand, or model..."
          value={displaySearchTerm}
          onChange={(e) => setDisplaySearchTerm(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 col-span-1 md:col-span-2"
        />

        <select
          value={displayCategoryFilter}
          onChange={(e) => setDisplayCategoryFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Categories</option>
          {displayCategories.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>

        <select
          value={displayBrandFilter}
          onChange={(e) => setDisplayBrandFilter(e.target.value)}
          className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Brands</option>
          {displayBrands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        {filteredDisplayProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDisplayProducts.map((product) => {
              const categoryColor = getDisplayCategoryColor(product.category);

              return (
                <div key={product._id || product.id} className="bg-gray-700 rounded-lg p-4 hover:shadow-xl transition">
                  {/* Product Image */}
                  <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-600 flex items-center justify-center">
                    {product.image ? (
                        <img
                          src={
                            // Handle array of images
                            Array.isArray(product.image) && product.image.length > 0
                              ? (product.image[0].startsWith('http') 
                                  ? product.image[0] 
                                  : `${BASE_URL}/uploads/${product.image[0].split('/').pop()}`)
                              // Handle single image string
                              : (typeof product.image === 'string'
                                  ? (product.image.startsWith('http') 
                                      ? product.image 
                                      : `${BASE_URL}/uploads/${product.image.split('/').pop()}`)
                                  : '/placeholder-image.jpg')
                          }
                          alt={product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      ) : product.images && product.images.length > 0 ? (
                        <img
                          src={Array.isArray(product.images) && product.images.length > 0
                            ? (product.images[0].startsWith('http') 
                                ? product.images[0] 
                                : `${BASE_URL}/uploads/${product.images[0].split('/').pop()}`)
                            : '/placeholder-image.jpg'
                          }
                          alt={product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    
                      {/* Featured Badge */}
                      {product.featured && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-xs font-bold px-2 py-1 rounded">
                          Featured
                        </div>
                      )}
                    </div>

                  {/* Product Info */}
                  <div className="mb-2 flex justify-between items-center">
                    <span className={`inline-block px-2 py-1 text-xs font-bold text-white rounded ${categoryColor}`}>
                      {product.category ? (product.category.charAt(0).toUpperCase() + product.category.slice(1)) : 'Display'}
                    </span>
                    {product.discount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{product.discount}%
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-300 mb-2">Brand: {product.brand || 'N/A'} {product.model && `- ${product.model}`}</p>

                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-xl font-bold text-green-400">₹{(product.price || 0).toLocaleString()}</p>
                      {product.originalPrice > product.price && (
                        <p className="text-xs text-gray-400 line-through">₹{(product.originalPrice || 0).toLocaleString()}</p>
                      )}
                    </div>
                    <p className={`text-sm ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>

                  {/* Quick Specs Preview */}
                  <div className="text-xs text-gray-300 mb-4 space-y-1 border-t border-gray-600 pt-2">
                    {product.screenSize && <p>Size: {product.screenSize}</p>}
                    {product.resolution && <p>Resolution: {product.resolution}</p>}
                    {product.panelType && <p>Panel: {product.panelType}</p>}
                    {product.refreshRate && <p>Refresh: {product.refreshRate}</p>}
                    {product.curved && <p className="text-indigo-400">✓ Curved</p>}
                    {product.touchscreen && <p className="text-indigo-400">✓ Touchscreen</p>}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditDisplay(product)}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(product._id || product.id, product.featured)}
                      className="flex-1 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                    >
                      {product.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      onClick={() => handleDeleteDisplay(product._id || product.id)}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No display products found.</p>
            <button
              onClick={() => {
                resetDisplayForm();
                setIsEditingDisplay(true);
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Add Your First Display
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Display Modal */}
      {isEditingDisplay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-800 z-10 pb-2">
              <h3 className="text-xl font-medium text-white">
                {displayFormData.id ? "Edit Display" : "Add New Display"}
              </h3>
              <button
                onClick={resetDisplayForm}
                className="w-10 h-10 bg-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleDisplaySubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Display Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={displayFormData.name}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Brand *</label>
                    <input
                      type="text"
                      name="brand"
                      value={displayFormData.brand}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Model</label>
                    <input
                      type="text"
                      name="model"
                      value={displayFormData.model}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., U2720Q"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={displayFormData.price}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Original Price (₹)</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={displayFormData.originalPrice}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Category *</label>
                    <select
                      name="category"
                      value={displayFormData.category}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="gaming">Gaming</option>
                      <option value="professional">Professional</option>
                      <option value="ultrawide">Ultrawide</option>
                      <option value="office">Office</option>
                      <option value="portable">Portable</option>
                      <option value="touchscreen">Touchscreen</option>
                      <option value="4k">4K</option>
                      <option value="curved">Curved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Code/SKU</label>
                    <input
                      type="text"
                      name="code"
                      value={displayFormData.code}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={displayFormData.discount}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Stock</label>
                    <select
                      name="inStock"
                      value={displayFormData.inStock}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="yes">In Stock</option>
                      <option value="no">Out of Stock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={displayFormData.quantity}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Popularity</label>
                    <input
                      type="number"
                      name="popularity"
                      value={displayFormData.popularity}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Date Added</label>
                    <input
                      type="date"
                      name="dateAdded"
                      value={displayFormData.dateAdded}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={displayFormData.featured}
                      onChange={handleDisplayInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Featured Product</label>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={displayFormData.description}
                      onChange={handleDisplayInputChange}
                      rows="3"
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Display Specifications */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Display Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Screen Size</label>
                    <input
                      type="text"
                      name="screenSize"
                      value={displayFormData.screenSize}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 27 inch"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Resolution</label>
                    <input
                      type="text"
                      name="resolution"
                      value={displayFormData.resolution}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 3840x2160"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Panel Type</label>
                    <select
                      name="panelType"
                      value={displayFormData.panelType}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select</option>
                      <option value="IPS">IPS</option>
                      <option value="VA">VA</option>
                      <option value="TN">TN</option>
                      <option value="OLED">OLED</option>
                      <option value="QLED">QLED</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Refresh Rate</label>
                    <input
                      type="text"
                      name="refreshRate"
                      value={displayFormData.refreshRate}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 144Hz"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Response Time</label>
                    <input
                      type="text"
                      name="responseTime"
                      value={displayFormData.responseTime}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 1ms"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Brightness</label>
                    <input
                      type="text"
                      name="brightness"
                      value={displayFormData.brightness}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 350 nits"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Contrast Ratio</label>
                    <input
                      type="text"
                      name="contrastRatio"
                      value={displayFormData.contrastRatio}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 1000:1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Aspect Ratio</label>
                    <input
                      type="text"
                      name="aspectRatio"
                      value={displayFormData.aspectRatio}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 16:9"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Color Gamut</label>
                    <input
                      type="text"
                      name="colorGamut"
                      value={displayFormData.colorGamut}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., sRGB 99%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Viewing Angle</label>
                    <input
                      type="text"
                      name="viewingAngle"
                      value={displayFormData.viewingAngle}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 178/178"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">HDR Support</label>
                    <input
                      type="text"
                      name="hdrSupport"
                      value={displayFormData.hdrSupport}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., HDR10, HDR400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Adaptive Sync</label>
                    <input
                      type="text"
                      name="adaptiveSync"
                      value={displayFormData.adaptiveSync}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., G-Sync, FreeSync"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="curved"
                      checked={displayFormData.curved}
                      onChange={handleDisplayInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Curved Display</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="touchscreen"
                      checked={displayFormData.touchscreen}
                      onChange={handleDisplayInputChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-300">Touchscreen</label>
                  </div>
                </div>
              </div>

              {/* Physical Specifications */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Physical Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">VESA Mount</label>
                    <input
                      type="text"
                      name="vesaMount"
                      value={displayFormData.vesaMount}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 100x100mm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Dimensions</label>
                    <input
                      type="text"
                      name="dimensions"
                      value={displayFormData.dimensions}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 614 x 405 x 200 mm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={displayFormData.weight}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 6.5 kg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Color</label>
                    <input
                      type="text"
                      name="color"
                      value={displayFormData.color}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Warranty</label>
                    <input
                      type="text"
                      name="warranty"
                      value={displayFormData.warranty}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 3 Years"
                    />
                  </div>
                </div>
              </div>

              {/* Features & Ports */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Features & Ports</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Features</label>
                    <input
                      type="text"
                      name="features"
                      value={displayFormData.features.join(', ')}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., HDR, G-Sync, FreeSync, PiP"
                    />
                    <p className="text-xs text-gray-400 mt-1">Comma-separated list</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Ports</label>
                    <input
                      type="text"
                      name="ports"
                      value={displayFormData.ports.join(', ')}
                      onChange={handleDisplayInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., HDMI, DisplayPort, USB-C"
                    />
                    <p className="text-xs text-gray-400 mt-1">Comma-separated list</p>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="border-b border-gray-700 pb-4">
                <h4 className="text-lg font-semibold text-white mb-4">Product Images</h4>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Images (Select multiple)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDisplayImageChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  multiple
                />
                {displayImagePreview.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {displayImagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <button
                          type="button"
                          onClick={() => handleDisplayImageRemove(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border-2 border-gray-600"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-gray-800 py-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                  {displayFormData.id ? "Update Display" : "Create Display"}
                </button>
                <button
                  type="button"
                  onClick={resetDisplayForm}
                  className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );

  // Render Accessory Management
  const renderAccessoryManagement = () => {
    // Filter accessory products
    const filteredAccessoryProducts = accessoryProducts.filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(accessorySearchTerm.toLowerCase()) ||
                           product.brand?.toLowerCase().includes(accessorySearchTerm.toLowerCase()) ||
                           product.model?.toLowerCase().includes(accessorySearchTerm.toLowerCase());

      const matchesCategory = accessoryCategoryFilter === 'all' || 
                             product.category === accessoryCategoryFilter;

      const matchesBrand = accessoryBrandFilter === 'all' || product.brand === accessoryBrandFilter;

      return matchesSearch && matchesCategory && matchesBrand;
    });

    // Get unique brands for filter
    const accessoryBrands = [...new Set(accessoryProducts.map(p => p.brand).filter(Boolean))];

    return (
      <section className="relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Manage Accessories <span className="text-sm text-gray-400">({accessoryProducts.length} total)</span>
          </h2>
          <button
            onClick={() => {
              resetAccessoryForm();
              setIsEditingAccessory(true);
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <span className="text-xl">+</span> Add New Accessory
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name, brand, or model..."
            value={accessorySearchTerm}
            onChange={(e) => setAccessorySearchTerm(e.target.value)}
            className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 col-span-1 md:col-span-2"
          />

          <select
            value={accessoryCategoryFilter}
            onChange={(e) => setAccessoryCategoryFilter(e.target.value)}
            className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {accessoryCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={accessoryBrandFilter}
            onChange={(e) => setAccessoryBrandFilter(e.target.value)}
            className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Brands</option>
            {accessoryBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          {filteredAccessoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccessoryProducts.map((product) => {
                const categoryColor = getAccessoryCategoryColor(product.category);

                return (
                  <div key={product._id || product.id} className="bg-gray-700 rounded-lg p-4 hover:shadow-xl transition">
                    {/* Product Image */}
                    <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-600 flex items-center justify-center relative">
                      {product.image || product.images ? (
                        <img
                          src={
                            Array.isArray(product.image) && product.image.length > 0
                              ? (product.image[0].startsWith('http') 
                                  ? product.image[0] 
                                  : `${BASE_URL}/uploads/${product.image[0].split('/').pop()}`)
                              : (typeof product.image === 'string'
                                  ? (product.image.startsWith('http') 
                                      ? product.image 
                                      : `${BASE_URL}/uploads/${product.image.split('/').pop()}`)
                                  : (product.images && product.images.length > 0
                                      ? (product.images[0].startsWith('http') 
                                          ? product.images[0] 
                                          : `${BASE_URL}/uploads/${product.images[0].split('/').pop()}`)
                                      : '/placeholder-image.jpg'))
                          }
                          alt={product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}

                      {/* Featured Badge */}
                      {product.isFeatured && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-xs font-bold px-2 py-1 rounded">
                          Featured
                        </div>
                      )}

                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{product.discount}%
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="mb-2">
                      <span className={`inline-block px-2 py-1 text-xs font-bold text-white rounded ${categoryColor}`}>
                        {product.category || 'Accessory'}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-300 mb-2">
                      Brand: {product.brand || 'N/A'} 
                      {product.model && ` - ${product.model}`}
                    </p>

                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-xl font-bold text-green-400">₹{(product.price || 0).toLocaleString()}</p>
                        {product.originalPrice > product.price && (
                          <p className="text-xs text-gray-400 line-through">₹{(product.originalPrice || 0).toLocaleString()}</p>
                        )}
                      </div>
                      <p className={`text-sm ${product.inStock || product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {product.inStock || product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </p>
                    </div>

                    {/* Quick Specs Preview */}
                    <div className="text-xs text-gray-300 mb-4 space-y-1 border-t border-gray-600 pt-2">
                      {product.specs?.connectivity && (
                        <p>Connectivity: {Array.isArray(product.specs.connectivity) 
                          ? product.specs.connectivity.join(', ') 
                          : product.specs.connectivity}</p>
                      )}
                      {product.specs?.compatibility && <p>Compatibility: {product.specs.compatibility}</p>}
                      {product.specs?.color && <p>Color: {product.specs.color}</p>}
                      {product.specs?.material && <p>Material: {product.specs.material}</p>}
                      {product.specs?.warranty && <p>Warranty: {product.specs.warranty}</p>}

                      {/* Show features as tags */}
                      {(product.features || product.specs?.features) && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(product.features || product.specs?.features)?.slice(0, 3).map((feature, idx) => (
                            <span key={idx} className="px-1 bg-indigo-900/30 text-indigo-300 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEditAccessory(product)}
                        className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleAccessoryFeatured(product._id || product.id, product.isFeatured)}
                        className="flex-1 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                      >
                        {product.isFeatured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button
                        onClick={() => handleDeleteAccessory(product._id || product.id)}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">No accessory products found.</p>
              <button
                onClick={() => {
                  resetAccessoryForm();
                  setIsEditingAccessory(true);
                }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Add Your First Accessory
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Accessory Modal */}
        {isEditingAccessory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-800 z-10 pb-2">
                <h3 className="text-xl font-medium text-white">
                  {accessoryFormData.id ? "Edit Accessory" : "Add New Accessory"}
                </h3>
                <button
                  onClick={resetAccessoryForm}
                  className="w-10 h-10 bg-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAccessorySubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={accessoryFormData.name}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Brand *</label>
                      <input
                        type="text"
                        name="brand"
                        value={accessoryFormData.brand}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Model</label>
                      <input
                        type="text"
                        name="model"
                        value={accessoryFormData.model}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Pro, Lite"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        value={accessoryFormData.price}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Original Price (₹)</label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={accessoryFormData.originalPrice}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Category *</label>
                      <select
                        name="category"
                        value={accessoryFormData.category}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="">Select Category</option>
                          {accessoryCategories.map(cat => (
                            <option key={cat} value={cat}>{getCategoryDisplayName(cat)}</option>
                          ))}
                      </select>
                    </div>

                    {/* Subcategory Selection - show only if category is selected */}
                    {accessoryFormData.category && (
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Subcategory *</label>
                        <select
                          name="subcategory"
                          value={accessoryFormData.subcategory}
                          onChange={handleAccessoryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          <option value="">Select Subcategory</option>
                          {accessorySubcategories[accessoryFormData.category]?.map(subcat => (
                            <option key={subcat} value={subcat}>{getSubcategoryDisplayName(subcat)}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Code/SKU</label>
                      <input
                        type="text"
                        name="code"
                        value={accessoryFormData.code}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Discount (%)</label>
                      <input
                        type="number"
                        name="discount"
                        value={accessoryFormData.discount}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Stock Quantity *</label>
                      <input
                        type="number"
                        name="stock"
                        value={accessoryFormData.stock}
                        onChange={handleAccessoryInputChange}
                        min="0"
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        value={accessoryFormData.quantity}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        min="0"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={accessoryFormData.isFeatured}
                        onChange={handleAccessoryInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">Featured Product</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={accessoryFormData.isActive}
                        onChange={handleAccessoryInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">Active</label>
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={accessoryFormData.description}
                        onChange={handleAccessoryInputChange}
                        rows="3"
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Accessory Specifications */}
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Accessory Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Compatibility</label>
                      <input
                        type="text"
                        name="compatibility"
                        value={accessoryFormData.specs?.compatibility}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., iPhone 15, Samsung S24"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Connectivity</label>
                      <input
                        type="text"
                        name="connectivity"
                        value={accessoryFormData.specs?.connectivity}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Bluetooth, USB-C, Lightning"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Features</label>
                      <input
                        type="text"
                        name="features"
                        value={accessoryFormData.features?.join(', ')}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Fast Charging, LED Indicator"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Material</label>
                      <input
                        type="text"
                        name="material"
                        value={accessoryFormData.specs?.material}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Aluminum, Silicone"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Color</label>
                      <input
                        type="text"
                        name="color"
                        value={accessoryFormData.specs?.color}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Black, White"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Dimensions</label>
                      <input
                        type="text"
                        name="dimensions"
                        value={accessoryFormData.specs?.dimensions}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 10 x 5 x 2 cm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Weight</label>
                      <input
                        type="text"
                        name="weight"
                        value={accessoryFormData.specs?.weight}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 50g"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Warranty</label>
                      <input
                        type="text"
                        name="warranty"
                        value={accessoryFormData.warranty}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 1 Year"
                      />
                    </div>

                    {/* Cable specific */}
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Cable Length</label>
                      <input
                        type="text"
                        name="cableLength"
                        value={accessoryFormData.cableLength}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 1m, 2m"
                      />
                    </div>

                    {/* Battery/Charger specific */}
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Battery Type</label>
                      <input
                        type="text"
                        name="batteryType"
                        value={accessoryFormData.batteryType}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Li-Ion"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Battery Life</label>
                      <input
                        type="text"
                        name="batteryLife"
                        value={accessoryFormData.batteryLife}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 10 hours"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Charging Time</label>
                      <input
                        type="text"
                        name="chargingTime"
                        value={accessoryFormData.chargingTime}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 2 hours"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Wireless Range</label>
                      <input
                        type="text"
                        name="wirelessRange"
                        value={accessoryFormData.wirelessRange}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 10m"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Bluetooth Version</label>
                      <input
                        type="text"
                        name="bluetoothVersion"
                        value={accessoryFormData.bluetoothVersion}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 5.0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Water Resistant</label>
                      <input
                        type="text"
                        name="waterResistant"
                        value={accessoryFormData.waterResistant}
                        onChange={handleAccessoryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., IPX4, IP67"
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Product Images</h4>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Images (Select multiple)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAccessoryImageChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    multiple
                  />
                  {accessoryImagePreview.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {accessoryImagePreview.map((preview, index) => (
                        <div key={index} className="relative">
                          <button
                            type="button"
                            onClick={() => handleAccessoryImageRemove(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-lg border-2 border-gray-600"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4 sticky bottom-0 bg-gray-800 py-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                  >
                    {accessoryFormData.id ? "Update Accessory" : "Create Accessory"}
                  </button>
                  <button
                    type="button"
                    onClick={resetAccessoryForm}
                    className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    );
  };

  // Render Kitchen Management
  const renderKitchenManagement = () => {
    // Filter kitchen products
    const filteredKitchenProducts = kitchenProducts.filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(kitchenSearchTerm.toLowerCase()) ||
                           product.brand?.toLowerCase().includes(kitchenSearchTerm.toLowerCase());

      const matchesType = kitchenTypeFilter === 'all' || product.type === kitchenTypeFilter;
      const matchesBrand = kitchenBrandFilter === 'all' || product.brand === kitchenBrandFilter;

      let matchesEnergy = true;
      if (kitchenEnergyFilter !== 'all') {
        matchesEnergy = product.specs?.energyRating === kitchenEnergyFilter;
      }

      return matchesSearch && matchesType && matchesBrand && matchesEnergy;
    });

    // Get unique brands for filter
    const kitchenBrands = [...new Set(kitchenProducts.map(p => p.brand).filter(Boolean))];

    return (
      <section className="relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Manage Kitchen Appliances <span className="text-sm text-gray-400">({kitchenProducts.length} total)</span>
          </h2>
          <button
            onClick={() => {
              resetKitchenForm();
              setIsEditingKitchen(true);
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <span className="text-xl">+</span> Add New Appliance
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={kitchenSearchTerm}
            onChange={(e) => setKitchenSearchTerm(e.target.value)}
            className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 col-span-1 md:col-span-2"
          />

          <select
            value={kitchenTypeFilter}
            onChange={(e) => setKitchenTypeFilter(e.target.value)}
            className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            {kitchenTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={kitchenBrandFilter}
            onChange={(e) => setKitchenBrandFilter(e.target.value)}
            className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Brands</option>
            {kitchenBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <select
            value={kitchenEnergyFilter}
            onChange={(e) => setKitchenEnergyFilter(e.target.value)}
            className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Energy Ratings</option>
            {energyRatings.map(rating => (
              <option key={rating} value={rating}>{rating}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          {filteredKitchenProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredKitchenProducts.map((product) => {
                const typeColor = getKitchenColor(product.type);

                return (
                  <div key={product._id || product.id} className="bg-gray-700 rounded-lg p-4 hover:shadow-xl transition">
                    {/* Product Image */}
                    <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-600 flex items-center justify-center relative">
                      {product.image || product.images ? (
                        <img
                          src={
                            typeof product.image === 'string' && product.image
                              ? `${BASE_URL}/uploads/${product.image.split(/[\\/]/).pop()}`
                              // Then check if image is an array with items
                              : (Array.isArray(product.image) && product.image.length > 0
                                  ? `${BASE_URL}/uploads/${product.image[0].split(/[\\/]/).pop()}`
                                  // Then check if images array exists
                                  : (product.images && Array.isArray(product.images) && product.images.length > 0
                                      ? `${BASE_URL}/uploads/${product.images[0].split(/[\\/]/).pop()}`
                                      // Finally fallback to placeholder
                                      : '/placeholder-image.jpg'))

                          }
                          alt={product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}

                      {/* Featured Badge */}
                      {product.isFeatured && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-xs font-bold px-2 py-1 rounded">
                          Featured
                        </div>
                      )}

                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{product.discount}%
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="mb-2 flex justify-between items-center">
                      <span className={`inline-block px-2 py-1 text-xs font-bold text-white rounded ${typeColor}`}>
                        {getKitchenIcon(product.type)} {product.type}
                      </span>
                      {product.specs?.energyRating && (
                        <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.specs.energyRating}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-300 mb-2">Brand: {product.brand || 'N/A'}</p>

                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-xl font-bold text-green-400">₹{(product.finalPrice || product.price || 0).toLocaleString()}</p>
                        {product.originalPrice > product.price && (
                          <p className="text-xs text-gray-400 line-through">₹{(product.originalPrice || 0).toLocaleString()}</p>
                        )}
                      </div>
                      <p className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                      </p>
                    </div>

                    {/* Quick Specs Preview */}
                    <div className="text-xs text-gray-300 mb-4 space-y-1 border-t border-gray-600 pt-2">
                      {product.specs?.capacity && <p>Capacity: {product.specs.capacity}</p>}
                      {product.specs?.color && <p>Color: {product.specs.color}</p>}
                      {product.specs?.warranty && <p>Warranty: {product.specs.warranty}</p>}
                      
                      {/* Show features as tags */}
                      {(product.features?.length > 0 || product.specs?.smartFeatures?.length > 0) && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {product.features?.slice(0, 2).map((feature, idx) => (
                            <span key={idx} className="px-1 bg-indigo-900/30 text-indigo-300 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                          {product.specs?.smartFeatures?.slice(0, 2).map((feature, idx) => (
                            <span key={idx} className="px-1 bg-purple-900/30 text-purple-300 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEditKitchen(product)}
                        className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleKitchenFeatured(product._id || product.id, product.isFeatured)}
                        className="flex-1 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                      >
                        {product.isFeatured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button
                        onClick={() => handleDeleteKitchen(product._id || product.id)}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">No kitchen appliances found.</p>
              <button
                onClick={() => {
                  resetKitchenForm();
                  setIsEditingKitchen(true);
                }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Add Your First Kitchen Appliance
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Kitchen Modal */}
        {isEditingKitchen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-800 z-10 pb-2">
                <h3 className="text-xl font-medium text-white">
                  {kitchenFormData.id ? "Edit Kitchen Appliance" : "Add New Kitchen Appliance"}
                </h3>
                <button
                  onClick={resetKitchenForm}
                  className="w-10 h-10 bg-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleKitchenSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={kitchenFormData.name}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Type *</label>
                      <select
                        name="type"
                        value={kitchenFormData.type}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="">Select Type</option>
                        {kitchenTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Brand *</label>
                      <input
                        type="text"
                        name="brand"
                        value={kitchenFormData.brand}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        value={kitchenFormData.price}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Original Price (₹)</label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={kitchenFormData.originalPrice}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Discount (%)</label>
                      <input
                        type="number"
                        name="discount"
                        value={kitchenFormData.discount}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Stock Quantity *</label>
                      <input
                        type="number"
                        name="stock"
                        value={kitchenFormData.stock}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">SKU/Code</label>
                      <input
                        type="text"
                        name="sku"
                        value={kitchenFormData.sku}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={kitchenFormData.isFeatured}
                        onChange={handleKitchenInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">Featured Product</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={kitchenFormData.isActive}
                        onChange={handleKitchenInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">Active</label>
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-bold text-gray-300 mb-2">Short Description</label>
                      <input
                        type="text"
                        name="shortDescription"
                        value={kitchenFormData.shortDescription}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        maxLength="200"
                        placeholder="Brief description (max 200 characters)"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-bold text-gray-300 mb-2">Full Description</label>
                      <textarea
                        name="description"
                        value={kitchenFormData.description}
                        onChange={handleKitchenInputChange}
                        rows="3"
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* General Specifications */}
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">General Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Color</label>
                      <input
                        type="text"
                        name="specs.color"
                        value={kitchenFormData.specs.color}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Weight</label>
                      <input
                        type="text"
                        name="specs.weight"
                        value={kitchenFormData.specs.weight}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 50kg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Dimensions</label>
                      <input
                        type="text"
                        name="specs.dimensions"
                        value={kitchenFormData.specs.dimensions}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 90 x 70 x 180 cm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Material</label>
                      <input
                        type="text"
                        name="specs.material"
                        value={kitchenFormData.specs.material}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Voltage</label>
                      <input
                        type="text"
                        name="specs.voltage"
                        value={kitchenFormData.specs.voltage}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 220-240V"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Power Consumption</label>
                      <input
                        type="text"
                        name="specs.powerConsumption"
                        value={kitchenFormData.specs.powerConsumption}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 250W"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Warranty</label>
                      <input
                        type="text"
                        name="specs.warranty"
                        value={kitchenFormData.specs.warranty}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 2 Years"
                      />
                    </div>
                  </div>
                </div>

                {/* Appliance Specific Fields - Conditional based on type */}
                {kitchenFormData.type === 'Refrigerator' && (
                  <div className="border-b border-gray-700 pb-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Refrigerator Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Capacity</label>
                        <input
                          type="text"
                          name="specs.capacity"
                          value={kitchenFormData.specs.capacity}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 500L"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Energy Rating</label>
                        <select
                          name="specs.energyRating"
                          value={kitchenFormData.specs.energyRating}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select</option>
                          {energyRatings.map(rating => (
                            <option key={rating} value={rating}>{rating}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Defrost Type</label>
                        <select
                          name="specs.defrostType"
                          value={kitchenFormData.specs.defrostType}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select</option>
                          <option value="Frost Free">Frost Free</option>
                          <option value="Direct Cool">Direct Cool</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Compressor</label>
                        <select
                          name="specs.compressor"
                          value={kitchenFormData.specs.compressor}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select</option>
                          <option value="Inverter">Inverter</option>
                          <option value="Normal">Normal</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Refrigerator Type</label>
                        <select
                          name="specs.refrigeratorType"
                          value={kitchenFormData.specs.refrigeratorType}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select</option>
                          <option value="Single Door">Single Door</option>
                          <option value="Double Door">Double Door</option>
                          <option value="Side by Side">Side by Side</option>
                          <option value="French Door">French Door</option>
                          <option value="Multi Door">Multi Door</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Freezer Capacity</label>
                        <input
                          type="text"
                          name="specs.freezerCapacity"
                          value={kitchenFormData.specs.freezerCapacity}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 150L"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.iceMaker"
                          checked={kitchenFormData.specs.iceMaker}
                          onChange={handleKitchenInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Ice Maker</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.waterDispenser"
                          checked={kitchenFormData.specs.waterDispenser}
                          onChange={handleKitchenInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Water Dispenser</label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Microwave/Oven specifications */}
                {(kitchenFormData.type === 'Microwave' || kitchenFormData.type === 'Oven') && (
                  <div className="border-b border-gray-700 pb-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Microwave/Oven Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Type</label>
                        <select
                          name="specs.microwaveType"
                          value={kitchenFormData.specs.microwaveType}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select</option>
                          <option value="Solo">Solo</option>
                          <option value="Grill">Grill</option>
                          <option value="Convection">Convection</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Capacity</label>
                        <input
                          type="text"
                          name="specs.capacity"
                          value={kitchenFormData.specs.capacity}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 28L"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Power Levels</label>
                        <input
                          type="number"
                          name="specs.powerLevels"
                          value={kitchenFormData.specs.powerLevels}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.autoCook"
                          checked={kitchenFormData.specs.autoCook}
                          onChange={handleKitchenInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Auto Cook</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.defrost"
                          checked={kitchenFormData.specs.defrost}
                          onChange={handleKitchenInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Defrost</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.turntable"
                          checked={kitchenFormData.specs.turntable}
                          onChange={handleKitchenInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Turntable</label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dishwasher specifications */}
                {kitchenFormData.type === 'Dishwasher' && (
                  <div className="border-b border-gray-700 pb-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Dishwasher Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Place Settings</label>
                        <input
                          type="number"
                          name="specs.placeSettings"
                          value={kitchenFormData.specs.placeSettings}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Wash Programs</label>
                        <input
                          type="number"
                          name="specs.washPrograms"
                          value={kitchenFormData.specs.washPrograms}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Energy Rating</label>
                        <select
                          name="specs.energyRating"
                          value={kitchenFormData.specs.energyRating}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select</option>
                          {energyRatings.map(rating => (
                            <option key={rating} value={rating}>{rating}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Water Consumption</label>
                        <input
                          type="text"
                          name="specs.waterConsumption"
                          value={kitchenFormData.specs.waterConsumption}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 12L per cycle"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Noise Level</label>
                        <input
                          type="text"
                          name="specs.noiseLevel"
                          value={kitchenFormData.specs.noiseLevel}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 44dB"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Drying System</label>
                        <input
                          type="text"
                          name="specs.dryingSystem"
                          value={kitchenFormData.specs.dryingSystem}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Small Appliances specifications */}
                {['Blender', 'Mixer', 'Juicer', 'Food Processor', 'Coffee Maker', 'Kettle', 'Toaster', 'Air Fryer'].includes(kitchenFormData.type) && (
                  <div className="border-b border-gray-700 pb-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Appliance Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Wattage</label>
                        <input
                          type="text"
                          name="specs.wattage"
                          value={kitchenFormData.specs.wattage}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 1000W"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Capacity</label>
                        <input
                          type="text"
                          name="specs.capacity"
                          value={kitchenFormData.specs.capacity}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 1.5L"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Speed Settings</label>
                        <input
                          type="number"
                          name="specs.speedSettings"
                          value={kitchenFormData.specs.speedSettings}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Jar Material</label>
                        <input
                          type="text"
                          name="specs.jarMaterial"
                          value={kitchenFormData.specs.jarMaterial}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.dishwasherSafe"
                          checked={kitchenFormData.specs.dishwasherSafe}
                          onChange={handleKitchenInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Dishwasher Safe</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.cordless"
                          checked={kitchenFormData.specs.cordless}
                          onChange={handleKitchenInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Cordless</label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Water Purifier specifications */}
                {kitchenFormData.type === 'Water Purifier' && (
                  <div className="border-b border-gray-700 pb-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Water Purifier Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Purification Technology</label>
                        <input
                          type="text"
                          name="specs.purificationTechnology"
                          value={kitchenFormData.specs.purificationTechnology}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., RO + UV + UF"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Storage Capacity</label>
                        <input
                          type="text"
                          name="specs.storageCapacity"
                          value={kitchenFormData.specs.storageCapacity}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 10L"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Purification Stages</label>
                        <input
                          type="number"
                          name="specs.stages"
                          value={kitchenFormData.specs.stages}
                          onChange={handleKitchenInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.tdsController"
                          checked={kitchenFormData.specs.tdsController}
                          onChange={handleKitchenInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">TDS Controller</label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Features</label>
                      <input
                        type="text"
                        name="features"
                        value={Array.isArray(kitchenFormData.features) ? kitchenFormData.features.join(', ') : kitchenFormData.features || ''}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Comma-separated features"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Smart Features</label>
                      <input
                        type="text"
                        name="specs.smartFeatures"
                        value={Array.isArray(kitchenFormData.specs?.smartFeatures) ? kitchenFormData.specs.smartFeatures.join(', ') : kitchenFormData.specs?.smartFeatures || ''}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., WiFi, Voice Control, App Control"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Safety Features</label>
                      <input
                        type="text"
                        name="specs.safetyFeatures"
                        value={Array.isArray(kitchenFormData.specs?.safetyFeatures) ? kitchenFormData.specs.safetyFeatures.join(', ') : kitchenFormData.specs?.safetyFeatures || ''}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Child Lock, Auto Shut-off"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">What's in the Box</label>
                      <input
                        type="text"
                        name="whatsInTheBox"
                        value={Array.isArray(kitchenFormData.whatsInTheBox) ? kitchenFormData.whatsInTheBox.join(', ') : kitchenFormData.whatsInTheBox || ''}
                        onChange={handleKitchenInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Comma-separated items"
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Product Images</h4>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Images (Select multiple)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleKitchenImageChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    multiple
                  />
                  {kitchenImagePreview.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {kitchenImagePreview.map((preview, index) => (
                        <div key={index} className="relative">
                          <button
                            type="button"
                            onClick={() => handleKitchenImageRemove(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-lg border-2 border-gray-600"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4 sticky bottom-0 bg-gray-800 py-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                  >
                    {kitchenFormData.id ? "Update Kitchen Appliance" : "Create Kitchen Appliance"}
                  </button>
                  <button
                    type="button"
                    onClick={resetKitchenForm}
                    className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    );
  };

  // Render Laundry Management
  const renderLaundryManagement = () => {
    // Filter laundry products
    const filteredLaundryProducts = laundryProducts.filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(laundrySearchTerm.toLowerCase()) ||
                           product.brand?.toLowerCase().includes(laundrySearchTerm.toLowerCase());

      const matchesType = laundryTypeFilter === 'all' || product.type === laundryTypeFilter;
      const matchesBrand = laundryBrandFilter === 'all' || product.brand === laundryBrandFilter;

      let matchesLoadType = true;
      if (laundryLoadTypeFilter !== 'all') {
        matchesLoadType = product.specs?.loadType === laundryLoadTypeFilter;
      }

      let matchesEnergy = true;
      if (laundryEnergyFilter !== 'all') {
        matchesEnergy = product.specs?.energyRating === laundryEnergyFilter;
      }

      return matchesSearch && matchesType && matchesBrand && matchesLoadType && matchesEnergy;
    });

    // Get unique brands for filter
    const laundryBrands = [...new Set(laundryProducts.map(p => p.brand).filter(Boolean))];

    return (
      <section className="relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Manage Laundry & Cleaning <span className="text-sm text-gray-400">({laundryProducts.length} total)</span>
          </h2>
          <button
            onClick={() => {
              resetLaundryForm();
              setIsEditingLaundry(true);
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <span className="text-xl">+</span> Add New Appliance
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={laundrySearchTerm}
            onChange={(e) => setLaundrySearchTerm(e.target.value)}
            className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 col-span-1 md:col-span-2"
          />

          <select
            value={laundryTypeFilter}
            onChange={(e) => setLaundryTypeFilter(e.target.value)}
            className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            {laundryTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={laundryBrandFilter}
            onChange={(e) => setLaundryBrandFilter(e.target.value)}
            className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Brands</option>
            {laundryBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <select
            value={laundryLoadTypeFilter}
            onChange={(e) => setLaundryLoadTypeFilter(e.target.value)}
            className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Load Types</option>
            {loadTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={laundryEnergyFilter}
            onChange={(e) => setLaundryEnergyFilter(e.target.value)}
            className="px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Energy Ratings</option>
            {energyRatings.map(rating => (
              <option key={rating} value={rating}>{rating}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          {filteredLaundryProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLaundryProducts.map((product) => {
                const typeColor = getLaundryColor(product.type);

                return (
                  <div key={product._id || product.id} className="bg-gray-700 rounded-lg p-4 hover:shadow-xl transition">
                    {/* Product Image */}
                    <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-600 flex items-center justify-center relative">
                      {product.image || product.images ? (
                        <img
                          src={
                            typeof product.image === 'string' && product.image
                              ? `${BASE_URL}/uploads/${product.image.split(/[\\/]/).pop()}`
                              // Then check if image is an array with items
                              : (Array.isArray(product.image) && product.image.length > 0
                                  ? `${BASE_URL}/uploads/${product.image[0].split(/[\\/]/).pop()}`
                                  // Then check if images array exists
                                  : (product.images && Array.isArray(product.images) && product.images.length > 0
                                      ? `${BASE_URL}/uploads/${product.images[0].split(/[\\/]/).pop()}`
                                      // Finally fallback to placeholder
                                      : '/placeholder-image.jpg'))
                          }
                          alt={product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}

                      {/* Featured Badge */}
                      {product.isFeatured && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-xs font-bold px-2 py-1 rounded">
                          Featured
                        </div>
                      )}

                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{product.discount}%
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="mb-2 flex justify-between items-center">
                      <span className={`inline-block px-2 py-1 text-xs font-bold text-white rounded ${typeColor}`}>
                        {getLaundryIcon(product.type)} {product.type}
                      </span>
                      {product.specs?.energyRating && (
                        <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.specs.energyRating}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-300 mb-2">Brand: {product.brand || 'N/A'}</p>

                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-xl font-bold text-green-400">₹{(product.finalPrice || product.price || 0).toLocaleString()}</p>
                        {product.originalPrice > product.price && (
                          <p className="text-xs text-gray-400 line-through">₹{(product.originalPrice || 0).toLocaleString()}</p>
                        )}
                      </div>
                      <p className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                      </p>
                    </div>

                    {/* Quick Specs Preview */}
                    <div className="text-xs text-gray-300 mb-4 space-y-1 border-t border-gray-600 pt-2">
                      {product.specs?.capacity && <p>Capacity: {product.specs.capacity}</p>}
                      {product.specs?.loadType && <p>Load Type: {product.specs.loadType}</p>}
                      {product.specs?.spinSpeed && <p>Spin Speed: {product.specs.spinSpeed}</p>}
                      {product.specs?.suctionPower && <p>Suction: {product.specs.suctionPower}</p>}
                      {product.specs?.batteryLife && <p>Battery: {product.specs.batteryLife}</p>}
                      
                      {/* Show features as tags */}
                      {(product.features?.length > 0) && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {product.features?.slice(0, 3).map((feature, idx) => (
                            <span key={idx} className="px-1 bg-indigo-900/30 text-indigo-300 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEditLaundry(product)}
                        className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleLaundryFeatured(product._id || product.id, product.isFeatured)}
                        className="flex-1 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                      >
                        {product.isFeatured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button
                        onClick={() => handleDeleteLaundry(product._id || product.id)}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">No laundry appliances found.</p>
              <button
                onClick={() => {
                  resetLaundryForm();
                  setIsEditingLaundry(true);
                }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Add Your First Laundry Appliance
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Laundry Modal */}
        {isEditingLaundry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-800 z-10 pb-2">
                <h3 className="text-xl font-medium text-white">
                  {laundryFormData.id ? "Edit Laundry Appliance" : "Add New Laundry Appliance"}
                </h3>
                <button
                  onClick={resetLaundryForm}
                  className="w-10 h-10 bg-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleLaundrySubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={laundryFormData.name}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Type *</label>
                      <select
                        name="type"
                        value={laundryFormData.type}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="">Select Type</option>
                        {laundryTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Brand *</label>
                      <input
                        type="text"
                        name="brand"
                        value={laundryFormData.brand}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        value={laundryFormData.price}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Original Price (₹)</label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={laundryFormData.originalPrice}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Discount (%)</label>
                      <input
                        type="number"
                        name="discount"
                        value={laundryFormData.discount}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Stock Quantity *</label>
                      <input
                        type="number"
                        name="stock"
                        value={laundryFormData.stock}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">SKU/Code</label>
                      <input
                        type="text"
                        name="sku"
                        value={laundryFormData.sku}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={laundryFormData.isFeatured}
                        onChange={handleLaundryInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">Featured Product</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={laundryFormData.isActive}
                        onChange={handleLaundryInputChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-300">Active</label>
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-bold text-gray-300 mb-2">Short Description</label>
                      <input
                        type="text"
                        name="shortDescription"
                        value={laundryFormData.shortDescription}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        maxLength="200"
                        placeholder="Brief description (max 200 characters)"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-bold text-gray-300 mb-2">Full Description</label>
                      <textarea
                        name="description"
                        value={laundryFormData.description}
                        onChange={handleLaundryInputChange}
                        rows="3"
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* General Specifications */}
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">General Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Color</label>
                      <input
                        type="text"
                        name="specs.color"
                        value={laundryFormData.specs.color}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Weight</label>
                      <input
                        type="text"
                        name="specs.weight"
                        value={laundryFormData.specs.weight}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 70kg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Dimensions</label>
                      <input
                        type="text"
                        name="specs.dimensions"
                        value={laundryFormData.specs.dimensions}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 60 x 85 x 60 cm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Material</label>
                      <input
                        type="text"
                        name="specs.material"
                        value={laundryFormData.specs.material}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Voltage</label>
                      <input
                        type="text"
                        name="specs.voltage"
                        value={laundryFormData.specs.voltage}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 220-240V"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Power Consumption</label>
                      <input
                        type="text"
                        name="specs.powerConsumption"
                        value={laundryFormData.specs.powerConsumption}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 500W"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Warranty</label>
                      <input
                        type="text"
                        name="specs.warranty"
                        value={laundryFormData.specs.warranty}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 2 Years"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Cord Length</label>
                      <input
                        type="text"
                        name="specs.cordLength"
                        value={laundryFormData.specs.cordLength}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 1.5m"
                      />
                    </div>
                  </div>
                </div>

                {/* Washing Machine Specific Fields */}
                {(laundryFormData.type === 'Washing Machine' || laundryFormData.type === 'Washer-Dryer Combo') && (
                  <div className="border-b border-gray-700 pb-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Washing Machine Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Capacity</label>
                        <input
                          type="text"
                          name="specs.capacity"
                          value={laundryFormData.specs.capacity}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 7kg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Load Type</label>
                        <select
                          name="specs.loadType"
                          value={laundryFormData.specs.loadType}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select</option>
                          {loadTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Washing Technology</label>
                        <input
                          type="text"
                          name="specs.washingTechnology"
                          value={laundryFormData.specs.washingTechnology}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 6 Motion"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Spin Speed</label>
                        <input
                          type="text"
                          name="specs.spinSpeed"
                          value={laundryFormData.specs.spinSpeed}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 1200 RPM"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Energy Rating</label>
                        <select
                          name="specs.energyRating"
                          value={laundryFormData.specs.energyRating}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select</option>
                          {energyRatings.map(rating => (
                            <option key={rating} value={rating}>{rating}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Water Consumption</label>
                        <input
                          type="text"
                          name="specs.waterConsumption"
                          value={laundryFormData.specs.waterConsumption}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 75L per cycle"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Programs</label>
                        <input
                          type="number"
                          name="specs.programs"
                          value={laundryFormData.specs.programs}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Number of programs"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.temperatureControl"
                          checked={laundryFormData.specs.temperatureControl}
                          onChange={handleLaundryInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Temperature Control</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.delayStart"
                          checked={laundryFormData.specs.delayStart}
                          onChange={handleLaundryInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Delay Start</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.childLock"
                          checked={laundryFormData.specs.childLock}
                          onChange={handleLaundryInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Child Lock</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.smartDiagnosis"
                          checked={laundryFormData.specs.smartDiagnosis}
                          onChange={handleLaundryInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Smart Diagnosis</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.inverterMotor"
                          checked={laundryFormData.specs.inverterMotor}
                          onChange={handleLaundryInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Inverter Motor</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.steamWash"
                          checked={laundryFormData.specs.steamWash}
                          onChange={handleLaundryInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Steam Wash</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.quickWash"
                          checked={laundryFormData.specs.quickWash}
                          onChange={handleLaundryInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Quick Wash</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.stainRemoval"
                          checked={laundryFormData.specs.stainRemoval}
                          onChange={handleLaundryInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Stain Removal</label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dryer Specific Fields */}
                {laundryFormData.type === 'Dryer' && (
                  <div className="border-b border-gray-700 pb-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Dryer Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Drying Capacity</label>
                        <input
                          type="text"
                          name="specs.dryingCapacity"
                          value={laundryFormData.specs.dryingCapacity}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 7kg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Drying Technology</label>
                        <input
                          type="text"
                          name="specs.dryingTechnology"
                          value={laundryFormData.specs.dryingTechnology}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., Heat Pump"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.moistureSensor"
                          checked={laundryFormData.specs.moistureSensor}
                          onChange={handleLaundryInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Moisture Sensor</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.antiCrease"
                          checked={laundryFormData.specs.antiCrease}
                          onChange={handleLaundryInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Anti-Crease</label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vacuum Cleaner Specific Fields */}
                {laundryFormData.type.includes('Vacuum') && (
                  <div className="border-b border-gray-700 pb-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Vacuum Cleaner Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Vacuum Type</label>
                        <input
                          type="text"
                          name="specs.vacuumType"
                          value={laundryFormData.specs.vacuumType}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., Bagless"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Suction Power</label>
                        <input
                          type="text"
                          name="specs.suctionPower"
                          value={laundryFormData.specs.suctionPower}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 250 AW"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Filter Type</label>
                        <input
                          type="text"
                          name="specs.filterType"
                          value={laundryFormData.specs.filterType}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., HEPA"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Dust Capacity</label>
                        <input
                          type="text"
                          name="specs.dustCapacity"
                          value={laundryFormData.specs.dustCapacity}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 1.5L"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Noise Level</label>
                        <input
                          type="text"
                          name="specs.noiseLevel"
                          value={laundryFormData.specs.noiseLevel}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 75dB"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Attachments</label>
                        <input
                          type="text"
                          name="specs.attachments"
                          value={laundryFormData.specs.attachments.join(', ')}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Comma-separated attachments"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Battery Life</label>
                        <input
                          type="text"
                          name="specs.batteryLife"
                          value={laundryFormData.specs.batteryLife}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 60 minutes"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Charging Time</label>
                        <input
                          type="text"
                          name="specs.chargingTime"
                          value={laundryFormData.specs.chargingTime}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 4 hours"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Runtime</label>
                        <input
                          type="text"
                          name="specs.runtime"
                          value={laundryFormData.specs.runtime}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 45 minutes"
                        />
                      </div>

                      {/* Robot Vacuum Specific */}
                      {laundryFormData.type === 'Robot Vacuum' && (
                        <>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="specs.autoDocking"
                              checked={laundryFormData.specs.autoDocking}
                              onChange={handleLaundryInputChange}
                              className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                            />
                            <label className="ml-2 text-sm text-gray-300">Auto Docking</label>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">Mapping Technology</label>
                            <input
                              type="text"
                              name="specs.mappingTechnology"
                              value={laundryFormData.specs.mappingTechnology}
                              onChange={handleLaundryInputChange}
                              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="e.g., LiDAR"
                            />
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="specs.appControl"
                              checked={laundryFormData.specs.appControl}
                              onChange={handleLaundryInputChange}
                              className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                            />
                            <label className="ml-2 text-sm text-gray-300">App Control</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="specs.voiceControl"
                              checked={laundryFormData.specs.voiceControl}
                              onChange={handleLaundryInputChange}
                              className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                            />
                            <label className="ml-2 text-sm text-gray-300">Voice Control</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="specs.scheduling"
                              checked={laundryFormData.specs.scheduling}
                              onChange={handleLaundryInputChange}
                              className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                            />
                            <label className="ml-2 text-sm text-gray-300">Scheduling</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="specs.multiFloorMapping"
                              checked={laundryFormData.specs.multiFloorMapping}
                              onChange={handleLaundryInputChange}
                              className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                            />
                            <label className="ml-2 text-sm text-gray-300">Multi-Floor Mapping</label>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Iron Specific Fields */}
                {laundryFormData.type.includes('Iron') && (
                  <div className="border-b border-gray-700 pb-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Iron Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Iron Type</label>
                        <input
                          type="text"
                          name="specs.ironType"
                          value={laundryFormData.specs.ironType}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., Steam Iron"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Soleplate Type</label>
                        <input
                          type="text"
                          name="specs.soleplateType"
                          value={laundryFormData.specs.soleplateType}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., Ceramic"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Water Tank Capacity</label>
                        <input
                          type="text"
                          name="specs.waterTankCapacity"
                          value={laundryFormData.specs.waterTankCapacity}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 300ml"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Steam Output</label>
                        <input
                          type="text"
                          name="specs.steamOutput"
                          value={laundryFormData.specs.steamOutput}
                          onChange={handleLaundryInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g., 30g/min"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.verticalSteam"
                          checked={laundryFormData.specs.verticalSteam}
                          onChange={handleLaundryInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Vertical Steam</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.antiDrip"
                          checked={laundryFormData.specs.antiDrip}
                          onChange={handleLaundryInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Anti-Drip</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.autoShutOff"
                          checked={laundryFormData.specs.autoShutOff}
                          onChange={handleLaundryInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Auto Shut-Off</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.selfClean"
                          checked={laundryFormData.specs.selfClean}
                          onChange={handleLaundryInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Self Clean</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="specs.cordless"
                          checked={laundryFormData.specs.cordless}
                          onChange={handleLaundryInputChange}
                          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm text-gray-300">Cordless</label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Features & Inclusions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Features</label>
                      <input
                        type="text"
                        name="features"
                        value={laundryFormData.features.join(', ')}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Comma-separated features"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Compatible With</label>
                      <input
                        type="text"
                        name="compatibleWith"
                        value={laundryFormData.compatibleWith.join(', ')}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., SmartThings, Alexa"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">What's in the Box</label>
                      <input
                        type="text"
                        name="whatsInTheBox"
                        value={laundryFormData.whatsInTheBox.join(', ')}
                        onChange={handleLaundryInputChange}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Comma-separated items"
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="border-b border-gray-700 pb-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Product Images</h4>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Images (Select multiple)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLaundryImageChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    multiple
                  />
                  {laundryImagePreview.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {laundryImagePreview.map((preview, index) => (
                        <div key={index} className="relative">
                          <button
                            type="button"
                            onClick={() => handleLaundryImageRemove(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-24 h-24 object-cover rounded-lg border-2 border-gray-600"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4 sticky bottom-0 bg-gray-800 py-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                  >
                    {laundryFormData.id ? "Update Laundry Appliance" : "Create Laundry Appliance"}
                  </button>
                  <button
                    type="button"
                    onClick={resetLaundryForm}
                    className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    );
  };

  return (
  <div className="min-h-screen bg-gray-900 text-indigo-400">
    {!isAuthenticated ? (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange1}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange1}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200 transform hover:scale-[1.02]"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    ) : (
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-gray-800 transition-all duration-300 fixed left-0 top-0 h-full z-30 border-r border-gray-700`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              {sidebarOpen && (
                <h1 className="text-xl font-bold text-white truncate">Admin Panel</h1>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
              >
                {sidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>
            </div>

            {/* Navigation Menu - Scrollable */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center ${
                    sidebarOpen ? 'justify-start px-4 py-3' : 'justify-center p-3'
                  } ${
                    activeSection === item.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  } rounded-lg transition-all duration-200 group relative`}
                  title={!sidebarOpen ? item.label : ''}
                >
                  <span className="text-lg">{item.icon}</span>
                  {sidebarOpen && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              ))}
            </nav>

            {/* Logout Button - Fixed at Bottom */}
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className={`w-full flex items-center ${
                  sidebarOpen ? 'justify-start px-4 py-3' : 'justify-center p-3'
                } text-red-400 hover:bg-red-900 hover:text-white rounded-lg transition-all duration-200 group relative`}
                title={!sidebarOpen ? 'Logout' : ''}
              >
                <FaSignOutAlt className="text-lg" />
                {sidebarOpen && <span className="ml-3 text-sm font-medium">Logout</span>}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    Logout
                  </div>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-20'
          } min-h-screen bg-gray-900`}
        >
          {/* Header */}
          <header
            className="fixed top-0 right-0 bg-gray-800 shadow-lg border-b border-gray-700 z-20"
            style={{
              left: sidebarOpen ? '16rem' : '5rem',
              transition: 'left 0.3s ease'
            }}
          >
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">
                  {menuItems.find(item => item.id === activeSection)?.label || 'Admin Panel'}
                </h1>
                <div className="flex items-center space-x-4">
                  {/* Notes Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotesModal(true)}
                      className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-colors relative"
                      title="Notes"
                    >
                      <FaStickyNote className="text-white text-sm" />
                      {notes.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {notes.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Notes Modal */}
          {showNotesModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium text-white">My Notes</h3>
                  <button
                    onClick={() => setShowNotesModal(false)}
                    className="w-8 h-8 bg-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-600"
                  >
                    <FaTimes />
                  </button>
                </div>
          
                {/* Search and Add Button */}
                <div className="flex justify-between items-center mb-4">
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={notesSearchTerm}
                    onChange={(e) => setNotesSearchTerm(e.target.value)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => {
                      resetNoteForm();
                      setIsEditingNote(true);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                  >
                    <span className="text-xl">+</span> Add Note
                  </button>
                </div>
                  
                {/* Notes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notes
                    .filter(note => 
                      note.title?.toLowerCase().includes(notesSearchTerm.toLowerCase()) ||
                      note.content?.toLowerCase().includes(notesSearchTerm.toLowerCase())
                    )
                    .map((note) => (
                      <div key={note._id} className="bg-gray-700 rounded-lg p-4 hover:shadow-xl transition">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-semibold">{note.title || 'Untitled'}</h4>
                          <span className="text-xs text-gray-400">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                          {note.content}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note._id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                  
                {notes.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No notes yet. Click "Add Note" to create one.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Add/Edit Note Modal */}
          {isEditingNote && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-[60]">
              <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium text-white">
                    {currentNote.id ? "Edit Note" : "Create New Note"}
                  </h3>
                  <button
                    onClick={resetNoteForm}
                    className="w-8 h-8 bg-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-600"
                  >
                    <FaTimes />
                  </button>
                </div>
          
                <form onSubmit={currentNote.id ? handleUpdateNote : handleAddNote} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={currentNote.title}
                      onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Note title"
                      required
                    />
                  </div>
          
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Content</label>
                    <textarea
                      value={currentNote.content}
                      onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
                      rows="5"
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      placeholder="Write your note here..."
                      required
                    />
                  </div>
          
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                    >
                      {currentNote.id ? "Update Note" : "Create Note"}
                    </button>
                    <button
                      type="button"
                      onClick={resetNoteForm}
                      className="flex-1 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="pt-20 px-6 pb-6 min-h-screen">
            {/* Countdown Timer - Draggable */}
            <div
              className="fixed bg-gray-800 text-white p-4 rounded-lg shadow-2xl border border-gray-700 cursor-move z-50"
              style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <p className="text-sm font-medium text-gray-400 mb-1">Session Timeout</p>
              <p className="text-2xl font-bold text-indigo-400 mb-3">{formatTime(countdown)}</p>
              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-200 text-sm"
              >
                Logout Now
              </button>
            </div>

            {/* Render active section */}
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
              {renderSection()}
            </div>
          </div>
        </main>
      </div>
    )}
  </div>
);
};

export default AdminPanel;