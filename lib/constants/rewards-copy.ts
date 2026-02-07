// UX Microcopy for Rewards & Achievements System

// Success Messages (Elderly-Friendly)
export const SUCCESS_MESSAGES = {
  // Immediate feedback (under 2 seconds)
  immediate: {
    great_job: "Great job! 👏",
    well_done: "Well done! ⭐",
    fantastic: "Fantastic! 🌟",
    excellent: "Excellent! 🎉",
    amazing: "Amazing work! ✨"
  },
  
  // Points earned messages
  points: {
    first_time: "You earned your first points! Welcome to the eco-family! 🌱",
    small_amount: (points: number) => `+${points} points! Every bit helps our planet! 🌍`,
    medium_amount: (points: number) => `+${points} points! You're making a real difference! 💚`,
    large_amount: (points: number) => `+${points} points! Wow, that's incredible! 🚀`,
    bonus: (bonus: number) => `Bonus +${bonus} points for being awesome! 🎁`
  },
  
  // Environmental impact (simple language)
  environmental: {
    co2_saved: (kg: number) => 
      kg < 1 
        ? `You saved ${(kg * 1000).toFixed(0)}g of CO₂! Like taking a car off the road for a few minutes! 🚗💨`
        : `You saved ${kg.toFixed(1)}kg of CO₂! That's like planting ${Math.round(kg * 0.05)} trees! 🌳`,
    
    materials: (count: number) => 
      count === 1 
        ? "You recovered 1 valuable material for reuse! ♻️"
        : `You recovered ${count} valuable materials for reuse! That's fantastic! ♻️✨`,
    
    energy: (kwh: number) => 
      kwh < 1
        ? "You saved enough energy to charge your phone for days! 🔋"
        : `You saved ${kwh.toFixed(1)} kWh of energy! That could power a home for hours! ⚡`,
    
    water: (liters: number) => 
      liters < 10
        ? `You saved ${liters.toFixed(0)} liters of water! Every drop counts! 💧`
        : `You saved ${liters.toFixed(0)} liters of water! That's amazing! 💧✨`
  }
} as const

// Achievement Messages (Encouraging & Clear)
export const ACHIEVEMENT_MESSAGES = {
  // First-time achievements
  first_time: {
    title: "Welcome to the Eco-Family! 🌱",
    message: "You just took your first step toward a greener planet. Every journey begins with a single step!",
    encouragement: "Keep going - you're already making a difference!"
  },
  
  // Milestone achievements
  milestones: {
    points_1000: {
      title: "Point Collector! ⭐",
      message: "You've earned 1,000 points! That's like saving enough materials to make 10 new phones!",
      encouragement: "You're becoming an eco-champion!"
    },
    
    items_10: {
      title: "Recycling Hero! 🦸‍♀️",
      message: "10 items recycled! You've kept harmful materials out of landfills and given them new life!",
      encouragement: "Your planet thanks you!"
    },
    
    co2_10kg: {
      title: "Climate Champion! 🌍",
      message: "You've saved 10kg of CO₂! That's like the amount a tree absorbs in 6 months!",
      encouragement: "You're fighting climate change one device at a time!"
    }
  },
  
  // Streak achievements
  streaks: {
    'three_days': {
      title: "Getting Into the Habit! 🔥",
      message: "3 days in a row! You're building an amazing eco-friendly routine!",
      encouragement: "Consistency is key to making a big impact!"
    },
    
    'seven_days': {
      title: "Week Warrior! 🏆",
      message: "A whole week of recycling! You're showing incredible dedication to our planet!",
      encouragement: "You're inspiring others with your commitment!"
    },
    
    'thirty_days': {
      title: "Eco Legend! 👑",
      message: "30 days straight! You've made recycling a true lifestyle. You're a role model for everyone!",
      encouragement: "You're changing the world, one day at a time!"
    }
  },
  
  // Special achievements
  special: {
    variety_master: {
      title: "Variety Master! 🎯",
      message: "You've recycled many different types of devices! Your knowledge of e-waste is impressive!",
      encouragement: "You're becoming an expert recycler!"
    },
    
    community_helper: {
      title: "Community Helper! 🤝",
      message: "You've helped others learn about recycling! Sharing knowledge multiplies the impact!",
      encouragement: "Together, we can save the planet!"
    }
  }
} as const

// Level Up Messages (Motivational)
export const LEVEL_UP_MESSAGES = {
  general: {
    title: "Level Up! 🎊",
    message: "You've reached a new level! Your dedication to the environment is truly inspiring!",
    encouragement: "Keep up the fantastic work!"
  },
  
  specific: {
    level_2: {
      title: "Green Helper! 🌿",
      message: "Level 2 achieved! You're no longer a beginner - you're becoming a true eco-warrior!",
      benefits: "You now earn 15% more points and get early access to special challenges!"
    },
    
    level_3: {
      title: "Eco Warrior! 🛡️",
      message: "Level 3! You're fighting for the planet with every device you recycle!",
      benefits: "20% point bonus and access to exclusive rewards!"
    },
    
    level_5: {
      title: "Eco Champion! 🏆",
      message: "Level 5! You're among the top recyclers making a real difference in the world!",
      benefits: "30% point bonus and VIP support!"
    },
    
    level_7: {
      title: "Eco Legend! 👑",
      message: "Maximum level reached! You're a true legend in environmental protection!",
      benefits: "40% point bonus and Hall of Fame status!"
    }
  }
} as const

// Encouragement Messages (For Low Engagement)
export const ENCOURAGEMENT_MESSAGES = {
  // Gentle reminders
  gentle_reminders: [
    "Your planet misses you! 🌍 Ready to recycle another device?",
    "Every device you recycle makes a difference! 💚 What will you save today?",
    "Small actions, big impact! 🌟 Your next recycling adventure awaits!",
    "The environment needs heroes like you! 🦸‍♀️ Ready to help again?"
  ],
  
  // Progress encouragement
  progress: {
    close_to_level: (pointsNeeded: number) => 
      `You're only ${pointsNeeded} points away from leveling up! 🚀 So close!`,
    
    close_to_achievement: (progress: number, title: string) => 
      `You're ${progress}% of the way to "${title}"! 🎯 Keep going!`,
    
    streak_recovery: "Ready to start a new recycling streak? 🔥 Every day counts!",
    
    comeback: "Welcome back, eco-hero! 🌟 The planet is happy to see you again!"
  },
  
  // Seasonal messages
  seasonal: {
    earth_day: "Happy Earth Day! 🌍 What better way to celebrate than by recycling?",
    new_year: "New Year, New Green Goals! 🎊 Ready to make this year more sustainable?",
    spring: "Spring cleaning time! 🌸 Perfect opportunity to recycle old electronics!",
    summer: "Summer vibes! ☀️ Keep the planet cool by recycling hot electronics!"
  }
} as const

// Error & Guidance Messages (Supportive)
export const GUIDANCE_MESSAGES = {
  // When things go wrong
  errors: {
    gentle: "Oops! Something didn't work quite right. No worries - let's try again! 😊",
    technical: "We're having a small technical hiccup. Your recycling efforts are still amazing! 🛠️",
    network: "Connection seems slow. Your patience helps the planet too! 🌐",
    retry: "Let's give it another try! Every attempt shows you care about the environment! 🔄"
  },
  
  // Helpful tips
  tips: {
    better_photo: "💡 Tip: A clearer photo helps us identify your device better!",
    weight_help: "💡 Tip: If you're not sure about weight, our smart system can estimate it!",
    condition_matters: "💡 Tip: Working devices earn bonus points because they can be refurbished!",
    remove_data: "💡 Tip: Remember to remove personal data before recycling for your privacy!"
  },
  
  // First-time user guidance
  first_time: {
    welcome: "Welcome to eco-friendly recycling! 🌱 We'll guide you through every step!",
    how_it_works: "It's simple: Take a photo, tell us about your device, and earn rewards for helping the planet! 📸➡️🌍",
    points_explanation: "Points show how much you're helping the environment. More points = bigger impact! ⭐",
    achievements_explanation: "Achievements celebrate your eco-friendly milestones. Collect them all! 🏆"
  }
} as const

// Social Sharing Messages
export const SHARING_MESSAGES = {
  // Social media templates
  templates: {
    achievement: (title: string, points: number) => 
      `🌟 Just unlocked "${title}" on the Smart E-Waste Recycling app! ${points} points earned for helping the planet! 🌍♻️ #EcoHero #Recycling #GreenTech`,
    
    level_up: (level: number, title: string) => 
      `🎊 Level ${level} achieved! I'm now a "${title}" in eco-friendly recycling! Join me in saving the planet! 🌱 #LevelUp #EcoWarrior #Sustainability`,
    
    milestone: (items: number, co2: number) => 
      `🏆 Milestone reached! ${items} devices recycled, ${co2}kg CO₂ saved! Every device makes a difference! 💚 #RecyclingHero #ClimateAction #EWaste`,
    
    streak: (days: number) => 
      `🔥 ${days} days of consistent recycling! Building habits that help our planet! Who's joining the streak? 🌍 #RecyclingStreak #EcoHabits #GreenLiving`
  },
  
  // Celebration messages for sharing
  celebration: {
    personal: "I'm making a difference, one device at a time! 🌟",
    community: "Together, we can save the planet! Join me in recycling! 🤝",
    impact: "Small actions, big impact! Every device counts! 💪",
    future: "Recycling today for a better tomorrow! 🌅"
  }
} as const

// Accessibility Labels (Screen Reader Friendly)
export const ACCESSIBILITY_LABELS = {
  points: {
    earned: (points: number) => `You earned ${points} points for recycling`,
    total: (total: number) => `Your total points: ${total}`,
    bonus: (bonus: number) => `Bonus points earned: ${bonus}`
  },
  
  achievements: {
    unlocked: (title: string) => `Achievement unlocked: ${title}`,
    progress: (current: number, target: number, title: string) => 
      `Achievement progress for ${title}: ${current} out of ${target} completed`,
    badge: (badge: string, title: string) => `Achievement badge ${badge} for ${title}`
  },
  
  level: {
    current: (level: number, title: string) => `Current level: ${level}, ${title}`,
    progress: (progress: number) => `Level progress: ${progress} percent complete`,
    level_up: (newLevel: number) => `Congratulations! You reached level ${newLevel}`
  },
  
  environmental: {
    co2: (kg: number) => `Environmental impact: ${kg} kilograms of CO2 saved`,
    materials: (count: number) => `Materials recovered: ${count} different types`,
    equivalent: (equivalent: string) => `Environmental equivalent: ${equivalent}`
  }
} as const

// Notification Messages (Push/Email)
export const NOTIFICATION_MESSAGES = {
  // Push notifications
  push: {
    achievement: (title: string) => ({
      title: "🏆 Achievement Unlocked!",
      body: `You earned "${title}"! Tap to see your reward!`
    }),
    
    level_up: (level: number) => ({
      title: "🎊 Level Up!",
      body: `Congratulations! You reached level ${level}!`
    }),
    
    streak_reminder: (days: number) => ({
      title: "🔥 Keep Your Streak!",
      body: `You're on a ${days}-day streak! Don't break it now!`
    }),
    
    challenge: (title: string) => ({
      title: "🎯 New Challenge!",
      body: `"${title}" is now available! Ready to take it on?`
    })
  },
  
  // Email subjects
  email: {
    weekly_summary: "Your Weekly Eco-Impact Summary 🌍",
    achievement: "You Unlocked a New Achievement! 🏆",
    level_up: "Congratulations on Leveling Up! 🎊",
    milestone: "You Hit a Major Milestone! 🎯",
    comeback: "We Miss You, Eco-Hero! 🌱"
  }
} as const