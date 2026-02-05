'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const activities = [
  {
    id: '1',
    type: 'scan',
    user: 'Sarah Chen',
    action: 'scanned iPhone 12 Pro',
    location: 'Downtown Mall',
    points: 120,
    time: '2 minutes ago',
    icon: 'smartphone'
  },
  {
    id: '2',
    type: 'scan',
    user: 'Mike Johnson',
    action: 'scanned Dell Laptop',
    location: 'Central Park',
    points: 350,
    time: '5 minutes ago',
    icon: 'laptop_mac'
  },
  {
    id: '3',
    type: 'maintenance',
    user: 'System',
    action: 'bin emptied',
    location: 'Times Square',
    points: 0,
    time: '15 minutes ago',
    icon: 'build'
  },
  {
    id: '4',
    type: 'scan',
    user: 'Emma Wilson',
    action: 'scanned iPad Air',
    location: 'Brooklyn Bridge',
    points: 180,
    time: '18 minutes ago',
    icon: 'tablet_mac'
  },
  {
    id: '5',
    type: 'achievement',
    user: 'David Lee',
    action: 'earned "Eco Champion" badge',
    location: 'Profile',
    points: 500,
    time: '25 minutes ago',
    icon: 'military_tech'
  }
]

export function RecentActivity() {
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'scan': return 'text-green-600 bg-green-50 dark:bg-green-900/20'
      case 'maintenance': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
      case 'achievement': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
      default: return 'text-stone-600 bg-stone-50 dark:bg-stone-700'
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-white">
          Recent Activity
        </h2>
        <Button variant="outline" size="sm">
          View All Activity
        </Button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-stone-50 dark:hover:bg-stone-700 rounded-lg transition-colors">
            <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
              <span className="material-symbols-outlined text-lg">
                {activity.icon}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-stone-900 dark:text-white text-sm">
                  {activity.user}
                </span>
                <span className="text-stone-600 dark:text-stone-400 text-sm">
                  {activity.action}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  {activity.location}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  {activity.time}
                </span>
              </div>
            </div>
            
            {activity.points > 0 && (
              <div className="text-right">
                <span className="text-sm font-medium text-green-600">
                  +{activity.points}
                </span>
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  points
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-600">
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-600 dark:text-stone-400">
            Showing last 5 activities
          </span>
          <span className="text-stone-500 dark:text-stone-500">
            Auto-refresh: ON
          </span>
        </div>
      </div>
    </Card>
  )
}