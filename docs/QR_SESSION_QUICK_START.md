# QR Session Flow - Quick Start Guide

## What Changed?

Your app now has a complete QR-based session system where:
1. User logs in on **mobile**
2. User scans QR code from **bin kiosk** (laptop)
3. Session is created linking user to bin
4. Detection flow continues on bin UI

## New Files Created

### Core Services
- `lib/services/session-service.ts` - Session management (create, get, complete sessions)

### Pages
- `app/bin/[binId]/connect/page.tsx` - Handles QR scan connection

### Documentation
- `docs/QR_SESSION_FLOW.md` - Complete technical documentation
- `docs/QR_SESSION_QUICK_START.md` - This file

## Updated Files

### Components
- `components/bin/bin-interface.tsx` - Added QR code display and session polling
- `components/pages/bin-finder.tsx` - Removed profile button from home

### Packages
- Added `qrcode` and `@types/qrcode` for QR code generation

## How It Works

### Step 1: Bin Shows QR Code (Idle State)
```
Laptop: http://localhost:3001/bin/BIN001
- Displays QR code
- Shows "Scan QR on your phone to begin"
- Polls for active session every 1 second
```

### Step 2: User Scans QR Code
```
Mobile: User scans QR code with camera app
- QR contains: http://localhost:3001/bin/BIN001/connect
- Opens in browser
- Checks if user is logged in
- If not → redirects to /sign-in
- If yes → creates session
```

### Step 3: Session Created
```
Session stored in localStorage:
{
  sessionId: "session_1234567890_abc123",
  binId: "BIN001",
  userId: "user123",
  userName: "John Doe",
  userEmail: "john@example.com",
  userAvatar: "https://...",
  createdAt: "2024-01-01T12:00:00Z",
  expiresAt: "2024-01-01T12:05:00Z",  // 5 minutes
  status: "active"
}
```

### Step 4: Bin Detects Session
```
Laptop: Polling detects active session
- Changes state from "idle" to "connected"
- Shows user avatar and name
- Displays "Welcome, John Doe!"
- Shows "Place your item inside" message
```

### Step 5: User Redirected to Scanner
```
Mobile: Automatically redirected to /scanner
- User can now scan items with camera
- Detection flow continues as normal
```

### Step 6: Item Deposited
```
Laptop: User places item in bin
- Bin scans item
- Shows detection result
- Confirms with user
- Shows success screen
- Returns to idle after 5 seconds
```

## Testing Instructions

### 1. Start Dev Server
```bash
npm run dev -- -p 3001 -H 0.0.0.0
```

### 2. Open Bin Kiosk (Laptop)
```
Browser: http://localhost:3001/bin/BIN001
- You should see QR code on screen
- Note: Replace BIN001 with any bin ID
```

### 3. Test on Mobile

#### Option A: Scan QR Code (Recommended)
1. Open camera app on phone
2. Point at QR code on laptop screen
3. Tap notification to open link
4. Should redirect to connection page

#### Option B: Manual URL (For Testing)
1. Find your laptop's IP address:
   - Windows: `ipconfig` → Look for IPv4 Address
   - Mac/Linux: `ifconfig` → Look for inet
2. On mobile browser, go to:
   ```
   http://[LAPTOP_IP]:3001/bin/BIN001/connect
   ```
3. Example: `http://192.168.1.100:3001/bin/BIN001/connect`

### 4. Verify Flow
- ✅ Mobile shows "Connecting to Bin" animation
- ✅ Mobile shows "Connected Successfully!"
- ✅ Laptop shows user avatar and name
- ✅ Mobile redirects to /scanner
- ✅ User can scan items

## Session Management

### Session Duration
- **Default:** 5 minutes
- **Extendable:** Yes (call `extendSession()`)
- **Auto-expire:** Yes, after 5 minutes

### Session States
- `active` - User can interact with bin
- `expired` - Session timed out, need to rescan QR
- `completed` - Recycling successful, rewards credited

### Key Functions

```typescript
// Create session (called when QR scanned)
createBinSession(binId, userId, userName, userEmail, userAvatar)

// Get active session for bin (called by bin kiosk)
getActiveBinSession(binId)

// Complete session (called after successful recycling)
completeSession(sessionId)

// Extend session (add 5 more minutes)
extendSession(sessionId)
```

## Troubleshooting

### QR Code Not Showing
- Check if `qrcode` package is installed: `npm list qrcode`
- Check browser console for errors
- Verify bin ID is valid

### Session Not Detected
- Check localStorage in browser DevTools
- Verify both devices on same network
- Check if session expired (5 min limit)
- Ensure bin ID matches

### Mobile Can't Connect
- Verify user is logged in
- Check network connectivity
- Ensure laptop IP is accessible from mobile
- Try manual URL instead of QR scan

### Connection Page Shows Error
- Check if user is authenticated
- Verify bin ID exists
- Check browser console for errors

## Network Setup

### Same Network Required
Both laptop (bin kiosk) and mobile must be on the same network:
- ✅ Same WiFi network
- ✅ Mobile hotspot (laptop connected to phone)
- ❌ Different networks (won't work)

### Firewall Settings
If connection fails, check firewall:
- Windows: Allow Node.js through firewall
- Mac: System Preferences → Security → Firewall
- Port 3001 must be accessible

## Next Steps

### For Demo/Hackathon
1. Test the complete flow end-to-end
2. Prepare multiple test accounts
3. Have backup QR codes printed
4. Test on actual mobile devices
5. Verify on different networks

### For Production
1. Move sessions to database (Redis/PostgreSQL)
2. Implement WebSocket for real-time updates
3. Add JWT authentication
4. Implement session encryption
5. Add rate limiting
6. Use HTTPS only
7. Add session recovery
8. Implement admin dashboard

## Demo Script

```
1. "Here's our smart bin kiosk" [Show laptop with QR code]

2. "I'll log into the mobile app" [Show phone, sign in]

3. "Now I scan the QR code" [Scan QR with phone camera]

4. "The bin recognizes me!" [Show laptop with user info]

5. "I can now scan my e-waste" [Show phone scanner]

6. "I place the item in the bin" [Gesture to bin]

7. "The bin analyzes it" [Show laptop scanning screen]

8. "Success! I earned rewards" [Show both screens]
```

## Support

For issues or questions:
- Check `docs/QR_SESSION_FLOW.md` for detailed docs
- Check `docs/AUTHENTICATION.md` for auth details
- Review browser console for errors
- Check localStorage in DevTools
