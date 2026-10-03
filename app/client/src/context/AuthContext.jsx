import { createContext, useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider() {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await fetch(`${apiUrl}/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          setAccessToken(null);
          return;
        }

        const data = await response.json();

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

export function useAuth() {
  return useContext(AuthContext);
}
