import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
        title: 'Xəta',
        description: 'Zəhmət olmasa bütün sahələri doldurun',
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
        let errorMessage = 'Xəta baş verdi';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email və ya şifrə yanlışdır';
        } else if (error.message.includes('User already registered')) {
          errorMessage = 'Bu email artıq qeydiyyatdan keçib';
        } else if (error.message.includes('Password should be at least 6 characters')) {
          errorMessage = 'Şifrə ən azı 6 simvol olmalıdır';
        }
        
        toast({
          title: 'Xəta',
          description: errorMessage,
          variant: 'destructive',
        });
      } else if (!isLogin) {
        toast({
          title: 'Uğurlu!',
          description: 'Qeydiyyat tamamlandı. Email hesabınızı yoxlayın.',
        });
        setIsLogin(true);
      }
    } catch (err) {
      toast({
        title: 'Xəta',
        description: 'Gözlənilməz xəta baş verdi',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isLogin ? 'Daxil ol' : 'Qeydiyyat'}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Hesabınıza daxil olun' 
              : 'Yeni hesab yaradın'
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
                placeholder="Email daxil edin"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Şifrə</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrə daxil edin"
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading 
                ? (isLogin ? 'Daxil olunur...' : 'Qeydiyyat olunur...') 
                : (isLogin ? 'Daxil ol' : 'Qeydiyyat ol')
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
                  ? 'Hesabınız yoxdur? Qeydiyyatdan keçin' 
                  : 'Hesabınız var? Daxil olun'
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