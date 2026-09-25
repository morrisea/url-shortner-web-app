import { useState } from 'react';
import { Button, Header } from './AuthForm';
import PasswordCheckList from 'react-password-checklist';
import './RegisterForm.css';

function RegisterInput({
  type,
  name,
  value,
  svg,
  placeholder,
  onChange,
  error,
  minLength,
  maxLength,
}) {
  return (
    <div className={`input ${error ? 'input-error' : ''}`}>
      {svg && (
        <svg className='button-icon' role='presentation' aria-hidden='true'>
          <use href={svg}></use>
        </svg>
      )}

      <input
        placeholder={placeholder}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        minLength={minLength}
        maxLength={maxLength}
      />
    </div>
  );
}

export default function RegisterForm() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setFormErrors] = useState({});

  const isValidPassword = (password) => {
    return (
      password.length >= 8 &&
      /\d/.test(password) &&
      /[A-Z]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setUserData({
      ...userData,
      [name]: value,
    });

    setFormErrors({
      ...errors,
      [name]: false,
    });
  };

  const validatePassword = (event) => {
    const { name, value } = event.target;

    setUserData({
      ...userData,
      [name]: value,
    });

    let password = userData.password;
    let confirmPassword = userData.confirmPassword;

    if (name === 'password') {
      password = value;
    }

    if (name === 'confirmPassword') {
      confirmPassword = value;
    }

    setFormErrors({
      ...errors,
      password: !isValidPassword(password),
      confirmPassword: password !== confirmPassword,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const valueErrors = {};

    if (!userData.firstName) {
      valueErrors.firstName = true;
    }

    if (!userData.lastName) {
      valueErrors.lastName = true;
    }

    if (!userData.email) {
      valueErrors.email = true;
    }

    if (!isValidPassword(userData.password)) {
      valueErrors.password = true;
    }

    if (userData.password !== userData.confirmPassword) {
      valueErrors.confirmPassword = true;
    }

    setFormErrors(valueErrors);

    if (Object.keys(valueErrors).length > 0) {
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL;
    console.log(`${apiUrl}`);

    const res = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    console.log('success');
  };

  return (
    <>
      <div className='container'>
        <Header title='Sign Up' />
        <form className='inputs' onSubmit={handleSubmit}>
          <div className='name'>
            <RegisterInput
              type='text'
              name='firstName'
              placeholder='First Name'
              svg=''
              value={userData.firstName}
              onChange={handleChange}
              minLength={1}
              maxLength={32}
              error={errors.firstName}
            />

            <RegisterInput
              type='text'
              name='lastName'
              placeholder='Last Name'
              svg={null}
              value={userData.lastName}
              onChange={handleChange}
              minLength={1}
              maxLength={32}
              error={errors.lastName}
            />
          </div>
          <RegisterInput
            type='email'
            name='email'
            placeholder='Email'
            svg='/icons.svg#email-icon'
            value={userData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <RegisterInput
            type='password'
            name='password'
            placeholder='Password'
            svg='/icons.svg#lock-icon'
            value={userData.password}
            onChange={validatePassword}
            minLength={8}
            maxLength={32}
            error={errors.password}
          />

          <RegisterInput
            type='password'
            name='confirmPassword'
            placeholder='Confirm Password'
            svg={`/icons.svg#${errors.confirmPassword ? 'close' : 'check'}-icon`}
            value={userData.confirmPassword}
            onChange={validatePassword}
            minLength={8}
            maxLength={32}
            error={errors.confirmPassword}
          />

          <PasswordCheckList
            rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
            minLength={8}
            value={userData.password}
            valueAgain={userData.confirmPassword}
          />
          <div>
            <Button className='submit' />
          </div>
        </form>
      </div>
    </>
  );
}
