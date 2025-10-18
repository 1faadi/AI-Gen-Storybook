# Stripe Webhook Setup Guide

## 🎯 Current Status
✅ **Payment System**: Working perfectly (I can see successful payments in your logs!)  
✅ **Webhook Handler**: Already implemented in `/api/webhooks/stripe`  
⚠️ **Webhook Secret**: Needs to be configured  
⚠️ **Stripe CLI**: Not installed (needed for local testing)  

## 🚀 Quick Setup Options

### Option 1: Install Stripe CLI (Recommended)

**For Windows:**

1. **Download Stripe CLI**
   - Go to: https://github.com/stripe/stripe-cli/releases
   - Download the latest Windows version (stripe_X.X.X_windows_x86_64.zip)
   - Extract to a folder (e.g., `C:\stripe-cli\`)

2. **Add to PATH**
   - Add `C:\stripe-cli\` to your Windows PATH environment variable
   - Or run from the extracted folder

3. **Login to Stripe**
   ```bash
   stripe login
   ```

4. **Forward webhooks to your local server**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

5. **Copy the webhook secret** from the CLI output and update `.env.local`

### Option 2: Manual Webhook Setup (Alternative)

1. **Go to Stripe Dashboard**
   - Visit: https://dashboard.stripe.com/test/webhooks
   - Click "Add endpoint"

2. **Configure Webhook**
   - Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
   - For local testing: Use ngrok or similar tunneling service

3. **Select Events**
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `checkout.session.expired`

4. **Copy webhook secret** to `.env.local`

## 🔧 Environment Configuration

Update your `.env.local` file with the webhook secret:

```bash
# Current (placeholder)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Replace with actual webhook secret from Stripe CLI or Dashboard
STRIPE_WEBHOOK_SECRET=whsec_actual_secret_from_stripe
```

## 🧪 Testing Webhooks

### Method 1: Using Stripe CLI (Easiest)

1. **Start webhook forwarding**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

2. **Make a test payment** using your app

3. **Watch webhook events** in the CLI terminal

### Method 2: Manual Testing

1. **Make a test payment** through your app
2. **Check Stripe Dashboard** → Webhooks → Your endpoint
3. **View delivery logs** to see webhook events

## 📊 What Webhooks Handle

Your webhook handler (`/api/webhooks/stripe`) processes:

- ✅ **Payment Success**: `checkout.session.completed`
- ❌ **Payment Failed**: `payment_intent.payment_failed`  
- ⏰ **Session Expired**: `checkout.session.expired`

## 🔍 Monitoring Webhooks

### Check Server Logs
Watch your `npm run dev` terminal for webhook processing logs.

### Check Stripe Dashboard
- Go to: https://dashboard.stripe.com/test/webhooks
- Click on your webhook endpoint
- View "Recent deliveries" tab

## 🚨 Troubleshooting

### Common Issues

1. **"Webhook signature verification failed"**
   - Update `STRIPE_WEBHOOK_SECRET` with correct value
   - Restart your development server

2. **"Webhook not receiving events"**
   - Check webhook URL is correct
   - Verify webhook is enabled in Stripe Dashboard
   - Use Stripe CLI for local testing

3. **"Invalid signature"**
   - Ensure webhook secret matches exactly
   - Check for extra spaces or characters

## 🎉 Ready to Test!

Your webhook handler is already implemented and ready. Once you:

1. Install Stripe CLI
2. Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Update the webhook secret in `.env.local`
4. Restart your server

You'll have full webhook functionality! 🚀

## 📝 Next Steps

1. **Install Stripe CLI** (see Option 1 above)
2. **Start webhook forwarding**
3. **Update webhook secret**
4. **Test a payment** and watch webhook events
5. **Verify email notifications** are sent

Your payment system is already working great - webhooks will complete the integration! ✨
