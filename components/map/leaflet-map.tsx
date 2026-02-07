'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Bin {
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

interface LeafletMapProps {
  bins: Bin[]
  userLocation: { lat: number; lng: number } | null
  onBinSelect?: (bin: Bin) => void
  selectedBinId?: string
  onDistanceUpdate?: (bins: Bin[]) => void
}

export default function LeafletMap({ bins, userLocation, onBinSelect, selectedBinId, onDistanceUpdate }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})
  const userMarkerRef = useRef<L.Marker | null>(null)
  const [mapReady, setMapReady] = useState(false)

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lng2 - lng1) * Math.PI / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return Math.round(R * c) // Distance in meters
  }

  // Open navigation to bin
  const navigateToBin = (bin: Bin) => {
    // Try Google Maps first (works on both mobile and desktop)
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${bin.lat},${bin.lng}&travelmode=walking`
    
    // For iOS devices, try Apple Maps
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS) {
      const appleMapsUrl = `maps://maps.apple.com/?daddr=${bin.lat},${bin.lng}&dirflg=w`
      window.location.href = appleMapsUrl
      // Fallback to Google Maps if Apple Maps doesn't open
      setTimeout(() => {
        window.open(googleMapsUrl, '_blank')
      }, 500)
    } else {
      window.open(googleMapsUrl, '_blank')
    }
  }

  useEffect(() => {
    // Initialize map
    if (!mapRef.current && userLocation) {
      const map = L.map('map', {
        center: [userLocation.lat, userLocation.lng],
        zoom: 14,
        zoomControl: true
      })

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map)

      // Move zoom controls to bottom right
      map.zoomControl.setPosition('bottomright')

      mapRef.current = map
      setMapReady(true)
      
      console.log('Map initialized at:', userLocation)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        setMapReady(false)
      }
    }
  }, [userLocation])

  useEffect(() => {
    if (!mapRef.current || !userLocation) return

    // Add or update user location marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng])
      // Recenter map on user location
      mapRef.current.setView([userLocation.lat, userLocation.lng], 14, {
        animate: true,
        duration: 1
      })
    } else {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="position: relative;">
            <div style="
              width: 24px;
              height: 24px;
              background: #3b82f6;
              border: 4px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 12px rgba(59, 130, 246, 0.5);
            "></div>
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 50px;
              height: 50px;
              background: rgba(59, 130, 246, 0.2);
              border-radius: 50%;
              animation: pulse 2s infinite;
            "></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000
      }).addTo(mapRef.current)

      userMarkerRef.current.bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <strong style="color: #3b82f6; font-size: 14px;">📍 You are here</strong>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #6b7280;">
            Lat: ${userLocation.lat.toFixed(6)}<br/>
            Lng: ${userLocation.lng.toFixed(6)}
          </p>
        </div>
      `)
      
      console.log('User marker added at:', userLocation)
    }
  }, [userLocation])

  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing bin markers
    Object.values(markersRef.current).forEach(marker => marker.remove())
    markersRef.current = {}

    // Calculate distances and update bins
    let binsWithDistance = bins
    if (userLocation) {
      binsWithDistance = bins.map(bin => ({
        ...bin,
        distance: calculateDistance(userLocation.lat, userLocation.lng, bin.lat, bin.lng)
      }))
      
      // Sort by distance (nearest first)
      binsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    }

    // Add bin markers
    binsWithDistance.forEach(bin => {
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'active': return '#22c55e'
          case 'warning': return '#eab308'
          case 'full': return '#ef4444'
          case 'maintenance': return '#6b7280'
          default: return '#6b7280'
        }
      }

      const color = getStatusColor(bin.status)
      const isSelected = bin.id === selectedBinId

      const binIcon = L.divIcon({
        className: 'bin-marker',
        html: `
          <div style="position: relative;">
            <div style="
              width: ${isSelected ? '48px' : '40px'};
              height: ${isSelected ? '48px' : '40px'};
              background: ${color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s;
              ${isSelected ? 'transform: scale(1.2);' : ''}
            ">
              <span style="color: white; font-size: 20px;">♻️</span>
            </div>
            ${bin.fillLevel > 75 ? `
              <div style="
                position: absolute;
                top: -8px;
                right: -8px;
                background: ${color};
                color: white;
                border-radius: 12px;
                padding: 2px 6px;
                font-size: 10px;
                font-weight: bold;
                border: 2px solid white;
              ">${bin.fillLevel}%</div>
            ` : ''}
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
      })

      const marker = L.marker([bin.lat, bin.lng], {
        icon: binIcon,
        zIndexOffset: isSelected ? 500 : 0
      }).addTo(mapRef.current!)

      // Format distance text
      let distanceText = ''
      if (bin.distance !== undefined) {
        const distanceKm = (bin.distance / 1000).toFixed(1)
        distanceText = bin.distance < 1000 
          ? `${bin.distance}m away` 
          : `${distanceKm}km away`
      }

      const statusText = {
        active: '✅ Active',
        warning: '⚠️ 75%+ Full',
        full: '🔴 Full',
        maintenance: '🔧 Maintenance'
      }[bin.status]

      marker.bindPopup(`
        <div style="min-width: 200px; padding: 8px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
            ${bin.name}
          </h3>
          <div style="margin-bottom: 8px;">
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
              📍 ${bin.address}
            </div>
            ${distanceText ? `
              <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
                🚶 ${distanceText}
              </div>
            ` : ''}
            <div style="font-size: 12px; color: ${color}; font-weight: 600; margin-bottom: 4px;">
              ${statusText}
            </div>
            <div style="font-size: 12px; color: #6b7280;">
              📦 Fill Level: ${bin.fillLevel}%
            </div>
          </div>
          <div style="
            background: #f3f4f6;
            padding: 6px;
            border-radius: 6px;
            margin-bottom: 8px;
          ">
            <div style="font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 4px;">
              Accepts:
            </div>
            <div style="font-size: 11px; color: #6b7280;">
              ${bin.acceptedItems.join(', ')}
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button 
              onclick="window.selectBin('${bin.id}')"
              style="
                flex: 1;
                background: #f9a406;
                color: white;
                border: none;
                padding: 8px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                font-size: 13px;
              "
            >
              View Details
            </button>
            <button 
              onclick="window.navigateToBin('${bin.id}')"
              style="
                flex: 1;
                background: #3b82f6;
                color: white;
                border: none;
                padding: 8px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                font-size: 13px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
              "
            >
              <span style="font-size: 16px;">🧭</span>
              Navigate
            </button>
          </div>
        </div>
      `, {
        maxWidth: 300,
        className: 'custom-popup'
      })

      marker.on('click', () => {
        if (onBinSelect) {
          onBinSelect(bin)
        }
      })

      markersRef.current[bin.id] = marker
    })

    // Add global functions for popup buttons
    if (typeof window !== 'undefined') {
      (window as any).selectBin = (binId: string) => {
        const bin = binsWithDistance.find(b => b.id === binId)
        if (bin && onBinSelect) {
          onBinSelect(bin)
        }
      }
      
      (window as any).navigateToBin = (binId: string) => {
        const bin = binsWithDistance.find(b => b.id === binId)
        if (bin) {
          navigateToBin(bin)
        }
      }
    }

    // Notify parent component of distance updates (only once after markers are set)
    if (userLocation && onDistanceUpdate && binsWithDistance.length > 0) {
      onDistanceUpdate(binsWithDistance)
    }
  }, [bins, selectedBinId, onBinSelect, userLocation])

  useEffect(() => {
    if (!mapRef.current || !userLocation || bins.length === 0) return

    // Fit map to show user location and all bins
    const bounds = L.latLngBounds([
      [userLocation.lat, userLocation.lng],
      ...bins.map(bin => [bin.lat, bin.lng] as [number, number])
    ])

    mapRef.current.fitBounds(bounds, {
      padding: [80, 80],
      maxZoom: 15,
      animate: true,
      duration: 1
    })
    
    console.log('Map fitted to bounds with', bins.length, 'bins')
  }, [userLocation, bins])

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        
        .leaflet-container {
          height: 100%;
          width: 100%;
          border-radius: 12px;
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
      <div id="map" style={{ height: '100%', width: '100%', borderRadius: '12px' }} />
    </>
  )
}