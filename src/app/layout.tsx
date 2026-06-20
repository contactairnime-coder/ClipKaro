import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
})
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "ClipKaro — Viral Karo. Paisa Kamao.",
  description: "India ka pehla clipping platform. Indian creators ke clips banao, views kamao, ₹ kamao. Free join karo, koi monthly fee nahi.",
  openGraph: {
    title: "ClipKaro — Viral Karo. Paisa Kamao.",
    description: "India ka pehla clipping platform. Creators ke clips banao aur views ke hisaab se ₹ kamao.",
    type: "website",
    locale: "hi_IN",
    siteName: "ClipKaro",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClipKaro — Viral Karo. Paisa Kamao.",
    description: "India ka pehla clipping platform. Free join karo aur views pe ₹ kamao.",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="hi">
      <body className={`${inter.className} ${jakarta.variable} ${jetbrains.variable} antialiased`}>
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
