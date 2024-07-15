import { TouchableWithoutFeedback, Keyboard } from "react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useUnitChange from "@/hooks/useUnitChange";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TextInput } from "react-native-gesture-handler";
import { dropdownStyles as styles } from "./Refractometer";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dropdown } from "react-native-element-dropdown";
import Trials from "@/components/Trials";
export interface BatchDetails {
  batchSize: number;
  sampleSize: number;
  stockSolutionConcentration: number;
  units: "gallon" | "liter";
}

const BenchTrials = () => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tint = useThemeColor({}, "tint");
  const [isFocus, setIsFocus] = useState(false);
  const [batchDetails, setBatchDetails] = useState<BatchDetails>({
    batchSize: 1,
    sampleSize: 50,
    stockSolutionConcentration: 10,
    units: "gallon",
  });

  function handleBatchDetails(text: string, key: keyof BatchDetails): void {
    const value = key == "units" ? text : Number(text);
    setBatchDetails({
      ...batchDetails,
      [key]: value,
    });
  }
  const unitChangeParams = {
    stateObj: batchDetails,
    setterFunction: setBatchDetails,
  };
  useUnitChange({ ...unitChangeParams, propertyToChange: "batchSize" });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView className="items-center justify-center flex-1">
        <ThemedText className="py-4 text-center" type="title">
          {t("benchTrialsHeading")}
        </ThemedText>
        <ThemedView className="flex-row w-11/12">
          <ThemedText type="defaultSemiBold" className="text-xl">
            {t("batchSize")}
          </ThemedText>
          <TextInput
            className="flex-1 ml-8 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            keyboardType="numeric"
            value={batchDetails.batchSize.toString()}
            onChangeText={(text) => handleBatchDetails(text, "batchSize")}
          />
        </ThemedView>
        <ThemedView className="flex-row w-11/12 items-center justify-center">
          <ThemedText type="defaultSemiBold" className="text-xl">
            {t("UNITS")}:
          </ThemedText>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: tint }]}
            placeholderStyle={[styles.placeholderStyle, { color: textColor }]}
            selectedTextStyle={[
              styles.selectedTextStyle,
              { color: textColor, backgroundColor },
            ]}
            itemContainerStyle={{
              backgroundColor,
            }}
            itemTextStyle={{ color: textColor }}
            data={[
              { label: t("GAL"), value: "gallon" },
              { label: t("LIT"), value: "liter" },
            ]}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={batchDetails.units}
            onFocus={() => setIsFocus(!isFocus)}
            onBlur={() => setIsFocus(!isFocus)}
            onChange={({ value }) => {
              handleBatchDetails(value, "units");
              setIsFocus(true);
            }}
          />
        </ThemedView>
        <ThemedView className="flex-row w-11/12">
          <ThemedText type="defaultSemiBold" className="text-xl">
            {t("sampleSize")}
          </ThemedText>
          <TextInput
            className="flex-1 ml-8 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            keyboardType="numeric"
            value={batchDetails.sampleSize.toString()}
            onChangeText={(text) => handleBatchDetails(text, "sampleSize")}
          />
        </ThemedView>
        <ThemedView className="flex-row w-11/12">
          <ThemedText type="defaultSemiBold" className="text-xl">
            {t("stockSolutionConcentration")}
          </ThemedText>
          <TextInput
            className="flex-1 ml-8 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            keyboardType="numeric"
            value={batchDetails.stockSolutionConcentration.toString()}
            onChangeText={(text) =>
              handleBatchDetails(text, "stockSolutionConcentration")
            }
          />
        </ThemedView>
        <Trials batchDetails={batchDetails} />
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default BenchTrials;
