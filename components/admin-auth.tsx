"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AdminAuthProps {
  children?: React.ReactNode
}

export function AdminAuth({ children }: AdminAuthProps) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if already authenticated
    const authStatus = localStorage.getItem('admin_authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check - in production, use proper authentication
    if (password === 'xPev;1Y5iz]G%0eD1sTS;zX92RYr>{') {
      localStorage.setItem('admin_authenticated', 'true')
      setIsAuthenticated(true)
    } else {
      alert('Invalid password')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    setIsAuthenticated(false)
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm font-mono tracking-widest uppercase">LOADING...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white text-black font-mono flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <img src="/acme-logo.png" alt="LEGACY" className="h-12 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-medium tracking-widest uppercase">ADMIN LOGIN</h1>
            <p className="text-sm text-gray-500 font-mono mt-2">Enter admin password to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="border-gray-300 focus:border-black text-center"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 border-0 text-sm font-medium tracking-widest uppercase py-3"
            >
              LOGIN
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <a 
              href="/" 
              className="text-xs text-gray-500 font-mono tracking-widest uppercase hover:text-black transition-colors"
            >
              ← BACK TO WEBSITE
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="border-gray-300 text-gray-600 hover:bg-gray-100 text-xs font-medium tracking-widest uppercase"
        >
          LOGOUT
        </Button>
      </div>
      {children}
    </>
  )
}
