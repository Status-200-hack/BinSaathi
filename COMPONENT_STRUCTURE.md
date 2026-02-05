# Smart E-Waste Bin System - Component Structure

## 📁 Component Architecture

```
components/
├── ui/                           # Base UI components (reusable)
│   ├── theme-provider.tsx        # Theme context provider
│   ├── theme-toggle.tsx          # Dark/light mode toggle
│   ├── button.tsx                # Button component with variants
│   └── card.tsx                  # Card component with variants
├── layout/                       # Layout components
│   ├── bottom-nav.tsx            # Mobile bottom navigation
│   └── header.tsx                # Page header with back/profile
└── pages/                        # Page-specific components
    ├── bin-finder.tsx            # Home/Map view (/)
    ├── scanner.tsx               # AI Scanner (/scanner)
    ├── impact-dashboard.tsx      # Impact stats (/impact)
    └── success-screen.tsx        # Success page (/scanner/success)
```

## 🎨 Design System

### Colors
- **Primary**: `#f9a406` (Warm amber)
- **Background Light**: `#FFFDF5` (Warm cream)
- **Background Dark**: `#231c0f` (Deep warm charcoal)
- **Surface Light**: `#ffffff`
- **Surface Dark**: `#2d2417`

### Typography
- **Font**: Space Grotesk (display & body)
- **Icons**: Material Symbols Outlined

### Components

#### Button Variants
```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="glass">Glass Effect</Button>
```

#### Card Variants
```tsx
<Card variant="default">Standard Card</Card>
<Card variant="glass">Glass Morphism</Card>
<Card variant="elevated">With Shadow</Card>
```

## 🌓 Dark/Light Mode Implementation

### CSS Variables Approach
```css
:root {
  --background-light: #FFFDF5;
  --background-dark: #231c0f;
  --surface-light: #ffffff;
  --surface-dark: #2d2417;
  --text-light: #181611;
  --text-dark: #ffffff;
}
```

### Tailwind Classes
```tsx
// Background
className="bg-background-light dark:bg-background-dark"

// Text
className="text-text-light dark:text-text-dark"

// Surface (cards, panels)
className="bg-surface-light dark:bg-surface-dark"
```

### Theme Provider Usage
```tsx
// app/layout.tsx
<ThemeProvider defaultTheme="system" storageKey="ewaste-theme">
  {children}
</ThemeProvider>

// Any component
import { useTheme } from '@/components/ui/theme-provider'

const { theme, setTheme } = useTheme()
```

## 📱 Mobile-First Features

### Safe Area Support
```css
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
```

### Touch Interactions
```tsx
// Active states for mobile
className="active:scale-[0.98] transition-transform"

// Tap highlight removal
-webkit-tap-highlight-color: transparent;
```

### Bottom Navigation
- Fixed position with safe area padding
- Center floating action button (Scanner)
- Active state indicators

## 🎭 Animations & Effects

### Scanner Animations
```css
/* Scanning line animation */
@keyframes scan-line {
  0% { top: 0%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* Pulse ring for map pins */
@keyframes pulse-ring {
  0% { transform: scale(0.5); opacity: 0; }
  50% { opacity: 0.5; }
  100% { transform: scale(1.5); opacity: 0; }
}
```

### Glass Morphism
```css
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## 🔧 Accessibility Features

### Contrast Ratios
- Light mode: 4.5:1 minimum
- Dark mode: 4.5:1 minimum
- Primary color: WCAG AA compliant

### Touch Targets
- Minimum 44px touch targets
- Adequate spacing between interactive elements

### Screen Reader Support
```tsx
<span className="sr-only">Screen reader only text</span>
<button aria-label="Close scanner">
  <span className="material-symbols-outlined">close</span>
</button>
```

## 🚀 Usage Examples

### Page Component Structure
```tsx
// components/pages/example-page.tsx
'use client'

import { Header } from '@/components/layout/header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ExamplePage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header title="Page Title" showBack />
      
      <main className="p-6 pb-24">
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
            Content
          </h2>
        </Card>
      </main>
    </div>
  )
}
```

### Route Structure
```
app/
├── layout.tsx                    # Root layout with theme provider
├── page.tsx                      # Redirect to dashboard
├── (dashboard)/                  # Route group
│   ├── layout.tsx               # Dashboard layout with bottom nav
│   ├── page.tsx                 # Bin Finder (/)
│   ├── scanner/
│   │   ├── page.tsx             # Scanner (/scanner)
│   │   └── success/
│   │       └── page.tsx         # Success (/scanner/success)
│   └── impact/
│       └── page.tsx             # Impact Dashboard (/impact)
└── globals.css                  # Global styles
```

## 🎯 Key Features Implemented

### ✅ Responsive Design
- Mobile-first approach
- Tablet and desktop breakpoints
- Safe area support for notched devices

### ✅ Theme System
- System preference detection
- Persistent theme storage
- Smooth transitions between themes

### ✅ Component Library
- Consistent design tokens
- Reusable UI components
- Proper TypeScript interfaces

### ✅ Animations
- Scanner beam effects
- Map pin pulsing
- Smooth transitions
- Loading states

### ✅ Accessibility
- WCAG AA compliance
- Screen reader support
- Keyboard navigation
- High contrast support

This architecture provides a solid foundation for the Smart E-Waste Bin System with excellent scalability, maintainability, and user experience across all devices and themes.