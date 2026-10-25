import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useState } from 'react';
import { NavInput } from './NavInput';
import './NavBar.css';

export default function NavBar({ title, svg }) {
  const { accessToken, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;
  const [linkData, setLinkData] = useState({
    link: '',
  });

  const [errors, setErrors] = useState({
    link: false,
  });

  const navLinks = [
    {
      name: 'Register',
      path: '/register',
      includeOn: ['/', '/register', '/login', '/verify-email', '/verify-mfa'],
    },
    {
      name: 'Log In',
      path: '/login',
      includeOn: ['/', '/register', '/login', '/verify-email', '/verify-mfa'],
    },
  ];

  const tokenNavLinks = [
    {
      name: 'Register',
      path: '/register',
      includeOn: [],
    },
    {
      name: 'Log In',
      path: '/login',
      includeOn: [],
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      includeOn: ['/', '/dashboard', '/dashboard/links'],
    },
  ];

  const links = accessToken ? tokenNavLinks : navLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleInput = (event) => {
    setLinkData({
      ...linkData,
      [event.target.name]: event.target.value,
    });

    setErrors({ link: false });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const address = linkData.link.trim();

    if (!address) {
      setErrors({ link: true });
      return;
    }

    try {
      new URL(address);
    } catch {
      setErrors({ link: true });
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/links`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to shorten URL');
      }

      console.log('Shortened URL:', data);
      setLinkData({ link: '' });
      setErrors({ link: false });
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  };

  return (
    <div className='nav-container'>
      <nav>
        <ul>
          <li>
            <Link className='icon' to='/'>
              {title}
            </Link>
          </li>
          <li>
            {accessToken && (
              <form
                className='shortener-inputs'
                onSubmit={handleSubmit}
                noValidate
              >
                <NavInput
                  type='text'
                  name='link'
                  value={linkData.link}
                  svg='/icons.svg#link-icon'
                  onChange={handleInput}
                  placeholder='Paste long URL here'
                  button='Shorten'
                  invalid={errors.link}
                />
              </form>
            )}
          </li>
          <li>
            {links
              .filter((link) => link.includeOn.includes(location.pathname))
              .map((link) => (
                <Link className='nav-button' key={link.path} to={link.path}>
                  {link.name}
                </Link>
              ))}
            {accessToken && (
              <button className='nav-button' onClick={handleLogout}>
                Log Out
              </button>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
