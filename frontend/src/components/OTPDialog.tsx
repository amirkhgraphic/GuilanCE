import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { toast } from 'sonner@2.0.3';
import { useAuth } from './AuthContext';

interface OTPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'email' | 'phone';
  target: string; // email address or phone number
}

export function OTPDialog({ isOpen, onClose, type, target }: OTPDialogProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { verifyEmail, verifyPhone, sendEmailOTP, sendPhoneOTP } = useAuth();

  const handleSendOTP = async () => {
    setIsLoading(true);
    try {
      let success = false;
      if (type === 'email') {
        success = await sendEmailOTP();
      } else {
        success = await sendPhoneOTP();
      }
      
      if (success) {
        setOtpSent(true);
        toast.success(`OTP sent to your ${type}`);
      } else {
        toast.error(`Failed to send OTP to your ${type}`);
      }
    } catch (error) {
      toast.error('An error occurred while sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      let success = false;
      if (type === 'email') {
        success = await verifyEmail(otp);
      } else {
        success = await verifyPhone(otp);
      }
      
      if (success) {
        toast.success(`${type === 'email' ? 'Email' : 'Phone number'} verified successfully!`);
        onClose();
        setOtp('');
        setOtpSent(false);
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOtp('');
    setOtpSent(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Verify {type === 'email' ? 'Email Address' : 'Phone Number'}
          </DialogTitle>
          <DialogDescription>
            {!otpSent 
              ? `We'll send a verification code to ${target}`
              : `Enter the 6-digit code sent to ${target}`
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!otpSent ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Click the button below to receive your verification code.
              </p>
              <Button onClick={handleSendOTP} disabled={isLoading} className="w-full">
                {isLoading ? 'Sending...' : `Send OTP to ${type}`}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?{' '}
                  <button
                    onClick={handleSendOTP}
                    disabled={isLoading}
                    className="text-primary hover:underline"
                  >
                    Resend
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>

        {otpSent && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleVerify} disabled={isLoading || otp.length !== 6}>
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}