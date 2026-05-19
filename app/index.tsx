import { useClerk, useUser } from "@clerk/expo";
import { Redirect, router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!user) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View className="flex-1 bg-background px-6 justify-center items-center">
        <Text className="text-[28px] font-[Poppins-Bold] text-text-primary mb-2">
          Welcome! 🎉
        </Text>
        <Text className="body-medium text-text-secondary mb-8">
          {user.emailAddresses[0]?.emailAddress ?? user.id}
        </Text>
        <TouchableOpacity
          className="bg-lingua-purple px-8 py-4 rounded-[14px] mb-4"
          activeOpacity={0.85}
          onPress={() => router.push("/language-selection")}
        >
          <Text className="text-[16px] font-[Poppins-SemiBold] text-white">
            Choose Language
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-8 py-4 rounded-[14px] border border-border"
          activeOpacity={0.85}
          onPress={() => signOut()}
        >
          <Text className="text-[16px] font-[Poppins-SemiBold] text-text-primary">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
