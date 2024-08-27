import {
  TextInputProps,
  TextInput,
  StyleSheetProperties,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

type CustomInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

const CustomInput = ({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: CustomInputProps) => {
  const [focused, setFocused] = useState(false);

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );

  const borderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "icon"
  );

  const focusedBorderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "tint"
  );

  const baseStyles = StyleSheet.create({
    styles: {
      backgroundColor,
      color: textColor,
      borderColor: focused ? focusedBorderColor : borderColor,
      borderWidth: 0.5,
      paddingHorizontal: 12,
      paddingVertical: 14,
      borderRadius: 8,
      flex: 0.8,
      textAlign: "right",
      fontSize: 16,
    },
  });

  return (
    <TextInput
      style={[baseStyles.styles, style]}
      {...otherProps}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      selectTextOnFocus
    ></TextInput>
  );
};

export default CustomInput;
