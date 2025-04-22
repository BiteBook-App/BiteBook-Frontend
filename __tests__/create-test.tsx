import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateRecipe from '@/app/(app)/(tabs)/(create)';
import { Ionicons } from '@expo/vector-icons';

// Mock navigation, auth, GraphQL, and image picker
jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
}));
jest.mock('@/configs/authProvider', () => ({
  useAuth: () => ({
    user: { uid: 'test-user' },
    storage: {},
  }),
}));
jest.mock('@apollo/client', () => {
  const original = jest.requireActual('@apollo/client');
  return {
    ...original,
    useMutation: () => [
      jest.fn(() => Promise.resolve({ data: {} })),
      { loading: false, error: null },
    ],
  };
});
jest.mock('@/components/ui/camera-component/camera-functionality', () => ({
  useImagePicker: () => ({
    uploadImage: jest.fn(() => Promise.resolve('https://fake.image.url')),
  }),
}));

// Mock subcomponents
jest.mock('@/components/ui/camera-component/camera', () => () => <></>);
jest.mock('@/components/ui/tastes-component/tastes', () => () => <></>);
jest.mock('@/components/ui/ingredients-component/ingredients', () => () => <></>);
jest.mock('@/components/ui/steps-component/steps', () => () => <></>);
jest.mock('@/components/ui/custom-modal', () => {
    const { Text, Pressable } = require('react-native');
    return ({ isOpen, onClose, modalTitle, modalBody, modalAction, modalActionText }: any) => {
      if (!isOpen) return null;
      return (
        <>
          <Text>{modalTitle}</Text>
          <Text>{modalBody}</Text>
          <Pressable onPress={modalAction} testID="modal-confirm">
            <Text>{modalActionText}</Text>
          </Pressable>
          <Pressable onPress={onClose} testID="modal-close">
            <Text>Close</Text>
          </Pressable>
        </>
      );
    };
  });

// UI mocks
jest.mock('@/components/ui/text', () => {
  const { Text } = require('react-native');
  return { Text };
});
jest.mock('@/components/ui/vstack', () => ({
  VStack: ({ children }: any) => <>{children}</>,
}));
jest.mock('@/components/ui/hstack', () => ({
  HStack: ({ children }: any) => <>{children}</>,
}));
jest.mock('@/components/ui/button', () => {
  const { Pressable, Text } = require('react-native');
  return {
    Button: ({ children, onPress, testID, isDisabled, ...rest }: any) => (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        testID={testID || 'button'}
        accessibilityState={{ disabled: !!isDisabled }}
        {...rest}
      >
        {children}
      </Pressable>
    ),
    ButtonText: ({ children }: any) => <Text>{children}</Text>,
  };
});
jest.mock('@/components/ui/spinner', () => ({
  Spinner: () => <></>,
}));
jest.mock('@/components/ui/form-control', () => ({
  FormControl: ({ children }: any) => <>{children}</>,
  FormControlError: ({ children }: any) => <>{children}</>,
  FormControlErrorIcon: () => null,
  FormControlErrorText: ({ children }: any) => <>{children}</>,
}));
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => <>{children}</>,
}));
jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    GestureHandlerRootView: ({ children }: any) => <View>{children}</View>,
  };
});
jest.mock('@/components/ui/icon', () => ({
  Icon: () => <></>,
  CloseCircleIcon: () => <></>,
  TrashIcon: () => <></>
}));
jest.mock('expo-font', () => {
  const loadedNativeFonts = new Set();

  return {
    __esModule: true,
    loadAsync: jest.fn(() => Promise.resolve()),
    isLoaded: jest.fn(() => true),
    useFonts: () => [true],
    Font: {
      loadAsync: jest.fn(() => Promise.resolve()),
    },
    loadedNativeFonts, // 👈 this fixes the `.forEach is not a function` error
  };
});
jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather', // Or any other icon you might use
  Ionicons: 'Ionicons', // Or other icon sets if used
}));

describe('CreateRecipe screen', () => {
  it('renders basic layout', () => {
    const { getByPlaceholderText, getByText } = render(<CreateRecipe />);
    expect(getByText('Add a Recipe')).toBeTruthy();
    expect(getByPlaceholderText('Recipe Link')).toBeTruthy();
    expect(getByPlaceholderText('Meal Name')).toBeTruthy();
    expect(getByText('Yes')).toBeTruthy();
    expect(getByText('No')).toBeTruthy();
  });

  it('disables import button if link is empty', () => {
    const { getByPlaceholderText, getAllByTestId } = render(<CreateRecipe />);
    const importBtn = getAllByTestId('button')[0]; // First button is likely the import one
    expect(importBtn.props.accessibilityState?.disabled || false).toBe(true);
  });

  it('toggles "have you cook this" button', () => {
    const { getByText, queryByText } = render(<CreateRecipe />);
  
    const noBtn = getByText('No');
    fireEvent.press(noBtn);
    expect(getByText('This recipe will be saved as a draft.')).toBeTruthy();
  
    const yesBtn = getByText('Yes');
    fireEvent.press(yesBtn);
    expect(queryByText('This recipe will be saved as a draft.')).toBeNull();
  });

  it('triggers modal when clear recipe button is pressed', async () => {
    const { getByText, getByTestId } = render(<CreateRecipe />);
    const clearButton = getByText('Clear recipe');
    fireEvent.press(clearButton);

    await waitFor(() => {
      expect(getByTestId('modal-confirm')).toBeTruthy();
    });

    fireEvent.press(getByTestId('modal-confirm'));
  });

  it('disables submit button if form is incomplete', () => {
    const { getByTestId } = render(<CreateRecipe />);
    const submitButton = getByTestId('submit-button');
  
    // Confirm it's disabled — should have accessibilityState from mock
    expect(submitButton.props.accessibilityState?.disabled).toBe(true);
  });
});
