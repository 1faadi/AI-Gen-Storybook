# Storybook Website - Stripe Payment Integration

This project now includes a complete Stripe payment integration for processing storybook orders.

## Features

- ✅ Real Stripe Checkout integration
- ✅ Secure payment processing
- ✅ Webhook handling for payment confirmation
- ✅ Order tracking and management
- ✅ Error handling and user feedback
- ✅ Local file uploads (no Vercel Blob dependency)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Stripe Configuration

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. Copy `env.template` to `.env.local` and fill in your Stripe keys:

```bash
cp env.template .env.local
```

Update `.env.local` with your actual Stripe keys:
```
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Webhook Setup

1. In your Stripe Dashboard, go to **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
   - For local development: `https://your-ngrok-url.ngrok.io/api/webhooks/stripe`
4. Select these events to listen for:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `checkout.session.expired`
5. Copy the webhook signing secret to your `.env.local` file

### 4. Run the Application

```bash
npm run dev
```

## API Endpoints

### Payment Processing
- `POST /api/create-checkout-session` - Creates a Stripe checkout session
- `GET /api/checkout-session/[sessionId]` - Retrieves session details
- `POST /api/webhooks/stripe` - Handles Stripe webhooks

### File Upload
- `POST /api/upload` - Uploads files locally (no external dependencies)

## Payment Flow

1. User creates a storybook order on `/create`
2. User proceeds to `/payment` with order data
3. Clicking "Pay with Stripe" creates a checkout session
4. User is redirected to Stripe Checkout
5. After successful payment, user is redirected to `/payment/success`
6. Webhook confirms payment and processes the order

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `STRIPE_SECRET_KEY` | Stripe secret key (starts with sk_) | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (starts with pk_) | Yes |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (starts with whsec_) | Yes |
| `NEXT_PUBLIC_BASE_URL` | Your application's base URL | Yes |

## Testing

Use Stripe's test mode for development:
- Test card numbers: `4242 4242 4242 4242`
- Use any future expiry date and any 3-digit CVC
- Use any email address

## Production Deployment

1. Switch to live mode in Stripe Dashboard
2. Update environment variables with live keys
3. Update webhook endpoint URL to production domain
4. Test the complete payment flow

## Security Notes

- Never expose your secret key in client-side code
- Always verify webhook signatures
- Use HTTPS in production
- Validate all incoming data
- Store sensitive data securely

## Troubleshooting

### Common Issues

1. **"No token found" error**: Check your `STRIPE_SECRET_KEY` is set correctly
2. **Webhook signature verification failed**: Verify your `STRIPE_WEBHOOK_SECRET`
3. **Session not found**: Ensure the session ID is valid and not expired
4. **Payment failed**: Check Stripe Dashboard for detailed error logs

### Debug Mode

Enable debug logging by setting:
```
NODE_ENV=development
```

This will log detailed information about payment processing and webhook events.
