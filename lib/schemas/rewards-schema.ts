// Reward System Schema

// User Profile & Stats
export interface UserProfile {
  id: string // User ID from auth
  displayName: string
  email: string
  avatar?: string
  
  // Level & Progress
  level: {
    current: number
    title: string
    totalPoints: number
    pointsToNext: number
    progressPercent: number
    badge: string
  }
  
  // Lifetime Stats
  stats: {
    totalItems: number
    totalPoints: number
    totalCO2SavedKg: number
    totalRecyclingValueUSD: number
    currentStreak: number
    longestStreak: number
    daysActive: number
    
    // Item type breakdown
    itemTypes: {
      [itemType: string]: {
        count: number
        points: number
        co2SavedKg: number
      }
    }
    
    // Monthly stats for trends
    monthlyStats: {
      [monthKey: string]: { // Format: "2024-12"
        items: number
        points: number
        co2SavedKg: number
      }
    }
  }
  
  // Achievements
  achievements: {
    unlocked: string[] // Achievement IDs
    progress: {
      [achievementId: string]: {
        current: number
        target: number
        percentage: number
      }
    }
  }
  
  // Preferences
  preferences: {
    notifications: boolean
    celebrationStyle: 'full' | 'minimal' | 'none'
    shareStats: boolean
    language: string
  }
  
  // Metadata
  createdAt: string
  updatedAt: string
  lastActiveAt: string
}

// Individual Recycling Transaction
export interface RecyclingTransaction {
  id: string
  userId: string
  
  // Item Details
  item: {
    type: string // smartphone, laptop, etc.
    name: string // iPhone 11 Pro, MacBook Air, etc.
    weight: number // grams
    condition: 'working' | 'damaged' | 'broken' | 'unknown'
    imageUrl?: string
  }
  
  // Rewards Earned
  rewards: {
    basePoints: number
    bonusPoints: number
    totalPoints: number
    
    bonuses: Array<{
      type: string // 'condition', 'level', 'weight', 'rarity'
      amount: number
      reason: string
    }>
  }
  
  // Environmental Impact
  impact: {
    co2SavedKg: number
    co2Equivalent: string // Human-readable
    materialsRecovered: Array<{
      material: string
      amountGrams: number
      value: string
    }>
    energySavedKwh: number
    waterSavedLiters: number
    treesEquivalent: number
  }
  
  // Location & Context
  location?: {
    binId: string
    binName: string
    lat: number
    lng: number
    address: string
  }
  
  // Achievement Unlocks
  achievementsUnlocked: Array<{
    achievementId: string
    title: string
    badge: string
    pointsAwarded: number
  }>
  
  // Level Progress
  levelProgress: {
    levelBefore: number
    levelAfter: number
    leveledUp: boolean
    pointsBefore: number
    pointsAfter: number
  }
  
  // Metadata
  createdAt: string
  celebrationViewed: boolean
  shareCount: number
}

// Achievement Progress Tracking
export interface AchievementProgress {
  userId: string
  achievementId: string
  
  // Progress
  current: number
  target: number
  percentage: number
  completed: boolean
  
  // Tracking Data
  trackingData: {
    [key: string]: any // Flexible data for different achievement types
  }
  
  // Completion
  completedAt?: string
  notificationSent: boolean
  
  // Metadata
  createdAt: string
  updatedAt: string
}

// Daily/Weekly Challenges
export interface Challenge {
  id: string
  title: string
  description: string
  icon: string
  
  // Challenge Details
  type: 'daily' | 'weekly' | 'monthly' | 'special'
  difficulty: 'easy' | 'medium' | 'hard'
  
  // Requirements
  requirements: {
    type: 'items' | 'points' | 'co2' | 'variety'
    target: number
    itemTypes?: string[] // For specific item challenges
  }
  
  // Rewards
  rewards: {
    points: number
    badge?: string
    specialReward?: string
  }
  
  // Timing
  startDate: string
  endDate: string
  
  // Participation
  participants: number
  completions: number
  
  // Status
  active: boolean
  featured: boolean
}

// User Challenge Progress
export interface UserChallengeProgress {
  userId: string
  challengeId: string
  
  // Progress
  current: number
  target: number
  percentage: number
  completed: boolean
  
  // Completion
  completedAt?: string
  rewardsClaimed: boolean
  
  // Metadata
  startedAt: string
  updatedAt: string
}

// Leaderboard Entry
export interface LeaderboardEntry {
  userId: string
  displayName: string
  avatar?: string
  
  // Stats for ranking
  totalPoints: number
  totalItems: number
  totalCO2SavedKg: number
  currentStreak: number
  
  // Ranking
  rank: number
  previousRank?: number
  
  // Time period
  period: 'daily' | 'weekly' | 'monthly' | 'allTime'
  periodStart: string
  periodEnd: string
  
  // Metadata
  updatedAt: string
}

// Reward Redemption
export interface RewardRedemption {
  id: string
  userId: string
  
  // Reward Details
  reward: {
    id: string
    title: string
    description: string
    type: 'discount' | 'voucher' | 'physical' | 'digital'
    value: number
    pointsCost: number
  }
  
  // Redemption
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'expired'
  redemptionCode?: string
  
  // Delivery (for physical rewards)
  shipping?: {
    address: string
    trackingNumber?: string
    carrier?: string
  }
  
  // Metadata
  redeemedAt: string
  expiresAt?: string
  updatedAt: string
}

// Social Features
export interface SocialActivity {
  id: string
  userId: string
  type: 'achievement' | 'level_up' | 'milestone' | 'challenge_complete'
  
  // Activity Details
  activity: {
    title: string
    description: string
    icon: string
    points?: number
    badge?: string
  }
  
  // Social Data
  likes: number
  comments: number
  shares: number
  
  // Privacy
  visibility: 'public' | 'friends' | 'private'
  
  // Metadata
  createdAt: string
}

// Analytics & Insights
export interface UserInsights {
  userId: string
  period: string // "2024-12" for monthly
  
  // Performance
  performance: {
    itemsRecycled: number
    pointsEarned: number
    co2SavedKg: number
    rank: number
    improvement: number // Percentage change from previous period
  }
  
  // Patterns
  patterns: {
    mostActiveDay: string
    favoriteItemType: string
    averageItemsPerWeek: number
    streakTrend: 'improving' | 'stable' | 'declining'
  }
  
  // Goals
  goals: {
    suggested: {
      items: number
      points: number
      co2: number
    }
    progress: {
      items: number
      points: number
      co2: number
    }
  }
  
  // Achievements
  achievementsSummary: {
    unlocked: number
    available: number
    nearCompletion: Array<{
      id: string
      title: string
      progress: number
    }>
  }
  
  // Metadata
  generatedAt: string
}

// Collection Structure
export const COLLECTIONS = {
  // User data
  users: 'users', // UserProfile documents
  
  // Recycling data
  transactions: 'recycling_transactions', // RecyclingTransaction documents
  
  // Achievement system
  achievements: 'achievements', // Static achievement definitions
  user_achievements: 'user_achievements', // AchievementProgress documents
  
  // Challenges
  challenges: 'challenges', // Challenge documents
  user_challenges: 'user_challenges', // UserChallengeProgress documents
  
  // Social & Competition
  leaderboards: 'leaderboards', // LeaderboardEntry documents
  social_activities: 'social_activities', // SocialActivity documents
  
  // Rewards & Redemption
  reward_redemptions: 'reward_redemptions', // RewardRedemption documents
  
  // Analytics
  user_insights: 'user_insights', // UserInsights documents
  
  // System analytics
  daily_stats: 'daily_stats', // Aggregated daily statistics
  monthly_stats: 'monthly_stats' // Aggregated monthly statistics
} as const