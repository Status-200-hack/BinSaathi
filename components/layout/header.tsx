'use client'

import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeaderProps {
  title?: string
  showBack?: boolean
  showProfile?: boolean
  className?: string
  children?: React.ReactNode
}

export function Header({ 
  title, 
  showBack = false, 
  showProfile = false, 
  className,
  children 
}: HeaderProps) {
  return (
    <header className={cn(
      'flex items-center justify-between px-6 py-4 pt-12 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-stone-200/50 dark:border-stone-700/50',
      className
    )}>
      <div className="flex items-center gap-3">
        {showBack && (
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <span className="material-symbols-outlined">arrow_back</span>
          </Button>
        )}
        
        {title && (
          <h1 className="text-lg font-bold text-text-light dark:text-text-dark tracking-tight uppercase">
            {title}
          </h1>
        )}
      </div>

      {children}

      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        {showProfile && (
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <span className="material-symbols-outlined">account_circle</span>
          </Button>
        )}
      </div>
    </header>
  )
}