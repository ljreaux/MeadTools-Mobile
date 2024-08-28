import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

const icons = {
  eye: <Icon name="eye" size={24} color="hsl(38, 54%, 56%)" />,
  eyeHide: <Icon name="eye-slash" size={24} color="hsl(38, 54%, 56%)" />,
};

interface FormProps {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  keyboardType?: "email-address";
  lightColor?: string;
  darkColor?: string;
}

const FormField = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  placeholder,
  keyboardType,
  lightColor,
  darkColor,
}: FormProps) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      paddingVertical: 18,
      borderRadius: 8,
      flex: 0.8,
      textAlign: "right",
      fontSize: 18,
      flexDirection: "row",
    },
  });
  return (
    <View className="space-y-2">
      <ThemedText className="text-base">{title}</ThemedText>
      <ThemedView style={baseStyles.styles}>
        <TextInput
          style={{ color: baseStyles.styles.color }}
          className="flex-1 text-base "
          onChangeText={handleChangeText}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          secureTextEntry={title === "Password" && !showPassword}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {!showPassword ? icons.eye : icons.eyeHide}
          </TouchableOpacity>
        )}
      </ThemedView>
    </View>
  );
};

export default FormField;
