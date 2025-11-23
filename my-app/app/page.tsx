// "use client"

// import { useUser } from "@/lib/user-context"
// import { useRouter } from "next/navigation"
// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"

// export default function Home() {
//   const { user, switchRole, isLoading } = useUser()
//   const router = useRouter()
//   const [isInitialized, setIsInitialized] = useState(false)

//   useEffect(() => {
//     if (!isLoading) {
//       if (user) {
//         router.push(`/dashboard/${user.role}`)
//       } else {
//         router.push("/auth/login")
//       }
//       setIsInitialized(true)
//     }
//   }, [user, isLoading, router])

//   const handleRoleSwitch = (role: "owner" | "staff" | "admin" | "customer") => {
//     switchRole(role)
//     router.push(`/dashboard/${role}`)
//   }

//   if (isLoading || !isInitialized) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-light to-neutral-50">
//         <div className="text-center">
//           <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
//             <span className="text-3xl text-white">✈</span>
//           </div>
//           <h1 className="text-3xl font-bold text-neutral-900">FlightHub</h1>
//           <p className="text-neutral-500 mt-2">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-light to-neutral-50 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md border border-border p-8 shadow-lg">
//         <div className="text-center mb-8">
//           <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
//             <span className="text-4xl text-white">✈</span>
//           </div>
//           <h1 className="text-3xl font-bold text-neutral-900">Aircadium</h1>
//           <p className="text-neutral-500 mt-2">Flight Management Dashboard</p>
//         </div>

//         <div className="space-y-3 mb-6">
//           <p className="text-sm font-medium text-neutral-600 text-center mb-4">Select a role to continue:</p>
//           <Button
//             onClick={() => handleRoleSwitch("owner")}
//             className="w-full bg-primary hover:bg-primary-dark text-white"
//           >
//             Owner Dashboard
//           </Button>
//           <Button onClick={() => handleRoleSwitch("staff")} variant="outline" className="w-full border-border">
//             Staff Dashboard
//           </Button>
//           <Button onClick={() => handleRoleSwitch("admin")} variant="outline" className="w-full border-border">
//             Admin Dashboard
//           </Button>
//           <Button onClick={() => handleRoleSwitch("customer")} variant="outline" className="w-full border-border">
//             Customer Dashboard
//           </Button>
//         </div>

//         {user && (
//           <p className="text-xs text-neutral-500 text-center">
//             Currently logged in as: <span className="font-medium">{user.name}</span>
//           </p>
//         )}
//       </Card>
//     </div>
//   )
// }
"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()
  const [tripType, setTripType] = useState<"return" | "oneway">("return")
  const [passengers, setPassengers] = useState(1)
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [departDate, setDepartDate] = useState("")
  const [returnDate, setReturnDate] = useState("")

  const handleSearch = () => {
    router.push(
      `/search?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(
        destination
      )}&depart=${departDate}&return=${returnDate}&pax=${passengers}`
    )
  }

  return (
    <div className="min-h-screen w-full bg-white text-neutral-900">
      {/* NAVBAR */}
      <header className="w-full z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">✈ Aircadium</div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-700">
            <a className="hover:text-primary cursor-pointer">Flights</a>
            <a className="hover:text-primary cursor-pointer">Pricing</a>
            <a className="hover:text-primary cursor-pointer">About</a>
            <Button
              onClick={() => router.push("/auth/login")}
              className="ml-4 bg-primary text-white px-4 py-2 text-sm"
            >
              Login
            </Button>
          </nav>

          {/* mobile login button */}
          <div className="md:hidden text-sm">
            <Button
              onClick={() => router.push("/auth/login")}
              className="bg-primary text-white px-4 py-2 text-sm"
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="relative">
        <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
          <img
            src="/vinhhalong.jpeg"
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-white/60 pointer-events-none" />

          <div className="absolute inset-0 flex items-start md:items-center justify-center px-6 md:px-12 pt-20 md:pt-0">
            <div className="max-w-5xl w-full">
              <div className="bg-white/95 backdrop-blur-sm px-5 md:px-8 py-6 md:py-8 rounded-r-sm shadow-md">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-900 leading-tight">
                  Book Flights from Vietnam with{" "}
                  <span className="text-primary">Aircadium</span>
                </h1>
                <p className="mt-2 text-neutral-600 text-sm md:text-base">
                  Fast booking — Best fares — Seamless management
                </p>
              </div>
            </div>
          </div>

          {/* floating booking card */}
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-20px] w-full max-w-5xl px-4 md:px-6 z-20">
            <div className="bg-white rounded-md shadow-lg border border-gray-100">
              <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* row 1: trip type, passengers, promo */}
                <div className="col-span-12 md:col-span-4 flex flex-wrap items-center gap-2 md:gap-3">
                  <select
                    className="border rounded px-2 py-2 text-sm flex-1"
                    value={tripType}
                    onChange={(e) =>
                      setTripType(e.target.value === "return" ? "return" : "oneway")
                    }
                  >
                    <option value="return">Return</option>
                    <option value="oneway">One-way</option>
                  </select>

                  <select
                    className="border rounded px-2 py-2 text-sm"
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} Passenger{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="DISCOUNT CODE (OPTIONAL)"
                    className="border rounded px-2 py-2 text-sm flex-1"
                  />
                </div>

                {/* row 2: origin, destination, depart, return, search */}
                <div className="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-3">
                  <div className="md:col-span-1 flex flex-col">
                    <label className="text-xs text-neutral-500">ORIGIN</label>
                    <input
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="Select departure"
                      className="border rounded px-2 py-2 text-sm"
                    />
                  </div>

                  <div className="md:col-span-1 flex flex-col">
                    <label className="text-xs text-neutral-500">DESTINATION</label>
                    <input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Select arrival"
                      className="border rounded px-2 py-2 text-sm"
                    />
                  </div>

                  <div className="md:col-span-1 flex flex-col">
                    <label className="text-xs text-neutral-500">DEPART ON</label>
                    <input
                      type="date"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      className="border rounded px-2 py-2 text-sm"
                    />
                  </div>

                  {tripType === "return" && (
                    <div className="md:col-span-1 flex flex-col">
                      <label className="text-xs text-neutral-500">RETURN ON</label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="border rounded px-2 py-2 text-sm"
                      />
                    </div>
                  )}

                  <div className="md:col-span-2 flex items-end justify-end">
                    <button
                      onClick={handleSearch}
                      className="bg-[#113e2b] hover:bg-[#0f3524] text-white px-5 md:px-6 py-2 md:py-3 rounded text-sm md:text-base"
                    >
                      Search flights
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* spacer so content below not hidden behind floating card */}
      <div className="h-32 md:h-40" />

      {/* example content area */}
      {/* <section className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-xl font-bold mb-2">Popular routes</h2>
        <p className="text-neutral-600 mb-4 text-sm md:text-base">
          Example content — you can replace this section with features, pricing, testimonials, etc.
        </p>
      </section> */}

      {/* FOOTER */}
      <footer className="w-full bg-neutral-50 border-t">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-neutral-700">
          <div>© {new Date().getFullYear()} Aircadium. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1">
              <Phone size={16} />
              <span>+123456789</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <Mail size={16} />
              <span>aircadium@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <a className="hover:text-primary cursor-pointer">Privacy</a>
              <a className="hover:text-primary cursor-pointer">Terms</a>
              <a className="hover:text-primary cursor-pointer">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}



