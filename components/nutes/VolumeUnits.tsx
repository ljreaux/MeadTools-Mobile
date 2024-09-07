import { Selected } from "@/app/(tabs)/extraCalcs";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown as DefaultDropdown } from "react-native-element-dropdown";

export const VolumeUnits = ({
  onChange,
}: {
  onChange: (brand: Selected["volumeUnits"]) => void;
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<null | string>("gal");
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
          {t("UNITS")}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {renderLabel()}
      <DefaultDropdown
        style={[styles.dropdown, isFocus && { borderColor: tint }]}
        placeholderStyle={[styles.placeholderStyle, { color: textColor }]}
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
        value={value}
        onFocus={() => setIsFocus((prev) => !prev)}
        onBlur={() => setIsFocus((prev) => !prev)}
        onChange={({ value }) => {
          if (value === "gal" || value === "liter") {
            setValue(value);
            onChange(value);
          }
          setIsFocus((prev) => !prev);
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 0.5,
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
