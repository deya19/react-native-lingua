import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-background justify-center items-center px-6">
      <Text className="h1 text-lingua-purple text-center mb-4">buolingo</Text>
      <TouchableOpacity
        style={styles.link}
        onPress={() => router.push("/onboarding")}
      >
        <Text style={styles.linkText}>Go to Onboarding →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  link: {
    backgroundColor: "#6c4ef5",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  linkText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#ffffff",
  },
});
