import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useGlobalContext } from "@/context/GlobalProvider";
import { toSG } from "@/helpers/unitConverters";
import { IngredientListItem } from "@/helpers/Ingredients";
export interface IngredientType {
  id: number;
  name: string;
  brix: number;
  details: number[];
  secondary: boolean;
  category: string;
}
export interface Additive {
  name: string;
  amount: number;
  unit: string;
}
export interface RecipeData {
  ingredients: IngredientType[];
  OG: number;
  volume: number;
  ABV: number;
  FG: number;
  offset: number;
  units: {
    weight: "lbs" | "kg";
    volume: "gal" | "liter";
  };
  sorbate?: number;
  sulfite?: number;
  campden?: number;
  additives: Additive[];
}

export const DropdownComponent = ({
  data,
  id,
}: {
  data: { label: string; value: string }[];
  id: number;
}) => {
  const { recipeData, setRecipeData, ingredients } = useGlobalContext();
  const found = recipeData.ingredients.find((ing) => ing.id === id);
  const index = recipeData.ingredients.findIndex((ing) => ing.id === id);
  const [value, setValue] = useState<null | string>(found?.name || "");
  const [isFocus, setIsFocus] = useState(false);
  const backgroundColor = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  useEffect(() => {
    changeIngredient();
  }, [value]);

  const changeIngredient = () => {
    const {
      sugar_content: brix,
      name,
      category,
    } = ingredients.find((ingredient: IngredientListItem) => {
      return ingredient.name === value;
    }) || {
      sugar_content: 0,
      name: "error",
      category: "error",
    };

    console.log(brix);

    setRecipeData((prev) => {
      const newIngredients = prev.ingredients.map((ing, i) =>
        ing.id === id
          ? {
              ...ing,
              brix: Number(brix),
              category,
              name,
            }
          : ing
      );
      return {
        ...prev,
        ingredients: newIngredients,
      };
    });
  };

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text
          style={[
            styles.label,
            isFocus && { color: tint },
            { backgroundColor, color: textColor },
          ]}
        >
          Ingredient {index + 1}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: tint }]}
        placeholderStyle={[styles.placeholderStyle, { color: textColor }]}
        selectedTextStyle={[
          styles.selectedTextStyle,
          { color: textColor, backgroundColor },
        ]}
        inputSearchStyle={[
          styles.inputSearchStyle,
          { backgroundColor, color: textColor },
        ]}
        itemContainerStyle={{ backgroundColor }}
        itemTextStyle={{ color: textColor }}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: "80%",
  },
  dropdown: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
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
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
