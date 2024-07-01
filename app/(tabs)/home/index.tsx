import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { View } from "react-native";
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
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const { recipeData, setRecipeData, setSubmit } = useGlobalContext();
  const primaryIngredients = recipeData.ingredients.filter(
    (ingredient: IngredientType) => !ingredient.secondary
  );
  const secondaryIngredients = recipeData.ingredients.filter(
    (ingredient: IngredientType) => ingredient.secondary === true
  );

  const addIngredientLine = (secondary: boolean) => {
    setRecipeData((prev) => {
      console.log(secondaryIngredients);
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

  return (
    <SafeAreaView
      className={"h-screen items-center justify-center"}
      style={{
        backgroundColor,
      }}
    >
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Text className="text-4xl text-center" style={{ color: textColor }}>
              Recipe Builder
            </Text>
            <Text
              style={{ color: textColor }}
              className="py-4 text-2xl text-center"
            >
              Primary Ingredients
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
              Secondary Ingredients
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
              title="Submit"
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
  const { ingredients, recipeData, setRecipeData } = useGlobalContext();
  const { units } = recipeData;
  const converter =
    units.weight === "kg" && units.volume === "liter"
      ? (8.345 * 0.453592) / 3.78541
      : units.weight === "kg"
      ? 8.345 * 0.453592
      : units.volume === "liter"
      ? 8.345 / 3.78541
      : 8.345;
  const [textDetails, setTextDetails] = useState({
    ingredients: recipeData.ingredients.map((ing) => {
      return {
        id: ing.id,
        details: ing.details.map((det) => det.toFixed(3)),
        brix: ing.brix.toString(),
      };
    }),
  });

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

  const ingredientsDropdown = ingredients.map((ing: IngredientListItem) => ({
    label: ing.name,
    value: ing.name,
  }));
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
            Brix
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
          />
        </View>
        <View className="items-center mx-4 text-center">
          <ThemedText type="subtitle" className="my-2 font-semibold">
            Weight
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
          />
        </View>

        <View className="items-center mx-4 text-center">
          <ThemedText type="subtitle" className="my-2 font-semibold">
            Volume
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
          />
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
