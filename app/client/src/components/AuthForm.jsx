import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';
import { Header } from './Header';
import { Input } from './Input';
import './AuthForm.css';

export default function AuthForm() {
  const { accessToken, setAccessToken, loading } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!loading && accessToken) {
      navigate('/dashboard', { replace: true });
    }
  }, [accessToken, loading, navigate]);

  const handleInput = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });

    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const apiUrl = import.meta.env.VITE_API_URL;

    const res = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    const data = await res.json();

    if (res.ok) {
      setAccessToken(data.accessToken);

      navigate('/dashboard');
    } else if (res.status == 403) {
      navigate('/verify-email', {
        state: { email: data.email },
      });
    } else {
      setErrors({ message: 'Invalid email or password' });
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
            svg='/icons.svg#email-icon'
            value={userData.email}
            onChange={handleInput}
          />

          <Input
            type='password'
            name='password'
            svg='/icons.svg#lock-icon'
            value={userData.password}
            onChange={handleInput}
          />
          <div className='login-info'>
            <div className='register'>
              New to ShortURL?
              <Link className='register-link' to='/register'>
                Sign Up
              </Link>
            </div>
            <div className='login-errors'>
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
