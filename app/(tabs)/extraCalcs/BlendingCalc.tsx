import { Keyboard, TextInput, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTranslation } from "react-i18next";
import useBlend, { NumArray } from "@/hooks/useBlend";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";

const BlendingCalc = () => {
  const { t } = useTranslation();
  const [inputValues, setInputValues] = useState<NumArray>([
    [0, 0],
    [0, 0],
  ]);

  const [inputText, setInputText] = useState(
    inputValues.map((value) => value.map((val) => val.toString()))
  );

  function handleChange(text: string, [index1, index2]: number[]) {
    setInputText((prev) => {
      const newValues = [...prev];
      newValues[index1][index2] = text;
      return newValues;
    });
  }

  useEffect(() => {
    setInputValues(() => {
      return inputText.map((row) => row.map((val) => parseFloat(val)));
    });
  }, [inputText]);

  const { blend, runBlendingFunction } = useBlend(inputValues);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView className="items-center justify-center flex-1 pt-10">
        <ThemedText className="py-4 mx-2 text-center" type="title">
          {t("blendingHeading")}
        </ThemedText>
        <ThemedView className="my-4 space-y-2">
          <ThemedView className="flex-row items-center justify-between w-11/12">
            <ThemedText type="defaultSemiBold" className="text-xl">
              {t("valOne")}
            </ThemedText>
            <CustomInput
              style={{ maxWidth: 150 }}
              keyboardType="numeric"
              value={inputText[0][0]}
              onChangeText={(text) => {
                handleChange(text, [0, 0]);
              }}
            />
          </ThemedView>
          <ThemedView className="flex-row items-center justify-between w-11/12">
            <ThemedText type="defaultSemiBold" className="text-xl">
              {t("volOne")}
            </ThemedText>
            <CustomInput
              style={{ maxWidth: 150 }}
              keyboardType="numeric"
              value={inputText[0][1]}
              onChangeText={(text) => {
                handleChange(text, [0, 1]);
              }}
            />
          </ThemedView>
        </ThemedView>
        <ThemedView className="my-4 space-y-2">
          <ThemedView className="flex-row items-center justify-between w-11/12">
            <ThemedText type="defaultSemiBold" className="text-xl">
              {t("valTwo")}
            </ThemedText>
            <CustomInput
              style={{ maxWidth: 150 }}
              keyboardType="numeric"
              value={inputText[1][0]}
              onChangeText={(text) => {
                handleChange(text, [1, 0]);
              }}
            />
          </ThemedView>
          <ThemedView className="flex-row items-center justify-between w-11/12">
            <ThemedText type="defaultSemiBold" className="text-xl">
              {t("volTwo")}
            </ThemedText>
            <CustomInput
              style={{ maxWidth: 150 }}
              keyboardType="numeric"
              value={inputText[1][1]}
              onChangeText={(text) => {
                handleChange(text, [1, 1]);
              }}
            />
          </ThemedView>
        </ThemedView>
        <CustomButton
          title="Submit"
          handlePress={() => {
            Keyboard.dismiss();
            runBlendingFunction();
          }}
          containerStyles="my-7 w-full"
          isLoading={false}
        />
        <ThemedView className="items-center">
          <ThemedView className="flex-row w-11/12 space-x-6">
            <ThemedText type="defaultSemiBold" className="text-xl">
              {t("totalVol")}
            </ThemedText>
            <ThemedText className="text-2xl">{blend.totalVolume}</ThemedText>
          </ThemedView>
          <ThemedView className="flex-row w-11/12 space-x-6">
            <ThemedText type="defaultSemiBold" className="text-xl">
              {t("blendedVal")}
            </ThemedText>
            <ThemedText className="text-2xl">
              {Math.round(blend.blendedValue * 10 ** 4) / 10 ** 4}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default BlendingCalc;
