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
    <div className={`reg-input ${error ? 'reg-input-error' : ''}`}>
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

    const isError = {};
    const errorMessages = {};

    if (!userData.firstName) {
      isError.firstName = true;
      errorMessages.firstName = 'Invalid first Name';
    }

    if (!userData.lastName) {
      isError.lastName = true;
      errorMessages.lastName = 'Invalid last name';
    }

    if (!userData.email || !isValidEmail(userData.email)) {
      isError.email = true;
      errorMessages.email = 'Invalid email';
    }

    if (!isValidPassword(userData.password)) {
      isError.password = true;
      errorMessages.password = 'Password does not meet requirements';
    }

    if (userData.password !== userData.confirmPassword) {
      isError.confirmPassword = true;
      errorMessages.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(isError);
    setFormErrors(errorMessages);

    if (Object.keys(isError).length > 0) {
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
        <form className='reg-inputs' onSubmit={handleSubmit} noValidate>
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
          <div className='form-errors'>
            {Object.values(errors).map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>

          <div>
            <Button />
          </div>
        </form>
      </div>
    </>
  );
}
