import { Image, StyleSheet, Platform, Text, TextInput } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { View } from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";
import { IngredientListItem } from "@/helpers/Ingredients";
import { DropdownComponent as Dropdown } from "@/components/Dropdown";

export default function HomeScreen() {
  const { ingredients, recipeData } = useGlobalContext();
  const ingredientsDropdown = ingredients.map((ing: IngredientListItem) => ({
    label: ing.name,
    value: ing.name,
  }));
  const map = new Array(4).fill(0);
  return (
    <View className="justify-center w-screen h-screen ">
      {map.map((item, i) => (
        <View key={i}>
          <Dropdown data={ingredientsDropdown} index={i} />
          <TextInput
            value={recipeData.ingredients[i].details[0].toString()}
            keyboardType="numeric"
            placeholder="0"
          />
          <TextInput
            value={recipeData.ingredients[i].brix.toString()}
            keyboardType="numeric"
            placeholder="0"
          />
          <TextInput
            value={recipeData.ingredients[i].details[1].toString()}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>
      ))}
    </View>
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
