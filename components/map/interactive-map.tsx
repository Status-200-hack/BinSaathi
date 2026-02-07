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
  onDistanceUpdate?: (bins: Bin[]) => void
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

export function InteractiveMap({ bins: initialBins, onBinSelect, selectedBinId, onDistanceUpdate }: InteractiveMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [bins, setBins] = useState<Bin[]>(initialBins)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  const checkPermissionStatus = async () => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
        console.log('Permission status:', result.state)
        
        if (result.state === 'denied') {
          setPermissionDenied(true)
          setLocationError('Location permission is blocked. Please enable it in your browser settings.')
          return false
        }
        
        setPermissionDenied(false)
        return true
      } catch (error) {
        console.log('Permission API not supported, will try direct request')
        return true
      }
    }
    return true
  }

  const requestLocation = async () => {
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your browser')
      setIsLoadingLocation(false)
      setIsGettingLocation(false)
      return
    }

    // Check permission status first
    const canRequest = await checkPermissionStatus()
    if (!canRequest && permissionDenied) {
      return // Don't try to request if already denied
    }

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
        setPermissionDenied(false)
        
        // Generate bins near user's actual location
        const nearbyBins = generateNearbyBins(newLocation.lat, newLocation.lng)
        setBins(nearbyBins)
        
        console.log('Location obtained:', newLocation)
      },
      (error) => {
        console.error('Error getting location:', error)
        let errorMessage = 'Unable to get your location'
        let isDenied = false
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            isDenied = true
            errorMessage = 'Location permission denied. To use this feature:\n\n1. Tap the lock icon in your browser address bar\n2. Enable Location permissions\n3. Refresh the page'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check if location services are enabled on your device.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.'
            break
        }
        
        setLocationError(errorMessage)
        setPermissionDenied(isDenied)
        setIsLoadingLocation(false)
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    )
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

  if (locationError) {
    return (
      <div className="h-full w-full bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-4xl">
                location_off
              </span>
            </div>
            <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-2">
              Location Access Required
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 whitespace-pre-line">
              {locationError}
            </p>
            
            {permissionDenied ? (
              <div className="space-y-3">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-left">
                  <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    📱 How to enable location:
                  </p>
                  <ol className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1 list-decimal list-inside">
                    <li>Tap the lock/info icon in the address bar</li>
                    <li>Find "Location" or "Permissions"</li>
                    <li>Change to "Allow"</li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
                <Button 
                  onClick={() => window.location.reload()}
                  className="w-full"
                  size="lg"
                >
                  <span className="material-symbols-outlined mr-2">refresh</span>
                  Refresh Page
                </Button>
              </div>
            ) : (
              <Button 
                onClick={requestLocation}
                className="w-full"
                size="lg"
              >
                <span className="material-symbols-outlined mr-2">location_on</span>
                Allow Location Access
              </Button>
            )}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
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
        onDistanceUpdate={onDistanceUpdate}
      />
    </div>
  )
}