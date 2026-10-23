import './SideBar.css';
import { Link } from 'react-router-dom';

export default function SideBar() {
  return (
    <div className='side-container'>
      <nav>
        <ul>
          <li>
            <Link className='side-button' to='/dashboard'>
              <svg className='side-icon' role='presentation' aria-hidden='true'>
                <use href='/icons.svg#person-icon'></use>
              </svg>
              Account Overview
            </Link>
          </li>
          <li>
            <Link className='side-button' to='/dashboard/links'>
              <svg className='side-icon' role='presentation' aria-hidden='true'>
                <use href='/icons.svg#list-icon'></use>
              </svg>
              Manage Links
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
