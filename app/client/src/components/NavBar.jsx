import './NavBar.css';
import { Link, useLocation } from 'react-router-dom';

export default function NavBar({ title, svg }) {
  const location = useLocation();

  const navLinks = [
    {
      name: 'Register',
      path: '/register',
      includeOn: ['/', '/register', '/login'],
    },
    {
      name: 'Login',
      path: '/login',
      includeOn: ['/', '/register', '/login'],
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      includeOn: ['/dashboard'],
    },
  ];

  return (
    <>
      <div className='nav-container'>
        <nav>
          <ul>
            <li>
              <Link to='/'>
                <span className='icon'>{title}</span>

                <svg
                  className='url-icon'
                  role='presentation'
                  aria-hidden='true'
                >
                  <use href={svg}></use>
                </svg>
              </Link>
            </li>
            <li>
              {navLinks.map(
                (link) =>
                  link.includeOn.includes(location.pathname) && (
                    <Link className='nav-button' key={link.path} to={link.path}>
                      {link.name}
                    </Link>
                  ),
              )}
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
