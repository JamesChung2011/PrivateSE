"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "owner" | "staff" | "admin" | "customer"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  loginTime?: Date
  sessionId?: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  login: (user: User) => void
  switchRole: (role: UserRole) => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const mockUsers: Record<UserRole, User> = {
  owner: {
    id: "1",
    name: "John Doe",
    email: "john@flightmgmt.com",
    role: "owner",
    avatar: "👤",
  },
  staff: {
    id: "2",
    name: "Jane Smith",
    email: "jane@flightmgmt.com",
    role: "staff",
    avatar: "👤",
  },
  admin: {
    id: "3",
    name: "Admin User",
    email: "admin@flightmgmt.com",
    role: "admin",
    avatar: "👤",
  },
  customer: {
    id: "4",
    name: "Mike Johnson",
    email: "mike@customer.com",
    role: "customer",
    avatar: "👤",
  },
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedSession = localStorage.getItem("userSession")
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession)
        const loginTime = new Date(session.loginTime)
        const currentTime = new Date()
        const sessionDuration = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

        // Check if session has expired
        if (currentTime.getTime() - loginTime.getTime() > sessionDuration) {
          localStorage.removeItem("userSession")
          setUser(null)
        } else {
          setUser(session.user)
        }
      } catch (error) {
        console.error("Failed to restore session:", error)
        localStorage.removeItem("userSession")
        setUser(null)
      }
    }
    setIsLoading(false)
  }, [])

  const logout = () => {
    setUser(null)
    localStorage.removeItem("userSession")
    router.push("/auth/login")
  }

  const login = (newUser: User) => {
    const sessionData = {
      user: {
        ...newUser,
        loginTime: new Date().toISOString(),
        sessionId: `session_${Date.now()}`,
      },
      loginTime: new Date().toISOString(),
    }
    setUser(sessionData.user)
    localStorage.setItem("userSession", JSON.stringify(sessionData))
  }

  const switchRole = (role: UserRole) => {
    const newUser = mockUsers[role]
    const sessionData = {
      user: {
        ...newUser,
        loginTime: new Date().toISOString(),
        sessionId: `session_${Date.now()}`,
      },
      loginTime: new Date().toISOString(),
    }
    setUser(sessionData.user)
    localStorage.setItem("userSession", JSON.stringify(sessionData))
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout, login, switchRole, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}
