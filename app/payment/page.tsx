"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { CreditCard, ArrowLeft, Star, Heart } from "lucide-react"
import { loadStripe, type Stripe } from "@stripe/stripe-js"

let stripePromise: Promise<Stripe | null> | null = null
const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!key) {
      return null
    }
    stripePromise = loadStripe(key)
  }
  return stripePromise
}

interface OrderData {
  imageUrl: string
  category: string
  email: string
  phone: string
  childName: string
  timestamp: string
}

export default function PaymentPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedOrder = localStorage.getItem("storybook-order")
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder))
    } else {
      // Redirect back if no order data
      router.push("/create")
    }
  }, [router])

  const handlePayment = async () => {
    if (!orderData) return

    setIsProcessing(true)

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderData,
          amount: 1000, // $10.00 in cents
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      const stripeOrNull = getStripe()
      if (!stripeOrNull) throw new Error("Stripe publishable key is not set")
      const stripe = await stripeOrNull
      if (!stripe) throw new Error("Stripe failed to initialize")

      if (data.sessionId) {
        const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId })
        if (error) throw error
      } else if (data.url) {
        // Fallback: direct URL
        window.location.href = data.url
      } else {
        throw new Error("No checkout session received")
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert(`Payment error: ${error instanceof Error ? error.message : "Something went wrong. Please try again!"}`)
      setIsProcessing(false)
    }
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-red-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-2xl font-bold text-white">Loading...</p>
        </div>
      </div>
    )
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-red-400 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 animate-bounce font-fredoka">💳 Almost Ready! 💳</h1>
          <p className="text-2xl text-white font-bold">Just one more step to create your magical storybook!</p>
        </div>

        {/* Order Summary */}
        <Card className="border-4 border-blue-500 shadow-2xl bg-white/95 mb-8">
          <CardHeader className="bg-blue-500 text-white">
            <CardTitle className="text-3xl font-bold text-center font-fredoka">📋 Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Child Photo */}
              <div className="text-center">
                <img
                  src={orderData.imageUrl || "/placeholder.svg"}
                  alt={`${orderData.childName}'s photo`}
                  className="w-32 h-32 rounded-full border-4 border-blue-500 mx-auto object-cover"
                />
                <h3 className="text-2xl font-bold text-blue-600 mt-4 font-fredoka">{orderData.childName}</h3>
              </div>

              {/* Story Details */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl mr-3">{getCategoryEmoji(orderData.category)}</span>
                  <h4 className="text-xl font-bold text-blue-600 capitalize">
                    {orderData.category.replace("-", " ")} Story
                  </h4>
                </div>
                <p className="text-center text-gray-600 font-semibold">
                  A personalized adventure featuring {orderData.childName}!
                </p>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                  <p className="font-bold text-purple-600">Email:</p>
                  <p className="text-gray-700">{orderData.email}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                  <p className="font-bold text-purple-600">Phone:</p>
                  <p className="text-gray-700">{orderData.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Section */}
        <Card className="border-4 border-green-500 shadow-2xl bg-white/95">
          <CardHeader className="bg-green-500 text-white">
            <CardTitle className="text-3xl font-bold text-center font-fredoka">💰 Payment</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                <div className="flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-yellow-500 mr-2" />
                  <span className="text-4xl font-bold text-green-600">$10.00</span>
                  <Heart className="w-8 h-8 text-red-500 ml-2" />
                </div>
                <p className="text-xl font-bold text-green-600">Custom Storybook Creation</p>
                <p className="text-gray-600 mt-2">Professional quality • Delivered in 1 hour • Digital PDF format</p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-6 px-8 rounded-2xl text-2xl shadow-2xl transition-all duration-200 hover:scale-105 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white inline-block mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6 inline mr-2" />
                      Pay with Stripe - $10.00
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => router.push("/create")}
                  variant="outline"
                  className="w-full border-2 border-gray-400 text-gray-600 font-bold py-4 px-8 rounded-xl text-lg hover:bg-gray-50"
                >
                  <ArrowLeft className="w-5 h-5 inline mr-2" />
                  Go Back to Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
