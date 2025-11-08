"use client"

import { Card } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"

const operationsData = [
  {
    flight: "FL001",
    aircraft: "Boeing 737",
    departure: "08:00",
    arrival: "11:30",
    gate: "A12",
    status: "Boarding",
    passengers: 182,
  },
  {
    flight: "FL002",
    aircraft: "Airbus A320",
    departure: "10:15",
    arrival: "13:45",
    gate: "B08",
    status: "Preparing",
    passengers: 165,
  },
  {
    flight: "FL003",
    aircraft: "Boeing 737",
    departure: "14:30",
    arrival: "18:00",
    gate: "A05",
    status: "Delayed",
    passengers: 178,
  },
  {
    flight: "FL004",
    aircraft: "Embraer E190",
    departure: "16:45",
    arrival: "20:15",
    gate: "C10",
    status: "Scheduled",
    passengers: 145,
  },
  {
    flight: "FL005",
    aircraft: "Boeing 737",
    departure: "19:30",
    arrival: "23:00",
    gate: "B15",
    status: "Scheduled",
    passengers: 190,
  },
]

const columns = [
  { key: "flight", label: "Flight ID" },
  { key: "aircraft", label: "Aircraft" },
  { key: "departure", label: "Departure" },
  { key: "arrival", label: "Arrival" },
  { key: "gate", label: "Gate" },
  { key: "passengers", label: "Passengers" },
  { key: "status", label: "Status" },
]

export default function OperationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Operations</h1>
        <p className="text-neutral-500 mt-1">Real-time flight operations and gate management</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info/10 rounded-lg">
              <Clock className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Active Flights</p>
              <p className="text-2xl font-bold text-neutral-900">12</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">On Time</p>
              <p className="text-2xl font-bold text-neutral-900">10</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-danger/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Delayed</p>
              <p className="text-2xl font-bold text-neutral-900">2</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Operations Table */}
      <Card className="p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Today's Flight Operations</h2>
          <Button variant="outline" className="border-border bg-transparent">
            Refresh
          </Button>
        </div>
        <DataTable columns={columns} data={operationsData} />
      </Card>

      {/* Alerts */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Active Alerts</h2>
        <div className="space-y-3">
          <div className="flex gap-3 p-4 bg-danger/5 border border-danger/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-neutral-900">Flight FL003 Delayed</p>
              <p className="text-sm text-neutral-500">Mechanical issue - expected 30-minute delay</p>
            </div>
          </div>
          <div className="flex gap-3 p-4 bg-warning/5 border border-warning/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-neutral-900">Gate Maintenance</p>
              <p className="text-sm text-neutral-500">Gate B10 will be down for 15 minutes at 15:00</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
