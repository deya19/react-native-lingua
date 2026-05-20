import { languages } from "@/data/languages";
import type { LanguageCode } from "@/types/learning";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand/react";

const ALLOWED_CODES = languages.map((l) => l.code) as LanguageCode[];

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
      version: 1,
      migrate: (state: unknown) => {
        const s = state as Partial<LanguageState>;
        return {
          ...s,
          selectedLanguage: ALLOWED_CODES.includes(
            s?.selectedLanguage as LanguageCode,
          )
          ? s.selectedLanguage
          : null,
        };
      },
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
