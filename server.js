// Simple Express server for payment API
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51RzFuKJAxTpcAzNAuYZZNnxiC9gUtRlPLwYzgIeHIEVZIz7LqOIWyCARWwJdPW9RnuIYtehRN23DknHZjgMRopwS007SQMcFsb');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create payment intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'eur' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      payment_method_types: ['card'], // Only enable card payments to reduce warnings
      metadata: {
        source: 'tea-store-checkout'
      }
    });

    res.json({
      client_secret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`🚀 Payment API server running on http://localhost:${port}`);
  console.log(`💳 Stripe test mode enabled`);
});