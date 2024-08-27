/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "hsl(0, 0%, 14%)";
const tintColorDark = "hsl(38, 54%, 56%)";

export const Colors = {
  light: {
    text: "hsl(0, 0%, 14%)",
    background: "hsl(38, 54%, 56%)",
    tint: tintColorLight,
    icon: "hsl(210, 13%, 35%)",
    tabIconDefault: "hsl(210, 13%, 35%)",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "hsl(36, 16%, 82%)",
    background: "hsl(0, 0%, 14%)",
    tint: tintColorDark,
    icon: "hsl(210, 13%, 35%)",
    tabIconDefault: "hsl(210, 13%, 35%)",
    tabIconSelected: tintColorDark,
  },
};
