import CustomButton from "@/components/CustomButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, TextInput } from "react-native";

const submit = () => {
  const backgroundColor = useThemeColor({}, "background");
  return (
    <SafeAreaView
      className={"h-screen items-center justify-center"}
      style={{ backgroundColor }}
    >
      <ScrollView className="w-full h-full">
        <ThemedText className="text-4xl py-8 w-full text-center">
          Batch Details
        </ThemedText>
        <ThemedView className="flex-col gap-6">
          <ThemedView className="flex-row gap-8">
            <ThemedView className="items-center text-center">
              <ThemedText className="text-2xl">Estimated OG:</ThemedText>
              <ThemedText className="text-2xl">1.110</ThemedText>
            </ThemedView>
            <ThemedView className="items-center text-center">
              <ThemedText className="text-2xl">Estimated FG:</ThemedText>
              <TextInput className="flex-1 text-center text-base bg-white border-2 w-24 bg-black-100 rounded-2xl focus:border-secondary">
                .996
              </TextInput>
            </ThemedView>
          </ThemedView>

          <ThemedView className="flex-row justify-center">
            <ThemedView className="items-center text-center">
              <ThemedText className="text-2xl">Backsweetened FG:</ThemedText>
              <ThemedText className="text-2xl">1.010</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView className="flex-row gap-8">
            <ThemedView className="items-center text-center">
              <ThemedText className="text-2xl">ABV:</ThemedText>
              <ThemedText className="text-2xl">12% ABV</ThemedText>
            </ThemedView>
            <ThemedView className="items-center text-center">
              <ThemedText className="text-2xl">Delle Units:</ThemedText>
              <ThemedText className="text-2xl">30 Delle Units</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView className="flex-row justify-center">
            <ThemedView className="items-center text-center ">
              <ThemedText className="text-2xl">
                Total Primary Volume:
              </ThemedText>
              <ThemedText className="text-2xl">1 gal</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView className="flex-row justify-center">
            <ThemedView className="items-center text-center ">
              <ThemedText className="text-2xl">Total Actual Volume:</ThemedText>
              <ThemedText className="text-2xl">1.2 gal</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        <CustomButton
          title="Go Back"
          containerStyles="mt-12"
          handlePress={() => router.push("/home")}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default submit;
