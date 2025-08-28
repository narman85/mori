import React, { useState, useEffect } from 'react';
import { db } from '../lib/database';

export const TestConnection = () => {
  const [status, setStatus] = useState<string>('Testing connection...');
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Turso connection...');
        const fetchedProducts = await db.getProducts();
        setProducts(fetchedProducts);
        setStatus(`✅ Connected! Found ${fetchedProducts.length} products`);
      } catch (error) {
        console.error('Connection failed:', error);
        setStatus(`❌ Connection failed: ${error.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', margin: '20px' }}>
      <h2>Database Connection Test</h2>
      <p>{status}</p>
      
      {products.length > 0 && (
        <div>
          <h3>Products:</h3>
          <ul>
            {products.map(product => (
              <li key={product.id}>
                {product.name} - ${product.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};