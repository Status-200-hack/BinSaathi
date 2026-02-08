'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DetectionResult } from '@/lib/services/detection-service'
import { useRouter } from 'next/navigation'
import { completeSession, type BinSession } from '@/lib/services/session-service'

const impactStats = [
  {
    id: 'co2',
    label: 'CO2 Saved',
    icon: 'cloud_off',
    color: 'text-stone-600 dark:text-stone-300'
  },
  {
    id: 'energy',
    label: 'Energy',
    icon: 'bolt',
    color: 'text-primary'
  },
  {
    id: 'recovered',
    label: 'Recovered',
    icon: 'recycling',
    color: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    id: 'water',
    label: 'Water',
    icon: 'water_drop',
    color: 'text-blue-500 dark:text-blue-400'
  }
]

export function SuccessScreen() {
  const router = useRouter()
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [binSession, setBinSession] = useState<BinSession | null>(null)

  useEffect(() => {
    // Get result from sessionStorage
    if (typeof window !== 'undefined') {
      const storedResult = sessionStorage.getItem('detectionResult')
      if (storedResult) {
        try {
          setResult(JSON.parse(storedResult))
        } catch (error) {
          console.error('Failed to parse detection result:', error)
        }
      }

      // Get bin session
      const storedSession = sessionStorage.getItem('activeBinSession')
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession)
          setBinSession(session)
          
          // Complete the session
          completeSession(session.sessionId)
          
          // Clear current bin session
          localStorage.removeItem('current_bin_session')
        } catch (error) {
          console.error('Failed to parse bin session:', error)
        }
      }
    }
  }, [])

  const handleRecycleAnother = () => {
    // Clear stored result
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('detectionResult')
      sessionStorage.removeItem('activeBinSession')
    }
    // Go back to home to scan another bin QR code
    router.push('/')
  }

  const handleViewReceipt = () => {
    router.push('/receipt')
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-stone-500 dark:text-stone-400">Loading result...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-text-light dark:text-text-dark">
      {/* Ambient Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[60%] bg-primary/10 dark:bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[40%] bg-stone-400/20 dark:bg-stone-600/10 rounded-full blur-[80px] pointer-events-none z-0" />

      {/* Main Content Container */}
      <div className="relative w-full max-w-md h-full min-h-screen flex flex-col z-10 px-6 py-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" className="p-2 rounded-full" onClick={() => router.push('/')}>
            <span className="material-symbols-outlined text-2xl">close</span>
          </Button>
          <span className="text-sm font-medium tracking-wide text-stone-500 dark:text-stone-400 uppercase">
            Recycling Complete
          </span>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Celebration Section */}
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-4">
          {/* Animated Icon Container */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center shadow-amber-glow">
              <span className="material-symbols-outlined text-background-dark text-5xl font-bold">
                check
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">Recycle Successful!</h2>
          
          {binSession && (
            <div className="mb-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <p className="text-sm text-primary font-medium">
                <span className="material-symbols-outlined text-sm align-middle mr-1">location_on</span>
                Bin {binSession.binId}
              </p>
            </div>
          )}
          
          <div className="flex flex-col items-center mb-10">
            <h1 className="text-6xl font-bold text-primary tracking-tighter drop-shadow-sm">
              +{result.pointsEarned}
            </h1>
            <span className="text-primary text-xl font-medium tracking-widest uppercase mt-1">
              Points
            </span>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-3 font-medium">
              Added to your Solar Wallet
            </p>
          </div>

          {/* Impact Glass Card */}
          <Card variant="glass" className="w-full p-6 mb-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-stone-200/50 dark:border-stone-700/50">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Environmental Impact
              </h3>
              <span className="material-symbols-outlined text-primary/80">public</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-start gap-1 p-3 rounded-xl bg-surface-light/50 dark:bg-surface-dark/50 hover:bg-surface-light/80 dark:hover:bg-surface-dark/80 transition-colors">
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300 mb-1">
                  <span className="material-symbols-outlined text-lg">cloud_off</span>
                  <span className="text-xs font-bold uppercase">CO2 Saved</span>
                </div>
                <span className="text-xl font-bold text-text-light dark:text-text-dark">
                  {result.carbonSaved}
                  <span className="text-sm font-normal text-stone-500 dark:text-stone-400 ml-1">kg</span>
                </span>
              </div>

              <div className="flex flex-col items-start gap-1 p-3 rounded-xl bg-surface-light/50 dark:bg-surface-dark/50 hover:bg-surface-light/80 dark:hover:bg-surface-dark/80 transition-colors">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <span className="material-symbols-outlined text-lg">bolt</span>
                  <span className="text-xs font-bold uppercase">Value</span>
                </div>
                <span className="text-xl font-bold text-text-light dark:text-text-dark">
                  ${result.recyclingValue}
                  <span className="text-sm font-normal text-stone-500 dark:text-stone-400 ml-1">.00</span>
                </span>
              </div>

              <div className="flex flex-col items-start gap-1 p-3 rounded-xl bg-surface-light/50 dark:bg-surface-dark/50 hover:bg-surface-light/80 dark:hover:bg-surface-dark/80 transition-colors">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                  <span className="material-symbols-outlined text-lg">recycling</span>
                  <span className="text-xs font-bold uppercase">Materials</span>
                </div>
                <span className="text-xl font-bold text-text-light dark:text-text-dark">
                  {result.materials.length}
                  <span className="text-sm font-normal text-stone-500 dark:text-stone-400 ml-1">types</span>
                </span>
              </div>

              <div className="flex flex-col items-start gap-1 p-3 rounded-xl bg-surface-light/50 dark:bg-surface-dark/50 hover:bg-surface-light/80 dark:hover:bg-surface-dark/80 transition-colors">
                <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 mb-1">
                  <span className="material-symbols-outlined text-lg">verified</span>
                  <span className="text-xs font-bold uppercase">Confidence</span>
                </div>
                <span className="text-xl font-bold text-text-light dark:text-text-dark">
                  {result.confidence}
                  <span className="text-sm font-normal text-stone-500 dark:text-stone-400 ml-1">%</span>
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-3 mt-auto pt-6 w-full">
          <Button className="w-full group" size="xl" onClick={handleRecycleAnother}>
            <span>Recycle Another Item</span>
            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Button>
          
          <Button 
            variant="secondary" 
            className="w-full" 
            size="xl"
            onClick={handleViewReceipt}
          >
            <span className="material-symbols-outlined text-xl">receipt_long</span>
            <span>View Receipt</span>
          </Button>
        </div>
      </div>
    </div>
  )
}