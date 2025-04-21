import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import IngredientsSection from '@/components/ui/ingredients-component/ingredients';
import StepsSection, { StepsUtils, StepItem } from "@/components/ui/steps-component/steps";

// Mocks
jest.mock('@/components/ui/text', () => {
  const { Text } = require('react-native');
  return { Text };
});
jest.mock('@/components/ui/vstack', () => ({
  VStack: ({ children }: any) => <>{children}</>,
}));
jest.mock('@/components/ui/button', () => {
  const { Text, Pressable } = require('react-native');
  return {
    Button: ({ children, onPress, isDisabled }: any) => (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        testID="add-button"
      >
        <Text>{children}</Text>
      </Pressable>
    ),
  };
});
jest.mock('@/components/ui/icon', () => ({
  Icon: () => <></>,
  CloseIcon: () => <></>,
  ChevronUpIcon: () => null,
  ChevronDownIcon: () => null,
}));
jest.mock('expo-font', () => ({
  useFonts: () => [true], // Pretend fonts are loaded
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true), // This is the key fix!
}));
// Mock drag-and-drop lib
jest.mock('react-native-reorderable-list', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ data, renderItem }: any) => (
      <View testID="reorderable-list">
        {data.map((item: any) => (
          <View key={item.id}>
            {renderItem({ item })}
          </View>
        ))}
      </View>
    ),
    useReorderableDrag: () => () => {},
    reorderItems: jest.fn((items, from, to) => {
      const newItems = [...items];
      const movedItem = newItems.splice(from, 1)[0];
      newItems.splice(to, 0, movedItem);
      return newItems;
    }),
  };
});

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  return {
    GestureHandlerRootView: ({ children }: any) => <View>{children}</View>,
  };
});

describe('IngredientsSection', () => {
  it('renders inputs and button', async () => {
    const setIngredients = jest.fn();
    const { getByPlaceholderText, getByTestId } = render(
      <IngredientsSection ingredients={[]} setIngredients={setIngredients} />
    );

    expect(getByPlaceholderText('Amount')).toBeTruthy();
    expect(getByPlaceholderText('Ingredient')).toBeTruthy();
    expect(getByTestId('add-button')).toBeTruthy();
  });

  it('adds an ingredient on button press', async () => {
    const setIngredients = jest.fn();
    const { getByPlaceholderText, getByTestId } = render(
      <IngredientsSection ingredients={[]} setIngredients={setIngredients} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Amount'), '1 cup');
    fireEvent.changeText(getByPlaceholderText('Ingredient'), 'Flour');

    act(() => {
      fireEvent.press(getByTestId('add-button'));
    });

    expect(setIngredients).toHaveBeenCalledWith(
      expect.any(Function) // We're using functional updates
    );
  });

  it('does not add ingredient if name is blank', async () => {
    const setIngredients = jest.fn();
    const { getByPlaceholderText, getByTestId } = render(
      <IngredientsSection ingredients={[]} setIngredients={setIngredients} />
    );
  
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Amount'), '1 cup');
      fireEvent.changeText(getByPlaceholderText('Ingredient'), '');
      fireEvent.press(getByTestId('add-button'));
    });
  
    expect(setIngredients).not.toHaveBeenCalled();
  });

  it('updates an existing ingredient', async () => {
    const ingredients = [{ name: 'Sugar', count: '2 tbsp' }];
    const setIngredients = jest.fn();
    const { getAllByPlaceholderText } = render(
      <IngredientsSection ingredients={ingredients} setIngredients={setIngredients} />
    );

    const countInput = getAllByPlaceholderText('Amount')[0];
    const nameInput = getAllByPlaceholderText('Ingredient')[0];

    fireEvent.changeText(countInput, '3 tbsp');
    fireEvent.changeText(nameInput, 'Brown Sugar');

    expect(setIngredients).toHaveBeenCalledTimes(2);
  });


  it('adds an ingredient on button press', async () => {
    const setIngredients = jest.fn();
    const { getByPlaceholderText, getByTestId } = render(
      <IngredientsSection ingredients={[]} setIngredients={setIngredients} />
    );
  
    fireEvent.changeText(getByPlaceholderText('Amount'), '1 cup');
    fireEvent.changeText(getByPlaceholderText('Ingredient'), 'Flour');
  
    await act(async () => {
      fireEvent.press(getByTestId('add-button'));
    });
  
    expect(setIngredients).toHaveBeenCalled();
  });
});

describe('StepsSection', () => {
  const mockSetSteps = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders input and add button', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <StepsSection steps={[]} setSteps={mockSetSteps} />
    );

    expect(getByPlaceholderText('Step')).toBeTruthy();
    expect(getByTestId('add-button')).toBeTruthy();
  });

  it('adds a step on button press', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <StepsSection steps={[]} setSteps={mockSetSteps} />
    );

    const input = getByPlaceholderText('Step');
    fireEvent.changeText(input, 'Preheat oven');

    act(() => {
      fireEvent.press(getByTestId('add-button'));
    });

    expect(mockSetSteps).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it('toggles a step’s expansion', async () => {
    const step = {
      id: 'step-1',
      text: 'Mix ingredients',
      expanded: false,
    };

    const { getByText } = render(
      <StepsSection steps={[step]} setSteps={mockSetSteps} />
    );

    const toggle = getByText('Step 1');

    act(() => {
      fireEvent.press(toggle);
    });

    expect(mockSetSteps).toHaveBeenCalled();
  });

  it('updates a step’s text on blur', async () => {
    const step = {
      id: 'step-1',
      text: 'Initial text',
      expanded: true,
    };

    const { getByPlaceholderText } = render(
      <StepsSection steps={[step]} setSteps={mockSetSteps} />
    );

    const input = getByPlaceholderText('Enter step details...');
    fireEvent.changeText(input, 'Updated text');
    fireEvent(input, 'blur');

    expect(mockSetSteps).toHaveBeenCalled();
  });

  it('removes a step when remove is pressed', async () => {
    const step = {
      id: 'step-1',
      text: 'Something to do',
      expanded: true,
    };

    const { getByTestId } = render(
      <StepsSection steps={[step]} setSteps={mockSetSteps} />
    );

    const removeBtn = getByTestId('remove-button-step-1');

    act(() => {
      fireEvent.press(removeBtn);
    });

    expect(mockSetSteps).toHaveBeenCalledWith(expect.any(Function));
  });

  it('reorders steps when onReorder is triggered', () => {
    const steps = [
      { id: '1', text: 'Step A', expanded: false },
      { id: '2', text: 'Step B', expanded: false },
    ];

    const { getByTestId } = render(
      <StepsSection steps={steps} setSteps={mockSetSteps} />
    );

    const reorderableList = getByTestId('reorderable-list');

    act(() => {
      StepsUtils.handleStepReorder({ from: 0, to: 1 }, mockSetSteps);
    });

    expect(mockSetSteps).toHaveBeenCalled();
  });
});

