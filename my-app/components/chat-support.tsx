"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface ChatMessage {
  id: string
  type: "user" | "support"
  message: string
  timestamp: Date
  avatar?: string
}

interface ChatSupportProps {
  initialMessages?: ChatMessage[]
  onSendMessage?: (message: string) => void
  supportAgent?: string
}

const supportResponses = [
  "Thank you for reaching out. How can I help you today?",
  "I understand your concern. Let me assist you with that.",
  "Thank you for your message. Our team will review this shortly.",
  "I'm here to help. Can you provide more details?",
  "Your booking is important to us. Let me check that for you.",
  "We appreciate your feedback. Is there anything else I can help with?",
]

export function ChatSupport({
  initialMessages = [],
  onSendMessage,
  supportAgent = "FlightHub Support",
}: ChatSupportProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    onSendMessage?.(inputValue)

    // Simulate support agent response
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const supportMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "support",
      message: supportResponses[Math.floor(Math.random() * supportResponses.length)],
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, supportMessage])
    setIsLoading(false)
  }

  return (
    <Card className="flex flex-col h-full border border-border">
      {/* Header */}
      <div className="border-b border-border p-4 bg-neutral-50">
        <h3 className="font-semibold text-neutral-900">{supportAgent}</h3>
        <p className="text-xs text-neutral-500">We typically respond within minutes</p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-center">
              <div>
                <p className="text-neutral-600 font-medium">Start a conversation</p>
                <p className="text-sm text-neutral-500 mt-1">Ask us anything about your booking or travel</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.type === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-neutral-100 text-neutral-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${msg.type === "user" ? "text-white/70" : "text-neutral-600"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-neutral-100 text-neutral-900 px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Support is typing...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4 bg-neutral-50">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="border-border"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim() || isLoading}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
