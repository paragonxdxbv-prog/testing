"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { analytics } from '@/lib/firebase'
import { logEvent } from '@/lib/firebase-utils'

export function FirebaseAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (analytics) {
      // Track page view
      logEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: pathname
      })
    }
  }, [pathname])

  return null
}
