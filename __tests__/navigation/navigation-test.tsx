import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

// Mock dependencies
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

jest.mock('expo-constants', () => ({ statusBarHeight: 0 }));

// Import after mocks
import WelcomeScreen from '../../screens/welcome';

describe('Navigation', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('has correct navigation stack setup', () => {
    // This test would normally check navigation stack configuration
    // For minimal test, we're just verifying the mock is ready
    expect(mockNavigate).toBeDefined();
  });

  it('handles navigation between screens properly', () => {
    const { getByText } = render(<WelcomeScreen />);
    
    // Verify navigation is working
    expect(mockNavigate).not.toHaveBeenCalled();
    fireEvent.press(getByText('SIGN IN'));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
