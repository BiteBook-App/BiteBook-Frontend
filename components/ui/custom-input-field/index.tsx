import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { EyeOffIcon, EyeIcon } from "@/components/ui/icon";
import { ViewStyle } from "react-native";

interface CustomInputFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: React.ElementType;
  isPassword?: boolean;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
  style?: ViewStyle;
}

export default function CustomInputField({
  placeholder,
  value,
  onChangeText,
  icon: IconComponent,
  isPassword = false,
  showPassword,
  togglePasswordVisibility,
  style,
}: CustomInputFieldProps) {
  return (
    <Input
      className="bg-background-0 rounded-xl border-0 opacity-70"
      size="xl"
      style={style}
    >
      <InputSlot className="pl-4">
        <InputIcon as={IconComponent} />
      </InputSlot>

      <InputField
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        spellCheck={false}
        autoCorrect={false}
        type={isPassword && !showPassword ? "password" : "text"}
      />

      {isPassword && (
        <InputSlot className="pr-4" onPress={togglePasswordVisibility}>
          <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
        </InputSlot>
      )}
    </Input>
  );
}