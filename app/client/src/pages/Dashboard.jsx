import NavBar from '../components/NavBar';
import UserData from '../components/UserData';
import { useLocation } from 'react-router-dom';

export default function Dashboard() {
  const location = useLocation();
  return (
    <>
      <NavBar title='Short' svg='/icons.svg#url-icon' />
      <UserData key={location.key} />
    </>
  );
}
