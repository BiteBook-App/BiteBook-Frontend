import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Home from '@/app/(app)/(tabs)/(home)';
import { useRouter } from 'expo-router';
import { useQuery } from '@apollo/client';
import { useAuth } from '@/configs/authProvider';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/configs/authProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn(),
}));

jest.mock('@/configs/queries', () => ({
  GET_HOME_PAGE: 'mocked-query',
}));

jest.mock('react-native/Libraries/LogBox/LogBox', () => ({
  ignoreAllLogs: jest.fn(),
}));

jest.mock('@/components/ui/custom-recipe-post', () => {
  const { Text } = require('react-native');
  return () => <Text>Post</Text>;
});

jest.mock('@/components/ui/custom-no-recipes-display', () => {
  const { Text } = require('react-native');
  return () => <Text>NoRecipes</Text>;
});

describe('Home Screen', () => {
  const mockPush = jest.fn();
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAuth as jest.Mock).mockReturnValue({ user: { uid: 'user123' } });
  });

  it('renders NoRecipes if there are no posts', () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      data: { getHomePageRecipes: [] },
      refetch: mockRefetch
    });

    const { getByText } = render(<Home />);
    expect(getByText('NoRecipes')).toBeTruthy();
  });

  it('renders list of posts and navigates correctly', async () => {
    const recipe = {
      uid: 'post1',
      name: 'Matcha Latte',
      createdAt: '2025-04-19',
      lastUpdatedAt: '2025-04-20',
      photoUrl: 'http://example.com/image.jpg',
      tastes: ['Sweet'],
      user: {
        uid: 'user123', // same as logged in user
        displayName: 'Michelle',
        profilePicture: 'http://example.com/avatar.jpg',
      },
    };

    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      data: { getHomePageRecipes: [recipe] },
      refetch: mockRefetch,
    });

    const { getByText } = render(<Home />);

    const name = getByText('Michelle');
    fireEvent.press(name);
    expect(mockPush).toHaveBeenCalledWith('/(app)/(tabs)/(profile)');

    const postPressable = getByText('Post'); // From the mocked component
    fireEvent.press(postPressable);
    expect(mockPush).toHaveBeenCalledWith('/(app)/(tabs)/(home)/post1');
  });

  it('navigates to friend page if user is not the logged in user', () => {
    const recipe = {
      uid: 'post2',
      name: 'Avocado Toast',
      createdAt: '2025-04-19',
      lastUpdatedAt: '2025-04-20',
      photoUrl: 'http://example.com/image.jpg',
      tastes: ['Savory'],
      user: {
        uid: 'friend456',
        displayName: 'Alex',
        profilePicture: 'http://example.com/avatar2.jpg',
      },
    };

    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      data: { getHomePageRecipes: [recipe] },
      refetch: mockRefetch,
    });

    const { getByText } = render(<Home />);
    const name = getByText('Alex');
    fireEvent.press(name);
    expect(mockPush).toHaveBeenCalledWith('/(app)/(tabs)/(home)/(friend)/friend456');
  });
});
