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
      
      // Get image data as base64
      const imageData = canvas.toDataURL('image/jpeg', 0.9)
      
      // Simulate scanning delay
      setTimeout(() => {
        setIsScanning(false)
        onCapture(imageData)
        stopCamera()
      }, 1500)
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
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_2px_rgba(249,164,6,0.8)] animate-scan" />
            </div>
          )}
        </div>

        {/* Helper Text */}
        <div className="mt-8 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
          <p className="text-white text-sm font-medium tracking-wide">
            {isScanning ? 'Analyzing...' : 'Center device in frame'}
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

          {/* Capture Button */}
          <button
            onClick={capturePhoto}
            disabled={isScanning || !stream}
            className="relative h-20 w-20 rounded-full flex items-center justify-center disabled:opacity-50 transition-all active:scale-95"
          >
            <div className="absolute inset-0 rounded-full bg-white/30 backdrop-blur-md border-4 border-white" />
            <div className={`absolute inset-2 rounded-full transition-all ${
              isScanning ? 'bg-primary animate-pulse' : 'bg-white'
            }`} />
          </button>

          {/* Gallery/Upload */}
          <button
            onClick={onClose}
            disabled={isScanning}
            className="h-14 w-14 rounded-full flex items-center justify-center text-white bg-white/20 backdrop-blur-md border border-white/30 active:bg-white/30 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-2xl">photo_library</span>
          </button>
        </div>
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