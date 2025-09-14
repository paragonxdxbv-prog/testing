"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Instagram, Youtube } from "lucide-react"
import { FirebaseAnalytics } from "@/components/firebase-analytics"
import { Navigation } from "@/components/navigation"
import { logEvent, getSocialMediaUrls } from '@/lib/firebase-utils'

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

export default function HomePage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [socialMedia, setSocialMedia] = useState({
    instagram: "https://instagram.com/legacy",
    tiktok: "https://tiktok.com/@legacy", 
    youtube: "https://youtube.com/@legacy"
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    
    // Load social media URLs from Firebase
    const loadSocialMedia = async () => {
      try {
        const urls = await getSocialMediaUrls()
        setSocialMedia(urls)
      } catch (error) {
        console.error('Error loading social media URLs:', error)
      }
    }
    
    loadSocialMedia()
    
    return () => clearTimeout(timer)
  }, [])

  const handleShopNowClick = () => {
    logEvent('cta_click', {
      cta_name: 'shop_now',
      page: 'home'
    })
    window.location.href = '/products'
  }

  const handleAboutClick = () => {
    logEvent('cta_click', {
      cta_name: 'about_us',
      page: 'home'
    })
    window.location.href = '/about'
  }

  const handleSocialClick = (platform: string, url: string) => {
    logEvent('social_click', {
      platform,
      page: 'home'
    })
    window.open(url, '_blank')
  }

  return (
    <div
      className={`min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono transition-all duration-1000 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <FirebaseAnalytics />
      {/* Combined Hero and Experience Section */}
      <div className="min-h-screen flex flex-col">
        <Navigation isPageLoaded={isPageLoaded} currentPage="home" />

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-8 py-16">
          <div className="max-w-6xl mx-auto text-center">
            {/* Hero Content */}
            <div
              className={`transition-all duration-700 mb-20 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <h1 className="text-6xl md:text-8xl font-medium tracking-widest uppercase mb-8">
                LEGACY
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-white font-mono tracking-wider mb-12 max-w-2xl mx-auto">
                PREMIUM PRODUCTS EXPERIENCE
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Button
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-0 text-sm font-medium tracking-widest uppercase px-8 py-4 transition-all duration-300 hover:scale-105"
                  onClick={handleShopNowClick}
                >
                  SHOP NOW
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-sm font-medium tracking-widest uppercase bg-transparent px-8 py-4 transition-all duration-300 hover:scale-105"
                  onClick={handleAboutClick}
                >
                  ABOUT US
                </Button>
              </div>
            </div>

            {/* Experience Legacy Content */}
            <div
              className={`transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-medium tracking-widest uppercase mb-6">
                  EXPERIENCE LEGACY
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 font-mono tracking-wider max-w-2xl mx-auto">
                  Discover premium products crafted with precision and innovation
                </p>
              </div>
          
              <div className="grid md:grid-cols-3 gap-12 mb-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-black dark:bg-white mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white dark:text-black font-mono text-xl font-bold">01</span>
                  </div>
                  <h3 className="text-xl font-medium tracking-widest uppercase mb-4">PREMIUM QUALITY</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-mono text-sm leading-relaxed">
                    Every product undergoes rigorous quality control to meet our exceptional standards
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-black dark:bg-white mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white dark:text-black font-mono text-xl font-bold">02</span>
                  </div>
                  <h3 className="text-xl font-medium tracking-widest uppercase mb-4">INNOVATIVE DESIGN</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-mono text-sm leading-relaxed">
                    Cutting-edge aesthetics combined with functional excellence in every creation
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-black dark:bg-white mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white dark:text-black font-mono text-xl font-bold">03</span>
                  </div>
                  <h3 className="text-xl font-medium tracking-widest uppercase mb-4">CUSTOMER FOCUS</h3>
                  <p className="text-gray-600 dark:text-gray-300 font-mono text-sm leading-relaxed">
                    Your satisfaction drives our commitment to excellence and continuous improvement
                  </p>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="text-center">
                <h3 className="text-2xl font-medium tracking-widest uppercase mb-8">FOLLOW US</h3>
                <div className="flex justify-center gap-6">
                  <button
                    onClick={() => handleSocialClick('instagram', socialMedia.instagram)}
                    className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={() => handleSocialClick('tiktok', socialMedia.tiktok)}
                    className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                    aria-label="Follow us on TikTok"
                  >
                    <TikTokIcon className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={() => handleSocialClick('youtube', socialMedia.youtube)}
                    className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                    aria-label="Follow us on YouTube"
                  >
                    <Youtube className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`border-t border-gray-200 dark:border-gray-800 px-8 py-16 bg-gray-50 dark:bg-black transition-all duration-700 ${
          isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: "1000ms" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img src="/acme-logo.png" alt="LEGACY" className="h-8 w-auto opacity-40 dark:hidden" />
            <img src="/legacy.png" alt="LEGACY" className="h-8 w-auto opacity-40 hidden dark:block" />
          </div>
          <p className="text-gray-400 dark:text-white text-xs font-mono tracking-widest uppercase">
            © 2025 LEGACY, INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  )
}
