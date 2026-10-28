import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../utils/Button';
import { Header } from '../utils/Header';
import './VerifyForm.css';

export default function VerifyForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const apiUrl = import.meta.env.VITE_API_URL;

  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/login', { replace: true });
    }
  }, [email, navigate]);

  const resendCode = async () => {
    setIsResending(true);
    setError(false);
    setSuccess(false);

    try {
      const res = await fetch(`${apiUrl}/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        setError(true);
        return;
      }

      setSuccess(true);
    } catch {
      setError(true);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className='main-card'>
      <form>
        <Header title='Verify Email' />

        <div className='verify-text'>
          <p>Verification email sent to {email}.</p>

          <div className='verify-status'>
            {success && (
              <p className='verify-message'>
                Verification email resent successfully.
              </p>
            )}

            {error && (
              <p className='verify-error'>
                Failed to resend verification email. Please try again.
              </p>
            )}
          </div>
        </div>

        <Button
          text={isResending ? 'Resending...' : 'Resend Code'}
          type='button'
          onClick={resendCode}
          disabled={isResending}
        />
      </form>
    </div>
  );
}
