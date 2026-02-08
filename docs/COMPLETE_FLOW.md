# Complete User Flow - Smart E-Waste Bin System

## 🎯 Overview

This document describes the complete end-to-end flow from user authentication to successful recycling with session management.

---

## 📱 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         MOBILE APP                              │
└─────────────────────────────────────────────────────────────────┘

Step 1: Authentication
├─ User opens app (https://[ngrok-url])
├─ Redirected to /sign-in (if not authenticated)
├─ User signs in with email/password
└─ Redirected to home page (/)

Step 2: Find Bin
├─ User sees map with nearby bins
├─ User selects a bin or goes to physical location
└─ User sees bin kiosk with QR code

Step 3: Scan QR Code
├─ User opens phone camera
├─ Scans QR code from bin kiosk screen
├─ Opens: https://[ngrok-url]/bin/BIN001/connect
└─ Connection page loads

Step 4: Session Creation
├─ System checks if user is authenticated ✓
├─ Creates bin session (5-minute duration)
│  ├─ sessionId: "session_123..."
│  ├─ binId: "BIN001"
│  ├─ userId: "user123"
│  ├─ userName: "John Doe"
│  └─ status: "active"
├─ Stores session in localStorage
└─ Shows "Connected Successfully!" message

Step 5: Redirect to Scanner
├─ Auto-redirects to /scanner after 2 seconds
├─ Scanner checks for active session
│  ├─ Checks localStorage for 'current_bin_session'
│  ├─ Validates session not expired
│  └─ Shows session banner: "Connected to Bin BIN001"
└─ Camera access granted (HTTPS via ngrok)

Step 6: Scan Item
├─ User points camera at e-waste item
├─ Captures photo
├─ AI analyzes item
├─ Shows detection result
└─ User confirms item

Step 7: Success & Rewards
├─ Shows success screen
│  ├─ Points earned: +50
│  ├─ CO2 saved: 0.8kg
│  ├─ Bin location: "Bin BIN001"
│  └─ Environmental impact stats
├─ Session marked as "completed"
├─ Session cleared from localStorage
└─ User can recycle another item

┌─────────────────────────────────────────────────────────────────┐
│                       BIN KIOSK (LAPTOP)                        │
└─────────────────────────────────────────────────────────────────┘

State 1: Idle
├─ Shows QR code
├─ "Scan QR on your phone to begin"
├─ Polls for active session (every 1 second)
└─ Waiting for user connection...

State 2: Connected (Session Detected)
├─ Detects active session for this bin
├─ Shows user avatar and name
├─ "Welcome, John Doe!"
├─ "Place your item inside"
└─ Hatch unlocked

State 3: Scanning
├─ User places item in bin
├─ Bin sensors analyze item
├─ Shows scanning animation
├─ Progress: 0% → 100%
└─ Detection complete

State 4: Result
├─ Shows detected item
├─ "Detected: Phone"
├─ Confidence: 92%
├─ Waiting for confirmation
└─ User confirms on mobile

State 5: Success
├─ Shows success animation
├─ "Item recycled successfully"
├─ Countdown: 5 seconds
├─ Session completed
└─ Returns to idle state
```

---

## 🔐 Authentication Flow

### Sign Up
```
URL: /sign-up
Fields: Name, Email, Password, Confirm Password
Validation:
  - Password min 6 characters
  - Passwords must match
  - Email not already registered
Success: Auto sign in → Redirect to /
```

### Sign In
```
URL: /sign-in
Fields: Email, Password
Validation:
  - Email exists
  - Password correct
Success: Redirect to /
```

### Session Persistence
```
Storage: localStorage + cookies
Duration: 30 days
Key: ewaste_current_user
```

---

## 🔗 QR Session Flow

### 1. QR Code Generation (Bin Kiosk)
```javascript
// On bin idle screen
const qrData = generateQRData(binId)
// Returns: "https://[domain]/bin/BIN001/connect"

// QR code displayed using qrcode library
QRCode.toDataURL(qrData, { width: 200 })
```

### 2. QR Scan (Mobile)
```
User Action: Scan QR with phone camera
Opens: https://[ngrok-url]/bin/BIN001/connect
Page: app/bin/[binId]/connect/page.tsx
```

### 3. Connection Handler
```javascript
// Check authentication
const user = getCurrentUser()
if (!user) redirect('/sign-in')

// Create session
const session = createBinSession(
  binId,        // "BIN001"
  user.id,      // "user123"
  user.name,    // "John Doe"
  user.email,   // "john@example.com"
  user.avatar   // "https://..."
)

// Store session ID
localStorage.setItem('current_bin_session', session.sessionId)

// Redirect to scanner
router.push('/scanner')
```

### 4. Session Polling (Bin Kiosk)
```javascript
// Poll every 1 second when idle
setInterval(() => {
  const session = getActiveBinSession(binId)
  if (session) {
    setState('connected')
    setActiveSession(session)
  }
}, 1000)
```

### 5. Scanner Session Check (Mobile)
```javascript
// On scanner page load
const sessionId = localStorage.getItem('current_bin_session')
if (!sessionId) {
  // Show error: "No active bin session"
  // Button: "Find & Scan Bin QR Code"
  return
}

const session = getSession(sessionId)
if (!session || session.status === 'expired') {
  // Show error: "Session expired"
  return
}

// Session valid - show scanner with banner
// "Connected to Bin BIN001"
```

### 6. Session Completion (Success Page)
```javascript
// On success page load
const session = getSession(sessionId)
completeSession(session.sessionId)
localStorage.removeItem('current_bin_session')

// Show success with bin info
// "Bin BIN001"
```

---

## 📊 Session States

### Active Session
```javascript
{
  sessionId: "session_1234567890_abc123",
  binId: "BIN001",
  userId: "user123",
  userName: "John Doe",
  userEmail: "john@example.com",
  userAvatar: "https://ui-avatars.com/...",
  createdAt: "2024-01-01T12:00:00Z",
  expiresAt: "2024-01-01T12:05:00Z",  // 5 minutes
  status: "active"
}
```

### Expired Session
```javascript
{
  ...session,
  status: "expired"  // After 5 minutes
}
```

### Completed Session
```javascript
{
  ...session,
  status: "completed"  // After successful recycling
}
```

---

## 🎨 UI States

### Mobile Scanner States

#### 1. No Session (Error State)
```
Icon: link_off (red)
Title: "No Bin Connected"
Message: "No active bin session. Please scan a bin QR code first."
Instructions:
  1. Find a smart bin near you
  2. Scan the QR code on the bin
  3. Wait for connection confirmation
  4. Start scanning your e-waste
Button: "Find & Scan Bin QR Code" → Redirects to /
```

#### 2. Session Expired (Error State)
```
Icon: link_off (red)
Title: "No Bin Connected"
Message: "Session expired. Please scan a bin QR code again."
Button: "Find & Scan Bin QR Code" → Redirects to /
```

#### 3. Active Session (Scanner State)
```
Banner: "Connected to Bin BIN001" (green dot, primary bg)
Camera: Full screen with viewfinder
Controls: Flash, Capture, Gallery
```

### Bin Kiosk States

#### 1. Idle State
```
QR Code: Center of screen (200x200px)
Text: "Scan QR on your phone to begin"
Logo: Solar Earth with orbiting animation
Status: "Ready" (green pulsing dot)
```

#### 2. Connected State
```
Avatar: User profile picture (circular)
Badge: Green checkmark
Title: "Welcome, John Doe!"
Subtitle: "Device linked successfully"
Card: "Bin ID: BIN001"
Action: "Place your item inside" (animated arrow)
```

#### 3. Scanning State
```
Radar: Concentric circles with scanning animation
Progress: 0% → 100%
Text: "Analyzing Item..."
Sensors: Visual, Weight, Size (active indicators)
```

#### 4. Result State
```
Icon: Item icon (smartphone, laptop, etc.)
Badge: "High Confidence" (green)
Title: "Detected: Phone"
Buttons: "Confirm & Recycle", "Incorrect? Retake Scan"
```

#### 5. Success State
```
Icon: Check mark (green, pulsing)
Title: "Item recycled successfully"
Subtitle: "Impact stats & rewards sent to your phone"
Countdown: 5 seconds → Returns to idle
```

---

## 🔄 Error Handling

### User Not Authenticated
```
Location: /bin/[binId]/connect
Error: "Please sign in first"
Action: Redirect to /sign-in after 2 seconds
```

### No Active Session
```
Location: /scanner
Error: "No active bin session"
Action: Show instructions + "Find & Scan Bin QR Code" button
```

### Session Expired
```
Location: /scanner
Error: "Session expired"
Action: Clear session + Show instructions
```

### Camera Permission Denied
```
Location: /scanner (camera-capture)
Error: "Unable to access camera. Please grant camera permissions."
Action: Show error banner + File upload option
```

### Session Not Found
```
Location: /scanner
Error: "Session not found. Please scan a bin QR code again."
Action: Clear session + Redirect to /
```

---

## 🧪 Testing Checklist

### Authentication
- [ ] Sign up with new account
- [ ] Sign in with existing account
- [ ] Sign out from profile page
- [ ] Session persists after page refresh
- [ ] Redirect to sign-in when not authenticated

### QR Session
- [ ] QR code displays on bin kiosk
- [ ] Scan QR code with phone camera
- [ ] Connection page loads
- [ ] Session created successfully
- [ ] Redirect to scanner after connection
- [ ] Bin kiosk detects session
- [ ] Bin shows user info

### Scanner
- [ ] Scanner checks for active session
- [ ] Shows error when no session
- [ ] Shows session banner when connected
- [ ] Camera permission works (HTTPS)
- [ ] Can capture photo
- [ ] Detection flow works
- [ ] Success page shows bin info
- [ ] Session completed after success

### Session Expiry
- [ ] Session expires after 5 minutes
- [ ] Scanner shows error for expired session
- [ ] Bin returns to idle after expiry
- [ ] User must rescan QR code

---

## 🚀 Demo Script

```
1. SETUP (Before Demo)
   - Laptop: Open http://localhost:3001/bin/BIN001 (fullscreen)
   - Phone: Open https://[ngrok-url] (sign in)
   - Verify: Both on same network, ngrok running

2. INTRODUCTION
   "This is our Smart E-Waste Bin System with AI-powered detection"

3. AUTHENTICATION
   "First, I'll sign into the mobile app"
   - Show sign-in page
   - Enter credentials
   - Show home page with map

4. BIN CONNECTION
   "Now I'll connect to this smart bin by scanning its QR code"
   - Show bin kiosk with QR code
   - Scan QR with phone
   - Show connection animation
   - Show "Connected Successfully!"

5. BIN RECOGNITION
   "The bin recognizes me and unlocks"
   - Show laptop screen with user avatar
   - Show "Welcome, [Name]!"
   - Point to "Place your item inside"

6. ITEM SCANNING
   "I'll scan my old phone"
   - Show mobile scanner with session banner
   - Point camera at item
   - Capture photo
   - Show detection result

7. CONFIRMATION
   "The AI detected it's a phone with 92% confidence"
   - Show detection details
   - Tap "Confirm & Recycle"

8. SUCCESS
   "Success! I earned 50 points and saved 0.8kg of CO2"
   - Show success screen on mobile
   - Show bin info: "Bin BIN001"
   - Show impact stats
   - Show bin kiosk success animation

9. COMPLETION
   "The bin returns to idle, ready for the next user"
   - Show bin countdown
   - Show return to idle state
   - Show QR code again

10. CLOSING
    "And that's how easy it is to recycle e-waste and earn rewards!"
```

---

## 📝 Key Files Reference

| File | Purpose |
|------|---------|
| `lib/services/session-service.ts` | Session management logic |
| `lib/auth/simple-auth.ts` | User authentication |
| `app/bin/[binId]/connect/page.tsx` | QR connection handler |
| `components/bin/bin-interface.tsx` | Bin kiosk UI |
| `components/pages/scanner.tsx` | Mobile scanner with session check |
| `components/pages/success-screen.tsx` | Success page with session completion |
| `components/scanner/camera-capture.tsx` | Camera interface |
| `components/scanner/detection-flow.tsx` | Detection workflow |

---

## 🔧 Configuration

### Session Duration
```javascript
// lib/services/session-service.ts
const SESSION_DURATION = 5 * 60 * 1000 // 5 minutes
```

### Polling Interval
```javascript
// components/bin/bin-interface.tsx
setInterval(() => {
  const session = getActiveBinSession(binId)
  // ...
}, 1000) // Check every 1 second
```

### QR Code Settings
```javascript
// components/bin/bin-interface.tsx
QRCode.toDataURL(qrData, {
  width: 200,
  margin: 1,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
})
```
