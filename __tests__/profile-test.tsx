import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing';
import ProfileComponent from '@/components/ui/custom-profile';
import Profile from '@/app/(app)/(tabs)/(profile)/index'; // Adjust path if needed
import { useRouter } from 'expo-router';
import { GET_PROFILE, GET_RECIPE_PREVIEW, GET_DRAFT_PREVIEW } from '@/configs/queries';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/configs/authProvider', () => ({
  useAuth: () => ({
    user: { uid: 'user-123' },
  }),
}));

// Mock Icons
jest.mock('@expo/vector-icons', () => ({
    Feather: 'Feather', // Or any other icon you might use
    MaterialIcons: 'MaterialCommunityIcons', // Or other icon sets if used
}));

// Sample mock data
const mocks = [
  {
    request: {
      query: GET_RECIPE_PREVIEW,
      variables: { userId: 'user-123' },
    },
    result: {
      data: {
        getRecipes: [
          {
            uid: 'recipe-1',
            name: 'Spaghetti',
            photoUrl: 'https://example.com/spaghetti.jpg',
            createdAt: '2024-01-01',
            lastUpdatedAt: '2024-01-05',
            tastes: ['Savory'],
          },
        ],
      },
    },
  },
  {
    request: {
      query: GET_DRAFT_PREVIEW,
      variables: { userId: 'user-123' },
    },
    result: {
      data: {
        getRecipes: [
          {
            uid: 'draft-1',
            name: 'Draft Meal',
            photoUrl: 'https://example.com/draft.jpg', // Added
            createdAt: '2024-02-01',
            lastUpdatedAt: '2024-02-10', // Added
            tastes: ['Sweet'],
          },
        ],
      },
    },
  },
  {
    request: {
      query: GET_PROFILE,
      variables: { uid: 'user-123' },
    },
    result: {
      data: {
        getUsers: [
          {
            displayName: 'Some User',
            profilePicture: 'https://example.com/pic.jpg',
            relationships: [],
          },
        ],
      },
    },
  },
];

describe('Profile information component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  const defaultProps = {
    displayName: 'Jane Doe',
    profilePicture: 'https://example.com/profile.jpg',
    numPosts: 5,
    numFriends: 12,
    displayOptions: true,
  };

  it('renders profile info correctly', () => {
    const { getByText } = render(<ProfileComponent {...defaultProps} />);

    expect(getByText('Jane Doe')).toBeTruthy();
    expect(getByText('5 posts')).toBeTruthy();
    expect(getByText('12 people in your circle')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
    expect(getByText('Share Profile')).toBeTruthy();
  });

  it('hides settings/share buttons when displayOptions is false', () => {
    const { queryByText } = render(
      <ProfileComponent {...defaultProps} displayOptions={false} />
    );

    expect(queryByText('Settings')).toBeNull();
    expect(queryByText('Share Profile')).toBeNull();
    expect(queryByText('12 people in their circle')).toBeTruthy();
  });

  it('navigates to settings on settings button press', () => {
    const { getByText } = render(<ProfileComponent {...defaultProps} />);
    const settingsButton = getByText('Settings');

    fireEvent.press(settingsButton);

    expect(mockPush).toHaveBeenCalledWith('/(app)/(tabs)/(profile)/settings');
  });
});

describe('Profile Tabs', () => {
  it('renders only posts by default', async () => {
    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Profile />
      </MockedProvider>
    );

    await waitFor(() => getByText('Spaghetti'));

    expect(getByText('Spaghetti')).toBeTruthy();
    expect(queryByText('Draft Meal')).toBeNull();
  });

  it('renders draft recipes when switching to Drafts tab', async () => {
    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Profile />
      </MockedProvider>
    );

    await waitFor(() => getByText('Spaghetti'));

    fireEvent.press(getByText('Drafts'));

    await waitFor(() => getByText('Draft Meal'));

    expect(getByText('Draft Meal')).toBeTruthy();
    expect(queryByText('Spaghetti')).toBeNull();
  });
});