import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Layout() {
  const { t } = useTranslation();
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerActiveTintColor: tintColor,
          headerTintColor: tintColor,
          headerTitleStyle: { color: textColor },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Nutrient Calculator",
          }}
        />
        <Drawer.Screen
          name="AbvCalculator"
          options={{
            title: t("sideNav.abv"),
          }}
        />
        <Drawer.Screen
          name="Brix"
          options={{
            title: t("sideNav.brix"),
          }}
        />
        <Drawer.Screen
          name="EstimatedOG"
          options={{
            title: t("sideNav.estOG"),
          }}
        />
        <Drawer.Screen
          name="BenchTrials"
          options={{
            title: t("sideNav.benchTrials"),
          }}
        />
        <Drawer.Screen
          name="Stabilizers"
          options={{
            title: t("sideNav.stabilizers"),
          }}
        />
        <Drawer.Screen
          name="Refractometer"
          options={{
            title: t("sideNav.refractometer"),
          }}
        />
        <Drawer.Screen
          name="TempCorrection"
          options={{
            title: t("sideNav.tempCorrection"),
          }}
        />
        <Drawer.Screen
          name="BlendingCalc"
          options={{
            title: t("sideNav.blending"),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
