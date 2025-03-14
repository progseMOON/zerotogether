import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [memId, setMemId] = useState(localStorage.getItem('memId'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await axios.post('/member/logout', null, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      setToken(null);
      setRefreshToken(null);
      setMemId(null);
      setRole(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('memId');
      localStorage.removeItem('role');
      localStorage.setItem('logoutEvent', Date.now().toString());
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = '/mainpage';
    }
  }, [token]);

  const refreshAccessToken = useCallback(async () => {
    if (isRefreshing || !refreshToken) return null;
    setIsRefreshing(true);
    try {
      const response = await axios.post('/member/refresh-token', { refreshToken });
      const newToken = response.data.token;
      // 리프레시 토큰은 필요한 경우에만 갱신
      const newRefreshToken = response.data.refreshToken || refreshToken;
      setToken(newToken);
      setRefreshToken(newRefreshToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      console.log('토큰이 갱신되었습니다.');
      return newToken;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      await logout();
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshToken, logout, isRefreshing]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'logoutEvent') {
        logout();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [logout]);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            await refreshAccessToken();
          } else {
            const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
            const refreshTime = Math.max(timeUntilExpiry - 300000, 0); // 5분 전 또는 즉시
            setTimeout(() => refreshAccessToken(), refreshTime);
          }
        } catch (error) {
          console.error('토큰 디코딩 실패:', error);
          await logout();
        }
      }
    };
    checkTokenExpiration();
  }, [token, logout, refreshAccessToken]);

  const login = useCallback(async (newToken, newRefreshToken, id, userRole) => {
    try {
      if (typeof newToken !== 'string' || typeof newRefreshToken !== 'string') {
        throw new Error('유효하지 않은 토큰 형식');
      }
      const decoded = jwtDecode(newToken);
      setToken(newToken);
      setRefreshToken(newRefreshToken);
      setMemId(id);
      setRole(userRole);
      localStorage.setItem('token', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('memId', id);
      localStorage.setItem('role', userRole);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (error) {
      console.error('로그인 실패:', error);
      await logout();
      throw error;
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ token, refreshToken, memId, role, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
