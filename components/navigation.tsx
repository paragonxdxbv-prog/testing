"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavigationProps {
  isPageLoaded: boolean
  currentPage?: string
}

export function Navigation({ isPageLoaded, currentPage = "home" }: NavigationProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc = mounted ? (theme === "dark" ? "/legacy.png" : "/acme-logo.png") : "/acme-logo.png"

  return (
    <header
      className={`px-8 py-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black transition-all duration-700 ${
        isPageLoaded ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a href="/home" className="flex items-center space-x-3">
            <img src={logoSrc} alt="LEGACY" className="h-10 w-auto" />
            <span className="text-lg font-medium tracking-widest uppercase text-black dark:text-white">
              LEGACY
            </span>
          </a>
        </div>

        <nav className="hidden md:flex items-center space-x-12">
          <a
            href="/home"
            className={`text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 text-xs font-medium tracking-widest uppercase transition-all duration-500 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            } ${currentPage === "home" ? "border-b-2 border-black dark:border-white pb-1" : ""}`}
            style={{ transitionDelay: "200ms" }}
          >
            HOME
          </a>
          <a
            href="/products"
            className={`text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 text-xs font-medium tracking-widest uppercase transition-all duration-500 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            } ${currentPage === "products" ? "border-b-2 border-black dark:border-white pb-1" : ""}`}
            style={{ transitionDelay: "250ms" }}
          >
            PRODUCTS
          </a>
          <a
            href="/about"
            className={`text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 text-xs font-medium tracking-widest uppercase transition-all duration-500 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            } ${currentPage === "about" ? "border-b-2 border-black dark:border-white pb-1" : ""}`}
            style={{ transitionDelay: "300ms" }}
          >
            ABOUT
          </a>
        </nav>

        <div
          className={`flex items-center space-x-6 transition-all duration-700 ${
            isPageLoaded ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
