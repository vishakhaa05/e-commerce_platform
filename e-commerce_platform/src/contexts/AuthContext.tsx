import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAccessToken } from '../lib/api.js';
import { toast } from 'sonner';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  addresses: Address[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  wishlist: any[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  updateProfileName: (name: string) => Promise<boolean>;
  changePassword: (current: string, newPass: string) => Promise<boolean>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<boolean>;
  updateAddress: (id: string, address: Omit<Address, 'id'>) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      if (res.data.success) {
        setWishlist(res.data.wishlist);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    }
  };

  const refreshSession = async () => {
    if (localStorage.getItem('hasSession') === 'true') {
      try {
        const res = await api.post('/auth/refresh');
        if (res.data.success) {
          setAccessToken(res.data.accessToken);
          setUser(res.data.user);
          // Fetch wishlist after restore session
          try {
            const wlRes = await api.get('/wishlist');
            if (wlRes.data.success) {
              setWishlist(wlRes.data.wishlist);
            }
          } catch (wlErr) {
            console.error(wlErr);
          }
        }
      } catch (err) {
        console.error('Session refresh failed:', err);
        localStorage.removeItem('hasSession');
        setAccessToken(null);
        setUser(null);
        setWishlist([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        
        // Fetch user's wishlist immediately
        try {
          const wlRes = await api.get('/wishlist');
          if (wlRes.data.success) {
            setWishlist(wlRes.data.wishlist);
          }
        } catch (wlErr) {
          console.error(wlErr);
        }

        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Please check credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.post('/auth/signup', { name, email, password });
      if (res.data.success) {
        toast.success(res.data.message);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Signup failed.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.post('/auth/logout');
      setAccessToken(null);
      setUser(null);
      setWishlist([]);
      toast.success('Logged out successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Logout request failed, but session cleared locally.');
      setAccessToken(null);
      setUser(null);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/verify-email', { token });
      if (res.data.success) {
        toast.success(res.data.message);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Email verification failed.');
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        toast.success(res.data.message);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Password recovery failed.');
      return false;
    }
  };

  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/reset-password', { token, password });
      if (res.data.success) {
        toast.success(res.data.message);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Password reset failed.');
      return false;
    }
  };

  const updateProfileName = async (name: string): Promise<boolean> => {
    try {
      const res = await api.put('/users/profile', { name });
      if (res.data.success) {
        setUser(res.data.user);
        toast.success('Name updated successfully.');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const res = await api.put('/users/change-password', { currentPassword, newPassword });
      if (res.data.success) {
        toast.success('Password changed successfully.');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
      return false;
    }
  };

  const addAddress = async (address: Omit<Address, 'id'>): Promise<boolean> => {
    try {
      const res = await api.post('/users/address', address);
      if (res.data.success) {
        setUser(prev => prev ? { ...prev, addresses: res.data.addresses } : null);
        toast.success('Address added successfully.');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add address.');
      return false;
    }
  };

  const updateAddress = async (id: string, address: Omit<Address, 'id'>): Promise<boolean> => {
    try {
      const res = await api.put(`/users/address/${id}`, address);
      if (res.data.success) {
        setUser(prev => prev ? { ...prev, addresses: res.data.addresses } : null);
        toast.success('Address updated successfully.');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update address.');
      return false;
    }
  };

  const deleteAddress = async (id: string): Promise<boolean> => {
    try {
      const res = await api.delete(`/users/address/${id}`);
      if (res.data.success) {
        setUser(prev => prev ? { ...prev, addresses: res.data.addresses } : null);
        toast.success('Address deleted successfully.');
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete address.');
      return false;
    }
  };

  const toggleWishlist = async (productId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Please login to manage your wishlist.');
      return false;
    }

    try {
      const res = await api.post('/wishlist/toggle', { productId });
      if (res.data.success) {
        setWishlist(res.data.wishlist);
        toast.success(res.data.message);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update wishlist.');
      return false;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loading,
        wishlist,
        login,
        signup,
        logout,
        verifyEmail,
        forgotPassword,
        resetPassword,
        updateProfileName,
        changePassword,
        addAddress,
        updateAddress,
        deleteAddress,
        toggleWishlist,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
