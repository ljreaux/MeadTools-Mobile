import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useMaxGpl from "@/hooks/useMaxGpl";
import { initialData } from "@/constants/initialData";
import NuteInputs from "@/components/nutes/NuteInputs";
import { ThemedView } from "@/components/ThemedView";
export type Yeast = {
  brand: string;
  id: number;
  name: string;
  nitrogen_requirement: string;
  tolerance: number | string;
  low_temp: number;
  high_temp: number;
};
export interface YeastType {
  Lalvin: Yeast[];
  Fermentis: Yeast[];
  MangroveJack: Yeast[];
  RedStar: Yeast[];
  Other: Yeast[];
}
export interface Selected {
  yeastBrand: keyof YeastType;
  yeastStrain: string;
  yeastDetails: {
    brand?: string;
    id?: number;
    name: string;
    nitrogen_requirement: string;
    tolerance: number | string;
    low_temp: number;
    high_temp: number;
  };
  n2Requirement: string;
  volumeUnits: string;
  schedule: keyof FormData["maxGpl"];
}

interface GplEntries {
  name: string;
  value: number[];
}

export interface FormData {
  maxGpl: {
    tbe: GplEntries;
    tosna: GplEntries;
    justK: GplEntries;
    dap: GplEntries;
    oAndk: {
      name: string;
      value: number[][];
    };
    oAndDap: GplEntries;
    kAndDap: GplEntries;
  };
  selected: Selected;
  inputs: {
    volume: number;
    sg: number;
    offset: number;
    numberOfAdditions: number;
  };
  yanContribution: number[];
  outputs: {
    targetYan: number;
    yeastAmount: number;
  };
}
const index = () => {
  const { t } = useTranslation();
  const [advanced, setAdvanced] = useState(false);
  const [nuteInfo, setNuteInfo] = useState<null | {
    ppmYan: number[];
    totalGrams: number[];
    perAddition: number[];
    totalYan: number;
    remainingYan: number;
    gf: {
      gf: number;
      gfWater: number;
    };
  }>(null);

  useEffect(() => {
    if (advanced) setYanFromSource([0, 0, 0]);
    else setYanFromSource(null);
  }, [advanced]);

  const [yanContribution, setYanContribution] = useState([40, 100, 210]);
  const [yanFromSource, setYanFromSource] = useState<number[] | null>(null);
  const [data, setData] = useState<FormData>({ ...initialData });
  const maxGPL = useMaxGpl(
    data.maxGpl,
    data.selected.schedule,
    data.inputs?.sg
  );
  const [yeasts, setYeasts] = useState<YeastType>({
    Lalvin: [],
    Fermentis: [],
    MangroveJack: [],
    RedStar: [],
    Other: [],
  });
  const [recalc, setRecalc] = useState(true);
  return (
    <ThemedView className="flex-1">
      <NuteInputs
        {...data}
        setData={setData}
        yeasts={yeasts}
        setYeasts={setYeasts}
        recalc={recalc}
        setRecalc={setRecalc}
      />
    </ThemedView>
  );
};

export default index;
