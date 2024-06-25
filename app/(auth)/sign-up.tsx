import { ScrollView, Alert, View, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { auth, register } from "@/helpers/Login";
import { useGlobalContext } from "@/context/GlobalProvider";
import LightButton from "@/assets/images/android_light_sq_ctn.svg";
import DarkButton from "@/assets/images/android_dark_sq_ctn.svg";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

const SignUp = () => {
  const redirectTo = makeRedirectUri();

  const createSessionFromUrl = async (url: string) => {
    const { params } = QueryParams.getQueryParams(url);

    const { token, refreshToken, email } = params;

    if (token && refreshToken && email) {
      setUser({
        refreshToken,
        email,
        token,
      });
      router.replace("/home");
    }
    return;
  };
  const performOAuth = async () => {
    const { url } = await auth();

    const res = await WebBrowser.openAuthSessionAsync(url ?? "", redirectTo);

    if (res.type === "success") {
      const { url } = res;
      await createSessionFromUrl(url);
    }
  };

  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);
  const colorScheme = useColorScheme();
  const Button =
    colorScheme === "light"
      ? ({ width, height }: { width: number; height: number }) => (
          <LightButton width={width} height={height} />
        )
      : ({ width, height }: { width: number; height: number }) => (
          <DarkButton width={width} height={height} />
        );
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setUser } = useGlobalContext();

  const submit = async () => {
    if (!form.password || !form.email) {
      Alert.alert("Error", "Please Fill in all the fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await register(form);

      if (!response.message.toLowerCase().includes("success"))
        throw new Error(response.message);
      setUser({
        email: response.email,
        token: response.accessToken,
        refreshToken: response.refreshToken,
      });
      Alert.alert(response.message);
      router.replace("/home");
    } catch (error: any) {
      setUser(null);
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView className="h-full">
        <ThemedView className="w-full justify-center min-h-[100vh] px-4">
          <ThemedText className="text-3xl text-center">
            Log in to Meadtools
          </ThemedText>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="my-7"
            isLoading={isSubmitting}
          />
          <View className="flex items-center justify-center w-full">
            <ThemedText className="pt-4 text-3xl font-bold">OR</ThemedText>
            <Button width={400} height={200} />
          </View>
          <ThemedView className="flex-row justify-center gap-2 pt-5">
            <ThemedText className="text-lg text-gray-100 font-pregular">
              Already have an account?
            </ThemedText>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary-200"
            >
              Sign In
            </Link>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
