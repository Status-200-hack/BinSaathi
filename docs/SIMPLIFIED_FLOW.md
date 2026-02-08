# Simplified QR Flow - Smart E-Waste Bin System

## 🎯 New Simplified Flow

The scanner now automatically detects both QR codes and items!

---

## 📱 Complete User Journey

```
1. User opens mobile app
   ↓
2. User signs in
   ↓
3. User goes to /scanner
   ↓
4. Camera opens
   ↓
5. User points camera at bin QR code
   ↓
6. Scanner detects QR code automatically
   ↓
7. Extracts bin ID from QR
   ↓
8. Creates session
   ↓
9. Redirects to /bin/[binId]/connect
   ↓
10. Shows "Connected Successfully!"
    ↓
11. Redirects back to /scanner
    ↓
12. Shows session banner: "Connected to Bin BIN001"
    ↓
13. User scans e-waste item
    ↓
14. AI detects item
    ↓
15. Shows success on mobile
    ↓
16. Bin UI shows success animation
```

---

## 🔍 How QR Detection Works

### Camera Capture with QR Detection

```javascript
// components/scanner/camera-capture.tsx

const capturePhoto = () => {
  // 1. Capture frame from video
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  
  // 2. Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  
  // 3. Try to detect QR code
  const qrCode = jsQR(imageData.data, imageData.width, imageData.height)
  
  // 4. Check if QR code found
  if (qrCode && qrCode.data) {
    // 5. Check if it's a bin QR code
    if (qrCode.data.includes('/bin/') && qrCode.data.includes('/connect')) {
      // 6. Redirect to connection page
      window.location.href = qrCode.data
      return
    }
  }
  
  // 7. No QR code - treat as item photo
  onCapture(imageDataUrl)
}
```

---

## 🎨 User Experience

### Scenario 1: Scanning Bin QR Code

```
User Action: Opens scanner, points at bin QR code, taps capture
Scanner: Detects QR code pattern
System: Extracts URL: "https://[domain]/bin/BIN001/connect"
System: Redirects to connection page
Page: Shows "Connecting to Bin..."
Page: Creates session
Page: Shows "Connected Successfully!"
Page: Redirects to scanner
Scanner: Shows banner "Connected to Bin BIN001"
```

### Scenario 2: Scanning E-Waste Item

```
User Action: Opens scanner, points at phone, taps capture
Scanner: No QR code detected
System: Treats as item photo
AI: Analyzes image
AI: Detects "Phone" with 92% confidence
Page: Shows detection result
User: Confirms
Page: Shows success with rewards
```

---

## 🔄 Session Flow

### Without Session (First Time)

```
1. User opens /scanner
2. No session banner shown
3. User scans bin QR code
4. Session created
5. Scanner shows session banner
6. User can now scan items
```

### With Active Session

```
1. User opens /scanner
2. Session banner shown: "Connected to Bin BIN001"
3. User scans items directly
4. Success shown on both screens
```

---

## 📊 Technical Details

### QR Code Format

```
URL: https://[domain]/bin/[binId]/connect

Examples:
https://abc123.ngrok-free.app/bin/BIN001/connect
https://abc123.ngrok-free.app/bin/BIN002/connect
https://abc123.ngrok-free.app/bin/CENTRAL-HUB/connect
```

### QR Detection Library

```bash
# Installed package
npm install jsqr --legacy-peer-deps

# Usage
import jsQR from 'jsqr'

const qrCode = jsQR(imageData.data, width, height)
if (qrCode) {
  console.log('QR Data:', qrCode.data)
}
```

### Session Check

```javascript
// Scanner checks for active session on load
const sessionId = localStorage.getItem('current_bin_session')
if (sessionId) {
  const session = getSession(sessionId)
  if (session && session.status === 'active') {
    // Show session banner
    setActiveSession(session)
  }
}
```

---

## ✅ Benefits of This Approach

1. **Single Scanner** - One interface for both QR codes and items
2. **Automatic Detection** - No need to choose "scan QR" vs "scan item"
3. **Smart Recognition** - Detects QR pattern automatically
4. **Seamless Flow** - QR scan → connect → back to scanner
5. **Optional Session** - Can scan items without session (for testing)
6. **Session Persistence** - Session banner shows when connected

---

## 🧪 Testing

### Test QR Detection

1. Open scanner: `https://[ngrok-url]/scanner`
2. Point camera at bin QR code on laptop
3. Tap capture button
4. Should detect QR and redirect
5. Should show "Connected Successfully!"
6. Should redirect back to scanner
7. Should show session banner

### Test Item Detection

1. Open scanner (with or without session)
2. Point camera at e-waste item
3. Tap capture button
4. Should analyze as item (not QR)
5. Should show detection result
6. Should show success page

### Test Session Banner

1. Scan bin QR code
2. Session created
3. Go back to scanner
4. Should see banner: "Connected to Bin BIN001"
5. Banner persists across page refreshes
6. Banner disappears after session expires (5 min)

---

## 🎬 Demo Script

```
1. "I'll open the scanner on my phone"
   - Show scanner page

2. "First, I'll connect to this smart bin"
   - Point camera at bin QR code on laptop
   - Tap capture
   - Show QR detection happening

3. "The scanner detected the QR code and connected me"
   - Show "Connected Successfully!" page
   - Show redirect to scanner
   - Show session banner

4. "Now I'm connected to Bin BIN001"
   - Point to session banner at top

5. "Let me scan my old phone"
   - Point camera at phone
   - Tap capture
   - Show AI detection

6. "The AI detected it's a phone with high confidence"
   - Show detection result
   - Tap confirm

7. "Success! I earned points and the bin shows success too"
   - Show mobile success screen
   - Show laptop bin success animation
   - Both screens synchronized!
```

---

## 🔧 Configuration

### QR Detection Sensitivity

```javascript
// Adjust in camera-capture.tsx
const qrCode = jsQR(
  imageData.data,
  imageData.width,
  imageData.height,
  {
    inversionAttempts: "dontInvert", // Faster
    // or
    inversionAttempts: "attemptBoth"  // More accurate
  }
)
```

### Session Duration

```javascript
// lib/services/session-service.ts
const SESSION_DURATION = 5 * 60 * 1000 // 5 minutes
```

---

## 📝 Key Files

| File | Purpose |
|------|---------|
| `components/scanner/camera-capture.tsx` | QR detection + item capture |
| `components/pages/scanner.tsx` | Session check + scanner UI |
| `app/bin/[binId]/connect/page.tsx` | Session creation |
| `lib/services/session-service.ts` | Session management |

---

## 🚀 Quick Start

1. **Start server:**
   ```bash
   npm run dev -- -p 3001 -H 0.0.0.0
   ```

2. **Start ngrok:**
   ```bash
   ngrok http 3001
   ```

3. **Open bin kiosk (laptop):**
   ```
   http://localhost:3001/bin/BIN001
   ```

4. **Open scanner (phone):**
   ```
   https://[ngrok-url]/scanner
   ```

5. **Point camera at QR code and capture!**

---

## 💡 Pro Tips

1. **QR Detection** - Hold camera steady for 1-2 seconds before capturing
2. **Lighting** - Ensure QR code is well-lit for better detection
3. **Distance** - Keep QR code filling about 50% of viewfinder
4. **Fallback** - If QR not detected, manually go to connection URL
5. **Session** - Session lasts 5 minutes, rescan QR if expired
