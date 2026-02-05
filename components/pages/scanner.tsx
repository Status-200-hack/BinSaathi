'use client'

import { DetectionFlow } from '@/components/scanner/detection-flow'
import { DetectionResult } from '@/lib/services/detection-service'
import { useRouter } from 'next/navigation'

export function Scanner() {
  const router = useRouter()

  const handleDetectionComplete = (result: DetectionResult & { id: string }) => {
    // Store result in sessionStorage for success page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('detectionResult', JSON.stringify(result))
    }
    router.push('/scanner/success')
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <DetectionFlow 
        onComplete={handleDetectionComplete}
        onCancel={handleCancel}
      />
    </div>
  )
}