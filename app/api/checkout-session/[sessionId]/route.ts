import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    })

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Extract order data from session metadata
    const orderData = {
      imageUrl: session.metadata?.imageUrl || "",
      category: session.metadata?.category || "",
      email: session.metadata?.email || session.customer_email || "",
      phone: session.metadata?.phone || "",
      childName: session.metadata?.childName || "",
      timestamp: session.metadata?.timestamp || "",
      orderId: session.metadata?.orderId || "",
      stripeSessionId: session.id,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
    }

    return NextResponse.json(orderData)
  } catch (error) {
    console.error("Error retrieving session:", error)
    return NextResponse.json({ error: "Failed to retrieve session" }, { status: 500 })
  }
}
