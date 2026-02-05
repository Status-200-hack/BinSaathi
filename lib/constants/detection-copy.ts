// UX Copy for Detection System

export const ERROR_MESSAGES = {
  imageUploadFailed: {
    title: "Upload Issue",
    message: "Couldn't process your image. Try a clearer photo with good lighting.",
    action: "Try Again",
    icon: "error"
  },
  
  imageTooLarge: {
    title: "Image Too Large",
    message: "Please use an image smaller than 10MB for faster processing.",
    action: "Choose Different Image",
    icon: "file_upload"
  },
  
  processingTimeout: {
    title: "Taking Longer Than Expected",
    message: "Our AI is working hard! This sometimes happens with complex items.",
    action: "Continue Waiting",
    icon: "hourglass_empty"
  },
  
  networkError: {
    title: "Connection Issue",
    message: "Check your internet connection and try again.",
    action: "Retry",
    icon: "wifi_off"
  },
  
  unsupportedFormat: {
    title: "Unsupported Image Format",
    message: "Please use JPG, PNG, or WebP images for best results.",
    action: "Choose Different Image",
    icon: "image"
  },
  
  detectionFailed: {
    title: "Detection Failed",
    message: "Something went wrong during analysis. Let's try a different approach.",
    action: "Try Manual Entry",
    icon: "psychology"
  }
} as const

export const LOW_CONFIDENCE_STATES = {
  needsHelp: {
    title: "I Need Your Help! 🤔",
    message: "I'm not quite sure what this is. Your expertise will help me learn!",
    actions: ["Help Me Identify", "Skip This Item"],
    icon: "help",
    color: "yellow"
  },
  
  multipleOptions: {
    title: "A Few Possibilities",
    message: "I see a few options for what this might be. Which looks right?",
    actions: ["Show Options", "None of These"],
    icon: "quiz",
    color: "blue"
  },
  
  unusual: {
    title: "Something New!",
    message: "This doesn't match items I've seen before. What type of device is this?",
    actions: ["Tell Me More", "It's Not E-Waste"],
    icon: "new_releases",
    color: "purple"
  },
  
  unclear: {
    title: "Need More Details",
    message: "The image or details aren't clear enough for accurate detection.",
    actions: ["Add More Info", "Take New Photo"],
    icon: "visibility_off",
    color: "orange"
  }
} as const

export const SUCCESS_MESSAGES = {
  highConfidence: {
    title: "Perfect Match! ✨",
    message: "I'm very confident about this identification. Great job recycling responsibly!",
    celebration: "🎉 Environmental hero!",
    color: "green"
  },
  
  mediumConfidence: {
    title: "Good Match! 👍",
    message: "This looks right to me. Thanks for helping keep electronics out of landfills!",
    celebration: "🌱 Making a difference!",
    color: "blue"
  },
  
  userCorrected: {
    title: "Thanks for Teaching Me! 🧠",
    message: "Your correction helps me get better at identifying items like this.",
    celebration: "📚 Learning together!",
    color: "purple"
  },
  
  firstTime: {
    title: "Welcome to E-Waste Hero! 🌟",
    message: "You just took your first step toward a more sustainable future!",
    celebration: "🚀 Journey begins!",
    color: "primary"
  }
} as const

export const CONFIDENCE_EXPLANATIONS = {
  high: {
    smartphone: (weight: number) => 
      `Strong match detected! The weight (${weight}g) and size perfectly match a typical smartphone. Visual patterns suggest a rectangular device with rounded corners.`,
    laptop: (weight: number) => 
      `Excellent match! The weight (${weight}g) and large size are consistent with a laptop computer. The proportions suggest a standard clamshell design.`,
    battery: (weight: number) => 
      `Very confident this is a battery. The small size and weight (${weight}g) match lithium-ion cell specifications. Safety first - great choice for proper disposal!`,
    tablet: (weight: number) => 
      `Perfect tablet match! The weight (${weight}g) and medium size are exactly what I'd expect for a tablet device.`,
    cable: (weight: number) => 
      `Clear cable identification. The weight (${weight}g) and size suggest charging or data cables, possibly bundled together.`,
    monitor: (weight: number) => 
      `Definite monitor match! The heavy weight (${weight}g) and extra-large size are characteristic of computer displays.`
  },
  medium: {
    smartphone: (weight: number) => 
      `Likely a smartphone based on size and weight (${weight}g), but could also be a small tablet or e-reader. The weight is slightly higher than typical phones.`,
    laptop: (weight: number) => 
      `Probably a laptop computer. The weight (${weight}g) fits the range, though it could be a large tablet or small all-in-one computer.`,
    battery: (weight: number) => 
      `Appears to be a battery pack. The weight (${weight}g) suggests it might be multiple cells or a larger capacity battery.`,
    tablet: (weight: number) => 
      `Likely a tablet device. The weight (${weight}g) and medium size fit this category, though it could be a large smartphone or small laptop.`,
    cable: (weight: number) => 
      `Probably charging cables or data cables. The weight (${weight}g) suggests multiple cables bundled together. Could include adapters or small accessories.`,
    monitor: (weight: number) => 
      `Seems like a monitor or display. The weight (${weight}g) is in range, but could also be a TV or large tablet.`
  },
  low: {
    unknown: (weight: number) => 
      `I'm having trouble identifying this item with certainty. The weight (${weight}g) and size don't clearly match common e-waste patterns. Your input would help improve accuracy!`,
    mixed: (weight: number) => 
      `This might be multiple items or an unusual device. The weight (${weight}g) suggests it could be several small items together. Can you help me identify what this is?`,
    unclear: (weight: number) => 
      `The characteristics don't strongly match any single item type. This could be an accessory, component, or specialized device. Manual identification would be most accurate.`
  }
} as const

export const SCANNING_PHASES = [
  { 
    phase: 'initializing', 
    message: 'Starting scan...', 
    icon: 'play_circle',
    duration: 500 
  },
  { 
    phase: 'analyzing', 
    message: 'Analyzing image...', 
    icon: 'image_search',
    duration: 1000 
  },
  { 
    phase: 'matching', 
    message: 'Matching patterns...', 
    icon: 'pattern',
    duration: 800 
  },
  { 
    phase: 'calculating', 
    message: 'Calculating confidence...', 
    icon: 'calculate',
    duration: 700 
  }
] as const

export const REWARD_MESSAGES = {
  points: {
    low: "Every point counts! 🌱",
    medium: "Great contribution! 🌟",
    high: "Amazing impact! 🚀",
    exceptional: "Eco-warrior level! 👑"
  },
  
  carbonSaved: {
    milestone_1kg: "You've saved 1kg of CO₂! That's like planting a tree! 🌳",
    milestone_5kg: "5kg CO₂ saved! You're making a real difference! 🌍",
    milestone_10kg: "10kg CO₂ saved! Climate hero status unlocked! 🦸‍♀️"
  },
  
  streaks: {
    day3: "3 days in a row! Building great habits! 📅",
    week1: "One week streak! You're on fire! 🔥",
    month1: "One month of consistent recycling! Legend! 🏆"
  }
} as const

export const MANUAL_ENTRY_PROMPTS = {
  itemType: {
    title: "What type of device is this?",
    subtitle: "Help me learn by selecting the category",
    options: [
      { value: 'smartphone', label: 'Smartphone', icon: 'smartphone' },
      { value: 'laptop', label: 'Laptop', icon: 'laptop_mac' },
      { value: 'tablet', label: 'Tablet', icon: 'tablet_mac' },
      { value: 'battery', label: 'Battery', icon: 'battery_charging_full' },
      { value: 'cable', label: 'Cable/Charger', icon: 'cable' },
      { value: 'monitor', label: 'Monitor/Display', icon: 'desktop_windows' },
      { value: 'other', label: 'Other E-Waste', icon: 'devices' }
    ]
  },
  
  condition: {
    title: "What's the condition?",
    subtitle: "This helps calculate recycling value",
    options: [
      { value: 'working', label: 'Working', description: 'Powers on, functions normally' },
      { value: 'damaged', label: 'Damaged', description: 'Some issues but repairable' },
      { value: 'broken', label: 'Broken', description: 'Not working, for parts only' },
      { value: 'unknown', label: 'Not Sure', description: 'Haven\'t tested it' }
    ]
  },
  
  age: {
    title: "How old is it approximately?",
    subtitle: "Age affects recycling value and materials",
    options: [
      { value: 'new', label: '0-2 years', description: 'Recent model' },
      { value: 'medium', label: '3-5 years', description: 'A few years old' },
      { value: 'old', label: '6-10 years', description: 'Older but functional' },
      { value: 'vintage', label: '10+ years', description: 'Legacy device' }
    ]
  }
} as const

export const TIPS_AND_HINTS = {
  photography: [
    "📸 Use good lighting for better detection accuracy",
    "🔍 Get close enough to show details clearly",
    "📐 Try to fill the frame with your device",
    "🌟 Clean the camera lens for sharper images",
    "📱 Hold steady to avoid blurry photos"
  ],
  
  weight: [
    "⚖️ Use a kitchen scale for accurate weight",
    "📦 Remove packaging and accessories first",
    "🔋 Include batteries if they're built-in",
    "📏 Estimate if you don't have a scale",
    "🤝 Ask for help with heavy items"
  ],
  
  preparation: [
    "🔒 Remove personal data before recycling",
    "🔋 Remove batteries if easily accessible",
    "📱 Keep chargers and accessories together",
    "🧹 Clean devices for better identification",
    "📋 Note any damage or missing parts"
  ]
} as const

export const ACCESSIBILITY_LABELS = {
  imageUpload: "Upload image of electronic device for AI detection",
  weightSlider: "Adjust estimated weight of device in grams",
  sizeSelector: "Select size category of electronic device",
  confidenceIndicator: "AI confidence level in detection result",
  alternativeOptions: "Alternative device identification options",
  confirmButton: "Confirm detection result and proceed to recycling",
  retryButton: "Try detection again with different inputs"
} as const