import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { getUserInfo as getCurrentUser } from "@/helpers/Login";

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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
