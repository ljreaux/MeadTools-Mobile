import { useTranslation } from "react-i18next";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

export default function AbvLine({
  ABV,
  delle,
}: {
  ABV: number;
  delle: number;
}) {
  const { t } = useTranslation();
  return (
    <ThemedView className="items-center">
      <ThemedText className="text-2xl">
        {Math.round(ABV * 100) / 100}% {t("ABV")}
      </ThemedText>
      <ThemedText className="text-2xl">
        {Math.round(delle)} {t("DU")}
      </ThemedText>
    </ThemedView>
  );
}
