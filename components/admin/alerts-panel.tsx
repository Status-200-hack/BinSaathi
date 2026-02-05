'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const alerts = [
  {
    id: '1',
    type: 'critical',
    title: 'Bin Full',
    message: 'Downtown Mall bin is at 100% capacity',
    time: '5 minutes ago',
    icon: 'error'
  },
  {
    id: '2',
    type: 'warning',
    title: 'High Fill Level',
    message: 'Central Park bin is at 85% capacity',
    time: '12 minutes ago',
    icon: 'warning'
  },
  {
    id: '3',
    type: 'maintenance',
    title: 'Maintenance Required',
    message: 'Wall Street bin sensor offline',
    time: '1 hour ago',
    icon: 'build'
  },
  {
    id: '4',
    type: 'info',
    title: 'High Activity',
    message: 'Times Square bin has 15 scans today',
    time: '2 hours ago',
    icon: 'info'
  }
]

export function AlertsPanel() {
  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20'
      case 'warning': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
      case 'maintenance': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
      case 'info': return 'text-stone-600 bg-stone-50 dark:bg-stone-700'
      default: return 'text-stone-600 bg-stone-50 dark:bg-stone-700'
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600'
      case 'warning': return 'text-yellow-600'
      case 'maintenance': return 'text-blue-600'
      case 'info': return 'text-stone-600'
      default: return 'text-stone-600'
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-white">
          Alerts & Notifications
        </h2>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg ${getAlertColor(alert.type)}`}
          >
            <div className="flex items-start gap-3">
              <span className={`material-symbols-outlined text-lg ${getIconColor(alert.type)}`}>
                {alert.icon}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-stone-900 dark:text-white">
                  {alert.title}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  {alert.message}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-500 mt-1">
                  {alert.time}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                Resolve
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-600">
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-600 dark:text-stone-400">
            4 active alerts
          </span>
          <Button variant="ghost" size="sm" className="text-xs">
            Mark All Read
          </Button>
        </div>
      </div>
    </Card>
  )
}