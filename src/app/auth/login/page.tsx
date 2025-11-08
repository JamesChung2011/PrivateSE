"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface LoginCredentials {
  email: string
  password: string
}

// Mock database of users with role-based authentication
const mockUsers: Record<string, { password: string; role: "owner" | "staff" | "admin" | "customer"; name: string }> = {
  "john@flightmgmt.com": { password: "owner123", role: "owner", name: "John Doe" },
  "jane@flightmgmt.com": { password: "staff123", role: "staff", name: "Jane Smith" },
  "admin@flightmgmt.com": { password: "admin123", role: "admin", name: "Admin User" },
  "mike@customer.com": { password: "customer123", role: "customer", name: "Mike Johnson" },
  "sarah@customer.com": { password: "customer123", role: "customer", name: "Sarah Williams" },
}

export default function LoginPage() {
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useUser()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = mockUsers[credentials.email]
    if (user && user.password === credentials.password) {
      login({
        id: Math.random().toString(),
        email: credentials.email,
        name: user.name,
        role: user.role,
        avatar: "👤",
      })
      router.push(`/dashboard/${user.role}`)
    } else {
      setError("Invalid email or password. Try: john@flightmgmt.com / owner123")
    }

    setIsLoading(false)
  }

  const handleDemoLogin = (email: string) => {
    setCredentials({ email, password: mockUsers[email].password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✈</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">FlightHub</h1>
          <p className="text-gray-500 mt-2">Flight Management System</p>
        </div>

        {/* Login Form */}
        <Card className="border border-gray-200 p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="john@flightmgmt.com"
                required
                className="mt-2 border-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="mt-2 border-gray-300"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 font-medium mb-3">DEMO ACCOUNTS:</p>
            <div className="space-y-2">
              <button
                onClick={() => handleDemoLogin("john@flightmgmt.com")}
                className="w-full text-left px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 text-blue-700 transition"
              >
                Owner: john@flightmgmt.com
              </button>
              <button
                onClick={() => handleDemoLogin("jane@flightmgmt.com")}
                className="w-full text-left px-3 py-2 text-sm bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 text-purple-700 transition"
              >
                Staff: jane@flightmgmt.com
              </button>
              <button
                onClick={() => handleDemoLogin("admin@flightmgmt.com")}
                className="w-full text-left px-3 py-2 text-sm bg-gray-900 hover:bg-gray-800 rounded border border-gray-700 text-white transition"
              >
                Admin: admin@flightmgmt.com
              </button>
              <button
                onClick={() => handleDemoLogin("mike@customer.com")}
                className="w-full text-left px-3 py-2 text-sm bg-green-50 hover:bg-green-100 rounded border border-green-200 text-green-700 transition"
              >
                Customer: mike@customer.com
              </button>
            </div>
          </div>
        </Card>

        {/* Signup Link */}
        <p className="text-center text-gray-600 mt-6">
          New customer?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}
