'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
          Analytics & Reports
        </h1>
        <div className="flex gap-2">
          <Button variant="outline">
            Export Data
          </Button>
          <Button>
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                Total Items Recycled
              </p>
              <p className="text-3xl font-bold text-stone-900 dark:text-white mt-2">
                15,247
              </p>
              <p className="text-sm text-green-600 mt-1">
                +12% from last month
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <span className="material-symbols-outlined text-green-600 text-2xl">
                recycling
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                CO₂ Saved (Total)
              </p>
              <p className="text-3xl font-bold text-stone-900 dark:text-white mt-2">
                18.7 tons
              </p>
              <p className="text-sm text-green-600 mt-1">
                +18% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <span className="material-symbols-outlined text-blue-600 text-2xl">
                eco
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                Active Users
              </p>
              <p className="text-3xl font-bold text-stone-900 dark:text-white mt-2">
                2,847
              </p>
              <p className="text-sm text-green-600 mt-1">
                +8% from last month
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <span className="material-symbols-outlined text-purple-600 text-2xl">
                people
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                Revenue Generated
              </p>
              <p className="text-3xl font-bold text-stone-900 dark:text-white mt-2">
                $24,891
              </p>
              <p className="text-sm text-green-600 mt-1">
                +15% from last month
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <span className="material-symbols-outlined text-yellow-600 text-2xl">
                attach_money
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recycling Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-4">
            Recycling Trends (Last 6 Months)
          </h3>
          <div className="h-64 bg-stone-50 dark:bg-stone-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl text-stone-400 mb-2 block">
                trending_up
              </span>
              <p className="text-stone-500 dark:text-stone-400 text-sm">
                Chart component would be integrated here
              </p>
              <p className="text-xs text-stone-400 mt-1">
                (Chart.js, Recharts, or similar)
              </p>
            </div>
          </div>
        </Card>

        {/* Device Types */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-4">
            Most Recycled Device Types
          </h3>
          <div className="space-y-4">
            {[
              { type: 'Smartphones', count: 4521, percentage: 35, color: 'bg-blue-500' },
              { type: 'Laptops', count: 2847, percentage: 22, color: 'bg-green-500' },
              { type: 'Tablets', count: 2156, percentage: 17, color: 'bg-purple-500' },
              { type: 'Batteries', count: 1893, percentage: 15, color: 'bg-yellow-500' },
              { type: 'Cables', count: 1430, percentage: 11, color: 'bg-red-500' }
            ].map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 bg-stone-200 dark:bg-stone-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-stone-600 dark:text-stone-400 min-w-[4rem] text-right">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-4">
          Geographic Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-stone-50 dark:bg-stone-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl text-stone-400 mb-2 block">
                public
              </span>
              <p className="text-stone-500 dark:text-stone-400 text-sm">
                Geographic heat map would be here
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-stone-700 dark:text-stone-300">
              Top Performing Locations
            </h4>
            {[
              { location: 'Downtown Mall', items: 2847, co2: 3.2 },
              { location: 'Times Square', items: 2156, co2: 2.8 },
              { location: 'Central Park', items: 1893, co2: 2.1 },
              { location: 'Brooklyn Bridge', items: 1654, co2: 1.9 },
              { location: 'Wall Street', items: 1247, co2: 1.6 }
            ].map((location, index) => (
              <div key={location.location} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-stone-700 dark:text-stone-300">
                    {location.location}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-stone-900 dark:text-white">
                    {location.items.toLocaleString()} items
                  </div>
                  <div className="text-xs text-green-600">
                    {location.co2}kg CO₂ saved
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* User Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-4">
            User Engagement Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-600 dark:text-stone-400">
                Daily Active Users
              </span>
              <span className="font-medium text-stone-900 dark:text-white">
                1,247
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-600 dark:text-stone-400">
                Average Session Duration
              </span>
              <span className="font-medium text-stone-900 dark:text-white">
                4m 32s
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-600 dark:text-stone-400">
                User Retention (7-day)
              </span>
              <span className="font-medium text-stone-900 dark:text-white">
                68%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-600 dark:text-stone-400">
                Average Items per User
              </span>
              <span className="font-medium text-stone-900 dark:text-white">
                5.4
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-4">
            Environmental Impact Summary
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-green-600">
                  eco
                </span>
                <span className="font-medium text-green-800 dark:text-green-400">
                  Carbon Impact
                </span>
              </div>
              <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                18.7 tons CO₂
              </p>
              <p className="text-sm text-green-700 dark:text-green-400">
                Equivalent to planting 935 trees
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-blue-600">
                  water_drop
                </span>
                <span className="font-medium text-blue-800 dark:text-blue-400">
                  Water Saved
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                935,000 L
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Manufacturing water footprint avoided
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}