import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainerRef, CommonActions } from '@react-navigation/native';

// Define user type for storage (includes password)
type UserWithPassword = {
  id: string;
  name: string;
  email: string;
  password: string; // Store password (in a real app, you'd store a hashed password)
};

// Define user type for state (no password)
type User = {
  id: string;
  name: string;
  email: string;
};

// Define context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false, error: 'Not implemented' }),
  signup: async () => ({ success: false, error: 'Not implemented' }),
  logout: async () => {},
});

// Storage keys
const USER_STORAGE_KEY = '@auth_user';
const USERS_STORAGE_KEY = '@auth_users';

// Navigation reference for use outside of React components
let navigationRef: NavigationContainerRef<any> | null = null;

// Function to set the navigation reference
export const setNavigationRef = (ref: NavigationContainerRef<any> | null) => {
  navigationRef = ref;
};

// Mock user database with persistence
let MOCK_USERS: UserWithPassword[] = [];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user and users database from storage on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load current user if exists
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        // Load stored users database
        const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
        if (storedUsers) {
          MOCK_USERS = JSON.parse(storedUsers);
        }
      } catch (error) {
        console.error('Failed to load data from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Load the latest user database from storage
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        MOCK_USERS = JSON.parse(storedUsers);
      }

      // In a real app, this would be an API call to validate credentials
      const foundUser = MOCK_USERS.find(u => u.email === email);

      // Verify both email and password match
      // In a real app, you'd compare password hash
      if (foundUser && foundUser.password === password) {
        // Don't include password in the user state or stored user
        const userWithoutPassword: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email
        };
        setUser(userWithoutPassword);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword));
        return { success: true };
      }

      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const userExists = MOCK_USERS.some(u => u.email === email);
      if (userExists) {
        return { success: false, error: 'Email already in use' };
      }

      // Create new user
      const newUser: UserWithPassword = {
        id: Date.now().toString(),
        name,
        email,
        password, // Store password (in a real app, you'd hash it)
      };

      // Add to mock database
      MOCK_USERS.push(newUser);
      
      // Save updated users database
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS));

      // Set as current user (without password for security)
      const userWithoutPassword: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };
      setUser(userWithoutPassword);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword));

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An error occurred during signup' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      
      // Navigate to Login screen using the navigation reference
      if (navigationRef) {
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
