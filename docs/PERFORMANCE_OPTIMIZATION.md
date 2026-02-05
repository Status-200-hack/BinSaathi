# Performance Optimization Guide

## 🚀 Lighthouse Score Targets

**Target Scores for Hackathon Demo:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+
- PWA: 100

## ⚡ Performance Optimizations Implemented

### 1. Next.js 14 App Router Optimizations

```typescript
// next.config.js - Production optimizations
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@material-symbols/outlined'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
}
```

### 2. Bundle Optimization

```typescript
// Dynamic imports for code splitting
const AdminDashboard = dynamic(() => import('@/components/admin/admin-dashboard'), {
  loading: () => <div>Loading dashboard...</div>,
  ssr: false
})

const Scanner = dynamic(() => import('@/components/pages/scanner'), {
  loading: () => <div>Loading scanner...</div>
})
```

### 3. Image Optimization

```typescript
// components/ui/optimized-image.tsx
import Image from 'next/image'

export function OptimizedImage({ src, alt, ...props }) {
  return (
    <Image
      src={src}
      alt={alt}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      quality={85}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  )
}
```

### 4. Font Optimization

```typescript
// app/layout.tsx - Optimized font loading
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})
```

### 5. Service Worker Caching Strategy

```javascript
// PWA caching strategy in next.config.js
runtimeCaching: [
  // Static assets - Cache First
  {
    urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'images',
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      }
    }
  },
  // API calls - Network First with fallback
  {
    urlPattern: /\/api\/.*$/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-cache',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60 // 24 hours
      },
      networkTimeoutSeconds: 10
    }
  },
  // Google Fonts - Cache First
  {
    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts',
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
      }
    }
  }
]
```

## 🎯 Accessibility Optimizations

### 1. WCAG AA Compliance

```css
/* globals.css - High contrast and accessibility */
:root {
  --color-contrast-ratio: 4.5; /* WCAG AA minimum */
  --focus-ring: 2px solid #f9a406;
  --touch-target-min: 44px; /* Minimum touch target size */
}

/* Focus indicators */
*:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --text-light: #000000;
    --background-light: #ffffff;
    --border-light: #000000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 2. Semantic HTML and ARIA

```typescript
// components/ui/button.tsx - Accessible button component
export function Button({ children, variant, size, disabled, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }))}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// components/scanner/detection-flow.tsx - Screen reader support
<div role="region" aria-label="Device detection results">
  <h2 id="detection-heading">Detection Results</h2>
  <div aria-describedby="detection-heading">
    <p aria-live="polite">
      Detected: {detectedItem} with {confidence}% confidence
    </p>
  </div>
</div>
```

### 3. Keyboard Navigation

```typescript
// components/ui/modal.tsx - Keyboard trap and focus management
export function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (isOpen) {
      // Focus trap
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements?.[0] as HTMLElement
      const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement
      
      firstElement?.focus()
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
      
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  return (
    <div 
      ref={modalRef}
      role="dialog" 
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
    >
      {children}
    </div>
  )
}
```

## 📱 Mobile Performance

### 1. Touch Optimization

```css
/* Touch-friendly interface */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}

/* Prevent zoom on input focus */
input, select, textarea {
  font-size: 16px; /* Prevents iOS zoom */
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Optimize for mobile viewport */
.mobile-container {
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}
```

### 2. Lazy Loading and Virtualization

```typescript
// components/admin/bin-table.tsx - Virtual scrolling for large datasets
import { FixedSizeList as List } from 'react-window'

export function BinTable({ bins }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <BinRow bin={bins[index]} />
    </div>
  )
  
  return (
    <List
      height={600}
      itemCount={bins.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </List>
  )
}
```

### 3. Image Lazy Loading

```typescript
// components/ui/lazy-image.tsx
import { useState, useRef, useEffect } from 'react'

export function LazyImage({ src, alt, className, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
    </div>
  )
}
```

## 🔧 Build Optimizations

### 1. Bundle Analysis

```bash
# Add to package.json scripts
"analyze": "cross-env ANALYZE=true next build",
"build:analyze": "npm run build && npx @next/bundle-analyzer"
```

### 2. Environment-specific Optimizations

```typescript
// lib/config.ts - Environment-based feature flags
export const config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Feature flags
  enableAnalytics: process.env.NODE_ENV === 'production',
  enableServiceWorker: process.env.NODE_ENV === 'production',
  enableDebugMode: process.env.NODE_ENV === 'development',
  
  // Performance settings
  enableImageOptimization: true,
  enableCodeSplitting: true,
  enablePrefetching: process.env.NODE_ENV === 'production',
}
```

### 3. Critical CSS Inlining

```typescript
// next.config.js - Critical CSS optimization
const nextConfig = {
  experimental: {
    optimizeCss: true,
    craCompat: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  }
}
```

## 📊 Performance Monitoring

### 1. Web Vitals Tracking

```typescript
// lib/analytics.ts - Performance monitoring
export function reportWebVitals(metric) {
  if (config.enableAnalytics) {
    // Send to analytics service
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    })
  }
}

// app/layout.tsx - Web Vitals reporting
export function reportWebVitals(metric) {
  console.log(metric)
}
```

### 2. Performance Budget

```json
// .lighthouserc.js - Performance budget
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      startServerCommand: 'npm start',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'categories:pwa': ['error', { minScore: 1.0 }],
      },
    },
  },
}
```

## 🚀 Deployment Optimizations

### 1. Vercel Configuration

```json
// vercel.json - Deployment optimization
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### 2. CDN and Caching

```typescript
// lib/firebase/storage.ts - Optimized image delivery
export const getOptimizedImageUrl = (path: string, width?: number, quality?: number) => {
  const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${projectId}/o/${encodeURIComponent(path)}`
  const params = new URLSearchParams({
    alt: 'media',
    ...(width && { w: width.toString() }),
    ...(quality && { q: quality.toString() }),
  })
  return `${baseUrl}?${params}`
}
```

## ✅ Pre-Demo Performance Checklist

- [ ] Run Lighthouse audit (target: 90+ all categories)
- [ ] Test PWA installation on mobile devices
- [ ] Verify offline functionality works
- [ ] Check loading times on 3G network simulation
- [ ] Test accessibility with screen reader
- [ ] Validate keyboard navigation
- [ ] Confirm high contrast mode support
- [ ] Test on multiple device sizes
- [ ] Verify service worker caching
- [ ] Check bundle size (target: <500KB initial load)

## 🎯 Expected Performance Results

**Lighthouse Scores (Production Build)**:
- Performance: 92-95
- Accessibility: 98-100
- Best Practices: 95-100
- SEO: 95-100
- PWA: 100

**Loading Metrics**:
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1
- First Input Delay: <100ms
- Time to Interactive: <3.5s

These optimizations ensure the hackathon demo runs smoothly across all devices and network conditions, providing judges with an excellent user experience that showcases the technical quality of the solution.