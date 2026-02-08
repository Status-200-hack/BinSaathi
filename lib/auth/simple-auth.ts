// Simple authentication using localStorage (for demo purposes)
// In production, use a proper backend with secure password hashing

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  createdAt: string
}

const USERS_KEY = 'ewaste_users'
const CURRENT_USER_KEY = 'ewaste_current_user'

// Get all users from localStorage
function getUsers(): Record<string, { password: string; user: User }> {
  if (typeof window === 'undefined') return {}
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : {}
}

// Save users to localStorage
function saveUsers(users: Record<string, { password: string; user: User }>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// Sign up a new user
export function signUp(name: string, email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers()
  
  // Check if user already exists
  if (users[email]) {
    return { success: false, error: 'Email already registered' }
  }
  
  // Create new user
  const user: User = {
    id: Date.now().toString(),
    name,
    email,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f9a406&color=231c0f&size=200`,
    createdAt: new Date().toISOString()
  }
  
  // Save user
  users[email] = { password, user }
  saveUsers(users)
  
  // Set as current user
  setCurrentUser(user)
  
  return { success: true, user }
}

// Sign in an existing user
export function signIn(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers()
  
  // Check if user exists
  if (!users[email]) {
    return { success: false, error: 'Email not found' }
  }
  
  // Check password
  if (users[email].password !== password) {
    return { success: false, error: 'Incorrect password' }
  }
  
  // Set as current user
  setCurrentUser(users[email].user)
  
  return { success: true, user: users[email].user }
}

// Sign out current user
export function signOut() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CURRENT_USER_KEY)
  // Also remove the cookie
  document.cookie = 'ewaste_current_user=; path=/; max-age=0'
}

// Get current user
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem(CURRENT_USER_KEY)
  return user ? JSON.parse(user) : null
}

// Set current user
function setCurrentUser(user: User) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  // Also set a cookie for server-side checks if needed
  document.cookie = `ewaste_current_user=${user.id}; path=/; max-age=2592000` // 30 days
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
