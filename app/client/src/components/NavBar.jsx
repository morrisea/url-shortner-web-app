import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NavBar.css';

export default function NavBar({ title, svg }) {
  const { accessToken, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
      includeOn: ['/', '/dashboard'],
    },
  ];

  const links = accessToken ? tokenNavLinks : navLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className='nav-container'>
      <nav>
        <ul>
          <li>
            <Link to='/'>
              <span className='icon'>{title}</span>

              <svg className='url-icon' role='presentation' aria-hidden='true'>
                <use href={svg}></use>
              </svg>
            </Link>
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
