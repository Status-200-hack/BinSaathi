# AI-Powered Waste Detection System Design

## 🔍 Detection Flow Diagram

```
┌─────────────────┐
│   User Input    │
├─────────────────┤
│ • Image Upload  │
│ • Weight Slider │
│ • Size Selector │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Pre-Processing  │
├─────────────────┤
│ • Image Analysis│
│ • Metadata Prep │
│ • Input Validation
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ AI Detection    │
├─────────────────┤
│ • Pattern Match │
│ • Rule Engine   │
│ • Confidence    │
│ • Generate Explanation
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Confidence      │
│ Evaluation      │
├─────────────────┤
│ High (>85%):    │
│ → Auto Accept   │
│                 │
│ Medium (60-85%):│
│ → Show Options  │
│                 │
│ Low (<60%):     │
│ → Manual Input  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Result Display  │
├─────────────────┤
│ • Item Details  │
│ • Confidence    │
│ • Explanation   │
│ • Manual Override
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ User Confirms   │
├─────────────────┤
│ • Accept Result │
│ • Correct Item  │
│ • Add Details   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Firestore Log   │
├─────────────────┤
│ • Detection Data│
│ • User Feedback │
│ • Confidence    │
│ • Timestamp     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Reward Flow     │
├─────────────────┤
│ • Calculate Pts │
│ • Show Impact   │
│ • Success Anim  │
└─────────────────┘
```

## 🧠 Detection Logic Implementation

### Input Processing
```typescript
interface DetectionInput {
  image?: File | string;           // Image file or base64
  weight: number;                  // Grams (0-5000g slider)
  size: 'small' | 'medium' | 'large' | 'xl';
  userHints?: string[];           // Optional user-provided hints
}

interface SizeMapping {
  small: { volume: '<100cm³', examples: 'Phone, cables, batteries' };
  medium: { volume: '100-500cm³', examples: 'Tablet, small laptop' };
  large: { volume: '500-2000cm³', examples: 'Laptop, desktop monitor' };
  xl: { volume: '>2000cm³', examples: 'Desktop PC, large appliances' };
}
```

### Rule-Based Detection Engine
```typescript
const detectionRules = {
  smartphone: {
    weight: { min: 100, max: 300, optimal: 150 },
    size: ['small', 'medium'],
    keywords: ['phone', 'mobile', 'iphone', 'android'],
    confidence_boost: 0.2
  },
  laptop: {
    weight: { min: 800, max: 3000, optimal: 1500 },
    size: ['large', 'xl'],
    keywords: ['laptop', 'macbook', 'notebook'],
    confidence_boost: 0.25
  },
  tablet: {
    weight: { min: 300, max: 800, optimal: 500 },
    size: ['medium', 'large'],
    keywords: ['tablet', 'ipad'],
    confidence_boost: 0.2
  },
  battery: {
    weight: { min: 10, max: 200, optimal: 50 },
    size: ['small'],
    keywords: ['battery', 'cell', 'lithium'],
    confidence_boost: 0.3
  },
  cable: {
    weight: { min: 20, max: 500, optimal: 100 },
    size: ['small', 'medium'],
    keywords: ['cable', 'wire', 'charger', 'usb'],
    confidence_boost: 0.15
  }
};
```

## 📊 Firestore Detection Record Schema

```typescript
// Collection: /detections/{detectionId}
interface DetectionRecord {
  // Identifiers
  id: string;                     // Auto-generated document ID
  userId: string;                 // User who made detection
  sessionId: string;              // Detection session ID
  
  // Input Data
  input: {
    imageUrl?: string;            // Firebase Storage URL
    imageMetadata?: {
      size: number;               // File size in bytes
      type: string;               // MIME type
      dimensions?: {
        width: number;
        height: number;
      };
    };
    weight: number;               // User-provided weight in grams
    size: 'small' | 'medium' | 'large' | 'xl';
    userHints?: string[];         // Optional user hints
  };
  
  // AI Detection Results
  detection: {
    primaryResult: {
      itemType: string;           // e.g., 'smartphone', 'laptop'
      itemName: string;           // e.g., 'iPhone 11 Pro', 'MacBook Air'
      confidence: number;         // 0-100 confidence score
      explanation: string;        // Human-readable explanation
    };
    alternativeResults?: Array<{
      itemType: string;
      itemName: string;
      confidence: number;
      explanation: string;
    }>;
    processingTime: number;       // Detection time in milliseconds
    algorithm: string;            // 'rule-based-v1' or 'ml-model-v2'
  };
  
  // User Interaction
  userFeedback: {
    accepted: boolean;            // Did user accept the result?
    correctedItem?: {
      itemType: string;
      itemName: string;
      reason: string;             // Why they corrected it
    };
    confidenceRating?: number;    // User's confidence in result (1-5)
    additionalNotes?: string;
  };
  
  // Calculated Values
  calculated: {
    pointsEarned: number;         // Points awarded
    carbonSaved: number;          // CO2 saved in kg
    recyclingValue: number;       // Estimated value in USD
    materials: string[];          // Recoverable materials
  };
  
  // Metadata
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    location?: {
      lat: number;
      lng: number;
      binId?: string;             // If detected at specific bin
    };
    deviceInfo: {
      userAgent: string;
      platform: string;
      appVersion: string;
    };
    flags: {
      lowConfidence: boolean;     // Confidence < 60%
      manualOverride: boolean;    // User corrected result
      suspicious: boolean;        // Unusual patterns detected
    };
  };
}

// Collection: /detection_analytics/{date}
interface DetectionAnalytics {
  date: string;                   // YYYY-MM-DD format
  totalDetections: number;
  averageConfidence: number;
  accuracyRate: number;           // Based on user feedback
  topItems: Array<{
    itemType: string;
    count: number;
    avgConfidence: number;
  }>;
  lowConfidenceRate: number;      // Percentage of detections < 60%
  userCorrectionRate: number;     // Percentage of manual overrides
}
```

## 💬 Confidence Explanation Examples

### High Confidence (85-100%)
```typescript
const highConfidenceExplanations = {
  smartphone: "Strong match detected! The weight ({weight}g) and size perfectly match a typical smartphone. Visual patterns suggest a rectangular device with rounded corners.",
  
  laptop: "Excellent match! The weight ({weight}g) and large size are consistent with a laptop computer. The proportions suggest a standard clamshell design.",
  
  battery: "Very confident this is a battery. The small size and weight ({weight}g) match lithium-ion cell specifications. Safety first - great choice for proper disposal!"
};
```

### Medium Confidence (60-84%)
```typescript
const mediumConfidenceExplanations = {
  smartphone: "Likely a smartphone based on size and weight ({weight}g), but could also be a small tablet or e-reader. The weight is slightly higher than typical phones.",
  
  tablet: "Appears to be a tablet device. The weight ({weight}g) and medium size fit this category, though it could be a large smartphone or small laptop.",
  
  cable: "Probably charging cables or data cables. The weight ({weight}g) suggests multiple cables bundled together. Could include adapters or small accessories."
};
```

### Low Confidence (<60%)
```typescript
const lowConfidenceExplanations = {
  unknown: "I'm having trouble identifying this item with certainty. The weight ({weight}g) and size don't clearly match common e-waste patterns. Your input would help improve accuracy!",
  
  mixed: "This might be multiple items or an unusual device. The weight ({weight}g) suggests it could be several small items together. Can you help me identify what this is?",
  
  unclear: "The characteristics don't strongly match any single item type. This could be an accessory, component, or specialized device. Manual identification would be most accurate."
};
```

## 🎯 UX Copy for Different States

### Error States
```typescript
const errorMessages = {
  imageUploadFailed: {
    title: "Upload Issue",
    message: "Couldn't process your image. Try a clearer photo with good lighting.",
    action: "Try Again"
  },
  
  imageTooLarge: {
    title: "Image Too Large",
    message: "Please use an image smaller than 10MB for faster processing.",
    action: "Choose Different Image"
  },
  
  processingTimeout: {
    title: "Taking Longer Than Expected",
    message: "Our AI is working hard! This sometimes happens with complex items.",
    action: "Continue Waiting"
  },
  
  networkError: {
    title: "Connection Issue",
    message: "Check your internet connection and try again.",
    action: "Retry"
  }
};
```

### Low Confidence States
```typescript
const lowConfidenceStates = {
  needsHelp: {
    title: "I Need Your Help! 🤔",
    message: "I'm not quite sure what this is. Your expertise will help me learn!",
    actions: ["Help Me Identify", "Skip This Item"]
  },
  
  multipleOptions: {
    title: "A Few Possibilities",
    message: "I see a few options for what this might be. Which looks right?",
    actions: ["Show Options", "None of These"]
  },
  
  unusual: {
    title: "Something New!",
    message: "This doesn't match items I've seen before. What type of device is this?",
    actions: ["Tell Me More", "It's Not E-Waste"]
  }
};
```

### Success & Encouragement
```typescript
const successMessages = {
  highConfidence: {
    title: "Perfect Match! ✨",
    message: "I'm very confident about this identification. Great job recycling responsibly!",
    celebration: "🎉 Environmental hero!"
  },
  
  mediumConfidence: {
    title: "Good Match! 👍",
    message: "This looks right to me. Thanks for helping keep electronics out of landfills!",
    celebration: "🌱 Making a difference!"
  },
  
  userCorrected: {
    title: "Thanks for Teaching Me! 🧠",
    message: "Your correction helps me get better at identifying items like this.",
    celebration: "📚 Learning together!"
  }
};
```

## 🎬 Animated Scanning Flow

### Phase 1: Scanning Animation (2-3 seconds)
```typescript
const scanningStates = [
  { phase: 'initializing', duration: 500, message: 'Starting scan...' },
  { phase: 'analyzing', duration: 1000, message: 'Analyzing image...' },
  { phase: 'matching', duration: 800, message: 'Matching patterns...' },
  { phase: 'calculating', duration: 700, message: 'Calculating confidence...' }
];
```

### Phase 2: Result Reveal (1-2 seconds)
```typescript
const resultRevealStates = [
  { phase: 'found', duration: 300, animation: 'fadeIn' },
  { phase: 'details', duration: 500, animation: 'slideUp' },
  { phase: 'confidence', duration: 400, animation: 'progressBar' },
  { phase: 'explanation', duration: 600, animation: 'typewriter' }
];
```

### Phase 3: Reward Flow (3-4 seconds)
```typescript
const rewardFlowStates = [
  { phase: 'points', duration: 800, animation: 'countUp', sound: 'chime' },
  { phase: 'impact', duration: 1000, animation: 'slideIn', particles: true },
  { phase: 'celebration', duration: 1200, animation: 'confetti' },
  { phase: 'summary', duration: 1000, animation: 'fadeIn' }
];
```

## 🔄 Continuous Learning System

### Feedback Loop
```typescript
interface LearningData {
  detectionId: string;
  userCorrection?: {
    originalPrediction: string;
    correctedItem: string;
    confidence: number;
  };
  accuracyFeedback: {
    wasCorrect: boolean;
    userRating: number;        // 1-5 stars
  };
  improvementSuggestions?: string[];
}
```

This system prioritizes transparency and user trust while maintaining an engaging experience. The rule-based approach ensures predictable behavior while the feedback system enables continuous improvement.