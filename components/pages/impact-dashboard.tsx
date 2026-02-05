'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'

interface ActivityItem {
  id: string
  title: string
  date: string
  points: number
  icon: string
}

const activityItems: ActivityItem[] = [
  {
    id: '1',
    title: 'Recycled iPhone 8',
    date: 'Today, 10:00 AM',
    points: 200,
    icon: 'smartphone'
  },
  {
    id: '2',
    title: 'Cable Bundle',
    date: 'Yesterday, 4:30 PM',
    points: 50,
    icon: 'cable'
  },
  {
    id: '3',
    title: 'Old MacBook Pro',
    date: 'Oct 24, 2023',
    points: 450,
    icon: 'laptop_mac'
  }
]

const stats = [
  {
    id: 'co2',
    label: 'CO2 Saved',
    value: '12.5',
    unit: 'kg',
    icon: 'eco',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    change: '+12%'
  },
  {
    id: 'energy',
    label: 'Energy Recovered',
    value: '4.5',
    unit: 'kWh',
    icon: 'battery_charging_full',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30'
  },
  {
    id: 'devices',
    label: 'Devices',
    value: '5',
    unit: '',
    icon: 'smartphone',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30'
  },
  {
    id: 'points',
    label: 'Total Points',
    value: '1,200',
    unit: '',
    icon: 'stars',
    color: 'text-primary',
    bgColor: 'bg-primary/20'
  }
]

export function ImpactDashboard() {
  const progressPercentage = 75 // 75% to next level
  const circumference = 2 * Math.PI * 42 // radius = 42
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-gradient-to-br from-background-light to-stone-50 dark:from-background-dark dark:to-stone-900">
      <Header 
        title="Impact Dashboard" 
        showBack 
        className="bg-transparent border-none"
      >
        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary border border-background-light dark:border-background-dark" />
        </Button>
      </Header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6 p-6 pb-24">
        {/* Hero Level Section */}
        <section className="flex flex-col items-center justify-center py-4 relative">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Progress Ring SVG */}
            <svg className="w-full h-full progress-ring" viewBox="0 0 100 100">
              {/* Track */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-stone-200 dark:text-stone-800"
              />
              {/* Progress */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="progress-ring-circle"
              />
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbd083" />
                  <stop offset="100%" stopColor="#f9a406" />
                </linearGradient>
              </defs>
            </svg>

            {/* Avatar & Level */}
            <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-background-light dark:border-background-dark shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary">
                  person
                </span>
              </div>
            </div>

            {/* Floating Level Badge */}
            <div className="absolute -bottom-2 bg-background-light dark:bg-background-dark border border-stone-200 dark:border-stone-700 px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-sm">verified</span>
              <span className="text-xs font-bold text-text-light dark:text-text-dark uppercase tracking-wider">
                Lvl 5
              </span>
            </div>
          </div>

          <div className="mt-4 text-center space-y-1">
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark tracking-tight">
              Solar Guardian
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
              350 / 500 XP to next level
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-4">
          {stats.slice(0, 2).map((stat) => (
            <Card key={stat.id} variant="glass" className="p-5 flex flex-col justify-between h-36 relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className={`absolute -right-4 -top-4 w-20 h-20 ${stat.bgColor} rounded-full blur-xl group-hover:opacity-75 transition-all`} />
              
              <div className="flex items-start justify-between">
                <div className={`p-2 bg-white/5 dark:bg-white/5 rounded-lg ${stat.color}`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                {stat.change && (
                  <span className={`${stat.color} text-xs font-bold bg-current/10 px-2 py-1 rounded-full`}>
                    {stat.change}
                  </span>
                )}
              </div>
              
              <div>
                <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
                  {stat.label}
                </p>
                <p className="text-text-light dark:text-text-dark text-2xl font-bold mt-1">
                  {stat.value}
                  {stat.unit && (
                    <span className="text-base text-stone-500 dark:text-stone-400 ml-0.5">
                      {stat.unit}
                    </span>
                  )}
                </p>
              </div>
            </Card>
          ))}

          {/* Eco-Points Card (Full Width) */}
          <Card variant="glass" className="col-span-2 p-5 flex items-center justify-between relative overflow-hidden group">
            <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-4 z-10">
              <div className="p-3 bg-primary/20 rounded-xl text-primary">
                <span className="material-symbols-outlined">stars</span>
              </div>
              <div>
                <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
                  Eco-Points Balance
                </p>
                <p className="text-text-light dark:text-text-dark text-3xl font-bold tracking-tight">
                  1,250
                </p>
              </div>
            </div>
            
            <Button className="z-10">
              <span>Redeem</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Button>
          </Card>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-text-light dark:text-text-dark text-lg font-bold tracking-tight">
              Recent Activity
            </h3>
            <button className="text-primary text-sm font-medium hover:text-primary-600 transition-colors">
              View All
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {activityItems.map((item) => (
              <Card key={item.id} className="p-4 flex items-center gap-4 bg-stone-50 dark:bg-stone-800/50">
                <div className="w-12 h-12 rounded-full bg-background-light dark:bg-background-dark flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-700">
                  <span className="material-symbols-outlined text-stone-600 dark:text-stone-400">
                    {item.icon}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-text-light dark:text-text-dark font-medium text-base truncate">
                    {item.title}
                  </h4>
                  <p className="text-stone-500 dark:text-stone-400 text-xs">
                    {item.date}
                  </p>
                </div>
                
                <div className="text-right">
                  <span className="block text-primary font-bold text-lg">
                    +{item.points}
                  </span>
                  <span className="text-primary/60 text-xs font-medium">XP</span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}