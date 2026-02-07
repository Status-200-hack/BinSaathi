import { BottomNav } from '@/components/layout/bottom-nav'
import { Rewards } from '@/components/pages/rewards'

export default function RewardsPage() {
  return (
    <div className="relative min-h-screen">
      <Rewards />
      <BottomNav />
    </div>
  )
}