"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, LogIn } from "lucide-react"
import { navLinks } from "@/lib/landing-data"
import { Ticker } from "./ticker"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[var(--ink)]/80 backdrop-blur-xl border-b border-[rgba(244,243,237,0.09)]" : "bg-transparent"
      }`}
    >
      <div className="nav">
        <Link href="/" className="logo">
          <span className="mark">C</span>
          ClipKaro
        </Link>
        <nav className="hidden md:flex links">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-right">
          <Link href="/login" className="hidden md:inline-flex btn-text">
            <LogIn className="w-4 h-4" />
            Login
          </Link>
          <Link href="/signup" className="btn btn-primary">
            Start Earning
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            className="p-2 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-6 bg-[var(--paper-dim)] transition-transform ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-[var(--paper-dim)] transition-opacity ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-[var(--paper-dim)] transition-transform ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>
      <Ticker />

      {menuOpen && (
        <div className="md:hidden bg-[var(--ink)]/95 backdrop-blur-xl border-b border-[rgba(244,243,237,0.09)]">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-[var(--paper-dim)] py-3 hover:text-[var(--paper)] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/login"
              className="text-sm text-[var(--paper-dim)] py-3 hover:text-[var(--paper)] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
