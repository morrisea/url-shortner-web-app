import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';
import { Header } from './Header';
import { Input } from './Input';
import './AuthForm.css';

export default function AuthForm() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const handleInput = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
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

    if (res.ok) {
      const data = await res.json();

      auth.setAccessToken(data.accessToken);

      navigate('/dashboard');
    }
  };

  return (
    <>
      <div className='container'>
        <Header title='Log In' />
        <form className='login-inputs' onSubmit={handleSubmit}>
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
          <div>
            <div className='register'>
              New to ShortURL?
              <Link className='register-link' to='/register'>
                Sign Up
              </Link>
            </div>
            <Button className='login' text='Log In' />
          </div>
        </form>
      </div>
    </>
  );
}
