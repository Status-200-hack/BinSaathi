'use client'

import { useEffect, useRef, useState } from 'react'

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  onClose: () => void
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [hasFlash, setHasFlash] = useState(false)
  const [flashOn, setFlashOn] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [facingMode])

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)

        // Check if device has flash/torch
        const track = mediaStream.getVideoTracks()[0]
        const capabilities = track.getCapabilities() as any
        setHasFlash('torch' in capabilities)
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please grant camera permissions.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const toggleFlash = async () => {
    if (!stream || !hasFlash) return

    const track = stream.getVideoTracks()[0]
    try {
      await track.applyConstraints({
        // @ts-ignore - torch is not in standard types yet
        advanced: [{ torch: !flashOn }]
      })
      setFlashOn(!flashOn)
    } catch (err) {
      console.error('Error toggling flash:', err)
    }
  }

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsScanning(true)

    // Set canvas dimensions to match video
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      // Try to detect QR code
      try {
        const jsQR = require('jsqr')
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "attemptBoth",
        })
        
        console.log('QR Detection result:', qrCode)
        
        if (qrCode && qrCode.data) {
          // QR Code detected!
          console.log('QR Code detected:', qrCode.data)
          
          // Check if it's a bin QR code URL
          if (qrCode.data.includes('/bin/') && qrCode.data.includes('/connect')) {
            console.log('Bin QR code detected!')
            
            // Extract bin ID from URL
            const urlParts = qrCode.data.split('/bin/')[1]
            const binId = urlParts.split('/connect')[0]
            console.log('Extracted bin ID:', binId)
            
            // Stop camera
            setIsScanning(false)
            stopCamera()
            
            // Create session and notify parent
            import('@/lib/auth/simple-auth').then(({ getCurrentUser }) => {
              import('@/lib/services/session-service').then(({ createBinSession }) => {
                const user = getCurrentUser()
                if (user) {
                  const session = createBinSession(binId, user.id, user.name, user.email, user.avatar)
                  localStorage.setItem('current_bin_session', session.sessionId)
                  
                  // Store success info
                  sessionStorage.setItem('qr_scan_success', JSON.stringify({ binId, timestamp: Date.now() }))
                  
                  // Close camera and let parent handle success
                  onClose()
                } else {
                  alert('Please sign in first')
                  window.location.href = '/sign-in'
                }
              })
            })
            return
          } else {
            console.log('QR code found but not a bin QR code:', qrCode.data)
          }
        } else {
          console.log('No QR code detected in image')
        }
      } catch (error) {
        console.error('QR detection error:', error)
      }
      
      // No QR code detected - close camera
      setTimeout(() => {
        setIsScanning(false)
        stopCamera()
        onClose()
      }, 1000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Gradient overlay for better UI visibility */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />

      {/* Top Controls */}
      <div className="absolute top-0 left-0 w-full z-30 flex items-center justify-between p-5 pt-12">
        {/* Flash Toggle */}
        <button
          onClick={toggleFlash}
          disabled={!hasFlash}
          className={`h-12 w-12 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all ${
            hasFlash 
              ? flashOn 
                ? 'bg-primary/90' 
                : 'bg-white/20 border border-white/30'
              : 'bg-white/10 opacity-50'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">
            {flashOn ? 'flashlight_on' : 'flashlight_off'}
          </span>
        </button>

        {/* Title */}
        <h1 className="text-white text-lg font-bold tracking-wide drop-shadow-lg">
          Camera Scanner
        </h1>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="h-12 w-12 rounded-full flex items-center justify-center text-white bg-white/20 backdrop-blur-md border border-white/30 active:bg-white/30 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      {/* Center Viewfinder */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none pb-32">
        {/* Viewfinder Frame */}
        <div className="relative w-[75%] aspect-[3/4] max-w-sm rounded-[2rem] border-2 border-white/50 shadow-2xl overflow-hidden">
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-white/5" />

          {/* Corner Markers */}
          <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-3xl" />
          <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-3xl" />
          <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-3xl" />
          <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-3xl" />

          {/* Scanning Animation */}
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-white text-sm font-bold">Detecting QR Code...</p>
              </div>
            </div>
          )}
        </div>

        {/* Helper Text */}
        <div className="mt-8 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
          <p className="text-white text-sm font-medium tracking-wide">
            {isScanning ? 'Scanning...' : 'Point at QR code and capture'}
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 w-full z-30 pb-10 px-6">
        <div className="flex items-center justify-center gap-8">
          {/* Switch Camera */}
          <button
            onClick={switchCamera}
            disabled={isScanning}
            className="h-14 w-14 rounded-full flex items-center justify-center text-white bg-white/20 backdrop-blur-md border border-white/30 active:bg-white/30 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-2xl">flip_camera_ios</span>
          </button>

          {/* Test Connect Button (replaces capture for testing) */}
          <button
            onClick={() => {
              setIsScanning(true)
              
              // Simulate QR detection and create session
              import('@/lib/auth/simple-auth').then(({ getCurrentUser }) => {
                import('@/lib/services/session-service').then(({ createBinSession }) => {
                  const user = getCurrentUser()
                  if (user) {
                    const binId = 'BIN001'
                    const session = createBinSession(binId, user.id, user.name, user.email, user.avatar)
                    localStorage.setItem('current_bin_session', session.sessionId)
                    
                    console.log('Session created:', session)
                    
                    // Store success info
                    sessionStorage.setItem('qr_scan_success', JSON.stringify({ binId, timestamp: Date.now() }))
                    
                    // Stop camera and close
                    setTimeout(() => {
                      setIsScanning(false)
                      stopCamera()
                      onClose()
                    }, 500)
                  } else {
                    alert('Please sign in first')
                    setIsScanning(false)
                  }
                })
              })
            }}
            disabled={isScanning || !stream}
            className="relative h-20 w-20 rounded-full flex items-center justify-center disabled:opacity-50 transition-all active:scale-95"
          >
            <div className="absolute inset-0 rounded-full bg-primary/30 backdrop-blur-md border-4 border-primary" />
            <div className={`absolute inset-2 rounded-full transition-all flex items-center justify-center ${
              isScanning ? 'bg-primary animate-pulse' : 'bg-primary'
            }`}>
              <span className="material-symbols-outlined text-background-dark text-3xl">link</span>
            </div>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isScanning}
            className="h-14 w-14 rounded-full flex items-center justify-center text-white bg-white/20 backdrop-blur-md border border-white/30 active:bg-white/30 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>
        
        <p className="text-white text-xs text-center mt-3 opacity-70">
          Tap center button to connect to BIN001
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-40 max-w-sm mx-4">
          <div className="bg-red-500/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-lg">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-2xl flex-shrink-0">error</span>
              <div>
                <p className="font-semibold mb-1">Camera Error</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scanning Animation Styles */}
      <style jsx>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}