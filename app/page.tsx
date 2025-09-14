"use client"

import { useEffect } from "react"

export default function HomeRedirect() {
  useEffect(() => {
    // Redirect to home page
    window.location.href = '/home'
  }, [])

  return (
    <div className="min-h-screen bg-white text-black font-mono flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-sm font-mono tracking-widest uppercase">REDIRECTING...</p>
      </div>
    </div>
  )
}