"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChatSupport, type ChatMessage } from "@/components/chat-support"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, Clock } from "lucide-react"

export default function SupportPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "support",
      message: "Welcome to FlightHub Support! How can we assist you today?",
      timestamp: new Date(),
    },
  ])

  const handleSendMessage = (message: string) => {
    console.log("Message sent:", message)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Customer Support</h1>
        <p className="text-neutral-500 mt-1">Get help with your bookings and travel plans</p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
        </TabsList>

        {/* Live Chat */}
        <TabsContent value="chat" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 h-[500px]">
              <ChatSupport
                initialMessages={messages}
                onSendMessage={handleSendMessage}
                supportAgent="FlightHub Support Team"
              />
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <Card className="p-4 border border-border">
                <h3 className="font-semibold text-neutral-900 mb-3">Quick Help</h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm px-3 py-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-700">
                    Track my booking
                  </button>
                  <button className="w-full text-left text-sm px-3 py-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-700">
                    Modify flight
                  </button>
                  <button className="w-full text-left text-sm px-3 py-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-700">
                    Cancel booking
                  </button>
                  <button className="w-full text-left text-sm px-3 py-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-700">
                    Refund status
                  </button>
                </div>
              </Card>

              <Card className="p-4 border border-border bg-primary/5 border-primary/20">
                <p className="text-sm font-medium text-neutral-900 mb-2">⏱️ Response Time</p>
                <p className="text-xs text-neutral-600">Average response time: 2-5 minutes</p>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq" className="mt-6">
          <div className="space-y-4">
            {[
              {
                question: "How do I modify my flight booking?",
                answer:
                  "You can modify your booking through the My Bookings section. Click on a confirmed booking and select 'Modify Flight' to change dates or passenger information.",
              },
              {
                question: "What is your cancellation policy?",
                answer:
                  "Cancellations can be made up to 48 hours before departure for a full refund. Cancellations within 48 hours may incur a service fee.",
              },
              {
                question: "Can I get a refund to my original payment method?",
                answer: "Yes, all refunds are processed to the original payment method within 5-7 business days.",
              },
              {
                question: "How do I check in for my flight?",
                answer:
                  "Online check-in opens 24 hours before departure. You can check in through our website or mobile app using your booking reference.",
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-4 border border-border">
                <h3 className="font-medium text-neutral-900 mb-2">{item.question}</h3>
                <p className="text-sm text-neutral-600">{item.answer}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contact Info */}
        <TabsContent value="contact" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 border border-border text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Phone Support</h3>
              <p className="text-sm text-neutral-600 mb-3">+1 (800) FLY-FLUB</p>
              <p className="text-xs text-neutral-500">Available 24/7</p>
            </Card>

            <Card className="p-6 border border-border text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Email Support</h3>
              <p className="text-sm text-neutral-600 mb-3">support@flighthub.com</p>
              <p className="text-xs text-neutral-500">Response within 2 hours</p>
            </Card>

            <Card className="p-6 border border-border text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Business Hours</h3>
              <p className="text-sm text-neutral-600 mb-1">Mon - Fri: 8AM - 8PM</p>
              <p className="text-xs text-neutral-500">Weekends: 9AM - 5PM EST</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
