# Authentication System

## Overview
Simple localStorage-based authentication system for the Smart E-Waste Bin mobile app. Uses email/password authentication without external dependencies.

## Implementation

### Core Files
- `lib/auth/simple-auth.ts` - Authentication logic and user management
- `app/sign-in/page.tsx` - Sign in page with themed form
- `app/sign-up/page.tsx` - Sign up page with validation
- `components/auth/auth-guard.tsx` - Client-side route protection
- `components/pages/profile.tsx` - Profile page with logout functionality

### Features
✅ Email/password sign up with validation
✅ Email/password sign in
✅ User session management (localStorage + cookies)
✅ Auto-generated user avatars
✅ Protected routes (redirects to sign-in if not authenticated)
✅ Sign out functionality
✅ Dark/light theme support
✅ Mobile-first responsive design
✅ Password visibility toggle
✅ Error handling and validation

### Authentication Flow

#### Sign Up
1. User enters name, email, password, and confirms password
2. Validation checks:
   - Password minimum 6 characters
   - Passwords match
   - Email not already registered
3. User account created and stored in localStorage
4. Auto-generated avatar using ui-avatars.com
5. User automatically signed in
6. Redirected to home page

#### Sign In
1. User enters email and password
2. Credentials validated against localStorage
3. User session created
4. Cookie set for persistence
5. Redirected to home page

#### Sign Out
1. User clicks logout in profile page
2. Session cleared from localStorage
3. Cookie removed
4. Redirected to sign-in page

### Route Protection
The `AuthGuard` component wraps the entire app and:
- Allows public routes: `/sign-in`, `/sign-up`, `/offline`
- Allows bin kiosk routes: `/bin/[binId]`
- Redirects unauthenticated users to `/sign-in` for all other routes
- Shows loading spinner while checking authentication

### Data Storage

#### localStorage Keys
- `ewaste_users` - All registered users (email → {password, user})
- `ewaste_current_user` - Currently logged in user

#### Cookie
- `ewaste_current_user` - User ID for 30-day persistence

### User Object
```typescript
interface User {
  id: string          // Timestamp-based unique ID
  name: string        // Full name
  email: string       // Email address
  avatar: string      // Avatar URL (ui-avatars.com)
  createdAt: string   // ISO timestamp
}
```

### Security Notes
⚠️ This is a demo implementation for hackathon/development purposes
⚠️ Passwords are stored in plain text in localStorage
⚠️ No server-side validation or encryption
⚠️ Not suitable for production use

For production, implement:
- Server-side authentication with secure password hashing (bcrypt)
- JWT tokens or session-based auth
- HTTPS only
- Rate limiting
- Email verification
- Password reset functionality
- OAuth providers (Google, GitHub, etc.)

## Usage

### Check Authentication Status
```typescript
import { isAuthenticated } from '@/lib/auth/simple-auth'

if (isAuthenticated()) {
  // User is logged in
}
```

### Get Current User
```typescript
import { getCurrentUser } from '@/lib/auth/simple-auth'

const user = getCurrentUser()
if (user) {
  console.log(user.name, user.email)
}
```

### Sign Out
```typescript
import { signOut } from '@/lib/auth/simple-auth'
import { useRouter } from 'next/navigation'

const router = useRouter()
signOut()
router.push('/sign-in')
```

## Testing

### Test Accounts
Create test accounts through the sign-up page:
- Navigate to `http://localhost:3001/sign-up`
- Fill in name, email, password
- Click "Sign Up"

### Manual Testing Flow
1. Visit app → Redirected to `/sign-in`
2. Click "Sign up" link → Navigate to `/sign-up`
3. Create account → Auto sign in → Redirected to `/`
4. Navigate to `/profile` → See user info
5. Click "Logout" → Redirected to `/sign-in`
6. Sign in with credentials → Access app

## Theme Integration
Both sign-in and sign-up pages match the project theme:
- Primary color: #f9a406 (amber)
- Space Grotesk font
- Material Symbols icons
- Dark/light mode support
- Decorative gradient backgrounds
- Consistent card styling
