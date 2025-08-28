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

describe('WelcomeScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders welcome screen with title text', () => {
    const { getByText } = render(<WelcomeScreen />);
    expect(getByText('Cloud Storage Simplified')).toBeTruthy();
  });

  it('navigates to Login screen when Sign In button is pressed', () => {
    const { getByText } = render(<WelcomeScreen />);
    fireEvent.press(getByText('SIGN IN'));
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('navigates to Signup screen when Sign Up button is pressed', () => {
    const { getByText } = render(<WelcomeScreen />);
    fireEvent.press(getByText('SIGN UP'));
    expect(mockNavigate).toHaveBeenCalledWith('Signup');
  });
});
