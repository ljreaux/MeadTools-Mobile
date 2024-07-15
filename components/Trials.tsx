import { SectionList, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BatchDetails } from "@/app/(tabs)/extraCalcs/BenchTrials";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { ScrollView, TextInput } from "react-native-gesture-handler";
type StockVolume = number[];

interface Props {
  batchDetails: BatchDetails;
}

const Trials = ({ batchDetails }: Props) => {
  const { t } = useTranslation();
  const newStockSolutions = [0.5, 1, 1.5, 2];

  const [stockVolume, setStockVolume] =
    useState<StockVolume>(newStockSolutions);

  function handleStockVolume(text: string, index: number): void {
    const value = Number(text);

    setStockVolume((prev) => {
      return prev.map((_, i) => (i === index ? value : prev[i]));
    });
  }
  const adjunctInSample = (index: number) => {
    return (
      Math.round(
        stockVolume[index] * batchDetails.stockSolutionConcentration * 10 ** 6
      ) /
      10 ** 8
    );
  };

  const displayData = stockVolume.map((item, i) => {
    const sample = adjunctInSample(i);
    const scaler =
      Math.round(
        (sample / (batchDetails.sampleSize + stockVolume[i])) * 10 ** 6
      ) /
      10 ** 6;
    const scaledAdjunct =
      batchDetails.units == "gallon"
        ? Math.round(scaler * 37850000) / 10 ** 4
        : (scaler * 10 ** 4) / 10;
    const scaledBatch =
      Math.round(scaledAdjunct * batchDetails.batchSize * 10 ** 4) / 10 ** 4;
    return {
      title: `Trial # ${i + 1}`,
      data: [
        {
          key: i,
          concentration: item,
          sample,
          scaler,
          scaledAdjunct,
          scaledBatch,
        },
      ],
    };
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={{ flex: 1 }}
    >
      <SectionList
        sections={displayData}
        keyExtractor={(item) => item.key.toString()}
        renderItem={({ item }) => (
          <ThemedView className="py-4 w-screen">
            <ThemedView className=" items-center justify-center ">
              <ThemedText type="defaultSemiBold" className="text-xl">
                {t("solutionVolume")}
              </ThemedText>
              <TextInput
                className="text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary w-11/12"
                keyboardType="numeric"
                value={item.concentration.toString()}
                onChangeText={(text) => handleStockVolume(text, item.key)}
              />
            </ThemedView>
            <ThemedView className=" items-center justify-center ">
              <ThemedText type="defaultSemiBold" className="text-xl">
                {t("adjunctAmount")}
              </ThemedText>
              <ThemedView className="bg-white rounded-2xl w-11/12">
                <ThemedText className="text-base text-center">
                  {item.sample}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView className=" items-center justify-center ">
              <ThemedText type="defaultSemiBold" className="text-xl">
                {t("adjunctConcentration")}
              </ThemedText>
              <ThemedView className="bg-white rounded-2xl w-11/12">
                <ThemedText className="text-base text-center">
                  {item.scaler * 1000000}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView className=" items-center justify-center ">
              <ThemedText type="defaultSemiBold" className="text-xl">
                {t(`${batchDetails.units}ScaledAdjunct`)}
              </ThemedText>
              <ThemedView className="bg-white rounded-2xl w-11/12">
                <ThemedText className="text-base text-center">
                  {item.scaledAdjunct}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <ThemedView className=" items-center justify-center ">
              <ThemedText type="defaultSemiBold" className="text-xl">
                {t("scaledBatch")}
              </ThemedText>
              <ThemedView className="bg-white rounded-2xl w-11/12">
                <ThemedText className="text-base text-center">
                  {item.scaledBatch}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <ThemedView className=" my-4">
            <ThemedText type="title" className="text-center">
              {title}
            </ThemedText>
          </ThemedView>
        )}
        ItemSeparatorComponent={() => {
          return <ThemedView className="w-full h-4 bg-white" />;
        }}
        className="flex-1 self-end"
      />
    </KeyboardAvoidingView>
  );
};

export default Trials;
