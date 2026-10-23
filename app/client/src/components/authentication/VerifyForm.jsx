import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../utils/Button';
import { Header } from '../utils/Header';
import './VerifyForm.css';

export default function VerifyForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/login', { replace: true });
    }
  }, [email, navigate]);

  const resendCode = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const res = await fetch(`${apiUrl}/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
  };

  return (
    <>
      <div className='main-card'>
        <form>
          <Header title='Verify Email' />
          <div className='verify-text'>
            <p>Verification email sent to {email}.</p>
          </div>
          <Button text='Resend Code' type='button' onClick={resendCode} />
        </form>
      </div>
    </>
  );
}
