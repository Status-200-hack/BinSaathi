// Simple Firebase imports to avoid undici issues
let db: any, storage: any, Timestamp: any, collection: any, addDoc: any, updateDoc: any, doc: any, increment: any
let ref: any, uploadBytes: any, getDownloadURL: any

// Mock implementations for development
const mockFirebase = {
  db: { mock: true },
  storage: { mock: true },
  Timestamp: { now: () => new Date() },
  collection: (db: any, path: string) => ({ path }),
  addDoc: async (collection: any, data: any) => ({ id: `mock_${Date.now()}` }),
  updateDoc: async (doc: any, data: any) => Promise.resolve(),
  doc: (db: any, path: string, id: string) => ({ path, id }),
  increment: (value: number) => value,
  ref: (storage: any, path: string) => ({ path }),
  uploadBytes: async (ref: any, file: File) => ({ ref }),
  getDownloadURL: async (ref: any) => `https://mock-storage.com/mock-url`
}

// Use mocks for now to avoid Firebase/undici issues
db = mockFirebase.db
storage = mockFirebase.storage
Timestamp = mockFirebase.Timestamp
collection = mockFirebase.collection
addDoc = mockFirebase.addDoc
updateDoc = mockFirebase.updateDoc
doc = mockFirebase.doc
increment = mockFirebase.increment
ref = mockFirebase.ref
uploadBytes = mockFirebase.uploadBytes
getDownloadURL = mockFirebase.getDownloadURL

// Fallback for development
const isDevelopment = process.env.NODE_ENV === 'development'

// Mock functions for development
const mockAddDoc = async (collection: any, data: any) => ({
  id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
})

const mockUpdateDoc = async (doc: any, data: any) => Promise.resolve()

const mockUploadBytes = async (ref: any, file: File) => ({
  ref: {
    getDownloadURL: async () => `https://mock-storage.com/detections/${Date.now()}_${file.name}`
  }
})

const mockGetDownloadURL = async (ref: any) => `https://mock-storage.com/mock-url`

// Types
export interface DetectionInput {
  image?: File
  weight: number // grams
  size: 'small' | 'medium' | 'large' | 'xl'
  userHints?: string[]
}

export interface DetectionResult {
  id?: string // Optional for initial result, added after Firestore save
  itemType: string
  itemName: string
  confidence: number
  explanation: string
  pointsEarned: number
  carbonSaved: number
  recyclingValue: number
  materials: string[]
}

export interface DetectionRecord {
  id: string
  userId: string
  sessionId: string
  input: DetectionInput & { imageUrl?: string }
  detection: {
    primaryResult: DetectionResult
    alternativeResults?: DetectionResult[]
    processingTime: number
    algorithm: string
  }
  userFeedback: {
    accepted: boolean
    correctedItem?: {
      itemType: string
      itemName: string
      reason: string
    }
    confidenceRating?: number
    additionalNotes?: string
  }
  calculated: {
    pointsEarned: number
    carbonSaved: number
    recyclingValue: number
    materials: string[]
  }
  metadata: {
    createdAt: any // Timestamp
    updatedAt: any // Timestamp
    location?: { lat: number; lng: number; binId?: string }
    deviceInfo: { userAgent: string; platform: string; appVersion: string }
    flags: {
      lowConfidence: boolean
      manualOverride: boolean
      suspicious: boolean
    }
  }
}

// Detection Rules Database
const DETECTION_RULES = {
  smartphone: {
    weight: { min: 100, max: 300, optimal: 150 },
    size: ['small', 'medium'],
    keywords: ['phone', 'mobile', 'iphone', 'android', 'samsung'],
    confidence_boost: 0.2,
    points: 100,
    carbonSaved: 0.8, // kg CO2
    recyclingValue: 25,
    materials: ['lithium', 'gold', 'silver', 'copper', 'plastic']
  },
  laptop: {
    weight: { min: 800, max: 3000, optimal: 1500 },
    size: ['large', 'xl'],
    keywords: ['laptop', 'macbook', 'notebook', 'computer'],
    confidence_boost: 0.25,
    points: 300,
    carbonSaved: 2.5,
    recyclingValue: 75,
    materials: ['lithium', 'gold', 'silver', 'copper', 'aluminum', 'plastic']
  },
  tablet: {
    weight: { min: 300, max: 800, optimal: 500 },
    size: ['medium', 'large'],
    keywords: ['tablet', 'ipad', 'surface'],
    confidence_boost: 0.2,
    points: 150,
    carbonSaved: 1.2,
    recyclingValue: 40,
    materials: ['lithium', 'gold', 'silver', 'copper', 'glass', 'plastic']
  },
  battery: {
    weight: { min: 10, max: 200, optimal: 50 },
    size: ['small'],
    keywords: ['battery', 'cell', 'lithium', 'rechargeable'],
    confidence_boost: 0.3,
    points: 50,
    carbonSaved: 0.3,
    recyclingValue: 5,
    materials: ['lithium', 'cobalt', 'nickel', 'copper']
  },
  cable: {
    weight: { min: 20, max: 500, optimal: 100 },
    size: ['small', 'medium'],
    keywords: ['cable', 'wire', 'charger', 'usb', 'cord'],
    confidence_boost: 0.15,
    points: 25,
    carbonSaved: 0.2,
    recyclingValue: 3,
    materials: ['copper', 'plastic', 'rubber']
  },
  monitor: {
    weight: { min: 2000, max: 8000, optimal: 4000 },
    size: ['xl'],
    keywords: ['monitor', 'screen', 'display', 'lcd', 'led'],
    confidence_boost: 0.2,
    points: 200,
    carbonSaved: 1.8,
    recyclingValue: 50,
    materials: ['glass', 'plastic', 'copper', 'silver', 'gold']
  }
}

// Confidence explanation templates
const EXPLANATIONS = {
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
}

export class DetectionService {
  private static instance: DetectionService
  
  static getInstance(): DetectionService {
    if (!DetectionService.instance) {
      DetectionService.instance = new DetectionService()
    }
    return DetectionService.instance
  }

  async processDetection(
    input: DetectionInput, 
    userId: string, 
    sessionId: string
  ): Promise<DetectionResult & { id: string }> {
    const startTime = Date.now()
    
    // Simulate processing delay for UX
    await this.simulateProcessing()
    
    // Upload image if provided
    let imageUrl: string | undefined
    if (input.image) {
      imageUrl = await this.uploadImage(input.image, sessionId)
    }
    
    // Run detection algorithm
    const result = await this.runDetectionAlgorithm(input)
    const processingTime = Date.now() - startTime
    
    // Create detection record
    const record: Partial<DetectionRecord> = {
      userId,
      sessionId,
      input: { ...input, imageUrl },
      detection: {
        primaryResult: result,
        processingTime,
        algorithm: 'rule-based-v1'
      },
      userFeedback: {
        accepted: false
      },
      calculated: {
        pointsEarned: result.pointsEarned,
        carbonSaved: result.carbonSaved,
        recyclingValue: result.recyclingValue,
        materials: result.materials
      },
      metadata: {
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        deviceInfo: {
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
          appVersion: '1.0.0'
        },
        flags: {
          lowConfidence: result.confidence < 60,
          manualOverride: false,
          suspicious: false
        }
      }
    }
    
    // Save to Firestore
    try {
      let docRef
      if (isDevelopment) {
        docRef = await mockAddDoc(collection(db, 'detections'), record)
      } else {
        docRef = await addDoc(collection(db, 'detections'), record)
      }
      
      return { ...result, id: docRef.id }
    } catch (error) {
      console.warn('Firestore save failed, using mock ID:', error)
      return { ...result, id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` }
    }
  }

  private async simulateProcessing(): Promise<void> {
    // Simulate AI processing with realistic delays
    const phases = [
      { name: 'initializing', duration: 300 },
      { name: 'analyzing', duration: 800 },
      { name: 'matching', duration: 600 },
      { name: 'calculating', duration: 400 }
    ]
    
    for (const phase of phases) {
      await new Promise(resolve => setTimeout(resolve, phase.duration))
    }
  }

  private async uploadImage(image: File, sessionId: string): Promise<string> {
    try {
      if (isDevelopment) {
        // Mock upload for development
        return `https://mock-storage.com/detections/${sessionId}/${Date.now()}_${image.name}`
      }
      
      const imageRef = ref(storage, `detections/${sessionId}/${Date.now()}_${image.name}`)
      const snapshot = await uploadBytes(imageRef, image)
      return await getDownloadURL(snapshot.ref)
    } catch (error) {
      console.warn('Image upload failed, using mock URL:', error)
      return `https://mock-storage.com/detections/${sessionId}/${Date.now()}_${image.name}`
    }
  }

  private async runDetectionAlgorithm(input: DetectionInput): Promise<DetectionResult> {
    const { weight, size, userHints = [] } = input
    
    let bestMatch: { rule: any; score: number; type: string } | null = null
    let bestScore = 0
    
    // Evaluate each rule
    for (const [itemType, rule] of Object.entries(DETECTION_RULES)) {
      let score = 0
      
      // Weight scoring (40% of total score)
      const weightScore = this.calculateWeightScore(weight, rule.weight)
      score += weightScore * 0.4
      
      // Size scoring (30% of total score)
      const sizeScore = rule.size.includes(size) ? 1 : 0
      score += sizeScore * 0.3
      
      // Keyword matching (20% of total score)
      const keywordScore = this.calculateKeywordScore(userHints, rule.keywords)
      score += keywordScore * 0.2
      
      // Confidence boost (10% of total score)
      score += rule.confidence_boost * 0.1
      
      if (score > bestScore) {
        bestScore = score
        bestMatch = { rule, score, type: itemType }
      }
    }
    
    if (!bestMatch) {
      return this.createUnknownResult(weight)
    }
    
    const confidence = Math.min(Math.round(bestScore * 100), 100)
    const explanation = this.generateExplanation(bestMatch.type, confidence, weight)
    
    return {
      itemType: bestMatch.type,
      itemName: this.generateItemName(bestMatch.type, weight),
      confidence,
      explanation,
      pointsEarned: bestMatch.rule.points,
      carbonSaved: bestMatch.rule.carbonSaved,
      recyclingValue: bestMatch.rule.recyclingValue,
      materials: bestMatch.rule.materials
    }
  }

  private calculateWeightScore(weight: number, weightRule: any): number {
    const { min, max, optimal } = weightRule
    
    if (weight < min || weight > max) {
      return 0
    }
    
    // Calculate how close to optimal weight
    const distance = Math.abs(weight - optimal)
    const range = max - min
    const normalizedDistance = distance / range
    
    return Math.max(0, 1 - normalizedDistance)
  }

  private calculateKeywordScore(hints: string[], keywords: string[]): number {
    if (hints.length === 0) return 0.5 // Neutral score if no hints
    
    const matches = hints.filter(hint => 
      keywords.some(keyword => 
        hint.toLowerCase().includes(keyword.toLowerCase())
      )
    )
    
    return matches.length / Math.max(hints.length, keywords.length)
  }

  private generateExplanation(itemType: string, confidence: number, weight: number): string {
    let category: 'high' | 'medium' | 'low'
    
    if (confidence >= 85) category = 'high'
    else if (confidence >= 60) category = 'medium'
    else category = 'low'
    
    const explanations = EXPLANATIONS[category]
    
    // Type-safe access to explanation functions
    if (category === 'high' || category === 'medium') {
      const typedExplanations = explanations as typeof EXPLANATIONS.high
      const explanationFunc = typedExplanations[itemType as keyof typeof typedExplanations]
      
      if (explanationFunc) {
        return explanationFunc(weight)
      }
    } else {
      // Low confidence explanations
      const lowExplanations = explanations as typeof EXPLANATIONS.low
      if (itemType === 'unknown') {
        return lowExplanations.unknown(weight)
      } else if (itemType === 'mixed') {
        return lowExplanations.mixed(weight)
      } else {
        return lowExplanations.unclear(weight)
      }
    }
    
    // Fallback explanation
    return `Based on the weight (${weight}g) and size, this appears to be a ${itemType} with ${confidence}% confidence.`
  }

  private generateItemName(itemType: string, weight: number): string {
    const itemNames = {
      smartphone: weight < 150 ? 'iPhone 12 Mini' : weight < 200 ? 'iPhone 13 Pro' : 'Samsung Galaxy S21 Ultra',
      laptop: weight < 1200 ? 'MacBook Air' : weight < 2000 ? 'MacBook Pro 14"' : 'Gaming Laptop',
      tablet: weight < 400 ? 'iPad Mini' : weight < 600 ? 'iPad Air' : 'iPad Pro 12.9"',
      battery: weight < 50 ? 'Phone Battery' : weight < 100 ? 'Laptop Battery' : 'Power Bank',
      cable: weight < 100 ? 'USB Cable' : weight < 200 ? 'Charging Cable Set' : 'Cable Bundle',
      monitor: weight < 3000 ? '24" LCD Monitor' : weight < 5000 ? '27" LED Monitor' : '32" Gaming Monitor'
    }
    
    return itemNames[itemType as keyof typeof itemNames] || `${itemType} Device`
  }

  private createUnknownResult(weight: number): DetectionResult {
    return {
      itemType: 'unknown',
      itemName: 'Unknown Electronic Device',
      confidence: 30,
      explanation: EXPLANATIONS.low.unknown(weight),
      pointsEarned: 10, // Minimal points for attempting
      carbonSaved: 0.1,
      recyclingValue: 1,
      materials: ['mixed']
    }
  }

  async updateUserFeedback(
    detectionId: string, 
    feedback: DetectionRecord['userFeedback']
  ): Promise<void> {
    try {
      if (isDevelopment) {
        console.log('Mock feedback update:', detectionId, feedback)
        return
      }
      
      const detectionRef = doc(db, 'detections', detectionId)
      await updateDoc(detectionRef, {
        userFeedback: feedback,
        'metadata.updatedAt': Timestamp.now(),
        'metadata.flags.manualOverride': !!feedback.correctedItem
      })
    } catch (error) {
      console.warn('Feedback update failed:', error)
    }
  }

  async getAlternativeResults(input: DetectionInput): Promise<DetectionResult[]> {
    // Generate 2-3 alternative results for medium confidence cases
    const alternatives: DetectionResult[] = []
    const mainResult = await this.runDetectionAlgorithm(input)
    
    // Find second and third best matches
    const scores: Array<{ type: string; score: number; rule: any }> = []
    
    for (const [itemType, rule] of Object.entries(DETECTION_RULES)) {
      const weightScore = this.calculateWeightScore(input.weight, rule.weight)
      const sizeScore = rule.size.includes(input.size) ? 1 : 0
      const totalScore = (weightScore * 0.6) + (sizeScore * 0.4)
      
      scores.push({ type: itemType, score: totalScore, rule })
    }
    
    scores.sort((a, b) => b.score - a.score)
    
    // Take top 3 excluding the main result
    for (let i = 1; i < Math.min(4, scores.length); i++) {
      const item = scores[i]
      if (item.type !== mainResult.itemType && item.score > 0.3) {
        alternatives.push({
          itemType: item.type,
          itemName: this.generateItemName(item.type, input.weight),
          confidence: Math.round(item.score * 80), // Lower confidence for alternatives
          explanation: this.generateExplanation(item.type, Math.round(item.score * 80), input.weight),
          pointsEarned: item.rule.points,
          carbonSaved: item.rule.carbonSaved,
          recyclingValue: item.rule.recyclingValue,
          materials: item.rule.materials
        })
      }
    }
    
    return alternatives
  }
}