'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const mockBins = [
  {
    id: '1',
    name: 'Downtown Mall',
    location: '123 Main St, New York, NY',
    status: 'active',
    fillLevel: 45,
    lastEmptied: '2024-02-03',
    totalCollections: 1247,
    model: 'EcoSmart Pro',
    serialNumber: 'ES-001-NYC'
  },
  {
    id: '2',
    name: 'Central Park',
    location: 'Central Park West, New York, NY',
    status: 'warning',
    fillLevel: 85,
    lastEmptied: '2024-02-01',
    totalCollections: 892,
    model: 'EcoSmart Pro',
    serialNumber: 'ES-002-NYC'
  },
  {
    id: '3',
    name: 'Brooklyn Bridge',
    location: 'Brooklyn Bridge Plaza, NY',
    status: 'full',
    fillLevel: 100,
    lastEmptied: '2024-01-30',
    totalCollections: 2156,
    model: 'EcoSmart Max',
    serialNumber: 'ES-003-NYC'
  },
  {
    id: '4',
    name: 'Times Square',
    location: 'Times Square, New York, NY',
    status: 'active',
    fillLevel: 32,
    lastEmptied: '2024-02-04',
    totalCollections: 3421,
    model: 'EcoSmart Pro',
    serialNumber: 'ES-004-NYC'
  },
  {
    id: '5',
    name: 'Wall Street',
    location: 'Wall Street, New York, NY',
    status: 'maintenance',
    fillLevel: 0,
    lastEmptied: '2024-02-02',
    totalCollections: 756,
    model: 'EcoSmart Lite',
    serialNumber: 'ES-005-NYC'
  }
]

export function BinManagement() {
  const [selectedBin, setSelectedBin] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'full': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'maintenance': return 'bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-400'
      default: return 'bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'warning': return 'Warning'
      case 'full': return 'Full'
      case 'maintenance': return 'Maintenance'
      default: return 'Unknown'
    }
  }

  const filteredBins = filter === 'all' 
    ? mockBins 
    : mockBins.filter(bin => bin.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
          Bin Management
        </h1>
        <Button>
          <span className="material-symbols-outlined mr-2">add</span>
          Add New Bin
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
            Filter by status:
          </span>
          <div className="flex gap-2">
            {['all', 'active', 'warning', 'full', 'maintenance'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Bins Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-700">
                <th className="text-left py-3 px-4 font-medium text-stone-700 dark:text-stone-300">
                  Bin Details
                </th>
                <th className="text-left py-3 px-4 font-medium text-stone-700 dark:text-stone-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-stone-700 dark:text-stone-300">
                  Fill Level
                </th>
                <th className="text-left py-3 px-4 font-medium text-stone-700 dark:text-stone-300">
                  Last Emptied
                </th>
                <th className="text-left py-3 px-4 font-medium text-stone-700 dark:text-stone-300">
                  Collections
                </th>
                <th className="text-left py-3 px-4 font-medium text-stone-700 dark:text-stone-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBins.map((bin) => (
                <tr key={bin.id} className="border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-stone-900 dark:text-white">
                        {bin.name}
                      </div>
                      <div className="text-sm text-stone-600 dark:text-stone-400">
                        {bin.location}
                      </div>
                      <div className="text-xs text-stone-500 dark:text-stone-500 mt-1">
                        {bin.model} • {bin.serialNumber}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bin.status)}`}>
                      {getStatusText(bin.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-stone-200 dark:bg-stone-600 rounded-full h-2 w-16">
                        <div 
                          className={`h-2 rounded-full ${
                            bin.fillLevel > 80 ? 'bg-red-500' : 
                            bin.fillLevel > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${bin.fillLevel}%` }}
                        />
                      </div>
                      <span className="text-sm text-stone-600 dark:text-stone-400 min-w-[3rem]">
                        {bin.fillLevel}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-stone-600 dark:text-stone-400">
                    {bin.lastEmptied}
                  </td>
                  <td className="py-4 px-4 text-sm text-stone-600 dark:text-stone-400">
                    {bin.totalCollections.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      {bin.status === 'full' && (
                        <Button size="sm">
                          Schedule Empty
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-stone-900 dark:text-white">
            {mockBins.length}
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            Total Bins
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {mockBins.filter(b => b.status === 'active').length}
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            Active Bins
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-red-600">
            {mockBins.filter(b => b.status === 'full').length}
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            Bins Full
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-stone-600">
            {Math.round(mockBins.reduce((acc, bin) => acc + bin.fillLevel, 0) / mockBins.length)}%
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            Avg Fill Level
          </div>
        </Card>
      </div>
    </div>
  )
}