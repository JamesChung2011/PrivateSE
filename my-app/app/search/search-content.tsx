"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FlightCard, type Flight } from "@/components/flight-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [flights, setFlights] = useState<Flight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const params = useMemo(() => {
    return {
      from: (searchParams.get("from") || "").toUpperCase(),
      to: (searchParams.get("to") || "").toUpperCase(),
      depart: searchParams.get("depart") || "",
      pax: Number(searchParams.get("pax") || "1"),
    }
  }, [searchParams])

  useEffect(() => {
    const { from, to, depart } = params
    if (!from || !to || !depart) return

    const run = async () => {
      setIsLoading(true)
      setError("")
      try {
        const query = new URLSearchParams({
          from,
          to,
          date: depart,
        })
        const res = await fetch(`/api/flights/search?${query.toString()}`)
        if (!res.ok) {
          throw new Error("Search failed")
        }
        const data = await res.json()
        setFlights(data)
      } catch (err: any) {
        setError(err.message || "Unable to search flights right now.")
        setFlights([])
      } finally {
        setIsLoading(false)
      }
    }

    void run()
  }, [params])

  const hasParams = params.from && params.to && params.depart

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Flight Search</h1>
          <p className="text-neutral-500 mt-1">
            {hasParams
              ? `Searching ${params.from} -> ${params.to} on ${params.depart}`
              : "Enter search details from the home page to see results."}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>

      {!hasParams && (
        <Card className="p-6 border border-dashed text-neutral-600">
          Please start a search from the home page to see available flights.
        </Card>
      )}

      {hasParams && (
        <div className="space-y-4">
          {isLoading && (
            <Card className="p-6 flex items-center gap-3 border border-border">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-neutral-600">Finding flights...</span>
            </Card>
          )}

          {error && (
            <Card className="p-4 border border-red-200 bg-red-50 text-red-700">
              {error}
            </Card>
          )}

          {!isLoading && !error && flights.length === 0 && (
            <Card className="p-6 border border-dashed text-neutral-600">
              No flights found for the selected route and date.
            </Card>
          )}

          <div className="space-y-4">
            {flights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onSelect={(f) =>
                  router.push(
                    `/dashboard/customer/book?instanceId=${encodeURIComponent(f.id)}&from=${params.from}&to=${params.to}`
                  )
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
