import { View, Image } from "react-native";
import React, { useEffect } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import images from "@/constants/Images";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";

const index = () => {
  const { t } = useTranslation();
  const { isLoggedIn } = useGlobalContext();

  // useEffect(() => {
  //   if (isLoggedIn) router.replace("/home");
  // }, [isLoggedIn]);
  return (
    <SafeAreaView className="h-full">
      <View className="items-center justify-center w-full h-full">
        <Image
          source={images.smallLogo}
          className="w-full h-[100px] mb-4"
          resizeMode="contain"
        />
        <ThemedView className="items-center flex-1 w-full">
          <ThemedText type="title" className="mt-8">
            Welcome to MeadTools
          </ThemedText>
          <ThemedText type="subtitle" className="text-center">
            The all-in-one Mead, Wine and Cider making calculator.
          </ThemedText>
          <Image
            source={images.defaultImage}
            className="w-full max-h-[25vh] my-8"
            resizeMode="contain"
          />
          <CustomButton
            title="Continue with Email"
            handlePress={() => {
              router.push("/sign-in");
            }}
            containerStyles="w-full mt-7"
          />
        </ThemedView>
      </View>
    </SafeAreaView>
  );
};

export default index;
