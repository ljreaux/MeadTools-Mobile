import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "react-i18next";
import lodash from "lodash";
import { Dropdown } from "react-native-element-dropdown";
import { Selected } from "@/app/(tabs)/extraCalcs";

const BrandDropdown = ({
  data,
  onChange,
}: {
  data: string[];
  onChange: (brand: Selected["yeastBrand"]) => void;
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<null | string>("Lalvin");
  const [isFocus, setIsFocus] = useState(false);
  const backgroundColor = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
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
          {t("yeastBrand")}
        </Text>
      );
    }
    return null;
  };
  const yeastBrands = data.map((yeast) => ({
    label: t(`${lodash.camelCase(yeast)}.label`),
    value: yeast as Selected["yeastBrand"],
  }));
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
        data={yeastBrands}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(text: { value: Selected["yeastBrand"]; label: string }) => {
          setValue(text.value);
          onChange(text.value);
        }}
      />
    </View>
  );
};

export default BrandDropdown;
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
