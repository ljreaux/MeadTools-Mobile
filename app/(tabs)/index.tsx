import { StyleSheet, Text } from "react-native";

import { View } from "react-native";
import { useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function HomeScreen() {
  const { userData } = useGlobalContext();
  return (
    <View>
      <Text>Hi</Text>
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
