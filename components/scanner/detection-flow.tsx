'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DetectionService, DetectionInput, DetectionResult } from '@/lib/services/detection-service'
import { cn } from '@/lib/utils'

interface DetectionFlowProps {
  onComplete: (result: DetectionResult & { id: string }) => void
  onCancel: () => void
}

type FlowStep = 'input' | 'scanning' | 'result' | 'confirmation' | 'alternatives'

const SCANNING_PHASES = [
  { phase: 'initializing', message: 'Starting scan...', duration: 500 },
  { phase: 'analyzing', message: 'Analyzing image...', duration: 1000 },
  { phase: 'matching', message: 'Matching patterns...', duration: 800 },
  { phase: 'calculating', message: 'Calculating confidence...', duration: 700 }
]

const SIZE_OPTIONS = [
  { 
    value: 'small', 
    label: 'Small', 
    description: '<100cm³',
    examples: 'Phone, cables, batteries',
    icon: 'smartphone'
  },
  { 
    value: 'medium', 
    label: 'Medium', 
    description: '100-500cm³',
    examples: 'Tablet, small laptop',
    icon: 'tablet_mac'
  },
  { 
    value: 'large', 
    label: 'Large', 
    description: '500-2000cm³',
    examples: 'Laptop, desktop monitor',
    icon: 'laptop_mac'
  },
  { 
    value: 'xl', 
    label: 'Extra Large', 
    description: '>2000cm³',
    examples: 'Desktop PC, large appliances',
    icon: 'desktop_windows'
  }
] as const

export function DetectionFlow({ onComplete, onCancel }: DetectionFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('input')
  const [input, setInput] = useState<DetectionInput>({
    weight: 150,
    size: 'small',
    userHints: []
  })
  const [result, setResult] = useState<(DetectionResult & { id: string }) | null>(null)
  const [alternatives, setAlternatives] = useState<DetectionResult[]>([])
  const [scanningPhase, setScanningPhase] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const detectionService = DetectionService.getInstance()

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setInput(prev => ({ ...prev, image: file }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleWeightChange = useCallback((value: number) => {
    setInput(prev => ({ ...prev, weight: value }))
  }, [])

  const handleSizeChange = useCallback((size: DetectionInput['size']) => {
    setInput(prev => ({ ...prev, size }))
  }, [])

  const handleHintsChange = useCallback((hints: string) => {
    const hintsArray = hints.split(',').map(h => h.trim()).filter(Boolean)
    setInput(prev => ({ ...prev, userHints: hintsArray }))
  }, [])

  const startDetection = async () => {
    setIsProcessing(true)
    setCurrentStep('scanning')
    setScanningPhase(0)

    // Animate through scanning phases
    for (let i = 0; i < SCANNING_PHASES.length; i++) {
      setScanningPhase(i)
      await new Promise(resolve => setTimeout(resolve, SCANNING_PHASES[i].duration))
    }

    try {
      const detectionResult = await detectionService.processDetection(
        input,
        'user-123', // TODO: Get from auth
        `session-${Date.now()}`
      )

      setResult(detectionResult)

      // Get alternatives for medium confidence results
      if (detectionResult.confidence >= 60 && detectionResult.confidence < 85) {
        const alts = await detectionService.getAlternativeResults(input)
        setAlternatives(alts)
        setCurrentStep('alternatives')
      } else if (detectionResult.confidence < 60) {
        setCurrentStep('confirmation')
      } else {
        setCurrentStep('result')
      }
    } catch (error) {
      console.error('Detection failed:', error)
      // Handle error state
    } finally {
      setIsProcessing(false)
    }
  }

  const confirmResult = async (confirmed: boolean, correctedItem?: string) => {
    if (!result) return

    await detectionService.updateUserFeedback(result.id, {
      accepted: confirmed,
      correctedItem: correctedItem ? {
        itemType: correctedItem,
        itemName: correctedItem,
        reason: 'User correction'
      } : undefined
    })

    onComplete(result)
  }

  const selectAlternative = (alternative: DetectionResult) => {
    if (result) {
      setResult({ ...alternative, id: result.id })
      setCurrentStep('result')
    }
  }

  if (currentStep === 'input') {
    return (
      <div className="space-y-6">
        {/* Image Upload */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">
            📸 Add Photo (Optional)
          </h3>
          
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-center">
                  <span className="material-symbols-outlined text-4xl text-stone-400 mb-2">
                    add_a_photo
                  </span>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    Tap to add photo for better accuracy
                  </p>
                </div>
              )}
            </label>
          </div>
        </Card>

        {/* Weight Input */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">
            ⚖️ Estimated Weight
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500 dark:text-stone-400">0g</span>
              <span className="text-lg font-bold text-primary">{input.weight}g</span>
              <span className="text-sm text-stone-500 dark:text-stone-400">5000g</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="5000"
              step="10"
              value={input.weight}
              onChange={(e) => handleWeightChange(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer slider"
            />
            
            <div className="grid grid-cols-4 gap-2 text-xs text-stone-500 dark:text-stone-400">
              <button
                onClick={() => handleWeightChange(50)}
                className="p-2 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                Light (50g)
              </button>
              <button
                onClick={() => handleWeightChange(150)}
                className="p-2 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                Phone (150g)
              </button>
              <button
                onClick={() => handleWeightChange(500)}
                className="p-2 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                Tablet (500g)
              </button>
              <button
                onClick={() => handleWeightChange(1500)}
                className="p-2 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                Laptop (1.5kg)
              </button>
            </div>
          </div>
        </Card>

        {/* Size Selection */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">
            📏 Size Category
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {SIZE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSizeChange(option.value)}
                className={cn(
                  'p-4 rounded-xl border-2 text-left transition-all',
                  input.size === option.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-xl">
                    {option.icon}
                  </span>
                  <span className="font-bold">{option.label}</span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">
                  {option.description}
                </p>
                <p className="text-xs text-stone-400 dark:text-stone-500">
                  {option.examples}
                </p>
              </button>
            ))}
          </div>
        </Card>

        {/* Optional Hints */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">
            💡 Additional Hints (Optional)
          </h3>
          
          <input
            type="text"
            placeholder="e.g., iPhone, MacBook, Samsung, old, broken"
            className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark"
            onChange={(e) => handleHintsChange(e.target.value)}
          />
          
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
            Separate multiple hints with commas
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={startDetection} className="flex-1" disabled={isProcessing}>
            <span className="material-symbols-outlined mr-2">search</span>
            Start Detection
          </Button>
        </div>
      </div>
    )
  }

  if (currentStep === 'scanning') {
    const currentPhase = SCANNING_PHASES[scanningPhase]
    
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        {/* Scanning Animation */}
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-4 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-4xl">
              psychology
            </span>
          </div>
        </div>

        {/* Phase Message */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
            AI Detection in Progress
          </h3>
          <p className="text-primary font-medium animate-pulse">
            {currentPhase.message}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs">
          <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${((scanningPhase + 1) / SCANNING_PHASES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'result' && result) {
    return (
      <div className="space-y-6">
        {/* Confidence Badge */}
        <div className="text-center">
          <div className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold',
            result.confidence >= 85 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : result.confidence >= 60
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          )}>
            <span className="material-symbols-outlined text-lg">
              {result.confidence >= 85 ? 'verified' : result.confidence >= 60 ? 'help' : 'warning'}
            </span>
            {result.confidence}% Confidence
          </div>
        </div>

        {/* Result Card */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">
                {result.itemType === 'smartphone' ? 'smartphone' :
                 result.itemType === 'laptop' ? 'laptop_mac' :
                 result.itemType === 'tablet' ? 'tablet_mac' :
                 result.itemType === 'battery' ? 'battery_charging_full' :
                 result.itemType === 'cable' ? 'cable' :
                 'devices'}
              </span>
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-1">
                {result.itemName}
              </h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm mb-3">
                {result.explanation}
              </p>
              
              {/* Impact Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-primary">+{result.pointsEarned}</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">Points</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {result.carbonSaved}kg
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">CO₂ Saved</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ${result.recyclingValue}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">Value</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Materials */}
        <Card className="p-4">
          <h4 className="font-bold text-text-light dark:text-text-dark mb-2">
            Recoverable Materials
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.materials.map((material) => (
              <span
                key={material}
                className="px-2 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs rounded-full"
              >
                {material}
              </span>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setCurrentStep('input')} className="flex-1">
            Try Again
          </Button>
          <Button onClick={() => confirmResult(true)} className="flex-1">
            <span className="material-symbols-outlined mr-2">check_circle</span>
            Confirm & Recycle
          </Button>
        </div>
      </div>
    )
  }

  // Add other steps (alternatives, confirmation) here...
  
  return null
}

// CSS for custom slider styling
const sliderStyles = `
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #f9a406;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #f9a406;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = sliderStyles
  document.head.appendChild(styleSheet)
}