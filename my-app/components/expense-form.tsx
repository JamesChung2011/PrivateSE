"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ExpenseFormProps {
  onAdd: (expense: {
    category: string
    amount: number
    description?: string
  }) => void
  onClose: () => void
}

export default function ExpenseForm({ onAdd, onClose }: ExpenseFormProps) {
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!category || !amount) return

    onAdd({
      category,
      amount: parseFloat(amount),
      description: description || undefined,
    })

    // reset form
    setCategory("")
    setAmount("")
    setDescription("")
    onClose()
  }

  return (
    <Card className="p-4 mb-4">
      <h3 className="font-semibold mb-2">Add Expense</h3>

      <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
        {/* Category */}
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-2 py-1 rounded flex-1 min-w-[120px]"
          maxLength={50}
          required
        />

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 rounded flex-1 min-w-[120px]"
          step="0.01"
          min="0"
          required
        />

        {/* Description (optional) */}
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-2 py-1 rounded flex-1 min-w-[160px]"
        />

        <Button type="submit">Add</Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </form>
    </Card>
  )
}




