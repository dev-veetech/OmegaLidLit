const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Stripe with your secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(express.json());

// CORS configuration for React Native
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:8081',
      'http://192.168.1.100:8081',
      'exp://192.168.1.100:8081'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    stripe_configured: !!process.env.STRIPE_SECRET_KEY
  });
});

// Create Payment Intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    console.log('🚀 Creating payment intent...');
    console.log('📊 Request body:', req.body);
    
    const { amount, currency = 'usd', productId, productType, metadata = {} } = req.body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount. Amount must be greater than 0.' 
      });
    }

    // Validate amount (Stripe requires amounts in cents and minimum $0.50)
    const amountInCents = Math.round(amount);
    if (amountInCents < 50) {
      return res.status(400).json({ 
        error: 'Amount too small. Minimum amount is $0.50 USD.' 
      });
    }

    console.log('💰 Amount in cents:', amountInCents);
    console.log('🏷️ Product ID:', productId);
    console.log('📝 Product Type:', productType);

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
      metadata: {
        product_id: productId || 'unknown',
        product_type: productType || 'unknown',
        amount_dollars: (amountInCents / 100).toString(),
        created_at: new Date().toISOString(),
        ...metadata
      },
      description: `LidLit ${productType === 'hat' ? 'Hat' : 'Custom Token'} Purchase`,
    });

    console.log('✅ Payment intent created:', paymentIntent.id);
    console.log('🔑 Client secret:', paymentIntent.client_secret?.substring(0, 20) + '...');

    res.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret,
        metadata: paymentIntent.metadata
      }
    });

  } catch (error) {
    console.error('❌ Error creating payment intent:', error.message);
    
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      message: error.message,
      type: error.type || 'api_error'
    });
  }
});

// ⚠️ DEPRECATED: Insecure endpoint removed for security
// This endpoint accepted raw card data which violates PCI compliance
// Use the secure payment flow with Stripe Elements instead

// Confirm Payment Intent endpoint (Secure)
// This endpoint is used when payments are already confirmed via Stripe Elements
// It mainly retrieves the payment status for backend verification
app.post('/api/confirm-payment', async (req, res) => {
  try {
    console.log('✅ Verifying secure payment...');
    const { client_secret, payment_method_id, payment_method_type } = req.body;

    if (!client_secret) {
      return res.status(400).json({ 
        error: 'client_secret is required' 
      });
    }

    // Extract payment intent ID from client secret
    const paymentIntentId = client_secret.split('_secret_')[0];
    console.log('🔍 Payment Intent ID:', paymentIntentId);
    console.log('💳 Payment Method:', payment_method_id || 'Handled by Stripe Elements');
    console.log('📱 Payment Type:', payment_method_type);

    // Retrieve the payment intent to verify its status
    // (Payment was already confirmed on the frontend via Stripe Elements)
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    console.log('✅ Payment status verified:', paymentIntent.id);
    console.log('📊 Status:', paymentIntent.status);
    console.log('💰 Amount received:', paymentIntent.amount_received / 100);

    res.json({
      success: paymentIntent.status === 'succeeded',
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount_received: paymentIntent.amount_received,
      error: paymentIntent.last_payment_error?.message || null,
      message: 'Payment processed securely via Stripe Elements'
    });

  } catch (error) {
    console.error('❌ Error verifying payment:', error.message);
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to verify payment',
      message: error.message,
      type: error.type || 'api_error'
    });
  }
});

// Get payment status endpoint
app.get('/api/payment-status/:payment_intent_id', async (req, res) => {
  try {
    const { payment_intent_id } = req.params;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
    
    res.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata
    });

  } catch (error) {
    console.error('❌ Error retrieving payment status:', error.message);
    
    res.status(500).json({ 
      error: 'Failed to retrieve payment status',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 LidLit Stripe Backend Server Started');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔑 Stripe configured: ${!!process.env.STRIPE_SECRET_KEY}`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`  GET  http://localhost:${PORT}/api/health`);
  console.log(`  POST http://localhost:${PORT}/api/create-payment-intent`);
  console.log(`  POST http://localhost:${PORT}/api/confirm-payment`);
  console.log(`  GET  http://localhost:${PORT}/api/payment-status/:id`);
  console.log('');
});