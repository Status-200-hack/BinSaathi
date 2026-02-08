# QR Code Session Flow

## Overview
The QR code session system links mobile users to physical bin kiosks, enabling a seamless recycling experience where users authenticate on their mobile device and interact with the bin interface.

## Flow Diagram

```
Mobile App (User)                    Bin Kiosk (Laptop)
─────────────────                    ──────────────────
1. User logs in
   ↓
2. Scans QR code ──────────────────→ QR code displayed
   from bin                          on idle screen
   ↓
3. Redirected to
   /bin/[binId]/connect
   ↓
4. Session created
   (localStorage)
   ↓                                  ↓
5. Redirected to                   Polling detects
   /scanner                        active session
   ↓                                  ↓
6. User scans item                 Shows "Connected"
   with camera                     screen with user info
   ↓                                  ↓
7. Detection flow                  Bin unlocks hatch
   continues                          ↓
   ↓                               User places item
8. Success screen ←────────────────→ Bin scans item
   with rewards                       ↓
                                   Shows result
                                      ↓
                                   Success screen
                                      ↓
                                   Returns to idle
```

## Implementation Details

### 1. QR Code Generation
**File:** `lib/services/session-service.ts`

The QR code contains a URL that points to:
```
https://[your-domain]/bin/[binId]/connect
```

When scanned, this opens the mobile app and initiates the connection flow.

**QR Code Display:**
- Shown on bin idle screen
- Generated using `qrcode` npm package
- 200x200px size with 1px margin
- Black on white for maximum contrast

### 2. Session Creation
**File:** `app/bin/[binId]/connect/page.tsx`

When user scans QR code:
1. Checks if user is authenticated (redirects to sign-in if not)
2. Creates a new session with:
   - Unique session ID
   - Bin ID
   - User info (ID, name, email, avatar)
   - Expiration time (5 minutes)
3. Stores session in localStorage
4. Redirects to `/scanner`

### 3. Session Polling
**File:** `components/bin/bin-interface.tsx`

The bin kiosk continuously polls for active sessions:
- Checks every 1 second when in idle state
- Looks for sessions matching the bin ID
- Validates session hasn't expired
- Transitions to "connected" state when found

### 4. Session Data Structure

```typescript
interface BinSession {
  sessionId: string      // Unique identifier
  binId: string          // Which bin this session is for
  userId: string         // User's ID
  userName: string       // User's display name
  userEmail: string      // User's email
  userAvatar: string     // User's avatar URL
  createdAt: string      // ISO timestamp
  expiresAt: string      // ISO timestamp (5 min from creation)
  status: 'active' | 'expired' | 'completed'
}
```

### 5. Session Lifecycle

**Active Session (5 minutes):**
- User can interact with bin
- Session can be extended
- Bin shows user info

**Expired Session:**
- Automatically marked as expired after 5 minutes
- User must scan QR code again
- Bin returns to idle state

**Completed Session:**
- Marked when recycling is successful
- Rewards are credited
- Session is archived

## Key Files

### Core Services
- `lib/services/session-service.ts` - Session management logic
- `lib/auth/simple-auth.ts` - User authentication

### Pages
- `app/bin/[binId]/page.tsx` - Bin kiosk main page
- `app/bin/[binId]/connect/page.tsx` - QR connection handler
- `app/(dashboard)/scanner/page.tsx` - Mobile scanner page

### Components
- `components/bin/bin-interface.tsx` - Bin UI with QR code
- `components/pages/scanner.tsx` - Mobile scanner interface

## API Functions

### Session Management

```typescript
// Create a new session
createBinSession(binId, userId, userName, userEmail, userAvatar): BinSession

// Get session by ID
getSession(sessionId): BinSession | null

// Get active session for a bin
getActiveBinSession(binId): BinSession | null

// Complete a session
completeSession(sessionId): boolean

// Extend session duration
extendSession(sessionId): boolean

// Generate QR code data
generateQRData(binId): string
```

## User Experience

### Mobile User Flow
1. **Login** - User signs in with email/password
2. **Scan QR** - Opens camera and scans bin QR code
3. **Connect** - Sees "Connecting to Bin" animation
4. **Success** - Sees "Connected Successfully!" message
5. **Scanner** - Redirected to scanner page
6. **Scan Item** - Uses camera to scan e-waste item
7. **Confirm** - Reviews detection result
8. **Success** - Sees rewards and impact stats

### Bin Kiosk Flow
1. **Idle** - Shows QR code and "Scan to begin" message
2. **Detect Session** - Polls for active session
3. **Connected** - Shows user avatar and name
4. **Unlock** - Hatch unlocks for item deposit
5. **Scanning** - Analyzes deposited item
6. **Result** - Shows detection result
7. **Success** - Shows success animation
8. **Reset** - Returns to idle after 5 seconds

## Security Considerations

### Current Implementation (Demo)
⚠️ Sessions stored in localStorage (client-side only)
⚠️ No server-side validation
⚠️ No encryption
⚠️ Suitable for hackathon/demo only

### Production Recommendations
✅ Store sessions in database (Redis/PostgreSQL)
✅ Use WebSocket for real-time updates
✅ Implement JWT tokens for authentication
✅ Add session encryption
✅ Rate limit QR scans
✅ Add session hijacking protection
✅ Implement proper CORS policies
✅ Use HTTPS only

## Testing

### Manual Testing Steps

1. **Start Development Server**
   ```bash
   npm run dev -- -p 3001 -H 0.0.0.0
   ```

2. **Open Bin Kiosk (Laptop)**
   - Navigate to `http://localhost:3001/bin/BIN001`
   - Verify QR code is displayed
   - Note the QR code URL

3. **Open Mobile App (Phone)**
   - Navigate to `http://[laptop-ip]:3001`
   - Sign in with test account
   - Scan QR code (or manually enter URL)

4. **Verify Connection**
   - Mobile: Should see "Connected Successfully!"
   - Laptop: Should show user avatar and name
   - Mobile: Should redirect to scanner

5. **Test Session Expiry**
   - Wait 5 minutes
   - Verify session expires
   - Bin returns to idle state

### Test Scenarios

- ✅ User not logged in → Redirects to sign-in
- ✅ Valid QR scan → Creates session
- ✅ Session detected → Bin shows connected state
- ✅ Session expires → Bin returns to idle
- ✅ Multiple bins → Each has independent sessions
- ✅ Session completion → Marks as completed

## Troubleshooting

### QR Code Not Displaying
- Check if `qrcode` package is installed
- Verify `generateQRData()` returns valid URL
- Check browser console for errors

### Session Not Detected
- Verify localStorage is enabled
- Check session expiration time
- Ensure bin ID matches
- Check polling interval (1 second)

### Connection Fails
- Verify user is authenticated
- Check network connectivity
- Ensure both devices on same network
- Check CORS settings

## Future Enhancements

1. **Real-time Updates** - Use WebSocket instead of polling
2. **Multi-device Support** - Allow multiple users per bin
3. **Session History** - Track all past sessions
4. **Analytics** - Monitor session success rates
5. **Push Notifications** - Alert user when bin is ready
6. **Offline Support** - Queue sessions when offline
7. **Admin Dashboard** - Monitor active sessions
8. **Session Recovery** - Resume interrupted sessions
