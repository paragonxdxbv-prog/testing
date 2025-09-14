"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search, Filter, Grid, List } from "lucide-react"
import { ImageWithLoading } from "@/components/image-with-loading"
import { FirebaseAnalytics } from "@/components/firebase-analytics"
import { Navigation } from "@/components/navigation"
import { logEvent, getProducts } from "@/lib/firebase-utils"

interface Product {
  id: string
  name: string
  price: string
  originalPrice?: string
  discountPercentage?: number
  category: string
  image: string
  description: string
  buyUrl?: string
}

// Products will be loaded from Firebase

const categories = ["ALL", "DIGITAL PRODUCTS", "SHOES", "CLOTHING", "ACCESSORIES", "NEW ARRIVALS"]

export default function ProductsPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const productsData = await getProducts()
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageLoad = (productId: string) => {
    setLoadedImages((prev) => new Set([...prev, productId]))
  }

  const handleAddToCart = (product: Product) => {
    logEvent('add_to_cart', {
      item_id: product.id,
      item_name: product.name,
      category: product.category,
      price: product.price,
      currency: 'USD'
    })
    // Add to cart logic here
  }

  const handleCategoryFilter = (category: string) => {
    logEvent('filter_products', {
      filter_type: 'category',
      filter_value: category
    })
    setSelectedCategory(category)
  }

  const handleViewModeChange = (mode: "grid" | "list") => {
    logEvent('change_view_mode', {
      view_mode: mode
    })
    setViewMode(mode)
  }

  const filteredProducts = products.filter(product => {
    // Category filter
    const categoryMatch = selectedCategory === "ALL" || 
      product.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      product.name.toLowerCase().includes(selectedCategory.toLowerCase())
    
    // Search filter
    const searchMatch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Price filter
    const productPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''))
    const priceMatch = productPrice >= priceRange.min && productPrice <= priceRange.max
    
    return categoryMatch && searchMatch && priceMatch
  })

  return (
    <div
      className={`min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono transition-all duration-1000 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <FirebaseAnalytics />
      <Navigation isPageLoaded={isPageLoaded} currentPage="products" />

      {/* Page Title */}
      <section className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div
            className={`flex items-center justify-between mb-8 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <h1 className="text-3xl font-medium tracking-widest uppercase">PRODUCTS</h1>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className={`border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium tracking-widest uppercase bg-transparent px-4 transition-all duration-300 ${
                  viewMode === "grid" ? "bg-black dark:bg-white text-white dark:text-black" : ""
                }`}
                onClick={() => handleViewModeChange("grid")}
              >
                <Grid className="w-4 h-4 mr-2" />
                GRID
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium tracking-widest uppercase bg-transparent px-4 transition-all duration-300 ${
                  viewMode === "list" ? "bg-black dark:bg-white text-white dark:text-black" : ""
                }`}
                onClick={() => handleViewModeChange("list")}
              >
                <List className="w-4 h-4 mr-2" />
                LIST
              </Button>
            </div>
          </div>

          {/* Search and Price Filter */}
          <div
            className={`flex flex-col md:flex-row gap-6 mb-8 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "350ms" }}
          >
            {/* Search Bar */}
            <div className="flex items-center bg-gray-50 dark:bg-black rounded-none px-4 py-3 border border-gray-200 dark:border-gray-700 flex-1">
              <Search className="w-4 h-4 text-gray-400 dark:text-white mr-3" />
              <input
                type="text"
                placeholder="SEARCH PRODUCTS..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm outline-none placeholder-gray-400 dark:placeholder-white w-full font-mono tracking-wider text-black dark:text-white"
              />
            </div>

            {/* Price Range Filter */}
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-black rounded-none px-4 py-3 border border-gray-200 dark:border-gray-700">
              <Filter className="w-4 h-4 text-gray-400 dark:text-white" />
              <span className="text-xs font-medium tracking-widest uppercase text-gray-600 dark:text-white">PRICE:</span>
              <input
                type="number"
                placeholder="MIN"
                value={priceRange.min}
                onChange={(e: any) => setPriceRange((prev: any) => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                className="bg-transparent text-xs outline-none placeholder-gray-400 dark:placeholder-white w-16 font-mono tracking-wider border-r border-gray-300 dark:border-gray-600 pr-2 text-black dark:text-white"
              />
              <span className="text-gray-400 dark:text-white">-</span>
              <input
                type="number"
                placeholder="MAX"
                value={priceRange.max}
                onChange={(e: any) => setPriceRange((prev: any) => ({ ...prev, max: parseInt(e.target.value) || 1000 }))}
                className="bg-transparent text-xs outline-none placeholder-gray-400 dark:placeholder-white w-16 font-mono tracking-wider text-black dark:text-white"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div
            className={`flex flex-wrap gap-4 mb-12 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            {categories.map((category, index) => (
              <Button
                key={category}
                variant="outline"
                className={`border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium tracking-widest uppercase bg-transparent px-6 transition-all duration-300 ${
                  selectedCategory === category ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" : ""
                }`}
                onClick={() => handleCategoryFilter(category)}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
              <p className="text-sm font-mono tracking-widest uppercase text-gray-500 dark:text-white">LOADING PRODUCTS...</p>
            </div>
          ) : (
            <div className={`grid gap-8 transition-all duration-700 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            } ${isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            style={{ transitionDelay: "600ms" }}>
              {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`group cursor-pointer transition-all duration-700 ${
                  isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                } ${viewMode === "list" ? "flex items-center space-x-6" : ""}`}
                style={{ transitionDelay: `${700 + index * 100}ms` }}
              >
                <div className={`relative overflow-hidden mb-4 ${viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "w-full"}`}>
                  <ImageWithLoading
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className={`w-full h-auto object-contain group-hover:scale-105 transition-all duration-500 ${
                      viewMode === "list" ? "h-full object-cover" : ""
                    }`}
                    onLoad={() => handleImageLoad(product.id)}
                  />
                </div>

                <div className={`space-y-3 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div>
                    <h3 className="text-sm font-medium tracking-wide">{product.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-white uppercase tracking-widest font-mono">{product.category}</p>
                    <p className="text-xs text-gray-600 dark:text-white mt-2 line-clamp-2">{product.description}</p>
                  </div>
                  <div className={`flex items-center justify-between ${viewMode === "list" ? "mt-4" : ""}`}>
                    <div className="flex flex-col">
                      {product.originalPrice && product.discountPercentage ? (
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className="text-sm font-medium tracking-wide text-red-600">{product.price}</span>
                          <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-bold">-{product.discountPercentage}% OFF</span>
                        </div>
                      ) : (
                        <span className="text-sm font-medium tracking-wide">{product.price}</span>
                      )}
                    </div>
                    <button 
                      className="bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white px-6 py-2 text-xs font-medium tracking-widest uppercase cursor-pointer hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 hover:scale-105 whitespace-nowrap"
                      onClick={() => {
                        if (product.buyUrl) {
                          // Log the purchase attempt
                          logEvent('purchase_attempt', {
                            item_id: product.id,
                            item_name: product.name,
                            category: product.category,
                            price: product.price,
                            currency: 'USD',
                            redirect_url: product.buyUrl
                          })
                          // Open in new tab
                          window.open(product.buyUrl, '_blank', 'noopener,noreferrer')
                        } else {
                          handleAddToCart(product)
                        }
                      }}
                    >
                      {product.buyUrl ? 'BUY NOW' : 'ADD TO CART'}
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div
              className={`text-center py-16 transition-all duration-700 ${
                isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <p className="text-gray-500 dark:text-white text-sm font-mono tracking-widest uppercase">
                NO PRODUCTS FOUND
              </p>
            </div>
          )}
        </div>
      </section>


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
