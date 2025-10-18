import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: NextRequest) {
  try {
    const { orderData, amount } = await request.json()

    if (!orderData || !amount) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Create a unique order ID for metadata
    const orderId = `storybook_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    // Normalize product image URL to an absolute URL (Stripe requires absolute URLs)
    const images: string[] = []
    if (orderData.imageUrl) {
      const imageUrl: string = orderData.imageUrl
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        images.push(imageUrl)
      } else if (imageUrl.startsWith("/")) {
        images.push(`${baseUrl}${imageUrl}`)
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Custom Storybook for ${orderData.childName}`,
              description: `Personalized ${String(orderData.category || "storybook").replace("-", " ")} adventure story`,
              images,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment`,
      metadata: {
        orderId,
        childName: String(orderData.childName || ""),
        category: String(orderData.category || ""),
        email: String(orderData.email || ""),
        phone: String(orderData.phone || ""),
        imageUrl: String(orderData.imageUrl || ""),
        timestamp: String(orderData.timestamp || new Date().toISOString()),
      },
      customer_email: orderData.email,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error("Checkout session creation error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
