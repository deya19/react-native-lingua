import { fontAssets } from "@/theme/fonts";
import { posthog } from "@/lib/posthog";
import { useScreenTracking } from "@/hooks/useScreenTracking";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { PostHogProvider } from "posthog-react-native";
import "../global.css";

try {
  WebBrowser.maybeCompleteAuthSession();
} catch {
  // ignore — may throw in Expo Go or repeated hot reloads
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  useScreenTracking();

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="language-selection"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ClerkProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <PostHogProvider client={posthog} autocapture>
      <AppNavigator />
    </PostHogProvider>
  );
}
