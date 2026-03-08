import { create } from "zustand";

interface AppState {
    language: string;
    setLanguage: (lang: string) => void;
    user: any | null;
    setUser: (user: any | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
}

export const useStore = create<AppState>((set) => ({
    language: "en",
    setLanguage: (lang) => set({ language: lang }),
    user: null,
    setUser: (user) => set({ user }),
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    setToken: (token) => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
        set({ token });
    },
    logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null });
    },
}));
