import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Clipr - Viral Clips Banao, Paisa Kamao",
  description: "India ka pehla clipping platform. Indian creators ke clips banao aur views ke hisaab se ₹ kamao. Free join karo, koi monthly fee nahi.",
  openGraph: {
    title: "Clipr - Viral Clips Banao, Paisa Kamao",
    description: "India ka pehla clipping platform. Creators ke clips banao aur views ke hisaab se ₹ kamao.",
    type: "website",
    locale: "hi_IN",
    siteName: "Clipr",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clipr - Viral Clips Banao, Paisa Kamao",
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
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
