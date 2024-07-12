import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

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
}

const FormField = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  placeholder,
  keyboardType,
}: FormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <ThemedText className="text-base">{title}</ThemedText>
      <ThemedView className="flex-row items-center w-full h-16 px-4 border-2 bg-textInput border-textBorder rounded-2xl focus:border-secondary">
        <TextInput
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
