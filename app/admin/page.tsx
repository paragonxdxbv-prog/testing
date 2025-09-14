"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { ImageWithLoading } from "@/components/image-with-loading"
import { FirebaseAnalytics } from "@/components/firebase-analytics"
import { AdminAuth } from "@/components/admin-auth"
import { Navigation } from "@/components/navigation"
import { logEvent } from '@/lib/firebase-utils'
import { getProducts, addProduct, updateProduct, deleteProduct, getAboutContent, saveAboutContent, getCompanyRules, saveCompanyRules, getSocialMediaUrls, saveSocialMediaUrls } from '@/lib/firebase-utils'

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

const categories = ["DIGITAL PRODUCTS", "SHOES", "CLOTHING", "ACCESSORIES", "NEW ARRIVALS"]

export default function AdminPage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("products")
  const [aboutContent, setAboutContent] = useState({
    heroTitle: "",
    heroDescription: "",
    storyTitle: "",
    storyContent: [],
    missionTitle: "",
    missionContent: "",
    values: [
      { title: "INNOVATION", description: "We push the boundaries of fashion technology with AI-powered experiences and cutting-edge design." },
      { title: "COMMUNITY", description: "Building a global community of fashion enthusiasts who share our passion for style and innovation." },
      { title: "QUALITY", description: "Every product is crafted with the highest standards of quality, durability, and attention to detail." },
      { title: "SUSTAINABILITY", description: "Committed to sustainable fashion practices and reducing our environmental impact." }
    ]
  })
  const [companyRules, setCompanyRules] = useState<string[]>([])
  const [socialMedia, setSocialMedia] = useState({
    instagram: "https://instagram.com/legacy",
    tiktok: "https://tiktok.com/@legacy",
    youtube: "https://youtube.com/@legacy"
  })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    discountPercentage: "",
    category: "",
    image: "",
    description: "",
    buyUrl: ""
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    loadProducts()
    loadAboutContent()
    loadCompanyRules()
    loadSocialMediaUrls()
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

  const loadAboutContent = async () => {
    try {
      const content = await getAboutContent()
      if (content) {
        setAboutContent(prevContent => ({
          ...prevContent,
          ...content,
          values: content.values && content.values.length > 0 ? content.values : prevContent.values
        }))
      }
    } catch (error) {
      console.error('Error loading about content:', error)
    }
  }

  const loadCompanyRules = async () => {
    try {
      const rules = await getCompanyRules()
      if (rules && rules.length > 0) {
        setCompanyRules(rules)
      } else {
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

  const loadSocialMediaUrls = async () => {
    try {
      const urls = await getSocialMediaUrls()
      setSocialMedia(urls)
    } catch (error) {
      console.error('Error loading social media URLs:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      price: "",
      category: "",
      image: "",
      description: "",
      buyUrl: ""
    })
    setShowForm(true)
    logEvent('admin_action', { action: 'add_product_form' })
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || "",
      discountPercentage: product.discountPercentage?.toString() || "",
      category: product.category,
      image: product.image,
      description: product.description,
      buyUrl: product.buyUrl || ""
    })
    setShowForm(true)
    logEvent('admin_action', { action: 'edit_product_form', product_id: product.id })
  }

  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData)
        logEvent('admin_action', { action: 'update_product', product_id: editingProduct.id })
      } else {
        await addProduct(formData)
        logEvent('admin_action', { action: 'add_product' })
      }
      
      await loadProducts()
      setShowForm(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product. Please try again.')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId)
        logEvent('admin_action', { action: 'delete_product', product_id: productId })
        await loadProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Error deleting product. Please try again.')
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProduct(null)
    setFormData({
      name: "",
      price: "",
      originalPrice: "",
      discountPercentage: "",
      category: "",
      image: "",
      description: "",
      buyUrl: ""
    })
  }

  const handleSaveAboutContent = async () => {
    try {
      await saveAboutContent(aboutContent)
      alert('About content saved successfully!')
      logEvent('admin_action', { action: 'save_about_content' })
    } catch (error) {
      console.error('Error saving about content:', error)
      alert('Error saving about content. Please try again.')
    }
  }

  const handleSaveCompanyRules = async () => {
    try {
      await saveCompanyRules(companyRules)
      alert('Company rules saved successfully!')
      logEvent('admin_action', { action: 'save_company_rules' })
    } catch (error) {
      console.error('Error saving company rules:', error)
      alert('Error saving company rules. Please try again.')
    }
  }

  const handleSaveSocialMedia = async () => {
    try {
      await saveSocialMediaUrls(socialMedia)
      
      logEvent('admin_save_social_media', {
        action: 'save_social_media',
        page: 'admin'
      })
      
      alert('Social media URLs saved successfully!')
    } catch (error) {
      console.error('Error saving social media URLs:', error)
      alert('Error saving social media URLs. Please try again.')
    }
  }

  return (
    <AdminAuth>
      <div
        className={`min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono transition-all duration-1000 ${
          isPageLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <FirebaseAnalytics />
        <Navigation isPageLoaded={isPageLoaded} currentPage="admin" />
      
      {/* Admin Header */}
      <div className="px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-xs font-medium tracking-widest uppercase text-gray-500 dark:text-gray-400">ADMIN PANEL</span>
          <Button
            onClick={handleAddProduct}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-0 text-xs font-medium tracking-widest uppercase px-6 py-2 transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            ADD PRODUCT
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <section className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div
            className={`flex border-b border-gray-200 dark:border-gray-700 mb-12 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
                activeTab === "products"
                  ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              PRODUCTS ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`px-6 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
                activeTab === "about"
                  ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              ABOUT PAGE
            </button>
            <button
              onClick={() => setActiveTab("rules")}
              className={`px-6 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
                activeTab === "rules"
                  ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              COMPANY RULES
            </button>
            <button
              onClick={() => setActiveTab("social")}
              className={`px-6 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
                activeTab === "social"
                  ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              SOCIAL MEDIA
            </button>
          </div>

          {/* Add Product Button */}
          <div
            className={`mb-8 transition-all duration-700 ${
              isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <Button
              onClick={() => setShowForm(true)}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-0 text-sm font-medium tracking-widest uppercase px-6 py-3 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              ADD PRODUCT
            </Button>
          </div>

          {/* Product Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium tracking-widest uppercase text-black dark:text-white">
                    {editingProduct ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                      PRODUCT NAME
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-white text-black dark:text-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                        CURRENT PRICE
                      </label>
                      <Input
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="$180"
                        className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-white text-black dark:text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                        ORIGINAL PRICE (OPTIONAL)
                      </label>
                      <Input
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        placeholder="$200"
                        className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-white text-black dark:text-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                        DISCOUNT % (OPTIONAL)
                      </label>
                      <Input
                        name="discountPercentage"
                        value={formData.discountPercentage}
                        onChange={handleInputChange}
                        placeholder="10"
                        type="number"
                        className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-white text-black dark:text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                        CATEGORY
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white focus:outline-none text-sm bg-white dark:bg-white text-black dark:text-black"
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                      IMAGE URL
                    </label>
                    <Input
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-white text-black dark:text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                      DESCRIPTION
                    </label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter product description"
                      rows={4}
                      className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-white text-black dark:text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                      BUY URL (OPTIONAL)
                    </label>
                    <Input
                      name="buyUrl"
                      value={formData.buyUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/buy-product"
                      className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-white text-black dark:text-black"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      If provided, "BUY NOW" button will redirect to this URL
                    </p>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                      CANCEL
                    </Button>
                    <Button
                      onClick={handleSaveProduct}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingProduct ? 'UPDATE' : 'SAVE'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === "products" && (
            <>
              {/* Products Grid */}
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                  <p className="text-sm font-mono tracking-widest uppercase text-gray-500">LOADING PRODUCTS...</p>
                </div>
              ) : (
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-all duration-700 ${
                  isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: "500ms" }}>
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className={`group cursor-pointer transition-all duration-700 ${
                        isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                      }`}
                      style={{ transitionDelay: `${600 + index * 100}ms` }}
                    >
                      <div className="relative w-full overflow-hidden mb-4">
                        <ImageWithLoading
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            className="bg-white text-black hover:bg-gray-100 border-0 p-2 h-8 w-8"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-red-500 text-white hover:bg-red-600 border-0 p-2 h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-medium tracking-wide">{product.name}</h3>
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">{product.category}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium tracking-wide">{product.price}</span>
                          <span className="text-xs text-gray-400 font-mono">ID: {product.id}</span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && products.length === 0 && (
                <div
                  className={`text-center py-16 transition-all duration-700 ${
                    isPageLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: "600ms" }}
                >
                  <p className="text-gray-500 text-sm font-mono tracking-widest uppercase mb-4">
                    NO PRODUCTS FOUND
                  </p>
                  <Button
                    onClick={handleAddProduct}
                    className="bg-black text-white hover:bg-gray-800 border-0 text-xs font-medium tracking-widest uppercase px-6 py-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    ADD FIRST PRODUCT
                  </Button>
                </div>
              )}
            </>
          )}

          {/* About Page Content Management */}
          {activeTab === "about" && (
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-none">
                <h2 className="text-xl font-medium tracking-widest uppercase mb-6">ABOUT PAGE CONTENT</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                      HERO TITLE
                    </label>
                    <Input
                      value={aboutContent.heroTitle}
                      onChange={(e) => setAboutContent(prev => ({ ...prev, heroTitle: e.target.value }))}
                      className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-white text-black dark:text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                      HERO DESCRIPTION
                    </label>
                    <Textarea
                      value={aboutContent.heroDescription}
                      onChange={(e) => setAboutContent(prev => ({ ...prev, heroDescription: e.target.value }))}
                      rows={3}
                      className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-white text-black dark:text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                      STORY TITLE
                    </label>
                    <Input
                      value={aboutContent.storyTitle}
                      onChange={(e) => setAboutContent(prev => ({ ...prev, storyTitle: e.target.value }))}
                      className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-white text-black dark:text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                      STORY CONTENT (3 PARAGRAPHS)
                    </label>
                    {aboutContent.storyContent.map((paragraph, index) => (
                      <div key={index} className="mb-4">
                        <label className="block text-xs text-gray-500 dark:text-white mb-1">Paragraph {index + 1}</label>
                        <Textarea
                          value={paragraph}
                          onChange={(e) => {
                            const newStoryContent = [...aboutContent.storyContent]
                            newStoryContent[index] = e.target.value
                            setAboutContent(prev => ({ ...prev, storyContent: newStoryContent }))
                          }}
                          rows={3}
                          className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-white text-black dark:text-black"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                      MISSION TITLE
                    </label>
                    <Input
                      value={aboutContent.missionTitle}
                      onChange={(e) => setAboutContent(prev => ({ ...prev, missionTitle: e.target.value }))}
                      className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-white text-black dark:text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                      MISSION CONTENT
                    </label>
                    <Textarea
                      value={aboutContent.missionContent}
                      onChange={(e) => setAboutContent(prev => ({ ...prev, missionContent: e.target.value }))}
                      rows={4}
                      className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-white text-black dark:text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium tracking-widest uppercase mb-4 text-black dark:text-white">
                      OUR VALUES (4 VALUES)
                    </label>
                    {aboutContent?.values && aboutContent.values.length > 0 ? (
                      aboutContent.values.map((value, index) => (
                        <div key={index} className="mb-4">
                          <label className="block text-xs text-gray-500 dark:text-white mb-1">Value {index + 1}</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              placeholder="Title"
                              value={value.title}
                              onChange={(e) => {
                                const newValues = [...aboutContent.values]
                                newValues[index] = { ...newValues[index], title: e.target.value }
                                setAboutContent((prev) => ({ ...prev, values: newValues }))
                              }}
                              className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-gray-800 text-black dark:text-white"
                            />
                            <Textarea
                              placeholder="Description"
                              value={value.description}
                              onChange={(e) => {
                                const newValues = [...aboutContent.values]
                                newValues[index] = { ...newValues[index], description: e.target.value }
                                setAboutContent((prev) => ({ ...prev, values: newValues }))
                              }}
                              rows={2}
                              className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-gray-800 text-black dark:text-white"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-white text-sm font-mono tracking-wider">
                          No values found. Add some values to display them.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveAboutContent}
                      className="bg-black text-white hover:bg-gray-800 border-0 text-xs font-medium tracking-widest uppercase px-6 py-2"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      SAVE ABOUT CONTENT
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Company Rules Management */}
          {activeTab === "rules" && (
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-none">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium tracking-widest uppercase">COMPANY RULES</h2>
                  <Button
                    onClick={() => setCompanyRules((prev) => [...prev, ""])}
                    className="bg-black text-white hover:bg-gray-800 border-0 text-xs font-medium tracking-widest uppercase px-4 py-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    ADD RULE
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {companyRules.map((rule, index) => (
                    <div key={index} className="mb-4">
                      <label className="block text-xs text-gray-500 dark:text-white mb-1">Rule {index + 1}</label>
                      <div className="flex gap-2">
                        <Textarea
                          value={rule}
                          onChange={(e) => {
                            const newRules = [...companyRules]
                            newRules[index] = e.target.value
                            setCompanyRules(newRules)
                          }}
                          rows={2}
                          className="flex-1 border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-gray-800 text-black dark:text-white"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newRules = companyRules.filter((_, i) => i !== index)
                            setCompanyRules(newRules)
                          }}
                          className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={handleSaveCompanyRules}
                    className="bg-black text-white hover:bg-gray-800 border-0 text-xs font-medium tracking-widest uppercase px-6 py-2"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    SAVE COMPANY RULES
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Social Media Management */}
          {activeTab === "social" && (
            <div className="space-y-8">
              <div className="bg-gray-50 dark:bg-black p-6 rounded-none">
                <h2 className="text-xl font-medium tracking-widest uppercase mb-6 text-black dark:text-white">SOCIAL MEDIA URLS</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                      INSTAGRAM URL
                    </label>
                    <Input
                      value={socialMedia.instagram}
                      onChange={(e) => setSocialMedia(prev => ({ ...prev, instagram: e.target.value }))}
                      placeholder="https://instagram.com/legacy"
                      className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-white text-black dark:text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                      TIKTOK URL
                    </label>
                    <Input
                      value={socialMedia.tiktok}
                      onChange={(e) => setSocialMedia(prev => ({ ...prev, tiktok: e.target.value }))}
                      placeholder="https://tiktok.com/@legacy"
                      className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-white text-black dark:text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium tracking-widest uppercase mb-2 text-black dark:text-white">
                      YOUTUBE URL
                    </label>
                    <Input
                      value={socialMedia.youtube}
                      onChange={(e) => setSocialMedia(prev => ({ ...prev, youtube: e.target.value }))}
                      placeholder="https://youtube.com/@legacy"
                      className="border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-white text-black dark:text-black"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={handleSaveSocialMedia}
                    className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border-0 text-xs font-medium tracking-widest uppercase px-6 py-2"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    SAVE SOCIAL MEDIA
                  </Button>
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
        style={{ transitionDelay: "1000ms" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img src="/acme-logo.png" alt="LEGACY" className="h-8 w-auto opacity-40 dark:hidden" />
            <img src="/legacy.png" alt="LEGACY" className="h-8 w-auto opacity-40 hidden dark:block" />
          </div>
          <p className="text-gray-400 text-xs font-mono tracking-widest uppercase">
            2025 LEGACY, INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
      </div>
    </AdminAuth>
  )
}
