import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { useLanguageStore } from "@/store/languageStore";
import type { LanguageCode } from "@/types/learning";
import { Stack, router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LanguageSelectionScreen() {
  const [selected, setSelected] = useState<LanguageCode>("es");
  const [search, setSearch] = useState("");
  const setSelectedLanguage = useLanguageStore((s) => s.setSelectedLanguage);

  const filtered = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(search.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="flex-row items-center px-6 pt-2 pb-4">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center"
              onPress={() => router.back()}
            >
              <Text className="text-heading-2 text-text-primary">{"<"}</Text>
            </TouchableOpacity>
            <View className="flex-1 items-center mr-10">
              <Text className="text-[18px] font-[Poppins-SemiBold] text-text-primary">
                Choose a language
              </Text>
            </View>
          </View>

          {/* Search bar */}
          <View className="px-6 mb-4">
            <View className="flex-row items-center bg-surface rounded-lingua-lg px-4 border border-border">
              <Text className="text-[16px] text-text-secondary mr-2">🔍</Text>
              <TextInput
                className="flex-1 text-[15px] font-[Poppins-Regular] text-text-primary"
                placeholder="Search languages"
                placeholderTextColor="#9ca3af"
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </View>

          {/* Popular label */}
          <View className="px-6 mb-2">
            <Text className="text-body-medium font-[Poppins-SemiBold] text-text-secondary">
              Popular
            </Text>
          </View>

          {/* Language list */}
          <View className="px-6">
            {filtered.map((lang, index) => {
              const isSelected = selected === lang.code;
              return (
                <View key={lang.code}>
                  <TouchableOpacity
                    className={`flex-row items-center py-4 px-4 rounded-lingua-lg border ${
                      isSelected
                        ? "border-lingua-purple bg-[#f3f0ff]"
                        : "border-transparent"
                    }`}
                    activeOpacity={0.7}
                    onPress={() => setSelected(lang.code)}
                  >
                    {/* Flag circle */}
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: lang.color + "20" }}
                    >
                      <Image
                        source={{ uri: lang.flag }}
                        className="h-12 w-12 rounded-full"
                      />
                    </View>

                    {/* Name & learners */}
                    <View className="flex-1">
                      <Text className="text-[16px] font-[Poppins-SemiBold] text-text-primary">
                        {lang.name}
                      </Text>
                      <Text className="text-body-small font-[Poppins-Regular]">
                        {lang.learners}
                      </Text>
                    </View>

                    {/* Checkmark or chevron */}
                    {isSelected ? (
                      <View className="w-7 h-7 rounded-full bg-lingua-purple items-center justify-center">
                        <Text className="text-white text-body-medium font-[Poppins-Bold]">
                          ✓
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-[18px] text-text-secondary">›</Text>
                    )}
                  </TouchableOpacity>
                  {index < filtered.length - 1 && (
                    <View className="h-px bg-border mx-4" />
                  )}
                </View>
              );
            })}
          </View>

          {/* Confirm button */}
          <View className="px-6 mt-2">
            <TouchableOpacity
              className="bg-lingua-purple py-4 rounded-lingua-lg items-center"
              activeOpacity={0.85}
              onPress={() => {
                setSelectedLanguage(selected);
                router.replace("/");
              }}
            >
              <Text className="text-[16px] font-[Poppins-SemiBold] text-white">
                Continue
              </Text>
            </TouchableOpacity>
          </View>

          {/* Earth illustration */}
          <View className="items-center -mt-12" pointerEvents="none">
            <Image
              source={images.earth}
              className="w-[600px] h-[360px]"
              resizeMode="contain"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scroll: {
    flexGrow: 1,
  },
});
