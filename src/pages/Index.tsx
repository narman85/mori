import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="bg-white flex flex-col overflow-hidden items-center">
      <Header />
      
      <main className="w-full flex flex-col items-center">
        <Hero />
        
        {/* Auth section */}
        <div className="w-full max-w-7xl px-4 py-8 flex justify-center">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Xoş gəlmisiniz: {user.email}
              </span>
              <Button onClick={signOut} variant="outline">
                Çıxış
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button>Daxil ol</Button>
            </Link>
          )}
        </div>
        
        <ProductGrid />
      </main>
    </div>
  );
};

export default Index;
