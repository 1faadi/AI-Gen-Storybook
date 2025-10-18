import { type NextRequest, NextResponse } from "next/server"
import { sendOrderConfirmation } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    
    console.log("📧 Sending order confirmation email for:", orderData.childName)
    
    const result = await sendOrderConfirmation(orderData)
    
    if (result.success) {
      console.log("✅ Order confirmation email sent successfully:", result.messageId)
      return NextResponse.json({ 
        success: true, 
        message: "Order confirmation email sent successfully!",
        messageId: result.messageId 
      })
    } else {
      console.error("❌ Failed to send order confirmation email:", result.error)
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Error sending order confirmation email:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
