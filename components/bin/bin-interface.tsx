'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ui/theme-provider'
import { getActiveBinSession, generateQRData, type BinSession } from '@/lib/services/session-service'
import QRCode from 'qrcode'

interface BinInterfaceProps {
  binId: string
}

type SessionState = 'idle' | 'connected' | 'scanning' | 'result' | 'success' | 'error'

interface DetectionResult {
  item: string
  confidence: number
  category: string
}

export function BinInterface({ binId }: BinInterfaceProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [state, setState] = useState<SessionState>('idle')
  const [activeSession, setActiveSession] = useState<BinSession | null>(null)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [countdown, setCountdown] = useState(5)
  const [scanProgress, setScanProgress] = useState(0)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  // Generate QR code on mount
  useEffect(() => {
    const qrData = generateQRData(binId)
    QRCode.toDataURL(qrData, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }).then(url => {
      setQrCodeUrl(url)
    }).catch(err => {
      console.error('QR code generation error:', err)
    })
  }, [binId])

  // Poll for active session
  useEffect(() => {
    if (state === 'idle') {
      const interval = setInterval(() => {
        const session = getActiveBinSession(binId)
        if (session) {
          setActiveSession(session)
          setState('connected')
        }
      }, 1000) // Check every second

      return () => clearInterval(interval)
    }
  }, [binId, state])

  // Keyboard shortcut for testing (L key on idle screen)
  useEffect(() => {
    if (state === 'idle') {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'l' || e.key === 'L') {
          console.log('L key pressed - creating test session')
          
          // Create a test session
          import('@/lib/services/session-service').then(({ createBinSession }) => {
            const testSession = createBinSession(
              binId,
              'test-user-123',
              'Test User',
              'test@example.com',
              'https://ui-avatars.com/api/?name=Test+User&background=f9a406&color=231c0f&size=200'
            )
            localStorage.setItem('current_bin_session', testSession.sessionId)
            setActiveSession(testSession)
            setState('connected')
          })
        }
      }

      window.addEventListener('keydown', handleKeyPress)
      return () => window.removeEventListener('keydown', handleKeyPress)
    }
  }, [state, binId])

  // Handle item detection with progress
  useEffect(() => {
    if (state === 'scanning') {
      setScanProgress(0)
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 78) {
            clearInterval(progressInterval)
            return 78
          }
          return prev + 2
        })
      }, 50)

      const timer = setTimeout(() => {
        setResult({
          item: 'Phone',
          confidence: 92,
          category: 'Electronics'
        })
        setState('result')
      }, 3000)

      return () => {
        clearTimeout(timer)
        clearInterval(progressInterval)
      }
    }
  }, [state])

  // Handle success countdown
  useEffect(() => {
    if (state === 'success') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        return () => clearTimeout(timer)
      } else {
        setState('idle')
        setActiveSession(null)
        setResult(null)
        setCountdown(5)
      }
    }
  }, [state, countdown])

  const handleStartScan = () => {
    setState('scanning')
  }

  const handleConfirm = () => {
    setState('success')
  }

  const handleRetake = () => {
    setState('scanning')
  }

  const handleCancel = () => {
    setState('idle')
    setActiveSession(null)
    setResult(null)
  }

  // Idle State - Based on Stitch kiosk_idle design
  if (state === 'idle') {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col relative overflow-hidden selection:bg-primary selection:text-background-dark">
        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 p-4 opacity-20 pointer-events-none">
          <div className="w-32 h-32 border-l-2 border-t-2 border-foreground rounded-tl-3xl"></div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
          <div className="w-32 h-32 border-r-2 border-t-2 border-foreground rounded-tr-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 p-4 opacity-20 pointer-events-none">
          <div className="w-32 h-32 border-l-2 border-b-2 border-foreground rounded-bl-3xl"></div>
        </div>
        <div className="absolute bottom-0 right-0 p-4 opacity-20 pointer-events-none">
          <div className="w-32 h-32 border-r-2 border-b-2 border-foreground rounded-br-3xl"></div>
        </div>

        {/* Header */}
        <header className="flex-none px-6 pt-12 pb-6 flex flex-col items-center justify-center text-center z-10">
          <div className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-surface-dark dark:bg-surface-dark border border-white/10 shadow-lg">
            <span className="material-symbols-outlined text-primary text-2xl mr-2">recycling</span>
            <span className="text-white/80 text-sm font-medium tracking-wide uppercase">Eco-Station {binId}</span>
          </div>
          <h1 className="text-foreground text-5xl md:text-6xl font-bold leading-none tracking-tight mb-2">
            Recycle<br />
            <span className="text-primary">E-Waste</span> Here
          </h1>
        </header>

        {/* Center / Hero Section */}
        <section className="flex-grow flex flex-col items-center justify-center relative z-0">
          {/* Decorative Glow Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>

          {/* Logo / Visual Container */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 flex items-center justify-center">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-4 border border-white/5 rounded-full"></div>

            {/* Central Image/Logo */}
            <div className="relative z-10 w-48 h-48 bg-surface-dark rounded-full flex items-center justify-center shadow-2xl border border-white/10 overflow-hidden">
              <div className="flex flex-col items-center z-20">
                <span className="material-symbols-outlined text-primary text-6xl mb-2">solar_power</span>
                <span className="text-white text-lg font-bold tracking-widest uppercase">Solar<br />Earth</span>
              </div>
            </div>

            {/* Orbiting Dot */}
            <div className="absolute w-full h-full animate-[spin_3s_linear_infinite]">
              <div className="w-3 h-3 bg-primary rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_15px_rgba(249,164,6,0.8)]"></div>
            </div>
          </div>

          {/* Instructional Text */}
          <div className="text-center px-6 relative z-10">
            <p className="text-foreground text-xl md:text-2xl font-medium mb-6">Scan QR on your phone to begin</p>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-xl mx-auto w-40 h-40 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
              ) : (
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                  <span className="text-white text-xs">Loading...</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer / Status Bar */}
        <footer className="flex-none p-6 z-10">
          <div className="bg-surface-dark border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-lg backdrop-blur-sm bg-opacity-80">
            <div className="flex flex-col">
              <span className="text-white/40 text-xs uppercase tracking-wider font-bold mb-1">System Status</span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="text-primary font-bold text-lg tracking-wide">Ready</span>
              </div>
            </div>
            <div className="h-10 w-[1px] bg-white/10 mx-2"></div>
            <div className="flex items-center gap-4 text-right">
              <div className="flex flex-col items-end">
                <span className="text-foreground text-sm font-medium">Touch to Start</span>
                <span className="text-white/40 text-xs">Alternative Method</span>
              </div>
              <button 
                onClick={handleStartScan}
                className="bg-primary/10 hover:bg-primary/20 text-primary p-3 rounded-lg transition-colors duration-200"
              >
                <span className="material-symbols-outlined text-2xl">touch_app</span>
              </button>
            </div>
          </div>

          {/* Bottom Safety/Legal Text */}
          <div className="mt-4 flex justify-between items-center px-2">
            <p className="text-[#bbb09b] text-xs">ID: K-{binId}</p>
            <div className="flex gap-4 items-center">
              <div className="flex gap-2 text-[#bbb09b]">
                <span className="material-symbols-outlined text-sm">wifi</span>
                <span className="material-symbols-outlined text-sm">battery_charging_full</span>
              </div>
              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="text-[#bbb09b] hover:text-primary transition-colors p-1"
                aria-label="Toggle theme"
              >
                <span className="material-symbols-outlined text-sm">
                  {theme === 'light' ? 'dark_mode' : 'light_mode'}
                </span>
              </button>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // Connected State - Based on Stitch kiosk_connected design
  if (state === 'connected' && activeSession) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center justify-center pt-16 pb-8 px-6">
          <div className="relative mb-8">
            {/* Pulsing effect behind icon */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-surface-dark border border-primary/30 rounded-full p-2 flex items-center justify-center shadow-[0_0_15px_rgba(249,164,6,0.3)]">
              <img 
                src={activeSession.userAvatar} 
                alt={activeSession.userName}
                className="w-24 h-24 rounded-full"
              />
            </div>
            {/* Checkmark badge */}
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-background-dark flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px] font-bold">check</span>
            </div>
          </div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight text-center mb-2">Welcome, {activeSession.userName}!</h1>
          <p className="text-foreground/60 text-lg font-medium text-center">Device linked successfully</p>
        </div>

        {/* Main Content: Bin ID Card */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 w-full">
          <div className="w-full max-w-md relative group">
            {/* Decorative corner markers */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
            
            <div className="bg-surface-dark border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
              <div className="flex items-center gap-2 mb-4 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs uppercase tracking-widest text-white/70 font-semibold">System Active</span>
              </div>
              <div className="flex flex-col items-center gap-1 z-10">
                <span className="text-white/50 text-sm font-medium uppercase tracking-wider">Target Unit</span>
                <h2 className="text-5xl font-bold text-foreground tracking-tight">Bin ID: <span className="text-primary">{binId}</span></h2>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pb-12 pt-8 px-6 flex flex-col items-center gap-8 bg-gradient-to-t from-background-dark to-transparent">
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-foreground text-[32px] font-bold leading-tight text-center">Place your item inside</h3>
            <p className="text-foreground/60 text-base text-center max-w-[280px]">The hatch is now unlocked. Please deposit your e-waste below.</p>
          </div>
          
          {/* Animated Arrow */}
          <div className="flex flex-col items-center gap-4 animate-bounce">
            <button 
              onClick={handleStartScan}
              className="bg-primary text-background-dark p-4 rounded-full shadow-[0_0_20px_rgba(249,164,6,0.4)] hover:shadow-[0_0_30px_rgba(249,164,6,0.6)] transition-shadow duration-300"
            >
              <span className="material-symbols-outlined text-[48px] block">arrow_downward</span>
            </button>
            <span className="text-primary text-sm font-bold uppercase tracking-widest opacity-80">Insert Here</span>
          </div>

          {/* Bottom Safety Stripe */}
          <div className="w-full h-2 mt-4 rounded-full overflow-hidden opacity-30">
            <div className="w-full h-full" style={{ background: 'repeating-linear-gradient(45deg, #f9a406, #f9a406 10px, #231c0f 10px, #231c0f 20px)' }}></div>
          </div>
        </div>
      </div>
    )
  }

  // Scanning State - Based on Stitch kiosk_scanning design
  if (state === 'scanning') {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 pb-2 z-10">
          <button 
            onClick={handleCancel}
            className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors text-foreground"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center uppercase">System Active</h2>
          <button 
            onClick={handleCancel}
            className="flex h-10 px-4 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-foreground text-sm font-bold tracking-wide uppercase"
          >
            Cancel
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative w-full h-full justify-between pb-8">
          {/* Scanner Visualization Container */}
          <div className="relative flex-1 flex flex-col items-center justify-center w-full min-h-[400px]">
            {/* Radar Visual Effect */}
            <div className="relative w-80 h-80 z-10">
              {/* Concentric Circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-primary/20 bg-primary/5 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] border border-primary/40 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] border border-primary/60 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] h-[25%] border border-primary bg-primary/20 shadow-[0_0_20px_rgba(249,164,6,0.5)] rounded-full"></div>

              {/* Crosshairs */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary/30"></div>
              <div className="absolute left-1/2 top-0 h-full w-[1px] bg-primary/30"></div>

              {/* Scanning Sweep Simulation */}
              <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
                <div className="absolute w-full h-1/2 top-0 bg-gradient-to-t from-primary/40 to-transparent border-b-2 border-primary"></div>
              </div>

              {/* Corner Brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg"></div>
            </div>

            {/* Status Text */}
            <div className="mt-12 text-center z-20 px-6">
              <h1 className="text-primary tracking-widest text-[32px] font-bold leading-tight uppercase drop-shadow-[0_0_10px_rgba(249,164,6,0.5)]">
                Analyzing Item...
              </h1>
              <p className="text-muted-foreground text-base font-normal mt-2 max-w-xs mx-auto">
                Please keep the object steady while we identify material composition.
              </p>
            </div>
          </div>

          {/* Bottom Sensor Array & Progress */}
          <div className="flex flex-col gap-6 p-6 w-full max-w-md mx-auto z-20">
            {/* Progress Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">System Confidence</span>
                <span className="text-lg font-mono font-bold text-foreground">{scanProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-surface-dark rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-primary shadow-[0_0_10px_#f9a406] transition-all duration-300" 
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Active Hardware Indicators */}
            <div className="grid grid-cols-3 gap-3">
              {/* Visual Sensor */}
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-dark border border-primary/50 shadow-[0_0_15px_rgba(249,164,6,0.3)]">
                <span className="material-symbols-outlined text-[28px] text-primary">visibility</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">Visual</span>
                <div className="h-1 w-1 rounded-full bg-primary animate-pulse"></div>
              </div>

              {/* Weight Sensor */}
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-dark border border-white/10 text-muted-foreground">
                <span className="material-symbols-outlined text-[28px]">scale</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Weight</span>
                <div className="h-1 w-1 rounded-full bg-gray-600"></div>
              </div>

              {/* Dimension Sensor */}
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-dark border border-primary/30 text-primary/80">
                <span className="material-symbols-outlined text-[28px]">straighten</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">Size</span>
                <div className="h-1 w-1 rounded-full bg-primary/50"></div>
              </div>
            </div>
          </div>
        </main>

        {/* Decorative industrial footer element */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      </div>
    )
  }

  // Result State - Based on Stitch kiosk_result design
  if (state === 'result' && result) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col selection:bg-primary selection:text-background-dark">
        <div className="w-full max-w-md h-screen flex flex-col relative overflow-hidden mx-auto shadow-2xl">
          {/* Header */}
          <header className="flex items-center justify-between p-6 z-10">
            <div className="flex items-center gap-3 text-foreground">
              <span className="material-symbols-outlined text-primary text-[28px]">recycling</span>
              <span className="font-bold text-lg tracking-tight">EcoBin #{binId}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-500/10 dark:bg-green-500/20 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-medium uppercase tracking-wider text-green-500">Online</span>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full">
            {/* Animated Result Container */}
            <div className="relative mb-10 flex items-center justify-center">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full transform scale-150"></div>

              {/* Icon Circle */}
              <div className="relative w-48 h-48 rounded-full border-[3px] border-primary/30 flex items-center justify-center bg-surface-dark shadow-[0_0_0_0_rgba(249,164,6,0.7)] animate-[pulse_2s_cubic-bezier(0.66,0,0,1)_infinite]">
                <span className="material-symbols-outlined text-primary text-[6rem] drop-shadow-[0_0_15px_rgba(249,164,6,0.5)]">smartphone</span>
              </div>

              {/* Confidence Badge floating */}
              <div className="absolute -bottom-4 bg-surface-dark border border-gray-700 dark:border-gray-800 px-1 py-1 rounded-full shadow-lg">
                <div className="flex items-center gap-2 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
                  <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                  <span className="text-green-500 text-sm font-bold tracking-wide uppercase">High Confidence</span>
                </div>
              </div>
            </div>

            {/* Text Result */}
            <div className="text-center space-y-2 mb-12">
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.2em]">Object Analysis</p>
              <h1 className="text-foreground text-5xl font-bold leading-none tracking-tight">
                Detected: <br />
                <span className="text-primary">{result.item}</span>
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-4">
              <button 
                onClick={handleConfirm}
                className="w-full group relative flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-background-dark h-16 rounded-full transition-all active:scale-[0.98]"
              >
                <span className="text-xl font-bold tracking-wide">Confirm & Recycle</span>
                <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <button 
                onClick={handleRetake}
                className="w-full flex items-center justify-center gap-2 bg-transparent border-2 border-border text-muted-foreground h-14 rounded-full hover:bg-surface-dark transition-colors active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-xl">replay</span>
                <span className="text-base font-bold">Incorrect? Retake Scan</span>
              </button>
            </div>
          </main>

          {/* Footer / Status */}
          <footer className="p-6 pt-0 z-10 w-full">
            <div className="bg-surface-dark rounded-2xl p-4 flex items-center justify-between border border-white/5">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Bin Capacity</span>
                <span className="text-foreground font-bold text-lg">45% Full</span>
              </div>
              {/* Mini visual bar graph for capacity */}
              <div className="flex gap-1 h-8 items-end">
                <div className="w-2 bg-primary rounded-t-sm h-[80%]"></div>
                <div className="w-2 bg-primary/40 rounded-t-sm h-[40%]"></div>
                <div className="w-2 bg-primary/20 rounded-t-sm h-[60%]"></div>
                <div className="w-2 bg-gray-700 rounded-t-sm h-[20%]"></div>
              </div>
            </div>
          </footer>

          {/* Decorative Pattern Background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-5" 
            style={{ 
              backgroundImage: 'radial-gradient(#f9a406 1px, transparent 1px)', 
              backgroundSize: '24px 24px' 
            }}
          ></div>
        </div>
      </div>
    )
  }

  // Success State - With Receipt and Download
  if (state === 'success') {
    const handleDownloadReceipt = () => {
      // Generate receipt data
      const receiptData = {
        binId,
        userName: activeSession?.userName || 'User',
        item: result?.item || 'E-Waste Item',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        points: 50,
        co2Saved: 0.8,
        value: 15
      }

      // Create receipt HTML
      const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Recycling Receipt</title>
          <style>
            body { font-family: 'Space Grotesk', Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #f9a406; }
            .title { font-size: 32px; font-weight: bold; margin: 20px 0; }
            .success { color: #10b981; }
            .info { margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 10px; }
            .stat { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #ddd; }
            .stat:last-child { border-bottom: none; }
            .label { font-weight: 600; }
            .value { color: #f9a406; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">♻️ SOLAR EARTH</div>
            <div class="title">Recycling <span class="success">Receipt</span></div>
          </div>
          
          <div class="info">
            <div class="stat"><span class="label">User:</span><span>${receiptData.userName}</span></div>
            <div class="stat"><span class="label">Item:</span><span>${receiptData.item}</span></div>
            <div class="stat"><span class="label">Bin ID:</span><span>${receiptData.binId}</span></div>
            <div class="stat"><span class="label">Date:</span><span>${receiptData.date}</span></div>
            <div class="stat"><span class="label">Time:</span><span>${receiptData.time}</span></div>
          </div>

          <div class="info">
            <h3 style="margin-top: 0;">Environmental Impact</h3>
            <div class="stat"><span class="label">Points Earned:</span><span class="value">+${receiptData.points}</span></div>
            <div class="stat"><span class="label">CO₂ Saved:</span><span class="value">${receiptData.co2Saved}kg</span></div>
            <div class="stat"><span class="label">Recycling Value:</span><span class="value">$${receiptData.value}</span></div>
          </div>

          <div class="footer">
            <p>Thank you for recycling with Solar Earth!</p>
            <p>Together we're making a difference for our planet.</p>
          </div>
        </body>
        </html>
      `

      // Create blob and download
      const blob = new Blob([receiptHTML], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receipt-${binId}-${Date.now()}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display h-screen w-full flex flex-col overflow-hidden">
        <div className="relative flex flex-col h-full w-full max-w-2xl mx-auto bg-background-light dark:bg-surface-dark shadow-2xl overflow-y-auto">
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(rgba(249, 164, 6, 0.1) 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }}
          ></div>

          {/* Header */}
          <div className="relative z-10 p-8 text-center border-b border-stone-200 dark:border-stone-700">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="material-symbols-outlined text-green-500 text-5xl fill-current">check_circle</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Recycling <span className="text-green-500">Successful!</span>
            </h1>
            <p className="text-stone-600 dark:text-stone-400">
              {activeSession?.userName || 'User'} • Bin {binId}
            </p>
          </div>

          {/* Receipt Content */}
          <div className="relative z-10 flex-1 p-8 space-y-6">
            {/* Item Info */}
            <div className="bg-surface-light dark:bg-surface-dark border border-stone-200 dark:border-stone-700 rounded-xl p-6">
              <h3 className="text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-4">Item Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-medium">Item Type:</span>
                  <span className="text-primary font-bold text-lg">{result?.item || 'Phone'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-medium">Confidence:</span>
                  <span className="text-green-500 font-bold">{result?.confidence || 92}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-medium">Date & Time:</span>
                  <span className="text-foreground">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Rewards */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Rewards Earned</h3>
              <div className="flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary">+50</div>
                  <div className="text-sm text-stone-600 dark:text-stone-400 uppercase tracking-wider">Points</div>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-surface-light dark:bg-surface-dark border border-stone-200 dark:border-stone-700 rounded-xl p-6">
              <h3 className="text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-4">Environmental Impact</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-background-light dark:bg-background-dark rounded-lg">
                  <span className="material-symbols-outlined text-stone-600 dark:text-stone-400 text-3xl mb-2">cloud_off</span>
                  <div className="text-2xl font-bold text-foreground">0.8kg</div>
                  <div className="text-xs text-stone-600 dark:text-stone-400">CO₂ Saved</div>
                </div>
                <div className="text-center p-4 bg-background-light dark:bg-background-dark rounded-lg">
                  <span className="material-symbols-outlined text-primary text-3xl mb-2">bolt</span>
                  <div className="text-2xl font-bold text-foreground">$15</div>
                  <div className="text-xs text-stone-600 dark:text-stone-400">Value</div>
                </div>
                <div className="text-center p-4 bg-background-light dark:bg-background-dark rounded-lg">
                  <span className="material-symbols-outlined text-green-500 text-3xl mb-2">recycling</span>
                  <div className="text-2xl font-bold text-foreground">3</div>
                  <div className="text-xs text-stone-600 dark:text-stone-400">Materials</div>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownloadReceipt}
              className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold rounded-xl h-14 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">download</span>
              Download Receipt
            </button>
          </div>

          {/* Footer with Countdown */}
          <div className="relative z-10 p-6 border-t border-stone-200 dark:border-stone-700 bg-surface-light dark:bg-surface-dark">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wider">Returning to idle</span>
              <span className="text-lg font-bold text-primary tabular-nums">{countdown}s</span>
            </div>
            <div className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear" 
                style={{ width: `${(countdown / 5) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-center text-stone-500 dark:text-stone-400 mt-3">
              ID: K-{binId} • SOLAR EARTH v2.4
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Error State - Based on Stitch kiosk_error design
  if (state === 'error') {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(#f9a406 1px, transparent 1px)', 
            backgroundSize: '32px 32px' 
          }}
        ></div>

        {/* Status Bar Area */}
        <div className="absolute top-0 w-full flex justify-between items-center px-6 py-4 z-20 text-foreground/60 text-sm font-medium uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">wifi</span>
            <span>Online</span>
          </div>
          <div>
            <span>ID: K-{binId}</span>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center justify-center min-h-[80vh] gap-8">
          {/* Large Warning Icon */}
          <div className="relative flex items-center justify-center">
            {/* Glowing effect behind icon */}
            <div className="absolute w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <span className="material-symbols-outlined text-[120px] text-primary relative z-10">warning</span>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-4">
            <h1 className="text-foreground text-4xl md:text-5xl font-bold tracking-tight uppercase leading-tight">
              Bin is Full
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-normal leading-relaxed max-w-xs mx-auto">
              This unit has reached maximum capacity. For your safety and to prevent overflow, please use the next available kiosk.
            </p>
          </div>

          {/* Additional Info Card */}
          <div className="w-full bg-white/5 dark:bg-white/5 border border-border rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-2xl">recycling</span>
            </div>
            <div className="flex-1">
              <h3 className="text-foreground font-bold text-sm">Capacity Status</h3>
              <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-red-500 h-full w-[100%] rounded-full"></div>
              </div>
            </div>
            <span className="text-red-500 font-bold text-sm">100%</span>
          </div>
        </div>

        {/* Bottom Action Area */}
        <div className="fixed bottom-0 w-full max-w-md p-6 z-20 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/90 dark:via-background-dark/90 to-transparent pb-10">
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all text-background-dark text-lg font-bold h-14 rounded-xl shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">map</span>
              Find Nearby Bin
            </button>
            <button 
              onClick={handleCancel}
              className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 text-muted-foreground text-base font-medium h-12 rounded-xl border border-border"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
