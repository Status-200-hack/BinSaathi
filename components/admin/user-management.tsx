'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const mockUsers = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    role: 'user',
    level: 5,
    totalPoints: 12450,
    itemsRecycled: 47,
    co2Saved: 15.2,
    joinDate: '2024-01-15',
    lastActive: '2024-02-05',
    status: 'active'
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    role: 'user',
    level: 3,
    totalPoints: 4280,
    itemsRecycled: 23,
    co2Saved: 8.7,
    joinDate: '2024-01-20',
    lastActive: '2024-02-05',
    status: 'active'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    role: 'user',
    level: 7,
    totalPoints: 28900,
    itemsRecycled: 89,
    co2Saved: 32.1,
    joinDate: '2023-12-10',
    lastActive: '2024-02-04',
    status: 'active'
  },
  {
    id: '4',
    name: 'David Lee',
    email: 'david.lee@email.com',
    role: 'admin',
    level: 4,
    totalPoints: 7650,
    itemsRecycled: 31,
    co2Saved: 11.4,
    joinDate: '2024-01-05',
    lastActive: '2024-02-05',
    status: 'active'
  },
  {
    id: '5',
    name: 'Lisa Park',
    email: 'lisa.park@email.com',
    role: 'user',
    level: 2,
    totalPoints: 1890,
    itemsRecycled: 12,
    co2Saved: 4.3,
    joinDate: '2024-02-01',
    lastActive: '2024-02-03',
    status: 'inactive'
  }
]

export function UserManagement() {
  const [filter, setFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('points')

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'user': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default: return 'bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'inactive': return 'bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-400'
      default: return 'bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-400'
    }
  }

  const getLevelBadge = (level: number) => {
    if (level >= 7) return '👑'
    if (level >= 5) return '🏆'
    if (level >= 3) return '🛡️'
    return '🌱'
  }

  const filteredUsers = filter === 'all' 
    ? mockUsers 
    : mockUsers.filter(user => user.role === filter || user.status === filter)

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'points': return b.totalPoints - a.totalPoints
      case 'level': return b.level - a.level
      case 'items': return b.itemsRecycled - a.itemsRecycled
      case 'co2': return b.co2Saved - a.co2Saved
      case 'name': return a.name.localeCompare(b.name)
      default: return 0
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
          User Management
        </h1>
        <Button>
          <span className="material-symbols-outlined mr-2">person_add</span>
          Invite User
        </Button>
      </div>

      {/* Filters and Sort */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Filter:
            </span>
            <div className="flex gap-2">
              {['all', 'user', 'admin', 'active', 'inactive'].map((filterOption) => (
                <Button
                  key={filterOption}
                  variant={filter === filterOption ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(filterOption)}
                  className="capitalize"
                >
                  {filterOption}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Sort by:
            </span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-sm"
            >
              <option value="points">Points</option>
              <option value="level">Level</option>
              <option value="items">Items Recycled</option>
              <option value="co2">CO₂ Saved</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-700">
                <th className="text-left py-3 px-4 font-medium text-stone-700 dark:text-stone-300">
                  User
                </th>
                <th className="text-left py-3 px-4 font-medium text-stone-700 dark:text-stone-300">
                  Role
                </th>
                <th className="text-left py-3 px-4 font-medium text-stone-700 dark:text-stone-300">
                  Level
                </th>
                <th className="text-left py-3 px-4 font-medium text-stone-700 dark:text-stone-300">
                  Points
                </th>
                <th className="text-left py-3 px-4 font-medium text-stone-700 dark:text-stone-300">
                  Impact
                </th>
                <th className="text-left py-3 px-4 font-medium text-stone-700 dark:text-stone-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-stone-700 dark:text-stone-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id} className="border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-stone-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-stone-600 dark:text-stone-400">
                          {user.email}
                        </div>
                        <div className="text-xs text-stone-500 dark:text-stone-500">
                          Joined {user.joinDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getLevelBadge(user.level)}</span>
                      <span className="font-medium text-stone-900 dark:text-white">
                        {user.level}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-stone-900 dark:text-white">
                      {user.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-500">
                      {user.itemsRecycled} items
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-green-600 font-medium">
                      {user.co2Saved}kg CO₂
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-500">
                      saved
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                    <div className="text-xs text-stone-500 dark:text-stone-500 mt-1">
                      Last: {user.lastActive}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      {user.role === 'user' && (
                        <Button variant="outline" size="sm">
                          Promote
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
            {mockUsers.length}
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            Total Users
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {mockUsers.filter(u => u.status === 'active').length}
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            Active Users
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {mockUsers.filter(u => u.role === 'admin').length}
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            Admins
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-stone-600">
            {Math.round(mockUsers.reduce((acc, user) => acc + user.level, 0) / mockUsers.length * 10) / 10}
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-400">
            Avg Level
          </div>
        </Card>
      </div>
    </div>
  )
}