import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthForm.css';

export function AuthInput({ type, name, value, svg, onChange }) {
  return (
    <>
      <div className='login-input'>
        <svg className='button-icon' role='presentation' aria-hidden='true'>
          <use href={svg}></use>
        </svg>

        <input
          placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required
        />
      </div>
    </>
  );
}

export function Header({ title }) {
  return (
    <>
      <div className='header'>
        <div className='text'>{title}</div>
        <div className='underline'></div>
      </div>
    </>
  );
}

export function Button({ text = 'Submit', className }) {
  return (
    <button className={className} type='submit'>
      {text}
    </button>
  );
}

export default function AuthForm() {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch('api/login', {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
  };

  return (
    <>
      <div className='container'>
        <Header title='Log In' />
        <form className='login-inputs' onSubmit={handleSubmit}>
          <AuthInput
            type='email'
            name='email'
            svg='/icons.svg#email-icon'
            value={userData.email}
            onChange={handleChange}
          />

          <AuthInput
            type='password'
            name='password'
            svg='/icons.svg#lock-icon'
            value={userData.password}
            onChange={handleChange}
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
