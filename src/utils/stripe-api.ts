// Real Stripe API integration via backend
const API_BASE = 'http://localhost:3001/api';

interface PaymentIntentResponse {
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
  
  // Mock client secret
  const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;
  
  return {
    client_secret: mockClientSecret,
    amount: Math.round(amount * 100),
    currency: currency,
    status: 'requires_payment_method'
  };
}