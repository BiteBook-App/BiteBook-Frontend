import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Login from '@/app/(auth)';

// Silence console log
jest.spyOn(console, 'log').mockImplementation(() => {});

// Mock router
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
  Link: ({ children }: any) => children,
}));

// Mock auth
const mockLogin = jest.fn();
jest.mock('@/configs/authProvider', () => ({
  useAuth: () => ({
    user: null,
    login: mockLogin,
    register: jest.fn(),
    signInWithGoogle: jest.fn(),
  }),
}));

// Mock fonts
jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('@/components/ui/button', () => {
  const { View, Text } = require('react-native');
  return {
    Button: ({ children, testID, isDisabled }: any) => (
      <View testID={testID} accessibilityState={{ disabled: isDisabled }}>
        {children}
      </View>
    ),
    ButtonText: ({ children }: any) => <Text>{children}</Text>,
    ButtonIcon: () => <View />,
  };
});

describe('Login Screen', () => {
  beforeEach(() => {
    mockLogin.mockReset();
  });

  it('disables the sign in button when fields are empty', () => {
    const { getByTestId } = render(<Login />);
    const signInButton = getByTestId('sign-in-button');
    expect(signInButton.props.accessibilityState.disabled).toBe(true);
  });

  it('enables sign in button when email and password are entered', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<Login />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    const signInButton = getByTestId('sign-in-button');
    expect(signInButton.props.accessibilityState.disabled).toBe(false);
  });

  it('calls login with email and password when Sign in is pressed', async () => {
    mockLogin.mockResolvedValueOnce({}); // Mock success

    const { getByPlaceholderText, getByText } = render(<Login />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    fireEvent.press(getByText('Sign in'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123');
    });
  });

  it('shows an error message if login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

    const { getByPlaceholderText, getByText, findByText } = render(<Login />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');

    fireEvent.press(getByText('Sign in'));

    const errorMessage = await findByText(/incorrect email or password/i);
    expect(errorMessage).toBeTruthy();
  });
});
