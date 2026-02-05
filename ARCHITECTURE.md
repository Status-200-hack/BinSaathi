# Smart E-Waste Bin System - Architecture

## 📁 Next.js App Router Folder Structure

```
smart-ewaste-bin/
├── app/                          # Next.js 14 App Router
│   ├── globals.css               # Global styles + Tailwind
│   ├── layout.tsx                # Root layout (theme provider, PWA)
│   ├── page.tsx                  # Landing/redirect to dashboard
│   ├── manifest.ts               # PWA manifest
│   ├── (auth)/                   # Route group - auth pages
│   │   ├── layout.tsx            # Auth layout (centered, minimal)
│   │   ├── sign-in/[[...sign-in]]/
│   │   │   └── page.tsx          # Clerk sign-in
│   │   └── sign-up/[[...sign-up]]/
│   │       └── page.tsx          # Clerk sign-up
│   ├── (dashboard)/              # Route group - protected routes
│   │   ├── layout.tsx            # Dashboard layout (nav, theme toggle)
│   │   ├── page.tsx              # Home/Bin Finder (map view)
│   │   ├── scanner/
│   │   │   ├── page.tsx          # AI Scanner interface
│   │   │   └── success/
│   │   │       └── page.tsx      # Success screen
│   │   ├── impact/
│   │   │   └── page.tsx          # Impact Dashboard
│   │   └── profile/
│   │       └── page.tsx          # User profile & rewards
│   ├── admin/                    # Admin routes (separate from dashboard)
│   │   ├── layout.tsx            # Admin layout
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── bins/
│   │   │   ├── page.tsx          # Bin management
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Individual bin details
│   │   ├── users/
│   │   │   └── page.tsx          # User management
│   │   └── analytics/
│   │       └── page.tsx          # System analytics
│   └── api/                      # API routes
│       ├── bins/
│       │   ├── route.ts          # GET /api/bins (search, filter)
│       │   ├── [id]/
│       │   │   └── route.ts      # GET/PUT /api/bins/[id]
│       │   └── nearby/
│       │       └── route.ts      # GET /api/bins/nearby
│       ├── scanner/
│       │   ├── detect/
│       │   │   └── route.ts      # POST /api/scanner/detect
│       │   └── submit/
│       │       └── route.ts      # POST /api/scanner/submit
│       ├── rewards/
│       │   ├── route.ts          # GET /api/rewards (user rewards)
│       │   └── claim/
│       │       └── route.ts      # POST /api/rewards/claim
│       ├── transactions/
│       │   └── route.ts          # GET/POST /api/transactions
│       ├── users/
│       │   ├── route.ts          # GET /api/users (admin only)
│       │   └── [id]/
│       │       └── route.ts      # GET/PUT /api/users/[id]
│       └── webhooks/
│           └── clerk/
│               └── route.ts      # Clerk user sync webhook
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components (shadcn-style)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── theme-toggle.tsx
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   ├── scanner/
│   │   ├── camera-view.tsx
│   │   ├── detection-overlay.tsx
│   │   └── result-display.tsx
│   ├── map/
│   │   ├── bin-map.tsx
│   │   ├── bin-marker.tsx
│   │   └── location-search.tsx
│   ├── dashboard/
│   │   ├── stats-card.tsx
│   │   ├── recent-activity.tsx
│   │   └── rewards-summary.tsx
│   └── admin/
│       ├── bin-table.tsx
│       ├── user-table.tsx
│       └── analytics-chart.tsx
├── lib/                          # Utilities and configurations
│   ├── firebase/
│   │   ├── config.ts             # Firebase initialization
│   │   ├── firestore.ts          # Firestore helpers
│   │   ├── storage.ts            # Firebase Storage helpers
│   │   └── collections.ts        # Collection references
│   ├── clerk/
│   │   └── config.ts             # Clerk configuration
│   ├── utils/
│   │   ├── cn.ts                 # Class name utility
│   │   ├── location.ts           # Geolocation utilities
│   │   ├── rewards.ts            # Rewards calculation
│   │   └── validation.ts         # Form validation schemas
│   ├── hooks/
│   │   ├── use-location.ts       # Geolocation hook
│   │   ├── use-theme.ts          # Theme management
│   │   └── use-scanner.ts        # Scanner state management
│   └── types/
│       ├── firestore.ts          # Firestore document types
│       ├── api.ts                # API response types
│       └── scanner.ts            # Scanner-related types
├── public/                       # Static assets
│   ├── icons/                    # PWA icons
│   ├── images/
│   └── sw.js                     # Service worker
├── styles/                       # Additional styles
│   └── scanner.css               # Scanner-specific animations
└── middleware.ts                 # Clerk auth middleware
```   

## 🗄️ Firestore Data Models

### Collections Schema

```typescript
// /users/{userId}
interface User {
  id: string;                     // Clerk user ID
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  stats: {
    totalItems: number;           // Total items scanned
    totalWeight: number;          // Total weight in kg
    carbonSaved: number;          // CO2 saved in kg
    pointsEarned: number;
    level: number;                // Gamification level
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// /bins/{binId}
interface Bin {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    zipCode: string;
  };
  capacity: {
    total: number;                // Total capacity in kg
    current: number;              // Current weight in kg
    percentage: number;           // Calculated: (current/total) * 100
  };
  types: string[];               // ['electronics', 'batteries', 'cables', etc.]
  status: 'active' | 'full' | 'maintenance' | 'offline';
  lastEmptied: Timestamp;
  qrCode: string;                // Unique QR code for bin identification
  metadata: {
    installDate: Timestamp;
    lastMaintenance?: Timestamp;
    model: string;
    serialNumber: string;
  };
  stats: {
    totalCollections: number;
    totalWeight: number;
    averageDaily: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// /waste_items/{itemId}
interface WasteItem {
  id: string;
  name: string;
  category: 'smartphone' | 'laptop' | 'tablet' | 'battery' | 'cable' | 'other';
  subcategory?: string;          // 'iPhone', 'Samsung Galaxy', etc.
  weight: number;                // Weight in grams
  carbonImpact: number;          // CO2 saved per item in kg
  pointValue: number;            // Points awarded for this item
  recyclingInfo: {
    materials: string[];         // ['lithium', 'gold', 'plastic', etc.]
    process: string;             // Brief recycling process description
    value: number;               // Estimated recycling value in USD
  };
  imageUrl?: string;             // Reference image for ML training
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// /transactions/{transactionId}
interface Transaction {
  id: string;
  userId: string;               // Reference to user
  binId: string;                // Reference to bin
  items: {
    wasteItemId: string;        // Reference to waste_item
    quantity: number;
    weight: number;             // Total weight for this item type
    points: number;             // Points earned for this item
    confidence: number;         // AI detection confidence (0-1)
  }[];
  totals: {
    weight: number;             // Total transaction weight
    points: number;             // Total points earned
    carbonSaved: number;        // Total CO2 saved
  };
  status: 'pending' | 'confirmed' | 'rejected';
  images: string[];             // Firebase Storage URLs
  location: {
    lat: number;
    lng: number;
  };
  metadata: {
    deviceInfo?: string;
    appVersion: string;
    processingTime: number;     // ML processing time in ms
  };
  createdAt: Timestamp;
  processedAt?: Timestamp;
}

// /rewards/{rewardId}
interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'discount' | 'voucher' | 'badge' | 'physical';
  pointsCost: number;
  value?: number;               // Monetary value if applicable
  imageUrl?: string;
  availability: {
    total: number;              // Total available (-1 for unlimited)
    remaining: number;
    expiresAt?: Timestamp;
  };
  partner?: {
    name: string;
    logo: string;
    website?: string;
  };
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// /user_rewards/{userRewardId}
interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  status: 'claimed' | 'redeemed' | 'expired';
  claimedAt: Timestamp;
  redeemedAt?: Timestamp;
  expiresAt?: Timestamp;
  redemptionCode?: string;      // Unique code for partner redemption
}
```

## 🛣️ API Routes & Functionality

### Public Routes
- `GET /api/bins/nearby` - Find bins near location (lat, lng, radius)
- `GET /api/bins/[id]` - Get specific bin details
- `POST /api/scanner/detect` - AI waste detection (image upload)

### Protected Routes (User)
- `GET /api/transactions` - User's transaction history
- `POST /api/scanner/submit` - Submit detected items to bin
- `GET /api/rewards` - Available rewards
- `POST /api/rewards/claim` - Claim reward with points
- `GET /api/users/profile` - User profile and stats

### Admin Routes
- `GET /api/bins` - All bins with filters (status, location, capacity)
- `PUT /api/bins/[id]` - Update bin details
- `GET /api/users` - All users with pagination
- `GET /api/transactions/admin` - All transactions with filters
- `PUT /api/transactions/[id]` - Approve/reject transactions

## 🎯 Role-Based Access Control

### User Permissions
- View nearby bins and their status
- Scan and submit waste items
- View personal stats and transaction history
- Claim and redeem rewards
- Update profile preferences

### Admin Permissions
- All user permissions +
- Manage bins (CRUD operations)
- View all user data and transactions
- Approve/reject transactions
- Manage rewards catalog
- Access system analytics
- Export data for reporting

### Implementation
```typescript
// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/bins/nearby", "/api/bins/(.*)"],
  ignoredRoutes: ["/api/webhooks/(.*)"],
});

// lib/auth.ts
export const requireAdmin = async () => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");
  
  const user = await getUser(userId);
  if (user.role !== 'admin') throw new Error("Admin access required");
  
  return user;
};
```

## 🗺️ UI Screen Mapping

### Route → Screen Mapping
- `/` → Landing page (redirect to dashboard if authenticated)
- `/sign-in` → Auth screen (Clerk)
- `/dashboard` → **Home/Bin Finder** (light/dark variants)
- `/scanner` → **AI Scanner** (camera interface)
- `/scanner/success` → **Success Screen** (post-scan confirmation)
- `/impact` → **Impact Dashboard** (user stats and environmental impact)
- `/profile` → User profile and rewards

### Layout Hierarchy
```
RootLayout (theme provider, PWA setup)
├── AuthLayout (centered, minimal)
│   ├── SignIn
│   └── SignUp
├── DashboardLayout (navbar, theme toggle)
│   ├── Home (Bin Finder)
│   ├── Scanner
│   ├── Impact Dashboard
│   └── Profile
└── AdminLayout (admin sidebar)
    ├── Bins Management
    ├── Users Management
    └── Analytics
```

## ⚡ Scalability Architecture (1000+ Bins)

### Database Optimization
```typescript
// Firestore indexes for performance
// Composite indexes needed:
// - bins: [status, location.city]
// - bins: [location.lat, location.lng] (geohash for geo queries)
// - transactions: [userId, createdAt]
// - transactions: [binId, status, createdAt]

// Geohash implementation for efficient location queries
import { geohashForLocation } from 'geofire-common';

interface BinWithGeohash extends Bin {
  geohash: string; // Auto-generated on bin creation
}
```

### Caching Strategy
- **Redis/Vercel KV**: Cache bin status, nearby bins, user stats
- **SWR/React Query**: Client-side caching with revalidation
- **CDN**: Static assets, images, ML model files

### Performance Optimizations
- **Pagination**: All list endpoints (bins, transactions, users)
- **Lazy Loading**: Map markers, transaction history
- **Image Optimization**: Next.js Image component, WebP format
- **Bundle Splitting**: Route-based code splitting
- **PWA**: Offline functionality, background sync

### Monitoring & Analytics
```typescript
// lib/analytics.ts
export const trackBinUsage = async (binId: string, action: string) => {
  // Firebase Analytics or custom metrics
  await logEvent('bin_interaction', {
    binId,
    action,
    timestamp: Date.now()
  });
};
```

### Infrastructure Considerations
- **Firestore**: Auto-scaling, 1M+ documents supported
- **Firebase Storage**: CDN-backed image storage
- **Vercel**: Edge functions for API routes
- **Clerk**: Handles auth scaling automatically
- **PWA**: Reduces server load with offline capabilities

This architecture supports horizontal scaling through Firebase's managed infrastructure while maintaining clean separation of concerns and optimal performance for mobile-first usage.