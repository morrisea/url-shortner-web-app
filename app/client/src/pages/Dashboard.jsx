import NavBar from '../components/NavBar';
import UserData from '../components/UserData';

export default function Dashboard() {
  return (
    <>
      <NavBar title='Short' svg='/icons.svg#url-icon' />
      <UserData />
    </>
  );
}
