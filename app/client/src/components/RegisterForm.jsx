import { useState } from 'react';
import { Header } from './Header';
import { Button } from './Button';
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
  autoComplete,
}) {
  return (
    <div className={`input ${error ? 'input-error' : ''}`}>
      <svg role='presentation' aria-hidden='true'>
        {svg && <use href={svg}></use>}
      </svg>

      <input
        placeholder={placeholder}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        minLength={minLength}
        maxLength={maxLength}
        autoComplete={autoComplete}
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

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      setFormErrors((prev) => ({
        ...prev,
        password: !isValidPassword(value),
      }));
    }

    if (name === 'confirmPassword') {
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword: value !== userData.password,
      }));
    }
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

    const res = await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
  };

  return (
    <>
      <div className='register-card'>
        <Header title='Sign Up' />
        <form className='reg-inputs' onSubmit={handleSubmit}>
          <div className='name'>
            <RegisterInput
              type='text'
              name='firstName'
              placeholder='First Name'
              svg={null}
              value={userData.firstName}
              onChange={handleChange}
              minLength={1}
              maxLength={32}
              error={errors.firstName}
              autoComplete='given-name'
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
              autoComplete='family-name'
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
            autoComplete='email'
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
            autoComplete='new-password'
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
            autoComplete='off'
          />

          <PasswordCheckList
            rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
            minLength={8}
            value={userData.password}
            valueAgain={userData.confirmPassword}
          />
          <div>
            <Button />
          </div>
        </form>
      </div>
    </>
  );
}
