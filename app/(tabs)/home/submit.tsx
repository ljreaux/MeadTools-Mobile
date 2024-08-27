import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, TextInput } from "react-native";

const submit = () => {
  const backgroundColor = useThemeColor({}, "background");
  const {
    recipeData,
    setRecipeData,
    ABV,
    delle,
    blendFG,
    totalPrimaryVolume,
    totalVolume,
  } = useGlobalContext();
  const [fgText, setFgText] = useState(recipeData.FG.toFixed(3));

  const changeFG = (text: string) => {
    setFgText(text);
    let num = Number(text);
    if (isNaN(num)) num = 0.996;
    setRecipeData((prev) => ({
      ...prev,
      FG: num,
    }));
  };
  return (
    <SafeAreaView
      className={"h-[calc(100%+3rem)] items-center justify-center py-12"}
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
              <CustomInput
                onChangeText={(text) => changeFG(text)}
                selectTextOnFocus
              >
                {fgText}
              </CustomInput>
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
                {totalPrimaryVolume} {recipeData.units.volume}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView className="flex-row justify-center">
            <ThemedView className="items-center text-center ">
              <ThemedText className="text-2xl">Total Actual Volume:</ThemedText>
              <ThemedText className="text-2xl">
                {totalVolume} {recipeData.units.volume}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        <CustomButton
          title="Go Back"
          containerStyles="mt-12"
          handlePress={() => router.back()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default submit;
