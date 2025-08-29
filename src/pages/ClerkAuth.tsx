import React from 'react';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ClerkAuth = () => {
  const { isSignedIn } = useAuth();

  // Redirect to home if already signed in
  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Welcome to Mori Tea</h1>
          
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none p-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "w-full border border-gray-300 hover:bg-gray-50",
                    formButtonPrimary: "bg-black hover:bg-gray-800 text-white",
                    footerActionLink: "text-black hover:underline",
                    formFieldInput: "border-gray-300 focus:border-black focus:ring-black",
                    dividerLine: "bg-gray-200",
                    dividerText: "text-gray-500",
                  },
                }}
                redirectUrl="/"
                routing="path"
                path="/auth"
              />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignUp 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none p-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "w-full border border-gray-300 hover:bg-gray-50",
                    formButtonPrimary: "bg-black hover:bg-gray-800 text-white",
                    footerActionLink: "text-black hover:underline",
                    formFieldInput: "border-gray-300 focus:border-black focus:ring-black",
                    dividerLine: "bg-gray-200",
                    dividerText: "text-gray-500",
                  },
                }}
                redirectUrl="/"
                routing="path"
                path="/auth"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClerkAuth;