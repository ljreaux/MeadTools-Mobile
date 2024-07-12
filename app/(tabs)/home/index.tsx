import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useGlobalContext } from "@/context/GlobalProvider";
import { IngredientListItem } from "@/helpers/Ingredients";
import {
  DropdownComponent as Dropdown,
  IngredientType,
  RecipeData,
} from "@/components/Dropdown";
import { SafeAreaView } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { toSG } from "@/helpers/unitConverters";
import { AntDesign } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dropdown as DefaultDropdown } from "react-native-element-dropdown";
import { useTranslation } from "react-i18next";
import lodash from "lodash";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const { recipeData, setRecipeData, setSubmit, isMetric } = useGlobalContext();

  const primaryIngredients = recipeData.ingredients.filter(
    (ingredient: IngredientType) => !ingredient.secondary
  );
  const secondaryIngredients = recipeData.ingredients.filter(
    (ingredient: IngredientType) => ingredient.secondary === true
  );

  const addIngredientLine = (secondary: boolean) => {
    setRecipeData((prev) => {
      return {
        ...prev,
        ingredients: [
          ...prev.ingredients,
          {
            id: recipeData.ingredients.length + 1,
            name: "Honey",
            brix: 79.6,
            details: [0, 0],
            secondary,
            category: "sugar",
          },
        ],
      };
    });
  };

  function removeLine(id: number) {
    setRecipeData((prev: RecipeData) => {
      return {
        ...prev,
        ingredients: prev.ingredients.filter((ing) => ing.id !== id),
      };
    });
  }

  const [value, setValue] = useState<{
    weight: "lbs" | "kg";
    volume: "gal" | "liter";
  }>(recipeData.units);

  useEffect(() => {
    setValue(recipeData.units);
  }, [isMetric]);

  useEffect(() => {
    setRecipeData((prev) => ({
      ...prev,
      units: value,
    }));
  }, [value]);
  const { t } = useTranslation();
  const [isFocus, setIsFocus] = useState({ weight: false, volume: false });
  const tint = useThemeColor({}, "tint");
  const renderLabel = (labelText: "weight" | "volume") => {
    if (value[labelText] || isFocus[labelText]) {
      return (
        <Text
          style={[
            styles.label,
            isFocus[labelText] && { color: tint },
            { backgroundColor, color: textColor },
          ]}
        >
          {labelText.charAt(0).toUpperCase() + labelText.substring(1)} Units
        </Text>
      );
    }
    return null;
  };

  return (
    <SafeAreaView
      className={"h-[calc(100%+3rem)]items-center justify-center py-12"}
      style={{
        backgroundColor,
      }}
    >
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Text className="text-4xl text-center" style={{ color: textColor }}>
              {t("recipeBuilder.homeHeading")}
            </Text>
            <View className="flex flex-row items-center w-screen">
              <View style={[styles.container, { backgroundColor }]}>
                {renderLabel("weight")}
                <DefaultDropdown
                  style={[
                    styles.dropdown,
                    isFocus.weight && { borderColor: tint },
                  ]}
                  placeholderStyle={[
                    styles.placeholderStyle,
                    { color: textColor },
                  ]}
                  selectedTextStyle={[
                    styles.selectedTextStyle,
                    { color: textColor, backgroundColor },
                  ]}
                  itemContainerStyle={{
                    backgroundColor,
                  }}
                  itemTextStyle={{ color: textColor }}
                  data={[
                    { label: t("LBS"), value: "lbs" },
                    { label: t("KG"), value: "kg" },
                  ]}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={value.weight}
                  onFocus={() =>
                    setIsFocus((prev) => ({ ...prev, weight: true }))
                  }
                  onBlur={() =>
                    setIsFocus((prev) => ({ ...prev, weight: false }))
                  }
                  onChange={({ value }) => {
                    if (value === "lbs" || value === "kg")
                      setValue((prev) => {
                        return { ...prev, weight: value };
                      });
                    setIsFocus((prev) => ({ ...prev, weight: false }));
                  }}
                />
              </View>
              <View style={[styles.container, { backgroundColor }]}>
                {renderLabel("volume")}
                <DefaultDropdown
                  style={[
                    styles.dropdown,
                    isFocus.volume && { borderColor: tint },
                  ]}
                  placeholderStyle={[
                    styles.placeholderStyle,
                    { color: textColor },
                  ]}
                  selectedTextStyle={[
                    styles.selectedTextStyle,
                    { color: textColor, backgroundColor },
                  ]}
                  itemContainerStyle={{ backgroundColor }}
                  itemTextStyle={{ color: textColor }}
                  data={[
                    { label: t("GAL"), value: "gal" },
                    { label: t("LIT"), value: "liter" },
                  ]}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  value={value.volume}
                  onFocus={() =>
                    setIsFocus((prev) => ({ ...prev, volume: true }))
                  }
                  onBlur={() =>
                    setIsFocus((prev) => ({ ...prev, volume: false }))
                  }
                  onChange={({ value }) => {
                    if (value === "gal" || value === "liter")
                      setValue((prev) => {
                        return { ...prev, volume: value };
                      });
                    setIsFocus((prev) => ({ ...prev, volume: false }));
                  }}
                />
              </View>
            </View>
            <Text
              style={{ color: textColor }}
              className="py-4 text-2xl text-center"
            >
              {t("PDF.primary")}
            </Text>
            {primaryIngredients.map((item: IngredientType, i: number) => (
              <IngredientRow
                id={item.id}
                ingredient={item}
                key={i}
                removeLine={removeLine}
              />
            ))}
            <ThemedView className="flex-row items-center justify-center py-8 mb-8">
              <TouchableOpacity
                className="mx-4"
                onPress={() => addIngredientLine(false)}
                disabled={primaryIngredients.length > 10}
              >
                <AntDesign
                  name="plussquare"
                  size={36}
                  color={
                    primaryIngredients.length > 10
                      ? `${backgroundColor}`
                      : `${textColor}`
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="mx-4"
                onPress={() =>
                  removeLine(
                    primaryIngredients[primaryIngredients.length - 1].id
                  )
                }
                disabled={primaryIngredients.length < 5}
              >
                <AntDesign
                  name="minussquare"
                  size={36}
                  color={
                    primaryIngredients.length < 5
                      ? `${backgroundColor}`
                      : `${textColor}`
                  }
                />
              </TouchableOpacity>
            </ThemedView>
            <Text
              style={{ color: textColor }}
              className="py-4 text-2xl text-center"
            >
              {t("PDF.secondary")}
            </Text>
            {secondaryIngredients.map((item: IngredientType, i: number) => (
              <IngredientRow
                id={item.id}
                ingredient={item}
                key={i}
                removeLine={removeLine}
              />
            ))}
            <ThemedView className="flex-row items-center justify-center py-8">
              <TouchableOpacity
                className="mx-4"
                onPress={() => addIngredientLine(true)}
                disabled={secondaryIngredients.length > 10}
              >
                <AntDesign
                  name="plussquare"
                  size={36}
                  color={
                    secondaryIngredients.length > 10
                      ? `${backgroundColor}`
                      : `${textColor}`
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="mx-4"
                onPress={() =>
                  removeLine(
                    secondaryIngredients[secondaryIngredients.length - 1].id
                  )
                }
                disabled={secondaryIngredients.length <= 0}
              >
                <AntDesign
                  name="minussquare"
                  size={36}
                  color={
                    secondaryIngredients.length <= 0
                      ? `${backgroundColor}`
                      : `${textColor}`
                  }
                />
              </TouchableOpacity>
            </ThemedView>
            <CustomButton
              title={`${t("recipeBuilder.submit")}`}
              containerStyles="mb-24"
              handlePress={() => {
                setSubmit(true);
                router.push("/home/submit");
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}

const IngredientRow = ({
  id,
  ingredient,
  removeLine,
}: {
  id: number;
  ingredient: IngredientType;
  removeLine: (index: number) => void;
}) => {
  const {
    ingredients,
    recipeData,
    setRecipeData,
    textDetails,
    setTextDetails,
  } = useGlobalContext();
  const { units } = recipeData;
  const converter =
    units.weight === "kg" && units.volume === "liter"
      ? (8.345 * 0.453592) / 3.78541
      : units.weight === "kg"
      ? 8.345 * 0.453592
      : units.volume === "liter"
      ? 8.345 / 3.78541
      : 8.345;

  useEffect(() => {
    setTextDetails({
      ingredients: recipeData.ingredients.map((ing) => {
        return {
          id: ing.id,
          details: ing.details.map((det) => det.toFixed(3)),
          brix: ing.brix.toString(),
        };
      }),
    });
  }, [recipeData.units]);

  const createDetailCopy = (
    text: string,
    index: number,
    type: "number" | "string"
  ) => {
    const value = Number(text);
    const otherIndex = index === 0 ? 1 : 0;
    const detailCopy = [];
    const textArray = [];
    detailCopy[index] = value;
    detailCopy[otherIndex] =
      otherIndex === 0
        ? value * converter * toSG(ingredient.brix)
        : value / converter / toSG(ingredient.brix);

    if (type === "number") {
      detailCopy[index] = value;
      return detailCopy;
    } else {
      textArray[index] = text;
      textArray[otherIndex] = detailCopy[otherIndex].toFixed(3);
      return textArray;
    }
  };

  const setTextDetail = (text: string, id = 0, index: number | null) => {
    setTextDetails(({ ingredients }) => {
      if (index === null)
        return {
          ingredients: ingredients.map((ing) =>
            id === ing.id ? { ...ing, brix: text } : ing
          ),
        };

      const detailCopy = createDetailCopy(text, index, "string") as string[];
      return {
        ingredients: ingredients.map((ing) =>
          ing.id === id ? { ...ing, details: detailCopy } : ing
        ),
      };
    });
  };

  const { t } = useTranslation();

  const ingredientsDropdown = ingredients.map((ing: IngredientListItem) => {
    const ingredientDisplay = lodash.camelCase(ing.name);
    return {
      label: t(`${ingredientDisplay}`),
      value: ing.name,
    };
  });
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  function setIndividual(id: number, ingredient: Partial<IngredientType>) {
    setRecipeData((prev: RecipeData) => {
      const newIngredient = prev.ingredients.map((ing) =>
        ing.id === id ? { ...ing, ...ingredient } : ing
      );

      return {
        ...prev,
        ingredients: newIngredient,
      };
    });
  }
  const updateIngredientAmount = (
    text: string,
    id: number,
    detailIndex: number | null,
    ingredient: IngredientType
  ) => {
    const value = Number(text);
    if (typeof detailIndex === "number") {
      const detailCopy = createDetailCopy(
        text,
        detailIndex,
        "number"
      ) as number[];

      setIndividual(id, {
        details: detailCopy,
      });
    } else {
      setIndividual(id, {
        brix: value,
        details: [
          ingredient.details[0],
          Math.round(
            (ingredient.details[0] / converter / toSG(value)) * 10000
          ) / 10000,
        ],
      });
    }
  };
  const disabled = id < 4 && !ingredient.secondary;
  const found = textDetails.ingredients.find((ing) => ing.id === id);

  return (
    <ThemedView key={id}>
      <View className="flex-row items-center justify-between w-full">
        <Dropdown data={ingredientsDropdown} id={id} />
        <TouchableOpacity
          className="pr-6"
          onPress={() => removeLine(ingredient.id)}
          disabled={disabled}
        >
          <AntDesign
            name="minussquare"
            size={36}
            color={disabled ? `${backgroundColor}` : `${textColor}`}
          />
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center justify-between w-screen h-16">
        <View className="items-center mx-4 text-center">
          <ThemedText type="subtitle" className="my-2 font-semibold">
            {t("BRIX")}
          </ThemedText>

          <TextInput
            className="flex-1 w-24 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            value={found?.brix}
            keyboardType="numeric"
            placeholder="0"
            onChangeText={(e) => {
              setTextDetail(e, found?.id, null);
              updateIngredientAmount(e, found?.id || 0, null, ingredient);
            }}
            selectTextOnFocus
          />
        </View>
        <View className="items-center mx-4 text-center">
          <ThemedText type="subtitle" className="my-2 font-semibold">
            {t("recipeBuilder.labels.weight")}
          </ThemedText>

          <TextInput
            className="flex-1 w-24 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            value={found?.details[0]}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={textColor}
            onChangeText={(e) => {
              setTextDetail(e, found?.id, 0);
              updateIngredientAmount(e, found?.id || 0, 0, ingredient);
            }}
            selectTextOnFocus
          />
        </View>

        <View className="items-center mx-4 text-center">
          <ThemedText type="subtitle" className="my-2 font-semibold">
            {t("recipeBuilder.labels.volume")}
          </ThemedText>

          <TextInput
            className="flex-1 w-24 text-base text-center bg-white border-2 bg-black-100 rounded-2xl focus:border-secondary"
            value={found?.details[1]}
            keyboardType="numeric"
            placeholder="0"
            onChangeText={(e) => {
              setTextDetail(e, found?.id, 1);
              updateIngredientAmount(e, found?.id || 0, 1, ingredient);
            }}
            selectTextOnFocus
          />
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    maxWidth: "50%",
    width: "100%",
  },
  dropdown: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
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
