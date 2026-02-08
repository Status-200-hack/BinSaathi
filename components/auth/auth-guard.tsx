'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth/simple-auth'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = ['/sign-in', '/sign-up', '/offline']
    const isBinRoute = pathname?.startsWith('/bin/')
    const isAdminRoute = pathname?.startsWith('/admin')
    
    // Allow public routes, bin kiosk routes, and admin routes
    if (publicRoutes.includes(pathname || '') || isBinRoute || isAdminRoute) {
      setIsChecking(false)
      return
    }

    // Check authentication
    if (!isAuthenticated()) {
      router.push('/sign-in')
    } else {
      setIsChecking(false)
    }
  }, [pathname, router])

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-stone-600 dark:text-stone-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
