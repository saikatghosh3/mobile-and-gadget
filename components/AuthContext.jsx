'use client';

import { createContext, useContext, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  registerUser,
  fetchUser,
  logoutUser,
  updateProfile,
  changePassword,
  clearError,
} from '@/lib/redux/slices/authSlice';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const login = useCallback(async (email, password) => {
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    }
    return { success: false, error: result.payload || 'Login failed' };
  }, [dispatch]);

  const register = useCallback(async (fullName, email, phone, password, profilePicture) => {
    const result = await dispatch(registerUser({ fullName, email, phone, password, profilePicture }));
    if (registerUser.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    }
    return { success: false, error: result.payload || 'Registration failed' };
  }, [dispatch]);

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
    router.push('/');
  }, [dispatch, router]);

  const updateUserProfile = useCallback(async (updates) => {
    const result = await dispatch(updateProfile(updates));
    if (updateProfile.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    }
    return { success: false, error: result.payload || 'Update failed' };
  }, [dispatch]);

  const changeUserPassword = useCallback(async (currentPassword, newPassword) => {
    const result = await dispatch(changePassword({ currentPassword, newPassword }));
    if (changePassword.fulfilled.match(result)) {
      return result.payload;
    }
    return { success: false, error: result.payload || 'Password change failed' };
  }, [dispatch]);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile: updateUserProfile,
    changePassword: changeUserPassword,
    clearError: () => dispatch(clearError()),
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
