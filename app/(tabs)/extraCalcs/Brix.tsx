import { TouchableWithoutFeedback, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useBrixUnitsChange from "@/hooks/useBrixUnitsChange";
import { toBrix, toSG } from "@/helpers/unitConverters";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Keyboard } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Dropdown as DefaultDropdown } from "react-native-element-dropdown";
import { useThemeColor } from "@/hooks/useThemeColor";

export interface Brix {
  value: number;
  unit: "SG" | "Brix";
}

const Brix = () => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tint = useThemeColor({}, "tint");
  const [isFocus, setIsFocus] = useState(false);

  const [brixObj, setBrixObj] = useState<Brix>({
    value: 1,
    unit: "SG",
  });

  const [stringValue, setStringValue] = useState(brixObj.value.toString());

  useEffect(() => {
    const numberValue = Number(stringValue);
    setBrixObj((prev) => ({
      ...prev,
      value: isNaN(numberValue) ? 1 : numberValue,
    }));
  }, [stringValue]);

  const handleUnitChange = (text: string) => {
    const unit = text;
    if (unit === "SG" || unit === "Brix")
      setBrixObj((prev) => ({ ...prev, unit: unit }));
  };

  useBrixUnitsChange({
    stateObj: brixObj,
    setterFunction: setBrixObj,
    propertyToChange: "value",
  });

  const displayString =
    brixObj.unit === "SG"
      ? `${Math.round(toBrix(brixObj.value) * 100) / 100} ${t("BRIX")}`
      : Math.round(toSG(brixObj.value) * 1000) / 1000;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView className="items-center justify-center flex-1 pt-10">
        <ThemedText className="py-4 text-center" type="title">
          {t("brixHeading")}
        </ThemedText>
        <ThemedView className="flex-row w-11/12">
          <ThemedText type="defaultSemiBold" className="text-xl">
            {t("gravityLabel")}
          </ThemedText>
          <TextInput
            className="flex-1 ml-8 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            keyboardType="numeric"
            value={stringValue}
            onChangeText={setStringValue}
          />
          <ThemedText className="mx-2">
            {brixObj.unit === "Brix" ? t(brixObj.unit.toUpperCase()) : null}
          </ThemedText>
        </ThemedView>
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
            { label: t("SG"), value: "SG" },
            { label: t("BRIX"), value: "Brix" },
          ]}
          maxHeight={300}
          labelField="label"
          valueField="value"
          value={brixObj.unit}
          onFocus={() => setIsFocus(!isFocus)}
          onBlur={() => setIsFocus(!isFocus)}
          onChange={({ value }) => {
            handleUnitChange(value);
            setIsFocus(true);
          }}
        />
        <ThemedText type="subtitle" className="text-3xl">
          {displayString}
        </ThemedText>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Brix;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    maxWidth: "50%",
    width: "100%",
  },
  dropdown: {
    height: 50,
    width: "90%",
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
