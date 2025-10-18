"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, ImageIcon, Star, TreePine, Zap, Shield, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

const categories = [
  {
    id: "jungle",
    name: "Jungle Adventure",
    icon: TreePine,
    color: "bg-green-500",
    description: "Explore wild animals and nature!",
  },
  { id: "superman", name: "Superman Hero", icon: Zap, color: "bg-blue-500", description: "Fly high and save the day!" },
  {
    id: "spiderman",
    name: "Spiderman Hero",
    icon: Shield,
    color: "bg-red-500",
    description: "Swing through the city!",
  },
  { id: "batman", name: "Batman Hero", icon: Star, color: "bg-gray-800", description: "Fight crime in Gotham!" },
  {
    id: "baby-girl",
    name: "Princess Story",
    icon: Heart,
    color: "bg-pink-500",
    description: "Magical princess adventures!",
  },
]

export default function CreateStoryPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [childName, setChildName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const router = useRouter()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile || !selectedCategory || !email || !phone || !childName) {
      alert("Please fill in all fields and upload a photo!")
      return
    }

    setIsUploading(true)

    try {
      // Upload image to Blob storage
      const formData = new FormData()
      formData.append("file", selectedFile)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image")
      }

      const uploadResult = await uploadResponse.json()

      // Store order data in localStorage for now (in production, use a database)
      const orderData = {
        imageUrl: uploadResult.url,
        category: selectedCategory,
        email,
        phone,
        childName,
        timestamp: new Date().toISOString(),
      }

      localStorage.setItem("storybook-order", JSON.stringify(orderData))

      // Redirect to payment
      router.push("/payment")
    } catch (error) {
      console.error("Error:", error)
      alert("Something went wrong. Please try again!")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-red-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 animate-bounce font-fredoka">
            📸 Upload Your Child's Photo! 📸
          </h1>
          <p className="text-2xl text-white font-bold">Let's create an amazing story together!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Photo Upload Section */}
          <Card className="border-4 border-blue-500 shadow-2xl bg-white/95">
            <CardHeader className="bg-blue-500 text-white">
              <CardTitle className="text-3xl font-bold text-center font-fredoka">📷 Upload Photo</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="child-name" className="text-2xl font-bold text-blue-600 mb-2 block">
                    Child's Name *
                  </Label>
                  <Input
                    id="child-name"
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Enter your child's name"
                    className="text-xl p-4 border-4 border-blue-300 rounded-xl"
                    required
                  />
                </div>

                <div className="border-4 border-dashed border-blue-400 rounded-xl p-8 text-center bg-blue-50">
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="max-w-xs mx-auto rounded-xl border-4 border-blue-500"
                      />
                      <p className="text-xl font-bold text-blue-600">Perfect! 🎉</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="w-24 h-24 mx-auto text-blue-400" />
                      <p className="text-2xl font-bold text-blue-600">Click to upload your child's photo!</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="photo-upload"
                    required
                  />
                  <label
                    htmlFor="photo-upload"
                    className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl cursor-pointer text-xl transition-all duration-200 hover:scale-105"
                  >
                    <Upload className="w-6 h-6 inline mr-2" />
                    Choose Photo
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card className="border-4 border-green-500 shadow-2xl bg-white/95">
            <CardHeader className="bg-green-500 text-white">
              <CardTitle className="text-3xl font-bold text-center font-fredoka">🎭 Choose Story Theme</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <div
                      key={category.id}
                      className={`p-6 rounded-xl border-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
                        selectedCategory === category.id
                          ? "border-yellow-400 bg-yellow-100 shadow-lg"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div
                        className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-center mb-2 font-fredoka">{category.name}</h3>
                      <p className="text-center text-gray-600 font-semibold">{category.description}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-4 border-purple-500 shadow-2xl bg-white/95">
            <CardHeader className="bg-purple-500 text-white">
              <CardTitle className="text-3xl font-bold text-center font-fredoka">📧 Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email" className="text-2xl font-bold text-purple-600 mb-2 block">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="text-xl p-4 border-4 border-purple-300 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-2xl font-bold text-purple-600 mb-2 block">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="text-xl p-4 border-4 border-purple-300 rounded-xl"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={isUploading}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-6 px-12 rounded-2xl text-2xl shadow-2xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white inline-block mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>🎉 Create My Storybook - $10 🎉</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
