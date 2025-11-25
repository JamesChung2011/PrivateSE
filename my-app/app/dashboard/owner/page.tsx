"use client"

import { StatCard } from "@/components/stat-card"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Plane, Users, DollarSign, TrendingUp } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 67000 },
]

const fleetData = [
  { name: "Boeing 737", value: 8 },
  { name: "Airbus A320", value: 6 },
  { name: "Embraer E190", value: 4 },
]

const colors = ["#0055cc", "#3b82f6", "#60a5fa"]

export default function OwnerDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Owner Dashboard</h1>
        <p className="text-neutral-500 mt-1">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Flights"
          value="2,847"
          icon={Plane}
          trend={{ value: 12, isPositive: true }}
          description="This month"
        />
        <StatCard
          title="Revenue"
          value="$67,000"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
          description="This month"
        />
        <StatCard
          title="Passengers"
          value="125,340"
          icon={Users}
          trend={{ value: 5, isPositive: true }}
          description="YTD"
        />
        <StatCard
          title="Occupancy"
          value="87%"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: false }}
          description="Average"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 p-6 border border-border">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0055cc"
                strokeWidth={2}
                dot={{ fill: "#0055cc", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Fleet Distribution */}
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Fleet Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fleetData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {fleetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Booking Metrics */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Monthly Bookings</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="revenue" fill="#0055cc" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
