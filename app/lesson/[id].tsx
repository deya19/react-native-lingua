import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { lessons } from "@/data/lessons";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LESSON_TITLES = [
  "Greetings & Introductions",
  "Daily Life",
  "At the Café",
  "Travel & Directions",
  "Shopping",
  "Family & Friends",
];

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = lessons.find((item) => item.id === id);
  const title = lesson
    ? (LESSON_TITLES[lesson.order - 1] ?? lesson.title)
    : "Lesson";
  const language = languages.find((item) => item.code === lesson?.languageCode);
  const teacherLine =
    lesson?.phrases[0]?.text ??
    lesson?.aiTeacherPrompt?.practiceScript ??
    "¡Muy bien!";
  const teacherTranslation =
    lesson?.phrases[0]?.translation ??
    lesson?.goals[0]?.description ??
    "That was great!";

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-white">
        <View className="h-[78px] flex-row items-center px-6 pt-2">
          <TouchableOpacity
            className="mr-4 h-10 w-8 justify-center"
            activeOpacity={0.75}
            onPress={() => router.back()}
          >
            <Feather name="chevron-left" size={30} color="#11182F" />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="font-[Poppins-Bold] text-[19px] leading-[25px] text-[#11182F]">
              AI Teacher
            </Text>
            <View className="mt-1 flex-row items-center">
              <View className="mr-[6px] h-[10px] w-[10px] rounded-full bg-[#62D84E]" />
              <Text className="font-[Poppins-Medium] text-[14px] leading-[18px] text-[#61708F]">
                Online
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="mr-[8px] h-[39px] w-[39px] items-center justify-center rounded-full border border-[#E6E8F0] bg-white"
            activeOpacity={0.75}
          >
            <Feather name="video" size={19} color="#11182F" />
          </TouchableOpacity>
          <View className="mr-[8px] h-[39px] w-[39px] items-center justify-center rounded-full border border-[#E6E8F0] bg-[#FAFBFF]">
            <Text className="font-[Poppins-SemiBold] text-[16px] text-[#11182F]">
              {lesson?.order ?? 12}
            </Text>
          </View>
          <TouchableOpacity
            className="h-[39px] w-[39px] items-center justify-center rounded-full border border-[#E6E8F0] bg-white"
            activeOpacity={0.75}
          >
            <Feather name="bell" size={19} color="#11182F" />
          </TouchableOpacity>
        </View>

        <View className="mx-2 mt-[22px] h-[590px] overflow-hidden rounded-[22px] bg-[#BBB5AC]">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&h=1200&fit=crop",
            }}
            className="absolute inset-0 h-full w-full opacity-60"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/10" />

          <Image
            source={images.mascotWelcome}
            className="absolute left-[26px] top-[42px] h-[310px] w-[290px]"
            resizeMode="contain"
          />

          <View className="absolute right-[14px] top-[16px] h-[153px] w-[104px] overflow-hidden rounded-[15px] border-[3px] border-white bg-[#E8EFE6]">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=420&fit=crop",
              }}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>

          <View
            className="absolute left-[40px] top-[225px] h-[92px] w-[280px] rounded-[13px] bg-white px-[18px] py-[15px]"
            style={styles.bubble}
          >
            <Text
              className="font-[Poppins-Bold] text-[12px] leading-[26px] text-[#11182F]"
              numberOfLines={1}
            >
              {teacherLine}
            </Text>
            <View className="mt-[5px] flex-row items-center justify-between">
              <Text
                className="max-w-[210px] font-[Poppins-SemiBold] text-[12px] leading-[25px] text-[#11182F]"
                numberOfLines={1}
              >
                {teacherTranslation} 👋
              </Text>
              <Ionicons name="volume-high" size={28} color="#5D45FF" />
            </View>
            <View className="absolute bottom-[-16px] right-[14px] h-0 w-0 border-l-[18px] border-t-[18px] border-l-transparent border-t-white" />
          </View>

          <View className="absolute bottom-[155px] left-0 right-0 flex-row justify-around px-[15px]">
            <View className="items-center">
              <TouchableOpacity
                className="h-[56px] w-[56px] items-center justify-center rounded-full bg-white"
                activeOpacity={0.8}
              >
                <Feather name="video" size={26} color="#101936" />
              </TouchableOpacity>
              <Text className="mt-[8px] font-[Poppins-SemiBold] text-[13px] text-white">
                Camera
              </Text>
            </View>

            <View className="items-center">
              <TouchableOpacity
                className="h-[56px] w-[56px] items-center justify-center rounded-full bg-white"
                activeOpacity={0.8}
              >
                <Feather name="mic" size={26} color="#101936" />
              </TouchableOpacity>
              <Text className="mt-[8px] font-[Poppins-SemiBold] text-[13px] text-white">
                Mic
              </Text>
            </View>

            <View className="items-center">
              <TouchableOpacity
                className="h-[56px] w-[56px] items-center justify-center rounded-full bg-white"
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="translate"
                  size={27}
                  color="#101936"
                />
              </TouchableOpacity>
              <Text className="mt-[8px] font-[Poppins-SemiBold] text-[13px] text-white">
                Subtitles
              </Text>
            </View>

            <View className="items-center">
              <TouchableOpacity
                className="h-[56px] w-[56px] items-center justify-center rounded-full bg-[#FB4742]"
                activeOpacity={0.8}
                onPress={() => router.back()}
              >
                <Feather name="phone" size={27} color="#ffffff" />
              </TouchableOpacity>
              <Text className="mt-[8px] font-[Poppins-SemiBold] text-[13px] text-white">
                End Call
              </Text>
            </View>
          </View>

          <View className="absolute bottom-[24px] left-[15px] right-[15px] h-[123px] flex-row rounded-[16px] bg-white px-[20px] py-[24px]">
            <View className="flex-1">
              <Text
                className="font-[Poppins-Bold] text-[14px] text-[#11182F]"
                numberOfLines={1}
              >
                Speaking
              </Text>
              <Text className="mt-[13px] font-[Poppins-Bold] text-[14px] text-[#58D446]">
                Excellent
              </Text>
            </View>
            <View className="mx-[12px] h-[66px] w-px bg-[#E4E7F0]" />
            <View className="flex-1">
              <Text
                className="font-[Poppins-Bold] text-[14px] text-[#11182F]"
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Pronunciation
              </Text>
              <Text className="mt-[13px] font-[Poppins-Bold] text-[14px] text-[#3289FF]">
                Great
              </Text>
            </View>
            <View className="mx-[12px] h-[66px] w-px bg-[#E4E7F0]" />
            <View className="flex-1">
              <Text
                className="font-[Poppins-Bold] text-[14px] text-[#11182F]"
                numberOfLines={1}
              >
                Grammar
              </Text>
              <Text className="mt-[13px] font-[Poppins-Bold] text-[14px] text-[#5D45FF]">
                Good
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 pt-[10px]">
          <Text className="text-center font-[Poppins-SemiBold] text-[12px] text-[#7C849C]">
            {language?.name ?? "Language"} • {title}
          </Text>
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
  bubble: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
});
