"use client"

import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Home() {
  const { user, switchRole, isLoading } = useUser()
  const router = useRouter()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push(`/dashboard/${user.role}`)
      } else {
        router.push("/auth/login")
      }
      setIsInitialized(true)
    }
  }, [user, isLoading, router])

  const handleRoleSwitch = (role: "owner" | "staff" | "admin" | "customer") => {
    switchRole(role)
    router.push(`/dashboard/${role}`)
  }

  if (isLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-light to-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">✈</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">FlightHub</h1>
          <p className="text-neutral-500 mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-border p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-white">✈</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">FlightHub</h1>
          <p className="text-neutral-500 mt-2">Flight Management Dashboard</p>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm font-medium text-neutral-600 text-center mb-4">Select a role to continue:</p>
          <Button
            onClick={() => handleRoleSwitch("owner")}
            className="w-full bg-primary hover:bg-primary-dark text-white"
          >
            Owner Dashboard
          </Button>
          <Button onClick={() => handleRoleSwitch("staff")} variant="outline" className="w-full border-border">
            Staff Dashboard
          </Button>
          <Button onClick={() => handleRoleSwitch("admin")} variant="outline" className="w-full border-border">
            Admin Dashboard
          </Button>
          <Button onClick={() => handleRoleSwitch("customer")} variant="outline" className="w-full border-border">
            Customer Dashboard
          </Button>
        </div>

        {user && (
          <p className="text-xs text-neutral-500 text-center">
            Currently logged in as: <span className="font-medium">{user.name}</span>
          </p>
        )}
      </Card>
    </div>
  )
}
