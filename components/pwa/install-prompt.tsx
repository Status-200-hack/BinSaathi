'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show install prompt after user has used the app for a bit
      setTimeout(() => {
        setShowInstallPrompt(true)
      }, 30000) // 30 seconds
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false)
    }
    
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem('installPromptDismissed', 'true')
  }

  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null
  }

  // Don't show if dismissed this session
  if (sessionStorage.getItem('installPromptDismissed')) {
    return null
  }

  return (
    <Card className="fixed bottom-20 left-4 right-4 z-50 p-4 bg-primary/95 backdrop-blur-md border-primary/20">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-white text-2xl">
          get_app
        </span>
        
        <div className="flex-1">
          <h3 className="text-white font-bold text-sm">
            Install EcoRecycle App
          </h3>
          <p className="text-white/80 text-xs">
            Get quick access and work offline!
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleDismiss}
            className="text-white/60 hover:text-white text-sm px-2 py-1"
          >
            Later
          </button>
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="bg-white text-primary hover:bg-white/90"
          >
            Install
          </Button>
        </div>
      </div>
    </Card>
  )
}