import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileTab() {
  const handleResetStorage = async () => {
    Alert.alert(
      "Reset Storage",
      "This will clear all saved data and take you back to language selection.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace("/language-selection");
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-1 items-center justify-center gap-4">
        <Text className="text-heading-2 text-text-primary">Profile</Text>
        <Text className="text-body-medium text-text-secondary mt-2">
          Placeholder — UI coming soon
        </Text>
        <TouchableOpacity
          onPress={handleResetStorage}
          className="mt-6 rounded-lingua-lg bg-error px-6 py-3"
          activeOpacity={0.8}
        >
          <Text className="font-[Poppins-SemiBold] text-body-medium text-white">
            Reset Storage (Dev)
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
