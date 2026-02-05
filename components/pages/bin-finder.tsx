'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const filterChips = [
  { id: 'batteries', label: 'Batteries', icon: 'battery_charging_full', active: true },
  { id: 'phones', label: 'Phones', icon: 'smartphone', active: false },
  { id: 'laptops', label: 'Laptops', icon: 'laptop_mac', active: false },
  { id: 'cables', label: 'Cables', icon: 'cable', active: false },
]

const mapPins = [
  {
    id: 'main',
    top: '45%',
    left: '55%',
    status: '80% Full',
    isActive: true,
    capacity: 80,
  },
  {
    id: 'secondary-1',
    top: '30%',
    left: '20%',
    status: '45% Full',
    isActive: false,
    capacity: 45,
  },
  {
    id: 'secondary-2',
    top: '60%',
    right: '15%',
    status: '20% Full',
    isActive: false,
    capacity: 20,
  },
]

export function BinFinder() {
  const [activeFilter, setActiveFilter] = useState('batteries')
  const [selectedBin, setSelectedBin] = useState('main')

  return (
    <div className="relative h-screen w-full overflow-hidden bg-stone-100 dark:bg-background-dark">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full bg-gradient-to-br from-stone-50 to-stone-200 dark:from-stone-900 dark:to-stone-800" />
        
        {/* Map Pins */}
        {mapPins.map((pin) => (
          <div
            key={pin.id}
            className={cn(
              'absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group',
              pin.isActive ? 'z-20' : 'z-10'
            )}
            style={{
              top: pin.top,
              left: pin.left,
              right: pin.right,
            }}
            onClick={() => setSelectedBin(pin.id)}
          >
            <div className="relative flex items-center justify-center">
              {pin.isActive && (
                <>
                  <div className="absolute inset-0 bg-primary rounded-full opacity-30 animate-pulse-ring" />
                  <div className="absolute inset-2 bg-primary rounded-full opacity-40 animate-pulse" />
                </>
              )}
              <div className={cn(
                'relative z-10 p-3 rounded-full shadow-lg transition-transform group-hover:scale-110',
                pin.isActive 
                  ? 'bg-primary text-white shadow-amber-glow' 
                  : 'bg-surface-light dark:bg-surface-dark text-primary border-2 border-primary/20'
              )}>
                <span className="material-symbols-outlined text-xl">
                  recycling
                </span>
              </div>
            </div>
            
            {pin.isActive && (
              <div className="mt-1 px-3 py-1 bg-surface-light dark:bg-surface-dark rounded-full shadow-md text-xs font-bold text-text-light dark:text-text-dark whitespace-nowrap border border-stone-200 dark:border-stone-700">
                {pin.status}
              </div>
            )}
          </div>
        ))}

        {/* User Location */}
        <div className="absolute bottom-[40%] left-[30%] w-8 h-8 flex items-center justify-center">
          <div className="absolute w-full h-full bg-blue-500 rounded-full opacity-20 animate-ping" />
          <div className="w-4 h-4 bg-blue-500 border-[3px] border-white rounded-full shadow-sm" />
        </div>
      </div>

      {/* Top Header */}
      <div className="relative z-20 w-full px-4 pt-12 pb-4 flex flex-col gap-3">
        {/* Search Bar */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 bg-white/85 dark:bg-stone-800/85 backdrop-blur-md border border-white/40 dark:border-white/10 h-12 rounded-xl flex items-center px-4 shadow-soft">
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
          <Button variant="glass" size="md" className="h-12 w-12 p-0">
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
                  ? 'bg-primary text-white shadow-amber-glow'
                  : 'bg-white/85 dark:bg-stone-800/85 backdrop-blur-md border border-white/40 dark:border-white/10 text-text-light dark:text-text-dark hover:bg-stone-100 dark:hover:bg-stone-800'
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

      {/* Map Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
        <div className="flex flex-col bg-white/85 dark:bg-stone-800/85 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-xl shadow-soft overflow-hidden">
          <button className="h-10 w-10 flex items-center justify-center text-text-light dark:text-text-dark hover:bg-stone-50 dark:hover:bg-stone-800 active:bg-stone-100 dark:active:bg-stone-700 border-b border-stone-200 dark:border-stone-700">
            <span className="material-symbols-outlined">add</span>
          </button>
          <button className="h-10 w-10 flex items-center justify-center text-text-light dark:text-text-dark hover:bg-stone-50 dark:hover:bg-stone-800 active:bg-stone-100 dark:active:bg-stone-700">
            <span className="material-symbols-outlined">remove</span>
          </button>
        </div>
        <Button variant="glass" size="md" className="h-10 w-10 p-0">
          <span className="material-symbols-outlined">my_location</span>
        </Button>
      </div>

      {/* Bottom Sheet */}
      <div className="absolute bottom-[72px] inset-x-0 z-30">
        <Card className="bg-surface-light dark:bg-surface-dark rounded-t-3xl shadow-2xl pb-4">
          {/* Drag Handle */}
          <div className="w-full flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-5 pb-3">
            <h2 className="text-lg font-bold text-text-light dark:text-text-dark tracking-tight">
              Nearest Smart Bin
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
                <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs font-medium text-center py-0.5 backdrop-blur-sm">
                  250m
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between h-full min-h-[80px]">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-text-light dark:text-text-dark text-lg leading-tight">
                      TSEC Smart Bin
                    </h3>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800 uppercase tracking-wide">
                      Open
                    </span>
                  </div>
                  <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
                    Opposite City Library, Main St.
                  </p>
                </div>
                
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 bg-surface-light dark:bg-surface-dark px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    80% Full
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 bg-surface-light dark:bg-surface-dark px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700">
                    <span className="material-symbols-outlined text-sm">eco</span>
                    +50 Pts
                  </div>
                </div>
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
    </div>
  )
}