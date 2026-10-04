import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';
import { Header } from './Header';
import { Input } from './Input';
import './MFAForm.css';

export default function MFAForm() {
  const { accessToken, setAccessToken, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const apiUrl = import.meta.env.VITE_API_URL;
  const [userData, setUserData] = useState({
    email: '',
    code: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!loading && accessToken) {
      navigate('/dashboard', { replace: true });
    } else if (!loading && !email) {
      navigate('/login', { replace: true });
    }
  }, [accessToken, loading, navigate, email]);

  const handleInput = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });

    setErrors({});
  };

  const resendMFA = async () => {
    const res = await fetch(`${apiUrl}/send-mfa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
      credentials: 'include',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch(`${apiUrl}/verify-mfa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, code: userData.code }),
      credentials: 'include',
    });

    const data = await res.json();

    if (res.ok) {
      setAccessToken(data.accessToken);

      navigate('/dashboard');
    } else if (res.status == 403) {
      navigate('/verify-email', {
        state: { email: data.email },
        replace: true,
      });
    } else {
      setErrors({ message: 'Invalid or expired MFA code' });
    }
  };

  return (
    <>
      <div className='main-card'>
        <Header title='MFA' />
        <form className='mfa-inputs' onSubmit={handleSubmit} noValidate>
          <Input
            type='email'
            name='email'
            svg='/icons.svg#email-icon'
            value={email}
            disabled
          />

          <Input
            type='text'
            name='code'
            svg='/icons.svg#lock-icon'
            value={userData.code}
            onChange={handleInput}
          />
          <div className='mfa-info'>
            <div className='resend'>
              Didn't receive a code?
              <button className='resend-link' type='button' onClick={resendMFA}>
                Resend Code
              </button>
            </div>
            <div className='mfa-errors'>
              {Object.values(errors).map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
            <Button text='Log In' />
          </div>
        </form>
      </div>
    </>
  );
}
