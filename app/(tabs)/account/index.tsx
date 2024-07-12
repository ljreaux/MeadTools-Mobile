import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useTranslation } from "react-i18next";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";

const index = () => {
  const { userData } = useGlobalContext();
  const { t, i18n } = useTranslation();

  return (
    <ThemedView className="items-center pt-20 text-center">
      <View className="self-end mr-4">
        <SettingsMenu />
      </View>

      <ThemedText type="title" className="mb-4">
        {t("accountPage.title")}{" "}
      </ThemedText>

      <ThemedText type="subtitle">
        {t("greeting")} {userData.email}!
      </ThemedText>

      <FlatList
        data={userData.recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <RecipeCard {...item} />}
        className="mt-10 mb-20"
      />
    </ThemedView>
  );
};

const RecipeCard = ({
  id,
  user_id,
  name,
}: {
  id: number;
  user_id: number;
  name: string;
}) => {
  const { t } = useTranslation();
  return (
    <View className="items-center justify-center w-screen">
      <ThemedText type="subtitle">{name}</ThemedText>
      <View className="flex-row justify-between">
        <CustomButton
          title={t("accountPage.viewRecipe")}
          handlePress={() => {
            router.push("/");
          }}
          containerStyles="my-7 mx-2 flex-1"
        />
        <CustomButton
          title={t("PDF.title")}
          handlePress={() => {
            router.push("/");
          }}
          containerStyles="my-7 mx-2 flex-1"
        />
        <CustomButton
          title={t("accountPage.deleteRecipe")}
          handlePress={() => {
            router.push("/");
          }}
          containerStyles="my-7 mx-2 flex-1"
        />
      </View>
    </View>
  );
};

const SettingsMenu = () => {
  const { t, i18n } = useTranslation();
  const { setIsMetric, isMetric } = useGlobalContext();
  const bgColor = useThemeColor({}, "icon");
  const color = useThemeColor({}, "text");

  return (
    <Menu>
      <MenuTrigger>
        <FontAwesome size={28} name="cog" color={color} />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            backgroundColor: bgColor,
            borderRadius: 10,
            overflow: "hidden",
          },
        }}
      >
        <ThemedText className="text-center" type="subtitle">
          {t("accountPage.theme.title")}
        </ThemedText>
        <SettingsDropdown
          data={[
            { label: t("accountPage.theme.dark"), value: "dark" },
            { label: t("accountPage.theme.light"), value: "light" },
          ]}
          updater={(string) => {}}
          initialValue={"dark"}
        />
        <ThemedText className="text-center" type="subtitle">
          {t("accountPage.language.title")}
        </ThemedText>
        <SettingsDropdown
          data={[
            { label: "EN", value: "en" },
            { label: "DE", value: "de" },
          ]}
          updater={(string) => i18n.changeLanguage(string)}
          initialValue={i18n.language}
        />
        <ThemedText className="text-center" type="subtitle">
          {t("accountPage.units.title")}
        </ThemedText>
        <SettingsDropdown
          data={[
            { label: t("accountPage.units.us"), value: "us" },
            { label: t("accountPage.units.metric"), value: "metric" },
          ]}
          updater={(string) => setIsMetric(string === "metric")}
          initialValue={isMetric ? "metric" : "us"}
        />
      </MenuOptions>
    </Menu>
  );
};

export default index;

const SettingsDropdown = ({
  data,
  initialValue,
  updater,
}: {
  data: { label: string; value: string }[];
  initialValue: string;
  updater: (value: string) => void;
}) => {
  const [value, setValue] = useState<null | string>(initialValue);
  const [isFocus, setIsFocus] = useState(false);
  const backgroundColor = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  return (
    <View style={[styles.container, { backgroundColor }]}>
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
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
          updater(item.value);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
