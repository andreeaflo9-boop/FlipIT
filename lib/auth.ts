
import { Platform } from "react-native";

const TOKEN_KEY = "flipit_auth_token";
const USER_KEY = "flipit_user";

export type User = {
    id: number;
    name: string | null;
    email: string;
};

function hasLocalStorage() {
    return Platform.OS === "web" && typeof window !== "undefined";
}

export async function getAuthToken(): Promise<string | null> {
    if (hasLocalStorage()) {
        return window.localStorage.getItem(TOKEN_KEY);
    }

    return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setAuthToken(token: string): Promise<void> {
    if (hasLocalStorage()) {
        window.localStorage.setItem(TOKEN_KEY, token);
        return;
    }

    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeAuthToken(): Promise<void> {
    if (hasLocalStorage()) {
        window.localStorage.removeItem(TOKEN_KEY);
        return;
    }

    await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function getUserInfo(): Promise<User | null> {
    const value = hasLocalStorage()
        ? window.localStorage.getItem(USER_KEY)
        : await SecureStore.getItemAsync(USER_KEY);

    if (!value) return null;

    try {
        return JSON.parse(value) as User;
    } catch {
        await clearUserInfo();
        return null;
    }
}

export async function setUserInfo(user: User): Promise<void> {
    const value = JSON.stringify(user);

    if (hasLocalStorage()) {
        window.localStorage.setItem(USER_KEY, value);
        return;
    }

    await SecureStore.setItemAsync(USER_KEY, value);
}

export async function clearUserInfo(): Promise<void> {
    if (hasLocalStorage()) {
        window.localStorage.removeItem(USER_KEY);
        return;
    }

    await SecureStore.deleteItemAsync(USER_KEY);
}

export async function clearAuthStorage(): Promise<void> {
    await removeAuthToken();
    await clearUserInfo();
}