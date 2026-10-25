import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Button } from '../utils/Button';
import { Header } from '../utils/Header';
import { Input } from '../utils/Input';
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

  const [errors, setErrors] = useState({ login: false });

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

      navigate('/dashboard', { replace: true });
    } else if (res.status == 403) {
      navigate('/verify-email', {
        state: { email: data.email },
        replace: true,
      });
    } else {
      setErrors({ login: true });
    }
  };

  return (
    <>
      <div className='main-card'>
        <Header title='MFA' />
        <div className='mfa-text'>
          <p>MFA code sent to {email}.</p>
        </div>
        <form className='mfa-inputs' onSubmit={handleSubmit} noValidate>
          <Input
            type='email'
            name='email'
            placeholder='Email'
            svg='/icons.svg#email-icon'
            value={email}
            disabled
          />

          <Input
            type='text'
            name='code'
            placeholder='Code'
            svg='/icons.svg#lock-icon'
            value={userData.code}
            onChange={handleInput}
            error={errors.login ? 'Invalid or expired code' : ''}
            invalid={errors.login}
          />
          <div className='mfa-info'>
            <div className='resend'>
              Didn't receive a code?
              <button className='resend-link' type='button' onClick={resendMFA}>
                Resend Code
              </button>
            </div>
            <Button text='Log In' />
          </div>
        </form>
      </div>
    </>
  );
}
