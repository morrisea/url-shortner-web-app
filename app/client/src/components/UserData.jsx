import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from './Header';
import './AuthForm.css';

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

  return (
    <>
      <Header title='User Information' />

      {userData && (
        <div>
          <p>User ID: {userData.user.userId}</p>
          <p>Email: {userData.user.email}</p>
          <p>
            Token TTL: {(userData.user.exp - userData.user.iat) / 60} minutes
          </p>
        </div>
      )}
    </>
  );
}
