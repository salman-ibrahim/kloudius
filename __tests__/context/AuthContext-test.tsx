import React from 'react';
import { render, act, waitFor, fireEvent } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Button, View } from 'react-native';

// Mock timers
jest.useFakeTimers();

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn().mockImplementation(() => Promise.resolve(null)),
    setItem: jest.fn().mockImplementation(() => Promise.resolve()),
    removeItem: jest.fn().mockImplementation(() => Promise.resolve()),
}));

// Mock navigation reference
jest.mock('../../context/AuthContext', () => {
    const originalModule = jest.requireActual('../../context/AuthContext');
    return {
        ...originalModule,
        setNavigationRef: jest.fn(),
    };
});

// Test component that uses the auth context
const TestComponent = () => {
    const { user, login, signup, logout, isLoading } = useAuth();
    
    return (
        <>
            <Text testID="loading-state">{isLoading ? 'Loading' : 'Not Loading'}</Text>
            <Text testID="user-email">{user ? user.email : 'No user'}</Text>
            <Button 
                testID="login-button" 
                title="Login" 
                onPress={() => login('test@example.com', 'password')} 
            />
            <Button 
                testID="signup-button" 
                title="Signup" 
                onPress={() => signup('Test User', 'test@example.com', 'password')} 
            />
            <Button 
                testID="logout-button" 
                title="Logout" 
                onPress={() => logout()} 
            />
        </>
    );
};

describe('AuthContext', () => {
    // Reset timers after each test
    afterEach(() => {
        jest.clearAllTimers();
    });
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        
        // Mock AsyncStorage.getItem to return null by default (no stored user)
        (AsyncStorage.getItem as jest.Mock).mockImplementation(() => Promise.resolve(null));
    });

    it('initializes with loading state and no user', async () => {
        const { getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // Initially should be in loading state
        expect(getByTestId('loading-state').props.children).toBe('Loading');
        
        // Wait for loading to complete with increased timeout
        await waitFor(() => {
            expect(getByTestId('loading-state').props.children).toBe('Not Loading');
        }, { timeout: 10000 });
        
        // Should have no user initially
        expect(getByTestId('user-email').props.children).toBe('No user');
    });

    it('handles signup successfully', async () => {
        // Mock AsyncStorage.setItem to resolve successfully
        (AsyncStorage.setItem as jest.Mock).mockImplementation(() => Promise.resolve());
        
        const { getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        
        // Wait for initial loading to complete
        await waitFor(() => {
            expect(getByTestId('loading-state').props.children).toBe('Not Loading');
        });
        
        // Trigger signup
        await act(async () => {
            fireEvent.press(getByTestId('signup-button'));
            // Fast-forward timer to handle the 1-second delay in the signup function
            jest.advanceTimersByTime(1100);
        });
        
        // After signup, user should be set
        await waitFor(() => {
            expect(getByTestId('user-email').props.children).toBe('test@example.com');
        }, { timeout: 2000 });
        
        // Check that AsyncStorage was called to store user and users
        expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
    });

    it('handles login successfully when user exists', async () => {
        // Mock existing users in storage
        const mockUsers = [
            { id: '1', name: 'Test User', email: 'test@example.com', password: 'password' }
        ];
        
        (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
            if (key === '@auth_users') {
                return Promise.resolve(JSON.stringify(mockUsers));
        }
        return Promise.resolve(null);
        });
        
        const { getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        
        // Wait for initial loading to complete
        await waitFor(() => {
            expect(getByTestId('loading-state').props.children).toBe('Not Loading');
        });
        
        // Trigger login
        await act(async () => {
            fireEvent.press(getByTestId('login-button'));
            // Fast-forward timer to handle the 1-second delay in the login function
            jest.advanceTimersByTime(1100);
        });
        
        // After login, user should be set
        await waitFor(() => {
            expect(getByTestId('user-email').props.children).toBe('test@example.com');
        }, { timeout: 2000 });
    });

    it('handles logout correctly', async () => {
        // Mock existing logged in user
        const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
        
        (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@auth_user') {
            return Promise.resolve(JSON.stringify(mockUser));
        }
        return Promise.resolve(null);
        });
        
        const { getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        
        // Wait for initial loading to complete and user to be loaded
        await waitFor(() => {
            expect(getByTestId('user-email').props.children).toBe('test@example.com');
        });
        
        // Trigger logout
        await act(async () => {
            fireEvent.press(getByTestId('logout-button'));
        });
        
        // After logout, user should be null
        expect(getByTestId('user-email').props.children).toBe('No user');
        
        // Check that AsyncStorage.removeItem was called
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@auth_user');
    });
});
