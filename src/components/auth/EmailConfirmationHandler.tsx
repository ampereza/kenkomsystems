
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface EmailConfirmationHandlerProps {
  email: string;
}

export function EmailConfirmationHandler({ email }: EmailConfirmationHandlerProps) {
  const [resendTimeout, setResendTimeout] = useState(false);
  const { toast } = useToast();

  async function handleEmailConfirmation() {
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

  return null; // This is a logic-only component
}
