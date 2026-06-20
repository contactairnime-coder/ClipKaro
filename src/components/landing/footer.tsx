"use client"

import Link from "next/link"


export function Footer() {
  return (
    <footer className="wrap">
      <div className="foot-grid">
        <div className="foot-brand">
          <div className="logo">
            <span className="mark">C</span>
            ClipKaro
          </div>
          <p>
            India ka pehla clipping platform. Indian creators ke clips banao, views kamao, ₹ kamao.
            Payouts via UPI aur bank transfer.
          </p>
        </div>
        <div className="foot-col">
          <h5>Platform</h5>
          <a href="#how">How it Works</a>
          <a href="#creators">For Creators</a>
          <a href="#earnings">For Clippers</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="foot-col">
          <h5>Support</h5>
          <a href="#">Help Center</a>
          <a href="#">Community</a>
          <a href="#">Guidelines</a>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
        <div className="foot-col">
          <h5>Legal</h5>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 ClipKaro. All rights reserved.</span>
        <span>Made in India for the Creator Economy</span>
      </div>
    </footer>
  )
}
