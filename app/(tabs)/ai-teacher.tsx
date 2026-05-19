import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AITeacherTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-heading-2 text-text-primary">AI Teacher</Text>
        <Text className="text-body-medium text-text-secondary mt-2">
          Placeholder — UI coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}
