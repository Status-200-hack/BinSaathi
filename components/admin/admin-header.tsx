'use client'

import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'

export function AdminHeader() {
  return (
    <header className="bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-stone-900 dark:text-white">
            EcoRecycle Admin
          </h1>
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
            Admin Dashboard
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" size="sm">
            View App
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Admin User
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}