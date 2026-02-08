'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DetectionResult } from '@/lib/services/detection-service'

export function Receipt() {
  const router = useRouter()
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get result from sessionStorage
    if (typeof window !== 'undefined') {
      const storedResult = sessionStorage.getItem('detectionResult')
      if (storedResult) {
        try {
          setResult(JSON.parse(storedResult))
        } catch (error) {
          console.error('Failed to parse detection result:', error)
          router.push('/')
        }
      } else {
        router.push('/')
      }
    }
  }, [router])

  const downloadPDF = async () => {
    setIsDownloading(true)
    
    try {
      // Dynamic import to reduce bundle size
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default

      if (!receiptRef.current) return

      // Capture the receipt as canvas with higher quality
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#231c0f' : '#FFFDF5',
        logging: false,
        useCORS: true,
        windowWidth: receiptRef.current.scrollWidth,
        windowHeight: receiptRef.current.scrollHeight
      } as any)

      // Convert to PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pdfWidth = 210 // A4 width in mm
      const pdfHeight = 297 // A4 height in mm
      const margin = 10 // 10mm margin on each side
      
      // Calculate dimensions to fill the page width with margins
      const availableWidth = pdfWidth - (2 * margin)
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      
      // Scale to fit width
      const scaledWidth = availableWidth
      const scaledHeight = (imgHeight * availableWidth) / imgWidth
      
      // Check if height fits on one page
      const availableHeight = pdfHeight - (2 * margin)
      
      if (scaledHeight <= availableHeight) {
        // Fits on one page - center vertically
        const yOffset = (pdfHeight - scaledHeight) / 2
        pdf.addImage(imgData, 'PNG', margin, yOffset, scaledWidth, scaledHeight)
      } else {
        // Too tall - scale to fit height instead
        const heightScaledWidth = (imgWidth * availableHeight) / imgHeight
        const heightScaledHeight = availableHeight
        const xOffset = (pdfWidth - heightScaledWidth) / 2
        pdf.addImage(imgData, 'PNG', xOffset, margin, heightScaledWidth, heightScaledHeight)
      }
      
      pdf.save(`recycling-receipt-${Date.now()}.pdf`)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert('Failed to download PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const shareReceipt = async () => {
    if (!result) return

    const shareData = {
      title: 'My Recycling Receipt',
      text: `I just recycled a ${result.itemName} and earned ${result.pointsEarned} points! 🌍♻️`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.text}\n\nSaved ${result.carbonSaved}kg of CO₂ and recovered ${result.materials.length} materials!`
        )
        alert('Receipt details copied to clipboard!')
      }
    } catch (error) {
      console.error('Failed to share:', error)
    }
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-stone-500 dark:text-stone-400">Loading receipt...</p>
        </div>
      </div>
    )
  }

  const currentDate = new Date()
  const receiptNumber = `REC-${Date.now().toString().slice(-8)}`
  const transactionId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-surface-light dark:bg-surface-dark border-b border-stone-200 dark:border-stone-700 backdrop-blur-md bg-opacity-95">
        <div className="px-4 py-4 flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            <span className="material-symbols-outlined text-stone-600 dark:text-stone-400">
              arrow_back
            </span>
          </button>
          <h1 className="text-lg font-bold text-text-light dark:text-text-dark">
            Recycling Receipt
          </h1>
          <button
            onClick={shareReceipt}
            className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            <span className="material-symbols-outlined text-stone-600 dark:text-stone-400">
              share
            </span>
          </button>
        </div>
      </div>

      {/* Receipt Content */}
      <div className="max-w-2xl mx-auto p-6 pb-24">
        <div ref={receiptRef} className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl overflow-hidden">
          {/* Receipt Header */}
          <div className="bg-gradient-to-br from-primary to-orange-600 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
            </div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-5xl">
                  receipt_long
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Recycling Receipt</h2>
              <p className="text-white/80 text-sm">
                Thank you for helping the planet! 🌍
              </p>
            </div>
          </div>

          {/* Receipt Details */}
          <div className="p-8 space-y-6">
            {/* Transaction Info */}
            <div className="flex justify-between items-start pb-6 border-b border-stone-200 dark:border-stone-700">
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                  Receipt Number
                </p>
                <p className="font-mono font-bold text-text-light dark:text-text-dark">
                  {receiptNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                  Date & Time
                </p>
                <p className="font-medium text-text-light dark:text-text-dark">
                  {currentDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {currentDate.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>

            {/* Item Details */}
            <div>
              <h3 className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-4">
                Item Details
              </h3>
              
              <Card className="p-4 bg-stone-50 dark:bg-stone-800/50">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      {result.itemType === 'smartphone' ? 'smartphone' :
                       result.itemType === 'laptop' ? 'laptop_mac' :
                       result.itemType === 'tablet' ? 'tablet_mac' :
                       result.itemType === 'battery' ? 'battery_charging_full' :
                       result.itemType === 'cable' ? 'cable' :
                       'devices'}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-text-light dark:text-text-dark mb-1">
                      {result.itemName}
                    </h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">
                      Category: {result.itemType.charAt(0).toUpperCase() + result.itemType.slice(1)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                        {result.confidence}% Match
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Rewards Summary */}
            <div>
              <h3 className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-4">
                Rewards Earned
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-primary/5 dark:bg-primary/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">
                      stars
                    </span>
                    <span className="font-medium text-text-light dark:text-text-dark">
                      Eco Points
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    +{result.pointsEarned}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">
                      attach_money
                    </span>
                    <span className="font-medium text-text-light dark:text-text-dark">
                      Recycling Value
                    </span>
                  </div>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    ${result.recyclingValue}
                  </span>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div>
              <h3 className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-4">
                Environmental Impact
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4 text-center bg-green-50 dark:bg-green-900/20">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl mb-2 block">
                    co2
                  </span>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {result.carbonSaved}kg
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300 font-medium mt-1">
                    CO₂ Saved
                  </div>
                </Card>

                <Card className="p-4 text-center bg-blue-50 dark:bg-blue-900/20">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl mb-2 block">
                    recycling
                  </span>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {result.materials.length}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 font-medium mt-1">
                    Materials
                  </div>
                </Card>
              </div>
            </div>

            {/* Materials Recovered */}
            <div>
              <h3 className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">
                Materials Recovered
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.materials.map((material, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-sm rounded-full font-medium"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>

            {/* Transaction ID */}
            <div className="pt-6 border-t border-stone-200 dark:border-stone-700">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Transaction ID
                </span>
                <span className="font-mono text-sm text-stone-600 dark:text-stone-400">
                  {transactionId}
                </span>
              </div>
            </div>

            {/* Footer Message */}
            <div className="pt-6 border-t border-stone-200 dark:border-stone-700 text-center">
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">
                🌱 Every device recycled makes a difference!
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-500">
                Keep up the great work and continue building a sustainable future.
              </p>
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="bg-stone-50 dark:bg-stone-800/50 px-8 py-4 text-center border-t border-stone-200 dark:border-stone-700">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Smart E-Waste Bin System • Powered by AI
            </p>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
              www.ecorecycle.app
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button 
            onClick={downloadPDF}
            disabled={isDownloading}
            className="w-full"
            size="xl"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating PDF...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined mr-2">download</span>
                Download as PDF
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="secondary"
              onClick={() => router.push('/scanner')}
              className="w-full"
            >
              <span className="material-symbols-outlined mr-2">recycling</span>
              Recycle Another
            </Button>
            <Button 
              variant="secondary"
              onClick={() => router.push('/')}
              className="w-full"
            >
              <span className="material-symbols-outlined mr-2">home</span>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
