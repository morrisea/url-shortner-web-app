import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Button } from '../utils/Button';
import { Header } from '../utils/Header';
import { Input } from '../utils/Input';
import ReCAPTCHA from 'react-google-recaptcha';
import './AuthForm.css';

export default function AuthForm() {
  const { accessToken, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [siteToken, setSiteToken] = useState(null);
  const recaptchaRef = useRef(null);

  const [verified, setVerified] = useState(
    searchParams.get('verified') === 'true',
  );
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    login: false,
  });

  useEffect(() => {
    if (!loading && accessToken) {
      navigate('/dashboard', { replace: true });
    }

    if (verified) {
      setSearchParams({}, { replace: true });
    }
  }, [accessToken, loading, navigate, verified, setSearchParams]);

  const handleInput = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });

    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!siteToken) {
      setErrors({ login: true });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          recaptchaToken: siteToken,
        }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/verify-mfa', {
          state: { email: userData.email },
          replace: true,
        });
      } else if (res.status === 403) {
        navigate('/verify-email', {
          state: { email: data.email },
          replace: true,
        });
      } else {
        setErrors({ login: true });
      }
    } catch {
      setErrors({ login: true });
    } finally {
      setIsSubmitting(false);
      setSiteToken(null);
      recaptchaRef.current?.reset();
    }
  };

  return (
    <>
      <div className='main-card'>
        <Header title='Log In' />
        <form className='login-inputs' onSubmit={handleSubmit} noValidate>
          <Input
            type='email'
            name='email'
            placeholder='Email'
            svg='/icons.svg#email-icon'
            value={userData.email}
            onChange={handleInput}
            error={errors.login ? 'Invalid email or password' : ''}
            invalid={errors.login}
          />

          <Input
            type='password'
            name='password'
            placeholder='Password'
            svg='/icons.svg#lock-icon'
            value={userData.password}
            onChange={handleInput}
            invalid={errors.login}
          />
          <div className='login-info'>
            <div className='register'>
              New to ShortURL?
              <Link className='register-link' to='/register'>
                Sign Up
              </Link>
            </div>
            <div className='recaptcha-container'>
              <ReCAPTCHA
                ref={recaptchaRef}
                theme='dark'
                sitekey={import.meta.env.VITE_SITE_KEY}
                onChange={(value) => setSiteToken(value)}
                onExpired={() => setSiteToken(null)}
                onErrored={() => setSiteToken(null)}
              />
            </div>
            {verified && (
              <div className='verified-message'>
                Email verified successfully. You can now log in.
              </div>
            )}
            <Button
              text={isSubmitting ? 'Logging In...' : 'Log In'}
              disabled={isSubmitting || loading || !siteToken}
            />
          </div>
        </form>
      </div>
    </>
  );
}
