import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UserData.css';

export default function UserData() {
  const { accessToken, setAccessToken } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const getUserData = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const res = await fetch(`${apiUrl}/dashboard`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });

    if (!res.ok) {
      setAccessToken(null);
      navigate('/login', {
        replace: true,
      });
    }

    const data = await res.json();
    setUserData(data);
  };

  useEffect(() => {
    if (accessToken) {
      getUserData();
    }
  }, [accessToken]);

  return (
    <>
      <div className='user-card'>
        <h1>User Information</h1>
        <div className='divide-line'></div>
        {userData && (
          <div className='text-card'>
            <p>
              <b>User ID:</b> {userData.user.id}
            </p>
            <p>
              <b>Name:</b> {userData.user.first} {userData.user.last}
            </p>

            <p>
              <b>Email:</b> {userData.user.email}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
