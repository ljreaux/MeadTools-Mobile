import { API_URL } from "@/app/_layout";
import * as SecureStore from "expo-secure-store";

export async function login(obj: { email: string; password: string }) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });
  const data = await response.json();

  return data;
}

export async function register(obj: { email: string; password: string }) {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });
  const data = await response.json();
  return data;
}

export async function getUserInfo(token: string) {
  let response = await fetch(`${API_URL}/users/accountInfo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  let data = await response.json();

  if (data.message === "jwt expired") {
    const reToken = SecureStore.getItem("refreshToken");
    if (!reToken) return null;
    const user = SecureStore.getItem("user") || "";
    const email = JSON.parse(user).email;

    let newToken;
    if (email && reToken) {
      newToken = await refreshToken(reToken, email);
    }

    if (newToken) {
      const { accessToken } = newToken;
      SecureStore.setItem("token", accessToken);
      await SecureStore.deleteItemAsync("refreshToken");
      response = await fetch(`${API_URL}/users/accountInfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      data = await response.json();
    }
  }
  if (data.message === "jwt malformed") return null;

  return data;
}

export async function getRecipeById(id: number, token: string) {
  const response = await fetch(`${API_URL}/recipes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = response.json();
  return data;
}

const refreshToken = async (refreshToken: string, email: string) => {
  const response = await fetch(`${API_URL}/users/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken, email }),
  });
  const data = await response.json();
  return data;
};

export async function auth() {
  const response = await fetch(`${API_URL}/request`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({ mobile: true }),
  });
  const data = await response.json();

  return data;
}
