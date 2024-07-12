import { Stack, Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { tags } from "react-native-svg/lib/typescript/xml";

export default function TabLayout() {
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: textColor,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user-o" color={color} />
          ),
          tabBarLabel: "Account",
        }}
      />
      <Tabs.Screen
        name="extraCalcs"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="balance-scale" color={color} />
          ),
          tabBarLabel: "Extra Calculators",
        }}
      />
    </Tabs>
  );
}
