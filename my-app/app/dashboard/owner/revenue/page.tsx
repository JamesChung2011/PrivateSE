"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { StatCard } from "@/components/stat-card"
import ExpenseForm from "@/components/expense-form"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { DollarSign, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

type ExpenseInput = {
  category: string
  amount: number
  description?: string
}

type Expense = ExpenseInput & {
  expense_id: number
  recorded_at: string
}



const monthlyData = [
  { month: "Jan", revenue: 45000, costs: 32000 },
  { month: "Feb", revenue: 52000, costs: 35000 },
  { month: "Mar", revenue: 48000, costs: 33000 },
  { month: "Apr", revenue: 61000, costs: 38000 },
  { month: "May", revenue: 55000, costs: 36000 },
  { month: "Jun", revenue: 67000, costs: 40000 },
]

const weeklyData = [
  { week: "Week 1", revenue: 12000, costs: 8000 },
  { week: "Week 2", revenue: 14500, costs: 9200 },
  { week: "Week 3", revenue: 11800, costs: 7900 },
  { week: "Week 4", revenue: 16200, costs: 10500 },
  { week: "Week 5", revenue: 15000, costs: 9800 },
]

const yearlyData = [
  { year: "2020", revenue: 480000, costs: 340000 },
  { year: "2021", revenue: 520000, costs: 360000 },
  { year: "2022", revenue: 580000, costs: 390000 },
  { year: "2023", revenue: 650000, costs: 420000 },
  { year: "2024", revenue: 720000, costs: 460000 },
]

type TimeFrame = "weekly" | "monthly" | "yearly"

export default function RevenuePage() {
  // State quản lý timeFrame và expenses
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("monthly")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [showForm, setShowForm] = useState(false) // state để show/hide form

  // Hàm thêm expense từ ExpenseForm
  const handleAddExpense = async (expense: ExpenseInput) => {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      })

      const data = await res.json() // ✅ chỉ đọc 1 lần

      console.log("API status:", res.status)
      console.log("API response:", data)

      if (!res.ok) {
        throw new Error(data.error || "Failed to add expense")
      }

      setExpenses((prev) => [...prev, data])
    } catch (error) {
      console.error(error)
      alert("Failed to add expense")
    }
  }



  const toggleForm = () => setShowForm(!showForm)


  const getChartData = () => {
    switch (timeFrame) {
      case "weekly":
        return weeklyData
      case "yearly":
        return yearlyData
      default:
        return monthlyData
    }
  }

  const getXAxisKey = () => {
    switch (timeFrame) {
      case "weekly":
        return "week"
      case "yearly":
        return "year"
      default:
        return "month"
    }
  }

  const chartData = getChartData()
  const xAxisKey = getXAxisKey()

  const chartDataWithExpenses = chartData.map((data) => {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
    return {
      ...data,
      costs: (data.costs || 0) + totalExpenses,
    }
  })

  // Tổng revenue/profit để hiển thị StatCard
  const totalRevenue = chartDataWithExpenses.reduce((sum, d) => sum + d.revenue, 0)
  const totalCosts = chartDataWithExpenses.reduce((sum, d) => sum + (d.costs || 0), 0)
  const totalProfit = totalRevenue - totalCosts
  const avgRevenuePerFlight = Math.round(totalRevenue / chartDataWithExpenses.length)
  const profitMargin = Math.round((totalProfit / totalRevenue) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Revenue Analytics
          </h1>
          <p className="text-neutral-500 mt-1">
            Financial performance and insights
          </p>
        </div>

        <Button size="sm" onClick={() => setShowForm(true)}>
          Add expense
      </Button>
    </div>


      {/* Form nhập expense */}
      {showForm && (
      <ExpenseForm
        onAdd={(expense) => {
          handleAddExpense(expense)
          setShowForm(false) // ẩn form sau submit
        }}
        onClose={() => setShowForm(false)}
      />
    )}


      {/* Time Frame Toggle */}
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => setTimeFrame("weekly")}
          variant={timeFrame === "weekly" ? "default" : "outline"}
          className={timeFrame === "weekly" ? "bg-primary text-white" : "border-border"}
        >
          Weekly
        </Button>
        <Button
          onClick={() => setTimeFrame("monthly")}
          variant={timeFrame === "monthly" ? "default" : "outline"}
          className={timeFrame === "monthly" ? "bg-primary text-white" : "border-border"}
        >
          Monthly
        </Button>
        <Button
          onClick={() => setTimeFrame("yearly")}
          variant={timeFrame === "yearly" ? "default" : "outline"}
          className={timeFrame === "yearly" ? "bg-primary text-white" : "border-border"}
        >
          Yearly
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Revenue" value="$328,000" icon={DollarSign} trend={{ value: 15, isPositive: true }} />
        <StatCard title="Avg Revenue/Flight" value="$8,125" icon={TrendingUp} trend={{ value: 7, isPositive: true }} />
        <StatCard title="Profit Margin" value="42%" icon={DollarSign} trend={{ value: 2, isPositive: false }} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Costs */}
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Revenue vs Costs</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={xAxisKey} stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#0055cc" radius={[8, 8, 0, 0]} />
              <Bar dataKey="costs" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Profit Trend */}
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Profit Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={xAxisKey} stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey={(data) => data.revenue - data.costs}
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 4 }}
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
