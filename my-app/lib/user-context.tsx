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
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  login: (user: User) => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/user/profile", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          setUser({
            id: data.user_id,
            email: data.email,
            name: data.full_name,
            role: data.role?.name ?? "customer",
            avatar: data.avatar_url ?? undefined,
          })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Profile load failed:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    void load()
  }, [])

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {
      // ignore
    }
    setUser(null)
    router.push("/auth/login")
  }

  const login = (newUser: User) => {
    setUser(newUser)
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout, login, isLoading }}>
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
