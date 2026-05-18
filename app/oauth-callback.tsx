import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function OAuthCallbackScreen() {
  useEffect(() => {
    // Clerk's maybeCompleteAuthSession() handles the actual redirect
    // This route exists only so Expo Router doesn't show "Unmatched Route"
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    </>
  );
}
