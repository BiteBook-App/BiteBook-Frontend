import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Icon, ChevronUpIcon, ChevronDownIcon } from "@/components/ui/icon"

interface Step {
  expanded: Boolean
  text: String
  stepNumber: number
}

export default function CollapsibleItem({ expanded, text, stepNumber }: Step) {
  const [currExpanded, setExpanded] = useState(expanded);

  return (
    <View className="rounded-2xl bg-background-50 p-4 mt-3">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => setExpanded(!currExpanded)}
          className="flex-1 flex-row items-center justify-between"
          activeOpacity={0.7}
        >
          <Text className="font-bold text-white" size="lg">Step {stepNumber}</Text>
          <Icon
            as={currExpanded ? ChevronUpIcon : ChevronDownIcon}
            className="text-white ml-2"
          />
        </TouchableOpacity>
      </View>

      {currExpanded && (
        <View className="mt-2 flex-row justify-between items-start">
          <Text
            className="text-white text-base flex-1 p-2 bg-transparent"
          >
            { text }
          </Text>
        </View>
      )}
    </View>
  );
}
