import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import './Layout.css';

export default function Layout() {
  return (
    <div id='app-bg'>
      <NavBar title='Short' svg='/icons.svg#url-icon' />
      <Outlet />
    </div>
  );
}
