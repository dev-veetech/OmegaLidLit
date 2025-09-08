# LidLit Stripe Backend Service

This is the backend service for handling Stripe payments in the LidLit React Native app.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Stripe Keys
1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Secret Key** (starts with `sk_test_` for test mode)
3. Edit the `.env` file and replace the placeholder with your actual key:
```bash
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
```

### 3. Start the Server
```bash
# For development (auto-restart on changes)
npm run dev

# Or for production
npm start
```

The server will run on `http://localhost:3000`

### 4. Test the Server
Visit `http://localhost:3000/api/health` to verify it's working.

## API Endpoints

### `GET /api/health`
Health check endpoint to verify server status.

### `POST /api/create-payment-intent`
Creates a new Stripe payment intent.

**Request Body:**
```json
{
  "amount": 5999,
  "currency": "usd",
  "productId": "prod_SrRzE1tKHvkVls",
  "productType": "hat",
  "metadata": {
    "custom_field": "value"
  }
}
```

### `POST /api/confirm-payment`
Confirms a payment intent with a payment method.

**Request Body:**
```json
{
  "client_secret": "pi_xxx_secret_xxx",
  "payment_method_id": "pm_xxx",
  "payment_method_type": "card"
}
```

### `GET /api/payment-status/:payment_intent_id`
Retrieves the current status of a payment intent.

## Environment Variables

- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (optional)
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## Security Notes

⚠️ **Important**: This backend handles sensitive Stripe operations and should be deployed securely:

1. **Never expose your Stripe secret key** in frontend code
2. **Use HTTPS in production**
3. **Implement proper authentication** for production use
4. **Validate all input parameters**
5. **Set up proper logging and monitoring**

## Troubleshooting

### "Stripe key not configured"
- Check that your `.env` file has the correct `STRIPE_SECRET_KEY`
- Restart the server after changing environment variables

### CORS errors from React Native
- Add your device's IP address to `ALLOWED_ORIGINS` in `.env`
- For local development, use your computer's local IP address

### Payment intent creation fails
- Verify your Stripe account is active
- Check that the product IDs match your Stripe dashboard
- Ensure amounts are in cents and meet Stripe's minimum requirements

## Testing with React Native

Your React Native app should now be able to create real payment intents by calling:
```
http://localhost:3000/api/create-payment-intent
```

Make sure to update your frontend to use `http://localhost:3000/api` as the base URL instead of the mock URL.