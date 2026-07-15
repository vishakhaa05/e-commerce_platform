import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout.js';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
  const { verifyEmail } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');

  const token = searchParams.get('token');

  useEffect(() => {
    const triggerVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing from the link.');
        return;
      }

      try {
        const success = await verifyEmail(token);
        if (success) {
          setStatus('success');
          setMessage('Your email address has been successfully verified.');
        } else {
          setStatus('error');
          setMessage('The verification link is invalid or has expired.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('An error occurred during verification.');
      }
    };

    triggerVerification();
  }, [token]);

  return (
    <Layout>
      <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-secondary/30 to-background min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md shadow-2xl border border-primary/10 backdrop-blur-sm bg-card/90">
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-2xl font-bold tracking-tight text-primary">
              Account Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            {status === 'loading' && (
              <>
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-base text-muted-foreground">{message}</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle2 className="h-16 w-16 text-primary animate-bounce" />
                <p className="text-base font-medium text-foreground px-4">{message}</p>
                <CardDescription>
                  You can now log in to access your dashboard.
                </CardDescription>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="h-16 w-16 text-destructive animate-pulse" />
                <p className="text-base font-medium text-destructive px-4">{message}</p>
                <CardDescription>
                  Please try registering again or contact support for help.
                </CardDescription>
              </>
            )}
          </CardContent>
          <CardFooter className="pb-8">
            {status !== 'loading' && (
              <Button
                onClick={() => navigate('/login')}
                className="w-full font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                Go to Login <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
