import { BinFinder } from '@/components/pages/bin-finder'
import { BottomNav } from '@/components/layout/bottom-nav'

export default function RootPage() {
  return (
    <div className="relative min-h-screen">
      <BinFinder />
      <BottomNav />
    </div>
  )
}