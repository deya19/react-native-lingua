import type { LanguageCode } from "@/types/learning";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand/react";

interface LanguageState {
  selectedLanguage: LanguageCode | null;
  setSelectedLanguage: (code: LanguageCode) => void;
  clearLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguage: null,
      setSelectedLanguage: (code) => set({ selectedLanguage: code }),
      clearLanguage: () => set({ selectedLanguage: null }),
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
