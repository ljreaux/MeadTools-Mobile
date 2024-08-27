import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { TextInput } from "react-native-gesture-handler";
import { Dropdown as DefaultDropdown } from "react-native-element-dropdown";
import { useThemeColor } from "@/hooks/useThemeColor";
import CustomInput from "./CustomInput";

const Sorbate = () => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tint = useThemeColor({}, "tint");
  const [isFocus, setIsFocus] = useState(false);

  const [sorbate, setSorbate] = useState({
    batchSize: 1,
    units: "gallons",
    abv: 12,
  });

  const [sorbateText, setSorbateText] = useState({
    batchSize: sorbate.batchSize.toString(),
    abv: sorbate.abv.toString(),
  });

  useEffect(() => {
    let batchSize = Number(sorbateText.batchSize);
    let abv = Number(sorbateText.abv);

    if (isNaN(batchSize) || isNaN(abv)) {
      batchSize = 1;
      abv = 12;
    }
    setSorbate((prev) => ({ ...prev, batchSize, abv }));
  }, [sorbateText]);

  const handleUnitChange = (value: string) => {
    setSorbate((prev) => ({ ...prev, units: value }));
    setIsFocus(true);
  };

  const sorbateAmount =
    sorbate.units === "gallons"
      ? ((-sorbate.abv * 25 + 400) / 0.75) * sorbate.batchSize * 0.003785411784
      : (((-sorbate.abv * 25 + 400) / 0.75) * sorbate.batchSize) / 1000;

  return (
    <ThemedView>
      <ThemedText className="py-4 text-center" type="title">
        {t("sorbateHeading")}
      </ThemedText>
      <ThemedView className="flex-row items-center justify-center w-11/12 space-x-2">
        <ThemedText type="defaultSemiBold" className="text-xl">
          {t("batchSize")}
        </ThemedText>
        <CustomInput
          keyboardType="numeric"
          value={sorbateText.batchSize}
          onChangeText={(text) => {
            setSorbateText({ ...sorbateText, batchSize: text });
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
          value={sorbate.units}
          onFocus={() => setIsFocus(!isFocus)}
          onBlur={() => setIsFocus(!isFocus)}
          onChange={({ value }) => {
            handleUnitChange(value);
          }}
        />
      </ThemedView>
      <ThemedView className="flex-row items-center justify-between w-11/12 px-2 space-x-2">
        <ThemedText type="defaultSemiBold" className="text-xl">
          {t("ABV")}:
        </ThemedText>
        <CustomInput
          keyboardType="numeric"
          value={sorbateText.abv}
          onChangeText={(text) => {
            setSorbateText({ ...sorbateText, abv: text });
          }}
        />
      </ThemedView>
      <ThemedText className="my-4 text-2xl text-center">
        {Math.round(sorbateAmount * 1000) / 1000}g {t("kSorb")}
      </ThemedText>
    </ThemedView>
  );
};

export default Sorbate;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
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
