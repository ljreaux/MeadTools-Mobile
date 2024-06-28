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

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const { recipeData, setRecipeData } = useGlobalContext();
  const primaryIngredients = recipeData.ingredients.filter(
    (ingredient: IngredientType) => !ingredient.secondary
  );
  const secondaryIngredients = recipeData.ingredients.filter(
    (ingredient: IngredientType) => ingredient.secondary
  );

  const addIngredientLine = (secondary: boolean) => {
    setRecipeData((prev: RecipeData) => {
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
              className="text-2xl py-4 text-center"
            >
              Primary Ingredients
            </Text>
            {primaryIngredients.map((item: IngredientType, i: number) => (
              <IngredientRow
                index={i}
                ingredient={item}
                key={i}
                removeLine={removeLine}
              />
            ))}
            <ThemedView className="py-8 mb-8 flex-row justify-center items-center">
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
              className="text-2xl py-4 text-center"
            >
              Secondary Ingredients
            </Text>
            {secondaryIngredients.map((item: IngredientType, i: number) => (
              <IngredientRow
                index={i}
                ingredient={item}
                key={i}
                removeLine={removeLine}
              />
            ))}
            <ThemedView className="py-8 flex-row justify-center items-center">
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
              handlePress={() => router.push("/home/submit")}
            />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}

const IngredientRow = ({
  index,
  ingredient,
  removeLine,
}: {
  index: number;
  ingredient: IngredientType;
  removeLine: (index: number) => void;
}) => {
  const { ingredients, recipeData, setRecipeData } = useGlobalContext();
  const ingredientsDropdown = ingredients.map((ing: IngredientListItem) => ({
    label: ing.name,
    value: ing.name,
  }));
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const { units } = recipeData;

  function setIndividual(index: number, ingredient: Partial<IngredientType>) {
    setRecipeData((prev: RecipeData) => {
      const newIngredient = prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, ...ingredient } : ing
      );

      return {
        ...prev,
        ingredients: newIngredient,
      };
    });
  }
  const updateIngredientAmount = (
    text: string,
    index: number,
    detailIndex: number | null,
    ingredient: IngredientType
  ) => {
    const converter =
      units.weight === "kg" && units.volume === "liter"
        ? (8.345 * 0.453592) / 3.78541
        : units.weight === "kg"
        ? 8.345 * 0.453592
        : units.volume === "liter"
        ? 8.345 / 3.78541
        : 8.345;

    const value = Number(text);
    if (typeof detailIndex === "number") {
      const otherIndex = detailIndex === 0 ? 1 : 0;
      const detailCopy = [];
      detailCopy[detailIndex] = value;
      detailCopy[otherIndex] =
        otherIndex === 0
          ? Math.round(value * converter * toSG(ingredient.brix) * 10000) /
            10000
          : Math.round((value / converter / toSG(ingredient.brix)) * 10000) /
            10000;

      setIndividual(index, {
        details: detailCopy,
      });
    } else {
      setIndividual(index, {
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
  const disabled = index < 4 && !ingredient.secondary;

  return (
    <ThemedView key={index}>
      <View className="w-full flex-row items-center justify-between">
        <Dropdown data={ingredientsDropdown} index={index} />
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
      <View className="flex-row items-center w-screen h-16 justify-between">
        <View className="mx-4 text-center items-center">
          <ThemedText type="subtitle" className="font-semibold my-2">
            Brix
          </ThemedText>

          <TextInput
            className="flex-1 text-center text-base bg-white border-2 w-24 bg-black-100 rounded-2xl focus:border-secondary"
            value={recipeData.ingredients[index].brix.toString()}
            keyboardType="numeric"
            placeholder="0"
            onChangeText={(e) =>
              updateIngredientAmount(e, index, null, ingredient)
            }
          />
        </View>
        <View className="mx-4 text-center items-center">
          <ThemedText type="subtitle" className="font-semibold my-2">
            Weight
          </ThemedText>

          <TextInput
            className="flex-1 text-center text-base bg-white border-2 w-24 bg-black-100 rounded-2xl focus:border-secondary"
            value={recipeData.ingredients[index].details[0].toString()}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={textColor}
            onChangeText={(e) =>
              updateIngredientAmount(e, index, 0, ingredient)
            }
          />
        </View>

        <View className="mx-4 text-center items-center">
          <ThemedText type="subtitle" className="font-semibold my-2">
            Volume
          </ThemedText>

          <TextInput
            className="flex-1 text-center text-base bg-white border-2 w-24 bg-black-100 rounded-2xl focus:border-secondary"
            value={recipeData.ingredients[index].details[1].toString()}
            keyboardType="numeric"
            placeholder="0"
            onChangeText={(e) =>
              updateIngredientAmount(e, index, 1, ingredient)
            }
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
