import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const success = await forgotPassword(email);
    setIsSubmitting(false);

    if (success) {
      setIsSent(true);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-secondary/30 to-background min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md shadow-2xl border border-primary/10 backdrop-blur-sm bg-card/90">
          {!isSent ? (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-3xl font-extrabold text-center tracking-tight text-primary flex items-center justify-center gap-2">
                  <KeyRound className="h-6 w-6" /> Reset Password
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  Enter your email address and we'll send you a link to reset your password
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 font-medium">
                      <Mail className="h-4 w-4 text-muted-foreground" /> Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="focus-visible:ring-primary border-primary/20"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full font-bold shadow-md hover:shadow-lg transition-all" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                  <div className="text-center text-sm">
                    <Link to="/login" className="text-muted-foreground hover:text-primary flex items-center justify-center gap-1 font-medium transition-colors">
                      <ArrowLeft className="h-4 w-4" /> Back to Login
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </>
          ) : (
            <>
              <CardContent className="pt-8 pb-6 flex flex-col items-center text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-primary animate-bounce" />
                <CardTitle className="text-2xl font-bold text-primary">Check Your Email</CardTitle>
                <CardDescription className="text-base text-muted-foreground px-4">
                  We have sent a secure password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
                </CardDescription>
              </CardContent>
              <CardFooter className="pb-8">
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full font-bold">
                    Return to Login
                  </Button>
                </Link>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
