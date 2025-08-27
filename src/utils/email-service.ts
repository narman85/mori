interface OrderEmailData {
  customerEmail: string;
  customerName: string;
  orderId: string;
  orderTotal: number;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
}

export const sendOrderConfirmationEmail = async (orderData: OrderEmailData): Promise<boolean> => {
  try {
    console.log('📧 Sending order confirmation email to:', orderData.customerEmail);
    
    // Format order items for email
    const itemsText = orderData.orderItems.map(item => 
      `${item.name} x${item.quantity} - €${item.price.toFixed(2)}`
    ).join('\n');
    
    // Create email content
    const emailContent = {
      to: orderData.customerEmail,
      subject: `Order Confirmation #${orderData.orderId} - Mori Tea Store`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #333; margin: 0;">Order Confirmation</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Dear ${orderData.customerName},</p>
            
            <p>Thank you for your order! We've received your order and it's being processed.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #333;">Order Details</h3>
              <p><strong>Order ID:</strong> ${orderData.orderId}</p>
              <p><strong>Total:</strong> €${orderData.orderTotal.toFixed(2)}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #333;">Items Ordered:</h3>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                ${orderData.orderItems.map(item => `
                  <div style="border-bottom: 1px solid #ddd; padding: 10px 0; last-child:border-bottom: none;">
                    <strong>${item.name}</strong><br>
                    Quantity: ${item.quantity} × €${item.price.toFixed(2)} = €${(item.quantity * item.price).toFixed(2)}
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #333;">Shipping Address:</h3>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                ${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}<br>
                ${orderData.shippingAddress.address}<br>
                ${orderData.shippingAddress.city}, ${orderData.shippingAddress.postalCode}<br>
                ${orderData.shippingAddress.country}<br>
                Phone: ${orderData.shippingAddress.phone}
              </div>
            </div>
            
            <div style="margin: 30px 0; padding: 20px; background-color: #e3f2fd; border-radius: 5px;">
              <p style="margin: 0; color: #1565c0;">
                <strong>What's Next?</strong><br>
                We'll send you another email with tracking information once your order ships.
                Expected delivery: 3-5 business days.
              </p>
            </div>
            
            <p>If you have any questions about your order, please don't hesitate to contact us.</p>
            
            <p>Thank you for choosing Mori Tea Store!</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              This is an automated message from Mori Tea Store. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    };

    // Send via EmailJS or similar service
    // For now, we'll use a simple API endpoint (you'll need to set this up)
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailContent)
    });

    if (response.ok) {
      console.log('✅ Order confirmation email sent successfully');
      return true;
    } else {
      console.error('❌ Failed to send email:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return false;
  }
};

// Using EmailJS for client-side email sending
import emailjs from '@emailjs/browser';

// Initialize EmailJS with public key
const initEmailJS = () => {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (publicKey && publicKey !== 'demo_key') {
    emailjs.init(publicKey);
    console.log('✅ EmailJS initialized');
  }
};

// Initialize on module load
initEmailJS();

export const sendOrderConfirmationEmailJS = async (orderData: OrderEmailData): Promise<boolean> => {
  try {
    // Get EmailJS configuration from environment variables
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_demo';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_demo';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'demo_key';
    
    const templateParams = {
      to_email: orderData.customerEmail,
      customer_name: orderData.customerName,
      order_id: orderData.orderId,
      order_total: orderData.orderTotal.toFixed(2),
      items_list: orderData.orderItems.map(item => 
        `${item.name} x${item.quantity} - €${item.price.toFixed(2)} = €${(item.quantity * item.price).toFixed(2)}`
      ).join('\n'),
      shipping_address: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}\n${orderData.shippingAddress.address}\n${orderData.shippingAddress.city}, ${orderData.shippingAddress.postalCode}\n${orderData.shippingAddress.country}\nPhone: ${orderData.shippingAddress.phone}`,
      items_html: orderData.orderItems.map(item => 
        `<div style="border-bottom: 1px solid #ddd; padding: 8px 0;"><strong>${item.name}</strong><br>Quantity: ${item.quantity} × €${item.price.toFixed(2)} = €${(item.quantity * item.price).toFixed(2)}</div>`
      ).join(''),
    };

    console.log('📧 Sending email with EmailJS...', {
      serviceId,
      templateId,
      to: orderData.customerEmail,
      orderId: orderData.orderId
    });

    // For demo purposes, always return success if no EmailJS credentials
    if (serviceId === 'service_demo' || templateId === 'template_demo' || publicKey === 'demo_key') {
      console.log('📧 EmailJS not configured, logging email data:', templateParams);
      
      // Show a nice console message that looks like an email
      console.log(`
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        📧 ORDER CONFIRMATION EMAIL
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        To: ${orderData.customerEmail}
        Subject: Order Confirmation #${orderData.orderId}
        
        Dear ${orderData.customerName},
        
        Thank you for your order!
        
        Order ID: ${orderData.orderId}
        Total: €${orderData.orderTotal.toFixed(2)}
        
        Items:
        ${templateParams.items_list}
        
        Shipping Address:
        ${templateParams.shipping_address}
        
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
      
      return true;
    }

    // Send actual email if EmailJS is configured
    const result = await emailjs.send(
      serviceId,
      templateId, 
      templateParams,
      publicKey
    );
    
    console.log('✅ Email sent via EmailJS:', result.text);
    return true;
  } catch (error) {
    console.error('❌ Error sending email via EmailJS:', error);
    return false;
  }
};