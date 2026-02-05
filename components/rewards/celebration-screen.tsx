'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { RecyclingTransaction } from '@/lib/schemas/rewards-schema'

interface CelebrationScreenProps {
  transaction: RecyclingTransaction
  onContinue: () => void
  onShare?: () => void
}

interface AnimationPhase {
  phase: 'points' | 'impact' | 'achievements' | 'level' | 'complete'
  duration: number
}

const CELEBRATION_PHASES: AnimationPhase[] = [
  { phase: 'points', duration: 1500 },
  { phase: 'impact', duration: 1200 },
  { phase: 'achievements', duration: 1000 },
  { phase: 'level', duration: 800 },
  { phase: 'complete', duration: 0 }
]

export function CelebrationScreen({ transaction, onContinue, onShare }: CelebrationScreenProps) {
  const [currentPhase, setCurrentPhase] = useState<AnimationPhase['phase']>('points')
  const [pointsCount, setPointsCount] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [achievementIndex, setAchievementIndex] = useState(0)

  // Animate through celebration phases
  useEffect(() => {
    let phaseIndex = 0
    
    const nextPhase = () => {
      if (phaseIndex < CELEBRATION_PHASES.length - 1) {
        phaseIndex++
        setCurrentPhase(CELEBRATION_PHASES[phaseIndex].phase)
        
        setTimeout(nextPhase, CELEBRATION_PHASES[phaseIndex].duration)
      }
    }
    
    // Start with points animation
    setTimeout(nextPhase, CELEBRATION_PHASES[0].duration)
  }, [])

  // Animate points counter
  useEffect(() => {
    if (currentPhase === 'points') {
      setShowConfetti(true)
      
      const targetPoints = transaction.rewards.totalPoints
      const duration = 1200
      const steps = 30
      const increment = targetPoints / steps
      
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= targetPoints) {
          setPointsCount(targetPoints)
          clearInterval(timer)
        } else {
          setPointsCount(Math.floor(current))
        }
      }, duration / steps)
      
      return () => clearInterval(timer)
    }
  }, [currentPhase, transaction.rewards.totalPoints])

  // Animate achievements
  useEffect(() => {
    if (currentPhase === 'achievements' && transaction.achievementsUnlocked.length > 0) {
      const timer = setInterval(() => {
        setAchievementIndex(prev => 
          prev < transaction.achievementsUnlocked.length - 1 ? prev + 1 : prev
        )
      }, 800)
      
      return () => clearInterval(timer)
    }
  }, [currentPhase, transaction.achievementsUnlocked.length])

  const leveledUp = transaction.levelProgress.leveledUp
  const hasAchievements = transaction.achievementsUnlocked.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background-light to-green-50 dark:from-primary/5 dark:via-background-dark dark:to-green-900/20 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'absolute w-2 h-2 rounded-full animate-bounce',
                i % 4 === 0 ? 'bg-primary' : 
                i % 4 === 1 ? 'bg-green-500' : 
                i % 4 === 2 ? 'bg-blue-500' : 'bg-purple-500'
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6 py-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-green-500 rounded-full flex items-center justify-center shadow-2xl">
              <span className="material-symbols-outlined text-white text-5xl font-bold">
                check_circle
              </span>
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
            Amazing Work! 🎉
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-lg">
            You just made the planet a little greener
          </p>
        </div>

        {/* Points Animation */}
        <Card className="mb-6 p-6 text-center bg-gradient-to-r from-primary/10 to-green-500/10 border-primary/20">
          <div className="mb-4">
            <div className={cn(
              'text-6xl font-bold transition-all duration-500',
              currentPhase === 'points' ? 'text-primary scale-110' : 'text-primary'
            )}>
              +{pointsCount.toLocaleString()}
            </div>
            <div className="text-primary text-xl font-medium uppercase tracking-wider mt-2">
              Points Earned
            </div>
          </div>
          
          {/* Bonus Breakdown */}
          {currentPhase !== 'points' && transaction.rewards.bonuses.length > 0 && (
            <div className="space-y-2 animate-fade-in-up">
              <div className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-3">
                Bonus Points:
              </div>
              {transaction.rewards.bonuses.map((bonus, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-stone-600 dark:text-stone-400">{bonus.reason}</span>
                  <span className="text-primary font-bold">+{bonus.amount}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Environmental Impact */}
        {(currentPhase === 'impact' || currentPhase === 'achievements' || currentPhase === 'level' || currentPhase === 'complete') && (
          <Card className="mb-6 p-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-green-600 text-2xl">public</span>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                Environmental Impact
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {transaction.impact.co2SavedKg.toFixed(1)}kg
                </div>
                <div className="text-xs text-green-700 dark:text-green-300 font-medium">
                  CO₂ Saved
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {transaction.impact.co2Equivalent}
                </div>
              </div>
              
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {transaction.impact.materialsRecovered.length}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                  Materials
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Recovered for reuse
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Achievements */}
        {hasAchievements && (currentPhase === 'achievements' || currentPhase === 'level' || currentPhase === 'complete') && (
          <Card className="mb-6 p-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">military_tech</span>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                New Achievement{transaction.achievementsUnlocked.length > 1 ? 's' : ''}!
              </h3>
            </div>
            
            <div className="space-y-3">
              {transaction.achievementsUnlocked.slice(0, achievementIndex + 1).map((achievement, index) => (
                <div 
                  key={achievement.achievementId}
                  className="flex items-center gap-4 p-3 bg-primary/10 rounded-xl animate-bounce-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="text-3xl">{achievement.badge}</div>
                  <div className="flex-1">
                    <div className="font-bold text-text-light dark:text-text-dark">
                      {achievement.title}
                    </div>
                    <div className="text-sm text-stone-600 dark:text-stone-400">
                      +{achievement.pointsAwarded} bonus points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Level Up */}
        {leveledUp && (currentPhase === 'level' || currentPhase === 'complete') && (
          <Card className="mb-6 p-6 bg-gradient-to-r from-purple-500/10 to-primary/10 border-purple-500/20 animate-fade-in-up">
            <div className="text-center">
              <div className="text-4xl mb-2">🎊</div>
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
                Level Up!
              </h3>
              <div className="text-lg">
                <span className="text-stone-600 dark:text-stone-400">Level </span>
                <span className="text-primary font-bold text-2xl">
                  {transaction.levelProgress.levelAfter}
                </span>
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
                You're becoming an eco legend!
              </p>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        {currentPhase === 'complete' && (
          <div className="space-y-3 animate-fade-in-up">
            <Button 
              onClick={onContinue}
              className="w-full"
              size="xl"
            >
              <span className="material-symbols-outlined mr-2">recycling</span>
              Recycle Another Item
            </Button>
            
            <div className="flex gap-3">
              {onShare && (
                <Button 
                  variant="secondary"
                  onClick={onShare}
                  className="flex-1"
                >
                  <span className="material-symbols-outlined mr-2">share</span>
                  Share Success
                </Button>
              )}
              
              <Button 
                variant="secondary"
                onClick={() => {/* Navigate to profile */}}
                className="flex-1"
              >
                <span className="material-symbols-outlined mr-2">person</span>
                View Profile
              </Button>
            </div>
          </div>
        )}

        {/* Skip Animation Button */}
        {currentPhase !== 'complete' && (
          <div className="text-center mt-6">
            <button
              onClick={() => setCurrentPhase('complete')}
              className="text-stone-500 dark:text-stone-400 text-sm hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
            >
              Skip animation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Additional CSS for animations
const additionalStyles = `
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}

.animate-bounce-in {
  animation: bounce-in 0.8s ease-out;
}
`

// Inject styles if in browser
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = additionalStyles
  document.head.appendChild(styleSheet)
}