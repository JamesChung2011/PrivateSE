"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/lib/user-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, User, Mail, Phone, MapPin, Camera } from "lucide-react"

interface UserProfile {
  fullName: string
  email: string
  phone: string
  address: string
  avatarUrl: string
}

export default function CustomerProfilePage() {
  const { user } = useUser()
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    avatarUrl: ""
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Mock fetch profile
    const loadProfile = async () => {
       setLoading(true)
       // Simulate API delay
       await new Promise(r => setTimeout(r, 800))
       if (user) {
          setProfile({
             fullName: user.name || "Customer Name",
             email: user.email || "customer@example.com",
             phone: "+1 (555) 123-4567",
             address: "123 Sky Way, Cloud City",
             avatarUrl: ""
          })
       }
       setLoading(false)
    }
    loadProfile()
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")
    
    try {
       // Simulate API save
       await new Promise(r => setTimeout(r, 1000))
       // await fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify(profile) })
       setMessage("Profile updated successfully!")
    } catch (err) {
       setMessage("Failed to update profile.")
    } finally {
       setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
         <h1 className="text-3xl font-bold text-neutral-900">My Profile</h1>
         <p className="text-neutral-500 mt-1">Manage your personal information and preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
         {/* Avatar Section */}
         <Card className="p-6 border border-border flex items-center gap-6">
            <div className="relative">
               <Avatar className="w-24 h-24 border-2 border-white shadow-lg">
                  <AvatarImage src={profile.avatarUrl} />
                  <AvatarFallback className="text-2xl bg-primary text-white">
                     {profile.fullName.charAt(0)}
                  </AvatarFallback>
               </Avatar>
               <button type="button" className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow border border-neutral-200 hover:bg-neutral-50 transition">
                  <Camera className="w-4 h-4 text-neutral-600" />
               </button>
            </div>
            <div>
               <h2 className="text-lg font-semibold">{profile.fullName}</h2>
               <p className="text-sm text-neutral-500">Customer Account</p>
            </div>
         </Card>

         {/* Details Section */}
         <Card className="p-6 border border-border space-y-4">
            <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                     <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                     <Input 
                        id="fullName" 
                        value={profile.fullName} 
                        onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                        className="pl-9"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                     <Input 
                        id="email" 
                        value={profile.email} 
                        className="pl-9 bg-neutral-50"
                        readOnly
                        disabled
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                     <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                     <Input 
                        id="phone" 
                        value={profile.phone} 
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="pl-9"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                     <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                     <Input 
                        id="address" 
                        value={profile.address} 
                        onChange={(e) => setProfile({...profile, address: e.target.value})}
                        className="pl-9"
                     />
                  </div>
               </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
               <span className={`text-sm font-medium ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                  {message}
               </span>
               <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary-dark text-white min-w-[120px]">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
               </Button>
            </div>
         </Card>
      </form>
    </div>
  )
}