import './NavBar.css';
import { Link } from 'react-router-dom';

export default function NavBar({ title, svg }) {
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
              <Link className='nav-button' to='/register'>
                Sign Up
              </Link>
              <Link className='nav-button' to='/login'>
                Log In
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
