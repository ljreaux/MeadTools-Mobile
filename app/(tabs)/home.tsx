import {
  Image,
  StyleSheet,
  Platform,
  Text,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { View } from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";
import { IngredientListItem } from "@/helpers/Ingredients";
import { DropdownComponent as Dropdown } from "@/components/Dropdown";
import FormField from "@/components/FormField";
import { SafeAreaView } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  console.log(`bg-[${backgroundColor.replace(/\s+/g, "_")}]`);
  const { ingredients, recipeData } = useGlobalContext();
  const ingredientsDropdown = ingredients.map((ing: IngredientListItem) => ({
    label: ing.name,
    value: ing.name,
  }));

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
            {recipeData.ingredients.map(
              (item: IngredientListItem, i: number) => (
                <ThemedView key={i}>
                  <Dropdown data={ingredientsDropdown} index={i} />

                  <View className="flex-row items-center w-screen h-16 justify-between">
                    <View className="mx-4 text-center items-center">
                      <ThemedText
                        type="subtitle"
                        className="font-semibold my-2"
                      >
                        Brix
                      </ThemedText>

                      <TextInput
                        className="flex-1 text-center text-base bg-white border-2 w-24 bg-black-100 rounded-2xl focus:border-secondary"
                        value={recipeData.ingredients[i].brix.toString()}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>
                    <View className="mx-4 text-center items-center">
                      <ThemedText
                        type="subtitle"
                        className="font-semibold my-2"
                      >
                        Weight
                      </ThemedText>

                      <TextInput
                        className="flex-1 text-center text-base bg-white border-2 w-24 bg-black-100 rounded-2xl focus:border-secondary"
                        value={recipeData.ingredients[i].details[0].toString()}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>

                    <View className="mx-4 text-center items-center">
                      <ThemedText
                        type="subtitle"
                        className="font-semibold my-2"
                      >
                        Volume
                      </ThemedText>

                      <TextInput
                        className="flex-1 text-center text-base bg-white border-2 w-24 bg-black-100 rounded-2xl focus:border-secondary"
                        value={recipeData.ingredients[i].details[1].toString()}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>
                  </View>
                </ThemedView>
              )
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}

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
