import React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';

const Index = () => {
  return (
    <div className="bg-white flex flex-col overflow-hidden items-center">
      <Header />
      
      <main className="w-full flex flex-col items-center">
        <Hero />
        
        <div className="w-full py-6 md:py-8">
          <ProductGrid />
        </div>
      </main>
    </div>
  );
};

export default Index;
