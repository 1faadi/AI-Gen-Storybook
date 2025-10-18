import nodemailer from "nodemailer"
import { join } from "path"
import fs from "fs"

// Email service configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Use App Password for Gmail
  },
})

// Email templates
export const emailTemplates = {
  orderConfirmation: (orderData: any) => ({
    subject: `🎉 Order Confirmed - Custom Storybook for ${orderData.childName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ffd700, #ff8c00); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50; }
          .child-photo { text-align: center; margin: 20px 0; }
          .child-photo img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid #4CAF50; }
          .highlight { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Order Confirmed!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Your magical storybook is being created!</p>
          </div>
          
          <div class="content">
            <div class="child-photo">
              <img src="${orderData.imageSrc || 'cid:child-photo'}" alt="${orderData.childName}'s photo">
            </div>
            
            <h2 style="color: #4CAF50; text-align: center;">Hello ${orderData.childName}! 🌟</h2>
            
            <div class="order-details">
              <h3 style="color: #333; margin-top: 0;">📋 Order Details</h3>
              <p><strong>Order ID:</strong> ${orderData.orderId}</p>
              <p><strong>Story Theme:</strong> ${orderData.category.replace('-', ' ')} Adventure</p>
              <p><strong>Child's Name:</strong> ${orderData.childName}</p>
              <p><strong>Email:</strong> ${orderData.email}</p>
              <p><strong>Phone:</strong> ${orderData.phone}</p>
              <p><strong>Order Date:</strong> ${new Date(orderData.timestamp).toLocaleDateString()}</p>
            </div>
            
            <div class="highlight">
              <h3 style="color: #4CAF50; margin-top: 0;">⏰ What Happens Next?</h3>
              <p>Our talented team is now creating your personalized storybook featuring <strong>${orderData.childName}</strong> in an amazing <strong>${orderData.category.replace('-', ' ')}</strong> adventure!</p>
              <p><strong>Delivery Time:</strong> Your storybook will be delivered to this email address within 1 hour.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}" class="button">Create Another Storybook</a>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing our magical storybook service! 🌟</p>
              <p>If you have any questions, please don't hesitate to contact us.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Order Confirmation - Custom Storybook for ${orderData.childName}
      
      Hello ${orderData.childName}!
      
      Your order has been confirmed and our team is creating your personalized storybook.
      
      Order Details:
      - Order ID: ${orderData.orderId}
      - Story Theme: ${orderData.category.replace('-', ' ')} Adventure
      - Child's Name: ${orderData.childName}
      - Email: ${orderData.email}
      - Phone: ${orderData.phone}
      - Order Date: ${new Date(orderData.timestamp).toLocaleDateString()}
      
      Your storybook will be delivered to this email address within 1 hour.
      
      Thank you for choosing our magical storybook service!
    `,
    attachments: orderData.attachments || [],
  }),

  storybookDelivery: (orderData: any, storybookUrl: string) => ({
    subject: `📚 Your Storybook is Ready! - ${orderData.childName}'s Adventure`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Storybook is Ready!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50, #45a049); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .storybook-preview { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border-left: 4px solid #4CAF50; }
          .download-button { display: inline-block; background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-size: 18px; font-weight: bold; }
          .highlight { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: white; margin: 0; font-size: 28px;">📚 Your Storybook is Ready!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">${orderData.childName}'s magical adventure awaits!</p>
          </div>
          
          <div class="content">
            <div class="storybook-preview">
              <h2 style="color: #4CAF50;">🌟 ${orderData.childName}'s ${orderData.category.replace('-', ' ')} Adventure</h2>
              <p>Your personalized storybook has been created and is ready for download!</p>
              
              <a href="${storybookUrl}" class="download-button">📥 Download Your Storybook</a>
              
              <div class="highlight">
                <h3 style="color: #4CAF50; margin-top: 0;">📖 What's Inside?</h3>
                <p>Your storybook features <strong>${orderData.childName}</strong> as the main character in an exciting <strong>${orderData.category.replace('-', ' ')}</strong> adventure, complete with beautiful illustrations and engaging storytelling.</p>
              </div>
            </div>
            
            <div class="highlight">
              <h3 style="color: #4CAF50; margin-top: 0;">💡 Tips for Reading</h3>
              <ul>
                <li>Print the storybook for a physical reading experience</li>
                <li>Read together with your child for maximum enjoyment</li>
                <li>Save the PDF for future reading sessions</li>
                <li>Share the magic with family and friends!</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}" class="download-button" style="background: #2196F3;">Create Another Storybook</a>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing our magical storybook service! 🌟</p>
              <p>We hope ${orderData.childName} enjoys their adventure!</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Your Storybook is Ready! - ${orderData.childName}'s Adventure
      
      Hello!
      
      Your personalized storybook has been created and is ready for download!
      
      Storybook Details:
      - Child's Name: ${orderData.childName}
      - Story Theme: ${orderData.category.replace('-', ' ')} Adventure
      - Order ID: ${orderData.orderId}
      
      Download your storybook: ${storybookUrl}
      
      Your storybook features ${orderData.childName} as the main character in an exciting ${orderData.category.replace('-', ' ')} adventure, complete with beautiful illustrations and engaging storytelling.
      
      Tips for Reading:
      - Print the storybook for a physical reading experience
      - Read together with your child for maximum enjoyment
      - Save the PDF for future reading sessions
      - Share the magic with family and friends!
      
      Thank you for choosing our magical storybook service!
      We hope ${orderData.childName} enjoys their adventure!
    `,
  }),

  paymentFailed: (orderData: any) => ({
    subject: `❌ Payment Failed - Storybook Order for ${orderData.childName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Failed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f44336, #d32f2f); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .error-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f44336; }
          .retry-button { display: inline-block; background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: white; margin: 0; font-size: 28px;">❌ Payment Failed</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">We couldn't process your payment</p>
          </div>
          
          <div class="content">
            <div class="error-details">
              <h3 style="color: #f44336; margin-top: 0;">Payment Issue</h3>
              <p>Unfortunately, we couldn't process your payment for ${orderData.childName}'s storybook order.</p>
              
              <h4>Order Details:</h4>
              <ul>
                <li><strong>Child's Name:</strong> ${orderData.childName}</li>
                <li><strong>Story Theme:</strong> ${orderData.category.replace('-', ' ')} Adventure</li>
                <li><strong>Order Date:</strong> ${new Date(orderData.timestamp).toLocaleDateString()}</li>
              </ul>
              
              <h4>What You Can Do:</h4>
              <ul>
                <li>Check your payment method and try again</li>
                <li>Ensure you have sufficient funds</li>
                <li>Contact your bank if the issue persists</li>
                <li>Try a different payment method</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/payment" class="retry-button">Try Payment Again</a>
            </div>
            
            <div class="footer">
              <p>If you continue to experience issues, please contact our support team.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Payment Failed - Storybook Order for ${orderData.childName}
      
      Unfortunately, we couldn't process your payment for ${orderData.childName}'s storybook order.
      
      Order Details:
      - Child's Name: ${orderData.childName}
      - Story Theme: ${orderData.category.replace('-', ' ')} Adventure
      - Order Date: ${new Date(orderData.timestamp).toLocaleDateString()}
      
      What You Can Do:
      - Check your payment method and try again
      - Ensure you have sufficient funds
      - Contact your bank if the issue persists
      - Try a different payment method
      
      Try payment again: ${process.env.NEXT_PUBLIC_BASE_URL}/payment
      
      If you continue to experience issues, please contact our support team.
    `,
  }),
}

// Email sending functions
export const sendEmail = async (to: string, template: any) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
      attachments: template.attachments,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export const sendOrderConfirmation = async (orderData: any) => {
  // Build absolute image URL or CID attachment for local files
  let imageSrc: string | undefined = undefined
  let attachments: Array<{ filename: string; path?: string; cid: string }> | undefined = undefined

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const imageUrl = orderData.imageUrl as string | undefined
  if (imageUrl) {
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      imageSrc = imageUrl
    } else if (imageUrl.startsWith("/")) {
      // Try to embed local public asset via CID for email clients
      const publicPath = join(process.cwd(), "public", imageUrl.replace(/^\//, ""))
      if (fs.existsSync(publicPath)) {
        attachments = [
          {
            filename: publicPath.split(/[/\\]/).pop() || "child-photo",
            path: publicPath,
            cid: "child-photo",
          },
        ]
        imageSrc = "cid:child-photo"
      } else {
        // Fallback to absolute URL
        imageSrc = `${baseUrl}${imageUrl}`
      }
    }
  }

  const template = emailTemplates.orderConfirmation({ ...orderData, imageSrc, attachments })
  return await sendEmail(orderData.email, template)
}

export const sendStorybookDelivery = async (orderData: any, storybookUrl: string) => {
  const template = emailTemplates.storybookDelivery(orderData, storybookUrl)
  return await sendEmail(orderData.email, template)
}

export const sendPaymentFailed = async (orderData: any) => {
  const template = emailTemplates.paymentFailed(orderData)
  return await sendEmail(orderData.email, template)
}

export const sendOwnerOrderReceived = async (orderData: any) => {
  const ownerEmail = process.env.OWNER_EMAIL || "fahadnshuu1@gmail.com"
  const subject = `🧾 New Order Received: ${orderData.childName} - ${orderData.category}`
  const text = `
New order received\n\n
Order ID: ${orderData.orderId}
Child: ${orderData.childName}
Category: ${orderData.category}
Email: ${orderData.email}
Phone: ${orderData.phone}
Image: ${orderData.imageUrl}
Timestamp: ${orderData.timestamp}
Amount (cents): ${orderData.amount || 1000}
`
  const html = `
    <h2>New Order Received</h2>
    <ul>
      <li><strong>Order ID:</strong> ${orderData.orderId}</li>
      <li><strong>Child:</strong> ${orderData.childName}</li>
      <li><strong>Category:</strong> ${orderData.category}</li>
      <li><strong>Email:</strong> ${orderData.email}</li>
      <li><strong>Phone:</strong> ${orderData.phone}</li>
      <li><strong>Image:</strong> ${orderData.imageUrl}</li>
      <li><strong>Timestamp:</strong> ${orderData.timestamp}</li>
      <li><strong>Amount (cents):</strong> ${orderData.amount || 1000}</li>
    </ul>
  `

  return await sendEmail(ownerEmail, { subject, text, html })
}
