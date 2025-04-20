import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Tips from '@/components/ui/custom-taste-tips';
import BarChart from '@/components/ui/custom-bar-chart';
import Recommendations from '@/components/ui/custom-recommendations';

// Mock user
jest.mock('@/configs/authProvider', () => ({
  useAuth: () => ({
    user: { uid: 'user-123' },
  }),
}));
  
// Mock router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));
  
// Mock Post component
jest.mock('@/components/ui/custom-recipe-post', () => {
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ mealName }: { mealName: string }) => <Text>{mealName}</Text>,
  };
});

describe('Tips component', () => {
  it('renders placeholder when showPlaceholder is true', () => {
    render(<Tips showPlaceholder={true} />);

    expect(
      screen.getByText('No thoughts just yet. Add a recipe to view!')
    ).toBeTruthy();

    // Optionally test the placeholder Box exists by style/structure
  });

  it('renders tip message when showPlaceholder is false', () => {
    render(
      <Tips
        showPlaceholder={false}
        numRecipes={3}
        numTastes={4}
        favoriteTaste="Spicy"
      />
    );

    expect(
      screen.getByText(
        /You cooked 3 new recipes this month and explored 4 taste profiles, with Spicy being your favorite/
      )
    ).toBeTruthy();
  });
});


describe('BarChart component', () => {
    it('renders placeholder message when no data is provided', () => {
      render(<BarChart />); // uses placeholderData by default
  
      expect(
        screen.getByText('No data to display. Add a recipe to view!')
      ).toBeTruthy();
  
      // Ensure all taste labels still show up
      const tastes = ['Salty', 'Umami', 'Sweet', 'Sour', 'Bitter', 'Spicy'];
      tastes.forEach((taste) => {
        expect(screen.getByText(taste)).toBeTruthy();
      });
  
      // Percentages should NOT be rendered because all are 0
      tastes.forEach((taste) => {
        expect(screen.queryByText('0%')).toBeNull();
      });
    });
  
    it('renders percentage bars and values when tasteProfile is provided', () => {
      const mockData = [
        { taste: 'Salty', percentage: 0.5 },
        { taste: 'Sweet', percentage: 0.25 },
      ];
  
      render(<BarChart tasteProfile={mockData} />);
  
      // Should not show placeholder message
      expect(
        screen.queryByText('No data to display. Add a recipe to view!')
      ).toBeNull();
  
      // Taste names
      expect(screen.getByText('Salty')).toBeTruthy();
      expect(screen.getByText('Sweet')).toBeTruthy();
  
      // Percentages (rounded)
      expect(screen.getByText('50%')).toBeTruthy();
      expect(screen.getByText('25%')).toBeTruthy();
    });
});

describe('Recommendations component', () => {
  const mockRecommendations = [
    {
      uid: 'recipe-1',
      name: 'Spaghetti',
      photoUrl: 'https://example.com/spaghetti.jpg',
      tastes: ['Savory'],
      createdAt: '2024-01-01',
      lastUpdatedAt: '2024-01-05',
      user: {
        uid: 'friend-1',
        displayName: 'Alice',
        profilePicture: 'https://example.com/alice.jpg',
      },
    },
    {
      uid: 'recipe-2',
      name: 'Tacos',
      photoUrl: 'https://example.com/tacos.jpg',
      tastes: ['Spicy'],
      createdAt: '2024-01-10',
      lastUpdatedAt: '2024-01-12',
      user: {
        uid: 'friend-2',
        displayName: 'Bob',
        profilePicture: 'https://example.com/bob.jpg',
      },
    },
  ];

  it('renders all recommendation cards with display names and meal names', () => {
    render(<Recommendations recommendations={mockRecommendations} />);

    // Display names
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();

    // Post meal names (via mocked <Post />)
    expect(screen.getByText('Spaghetti')).toBeTruthy();
    expect(screen.getByText('Tacos')).toBeTruthy();
  });

  it('navigates to user profile when avatar row is pressed', () => {
    render(<Recommendations recommendations={mockRecommendations} />);

    const aliceRow = screen.getByText('Alice').parent?.parent;
    fireEvent.press(aliceRow as any);

    expect(mockPush).toHaveBeenCalledWith('/(app)/(tabs)/(taste)/(friend)/friend-1');
  });

  it('navigates to recipe detail when post is pressed', () => {
    render(<Recommendations recommendations={mockRecommendations} />);

    const tacoCard = screen.getByText('Tacos');
    fireEvent.press(tacoCard);

    expect(mockPush).toHaveBeenCalledWith('/(app)/(tabs)/(taste)/recipe-2');
  });
});
