import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useUser, useSignIn, useSignUp, useClerk } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const { isSignedIn, user: clerkUser } = useUser();
  const { signIn: clerkSignIn, isLoaded: signInLoaded, setActive } = useSignIn();
  const { signUp: clerkSignUp, isLoaded: signUpLoaded } = useSignUp();
  const clerk = useClerk();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for OAuth completion parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('oauth_completed') === 'true') {
      toast({
        title: "Google OAuth Detected",
        description: "Please sign in with your existing account to continue",
        variant: 'default',
      });
    }
  }, [toast]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user || isSignedIn) {
      navigate('/');
    }
  }, [user, isSignedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      if (isLogin) {
        // Use Clerk for sign in
        if (!clerkSignIn || !signInLoaded) return;
        
        const result = await clerkSignIn.create({
          identifier: email,
          password,
        });

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          toast({
            title: "Success!",
            description: "Successfully signed in!",
          });
          navigate('/');
        }
      } else {
        // Use Clerk for sign up
        if (!clerkSignUp || !signUpLoaded) return;
        
        const result = await clerkSignUp.create({
          emailAddress: email,
          password,
        });

        if (result.status === 'complete') {
          await clerk.setActive({ session: result.createdSessionId });
          toast({
            title: "Success!",
            description: "Account created successfully!",
          });
          navigate('/');
        } else if (result.status === 'missing_requirements') {
          // Handle email verification if required
          await result.prepareEmailAddressVerification({ strategy: 'email_code' });
          toast({
            title: "Check your email",
            description: "Please verify your email to complete registration.",
          });
        }
      }
    } catch (err: any) {
      console.log('Full Clerk error:', err);
      let errorMessage = "An error occurred";
      
      if (err.errors && err.errors[0]) {
        errorMessage = err.errors[0].longMessage || err.errors[0].message;
        console.log('Clerk error details:', err.errors[0]);
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    
    try {
      if (!clerkSignIn || !signInLoaded) return;
      
      await clerkSignIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: window.location.origin + '/sso-callback',
        redirectUrlComplete: window.location.origin + '/',
      });
    } catch (error: any) {
      console.error('Google auth error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md relative">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 z-10 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        
        <CardHeader className="text-center pt-12">
          <CardTitle className="text-2xl font-bold">
            {isLogin ? "Sign In" : "Sign Up"}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? "" 
              : "Create a new account"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Google OAuth Button */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => handleGoogleAuth()}
              className="bg-[rgba(226,226,226,1)] w-full flex items-center justify-center gap-3 text-base text-black font-normal p-4 border-[rgba(209,209,209,1)] border hover:bg-[rgba(216,216,216,1)] transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[rgba(226,226,226,1)] w-full flex items-center justify-center gap-2 text-base text-black font-normal p-4 border-[rgba(209,209,209,1)] border-t hover:bg-[rgba(216,216,216,1)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {loading 
                  ? (isLogin ? "Signing in..." : "Signing up...") 
                  : (isLogin ? "Sign In" : "Sign Up")
                }
              </span>
            </button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                disabled={loading}
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Have an account? Sign in"
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;