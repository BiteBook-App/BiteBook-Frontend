import { Tabs } from "expo-router";
import { Feather, Foundation, AntDesign, FontAwesome5 } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: "#181719", borderTopWidth: 0 },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#888",
        tabBarShowLabel: false,
        headerStyle: { backgroundColor: "#181719" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontFamily: "VVDSRashfield-Normal", fontSize: 20 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "BiteBook",
          tabBarIcon: ({ color, size }) => (
            <Foundation name="home" size={size} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" size={size} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Add Recipe",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircleo" size={size} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="taste"
        options={{
          title: "Taste",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="cookie-bite" size={size} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color}/>
          ),
        }}
      />
    </Tabs>
  );
}
