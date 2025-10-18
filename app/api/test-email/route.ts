import { type NextRequest, NextResponse } from "next/server"
import { sendOrderConfirmation } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 Testing email service...")
    
    const testOrderData = {
      orderId: 'test_order_' + Date.now(),
      childName: 'Test Child',
      category: 'jungle',
      email: 'fahadnshuu1@gmail.com', // Send to yourself for testing
      phone: '123-456-7890',
      imageUrl: '/placeholder.svg',
      timestamp: new Date().toISOString(),
      paymentStatus: 'completed',
      stripeSessionId: 'cs_test_123',
      customerEmail: 'fahadnshuu1@gmail.com',
      amountTotal: 1000,
    }

    console.log("📧 Sending test email with data:", testOrderData)

    const result = await sendOrderConfirmation(testOrderData)
    
    console.log("📧 Email test result:", result)
    
    if (result.success) {
      console.log("✅ Email sent successfully!")
      return NextResponse.json({ 
        success: true, 
        message: "Test email sent successfully!",
        messageId: result.messageId 
      })
    } else {
      console.log("❌ Email failed:", result.error)
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Email test error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
