import React from "react";
import { act, render, waitFor } from "@testing-library/react-native";
import { Alert, AlertText, AlertIcon } from "@/components/ui/alert";
import { ExternalLinkIcon, SearchIcon, StarIcon } from "@/components/ui/icon";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import CustomModal from "@/components/ui/custom-modal";
import { Spinner } from "@/components/ui/spinner";

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: "LinearGradient",
}));

jest.mock("@/configs/authProvider", () => ({
  useAuth: () => ({
    user: { uid: "mock-user-id", displayName: "Test User", email: "test@example.com" },
  }),
}));

jest.mock("@/components/ui/toast", () => {
  const actual = jest.requireActual("@/components/ui/toast");
  return {
    ...actual,
    useToast: () => ({
      show: jest.fn(),
      isActive: () => false,
    }),
  };
});

jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");

  return {
    ...actual,
    useQuery: jest.fn(() => ({
      loading: false,
      error: null,
      data: {
        getFriends: [
          {
            uid: "friend-1",
            displayName: "JaneDoe",
            createdAt: "2023-10-10T00:00:00.000Z",
            profilePicture: "https://example.com/jane.jpg",
          },
        ],
      },
      refetch: jest.fn(),
    })),
    useMutation: jest.fn(() => [
      jest.fn().mockResolvedValue({ data: { createRelationship: true } }),
      { loading: false, error: null },
    ]),
  };
});

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ request: "friend-123" }),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('react-native-share', () => ({
  default: {
    open: jest.fn(),
  },
}));

describe("Friends Page Components", () => {
  it("renders the Alert component correctly", () => {
    const { getByText, getByTestId } = render(
      <Alert>
        <AlertText>Test Alert</AlertText>
        <AlertIcon as={ExternalLinkIcon} testID="alert-icon" />
      </Alert>
    );

    expect(getByText("Test Alert")).toBeTruthy();
    expect(getByTestId("alert-icon")).toBeTruthy();
  });

  it("renders the Input with nested components", () => {
    const { getByPlaceholderText } = render(
      <Input>
        <InputSlot>
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField placeholder="Search friends" value="" onChangeText={() => {}} />
      </Input>
    );

    expect(getByPlaceholderText("Search friends")).toBeTruthy();
  });

  it("renders Avatar with fallback and image", () => {
    const { getByText, getByTestId } = render(
      <Avatar>
        <AvatarFallbackText>LS</AvatarFallbackText>
        <AvatarImage
          source={{ uri: "https://example.com/profile.jpg" }}
          testID="avatar-image"
        />
      </Avatar>
    );

    expect(getByText("L")).toBeTruthy();
    expect(getByTestId("avatar-image")).toBeTruthy();
  });

  it("renders a Toast correctly", () => {
    const { getByText } = render(
      <Toast nativeID="toast-123" action="success" variant="solid">
        <ToastTitle>Success</ToastTitle>
      </Toast>
    );
  
    expect(getByText("Success")).toBeTruthy();
  });

  it("renders the Spinner component", () => {
    const { getByTestId } = render(<Spinner size="large" testID="spinner" />);
    expect(getByTestId("spinner")).toBeTruthy();
  });
});