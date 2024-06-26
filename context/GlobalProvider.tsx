import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { getUserInfo as getCurrentUser } from "@/helpers/Login";
import getAllIngredients, { IngredientListItem } from "@/helpers/Ingredients";
import { useTranslation } from "react-i18next";
import lodash from "lodash";
import { ingredientTranslations } from "@/localization/ingredients";
import { initialIngredients } from "@/constants/initialIngredients";
interface ContextType {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  user: null | { id: string; token: string; resfreshToken: string | null };
  setUser: React.Dispatch<
    React.SetStateAction<null | {
      id: string;
      token: string;
      resfreshToken: string | null;
    }>
  >;
  loading: boolean;
}

const GlobalContext = createContext<null | any>(null);

export const useGlobalContext = () => useContext(GlobalContext);

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

  const { t } = useTranslation();
  const sortingFn = (a: IngredientListItem, b: IngredientListItem) => {
    // putting Honey and Water at top of list
    if (a.name === "Honey" || (a.name === "Water" && b.name !== "Honey"))
      return -1;
    if (b.name === "Honey" || (b.name === "Water" && a.name !== "Honey"))
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

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        setIsLoggedIn: setIsLoggedIn,
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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
