import { View } from "react-native";
import React, { useEffect } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import images from "@/constants/Images";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { Image } from "expo-image";

const index = () => {
  const { t } = useTranslation();
  const { isLoggedIn } = useGlobalContext();

  useEffect(() => {
    if (isLoggedIn) router.replace("/home");
  }, [isLoggedIn]);
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
  return (
    <View className="h-full pt-16">
      <View className="items-center justify-center flex-1">
        <Image
          source={images.smallLogo}
          className="w-full h-[100px] mb-4"
          contentFit="contain"
          placeholder={{ blurhash }}
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
            style={{
              flex: 0.5,
              marginVertical: 20,
              width: "100%",
            }}
            contentFit="contain"
            placeholder={{ blurhash }}
          />
          <CustomButton
            title="Continue with Email"
            handlePress={() => {
              router.push("/sign-in");
            }}
            containerStyles="w-11/12 mt-7"
          />
        </ThemedView>
      </View>
    </View>
  );
};

export default index;
