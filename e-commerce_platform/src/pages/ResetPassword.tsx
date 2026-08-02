import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    if (!token) {
      toast.error('Reset token is missing from URL.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await resetPassword(token, password);
      if (success) {
        setIsDone(true);
      }
    } catch (err) {
      console.error('Reset password request failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-secondary/30 to-background min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md shadow-2xl border border-primary/10 backdrop-blur-sm bg-card/90">
          {!isDone ? (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-3xl font-extrabold text-center tracking-tight text-primary flex items-center justify-center gap-2">
                  <Lock className="h-6 w-6" /> Set New Password
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  Choose a new strong password for your BigMarket account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2 font-medium">
                      <Lock className="h-4 w-4 text-muted-foreground" /> New Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minimum 6 characters"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="focus-visible:ring-primary border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2 font-medium">
                      <Lock className="h-4 w-4 text-muted-foreground" /> Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="focus-visible:ring-primary border-primary/20"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full font-bold shadow-md hover:shadow-lg transition-all" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </>
          ) : (
            <>
              <CardContent className="pt-8 pb-6 flex flex-col items-center text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-primary" />
                <CardTitle className="text-2xl font-bold text-primary">Password Updated</CardTitle>
                <CardDescription className="text-base text-muted-foreground px-4">
                  Your password has been successfully updated. You can now use your new password to sign in.
                </CardDescription>
              </CardContent>
              <CardFooter className="pb-8">
                <Button onClick={() => navigate('/login')} className="w-full font-bold flex items-center justify-center gap-2">
                  Proceed to Login <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default ResetPassword;
