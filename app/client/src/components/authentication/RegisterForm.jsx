import { useState } from 'react';
import { Header } from '../utils/Header';
import { Button } from '../utils/Button';
import { useNavigate } from 'react-router-dom';
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
  onPaste,
  label,
}) {
  return (
    <div className='reg-input-group'>
      {error && <div className='reg-input-error-message'>{error}</div>}

      <div className={`reg-input ${error ? 'reg-input-error' : ''}`}>
        <svg role='presentation' aria-hidden='true'>
          {svg && <use href={svg}></use>}
        </svg>

        <label className='sr-only' forHtml={name}>
          {label}
        </label>

        <input
          id={name}
          aria-describedby={error ? `${name}-error` : undefined}
          placeholder={placeholder}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          minLength={minLength}
          maxLength={maxLength}
          autoComplete={autoComplete}
          onPaste={onPaste}
        />
      </div>
    </div>
  );
}

export default function RegisterForm() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const isValidPassword = (password) => {
    return (
      password.length >= 8 &&
      /\d/.test(password) &&
      /[A-Z]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'email') {
      setFormErrors((prev) => ({
        ...prev,
        email: !isValidEmail(value),
      }));
      return;
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
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
    setIsSubmitting(true);

    try {
      const errorMessages = {};

      if (!userData.firstName) {
        errorMessages.firstName = 'Invalid first name';
      }

      if (!userData.lastName) {
        errorMessages.lastName = 'Invalid last name';
      }

      if (!userData.email || !isValidEmail(userData.email)) {
        errorMessages.email = 'Invalid email';
      }

      if (!isValidPassword(userData.password)) {
        errorMessages.password = 'Password does not meet requirements';
      }

      if (userData.password !== userData.confirmPassword) {
        errorMessages.confirmPassword = 'Passwords do not match';
      }

      setFormErrors(errorMessages);

      if (Object.keys(errorMessages).length > 0) {
        return;
      }

      const res = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (res.status === 409) {
        setFormErrors((prev) => ({
          ...prev,
          email: 'Email already in use',
        }));
        return;
      }

      if (!res.ok) {
        setFormErrors({
          email: 'Registration failed',
        });
        return;
      }

      const data = await res.json();

      navigate('/verify-email', {
        state: { email: data.email },
        replace: true,
      });
    } catch {
      setFormErrors({
        email: 'Unable to register. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className='main-card'>
        <Header title='Sign Up' />
        <form className='reg-inputs' onSubmit={handleSubmit} noValidate>
          <div className='name'>
            <RegisterInput
              id='firstName'
              label='first name'
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
              id='lastName'
              label='last name'
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
            id='email'
            label='email'
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
            id='password'
            label='password'
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
            id='confirmPassword'
            label='confirm password'
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
            onPaste={(event) => {
              event.preventDefault();
            }}
          />

          <PasswordCheckList
            rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
            minLength={8}
            value={userData.password}
            valueAgain={userData.confirmPassword}
          />
          <div>
            <Button
              text={isSubmitting ? 'Creating Account...' : 'Sign Up'}
              disabled={isSubmitting}
            />{' '}
          </div>
        </form>
      </div>
    </>
  );
}
