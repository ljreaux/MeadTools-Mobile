import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Dropdown as DefaultDropdown } from "react-native-element-dropdown";

const Sulfite = () => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tint = useThemeColor({}, "tint");
  const [isFocus, setIsFocus] = useState(false);

  const [sulfite, setSulfite] = useState({
    batchSize: 1,
    units: "gallons",
    ppm: 50,
  });
  const [sulfiteText, setSulfiteText] = useState({
    batchSize: sulfite.batchSize.toString(),
    ppm: sulfite.ppm.toString(),
  });

  useEffect(() => {
    let batchSize = Number(sulfiteText.batchSize);
    let ppm = Number(sulfiteText.ppm);

    if (isNaN(batchSize) || isNaN(ppm)) {
      batchSize = 1;
      ppm = 12;
    }
    setSulfite((prev) => ({ ...prev, batchSize, ppm }));
  }, [sulfiteText]);

  const handleUnitChange = (value: string) => {
    setSulfite((prev) => ({ ...prev, units: value }));
    setIsFocus(true);
  };

  const sulfiteAmount =
    sulfite.units === "gallons"
      ? (sulfite.batchSize * 3.785 * sulfite.ppm) / 570
      : (sulfite.batchSize * sulfite.ppm) / 570;

  const campden =
    sulfite.units !== "gallons"
      ? (sulfite.ppm / 75) * (sulfite.batchSize / 3.785)
      : (sulfite.ppm / 75) * sulfite.batchSize;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      className="w-full items-center justify-center"
    >
      <ThemedView>
        <ThemedText className="py-4 text-center" type="title">
          {t("sulfiteHeading")}
        </ThemedText>
        <ThemedView className="flex-row w-11/12 justify-center items-center space-x-2">
          <ThemedText type="defaultSemiBold" className="text-xl">
            {t("batchSize")}
          </ThemedText>
          <TextInput
            className="flex-1 ml-8 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            keyboardType="numeric"
            value={sulfiteText.batchSize}
            onChangeText={(text) => {
              setSulfiteText({ ...sulfiteText, batchSize: text });
            }}
          />
          <DefaultDropdown
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
              { label: t("GAL"), value: "gallons" },
              { label: t("LIT"), value: "liters" },
            ]}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={sulfite.units}
            onFocus={() => setIsFocus(!isFocus)}
            onBlur={() => setIsFocus(!isFocus)}
            onChange={({ value }) => {
              handleUnitChange(value);
            }}
          />
        </ThemedView>
        <ThemedView className="flex-row w-11/12 justify-center items-center space-x-2">
          <ThemedText type="defaultSemiBold" className="text-xl">
            {t("desiredPpm")}
          </ThemedText>
          <TextInput
            className="flex-1 ml-8 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            keyboardType="numeric"
            value={sulfiteText.ppm}
            onChangeText={(text) => {
              setSulfiteText({ ...sulfiteText, ppm: text });
            }}
          />
        </ThemedView>
        <ThemedView className="my-4">
          <ThemedText className="text-center text-2xl">
            {Math.round(sulfiteAmount * 10000) / 10000}g {t("kMeta")}
          </ThemedText>
          <ThemedText className="text-center text-2xl">
            {t("accountPage.or")}
          </ThemedText>
          <ThemedText className="text-center text-2xl">
            {Math.round(campden * 10) / 10} {t("list.campden")}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

export default Sulfite;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    maxWidth: "50%",
    width: "100%",
  },
  dropdown: {
    height: 50,
    width: "30%",
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 20,
  },
  label: {
    position: "absolute",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
});
