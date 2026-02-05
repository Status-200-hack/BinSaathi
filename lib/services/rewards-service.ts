// Gamified Recycling Rewards System

export interface WasteTypeReward {
  basePoints: number
  co2SavedKg: number
  materialsRecovered: string[]
  recyclingValueUSD: number
  difficultyMultiplier: number
  rarityBonus: number
}

// Points Logic Per Waste Type
export const WASTE_TYPE_REWARDS: Record<string, WasteTypeReward> = {
  smartphone: {
    basePoints: 100,
    co2SavedKg: 0.8,
    materialsRecovered: ['gold', 'silver', 'copper', 'lithium', 'rare_earth'],
    recyclingValueUSD: 25,
    difficultyMultiplier: 1.2, // Harder to recycle properly
    rarityBonus: 10 // Common item, small bonus
  },
  
  laptop: {
    basePoints: 300,
    co2SavedKg: 2.5,
    materialsRecovered: ['gold', 'silver', 'copper', 'aluminum', 'lithium', 'rare_earth'],
    recyclingValueUSD: 75,
    difficultyMultiplier: 1.5,
    rarityBonus: 25
  },
  
  tablet: {
    basePoints: 150,
    co2SavedKg: 1.2,
    materialsRecovered: ['gold', 'silver', 'copper', 'lithium', 'glass'],
    recyclingValueUSD: 40,
    difficultyMultiplier: 1.3,
    rarityBonus: 15
  },
  
  battery: {
    basePoints: 75,
    co2SavedKg: 0.4,
    materialsRecovered: ['lithium', 'cobalt', 'nickel', 'copper'],
    recyclingValueUSD: 8,
    difficultyMultiplier: 2.0, // High environmental impact if not recycled
    rarityBonus: 30 // High bonus for proper disposal
  },
  
  cable: {
    basePoints: 25,
    co2SavedKg: 0.2,
    materialsRecovered: ['copper', 'plastic'],
    recyclingValueUSD: 3,
    difficultyMultiplier: 0.8, // Easy to recycle
    rarityBonus: 5
  },
  
  monitor: {
    basePoints: 200,
    co2SavedKg: 1.8,
    materialsRecovered: ['glass', 'plastic', 'copper', 'silver'],
    recyclingValueUSD: 50,
    difficultyMultiplier: 1.4,
    rarityBonus: 20
  },
  
  // Special/Rare Items
  gaming_console: {
    basePoints: 250,
    co2SavedKg: 2.0,
    materialsRecovered: ['gold', 'silver', 'copper', 'aluminum'],
    recyclingValueUSD: 60,
    difficultyMultiplier: 1.3,
    rarityBonus: 50 // Rare item bonus
  },
  
  server_equipment: {
    basePoints: 500,
    co2SavedKg: 4.0,
    materialsRecovered: ['gold', 'silver', 'copper', 'aluminum', 'rare_earth'],
    recyclingValueUSD: 150,
    difficultyMultiplier: 1.8,
    rarityBonus: 100 // Very rare, high bonus
  }
}

// Environmental Impact Calculation
export interface EnvironmentalImpact {
  co2SavedKg: number
  co2SavedEquivalent: string // Human-readable equivalent
  materialsRecovered: {
    material: string
    amountGrams: number
    value: string // Human-readable value
  }[]
  energySavedKwh: number
  waterSavedLiters: number
  treesEquivalent: number
}

export class RewardsCalculator {
  static calculateReward(
    wasteType: string, 
    weight: number, 
    condition: 'working' | 'damaged' | 'broken' | 'unknown' = 'unknown',
    userLevel: number = 1
  ): {
    points: number
    environmentalImpact: EnvironmentalImpact
    bonuses: { type: string; amount: number; reason: string }[]
  } {
    const baseReward = WASTE_TYPE_REWARDS[wasteType] || WASTE_TYPE_REWARDS.cable
    
    // Base points calculation
    let points = baseReward.basePoints
    
    // Weight adjustment (heavier items = more materials)
    const weightMultiplier = this.getWeightMultiplier(wasteType, weight)
    points *= weightMultiplier
    
    // Condition bonus
    const conditionMultiplier = this.getConditionMultiplier(condition)
    points *= conditionMultiplier
    
    // Difficulty multiplier
    points *= baseReward.difficultyMultiplier
    
    // User level bonus (1% per level)
    const levelBonus = Math.floor(points * (userLevel - 1) * 0.01)
    points += levelBonus
    
    // Rarity bonus
    points += baseReward.rarityBonus
    
    // Round to nearest 5 for clean numbers
    points = Math.round(points / 5) * 5
    
    // Calculate environmental impact
    const environmentalImpact = this.calculateEnvironmentalImpact(
      baseReward, 
      weightMultiplier
    )
    
    // Calculate bonuses for display
    const bonuses = this.calculateBonuses(
      baseReward,
      condition,
      userLevel,
      weightMultiplier
    )
    
    return { points, environmentalImpact, bonuses }
  }
  
  private static getWeightMultiplier(wasteType: string, weight: number): number {
    // Expected weights for different items
    const expectedWeights: Record<string, number> = {
      smartphone: 150,
      laptop: 1500,
      tablet: 500,
      battery: 50,
      cable: 100,
      monitor: 4000,
      gaming_console: 2000,
      server_equipment: 8000
    }
    
    const expected = expectedWeights[wasteType] || 100
    const ratio = weight / expected
    
    // Cap the multiplier between 0.5x and 2x
    return Math.max(0.5, Math.min(2.0, ratio))
  }
  
  private static getConditionMultiplier(condition: string): number {
    const multipliers = {
      working: 1.3,    // 30% bonus for working items (can be refurbished)
      damaged: 1.1,    // 10% bonus for damaged items
      broken: 1.0,     // Base points for broken items
      unknown: 1.05    // 5% bonus for trying
    }
    
    return multipliers[condition as keyof typeof multipliers] || 1.0
  }
  
  private static calculateEnvironmentalImpact(
    baseReward: WasteTypeReward,
    weightMultiplier: number
  ): EnvironmentalImpact {
    const co2SavedKg = baseReward.co2SavedKg * weightMultiplier
    
    return {
      co2SavedKg,
      co2SavedEquivalent: this.getCO2Equivalent(co2SavedKg),
      materialsRecovered: this.getMaterialsRecovered(baseReward, weightMultiplier),
      energySavedKwh: co2SavedKg * 2.5, // Rough conversion
      waterSavedLiters: co2SavedKg * 50, // Rough conversion
      treesEquivalent: Math.round(co2SavedKg * 0.05 * 100) / 100 // Trees needed to absorb CO2
    }
  }
  
  private static getCO2Equivalent(co2Kg: number): string {
    if (co2Kg < 0.5) return `${Math.round(co2Kg * 1000)}g - like a short car trip`
    if (co2Kg < 2) return `${co2Kg.toFixed(1)}kg - like charging your phone for a year`
    if (co2Kg < 5) return `${co2Kg.toFixed(1)}kg - like a tree absorbs in a month`
    if (co2Kg < 10) return `${co2Kg.toFixed(1)}kg - like driving 25 miles`
    return `${co2Kg.toFixed(1)}kg - like planting ${Math.round(co2Kg * 0.05)} trees`
  }
  
  private static getMaterialsRecovered(
    baseReward: WasteTypeReward,
    weightMultiplier: number
  ): EnvironmentalImpact['materialsRecovered'] {
    const materialValues: Record<string, { grams: number; value: string }> = {
      gold: { grams: 0.3 * weightMultiplier, value: 'worth $0.02' },
      silver: { grams: 2.0 * weightMultiplier, value: 'worth $0.15' },
      copper: { grams: 15.0 * weightMultiplier, value: 'worth $0.12' },
      lithium: { grams: 5.0 * weightMultiplier, value: 'for new batteries' },
      aluminum: { grams: 25.0 * weightMultiplier, value: 'for new products' },
      rare_earth: { grams: 1.0 * weightMultiplier, value: 'very valuable' },
      plastic: { grams: 50.0 * weightMultiplier, value: 'for new items' },
      glass: { grams: 100.0 * weightMultiplier, value: 'for new screens' },
      cobalt: { grams: 3.0 * weightMultiplier, value: 'for batteries' },
      nickel: { grams: 8.0 * weightMultiplier, value: 'for batteries' }
    }
    
    return baseReward.materialsRecovered.map(material => ({
      material,
      amountGrams: Math.round(materialValues[material]?.grams || 1),
      value: materialValues[material]?.value || 'recyclable'
    }))
  }
  
  private static calculateBonuses(
    baseReward: WasteTypeReward,
    condition: string,
    userLevel: number,
    weightMultiplier: number
  ): { type: string; amount: number; reason: string }[] {
    const bonuses = []
    
    // Condition bonus
    if (condition === 'working') {
      bonuses.push({
        type: 'condition',
        amount: Math.round(baseReward.basePoints * 0.3),
        reason: 'Working device - can be refurbished!'
      })
    } else if (condition === 'damaged') {
      bonuses.push({
        type: 'condition',
        amount: Math.round(baseReward.basePoints * 0.1),
        reason: 'Damaged but repairable'
      })
    }
    
    // Level bonus
    if (userLevel > 1) {
      bonuses.push({
        type: 'level',
        amount: Math.round(baseReward.basePoints * (userLevel - 1) * 0.01),
        reason: `Level ${userLevel} eco-warrior bonus`
      })
    }
    
    // Weight bonus
    if (weightMultiplier > 1.2) {
      bonuses.push({
        type: 'weight',
        amount: Math.round(baseReward.basePoints * 0.2),
        reason: 'Heavy item - more materials recovered'
      })
    }
    
    // Rarity bonus
    if (baseReward.rarityBonus > 20) {
      bonuses.push({
        type: 'rarity',
        amount: baseReward.rarityBonus,
        reason: 'Rare item bonus!'
      })
    }
    
    return bonuses
  }
}

// Achievement System
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'recycling' | 'environmental' | 'social' | 'milestone'
  requirements: {
    type: 'points' | 'items' | 'co2' | 'streak' | 'variety'
    target: number
    current?: number
  }
  reward: {
    points: number
    badge: string
    title?: string
  }
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: Date
}

export const ACHIEVEMENTS: Achievement[] = [
  // Beginner Achievements
  {
    id: 'first_recycle',
    title: 'First Steps',
    description: 'Recycle your first electronic device',
    icon: 'eco',
    category: 'milestone',
    requirements: { type: 'items', target: 1 },
    reward: { points: 50, badge: '🌱', title: 'Eco Beginner' },
    rarity: 'common'
  },
  
  {
    id: 'phone_recycler',
    title: 'Phone Saver',
    description: 'Recycle 5 smartphones',
    icon: 'smartphone',
    category: 'recycling',
    requirements: { type: 'items', target: 5 },
    reward: { points: 200, badge: '📱' },
    rarity: 'common'
  },
  
  // Environmental Impact
  {
    id: 'co2_saver_1kg',
    title: 'Carbon Cutter',
    description: 'Save 1kg of CO2 emissions',
    icon: 'cloud_off',
    category: 'environmental',
    requirements: { type: 'co2', target: 1 },
    reward: { points: 100, badge: '☁️' },
    rarity: 'common'
  },
  
  {
    id: 'co2_saver_10kg',
    title: 'Climate Hero',
    description: 'Save 10kg of CO2 emissions',
    icon: 'public',
    category: 'environmental',
    requirements: { type: 'co2', target: 10 },
    reward: { points: 500, badge: '🌍', title: 'Climate Hero' },
    rarity: 'rare'
  },
  
  // Streak Achievements
  {
    id: 'streak_3',
    title: 'Getting Started',
    description: 'Recycle for 3 days in a row',
    icon: 'local_fire_department',
    category: 'social',
    requirements: { type: 'streak', target: 3 },
    reward: { points: 150, badge: '🔥' },
    rarity: 'common'
  },
  
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Recycle for 7 days in a row',
    icon: 'whatshot',
    category: 'social',
    requirements: { type: 'streak', target: 7 },
    reward: { points: 350, badge: '🔥🔥' },
    rarity: 'rare'
  },
  
  // Milestone Achievements
  {
    id: 'points_1000',
    title: 'Point Collector',
    description: 'Earn 1,000 total points',
    icon: 'stars',
    category: 'milestone',
    requirements: { type: 'points', target: 1000 },
    reward: { points: 200, badge: '⭐' },
    rarity: 'common'
  },
  
  {
    id: 'points_10000',
    title: 'Eco Champion',
    description: 'Earn 10,000 total points',
    icon: 'military_tech',
    category: 'milestone',
    requirements: { type: 'points', target: 10000 },
    reward: { points: 1000, badge: '🏆', title: 'Eco Champion' },
    rarity: 'epic'
  },
  
  // Variety Achievements
  {
    id: 'variety_5',
    title: 'Variety Recycler',
    description: 'Recycle 5 different types of devices',
    icon: 'category',
    category: 'recycling',
    requirements: { type: 'variety', target: 5 },
    reward: { points: 300, badge: '🎯' },
    rarity: 'rare'
  },
  
  // Legendary Achievements
  {
    id: 'eco_legend',
    title: 'Eco Legend',
    description: 'Recycle 100 devices and save 50kg CO2',
    icon: 'workspace_premium',
    category: 'milestone',
    requirements: { type: 'items', target: 100 },
    reward: { points: 5000, badge: '👑', title: 'Eco Legend' },
    rarity: 'legendary'
  }
]

// User Level System
export interface UserLevel {
  level: number
  title: string
  minPoints: number
  maxPoints: number
  benefits: string[]
  badge: string
}

export const USER_LEVELS: UserLevel[] = [
  {
    level: 1,
    title: 'Eco Beginner',
    minPoints: 0,
    maxPoints: 499,
    benefits: ['Welcome bonus: +10% points'],
    badge: '🌱'
  },
  {
    level: 2,
    title: 'Green Helper',
    minPoints: 500,
    maxPoints: 1499,
    benefits: ['Bonus: +15% points', 'Early access to challenges'],
    badge: '🌿'
  },
  {
    level: 3,
    title: 'Eco Warrior',
    minPoints: 1500,
    maxPoints: 3999,
    benefits: ['Bonus: +20% points', 'Priority support', 'Special rewards'],
    badge: '🛡️'
  },
  {
    level: 4,
    title: 'Green Guardian',
    minPoints: 4000,
    maxPoints: 9999,
    benefits: ['Bonus: +25% points', 'Exclusive challenges', 'Community features'],
    badge: '🌟'
  },
  {
    level: 5,
    title: 'Eco Champion',
    minPoints: 10000,
    maxPoints: 24999,
    benefits: ['Bonus: +30% points', 'VIP support', 'Beta features'],
    badge: '🏆'
  },
  {
    level: 6,
    title: 'Planet Protector',
    minPoints: 25000,
    maxPoints: 49999,
    benefits: ['Bonus: +35% points', 'Mentor program', 'Special events'],
    badge: '🌍'
  },
  {
    level: 7,
    title: 'Eco Legend',
    minPoints: 50000,
    maxPoints: Infinity,
    benefits: ['Bonus: +40% points', 'Hall of fame', 'Ultimate rewards'],
    badge: '👑'
  }
]

export function getUserLevel(totalPoints: number): UserLevel {
  return USER_LEVELS.find(level => 
    totalPoints >= level.minPoints && totalPoints <= level.maxPoints
  ) || USER_LEVELS[0]
}

export function getProgressToNextLevel(totalPoints: number): {
  currentLevel: UserLevel
  nextLevel: UserLevel | null
  progress: number
  pointsNeeded: number
} {
  const currentLevel = getUserLevel(totalPoints)
  const nextLevel = USER_LEVELS.find(level => level.level === currentLevel.level + 1) || null
  
  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      progress: 100,
      pointsNeeded: 0
    }
  }
  
  const pointsInCurrentLevel = totalPoints - currentLevel.minPoints
  const pointsNeededForLevel = nextLevel.minPoints - currentLevel.minPoints
  const progress = Math.round((pointsInCurrentLevel / pointsNeededForLevel) * 100)
  const pointsNeeded = nextLevel.minPoints - totalPoints
  
  return {
    currentLevel,
    nextLevel,
    progress,
    pointsNeeded
  }
}