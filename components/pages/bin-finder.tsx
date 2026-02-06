'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { InteractiveMap, type Bin } from '@/components/map/interactive-map'

const filterChips = [
  { id: 'all', label: 'All Items', icon: 'recycling', active: true },
  { id: 'batteries', label: 'Batteries', icon: 'battery_charging_full', active: false },
  { id: 'phones', label: 'Phones', icon: 'smartphone', active: false },
  { id: 'laptops', label: 'Laptops', icon: 'laptop_mac', active: false },
  { id: 'cables', label: 'Cables', icon: 'cable', active: false },
]

// Mock bin data - will be replaced by bins near user's actual location
const mockBins: Bin[] = []

export function BinFinder() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null)

  const handleBinSelect = (bin: Bin) => {
    setSelectedBin(bin)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'full': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'maintenance': return 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700'
      default: return 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Open'
      case 'warning': return 'Almost Full'
      case 'full': return 'Full'
      case 'maintenance': return 'Maintenance'
      default: return 'Unknown'
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-stone-100 dark:bg-background-dark">
      {/* Map Container */}
      <div className="absolute inset-0 z-0">
        <InteractiveMap 
          bins={mockBins}
          onBinSelect={handleBinSelect}
          selectedBinId={selectedBin?.id}
        />
      </div>

      {/* Top Header */}
      <div className="relative z-20 w-full px-4 pt-12 pb-4 flex flex-col gap-3">
        {/* Search Bar */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 bg-white/95 dark:bg-stone-800/95 backdrop-blur-md border border-white/40 dark:border-white/10 h-12 rounded-xl flex items-center px-4 shadow-lg">
            <span className="material-symbols-outlined text-stone-500 mr-3">search</span>
            <input
              className="bg-transparent border-none outline-none text-text-light dark:text-text-dark placeholder-stone-500 flex-1 w-full focus:ring-0 p-0 text-base"
              placeholder="Find a recycling point..."
              type="text"
            />
            <button className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-stone-500">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
          <Button variant="glass" size="md" className="h-12 w-12 p-0 bg-white/95 dark:bg-stone-800/95">
            <span className="material-symbols-outlined">account_circle</span>
          </Button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 pl-1">
          {filterChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition-all',
                chip.id === activeFilter
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white/95 dark:bg-stone-800/95 backdrop-blur-md border border-white/40 dark:border-white/10 text-text-light dark:text-text-dark hover:bg-stone-100 dark:hover:bg-stone-800'
              )}
            >
              <span className="material-symbols-outlined text-lg">
                {chip.icon}
              </span>
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Sheet */}
      {selectedBin && (
        <div className="absolute bottom-[72px] inset-x-0 z-30">
          <Card className="bg-surface-light dark:bg-surface-dark rounded-t-3xl shadow-2xl pb-4">
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 pb-3">
              <h2 className="text-lg font-bold text-text-light dark:text-text-dark tracking-tight">
                {selectedBin.distance ? `${selectedBin.distance}m away` : 'Selected Bin'}
              </h2>
            </div>

            {/* Main Card */}
            <div className="px-5">
              <div className="bg-background-light dark:bg-background-dark border border-stone-200 dark:border-stone-700 rounded-2xl p-4 flex gap-4 items-start shadow-sm">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl bg-stone-100 dark:bg-stone-800 overflow-hidden flex-shrink-0 relative">
                  <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-stone-500 dark:text-stone-400 text-2xl">
                      recycling
                    </span>
                  </div>
                  {selectedBin.distance && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs font-medium text-center py-0.5 backdrop-blur-sm">
                      {selectedBin.distance}m
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between h-full min-h-[80px]">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-text-light dark:text-text-dark text-lg leading-tight">
                        {selectedBin.name}
                      </h3>
                      <span className={cn(
                        'text-xs font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide',
                        getStatusColor(selectedBin.status)
                      )}>
                        {getStatusText(selectedBin.status)}
                      </span>
                    </div>
                    <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
                      {selectedBin.address}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 bg-surface-light dark:bg-surface-dark px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700">
                      <span className={cn(
                        'w-2 h-2 rounded-full',
                        selectedBin.fillLevel > 75 ? 'bg-red-500' :
                        selectedBin.fillLevel > 50 ? 'bg-yellow-500' : 'bg-green-500'
                      )} />
                      {selectedBin.fillLevel}% Full
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 bg-surface-light dark:bg-surface-dark px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700">
                      <span className="material-symbols-outlined text-sm">eco</span>
                      +50 Pts
                    </div>
                  </div>
                </div>
              </div>

              {/* Accepted Items */}
              <div className="mt-3 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
                <div className="text-xs font-semibold text-stone-600 dark:text-stone-400 mb-2">
                  Accepts:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBin.acceptedItems.map((item) => (
                    <span 
                      key={item}
                      className="text-xs px-2 py-1 bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-md border border-stone-200 dark:border-stone-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button className="mt-4 w-full" size="xl">
                <span className="material-symbols-outlined">navigation</span>
                Navigate
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}