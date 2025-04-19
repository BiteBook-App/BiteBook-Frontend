import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import RecipeComponent from '@/components/ui/custom-recipe';
import RecipePost from '@/components/ui/custom-recipe-post';

// 🔧 Mocks
jest.mock('@/configs/authProvider', () => ({
  useAuth: () => ({ user: { uid: 'user-123' } }),
}));

// Mock router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock image rendering
jest.mock('react-native/Libraries/Image/Image', () => 'Image');

// Mock formatDate if needed (or use actual function if deterministic)
jest.mock('@/components/ui/custom-data-utils', () => ({
  formatDate: jest.fn((date) => `Formatted(${date})`),
}));

// Mock custom components to simplify output
jest.mock('@/components/ui/text', () => {
  const { Text } = require('react-native');
  return {
      Text,
  };
});
jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children }: any) => <>{children}</>,
  AvatarImage: () => null,
  AvatarFallbackText: ({ children }: any) => <>{children}</>,
}));
jest.mock('@/components/ui/button', () => {
  const { Text } = require('react-native');
  return {
    Button: ({ children }: any) => <Text>{children}</Text>,
    ButtonText: ({ children }: any) => <Text>{children}</Text>,
  };
});
jest.mock('@/components/ui/link', () => ({
  Link: ({ children }: any) => <>{children}</>,
  LinkText: ({ children }: any) => <>{children}</>,
}));
jest.mock('@/components/ui/icon', () => ({
  Icon: () => null,
  LinkIcon: () => null,
}));
jest.mock('@/components/ui/custom-collapsible-item', () => ({
  __esModule: true,
  default: ({ text }: any) => <>{text}</>,
}));
jest.mock('@/components/ui/vstack', () => ({
  VStack: ({ children }: any) => <>{children}</>,
}));
jest.mock('@/components/ui/hstack', () => ({
  HStack: ({ children }: any) => <>{children}</>,
}));
jest.mock('@/components/ui/spinner', () => {
    const { Text } = require('react-native');
    return {
        Spinner: () => <Text>Loading...</Text>,
    };
});

// Apollo mock
jest.mock('@apollo/client', () => {
  const actual = jest.requireActual('@apollo/client');
  return {
    ...actual,
    useQuery: () => ({
      loading: false,
      error: null,
      data: {
        getRecipe: {
          uid: 'recipe-1',
          name: 'Test Recipe',
          photoUrl: 'https://example.com/image.jpg',
          createdAt: '2024-01-01',
          lastUpdatedAt: '2024-01-05',
          url: '',
          tastes: ['Sweet'],
          user: {
            uid: 'user-123',
            displayName: 'Test User',
            profilePicture: 'https://example.com/profile.jpg',
          },
          ingredients: [
            { count: '1 cup', name: 'Flour' },
            { count: '2 tbsp', name: 'Sugar' },
          ],
          steps: [
            { text: 'Mix ingredients', expanded: true },
            { text: 'Bake at 350°F', expanded: true },
          ],
        },
      },
      refetch: jest.fn(),
    }),
  };
});

describe('RecipeComponent', () => {
  it('renders recipe name and user info', async () => {
    render(<RecipeComponent recipeId="recipe-1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Recipe')).toBeTruthy();
      expect(screen.getByText('Test User')).toBeTruthy();
    });
  });

  it('renders ingredients', () => {
    render(<RecipeComponent recipeId="recipe-1" />);
    
    expect(screen.getByText(/1 cup/)).toBeTruthy();
    expect(screen.getByText(/Flour/)).toBeTruthy();
    expect(screen.getByText(/2 tbsp/)).toBeTruthy();
    expect(screen.getByText(/Sugar/)).toBeTruthy();
  });

  it('shows "No link provided" when url is empty', () => {
    render(<RecipeComponent recipeId="recipe-1" />);
    expect(screen.getByText('No link provided')).toBeTruthy();
  });

  it('navigates to profile if user is the owner', () => {
    const { getByTestId } = render(<RecipeComponent recipeId="recipe-1" />);
    fireEvent.press(getByTestId('user-pressable'));
    expect(mockPush).toHaveBeenCalledWith('/(app)/(tabs)/(profile)');
  });
});

describe('RecipePost Component', () => {
  const props = {
    photoUrl: 'https://example.com/image.jpg',
    mealName: 'Delicious Pasta',
    tastes: ['Savory', 'Spicy'],
    createdAt: '2024-01-01T00:00:00Z',
    lastUpdatedAt: '2024-01-03T00:00:00Z',
    size: 'large' as const,
    color: 'white',
  };

  it('renders meal name, image, tastes, and formatted dates', () => {
    const { getByText, getAllByText, getByRole, getByTestId } = render(<RecipePost {...props} />);

    // Meal name
    expect(getByText('Delicious Pasta')).toBeTruthy();

    // Created and updated dates
    expect(getByText(`Formatted(${props.createdAt})`)).toBeTruthy();
    expect(getByText(`Last Updated: Formatted(${props.lastUpdatedAt})`)).toBeTruthy();

    // Taste tags
    expect(getByText('Savory')).toBeTruthy();
    expect(getByText('Spicy')).toBeTruthy();
  });

  it('does not show dates when size is small', () => {
    const { queryByText } = render(
      <RecipePost {...props} size="small" />
    );

    expect(queryByText(`Formatted(${props.createdAt})`)).toBeNull();
    expect(queryByText(`Last Updated: Formatted(${props.lastUpdatedAt})`)).toBeNull();
  });

  it('renders the correct number of taste buttons', () => {
    const { getAllByText } = render(<RecipePost {...props} />);
    const buttons = getAllByText(/Savory|Spicy/);
    expect(buttons.length).toBe(2);
  });
});
