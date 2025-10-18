# Stripe Payment System Testing Guide

## 🎯 Overview
This guide will help you test your Stripe payment integration to ensure payments are being processed correctly.

## 📋 Current Configuration Status
✅ **Stripe Keys**: Configured with test keys  
✅ **Payment Page**: Implemented at `/payment`  
✅ **Checkout Session**: API endpoint ready  
✅ **Webhook Handler**: Implemented  
⚠️ **Webhook Secret**: Needs to be updated (currently placeholder)  
✅ **Email Service**: Configured with Gmail  

## 🧪 Testing Methods

### Method 1: Manual Testing (Recommended for Quick Test)

1. **Start the Application**
   ```bash
   npm run dev
   ```

2. **Navigate to Create Page**
   - Go to `http://localhost:3000/create`
   - Fill out the form with test data:
     - Child Name: "Test Child"
     - Email: "test@example.com"
     - Phone: "123-456-7890"
     - Upload any image
     - Select any story category

3. **Proceed to Payment**
   - Click "Create My Storybook"
   - You'll be redirected to `/payment`

4. **Test Payment**
   - Click "Pay with Stripe - $10.00"
   - Use Stripe test card: `4242 4242 4242 4242`
   - Use any future expiry date (e.g., 12/25)
   - Use any 3-digit CVC (e.g., 123)
   - Use any email address

5. **Verify Success**
   - You should be redirected to `/payment/success`
   - Check browser console for any errors
   - Check server logs for payment processing

### Method 2: API Testing (Advanced)

Test the API endpoints directly:

```bash
# Test checkout session creation
curl -X POST http://localhost:3000/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "orderData": {
      "childName": "Test Child",
      "email": "test@example.com",
      "phone": "123-456-7890",
      "category": "jungle",
      "imageUrl": "/placeholder.svg",
      "timestamp": "2024-01-01T00:00:00.000Z"
    },
    "amount": 1000
  }'
```

### Method 3: Webhook Testing (For Complete Flow)

1. **Install Stripe CLI** (for webhook testing)
   ```bash
   # Download from: https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe**
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copy the webhook secret** from the CLI output and update `.env.local`

## 🔍 What to Check During Testing

### ✅ Success Indicators
- [ ] Payment page loads correctly
- [ ] Stripe checkout redirects properly
- [ ] Test payment completes successfully
- [ ] Success page displays
- [ ] No console errors
- [ ] Server logs show successful processing

### ❌ Common Issues & Solutions

1. **"Stripe publishable key is not set"**
   - Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local`

2. **"Failed to create checkout session"**
   - Check `STRIPE_SECRET_KEY` in `.env.local`
   - Verify Stripe account is active

3. **Webhook signature verification failed**
   - Update `STRIPE_WEBHOOK_SECRET` with actual webhook secret
   - Use Stripe CLI for local testing

4. **Payment fails**
   - Check Stripe Dashboard for error details
   - Verify test card numbers are correct

## 🧪 Test Card Numbers

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Declined card |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0069` | Expired card |

## 📊 Monitoring & Debugging

### Browser Console
Check for JavaScript errors during payment flow.

### Server Logs
Monitor the terminal running `npm run dev` for:
- Checkout session creation logs
- Webhook processing logs
- Email sending logs

### Stripe Dashboard
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/payments)
2. Check "Payments" section for test transactions
3. Check "Webhooks" section for delivery status

## 🚀 Next Steps After Testing

1. **If tests pass**: Your payment system is working correctly!
2. **If tests fail**: Check the troubleshooting section above
3. **For production**: Switch to live Stripe keys and update webhook URLs

## 📝 Test Results Template

```
Test Date: ___________
Tester: ___________

✅ Payment Page Loads: Yes/No
✅ Checkout Session Created: Yes/No  
✅ Stripe Redirect Works: Yes/No
✅ Test Payment Completes: Yes/No
✅ Success Page Shows: Yes/No
✅ No Console Errors: Yes/No
✅ Server Logs Clean: Yes/No

Issues Found:
- 

Notes:
- 
```

## 🔧 Quick Fixes

### Update Webhook Secret
1. Install Stripe CLI
2. Run: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Copy the webhook secret from output
4. Update `STRIPE_WEBHOOK_SECRET` in `.env.local`
5. Restart the development server

### Reset Environment
If you need to reset your environment:
```bash
# Copy template to new file
cp env.template .env.local.new

# Update with your actual Stripe keys
# Then replace the old file
mv .env.local.new .env.local
```

---

**Ready to test?** Start with Method 1 (Manual Testing) for the quickest way to verify your payment system is working!
