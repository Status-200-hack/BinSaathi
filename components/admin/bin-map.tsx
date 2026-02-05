'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

// Mock bin data for demo
const mockBins = [
  { id: '1', name: 'Downtown Mall', lat: 40.7128, lng: -74.0060, status: 'active', fillLevel: 45 },
  { id: '2', name: 'Central Park', lat: 40.7829, lng: -73.9654, status: 'warning', fillLevel: 85 },
  { id: '3', name: 'Brooklyn Bridge', lat: 40.7061, lng: -73.9969, status: 'full', fillLevel: 100 },
  { id: '4', name: 'Times Square', lat: 40.7580, lng: -73.9855, status: 'active', fillLevel: 32 },
  { id: '5', name: 'Wall Street', lat: 40.7074, lng: -74.0113, status: 'maintenance', fillLevel: 0 },
]

export function BinMap() {
  const [selectedBin, setSelectedBin] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'full': return 'bg-red-500'
      case 'maintenance': return 'bg-stone-400'
      default: return 'bg-stone-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'warning': return '75%+ Full'
      case 'full': return 'Full - Needs Emptying'
      case 'maintenance': return 'Under Maintenance'
      default: return 'Unknown'
    }
  }

  return (
    <div className="space-y-4">
      {/* Map Placeholder */}
      <div className="relative h-96 bg-stone-100 dark:bg-stone-700 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-stone-400 mb-2 block">
              map
            </span>
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              Interactive map would be integrated here
            </p>
            <p className="text-xs text-stone-400 mt-1">
              (Google Maps, Mapbox, or similar)
            </p>
          </div>
        </div>
        
        {/* Mock bin markers */}
        {mockBins.map((bin, index) => (
          <div
            key={bin.id}
            className={`absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-2 -translate-y-2 ${getStatusColor(bin.status)}`}
            style={{
              left: `${20 + index * 15}%`,
              top: `${30 + (index % 2) * 20}%`
            }}
            onClick={() => setSelectedBin(selectedBin === bin.id ? null : bin.id)}
          >
            {selectedBin === bin.id && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-stone-800 p-3 rounded-lg shadow-lg border border-stone-200 dark:border-stone-600 min-w-48 z-10">
                <h4 className="font-semibold text-stone-900 dark:text-white text-sm">
                  {bin.name}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  {getStatusText(bin.status)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-stone-200 dark:bg-stone-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        bin.fillLevel > 80 ? 'bg-red-500' : 
                        bin.fillLevel > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${bin.fillLevel}%` }}
                    />
                  </div>
                  <span className="text-xs text-stone-600 dark:text-stone-400">
                    {bin.fillLevel}%
                  </span>
                </div>
                <Button size="sm" className="w-full mt-2 text-xs">
                  View Details
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bin List */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">
          Quick Status Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {mockBins.slice(0, 4).map((bin) => (
            <div key={bin.id} className="flex items-center justify-between p-2 bg-stone-50 dark:bg-stone-700 rounded">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(bin.status)}`} />
                <span className="text-sm text-stone-700 dark:text-stone-300">
                  {bin.name}
                </span>
              </div>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {bin.fillLevel}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}