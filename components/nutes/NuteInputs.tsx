import { FormData, Selected, Yeast, YeastType } from "@/app/(tabs)/extraCalcs";

import getAllYeasts from "@/constants/getAllYeasts";
import useTargetYan from "@/hooks/useTargetYan";
import useYeastAmount from "@/hooks/yeastAmount";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ThemedView } from "../ThemedView";

import BrandDropdown from "./BrandDropdown";
interface MainInputs {
  selected: FormData["selected"];
  inputs: FormData["inputs"];
  outputs: FormData["outputs"];
  maxGpl: FormData["maxGpl"];
}
export default function NuteInputs({
  yeasts,
  selected,
  inputs,
  outputs,
  maxGpl,
  setData,
  setYeasts,
  recalc,
  setRecalc,
}: MainInputs & {
  setData: Dispatch<SetStateAction<FormData>>;
  yeasts: YeastType;
  setYeasts: Dispatch<SetStateAction<YeastType>>;
  recalc: boolean;
  setRecalc: Dispatch<SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getYeasts() {
      try {
        const allYeasts = await getAllYeasts();
        const Lalvin: [] = await allYeasts.filter(
          (yeast: Yeast) => yeast.brand == "Lalvin"
        );
        const Fermentis = await allYeasts.filter(
          (yeast: Yeast) => yeast.brand == "Fermentis"
        );
        const MangroveJack = await allYeasts.filter(
          (yeast: Yeast) => yeast.brand == "Mangrove Jack"
        );
        const RedStar = allYeasts.filter(
          (yeast: Yeast) => yeast.brand == "Red Star"
        );
        const Other = await allYeasts.filter(
          (yeast: Yeast) => yeast.brand == "Other"
        );

        const data = {
          Lalvin,
          Fermentis,
          MangroveJack,
          RedStar,
          Other,
        };

        setYeasts(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    getYeasts();
  }, []);
  const { t } = useTranslation();
  const keyArr = Object.keys(maxGpl);

  const handleChange = (e: any) => {
    const target = e.target as HTMLFormElement;
    setData((prev) => ({
      ...prev,
      inputs: { ...prev.inputs, [target.name]: Number(target.value) },
    }));
  };

  useEffect(() => {
    const yeastDetails = yeasts[selected.yeastBrand].find(
      (yeast: Yeast) => yeast.name === selected.yeastStrain
    );
    setData((prev) => {
      return yeastDetails
        ? {
            ...prev,
            selected: {
              ...prev.selected,
              yeastDetails: { ...yeastDetails },
              n2Requirement: yeastDetails.nitrogen_requirement,
            },
          }
        : prev;
    });
  }, [selected.yeastBrand, selected.yeastStrain]);

  const { target } = useTargetYan(
    selected?.n2Requirement,
    inputs?.sg,
    inputs?.offset
  );

  const { yeastAmount, setYeastAmount } = useYeastAmount(
    inputs?.volume,
    inputs?.sg,
    selected?.volumeUnits,
    outputs.yeastAmount,
    recalc
  );

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      outputs: {
        targetYan: target.target,
        yeastAmount,
      },
    }));
  }, [target, yeastAmount]);

  useEffect(() => {
    setRecalc(true);
  }, [target]);

  const changeYeastBrand = (brand: Selected["yeastBrand"]) => {
    setData((prev) => ({
      ...prev,
      selected: {
        ...prev.selected,
        yeastBrand: brand,
      },
    }));
  };

  return (
    <ThemedView>
      <BrandDropdown
        data={Object.keys(yeasts)}
        onChange={changeYeastBrand}
      ></BrandDropdown>
    </ThemedView>
  );
}
