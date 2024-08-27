import { TextInput, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useAbv from "@/hooks/useAbv";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { toBrix } from "@/helpers/unitConverters";
import AbvLine from "@/components/AbvLine";
import { Keyboard } from "react-native";
import CustomInput from "@/components/CustomInput";

const AbvCalculator = () => {
  const { t } = useTranslation();

  const [inputValues, setInputValues] = useState([1.105, 1]);
  const [textValues, setTextValues] = useState(["1.105", "1"]);
  const abv = useAbv({ OG: inputValues[0], FG: inputValues[1] });
  const inputArr = [t("OG"), t("FG")];

  useEffect(() => {
    setInputValues(textValues.map((text) => parseFloat(text)));
  }, [textValues]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView className="items-center justify-center flex-1 pt-10">
        <ThemedText type="title" className="py-4">
          {t("abvHeading")}
        </ThemedText>
        {inputArr.map((item, index) => {
          const brix = toBrix(inputValues[index]);
          return (
            <ThemedView
              key={index}
              className="justify-between w-screen px-6 py-4"
            >
              <ThemedView className="flex-row items-center justify-between">
                <ThemedText type="defaultSemiBold" className="text-xl">
                  {t(`${item.toLowerCase()}Label`)}
                </ThemedText>
                <CustomInput
                  keyboardType="numeric"
                  id={item}
                  value={textValues[index]}
                  onChangeText={(text) => {
                    setTextValues(
                      textValues.map((value: string, i: number) =>
                        index === i ? text : value
                      )
                    );
                  }}
                />
              </ThemedView>
              <ThemedText className="self-end py-2">
                {Math.round(brix * 100) / 100} {t("BRIX")}
              </ThemedText>
            </ThemedView>
          );
        })}
        <AbvLine {...abv} />
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default AbvCalculator;
