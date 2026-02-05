'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: 'dashboard',
  },
  {
    name: 'Bin Management',
    href: '/admin/bins',
    icon: 'delete',
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: 'people',
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: 'analytics',
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-stone-800 border-r border-stone-200 dark:border-stone-700">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
              )}
            >
              <span className="material-symbols-outlined text-lg">
                {item.icon}
              </span>
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="p-3 bg-stone-50 dark:bg-stone-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-green-600 text-sm">
              eco
            </span>
            <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
              System Status
            </span>
          </div>
          <div className="text-xs text-stone-500 dark:text-stone-400">
            All systems operational
          </div>
        </div>
      </div>
    </aside>
  )
}