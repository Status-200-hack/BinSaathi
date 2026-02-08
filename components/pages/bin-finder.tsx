'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { InteractiveMap, type Bin } from '@/components/map/interactive-map'

const filterChips = [
  { id: 'all', label: 'All Items', icon: 'recycling' },
  { id: 'batteries', label: 'Batteries', icon: 'battery_charging_full' },
  { id: 'phones', label: 'Phones', icon: 'smartphone' },
  { id: 'laptops', label: 'Laptops', icon: 'laptop_mac' },
  { id: 'cables', label: 'Cables', icon: 'cable' },
]

export function BinFinder() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null)
  const [sortedBins, setSortedBins] = useState<Bin[]>([])

  const handleBinSelect = useCallback((bin: Bin) => {
    setSelectedBin(bin)
  }, [])

  const handleDistanceUpdate = useCallback((binsWithDistance: Bin[]) => {
    setSortedBins(binsWithDistance)
  }, [])

  const navigateToBin = (bin: Bin) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${bin.lat},${bin.lng}&travelmode=walking`
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS) {
      const appleMapsUrl = `maps://maps.apple.com/?daddr=${bin.lat},${bin.lng}&dirflg=w`
      window.location.href = appleMapsUrl
      setTimeout(() => {
        window.open(googleMapsUrl, '_blank')
      }, 500)
    } else {
      window.open(googleMapsUrl, '_blank')
    }
  }

  const formatDistance = (distance?: number) => {
    if (!distance) return ''
    if (distance < 1000) {
      return `${distance}m`
    }
    return `${(distance / 1000).toFixed(1)}km`
  }

  const filteredBins = sortedBins.filter(bin => {
    if (activeFilter === 'all') return true
    return bin.acceptedItems.some(item => 
      item.toLowerCase().includes(activeFilter.toLowerCase())
    )
  })

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

  // Show bin details modal
  if (selectedBin) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-surface-light dark:bg-surface-dark border-b border-stone-200 dark:border-stone-700">
          <div className="px-4 py-4 flex items-center gap-3">
            <button
              onClick={() => setSelectedBin(null)}
              className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              <span className="material-symbols-outlined text-stone-600 dark:text-stone-400">
                arrow_back
              </span>
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-text-light dark:text-text-dark">
                Bin Details
              </h1>
              {selectedBin.distance && (
                <p className="text-sm text-primary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">near_me</span>
                  {formatDistance(selectedBin.distance)} away
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Bin Image/Map Preview */}
          <Card className="overflow-hidden">
            <div className="relative h-48 bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
              <img 
                src="/bin-image.png" 
                alt={selectedBin.name}
                className="w-full h-full object-cover"
              />
              {selectedBin.distance && (
                <div className="absolute bottom-4 left-4 bg-primary/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full font-bold text-sm">
                  {formatDistance(selectedBin.distance)}
                </div>
              )}
              <div className={cn(
                'absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border',
                getStatusColor(selectedBin.status)
              )}>
                {getStatusText(selectedBin.status)}
              </div>
            </div>
          </Card>

          {/* Bin Info */}
          <Card className="p-4">
            <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
              {selectedBin.name}
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-stone-600 dark:text-stone-400">
                <span className="material-symbols-outlined text-lg">location_on</span>
                <span>{selectedBin.address}</span>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    selectedBin.fillLevel > 75 ? 'bg-red-500' :
                    selectedBin.fillLevel > 50 ? 'bg-yellow-500' : 'bg-green-500'
                  )} />
                  <span className="text-stone-600 dark:text-stone-400">
                    {selectedBin.fillLevel}% Full
                  </span>
                </div>
                <div className="flex items-center gap-1 text-primary font-semibold">
                  <span className="material-symbols-outlined text-lg">eco</span>
                  <span>+50 Points</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Accepted Items */}
          <Card className="p-4">
            <h3 className="text-sm font-bold text-text-light dark:text-text-dark mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              Accepted Items
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedBin.acceptedItems.map((item) => (
                <span 
                  key={item}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium border border-primary/20"
                >
                  {item}
                </span>
              ))}
            </div>
          </Card>

          {/* Navigate Button */}
          <Button 
            className="w-full" 
            size="xl"
            onClick={() => navigateToBin(selectedBin)}
          >
            <span className="material-symbols-outlined mr-2">navigation</span>
            Get Directions
          </Button>
        </div>
      </div>
    )
  }

  // Main map view with bottom sheet
  return (
    <div className="relative h-screen w-full overflow-hidden bg-stone-100 dark:bg-background-dark">
      {/* Map Container */}
      <div className="absolute inset-0 z-0">
        <InteractiveMap 
          bins={sortedBins}
          onBinSelect={handleBinSelect}
          selectedBinId={(selectedBin as Bin | null)?.id}
          onDistanceUpdate={handleDistanceUpdate}
        />
      </div>

      {/* Top Search Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
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
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-3 pb-2">
          {filterChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition-all shadow-md',
                chip.id === activeFilter
                  ? 'bg-primary text-white'
                  : 'bg-white/95 dark:bg-stone-800/95 backdrop-blur-md border border-white/40 dark:border-white/10 text-text-light dark:text-text-dark hover:bg-white dark:hover:bg-stone-800'
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

      {/* Bottom Sheet with Bins List */}
      <div className="absolute bottom-0 left-0 right-0 z-30 max-h-[45vh]">
        <div className="bg-surface-light dark:bg-surface-dark rounded-t-3xl shadow-2xl">
          {/* Drag Handle */}
          <div className="w-full flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-5 pb-3">
            <h2 className="text-lg font-bold text-text-light dark:text-text-dark">
              Nearest Smart Bins
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {filteredBins.length} bins found near you
            </p>
          </div>

          {/* Bins List - Scrollable */}
          <div className="overflow-y-auto max-h-[calc(45vh-100px)] px-5 pb-24">
            {filteredBins.length === 0 ? (
              <div className="py-8 text-center">
                <span className="material-symbols-outlined text-4xl text-stone-300 dark:text-stone-700 mb-2">
                  location_off
                </span>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  No bins found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBins.map((bin, index) => (
                  <Card 
                    key={bin.id}
                    className={cn(
                      "p-4 cursor-pointer transition-all hover:shadow-lg",
                      index === 0 && "border-2 border-primary"
                    )}
                    onClick={() => handleBinSelect(bin)}
                  >
                    <div className="flex gap-3">
                      {/* Bin Image */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative bg-gradient-to-br from-teal-500 to-teal-600">
                        <img 
                          src="/bin-image.png" 
                          alt={bin.name}
                          className="w-full h-full object-cover"
                        />
                        {bin.distance && (
                          <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                            {formatDistance(bin.distance)}
                          </div>
                        )}
                      </div>

                      {/* Bin Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-text-light dark:text-text-dark text-base leading-tight">
                            {bin.name}
                          </h3>
                          <span className={cn(
                            'text-xs font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide flex-shrink-0',
                            getStatusColor(bin.status)
                          )}>
                            {getStatusText(bin.status)}
                          </span>
                        </div>
                        
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-2 line-clamp-1">
                          {bin.address}
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-xs">
                            <div className={cn(
                              'w-2 h-2 rounded-full',
                              bin.fillLevel > 75 ? 'bg-red-500' :
                              bin.fillLevel > 50 ? 'bg-yellow-500' : 'bg-green-500'
                            )} />
                            <span className="text-stone-600 dark:text-stone-400 font-medium">
                              {bin.fillLevel}% Full
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                            <span className="material-symbols-outlined text-sm">eco</span>
                            <span>+50 Pts</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigate Button - Only for first bin */}
                    {index === 0 && (
                      <Button 
                        className="w-full mt-3" 
                        size="lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigateToBin(bin)
                        }}
                      >
                        <span className="material-symbols-outlined mr-2">navigation</span>
                        Navigate
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
