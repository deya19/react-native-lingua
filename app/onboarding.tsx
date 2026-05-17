import { images } from "@/constants/images";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View className="flex-1 bg-background px-6">
        {/* Header logo */}
        <View className="flex-row items-center gap-2 mt-4">
          <Image
            source={images.mascotLogo}
            className="w-12 h-12"
            style={styles.logoImage}
          />
          <Text className="text-[28px] font-[Poppins-Bold] text-text-primary">
            buolingo
          </Text>
        </View>

        {/* Headline */}
        <View className="mt-8">
          <Text className="text-[34px] font-[Poppins-Bold] text-text-primary leading-[42px]">
            Your AI language{"\n"}
            <Text className="text-[34px] font-[Poppins-Bold] text-lingua-purple leading-[42px]">
              teacher
            </Text>
            <Text className="text-[34px] font-[Poppins-Bold] text-text-primary">
              .
            </Text>
          </Text>
          <Text className="body-medium text-text-secondary mt-3">
            Real conversations, personalized{"\n"}lessons, anytime, anywhere.
          </Text>
        </View>

        {/* Mascot with speech bubbles */}
        <View className="flex-1 items-center justify-center relative mt-2">
          {/* Hello bubble - left */}
          <View
            className="absolute bg-[#f0ecff] rounded-2xl px-4 py-2.5 left-1"
            style={[styles.bubbleLeft, styles.shadow]}
          >
            <Text className="text-[15px] font-[Poppins-Medium] text-text-primary">
              Hello!
            </Text>
          </View>

          {/* ¡Hola! bubble - top right */}
          <View
            className="absolute bg-[#eef4ff] rounded-2xl px-4 py-2.5 right-1"
            style={[styles.bubbleTopRight, styles.shadow]}
          >
            <Text className="text-[15px] font-[Poppins-Medium] text-text-primary">
              ¡Hola!
            </Text>
          </View>

          {/* 你好! bubble - right */}
          <View
            className="absolute bg-[#fff0f0] rounded-2xl px-4 py-2.5 right-2"
            style={[styles.bubbleBottomRight, styles.shadow]}
          >
            <Text className="text-[15px] font-[Poppins-Medium] text-[#e03a3a]">
              你好！
            </Text>
          </View>

          <Image
            source={images.mascotWelcome}
            className="w-[340px] h-[340px]"
            style={styles.mascotImage}
          />
        </View>

        {/* Get Started button */}
        <View className="pb-8">
          <TouchableOpacity
            className="bg-lingua-purple rounded-[18px] py-[18px] flex-row items-center justify-center gap-2"
            activeOpacity={0.85}
            onPress={() => router.push("/")}
          >
            <Text className="text-[17px] font-[Poppins-SemiBold] text-white">
              Get Started
            </Text>
            <Text className="text-[22px] font-[Poppins-Bold] text-white leading-[26px]">
              ›
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  logoImage: {
    resizeMode: "contain",
  },
  mascotImage: {
    resizeMode: "contain",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  bubbleLeft: {
    top: "28%",
  },
  bubbleTopRight: {
    top: "8%",
  },
  bubbleBottomRight: {
    top: "52%",
  },
});
