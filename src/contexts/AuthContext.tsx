
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  likedEvents: string[]; // IDs of liked events
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  likeEvent: (eventId: string) => void;
  unlikeEvent: (eventId: string) => void;
  isEventLiked: (eventId: string) => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users database
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    isAdmin: true,
    likedEvents: ['101', '102']
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    isAdmin: false,
    likedEvents: ['103']
  }
];

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would validate against a backend
    const foundUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && (password === 'password' || password === 'admin')) {
      setUser(foundUser);
      setIsLoading(false);
      toast.success(`Welcome back, ${foundUser.name}`);
      return true;
    }
    
    setIsLoading(false);
    toast.error('Invalid email or password');
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      setIsLoading(false);
      toast.error('This email is already registered');
      return false;
    }
    
    // In a real app, this would create a new user in the database
    const newUser: User = {
      id: `${DEMO_USERS.length + 1}`,
      email,
      name,
      isAdmin: false,
      likedEvents: []
    };
    
    // For demo purposes, we're not actually adding to DEMO_USERS
    // but directly setting as current user
    setUser(newUser);
    setIsLoading(false);
    toast.success('Account created successfully!');
    return true;
  };

  const logout = () => {
    setUser(null);
    toast.success('Logged out successfully');
  };

  const likeEvent = (eventId: string) => {
    if (!user) {
      toast.error('Please log in to like events');
      return;
    }
    
    if (user.likedEvents.includes(eventId)) {
      return; // Already liked
    }
    
    const updatedUser = {
      ...user,
      likedEvents: [...user.likedEvents, eventId]
    };
    
    setUser(updatedUser);
    toast.success('Event added to your liked events');
  };

  const unlikeEvent = (eventId: string) => {
    if (!user) return;
    
    if (!user.likedEvents.includes(eventId)) {
      return; // Not liked
    }
    
    const updatedUser = {
      ...user,
      likedEvents: user.likedEvents.filter(id => id !== eventId)
    };
    
    setUser(updatedUser);
    toast.success('Event removed from your liked events');
  };

  const isEventLiked = (eventId: string) => {
    return user ? user.likedEvents.includes(eventId) : false;
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    likeEvent,
    unlikeEvent,
    isEventLiked
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
