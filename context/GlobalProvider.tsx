import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { getUserInfo as getCurrentUser } from "@/helpers/Login";
import getAllIngredients, { IngredientListItem } from "@/helpers/Ingredients";
import { useTranslation } from "react-i18next";
import lodash from "lodash";
import { ingredientTranslations } from "@/localization/ingredients";
import { initialIngredients } from "@/constants/initialIngredients";
import { RecipeData } from "@/components/Dropdown";
import { toBrix, toSG } from "@/helpers/unitConverters";
import useBlend from "@/hooks/useBlend";
import useAbv from "@/hooks/useAbv";
type User = null | {
  token: string;
  refreshToken: string | null;
  email: string;
};

type UserData = {
  email: string;
  id: number;
  recipes: { id: number; user_id: number; name: string }[];
};
interface ContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  userData: UserData;
  setUserData: Dispatch<SetStateAction<UserData>>;
  loading: boolean;
  ingredients: IngredientListItem[];
  setIngredients: Dispatch<SetStateAction<IngredientListItem>>;
  recipeData: RecipeData;
  setRecipeData: Dispatch<SetStateAction<RecipeData>>;
  isMetric: boolean;
  setIsMetric: Dispatch<SetStateAction<boolean>>;
  setSubmit: Dispatch<SetStateAction<boolean>>;
  blendFG: number;
  ABV: number;
  delle: number;
  totalPrimaryVolume: number;
  totalVolume: number;
  textDetails: {
    ingredients: {
      id: number;
      details: string[];
      brix: string;
    }[];
  };
  setTextDetails: Dispatch<
    SetStateAction<{
      ingredients: {
        id: number;
        details: string[];
        brix: string;
      }[];
    }>
  >;
}

const GlobalContext = createContext<any>(null);

export const useGlobalContext = () => useContext<ContextType>(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const currentUser = {
    token: SecureStore.getItem("token") || "",
    refreshToken: SecureStore.getItem("refreshToken") || null,
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<null | {
    token: string;
    refreshToken: string | null;
  }>(currentUser.token ? currentUser : null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMetric, setIsMetric] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientListItem[]>([]);
  const [recipeData, setRecipeData] = useState({
    ingredients: initialIngredients,
    OG: 0,
    volume: 0,
    ABV: 0,
    FG: 0.996,
    offset: 0,
    units: {
      weight: isMetric ? "kg" : "lbs",
      volume: isMetric ? "liter" : "gal",
    },
    additives: [{ name: "", amount: 0, unit: "g" }],
  });
  const [submit, setSubmit] = useState(false);

  const { t } = useTranslation();
  const sortingFn = (a: IngredientListItem, b: IngredientListItem) => {
    // putting Honey and Water at top of list
    if (
      a.name.toLowerCase() === "honey" ||
      (a.name.toLowerCase() === "water" && b.name !== "honey")
    )
      return -1;
    if (
      b.name.toLowerCase() === "honey" ||
      (b.name.toLowerCase() === "water" && a.name.toLowerCase() !== "honey")
    )
      return 1;

    const nameA = t(`${lodash.camelCase(a.name)}`).toLowerCase(); // ignore upper and lowercase
    const nameB = t(`${lodash.camelCase(b.name)}`).toLowerCase(); // ignore upper and lowercase

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  };

  useEffect(() => {
    const token = user?.token || "";
    getCurrentUser(token)
      .then((res) => {
        if (res.name === "MissingUserError") throw new Error(res.message);
        if (res) {
          SecureStore.setItem("token", token);
          SecureStore.setItem("id", JSON.stringify(res.id));
          if (user?.refreshToken)
            SecureStore.setItem("refreshToken", user.refreshToken);
          setUserData(res);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });

    getAllIngredients()
      .then((res) => {
        return res.sort((a: IngredientListItem, b: IngredientListItem) =>
          sortingFn(a, b)
        );
      })
      .then((ingredients) => setIngredients(ingredients))
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  const totalBlended = recipeData.ingredients.map((ingredient) => {
    return [toSG(ingredient.brix), ingredient.details[1]];
  });
  const withOutSecondary: number[][] = [];
  const justSecondary: number[][] = [];
  const offsetArr: number[] = [];
  recipeData.ingredients.forEach((ingredient) => {
    if (!ingredient.secondary) {
      withOutSecondary.push([toSG(ingredient.brix), ingredient.details[1]]);
      if (ingredient.category === "fruit")
        offsetArr.push(ingredient.details[0] * 25);
    } else {
      justSecondary.push([toSG(ingredient.brix), ingredient.details[1]]);
    }
  });
  const { blend, runBlendingFunction } = useBlend(totalBlended);
  const {
    blend: noSecondaryBlend,
    runBlendingFunction: secondaryBlendFunction,
  } = useBlend(withOutSecondary);
  const secondaryBlend = useBlend(justSecondary);

  function runBlends() {
    (async () => {
      runBlendingFunction();
      secondaryBlendFunction();
    })().then(() => {
      secondaryBlend.runBlendingFunction();
    });
  }

  const [blendFG, setBlendFG] = useState(
    Math.round(
      ((noSecondaryBlend.totalVolume * recipeData.FG +
        secondaryBlend.blend.totalVolume * secondaryBlend.blend.blendedValue) /
        blend.totalVolume) *
        1000
    ) / 1000 || recipeData.FG
  );

  useEffect(() => {
    if (submit) {
      runBlends();
    }
    setSubmit(false);
  }, [submit]);
  useEffect(() => {
    setBlendFG(
      Math.round(
        ((noSecondaryBlend.totalVolume * recipeData.FG +
          secondaryBlend.blend.totalVolume *
            secondaryBlend.blend.blendedValue) /
          blend.totalVolume) *
          1000
      ) / 1000
    );
  }, [noSecondaryBlend, recipeData.FG, secondaryBlend, blend]);

  function calculateABV({ ABV, delle }: { ABV: number; delle: number }) {
    if (blend.blendedValue > noSecondaryBlend.blendedValue) {
      const numerator = ABV * noSecondaryBlend.totalVolume;
      const denominator = blend.totalVolume;
      ABV = numerator / denominator;
      delle = toBrix(recipeData.FG) + 4.5 * ABV;
    }
    setRecipeData((prev) => ({
      ...prev,
      OG: noSecondaryBlend.blendedValue,
      FG: prev.FG,
      offset: offsetArr.reduce((prev, curr) => {
        return curr / noSecondaryBlend.totalVolume + prev;
      }, 0),
      volume: noSecondaryBlend.totalVolume,
      ABV,
    }));
    return { ABV, delle };
  }

  const ABVOBJ = useAbv({ OG: blend.blendedValue, FG: blendFG });

  const [{ ABV, delle }, setABVDelle] = useState({ ABV: 0, delle: 0 });

  const { units } = recipeData;
  const [textDetails, setTextDetails] = useState({
    ingredients: recipeData.ingredients.map((ing) => {
      return {
        id: ing.id,
        details: ing.details.map((det) => det.toFixed(3)),
        brix: ing.brix.toString(),
      };
    }),
  });

  useEffect(() => {
    const multiplier = units.weight === "kg" ? 0.453592 : 2.20462;
    setRecipeData((prev) => {
      return {
        ...prev,
        ingredients: prev.ingredients.map((ing) => ({
          ...ing,
          details: [
            Math.round(ing.details[0] * multiplier * 1000) / 1000,
            ing.details[1],
          ],
        })),
      };
    });
    setTextDetails((prev) => {
      return {
        ingredients: prev.ingredients.map((ing) => ({
          ...ing,
          details: [
            (Number(ing.details[0]) * multiplier).toFixed(3),
            ing.details[1],
          ],
        })),
      };
    });
  }, [units.weight]);

  useEffect(() => {
    const multiplier = units.volume === "liter" ? 3.78541 : 0.264172;
    setRecipeData((prev) => {
      return {
        ...prev,
        ingredients: prev.ingredients.map((ing) => ({
          ...ing,
          details: [
            ing.details[0],
            Math.round(ing.details[1] * multiplier * 1000) / 1000,
          ],
        })),
      };
    });
    setTextDetails((prev) => {
      return {
        ingredients: prev.ingredients.map((ing) => ({
          ...ing,
          details: [
            ing.details[0],
            (Number(ing.details[1]) * multiplier).toFixed(3),
          ],
        })),
      };
    });
  }, [units.volume]);

  useEffect(() => {
    setABVDelle(calculateABV(ABVOBJ));
  }, [ABVOBJ.ABV]);

  useEffect(() => {
    setRecipeData((prev) => ({
      ...prev,
      units: {
        weight: isMetric ? "kg" : "lbs",
        volume: isMetric ? "liter" : "gal",
      },
    }));
  }, [isMetric]);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        userData,
        setUserData,
        loading,
        ingredients,
        setIngredients,
        recipeData,
        setRecipeData,
        isMetric,
        setIsMetric,
        blendFG,
        setSubmit,
        ABV,
        delle,
        totalPrimaryVolume:
          Math.round(noSecondaryBlend.totalVolume * 1000) / 1000,
        totalVolume: Math.round(blend.totalVolume * 1000) / 1000,
        textDetails,
        setTextDetails,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
