import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

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
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        let errorMessage = "An error occurred";
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email or password is incorrect";
        } else if (error.message.includes("User already registered")) {
          errorMessage = "This email is already registered";
        } else if (error.message.includes("Password should be at least 6 characters")) {
          errorMessage = "Password must be at least 6 characters";
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (!isLogin) {
        toast({
          title: "Success!",
          description: "Registration completed. Check your email.",
        });
        setIsLogin(true);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Unexpected error occurred",
        variant: "destructive",
      });
    } finally {
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
              ? "Sign in to your account" 
              : "Create a new account"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
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

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading 
                ? (isLogin ? "Signing in..." : "Signing up...") 
                : (isLogin ? "Sign In" : "Sign Up")
              }
            </Button>

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