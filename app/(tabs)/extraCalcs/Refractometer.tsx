import { View, Text, TouchableWithoutFeedback } from "react-native";
import React, { createFactory, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toBrix, toSG } from "@/helpers/unitConverters";
import useAbv from "@/hooks/useAbv";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Keyboard } from "react-native";
import { TextInput } from "react-native";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dropdown } from "react-native-element-dropdown";
import AbvLine from "@/components/AbvLine";

function refracCalc(ogBr: number, fgBr: number, corFac: number) {
  return -0.002349 * (ogBr / corFac) + 0.006276 * (fgBr / corFac) + 1;
}

const Refractometer = () => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tint = useThemeColor({}, "tint");
  const [isFocus, setIsFocus] = useState(false);
  const [refrac, setRefrac] = useState({
    cf: 1,
    og: 1.1,
    units: "SG",
    fgInBrix: 8.5,
    fgInSg: Math.round(toSG(8.5) * 100) / 100,
    calcBrix: 0,
    calcSg: Math.round(toSG(0) * 100) / 100,
  });

  const [textInputs, setTextInputs] = useState({
    cf: refrac.cf.toString(),
    og: refrac.og.toString(),
    fgInBrix: refrac.fgInBrix.toString(),
    fgInSg: refrac.fgInSg.toString(),
    calcBrix: refrac.calcBrix.toString(),
    calcSg: refrac.calcSg.toString(),
  });

  const og = refrac.units === "SG" ? refrac.og : toSG(refrac.og);

  const abv = useAbv({ OG: og, FG: refrac.calcSg });

  useEffect(() => {
    const { cf: corFac, og, fgInBrix: fgBr, units } = refrac;

    let actualFg = refracCalc(og, fgBr, corFac);
    if (units == "SG") actualFg = refracCalc(toBrix(og), fgBr, corFac);

    setRefrac((prev) => ({
      ...prev,
      calcSg: actualFg,
      calcBrix: toBrix(actualFg),
    }));
    // setTextInputs((prev) => ({
    //   ...prev,
    //   calcSg: actualFg.toString(),
    //   calcBrix: toBrix(actualFg).toString(),
    // }));
  }, [refrac.cf, refrac.og, refrac.fgInBrix, refrac.units]);

  useEffect(() => {
    const inputCopy = { ...textInputs };
    for (const key in inputCopy) {
      const numberValue = Number(inputCopy[key as keyof typeof inputCopy]);
      if (isNaN(numberValue)) {
        setRefrac((prev) => ({
          ...prev,
          [key]: refrac[key as keyof typeof refrac],
        }));
      } else {
        setRefrac((prev) => ({ ...prev, [key]: numberValue }));
      }
    }
  }, [textInputs.cf, textInputs.og, textInputs.fgInBrix]);

  const handleUnitChange = (text: string) => {
    const unit = text;
    if (unit === "SG" || unit === "Brix")
      setRefrac((prev) => ({ ...prev, units: unit }));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView className="items-center justify-center flex-1 pt-10">
        <ThemedText className="py-4 mx-2 text-center" type="title">
          {t("refractometerHeading")}
        </ThemedText>
        <ThemedView className="flex-row w-11/12">
          <ThemedText type="defaultSemiBold" className="text-xl">
            {t("correctionFactor")}
          </ThemedText>
          <TextInput
            className="flex-1 ml-8 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            keyboardType="numeric"
            value={textInputs.cf}
            onChangeText={(text) => {
              setTextInputs({ ...textInputs, cf: text });
            }}
          />
        </ThemedView>
        <ThemedView className="flex-row w-11/12 items-center justify-center">
          <ThemedText type="defaultSemiBold" className="text-xl">
            {t("ogLabel")}
          </ThemedText>

          <TextInput
            className="flex-1 ml-8 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            keyboardType="numeric"
            value={textInputs.og}
            onChangeText={(text) => {
              setTextInputs({ ...textInputs, og: text });
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
              { label: t("SG"), value: "SG" },
              { label: t("BRIX"), value: "Brix" },
            ]}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={refrac.units}
            onFocus={() => setIsFocus(!isFocus)}
            onBlur={() => setIsFocus(!isFocus)}
            onChange={({ value }) => {
              handleUnitChange(value);
              setIsFocus(true);
            }}
          />
        </ThemedView>
        <ThemedView className="flex-row w-11/12 items-center justify-center">
          <ThemedText type="defaultSemiBold" className="text-xl">
            {t("fgInBrix")}
          </ThemedText>

          <TextInput
            className="flex-1 ml-8 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            keyboardType="numeric"
            value={textInputs.fgInBrix}
            onChangeText={(text) => {
              setTextInputs({ ...textInputs, fgInBrix: text });
            }}
          />
        </ThemedView>
        <ThemedView className="my-4">
          <ThemedText className="text-2xl text-center">
            {Math.round(refrac.calcSg * 1000) / 1000}
          </ThemedText>
          <ThemedText className="text-2xl text-center">
            {Math.round(refrac.calcBrix * 100) / 100} {t("BRIX")}
          </ThemedText>
        </ThemedView>
        <AbvLine {...abv} />
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Refractometer;

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
