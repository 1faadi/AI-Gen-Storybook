import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { sendOrderConfirmation, sendPaymentFailed } from "@/lib/email-service"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log("Payment successful for session:", session.id)
        
        // Extract order data from session metadata
        const orderData = {
          orderId: session.metadata?.orderId,
          childName: session.metadata?.childName,
          category: session.metadata?.category,
          email: session.metadata?.email,
          phone: session.metadata?.phone,
          imageUrl: session.metadata?.imageUrl,
          timestamp: session.metadata?.timestamp,
          paymentStatus: "completed",
          stripeSessionId: session.id,
          customerEmail: session.customer_email,
          amountTotal: session.amount_total,
        }

        // Send order confirmation email
        try {
          const emailResult = await sendOrderConfirmation(orderData)
          if (emailResult.success) {
            console.log("Order confirmation email sent successfully:", emailResult.messageId)
          } else {
            console.error("Failed to send order confirmation email:", emailResult.error)
          }
        } catch (emailError) {
          console.error("Error sending order confirmation email:", emailError)
        }

        // Here you would typically:
        // 1. Save the order to your database
        // 2. Trigger storybook generation process
        // 3. Update order status
        
        console.log("Order data:", orderData)
        
        break

      case "payment_intent.payment_failed":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("Payment failed for payment intent:", paymentIntent.id)
        
        // Extract order data from payment intent metadata if available
        if (paymentIntent.metadata?.orderId) {
          const failedOrderData = {
            orderId: paymentIntent.metadata.orderId,
            childName: paymentIntent.metadata.childName,
            category: paymentIntent.metadata.category,
            email: paymentIntent.metadata.email,
            phone: paymentIntent.metadata.phone,
            imageUrl: paymentIntent.metadata.imageUrl,
            timestamp: paymentIntent.metadata.timestamp,
            paymentStatus: "failed",
            stripePaymentIntentId: paymentIntent.id,
            failureReason: paymentIntent.last_payment_error?.message || "Payment failed",
          }

          // Send payment failed email
          try {
            const emailResult = await sendPaymentFailed(failedOrderData)
            if (emailResult.success) {
              console.log("Payment failed email sent successfully:", emailResult.messageId)
            } else {
              console.error("Failed to send payment failed email:", emailResult.error)
            }
          } catch (emailError) {
            console.error("Error sending payment failed email:", emailError)
          }
        }
        
        break

      case "checkout.session.expired":
        const expiredSession = event.data.object as Stripe.Checkout.Session
        console.log("Checkout session expired:", expiredSession.id)
        
        // Handle expired session
        // You might want to clean up any temporary data
        
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
