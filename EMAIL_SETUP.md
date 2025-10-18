# Email Service Configuration Guide

This guide will help you set up email notifications for your storybook website using Gmail SMTP.

## 🚀 Quick Setup (Gmail)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" as the app
3. Select "Other" as the device and enter "Storybook Website"
4. Copy the generated 16-character password

### Step 3: Configure Environment Variables
1. Copy `env.template` to `.env.local`
2. Update the email configuration:

```bash
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password
EMAIL_FROM=your_gmail_address@gmail.com
```

### Step 4: Test Email Service
```bash
# Test with your email address
curl "http://localhost:3000/api/send-email?email=your_email@example.com"
```

## 📧 Email Templates

The system includes three email templates:

### 1. Order Confirmation Email
- Sent when payment is successful
- Includes order details and child's photo
- Beautiful HTML design with responsive layout

### 2. Storybook Delivery Email
- Sent when storybook is ready for download
- Includes download link
- Reading tips and instructions

### 3. Payment Failed Email
- Sent when payment fails
- Includes retry instructions
- Helpful troubleshooting tips

## 🔧 API Endpoints

### Send Email
```bash
POST /api/send-email
Content-Type: application/json

{
  "orderData": {
    "childName": "Emma",
    "category": "superman",
    "email": "parent@example.com",
    "phone": "123-456-7890",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "orderId": "storybook_1234567890_abc123",
    "imageUrl": "/uploads/storybook-1234567890.jpg"
  },
  "emailType": "order_confirmation"
}
```

### Test Email
```bash
GET /api/send-email?email=test@example.com
```

## 🎨 Customizing Email Templates

Email templates are located in `lib/email-service.ts`. You can customize:

- **Colors and styling** - Update CSS in the HTML templates
- **Content** - Modify the text and structure
- **Images** - Add your logo or branding
- **Layout** - Change the responsive design

## 🔄 Integration with Stripe

The email service is automatically integrated with Stripe webhooks:

- **Payment Success** → Order confirmation email sent
- **Payment Failed** → Payment failed email sent
- **Session Expired** → No email (handled in webhook)

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid login" error**
   - Check your Gmail address is correct
   - Verify you're using App Password, not regular password
   - Ensure 2FA is enabled

2. **"Less secure app access" error**
   - Use App Passwords instead of regular passwords
   - Don't enable "less secure app access"

3. **Emails not sending**
   - Check your internet connection
   - Verify environment variables are set correctly
   - Check server logs for detailed error messages

4. **Emails going to spam**
   - Use a custom domain email address
   - Set up SPF and DKIM records
   - Consider using a professional email service

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

This will log detailed information about email sending attempts.

## 🔒 Security Best Practices

1. **Never commit email credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate App Passwords** regularly
4. **Monitor email sending** for unusual activity
5. **Use HTTPS** in production

## 📊 Monitoring

Monitor email delivery through:
- Server logs
- Gmail sent folder
- Stripe webhook logs
- Application error logs

## 🚀 Production Deployment

For production, consider upgrading to:
- **SendGrid** - Professional email service
- **Mailgun** - Developer-friendly email API
- **AWS SES** - Scalable email service
- **Custom SMTP** - Your own email server

## 📝 Email Service Alternatives

### SendGrid
```bash
npm install @sendgrid/mail
```

### Mailgun
```bash
npm install mailgun-js
```

### AWS SES
```bash
npm install aws-sdk
```

Update the email service configuration in `lib/email-service.ts` to use your preferred provider.

## 🎯 Next Steps

1. **Set up your Gmail App Password**
2. **Configure environment variables**
3. **Test the email service**
4. **Customize email templates**
5. **Deploy to production**

Your email service is now ready to send beautiful, professional emails to your customers! 🎉
