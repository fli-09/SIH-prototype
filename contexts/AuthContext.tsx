import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the structure for the User object
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'authority' | 'viewer' | 'tourist';
  authorityName?: string;
  authorityType?: string;
  uid?: string;
  nationality?: string;
  passportNumber?: string;
}

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: string, authorityName?: string, authorityType?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to easily access the auth context in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// The provider component that wraps the app and manages auth state
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app start, try to load the user from storage
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      // Done loading, hide any splash screens or loaders
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Mock authentication - replace with real API call
      const mockUsers = [
        {
          id: '1',
          email: 'admin@touristsafety.com',
          name: 'System Administrator',
          role: 'admin' as const,
          password: 'admin123'
        },
        {
          id: '2',
          email: 'tourist@example.com',
          name: 'John Smith',
          role: 'tourist' as const,
          uid: 'UID-001',
          nationality: 'USA',
          passportNumber: 'A1234567',
          password: 'tourist123'
        }
      ];

      const foundUser = mockUsers.find(u => u.email === email && u.password === password);

      if (foundUser) {
        // Omitting password before creating the final user data object
        const { password, ...userDataWithoutPassword } = foundUser;
        const userData: User = userDataWithoutPassword;

        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: string,
    authorityName?: string,
    authorityType?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Mock signup - replace with real API call
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: role as User['role'], // Cast to the specific role types
        authorityName,
        authorityType
      };

      setUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // This is your logout function. It works perfectly.
  const logout = async (): Promise<void> => {
    try {
      // 1. Clear the user from the application's state
      setUser(null);
      // 2. Remove the user data from the phone's persistent storage
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // The value provided to all children components
  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user // `!!user` converts the user object to a boolean (true if user exists, false if null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
