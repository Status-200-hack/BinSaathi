import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'outline' | 'default'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon'
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
          
          // Variants
          {
            'bg-primary hover:bg-primary-600 text-white shadow-amber-glow': variant === 'primary',
            'bg-surface-light dark:bg-surface-dark border border-stone-200 dark:border-stone-700 text-text-light dark:text-text-dark hover:bg-stone-50 dark:hover:bg-stone-800': variant === 'secondary',
            'hover:bg-stone-100 dark:hover:bg-stone-800 text-text-light dark:text-text-dark': variant === 'ghost',
            'bg-white/85 dark:bg-stone-800/85 backdrop-blur-md border border-white/20 dark:border-white/10 text-text-light dark:text-text-dark': variant === 'glass',
            'border-2 border-stone-300 dark:border-stone-600 text-text-light dark:text-text-dark hover:bg-stone-50 dark:hover:bg-stone-800': variant === 'outline',
            'bg-stone-100 dark:bg-stone-800 text-text-light dark:text-text-dark hover:bg-stone-200 dark:hover:bg-stone-700': variant === 'default',
          },
          
          // Sizes
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
            'h-14 px-8 text-xl': size === 'xl',
            'h-10 w-10 p-0': size === 'icon',
          },
          
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }