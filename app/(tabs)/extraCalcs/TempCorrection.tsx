import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { temperatureCorrection, toFahrenheit } from "@/helpers/temperature";
import { toBrix } from "@/helpers/unitConverters";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TextInput } from "react-native-gesture-handler";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dropdown } from "react-native-element-dropdown";

const TempCorrection = () => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tint = useThemeColor({}, "tint");
  const [isFocus, setIsFocus] = useState(false);
  const [tempObj, setTempObj] = useState({
    measured: 1.1,
    tempUnits: "F",
    curTemp: 90,
    calTemp: 68,
  });
  const [textInputs, setTextInputs] = useState({
    measured: "1.1",
    curTemp: "90",
    calTemp: "68",
  });

  const result =
    tempObj.tempUnits === "F"
      ? temperatureCorrection(
          tempObj.measured,
          tempObj.curTemp,
          tempObj.calTemp
        )
      : temperatureCorrection(
          tempObj.measured,
          toFahrenheit(tempObj.curTemp),
          toFahrenheit(tempObj.calTemp)
        );
  const resultBrix = toBrix(result);
  const handleUnitChange = (text: string) => {
    const unit = text;
    if (unit === "F" || unit === "C")
      setTempObj((prev) => ({ ...prev, tempUnits: unit }));
  };

  useEffect(() => {
    const inputCopy = { ...textInputs };
    for (const key in inputCopy) {
      const numberValue = Number(inputCopy[key as keyof typeof inputCopy]);
      if (isNaN(numberValue)) {
        setTempObj((prev) => ({
          ...prev,
          [key]: tempObj[key as keyof typeof tempObj],
        }));
      } else {
        setTempObj((prev) => ({ ...prev, [key]: numberValue }));
      }
    }
  }, [textInputs.measured, textInputs.curTemp, textInputs.calTemp]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView className="items-center justify-center flex-1 pt-10">
        <ThemedText className="py-4 text-center" type="title">
          {t("tempCorrectionHeading")}
        </ThemedText>
        <ThemedView className="flex-row w-11/12">
          <ThemedText type="defaultSemiBold" className="text-xl">
            {t("measuredSG")}
          </ThemedText>
          <TextInput
            className="flex-1 ml-8 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            keyboardType="numeric"
            value={textInputs.measured}
            onChangeText={(text) => {
              setTextInputs({ ...textInputs, measured: text });
            }}
          />
          <ThemedText className="mx-2">
            {Math.round(toBrix(tempObj.measured) * 100) / 100} {t("Brix")}
          </ThemedText>
        </ThemedView>
        <ThemedView className="flex-row w-11/12 items-center justify-center">
          <ThemedText type="defaultSemiBold" className="text-xl">
            {t("curTemp")}
          </ThemedText>

          <TextInput
            className="flex-1 ml-8 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            keyboardType="numeric"
            value={textInputs.curTemp}
            onChangeText={(text) => {
              setTextInputs({ ...textInputs, curTemp: text });
            }}
          />
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
              { label: t("FAR"), value: "F" },
              { label: t("CEL"), value: "C" },
            ]}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={tempObj.tempUnits}
            onFocus={() => setIsFocus(!isFocus)}
            onBlur={() => setIsFocus(!isFocus)}
            onChange={({ value }) => {
              handleUnitChange(value);
              setIsFocus(true);
            }}
          />
        </ThemedView>
        <ThemedView className="flex-row w-11/12">
          <ThemedText type="defaultSemiBold" className="text-xl">
            {t("calTemp")}
          </ThemedText>
          <TextInput
            className="flex-1 ml-8 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            keyboardType="numeric"
            value={textInputs.calTemp}
            onChangeText={(text) => {
              setTextInputs({ ...textInputs, calTemp: text });
            }}
          />
        </ThemedView>
        <ThemedView className="my-8">
          <ThemedText className="text-2xl text-center">
            {Math.round(result * 1000) / 1000},{" "}
            {Math.round(resultBrix * 100) / 100} {t("Brix")}{" "}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default TempCorrection;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    maxWidth: "50%",
    width: "100%",
  },
  dropdown: {
    height: 50,
    // width: "30%",
    flex: 1,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 20,
    marginLeft: 12,
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
