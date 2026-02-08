'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getCurrentUser, signOut } from '@/lib/auth/simple-auth'

interface UserStats {
  co2Saved: number
  totalItems: number
  points: number
  badges: number
}

interface RecyclingHistoryItem {
  id: string
  itemName: string
  icon: string
  location: string
  date: string
}

const userStats: UserStats = {
  co2Saved: 12.4,
  totalItems: 15,
  points: 450,
  badges: 3
}

const recyclingHistory: RecyclingHistoryItem[] = [
  {
    id: '1',
    itemName: 'iPhone 12 Pro',
    icon: 'smartphone',
    location: 'Smart Bin • San Francisco',
    date: 'Oct 24'
  },
  {
    id: '2',
    itemName: 'AA Batteries (12pcs)',
    icon: 'battery_charging_full',
    location: 'Central Mall Hub • Lobby',
    date: 'Oct 18'
  },
  {
    id: '3',
    itemName: 'Old Headphones',
    icon: 'headphones',
    location: 'Library Point • Entrance',
    date: 'Oct 12'
  }
]

const settingsMenu = [
  { icon: 'person_outline', label: 'Edit Profile', action: 'edit-profile' },
  { icon: 'history_edu', label: 'Rewards History', action: 'rewards-history' },
  { icon: 'language', label: 'Language', action: 'language', badge: 'EN' },
  { icon: 'accessibility_new', label: 'Accessibility', action: 'accessibility' },
  { icon: 'help_outline', label: 'Help & Support', action: 'help' },
]

export function Profile() {
  const router = useRouter()
  const [userName, setUserName] = useState('Guest User')
  const [userAvatar, setUserAvatar] = useState('https://ui-avatars.com/api/?name=Guest+User&background=f9a406&color=231c0f&size=200')
  const [userLevel] = useState('Expert Recycler')

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setUserName(user.name)
      setUserAvatar(user.avatar)
    }
  }, [])

  const handleSettingClick = (action: string) => {
    console.log('Setting clicked:', action)
  }

  const handleLogout = () => {
    signOut()
    router.push('/sign-in')
  }

  return (
    <div className="relative min-h-screen w-full overflow-auto bg-background-light dark:bg-background-dark pb-24">
      {/* Header with Avatar */}
      <header className="pt-14 px-6 pb-8 flex flex-col items-center relative">
        {/* Settings Button */}
        <div className="absolute top-14 right-6">
          <button className="w-10 h-10 flex items-center justify-center bg-white dark:bg-stone-800 rounded-full border border-stone-200 dark:border-stone-700 shadow-sm active:bg-stone-50 dark:active:bg-stone-700 transition-colors">
            <span className="material-symbols-outlined text-stone-600 dark:text-stone-400 text-[22px]">
              settings
            </span>
          </button>
        </div>

        {/* Avatar with Halo Effect */}
        <div className="relative group">
          <div className="size-32 rounded-full bg-white dark:bg-stone-800 p-1 shadow-lg shadow-primary/10">
            <img
              alt="User avatar"
              className="w-full h-full object-cover rounded-full border-2 border-stone-200 dark:border-stone-700"
              src={userAvatar}
            />
          </div>
          {/* Verified Badge */}
          <div className="absolute -bottom-1 -right-1 size-7 bg-white dark:bg-stone-800 rounded-full flex items-center justify-center shadow-md border border-stone-200 dark:border-stone-700">
            <span className="material-symbols-outlined text-primary text-[16px] fill-current">
              verified
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-5 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-text-light dark:text-text-dark">
            {userName}
          </h1>
          <div className="mt-2 inline-flex items-center px-3 py-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full shadow-sm">
            <div className="size-2 rounded-full bg-primary mr-2"></div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-stone-600 dark:text-stone-400">
              {userLevel}
            </span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="px-6 grid grid-cols-2 gap-3 mb-10">
        <Card className="p-4 flex flex-col justify-between h-28">
          <span className="material-symbols-outlined text-stone-500 dark:text-stone-400 text-[20px]">
            co2
          </span>
          <div>
            <p className="text-xl font-bold text-text-light dark:text-text-dark">
              {userStats.co2Saved}kg
            </p>
            <p className="text-[10px] font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wider">
              CO2 Saved
            </p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between h-28">
          <span className="material-symbols-outlined text-stone-500 dark:text-stone-400 text-[20px]">
            shopping_bag
          </span>
          <div>
            <p className="text-xl font-bold text-text-light dark:text-text-dark">
              {userStats.totalItems}
            </p>
            <p className="text-[10px] font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wider">
              Total Items
            </p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between h-28">
          <span className="material-symbols-outlined text-stone-500 dark:text-stone-400 text-[20px]">
            toll
          </span>
          <div>
            <p className="text-xl font-bold text-text-light dark:text-text-dark">
              {userStats.points}
            </p>
            <p className="text-[10px] font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wider">
              Points
            </p>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between h-28">
          <span className="material-symbols-outlined text-stone-500 dark:text-stone-400 text-[20px]">
            military_tech
          </span>
          <div>
            <p className="text-xl font-bold text-text-light dark:text-text-dark">
              {userStats.badges}
            </p>
            <p className="text-[10px] font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wider">
              Badges
            </p>
          </div>
        </Card>
      </section>

      {/* Recycling History */}
      <section className="px-6 mb-10">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
            Recycling History
          </h3>
          <button className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-widest hover:text-primary transition-colors">
            View All
          </button>
        </div>

        {/* Timeline */}
        <div className="space-y-0">
          {recyclingHistory.map((item, index) => (
            <div key={item.id} className="flex gap-4 relative">
              {/* Timeline Icon */}
              <div className="flex flex-col items-center relative">
                <div className="size-12 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    {item.icon}
                  </span>
                </div>
                {/* Timeline Line */}
                {index < recyclingHistory.length - 1 && (
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[1px] h-full bg-stone-200 dark:bg-stone-700"></div>
                )}
              </div>

              {/* Content */}
              <div className={cn(
                'flex-1',
                index < recyclingHistory.length - 1 ? 'pb-8' : 'pb-4'
              )}>
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-text-light dark:text-text-dark">
                    {item.itemName}
                  </h4>
                  <span className="text-[10px] text-stone-600 dark:text-stone-400 font-medium">
                    {item.date}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Account & Settings */}
      <section className="px-6 mb-12">
        <h3 className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-widest mb-4">
          Account & Settings
        </h3>

        <Card className="overflow-hidden">
          {settingsMenu.map((item, index) => (
            <button
              key={item.action}
              onClick={() => handleSettingClick(item.action)}
              className={cn(
                'w-full flex items-center gap-4 px-4 py-4 active:bg-stone-50 dark:active:bg-stone-800 text-left transition-colors',
                index < settingsMenu.length - 1 && 'border-b border-stone-200 dark:border-stone-700'
              )}
            >
              <span className="material-symbols-outlined text-stone-600 dark:text-stone-400 text-[22px]">
                {item.icon}
              </span>
              <span className="flex-1 font-medium text-sm text-text-light dark:text-text-dark">
                {item.label}
              </span>
              {item.badge ? (
                <span className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase mr-1">
                  {item.badge}
                </span>
              ) : (
                <span className="material-symbols-outlined text-stone-300 dark:text-stone-600">
                  chevron_right
                </span>
              )}
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 active:bg-red-50 dark:active:bg-red-900/20 text-left transition-colors"
          >
            <span className="material-symbols-outlined text-red-500 text-[22px]">
              logout
            </span>
            <span className="flex-1 font-medium text-sm text-red-500">
              Logout
            </span>
          </button>
        </Card>
      </section>
    </div>
  )
}