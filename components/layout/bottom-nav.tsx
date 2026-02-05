'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: 'home',
  },
  {
    href: '/impact',
    label: 'Impact',
    icon: 'monitoring',
  },
  {
    href: '/scanner',
    label: 'Scan',
    icon: 'qr_code_scanner',
    isCenter: true,
  },
  {
    href: '/rewards',
    label: 'Rewards',
    icon: 'stars',
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: 'person',
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-t border-stone-200 dark:border-stone-700 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          if (item.isCenter) {
            return (
              <div key={item.href} className="relative -top-6">
                <Link
                  href={item.href}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-amber-glow transition-transform active:scale-95 border-4 border-surface-light dark:border-surface-dark"
                >
                  <span className="material-symbols-outlined text-2xl">
                    {item.icon}
                  </span>
                </Link>
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[60px]',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-stone-500 dark:text-stone-400 hover:text-text-light dark:hover:text-text-dark'
              )}
            >
              <span className={cn(
                'material-symbols-outlined text-xl',
                isActive && 'font-bold'
              )}>
                {item.icon}
              </span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}