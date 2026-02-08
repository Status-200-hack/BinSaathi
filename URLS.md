# Smart E-Waste Bin System - URLs

## 🚀 Start Development Server

```bash
npm run dev -- -p 3001 -H 0.0.0.0
```

**Important:** After making changes, restart the server and clear `.next` cache:
```bash
# Stop server (Ctrl+C)
# Delete cache
Remove-Item -Recurse -Force .next
# Start again
npm run dev -- -p 3001 -H 0.0.0.0
```

---

## 🗑️ BIN KIOSK UI (Laptop/Desktop)

### Main Bin Interface
```
http://localhost:3001/bin/BIN001
```

### Try Different Bin IDs
```
http://localhost:3001/bin/BIN001
http://localhost:3001/bin/BIN002
http://localhost:3001/bin/CENTRAL-HUB
http://localhost:3001/bin/LOBBY-01
```

**What You Should See:**
- ✅ QR code in center
- ✅ "Recycle E-Waste Here" heading
- ✅ Solar Earth logo with orbiting animation
- ✅ "Scan QR on your phone to begin" text
- ✅ System status showing "Ready"
- ✅ Theme toggle button

---

## 👨‍💼 ADMIN DASHBOARD (Laptop/Desktop)

### Main Admin Dashboard
```
http://localhost:3001/admin
```

### Admin Analytics
```
http://localhost:3001/admin/analytics
```

### Bin Management
```
http://localhost:3001/admin/bins
```

### User Management
```
http://localhost:3001/admin/users
```

**What You Should See:**
- ✅ Admin sidebar with navigation
- ✅ Stats cards (Total Bins, Active Users, etc.)
- ✅ Recent activity feed
- ✅ Alerts panel
- ✅ Charts and analytics

---

## 📱 MOBILE APP (Phone/Tablet)

**Replace `192.168.29.91` with your laptop's IP address**

### Home / Bin Finder
```
http://192.168.29.91:3001/
```

### Authentication
```
http://192.168.29.91:3001/sign-in
http://192.168.29.91:3001/sign-up
```

### Main Features
```
http://192.168.29.91:3001/scanner
http://192.168.29.91:3001/impact
http://192.168.29.91:3001/rewards
http://192.168.29.91:3001/profile
http://192.168.29.91:3001/receipt
```

### QR Connection (Auto-opened when scanning QR)
```
http://192.168.29.91:3001/bin/BIN001/connect
```

---

## 🔍 TROUBLESHOOTING

### "404 Not Found" Error

**Solution 1: Clear Cache and Restart**
```bash
# Stop server (Ctrl+C)
Remove-Item -Recurse -Force .next
npm run dev -- -p 3001 -H 0.0.0.0
```

**Solution 2: Check URL Format**
- ✅ Correct: `http://localhost:3001/bin/BIN001`
- ❌ Wrong: `http://localhost:3001/bin/` (missing bin ID)
- ❌ Wrong: `http://localhost:3001/bins/BIN001` (wrong path)

**Solution 3: Verify Server is Running**
```bash
# You should see:
# ▲ Next.js 14.0.4
# - Local:        http://localhost:3001
# - Network:      http://0.0.0.0:3001
```

**Solution 4: Check File Structure**
```
app/
  bin/
    [binId]/
      page.tsx          ← This file must exist
      connect/
        page.tsx        ← This file must exist
```

### Admin Page Not Loading

**Solution: Admin routes are now public (no auth required)**
- Updated `components/auth/auth-guard.tsx` to allow `/admin` routes
- Restart server after update

### Mobile Can't Access

**Solution 1: Find Laptop IP**
```bash
# Windows
ipconfig
# Look for "IPv4 Address"

# Mac/Linux
ifconfig
# Look for "inet"
```

**Solution 2: Check Firewall**
- Windows: Allow Node.js through Windows Firewall
- Mac: System Preferences → Security → Firewall → Allow Node

**Solution 3: Same Network**
- Both devices must be on same WiFi network
- Or use mobile hotspot with laptop connected

### QR Code Not Showing

**Check Browser Console:**
```
F12 → Console tab
Look for errors related to "qrcode" or "canvas"
```

**Verify Package Installed:**
```bash
npm list qrcode
# Should show: qrcode@1.x.x
```

**Reinstall if needed:**
```bash
npm install qrcode @types/qrcode --legacy-peer-deps
```

---

## ✅ TESTING CHECKLIST

### Bin Kiosk (Laptop)
- [ ] Open `http://localhost:3001/bin/BIN001`
- [ ] See QR code displayed
- [ ] See "Ready" status
- [ ] Theme toggle works
- [ ] No console errors

### Admin Dashboard (Laptop)
- [ ] Open `http://localhost:3001/admin`
- [ ] See dashboard with stats
- [ ] Sidebar navigation works
- [ ] Can access analytics, bins, users pages

### Mobile App (Phone)
- [ ] Open `http://[LAPTOP-IP]:3001`
- [ ] Can sign up / sign in
- [ ] Can access all pages
- [ ] Bottom navigation works

### QR Flow (Both Devices)
- [ ] Laptop shows QR code
- [ ] Mobile scans QR code
- [ ] Mobile redirects to connection page
- [ ] Laptop detects session
- [ ] Laptop shows user info
- [ ] Mobile redirects to scanner

---

## 📝 QUICK REFERENCE

| Feature | URL Pattern | Example |
|---------|-------------|---------|
| Bin Kiosk | `/bin/[binId]` | `/bin/BIN001` |
| Bin Connect | `/bin/[binId]/connect` | `/bin/BIN001/connect` |
| Admin | `/admin` | `/admin` |
| Admin Analytics | `/admin/analytics` | `/admin/analytics` |
| Admin Bins | `/admin/bins` | `/admin/bins` |
| Admin Users | `/admin/users` | `/admin/users` |
| Home | `/` | `/` |
| Sign In | `/sign-in` | `/sign-in` |
| Sign Up | `/sign-up` | `/sign-up` |
| Scanner | `/scanner` | `/scanner` |
| Impact | `/impact` | `/impact` |
| Rewards | `/rewards` | `/rewards` |
| Profile | `/profile` | `/profile` |
| Receipt | `/receipt` | `/receipt` |

---

## 🎯 DEMO SETUP

### For Hackathon Presentation:

**Laptop Setup (Bin Kiosk):**
1. Open `http://localhost:3001/bin/BIN001` in Chrome
2. Press F11 for fullscreen
3. Position laptop to show QR code clearly

**Laptop Setup (Admin Dashboard):**
1. Open `http://localhost:3001/admin` in another window
2. Keep visible to show real-time monitoring

**Mobile Setup:**
1. Connect to same WiFi as laptop
2. Open `http://[LAPTOP-IP]:3001`
3. Sign in with demo account
4. Ready to scan QR code

**Backup Plan:**
- Print QR code as backup
- Have manual connection URL ready
- Test everything 30 minutes before demo

---

## 🆘 EMERGENCY FIXES

### Server Won't Start
```bash
# Kill any process on port 3001
netstat -ano | findstr :3001
taskkill /PID [PID_NUMBER] /F

# Clear everything and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
npm install --legacy-peer-deps
npm run dev -- -p 3001 -H 0.0.0.0
```

### Build Errors
```bash
# Clear cache
Remove-Item -Recurse -Force .next

# Check for TypeScript errors
npm run build

# If errors, check diagnostics
# Fix any reported issues
```

### Can't Access from Mobile
```bash
# Check if server is accessible
# On mobile browser, try:
http://[LAPTOP-IP]:3001/sign-in

# If fails, check:
# 1. Firewall settings
# 2. Network connection
# 3. IP address is correct
```

---

## 📞 SUPPORT

If issues persist:
1. Check browser console (F12)
2. Check server terminal for errors
3. Verify all files exist in correct locations
4. Clear cache and restart server
5. Check `docs/QR_SESSION_QUICK_START.md` for detailed troubleshooting
