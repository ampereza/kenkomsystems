
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useSearchParams } from 'react-router-dom';

interface EmailConfirmationHandlerProps {
  email?: string;
}

export function EmailConfirmationHandler({ email: propEmail }: EmailConfirmationHandlerProps) {
  const [searchParams] = useSearchParams();
  const [resendTimeout, setResendTimeout] = useState(false);
  const { toast } = useToast();
  
  // Get email from props or from URL search params
  const email = propEmail || searchParams.get('email') || '';

  async function handleEmailConfirmation() {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No email provided for confirmation.",
      });
      return;
    }

    if (!resendTimeout) {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (resendError) {
        if (resendError.status === 429) {
          const waitSeconds = resendError.message.match(/\d+/)?.[0] || '60';
          toast({
            variant: "destructive",
            title: "Please wait",
            description: `You can request another confirmation email in ${waitSeconds} seconds.`,
          });
          setResendTimeout(true);
          setTimeout(() => setResendTimeout(false), parseInt(waitSeconds) * 1000);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Error resending confirmation email. Please try again later.",
          });
        }
      } else {
        toast({
          title: "Confirmation email sent",
          description: "Please check your email to confirm your account. We've sent a new confirmation link.",
        });
        setResendTimeout(true);
        setTimeout(() => setResendTimeout(false), 60000); // Default 60s timeout
      }
    } else {
      toast({
        variant: "destructive",
        title: "Please wait",
        description: "Please wait before requesting another confirmation email.",
      });
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-md text-center">
      <h1 className="text-2xl font-bold mb-4">Confirm Your Email</h1>
      <p className="mb-6">Please check your email and click the confirmation link we sent to {email || 'your email address'}.</p>
      <p className="mb-6">If you don't see the email, check your spam folder or click the button below to resend.</p>
      <button 
        onClick={handleEmailConfirmation}
        disabled={resendTimeout}
        className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
      >
        Resend Confirmation Email
      </button>
    </div>
  );
}
