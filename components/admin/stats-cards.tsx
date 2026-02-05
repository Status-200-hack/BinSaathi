'use client'

import { Card } from '@/components/ui/card'

const stats = [
  {
    title: 'Total Bins',
    value: '247',
    change: '+12',
    changeType: 'positive' as const,
    icon: 'delete',
    description: 'Active recycling bins'
  },
  {
    title: 'Items Recycled Today',
    value: '1,429',
    change: '+18%',
    changeType: 'positive' as const,
    icon: 'recycling',
    description: 'Devices processed'
  },
  {
    title: 'CO₂ Saved This Month',
    value: '2.4 tons',
    change: '+24%',
    changeType: 'positive' as const,
    icon: 'eco',
    description: 'Environmental impact'
  },
  {
    title: 'Bins Needing Attention',
    value: '8',
    change: '-2',
    changeType: 'positive' as const,
    icon: 'warning',
    description: 'Full or maintenance required'
  }
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-stone-900 dark:text-white mt-1">
                {stat.value}
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary text-xl">
                {stat.icon}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {stat.description}
            </p>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              stat.changeType === 'positive' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              <span className="material-symbols-outlined text-xs">
                {stat.changeType === 'positive' ? 'trending_up' : 'trending_down'}
              </span>
              {stat.change}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}