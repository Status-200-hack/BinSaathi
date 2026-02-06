'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Dynamic import to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('./leaflet-map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-stone-600 dark:text-stone-400">Loading map...</p>
      </div>
    </div>
  )
})

export interface Bin {
  id: string
  name: string
  lat: number
  lng: number
  status: 'active' | 'warning' | 'full' | 'maintenance'
  fillLevel: number
  address: string
  acceptedItems: string[]
  distance?: number
}

interface InteractiveMapProps {
  bins: Bin[]
  onBinSelect?: (bin: Bin) => void
  selectedBinId?: string
}

// Function to generate bins near a location
function generateNearbyBins(lat: number, lng: number): Bin[] {
  const binTemplates = [
    { name: 'City Center E-Waste Hub', status: 'active' as const, fillLevel: 45, acceptedItems: ['All Electronics', 'Batteries', 'Cables'] },
    { name: 'Shopping Mall Recycling', status: 'warning' as const, fillLevel: 78, acceptedItems: ['Phones', 'Tablets', 'Laptops'] },
    { name: 'University Campus Bin', status: 'active' as const, fillLevel: 32, acceptedItems: ['Batteries', 'Phones', 'Chargers'] },
    { name: 'Tech Park Collection', status: 'full' as const, fillLevel: 95, acceptedItems: ['All Electronics', 'Monitors', 'Keyboards'] },
    { name: 'Community Center Drop-off', status: 'active' as const, fillLevel: 55, acceptedItems: ['Small Electronics', 'Batteries', 'Cables'] },
    { name: 'Metro Station Recycling', status: 'maintenance' as const, fillLevel: 0, acceptedItems: ['Phones', 'Tablets', 'Accessories'] },
    { name: 'Library E-Waste Point', status: 'active' as const, fillLevel: 28, acceptedItems: ['All Electronics', 'Books', 'Batteries'] },
    { name: 'Park Entrance Bin', status: 'warning' as const, fillLevel: 82, acceptedItems: ['Batteries', 'Small Devices', 'Cables'] },
  ]

  // Generate bins within ~2km radius of user location
  return binTemplates.map((template, index) => {
    // Random offset in degrees (roughly 0.01 degree = ~1km)
    const latOffset = (Math.random() - 0.5) * 0.02 // ±1km
    const lngOffset = (Math.random() - 0.5) * 0.02 // ±1km
    
    return {
      id: `bin-${index + 1}`,
      name: template.name,
      lat: lat + latOffset,
      lng: lng + lngOffset,
      status: template.status,
      fillLevel: template.fillLevel,
      address: `${Math.floor(Math.random() * 500) + 1} Street Name, City`,
      acceptedItems: template.acceptedItems,
    }
  })
}

export function InteractiveMap({ bins: initialBins, onBinSelect, selectedBinId }: InteractiveMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [bins, setBins] = useState<Bin[]>(initialBins)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      setIsLoadingLocation(true)
      setIsGettingLocation(true)
      setLocationError(null)
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(newLocation)
          setIsLoadingLocation(false)
          setIsGettingLocation(false)
          setLocationError(null)
          
          // Generate bins near user's actual location
          const nearbyBins = generateNearbyBins(newLocation.lat, newLocation.lng)
          setBins(nearbyBins)
          
          console.log('Location obtained:', newLocation)
        },
        (error) => {
          console.error('Error getting location:', error)
          let errorMessage = 'Unable to get your location'
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access in your browser settings.'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.'
              break
          }
          
          setLocationError(errorMessage)
          setIsLoadingLocation(false)
          setIsGettingLocation(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      setLocationError('Geolocation is not supported by your browser')
      setIsLoadingLocation(false)
      setIsGettingLocation(false)
    }
  }

  useEffect(() => {
    // Auto-request location on mount
    requestLocation()
  }, [])

  if (isLoadingLocation && !userLocation) {
    return (
      <div className="h-full w-full bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-stone-700 dark:text-stone-300 font-semibold mb-2">Getting your location...</p>
          <p className="text-stone-500 dark:text-stone-400 text-sm">Please allow location access</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      {locationError && (
        <Card className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] max-w-sm mx-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-600 text-xl flex-shrink-0">
                error
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                  Location Access Required
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mb-3">
                  {locationError}
                </p>
                <Button 
                  size="sm" 
                  onClick={requestLocation}
                  className="w-full"
                >
                  <span className="material-symbols-outlined text-sm mr-1">refresh</span>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* My Location Button */}
      <div className="absolute right-4 bottom-32 z-[1000]">
        <Button
          onClick={requestLocation}
          disabled={isGettingLocation}
          className="h-12 w-12 rounded-full shadow-lg bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 border-2 border-stone-200 dark:border-stone-600"
          size="icon"
        >
          {isGettingLocation ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          ) : (
            <span className="material-symbols-outlined text-primary text-xl">
              my_location
            </span>
          )}
        </Button>
      </div>
      
      <MapComponent 
        bins={bins}
        userLocation={userLocation}
        onBinSelect={onBinSelect}
        selectedBinId={selectedBinId}
      />
    </div>
  )
}