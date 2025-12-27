import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import { UserProvider } from "@/lib/user-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const mono = Roboto_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flight Management Dashboard",
  description: "Modern flight management system with role-based interfaces",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${mono.className} bg-background text-foreground`}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}
