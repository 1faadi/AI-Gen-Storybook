import { type NextRequest, NextResponse } from "next/server"
import { sendOrderConfirmation, sendStorybookDelivery, sendPaymentFailed } from "@/lib/email-service"

// Send order confirmation email
export async function POST(request: NextRequest) {
  try {
    const { orderData, emailType } = await request.json()

    if (!orderData || !emailType) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    let result

    switch (emailType) {
      case "order_confirmation":
        result = await sendOrderConfirmation(orderData)
        break
      case "storybook_delivery":
        const { storybookUrl } = await request.json()
        if (!storybookUrl) {
          return NextResponse.json({ error: "Storybook URL is required for delivery email" }, { status: 400 })
        }
        result = await sendStorybookDelivery(orderData, storybookUrl)
        break
      case "payment_failed":
        result = await sendPaymentFailed(orderData)
        break
      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: "Email sent successfully",
        messageId: result.messageId 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}

// Test email endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testEmail = searchParams.get("email")

    if (!testEmail) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    // Send a test email
    const testOrderData = {
      childName: "Test Child",
      category: "superman",
      email: testEmail,
      phone: "123-456-7890",
      timestamp: new Date().toISOString(),
      orderId: "test_order_123",
    }

    const result = await sendOrderConfirmation(testOrderData)

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: "Test email sent successfully",
        messageId: result.messageId 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 })
  }
}
