// Real Stripe API integration  
const API_BASE = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';
const STRIPE_API_BASE = 'https://api.stripe.com/v1';

interface PaymentIntentResponse {
  id?: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

// Create real payment intent via backend API
export async function createStripePaymentIntent(
  amount: number, 
  currency: string = 'eur'
): Promise<PaymentIntentResponse> {
  
  try {
    const response = await fetch(`${API_BASE}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.statusText}`);
    }

    const paymentIntent = await response.json();
    
    return paymentIntent;
    
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent. Please try again.');
  }
}

// Alternative: Mock implementation for development
export async function createMockPaymentIntent(
  amount: number, 
  currency: string = 'eur'
): Promise<PaymentIntentResponse> {
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock client secret and id with proper Stripe format but identifiable
  const timestamp = Date.now().toString().slice(-8);
  const randomId = Math.random().toString(36).substring(2, 8);
  const mockId = `pi_mock${timestamp}${randomId}`;
  const mockSecret = Math.random().toString(36).substring(2, 22);
  const mockClientSecret = `${mockId}_secret_${mockSecret}`;
  
  return {
    id: mockId,
    client_secret: mockClientSecret,
    amount: Math.round(amount * 100),
    currency: currency,
    status: 'requires_payment_method'
  };
}