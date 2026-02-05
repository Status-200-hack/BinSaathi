import { ImpactDashboard } from '@/components/pages/impact-dashboard'
import { BottomNav } from '@/components/layout/bottom-nav'

export default function ImpactPage() {
  return (
    <div className="relative min-h-screen">
      <ImpactDashboard />
      <BottomNav />
    </div>
  )
}