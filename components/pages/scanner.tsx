'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/simple-auth'
import { getSession, type BinSession } from '@/lib/services/session-service'
import { CameraCapture } from '@/components/scanner/camera-capture'

export function Scanner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSession, setActiveSession] = useState<BinSession | null>(null)
  const [showConnectionSuccess, setShowConnectionSuccess] = useState(false)
  const [connectedBinId, setConnectedBinId] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(true)

  useEffect(() => {
    // Check if we just scanned a QR code
    const qrSuccess = sessionStorage.getItem('qr_scan_success')
    if (qrSuccess) {
      const { binId } = JSON.parse(qrSuccess)
      sessionStorage.removeItem('qr_scan_success')
      
      setConnectedBinId(binId)
      setShowConnectionSuccess(true)
      setShowCamera(false)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowConnectionSuccess(false)
      }, 3000)
    }
    
    // Check if we just connected (from URL params - fallback)
    const justConnected = searchParams?.get('connected')
    const binId = searchParams?.get('binId')
    
    if (justConnected === 'true' && binId) {
      setConnectedBinId(binId)
      setShowConnectionSuccess(true)
      setShowCamera(false)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowConnectionSuccess(false)
        // Clean URL
        router.replace('/scanner')
      }, 3000)
    }

    // Check if there's an active session
    const sessionId = localStorage.getItem('current_bin_session')
    if (sessionId) {
      const session = getSession(sessionId)
      if (session && session.status === 'active' && new Date(session.expiresAt) > new Date()) {
        setActiveSession(session)
      }
    }
  }, [searchParams, router])

  const handleCameraCapture = (imageData: string) => {
    // Camera capture is handled by QR detection in CameraCapture component
    // If we reach here, it means no QR was detected
    console.log('No QR code detected')
  }

  const handleClose = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark relative">
      {/* Connection Success Overlay */}
      {showConnectionSuccess && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center px-6 animate-fade-in">
          <div className="bg-background-light dark:bg-background-dark rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-stone-200 dark:border-stone-700">
            {/* Success Animation */}
            <div className="relative mb-6 flex justify-center">
              {/* Pulsing rings */}
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl scale-150 animate-pulse"></div>
              <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping"></div>
              
              {/* Main icon */}
              <div className="relative w-24 h-24 rounded-full bg-green-500/10 border-4 border-green-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-500 text-6xl fill-current">check_circle</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground text-center mb-3">
              Successfully Connected!
            </h2>
            
            <div className="bg-surface-light dark:bg-surface-dark border border-stone-200 dark:border-stone-700 rounded-xl p-3 mb-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">location_on</span>
                <span className="font-bold">Bin {connectedBinId}</span>
              </div>
            </div>

            <p className="text-stone-600 dark:text-stone-400 text-center text-sm">
              Place your e-waste in the bin to start recycling
            </p>
          </div>
        </div>
      )}

      {/* Session Info Banner (if connected) */}
      {activeSession && !showConnectionSuccess && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-sm text-white px-4 py-2 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">link</span>
            <span className="text-xs font-medium">Connected to Bin {activeSession.binId}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs">Active</span>
          </div>
        </div>
      )}

      {/* Camera for QR Scanning */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={handleClose}
        />
      )}

      {/* Instructions when session is active but camera is closed */}
      {activeSession && !showCamera && !showConnectionSuccess && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-16">
          <div className="max-w-md w-full text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-primary text-5xl">recycling</span>
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Ready to Recycle
            </h2>
            
            <p className="text-stone-600 dark:text-stone-400 mb-8">
              Place your e-waste item in Bin {activeSession.binId}. The bin will automatically detect and process your item.
            </p>

            <div className="bg-surface-light dark:bg-surface-dark border border-stone-200 dark:border-stone-700 rounded-xl p-6 mb-6">
              <h3 className="text-foreground font-bold mb-4 flex items-center gap-2 justify-center">
                <span className="material-symbols-outlined text-primary">info</span>
                Next Steps
              </h3>
              <ol className="space-y-3 text-sm text-stone-600 dark:text-stone-400 text-left">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                  <span>Place your item in the bin</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                  <span>Bin will scan and identify the item</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
                  <span>Confirm on the bin screen</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">4</span>
                  <span>Earn rewards instantly!</span>
                </li>
              </ol>
            </div>

            <button
              onClick={() => setShowCamera(true)}
              className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold rounded-lg h-12 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">qr_code_scanner</span>
              Scan Another Bin
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}