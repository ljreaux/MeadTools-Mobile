import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

type CustomButtonProps = {
  title: string;
  handlePress: () => void;
  lightColor?: string;
  darkColor?: string;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
};

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  lightColor,
  darkColor,
}: CustomButtonProps) => {
  const [focused, setFocused] = useState(false);
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "tint"
  );
  const borderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "icon"
  );

  const focusedBorderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "tint"
  );

  const defaultStyles = StyleSheet.create({
    container: {
      backgroundColor,
      borderColor: focused ? focusedBorderColor : borderColor,
      minHeight: 62,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 10,
      opacity: isLoading ? 0.5 : 1,
    },
    text: {
      color: textColor,
      fontWeight: "bold",
      fontSize: 18,
    },
  });

  return (
    <TouchableOpacity
      style={defaultStyles.container}
      onPress={handlePress}
      disabled={isLoading}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={containerStyles}
    >
      <Text style={defaultStyles.text} className={textStyles}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
