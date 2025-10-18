"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Mail, Home, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface OrderData {
  imageUrl: string
  category: string
  email: string
  phone: string
  childName: string
  timestamp: string
  orderId?: string
  stripeSessionId?: string
}

export default function PaymentSuccessPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(3600) // 1 hour in seconds
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    
    if (sessionId) {
      // Fetch session details from Stripe
      fetchSessionDetails(sessionId)
    } else {
      // Fallback to localStorage for backward compatibility
      const storedOrder = localStorage.getItem("storybook-order")
      if (storedOrder) {
        try {
          const data = JSON.parse(storedOrder)
          setOrderData(data)
          localStorage.removeItem("storybook-order")
        } catch (error) {
          console.error("Error parsing stored order data:", error)
          setError("Failed to load order data")
        }
      } else {
        setError("No order data found")
      }
      setIsLoading(false)
    }
  }, [searchParams])

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/checkout-session/${sessionId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch session details")
      }
      
      const sessionData = await response.json()
      setOrderData(sessionData)
      
      // Trigger email sending since webhook might not be working
      await triggerEmailSending(sessionData)
    } catch (error) {
      console.error("Error fetching session details:", error)
      setError("Failed to load payment details")
    } finally {
      setIsLoading(false)
    }
  }

  const triggerEmailSending = async (orderData: OrderData) => {
    try {
      console.log("📧 Triggering email sending for order:", orderData)
      const response = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log("✅ Email sent successfully:", result.messageId)
      } else {
        console.error("❌ Failed to send email")
      }
    } catch (error) {
      console.error("❌ Error sending email:", error)
    }
  }

  useEffect(() => {
    if (orderData) {
      // Start the countdown timer
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [orderData])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case "jungle":
        return "🌿"
      case "superman":
        return "🦸‍♂️"
      case "spiderman":
        return "🕷️"
      case "batman":
        return "🦇"
      case "baby-girl":
        return "👸"
      default:
        return "📚"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-red-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-2xl font-bold text-white">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-red-400 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Payment Error</h1>
          <p className="text-xl text-white mb-8">{error || "Unable to load payment details"}</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-white text-gray-800 hover:bg-gray-100 font-bold py-3 px-6 rounded-xl"
          >
            Return Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-red-400 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="animate-bounce mb-4">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto bg-white rounded-full p-2" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 font-fredoka">🎉 Payment Successful! 🎉</h1>
          <p className="text-2xl text-white font-bold">Your magical storybook is being created!</p>
        </div>

        {/* Order Confirmation */}
        <Card className="border-4 border-green-500 shadow-2xl bg-white/95 mb-8">
          <CardHeader className="bg-green-500 text-white">
            <CardTitle className="text-3xl font-bold text-center font-fredoka">✅ Order Confirmed</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Child Info */}
              <div className="text-center">
                <img
                  src={orderData.imageUrl || "/placeholder.svg"}
                  alt={`${orderData.childName}'s photo`}
                  className="w-32 h-32 rounded-full border-4 border-green-500 mx-auto object-cover"
                />
                <h3 className="text-2xl font-bold text-green-600 mt-4 font-fredoka">{orderData.childName}</h3>
                <div className="flex items-center justify-center mt-2">
                  <span className="text-3xl mr-2">{getCategoryEmoji(orderData.category)}</span>
                  <span className="text-lg font-bold text-gray-600 capitalize">
                    {orderData.category.replace("-", " ")} Adventure
                  </span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-blue-500 mr-2" />
                  <h4 className="text-xl font-bold text-blue-600">Delivery Information</h4>
                </div>
                <p className="text-center text-gray-700 font-semibold mb-2">
                  Your personalized storybook will be sent to:
                </p>
                <p className="text-center text-blue-600 font-bold text-lg">{orderData.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timer Card */}
        <Card className="border-4 border-orange-500 shadow-2xl bg-white/95 mb-8">
          <CardHeader className="bg-orange-500 text-white">
            <CardTitle className="text-3xl font-bold text-center font-fredoka">⏰ Delivery Timer</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
                <Clock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <div className="text-6xl font-bold text-orange-600 mb-2 font-mono">{formatTime(timeRemaining)}</div>
                <p className="text-xl font-bold text-orange-600">
                  {timeRemaining > 0 ? "Time until delivery!" : "Your storybook should be ready!"}
                </p>
                <p className="text-gray-600 mt-2">
                  {timeRemaining > 0
                    ? "We're working hard to create your magical story!"
                    : "Check your email for your personalized storybook!"}
                </p>
              </div>

              {timeRemaining === 0 && (
                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200 animate-pulse">
                  <p className="text-green-600 font-bold text-lg">📧 Check your email now!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Button
            onClick={() => router.push("/")}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 px-8 rounded-2xl text-2xl shadow-2xl transition-all duration-200 hover:scale-105"
          >
            <Home className="w-6 h-6 inline mr-2" />
            Create Another Storybook
          </Button>

          <p className="text-white font-bold text-lg">Thank you for choosing our magical storybook service! 🌟</p>
        </div>
      </div>
    </div>
  )
}
