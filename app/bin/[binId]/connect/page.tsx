'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/simple-auth'
import { createBinSession } from '@/lib/services/session-service'

export default function BinConnectPage() {
  const router = useRouter()
  const params = useParams()
  const binId = params.binId as string
  const [status, setStatus] = useState<'connecting' | 'success' | 'error'>('connecting')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const connectToBin = async () => {
      try {
        // Get current user
        const user = getCurrentUser()
        
        if (!user) {
          setStatus('error')
          setErrorMessage('Please sign in first')
          setTimeout(() => {
            router.push('/sign-in')
          }, 2000)
          return
        }

        // Create session
        const session = createBinSession(
          binId,
          user.id,
          user.name,
          user.email,
          user.avatar
        )

        // Store session ID in localStorage for mobile app to track
        localStorage.setItem('current_bin_session', session.sessionId)

        setStatus('success')

        // Redirect back to scanner with success flag
        setTimeout(() => {
          router.push(`/scanner?connected=true&binId=${binId}`)
        }, 1500)

      } catch (error) {
        console.error('Connection error:', error)
        setStatus('error')
        setErrorMessage('Failed to connect to bin')
      }
    }

    connectToBin()
  }, [binId, router])

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[40%] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[40%] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {status === 'connecting' && (
          <>
            <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mb-6 animate-pulse">
              <span className="material-symbols-outlined text-primary text-5xl">link</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground text-center mb-3">
              Connecting to Bin
            </h1>
            <p className="text-stone-600 dark:text-stone-400 text-center">
              Please wait while we establish connection...
            </p>
            <div className="mt-8 flex gap-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            {/* Success Animation */}
            <div className="relative mb-8">
              {/* Pulsing rings */}
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl scale-150 animate-pulse"></div>
              <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping"></div>
              
              {/* Main icon */}
              <div className="relative w-32 h-32 rounded-full bg-green-500/10 border-4 border-green-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-500 text-7xl fill-current animate-bounce">check_circle</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-foreground text-center mb-3 animate-fade-in">
              Successfully Connected!
            </h1>
            
            <div className="bg-surface-light dark:bg-surface-dark border border-stone-200 dark:border-stone-700 rounded-xl p-4 mb-4 w-full">
              <div className="flex items-center justify-center gap-2 text-primary">
                <span className="material-symbols-outlined">location_on</span>
                <span className="font-bold text-lg">Bin {binId}</span>
              </div>
            </div>

            <p className="text-stone-600 dark:text-stone-400 text-center mb-6">
              You can now start scanning your e-waste items
            </p>

            {/* Auto-redirect message */}
            <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Redirecting to scanner...</span>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-24 h-24 rounded-full bg-red-500/10 border-4 border-red-500/20 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-red-500 text-5xl">error</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground text-center mb-3">
              Connection Failed
            </h1>
            <p className="text-stone-600 dark:text-stone-400 text-center">
              {errorMessage}
            </p>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
