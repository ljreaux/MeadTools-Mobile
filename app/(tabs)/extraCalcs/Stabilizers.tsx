import {
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { Keyboard } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import Sorbate from "@/components/Sorbate";
import Sulfite from "@/components/Sulfite";

const Stabilizers = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView>
        <ThemedView className="items-center justify-center py-10">
          <Sorbate />
          <Sulfite />
        </ThemedView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Stabilizers;
