import { BottomNav } from '@/components/layout/bottom-nav'
import { Profile } from '@/components/pages/profile'

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen">
      <Profile />
      <BottomNav />
    </div>
  )
}