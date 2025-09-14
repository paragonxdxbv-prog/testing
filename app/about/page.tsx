"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { FirebaseAnalytics } from "@/components/firebase-analytics"
import { Navigation } from "@/components/navigation"
import { getAboutContent, getCompanyRules } from "@/lib/firebase-utils"
import { Upload, ShoppingBag, Heart, Search, Users, Award, Globe, Target } from "lucide-react"

export default function AboutPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [companyRules, setCompanyRules] = useState<string[]>([])
  const [aboutContent, setAboutContent] = useState({
    heroTitle: "ABOUT LEGACY",
    heroDescription: "WE ARE PIONEERS IN THE FUSION OF FASHION AND TECHNOLOGY, CREATING UNPRECEDENTED SHOPPING EXPERIENCES THAT BRIDGE THE GAP BETWEEN DIGITAL AND PHYSICAL REALITY.",
    storyTitle: "OUR STORY",
    storyContent: [
      "Founded in 2010, LEGACY emerged from a simple yet revolutionary idea: what if technology could make fashion more personal, more accessible, and more exciting than ever before?",
      "We started as a small team of fashion enthusiasts and tech innovators, united by a shared vision of transforming how people discover, try on, and experience clothing in the digital age.",
      "Today, we're proud to be at the forefront of AI-powered fashion technology, serving millions of customers worldwide with our innovative try-on experiences and premium product offerings."
    ],
    missionTitle: "OUR MISSION",
    missionContent: "TO DEMOCRATIZE FASHION BY MAKING IT MORE ACCESSIBLE, PERSONAL, AND SUSTAINABLE THROUGH INNOVATIVE TECHNOLOGY, WHILE MAINTAINING THE HIGHEST STANDARDS OF QUALITY AND CUSTOMER EXPERIENCE.",
    values: [
      {
        title: "INNOVATION",
        description: "We push the boundaries of fashion technology with AI-powered experiences and cutting-edge design."
      },
      {
        title: "COMMUNITY", 
        description: "Building a global community of fashion enthusiasts who share our passion for style and innovation."
      },
      {
        title: "QUALITY",
        description: "Every product is crafted with the highest standards of quality, durability, and attention to detail."
      },
      {
        title: "SUSTAINABILITY",
        description: "Committed to sustainable fashion practices and reducing our environmental impact."
      }
    ]
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    loadCompanyRules()
    loadAboutContent()
  }, [])

  const loadAboutContent = async () => {
    try {
      const content = await getAboutContent()
      if (content) {
        setAboutContent(content)
      }
    } catch (error) {
      console.error('Error loading about content:', error)
      // Keep default content
    }
  }

  const loadCompanyRules = async () => {
    try {
      const rules = await getCompanyRules()
      if (rules && rules.length > 0) {
        setCompanyRules(rules)
      } else {
        // Fallback to default rules if none exist
        const defaultRules = [
          "All products must meet our premium quality standards before listing",
          "Customer data privacy and security is our top priority",
          "We maintain sustainable and ethical sourcing practices",
          "Innovation and customer experience drive all our decisions",
          "We provide honest and transparent product descriptions"
        ]
        setCompanyRules(defaultRules)
      }
    } catch (error) {
      console.error('Error loading company rules:', error)
      // Fallback to default rules on error
      const defaultRules = [
        "All products must meet our premium quality standards before listing",
        "Customer data privacy and security is our top priority",
        "We maintain sustainable and ethical sourcing practices",
        "Innovation and customer experience drive all our decisions",
        "We provide honest and transparent product descriptions"
      ]
      setCompanyRules(defaultRules)
    }
  }

  const getValueIcon = (title: string) => {
    switch (title.toUpperCase()) {
      case 'INNOVATION':
        return <Target className="w-8 h-8" />
      case 'COMMUNITY':
        return <Users className="w-8 h-8" />
      case 'QUALITY':
        return <Award className="w-8 h-8" />
      case 'SUSTAINABILITY':
        return <Globe className="w-8 h-8" />
      default:
        return <Heart className="w-8 h-8" />
    }
  }

  return (
    <div
      className={`min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono transition-all duration-1000 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <FirebaseAnalytics />
      <Navigation isPageLoaded={isPageLoaded} currentPage="about" />

      {/* Hero Section */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <h1 className="text-4xl md:text-6xl font-light tracking-widest uppercase mb-6">
              {aboutContent.heroTitle}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {aboutContent.heroDescription}
            </p>
          </div>


          {/* Story Section */}
          <div
            className={`mb-20 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-medium tracking-widest uppercase mb-8">{aboutContent.storyTitle}</h2>
              <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {aboutContent.storyContent && aboutContent.storyContent.length > 0 ? (
                  aboutContent.storyContent.map((paragraph: string, index: number) => (
                    <p key={index}>
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p>Loading story content...</p>
                )}
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div
            className={`mb-20 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "900ms" }}
          >
            <h2 className="text-2xl font-medium tracking-widest uppercase mb-12 text-center">OUR VALUES</h2>
            <div className="grid md:grid-cols-2 gap-12">
              {aboutContent.values && aboutContent.values.length > 0 ? aboutContent.values.map((value: any, index: number) => (
                <div
                  key={value.title}
                  className="text-center"
                  style={{ transitionDelay: `${1000 + index * 100}ms` }}
                >
                  <div className="flex justify-center mb-4 text-black dark:text-white">
                    {getValueIcon(value.title)}
                  </div>
                  <h3 className="text-lg font-medium tracking-widest uppercase mb-4">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
                </div>
              )) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">Loading values...</p>
                </div>
              )}
            </div>
          </div>

          {/* Mission Section */}
          <div
            className={`bg-gray-50 dark:bg-black p-12 text-center mb-20 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "1100ms" }}
          >
            <h2 className="text-2xl font-medium tracking-widest uppercase mb-6">{aboutContent.missionTitle}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {aboutContent.missionContent}
            </p>
          </div>

          {/* Company Rules Section */}
          {companyRules.length > 0 && (
            <div
              className={`mb-20 transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "1200ms" }}
            >
              <h2 className="text-2xl font-medium tracking-widest uppercase mb-12 text-center">COMPANY RULES</h2>
              <div className="max-w-4xl mx-auto">
                <div className="grid gap-6">
                  {companyRules.map((rule, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-black p-6 border-l-4 border-black dark:border-white"
                      style={{ transitionDelay: `${1300 + index * 100}ms` }}
                    >
                      <div className="flex items-start space-x-4">
                        <span className="text-black dark:text-white font-bold text-lg">{index + 1}.</span>
                        <p className="text-gray-700 dark:text-white leading-relaxed">{rule}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>


      {/* Footer */}
      <footer
        className={`border-t border-gray-200 dark:border-gray-800 px-8 py-16 bg-gray-50 dark:bg-black transition-all duration-700 ${
          isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: "1300ms" }}
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
