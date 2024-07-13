import { TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useAbv from "@/hooks/useAbv";
import { ThemedView } from "@/components/ThemedView";
import { Keyboard } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { TextInput } from "react-native";
import { toBrix } from "@/helpers/unitConverters";
import AbvLine from "@/components/AbvLine";

interface Gravity {
  fgh: number;
  fgr: number;
}

const EstimatedOG = () => {
  const { t } = useTranslation();
  const [gravity, setGravity] = useState<Gravity>({
    fgh: 1.0,
    fgr: 5,
  });
  const [gravityText, setGravityText] = useState({
    fgh: gravity.fgh.toString(),
    fgr: gravity.fgr.toString(),
  });

  useEffect(() => {
    let fgh = Number(gravityText.fgh);
    let fgr = Number(gravityText.fgr);

    if (isNaN(fgr) || isNaN(fgh)) {
      fgh = 1.0;
      fgr = 5;
    }

    setGravity({ fgh, fgr });
  }, [gravityText]);

  const estOG =
    Math.round((-1.728 * gravity.fgh + 0.01085 * gravity.fgr + 2.728) * 1000) /
    1000;
  const abv = useAbv({ OG: estOG, FG: gravity.fgh });
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView className="items-center justify-center flex-1 pt-10">
        <ThemedText className="py-4 text-center" type="title">
          {t("ogHeading")}
        </ThemedText>
        <ThemedView className="flex-row w-11/12">
          <ThemedText type="defaultSemiBold" className="text-xl">
            {t("hydrometerFG")}
          </ThemedText>
          <TextInput
            className="flex-1 ml-8 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            keyboardType="numeric"
            value={gravityText.fgh}
            onChangeText={(text) =>
              setGravityText((prev) => ({ ...prev, fgh: text }))
            }
          />
        </ThemedView>
        <ThemedView className="flex-row w-11/12">
          <ThemedText type="defaultSemiBold" className="text-xl">
            {t("refractometerFG")}
          </ThemedText>
          <TextInput
            className="flex-1 ml-8 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            keyboardType="numeric"
            value={gravityText.fgr}
            onChangeText={(text) =>
              setGravityText((prev) => ({ ...prev, fgr: text }))
            }
          />
        </ThemedView>

        <ThemedView className="my-4">
          <ThemedText className="text-2xl text-center">
            {t("estimatedOG")}
          </ThemedText>
          <ThemedText className="text-2xl text-center">
            {estOG}, {Math.round(toBrix(estOG) * 100) / 100} {t("BRIX")}
          </ThemedText>
        </ThemedView>
        <AbvLine {...abv} />
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default EstimatedOG;
