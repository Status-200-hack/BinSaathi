'use client'

import React from 'react'
import { Button } from './button'
import { Card } from './card'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-6 text-center">
        <div className="mb-4">
          <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
        </div>
        
        <h2 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">
          Something went wrong
        </h2>
        
        <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => window.location.reload()} className="flex-1">
            Reload Page
          </Button>
          <Button onClick={resetError} className="flex-1">
            Try Again
          </Button>
        </div>
      </Card>
    </div>
  )
}