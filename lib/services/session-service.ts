// Session service for linking mobile users to bin kiosks via QR code

export interface BinSession {
  sessionId: string
  binId: string
  userId: string
  userName: string
  userEmail: string
  userAvatar: string
  createdAt: string
  expiresAt: string
  status: 'active' | 'expired' | 'completed'
}

const SESSIONS_KEY = 'ewaste_bin_sessions'
const SESSION_DURATION = 5 * 60 * 1000 // 5 minutes

// Generate a unique session ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Get all sessions from localStorage
function getSessions(): Record<string, BinSession> {
  if (typeof window === 'undefined') return {}
  const sessions = localStorage.getItem(SESSIONS_KEY)
  return sessions ? JSON.parse(sessions) : {}
}

// Save sessions to localStorage
function saveSessions(sessions: Record<string, BinSession>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

// Create a new bin session (called when QR is scanned)
export function createBinSession(
  binId: string,
  userId: string,
  userName: string,
  userEmail: string,
  userAvatar: string
): BinSession {
  const sessions = getSessions()
  const sessionId = generateSessionId()
  const now = Date.now()
  
  const session: BinSession = {
    sessionId,
    binId,
    userId,
    userName,
    userEmail,
    userAvatar,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_DURATION).toISOString(),
    status: 'active'
  }
  
  sessions[sessionId] = session
  saveSessions(sessions)
  
  return session
}

// Get session by ID
export function getSession(sessionId: string): BinSession | null {
  const sessions = getSessions()
  const session = sessions[sessionId]
  
  if (!session) return null
  
  // Check if expired
  if (new Date(session.expiresAt) < new Date()) {
    session.status = 'expired'
    saveSessions(sessions)
    return session
  }
  
  return session
}

// Get active session for a bin
export function getActiveBinSession(binId: string): BinSession | null {
  const sessions = getSessions()
  const now = new Date()
  
  // Find the most recent active session for this bin
  const activeSessions = Object.values(sessions)
    .filter(s => s.binId === binId && s.status === 'active' && new Date(s.expiresAt) > now)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  
  return activeSessions[0] || null
}

// Complete a session (after successful recycling)
export function completeSession(sessionId: string): boolean {
  const sessions = getSessions()
  const session = sessions[sessionId]
  
  if (!session) return false
  
  session.status = 'completed'
  saveSessions(sessions)
  
  return true
}

// Extend session duration (add 5 more minutes)
export function extendSession(sessionId: string): boolean {
  const sessions = getSessions()
  const session = sessions[sessionId]
  
  if (!session || session.status !== 'active') return false
  
  const newExpiry = new Date(Date.now() + SESSION_DURATION)
  session.expiresAt = newExpiry.toISOString()
  saveSessions(sessions)
  
  return true
}

// Clear expired sessions (cleanup)
export function clearExpiredSessions() {
  const sessions = getSessions()
  const now = new Date()
  
  Object.keys(sessions).forEach(sessionId => {
    const session = sessions[sessionId]
    if (new Date(session.expiresAt) < now && session.status === 'active') {
      session.status = 'expired'
    }
  })
  
  saveSessions(sessions)
}

// Generate QR code data for bin
export function generateQRData(binId: string): string {
  // This will be the URL that mobile app opens when QR is scanned
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  return `${baseUrl}/bin/${binId}/connect`
}
