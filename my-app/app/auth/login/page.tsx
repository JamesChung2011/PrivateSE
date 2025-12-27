"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginCredentials {
  email: string
  password: string
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

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Invalid credentials")
      }

      login({
        id: data.user_id,
        email: data.email,
        name: data.full_name,
        role: data.role,
        avatar: data.avatar_url,
      })
      router.push(`/dashboard/${data.role}`)
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-400 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✈</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">Aircadium</h1>
        </div>

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
              className="w-full bg-green-800 hover:bg-green-900 text-white font-medium"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Card>

        <p className="text-center text-gray-600 mt-6">
          New customer?{" "}
          <Link href="/auth/signup" className="text-green-600 hover:text-green-900 font-medium">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}
