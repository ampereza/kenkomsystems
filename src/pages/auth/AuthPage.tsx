
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { EmailConfirmationHandler } from '@/components/auth/EmailConfirmationHandler';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Button } from '@/components/ui/button';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleAuthSuccess = () => {
    if (isSignUp) {
      setIsSignUp(false); // Switch to login view after successful signup
    } else {
      navigate(from);
    }
  };

  const handleAuthError = (error: { status?: number; message: string }) => {
    if (error.message === "Email not confirmed") {
      setEmail(email);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? 'Create Account' : 'Login'}</CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Enter your details below to create your account'
              : 'Enter your email below to login to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm
            isSignUp={isSignUp}
            onSuccess={handleAuthSuccess}
            onAuthError={handleAuthError}
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {isSignUp && (
            <Alert variant="default" className="bg-muted">
              <Info className="h-4 w-4" />
              <AlertDescription>
                New accounts are created with limited access. A manager will review and update your role.
              </AlertDescription>
            </Alert>
          )}
          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm"
          >
            {isSignUp
              ? 'Already have an account? Login'
              : "Don't have an account? Sign Up"}
          </Button>
        </CardFooter>
      </Card>
      <EmailConfirmationHandler email={email} />
    </div>
  );
}
