import { BottomNav } from '@/components/layout/bottom-nav'

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen">
      <div className="min-h-screen bg-background-light dark:bg-background-dark p-6 pt-16">
        <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">
          Profile
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mt-2">
          Coming soon...
        </p>
      </div>
      <BottomNav />
    </div>
  )
}