'use client'

import { Card } from '@/components/ui/card'
import { BinMap } from '@/components/admin/bin-map'
import { StatsCards } from '@/components/admin/stats-cards'
import { RecentActivity } from '@/components/admin/recent-activity'
import { AlertsPanel } from '@/components/admin/alerts-panel'

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
          Dashboard Overview
        </h1>
        <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
          <span className="material-symbols-outlined text-green-600">
            circle
          </span>
          Last updated: 2 minutes ago
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bin Map - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-white">
                Bin Locations & Status
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-stone-600 dark:text-stone-400">Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-stone-600 dark:text-stone-400">75%+ Full</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-stone-600 dark:text-stone-400">Needs Attention</span>
                </div>
              </div>
            </div>
            <BinMap />
          </Card>
        </div>

        {/* Alerts Panel */}
        <div>
          <AlertsPanel />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}