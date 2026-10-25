import { createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export const AuthContext = createContext(null);

export function AuthProvider() {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const res = await fetch(`${apiUrl}/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (!res.ok) {
          setAccessToken(null);
          return;
        }

        const data = await res.json();

        setAccessToken(data.token);
      } catch {
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    refreshAccessToken();
  }, [apiUrl]);

  const logout = async () => {
    try {
      await fetch(`${apiUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        loading,
        logout,
      }}
    >
      <Outlet />
    </AuthContext.Provider>
  );
}
