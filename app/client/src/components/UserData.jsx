import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './UserData.css';

export default function UserData() {
  const { accessToken } = useAuth();

  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const res = await fetch(`${apiUrl}/dashboard`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });

    if (res.ok) {
      const data = await res.json();
      setUserData(data);
    }
  };

  useEffect(() => {
    if (accessToken) {
      getUserData();
    }
  }, [accessToken]);

  const remainingSeconds = userData
    ? userData.user.exp - Math.floor(Date.now() / 1000)
    : 0;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <>
      <div className='user-card'>
        <h1>User Information</h1>
        <div className='divide-line'></div>
        {userData && (
          <div className='text-card'>
            <p>
              <b>User ID:</b> {userData.user.userId}
            </p>
            <p>
              <b>Email:</b> {userData.user.email}
            </p>
            <p>
              <b>Token TTL:</b> {minutes}m {seconds}s
            </p>
          </div>
        )}
      </div>
    </>
  );
}
