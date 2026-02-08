'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from '@/lib/auth/simple-auth'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = signIn(email, password)
      
      if (result.success) {
        router.push('/')
      } else {
        setError(result.error || 'Failed to sign in')
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[40%] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[40%] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 pt-12 pb-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-primary/10 border border-primary/20">
          <span className="material-symbols-outlined text-primary text-3xl">recycling</span>
        </div>
        <h1 className="text-foreground text-3xl font-bold tracking-tight mb-2">
          Welcome Back
        </h1>
        <p className="text-muted-foreground text-base">
          Sign in to continue recycling
        </p>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-full max-w-md">
          <div className="bg-surface-light dark:bg-surface-dark border border-stone-200 dark:border-stone-700 shadow-lg rounded-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-foreground font-medium text-sm mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-foreground rounded-lg h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-foreground font-medium text-sm mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-foreground rounded-lg h-12 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 dark:text-stone-400 hover:text-foreground"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold rounded-lg h-12 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              Don&apos;t have an account?{' '}
              <Link 
                href="/sign-up" 
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 pb-8 text-center">
        <p className="text-stone-600 dark:text-stone-400 text-xs">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </footer>
    </div>
  )
}
