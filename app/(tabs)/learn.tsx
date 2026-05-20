import { images } from "@/constants/images";
import { lessons } from "@/data/lessons";
import { units } from "@/data/units";
import { useLanguageStore } from "@/store/languageStore";
import type { Lesson } from "@/types/learning";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LessonStatus = "completed" | "in_progress" | "locked";
type LessonMode = "lessons" | "practice";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&h=520&fit=crop";

const LESSON_TITLES = [
  "Greetings & Introductions",
  "Daily Life",
  "At the Café",
  "Travel & Directions",
  "Shopping",
  "Family & Friends",
];

function getLessonStatus(order: number): LessonStatus {
  if (order <= 2) return "completed";
  if (order === 3) return "in_progress";
  return "locked";
}

function getLessonTitle(lesson: Lesson) {
  return LESSON_TITLES[lesson.order - 1] ?? lesson.title;
}

export default function LearnTab() {
  const [mode, setMode] = useState<LessonMode>("lessons");
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);

  const languageLessons = useMemo(() => {
    const code = selectedLanguage ?? "es";
    return lessons
      .filter((lesson) => lesson.languageCode === code)
      .sort((a, b) => a.order - b.order)
      .slice(0, 6);
  }, [selectedLanguage]);

  const currentUnit =
    units.find((unit) => unit.languageCode === (selectedLanguage ?? "es")) ??
    units[0];
  const currentLesson = languageLessons[2] ?? languageLessons[0];
  const currentTitle = currentLesson
    ? getLessonTitle(currentLesson)
    : "Lessons";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View className="h-[322px] overflow-hidden rounded-b-[30px] bg-[#dff3ff]">
          <Image
            source={{ uri: HERO_IMAGE }}
            className="absolute inset-0 h-full w-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-white/20" />
          <View className="absolute left-[-45px] top-[134px] h-[96px] w-[144px] rounded-full bg-[#6dbd43]" />
          <View className="absolute left-[8px] top-[164px] h-[74px] w-[122px] rounded-full bg-[#8fcf48]" />
          <View className="absolute right-[-26px] top-[82px] h-[82px] w-[122px] rounded-full bg-[#7fb747]" />
          <View className="absolute right-[20px] top-[48px] h-[74px] w-[96px] rounded-full bg-[#9bc464]" />

          <View className="absolute left-4 right-4 top-3 flex-row items-start justify-between">
            <TouchableOpacity
              className="h-11 w-9 justify-center"
              activeOpacity={0.75}
              onPress={() => router.back()}
            >
              <Feather name="chevron-left" size={31} color="#17203B" />
            </TouchableOpacity>

            <View className="flex-1 pl-2 pt-1">
              <Text className="font-[Poppins-SemiBold] text-[22px] leading-[28px] text-[#17203B]">
                {currentTitle}
              </Text>
              <Text className="mt-1 font-[Poppins-SemiBold] text-[15px] leading-[21px] text-[#7C849C]">
                Unit {currentLesson?.order ?? currentUnit.order} •{" "}
                {currentLesson?.order ?? 1} / {languageLessons.length} lessons
              </Text>
            </View>

            <View className="h-9 w-8 items-center justify-center pt-1">
              <Feather name="bookmark" size={28} color="#F2B233" />
            </View>
          </View>

          <Image
            source={images.mascotWelcome}
            className="absolute bottom-[-54px] left-[78px] h-[198px] w-[198px]"
            resizeMode="contain"
          />
        </View>

        <View className="-mt-[28px] px-3">
          <View
            className="h-[56px] flex-row overflow-hidden rounded-[16px] bg-white"
            style={styles.segmentShadow}
          >
            <TouchableOpacity
              className="flex-1 items-center justify-center"
              activeOpacity={0.8}
              onPress={() => setMode("lessons")}
            >
              <Text
                className={`font-[Poppins-Bold] text-[15px] ${
                  mode === "lessons" ? "text-[#5D45FF]" : "text-[#737C97]"
                }`}
              >
                Lessons
              </Text>
              {mode === "lessons" && (
                <View className="absolute bottom-0 h-[3px] w-full rounded-full bg-[#5D45FF]" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 items-center justify-center"
              activeOpacity={0.8}
              onPress={() => setMode("practice")}
            >
              <Text
                className={`font-[Poppins-SemiBold] text-[15px] ${
                  mode === "practice" ? "text-[#5D45FF]" : "text-[#737C97]"
                }`}
              >
                Practice
              </Text>
              {mode === "practice" && (
                <View className="absolute bottom-0 h-[3px] w-full rounded-full bg-[#5D45FF]" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="gap-2 px-[18px] pt-5">
          {languageLessons.map((lesson) => {
            const status = getLessonStatus(lesson.order);
            const isActive = status === "in_progress";

            return (
              <TouchableOpacity
                key={lesson.id}
                className={`min-h-[78px] rounded-[16px] border bg-white px-[18px] py-[14px] ${
                  isActive ? "border-[#A78BFF]" : "border-[#F0F1F6]"
                }`}
                style={isActive ? styles.activeCard : styles.cardShadow}
                activeOpacity={0.82}
                onPress={() =>
                  router.push({
                    pathname: "/lesson/[id]",
                    params: { id: lesson.id },
                  })
                }
              >
                <View className="flex-row items-center">
                  <View className="flex-1">
                    <Text
                      className={`font-[Poppins-SemiBold] text-[14px] leading-[20px] ${
                        isActive ? "text-[#5D45FF]" : "text-[#9AA0B8]"
                      }`}
                    >
                      Lesson {lesson.order}
                    </Text>
                    <Text className="mt-1 font-[Poppins-SemiBold] text-[15px] leading-[21px] text-[#202846]">
                      {getLessonTitle(lesson)}
                    </Text>
                    {isActive ? (
                      <Text className="mt-1 font-[Poppins-SemiBold] text-[13px] leading-[17px] text-[#5D45FF]">
                        In progress
                      </Text>
                    ) : null}
                    {status === "locked" ? (
                      <Text className="mt-1 font-[Poppins-SemiBold] text-[13px] leading-[17px] text-[#8D94AB]">
                        0 / {lesson.activities.length + lesson.goals.length}{" "}
                        lessons
                      </Text>
                    ) : null}
                  </View>

                  {status === "completed" ? (
                    <View className="h-6 w-6 items-center justify-center rounded-full bg-[#58C947]">
                      <Feather name="check" size={16} color="#ffffff" />
                    </View>
                  ) : null}

                  {status === "in_progress" ? (
                    <Image
                      source={images.palace}
                      className="h-[46px] w-[46px]"
                      resizeMode="contain"
                    />
                  ) : null}

                  {status === "locked" ? (
                    <Feather name="lock" size={22} color="#6F7795" />
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    paddingBottom: 110,
  },
  segmentShadow: {
    shadowColor: "#9CA3C7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 8,
  },
  cardShadow: {
    shadowColor: "#DDE1EE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 2,
  },
  activeCard: {
    shadowColor: "#A78BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
});
