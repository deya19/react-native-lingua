import { useUser } from "@clerk/expo";
import { Redirect } from "expo-router";

import { useLanguageStore } from "@/store/languageStore";

export default function HomeScreen() {
  const { user, isLoaded } = useUser();
  const selectedLanguage = useLanguageStore((s) => s.selectedLanguage);

  if (!isLoaded) return null;

  if (!user) {
    return <Redirect href="/onboarding" />;
  }

  if (!selectedLanguage) {
    return <Redirect href="/language-selection" />;
  }

  return <Redirect href="/(tabs)" />;
}
