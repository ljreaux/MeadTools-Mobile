import CustomButton from "@/components/CustomButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, TextInput } from "react-native";

const submit = () => {
  const backgroundColor = useThemeColor({}, "background");
  const { recipeData, ABV, delle, blendFG, totalPrimaryVolume, totalVolume } =
    useGlobalContext();
  return (
    <SafeAreaView
      className={"h-screen items-center justify-center"}
      style={{ backgroundColor }}
    >
      <ScrollView className="w-full h-full">
        <ThemedText className="w-full py-8 text-4xl text-center">
          Batch Details
        </ThemedText>
        <ThemedView className="flex-col gap-6">
          <ThemedView className="flex-row gap-8">
            <ThemedView className="items-center text-center">
              <ThemedText className="text-2xl">Estimated OG:</ThemedText>
              <ThemedText className="text-2xl">
                {Math.round(recipeData.OG * 1000) / 1000}
              </ThemedText>
            </ThemedView>
            <ThemedView className="items-center text-center">
              <ThemedText className="text-2xl">Estimated FG:</ThemedText>
              <TextInput className="flex-1 w-24 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary">
                {recipeData.FG}
              </TextInput>
            </ThemedView>
          </ThemedView>

          <ThemedView className="flex-row justify-center">
            <ThemedView className="items-center text-center">
              <ThemedText className="text-2xl">Backsweetened FG:</ThemedText>
              <ThemedText className="text-2xl">{blendFG}</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView className="flex-row gap-8">
            <ThemedView className="items-center text-center">
              <ThemedText className="text-2xl">ABV:</ThemedText>
              <ThemedText className="text-2xl">
                {Math.round(ABV * 100) / 100}% ABV
              </ThemedText>
            </ThemedView>
            <ThemedView className="items-center text-center">
              <ThemedText className="text-2xl">Delle Units:</ThemedText>
              <ThemedText className="text-2xl">
                {Math.round(delle)} Delle Units
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView className="flex-row justify-center">
            <ThemedView className="items-center text-center ">
              <ThemedText className="text-2xl">
                Total Primary Volume:
              </ThemedText>
              <ThemedText className="text-2xl">
                {totalPrimaryVolume} gal
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView className="flex-row justify-center">
            <ThemedView className="items-center text-center ">
              <ThemedText className="text-2xl">Total Actual Volume:</ThemedText>
              <ThemedText className="text-2xl">{totalVolume} gal</ThemedText>
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
