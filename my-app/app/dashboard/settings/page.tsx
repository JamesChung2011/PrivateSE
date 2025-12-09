"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/lib/user-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Save, User, Phone, Mail, Camera } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsPage() {
  const { user, login } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    avatar_url: "",
  })

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return
      setIsLoading(true)
      try {
        const res = await fetch(`/api/user/profile?userId=${user.id}`)
        if (res.ok) {
          const data = await res.json()
          setFormData({
            full_name: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            avatar_url: data.avatar_url || "",
          })
        }
      } catch (error) {
        console.error("Failed to load profile", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user?.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setIsSaving(true)
    setMessage(null)

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          avatar_url: formData.avatar_url,
        }),
      })

      if (!res.ok) throw new Error("Failed to update profile")

      const updatedUser = await res.json()

      // Update global context
      login({
        ...user,
        name: updatedUser.full_name,
        avatar: updatedUser.avatar_url,
      })

      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save changes. Please try again." })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Account Settings</h1>
        <p className="text-neutral-500 mt-1">Manage your personal information and preferences</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 border border-border space-y-8">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center sm:flex-row gap-6">
            <div className="relative group cursor-pointer">
              <Avatar className="w-24 h-24 border-4 border-white shadow-sm">
                <AvatarImage src={formData.avatar_url} />
                <AvatarFallback className="text-2xl">{formData.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <h3 className="font-medium text-neutral-900">Profile Picture</h3>
              <p className="text-sm text-neutral-500">
                Click on the avatar to change it or paste a URL below.
              </p>
              <Input 
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="mt-2 text-sm"
              />
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="pl-10 bg-neutral-50 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-neutral-500">Email cannot be changed securely here.</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* Feedback Message */}
          {message && (
            <Alert variant={message.type === "success" ? "default" : "destructive"} className={message.type === "success" ? "bg-green-50 text-green-800 border-green-200" : ""}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-dark text-white gap-2">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}