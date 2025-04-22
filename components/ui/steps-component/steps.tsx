import React, { useState, useRef, memo, useCallback, useEffect } from "react";
import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon, CloseIcon, ChevronUpIcon, ChevronDownIcon } from "@/components/ui/icon";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReorderableList, {
  ReorderableListReorderEvent,
  reorderItems,
  useReorderableDrag,
} from 'react-native-reorderable-list';

export type StepItem = {
  text: string;
  expanded: boolean;
  id: string;
};

const DraggableStep = memo(({ 
  item, 
  stepNumber,
  onToggle, 
  onRemove, 
  onUpdate,
  stepTextRefs 
}: {
  item: StepItem;
  stepNumber: number;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  stepTextRefs: React.MutableRefObject<Record<string, string>>;
}) => {
  const drag = useReorderableDrag();
  const [localText, setLocalText] = useState(item.text);

  // Update the ref whenever localText changes
  useEffect(() => {
    stepTextRefs.current[item.id] = localText;
  }, [localText, item.id, stepTextRefs]);

  // Update local state when item.text changes (from parent)
  useEffect(() => {
    setLocalText(item.text);
  }, [item.text]);

  const handleToggle = () => onToggle(item.id);
  const handleBlur = () => onUpdate(item.id, localText);
  const handleDragPress = () => onUpdate(item.id, localText);

  return (
    <View className="rounded-2xl bg-background-50 p-4 mb-3">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          onPress={handleToggle}
          className="flex-1 flex-row items-center"
          activeOpacity={0.7}
        >
          <Text className="text-lg font-bold text-white">Step {stepNumber}</Text>
          <Icon
            as={item.expanded ? ChevronUpIcon : ChevronDownIcon}
            className="text-white ml-2"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onLongPress={() => { drag(); handleDragPress(); }}
          delayLongPress={200}
          className="px-2"
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="drag" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {item.expanded && (
        <View className="mt-2 flex-row justify-between items-start">
          <TextInput
            value={localText}
            onChangeText={setLocalText}
            onBlur={handleBlur}
            multiline={true}
            className="text-white text-base flex-1 p-2 bg-transparent"
            style={{ fontSize: 16 }}
            placeholder="Enter step details..."
            placeholderTextColor="#8C8C8C"
          />
          <TouchableOpacity
            onPress={() => onRemove(item.id)}
            className="mr-3 mt-2"
            activeOpacity={0.7}
            testID={`remove-button-${item.id}`}
          >
            <Icon as={CloseIcon} className="text-white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

// Create a utility object with reusable functions
export const StepsUtils = {
  // Generate unique ID helper
  generateUniqueId: () => {
    return Date.now().toString() + Math.random().toString(36).substring(7);
  },

  // Step management utilities
  addStep: (currentStep: string, currentSteps: StepItem[], setSteps: React.Dispatch<React.SetStateAction<StepItem[]>>, setStep: React.Dispatch<React.SetStateAction<string>>) => {
    if (currentStep.trim() === "") return;
    
    setSteps(prev => [...prev, { 
      text: currentStep, 
      expanded: false, 
      id: StepsUtils.generateUniqueId()
    }]);
    setStep("");
  },

  removeStep: (id: string, setSteps: React.Dispatch<React.SetStateAction<StepItem[]>>) => {
    setSteps(prev => prev.filter((item) => item.id !== id));
  },

  saveAllStepsContent: (stepTextRefs: React.MutableRefObject<Record<string, string>>, setSteps: React.Dispatch<React.SetStateAction<StepItem[]>>) => {
    if (stepTextRefs.current) {
      setSteps(prevSteps => 
        prevSteps.map(step => {
          const localText = stepTextRefs.current[step.id];
          return localText !== undefined ? { ...step, text: localText } : step;
        })
      );
    }
  },

  updateStep: (id: string, text: string, stepTextRefs: React.MutableRefObject<Record<string, string>>, setSteps: React.Dispatch<React.SetStateAction<StepItem[]>>) => {
    StepsUtils.saveAllStepsContent(stepTextRefs, setSteps);
    
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === id ? { ...step, text } : step
      )
    );
  },

  toggleStep: (id: string, stepTextRefs: React.MutableRefObject<Record<string, string>>, setSteps: React.Dispatch<React.SetStateAction<StepItem[]>>) => {
    StepsUtils.saveAllStepsContent(stepTextRefs, setSteps);
    setSteps(prevSteps =>
      prevSteps.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  },

  handleStepReorder: (event: ReorderableListReorderEvent, setSteps: React.Dispatch<React.SetStateAction<StepItem[]>>) => {
    setSteps(value => reorderItems(value, event.from, event.to));
  },

  // Import steps from recipe API data
  importStepsFromRecipe: (instructions: { text: string }[], setSteps: React.Dispatch<React.SetStateAction<StepItem[]>>) => {
    setSteps(instructions.map((instruction) => ({
      text: instruction.text || "",
      expanded: true,
      id: StepsUtils.generateUniqueId()
    })));
  }
};

// Main component
const StepsSection = ({ 
  steps, 
  setSteps, 
  className = ""
}: {
  steps: StepItem[];
  setSteps: React.Dispatch<React.SetStateAction<StepItem[]>>;
  className?: string;
}) => {
  const [step, setStep] = useState("");
  const stepTextRefs = useRef<Record<string, string>>({});

  // Step management functions
  const addStep = useCallback(() => {
    StepsUtils.addStep(step, steps, setSteps, setStep);
  }, [step, steps, setSteps]);

  const handleRemoveStep = useCallback((id: string) => {
    StepsUtils.removeStep(id, setSteps);
  }, [setSteps]);

  const saveAllStepsContent = useCallback(() => {
    StepsUtils.saveAllStepsContent(stepTextRefs, setSteps);
  }, [setSteps, stepTextRefs]);

  const handleUpdateStep = useCallback((id: string, text: string) => {
    StepsUtils.updateStep(id, text, stepTextRefs, setSteps);
  }, [setSteps, stepTextRefs]);

  const handleToggleStep = useCallback((id: string) => {
    StepsUtils.toggleStep(id, stepTextRefs, setSteps);
  }, [setSteps, stepTextRefs]);

  const onStepReorder = useCallback((event: ReorderableListReorderEvent) => {
    StepsUtils.handleStepReorder(event, setSteps);
  }, [setSteps]);

  // Memoized renderStepItem function to prevent unnecessary re-renders
  const renderStepItem = useCallback(({ item }: { item: StepItem }) => {
    const stepNumber = steps.findIndex(s => s.id === item.id) + 1;
    
    return (
      <DraggableStep 
        item={item} 
        stepNumber={stepNumber}
        onToggle={handleToggleStep}
        onRemove={handleRemoveStep}
        onUpdate={handleUpdateStep}
        stepTextRefs={stepTextRefs}
      />
    );
  }, [steps, handleToggleStep, handleRemoveStep, handleUpdateStep]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className={`bg-background-0 rounded-2xl border-0 opacity-70 p-5 ${className}`} style={{ flexGrow: 1, maxHeight: 480 }}>
        {steps.length > 0 && (
          <ReorderableList
            data={steps}
            renderItem={renderStepItem}
            onReorder={onStepReorder}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
          />
        )}
        
        <View className="rounded-2xl bg-background-0 mt-2 flex-row items-center">
          <TextInput
            placeholder="Step"
            value={step}
            onChangeText={setStep}
            multiline={true}
            className="p-5 flex-1"
            style={{ color: "white", fontSize: 16 }}
            placeholderTextColor="#8C8C8C"
          />
        </View>
        <Button 
          className="rounded-xl mt-5" 
          size="md" 
          variant="solid" 
          action="primary" 
          onPress={addStep} 
          isDisabled={!step.trim()}
        >
          <Feather name="plus" size={20} color="black" />
        </Button>
      </View>
    </GestureHandlerRootView>
  );
};

export default StepsSection;