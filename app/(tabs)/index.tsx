import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { lessons } from "@/data/lessons";
import { units } from "@/data/units";
import { useLanguageStore } from "@/store/languageStore";
import { useUser } from "@clerk/expo";
import type { ReactNode } from "react";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeTab() {
  const { user } = useUser();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);

  const language =
    languages.find((item) => item.code === selectedLanguage) ?? languages[0];
  const currentUnit =
    units.find((item) => item.languageCode === language.code) ?? units[0];
  const currentLesson =
    lessons.find((item) => item.languageCode === language.code) ?? lessons[0];
  const firstName = user?.firstName ?? user?.username ?? "Alex";
  const vocabularyCount = currentLesson.vocabulary.length || 10;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#FF1F1F]">
              <Image source={{ uri: language.flag }} className="h-11 w-11" />
            </View>
            <Text className="ml-3.5 font-[Poppins-SemiBold] text-heading-4 text-[#202846]">
              {language.greeting}, {firstName}! 👋
            </Text>
          </View>

          <View className="flex-row items-center">
            <Text className="mr-6 font-[Poppins-SemiBold] text-[16px] text-[#38405E]">
              <Text className="text-[22px]">🔥</Text> 12
            </Text>
            <Feather name="bell" size={26} color="#1B2440" />
          </View>
        </View>

        <View className="mt-[30px] h-[132px] flex-row items-center rounded-lingua-xl bg-[#FFF6EC] pl-6 pr-[22px]">
          <View className="flex-1">
            <Text className="font-[Poppins-SemiBold] text-[12px] leading-[24px] text-[#27304E]">
              Daily goal
            </Text>
            <View className="mt-2 flex-row items-center">
              <Text className="font-[Poppins-Bold] text-heading-1 leading-[36px] text-[#111A3A]">
                15
              </Text>
              <Text className="font-[Poppins-SemiBold] text-[17px] leading-[24px] text-[#7E86A4]">
                {" "}
                / 20 XP
              </Text>
            </View>
            <View className="mt-[18px] h-[9px] w-[240px] rounded-full bg-[#FFE2BF]">
              <View className="h-[9px] w-[78%] rounded-full bg-[#FF7A00]" />
            </View>
          </View>
          <Image source={images.treasure} className="h-28 w-28" />
        </View>

        <View className="mt-[26px] h-[182px] flex-row overflow-hidden rounded-[18px] bg-[#6C4EF5] pl-6 pt-[22px]">
          <View
            className="absolute bottom-0 right-[-18px] h-[130px] w-[255px] rounded-tl-[120px] bg-[#5A43D7]"
            style={styles.mountainOne}
          />
          <View
            className="absolute bottom-[-30px] right-[78px] h-[108px] w-[132px] rounded-tl-[38px] rounded-tr-[14px] bg-[#4D39C0]"
            style={styles.mountainTwo}
          />
          <View className="absolute right-[-10px] top-[18px] h-[120px] w-[120px] rounded-full bg-[#755CF7] opacity-[0.55]" />
          <View className="relative z-10 flex-1 flex-col justify-between pb-3">
            <View>
              <Text className="font-[Poppins-Regular] text-[12px] text-[#EDE9FF]">
                Continue learning
              </Text>

              <Text className="mt-1 font-[Poppins-SemiBold] text-[25px] leading-[30px] text-white">
                {language.name}
              </Text>
              <Text className="-mt-2 font-[Poppins-Regular] text-[16px] text-[#E8E1FF]">
                A1 · Unit {currentUnit.order + 2}
              </Text>
            </View>
            <TouchableOpacity
              className="h-12 w-28 items-center justify-center rounded-[14px] bg-white"
              activeOpacity={0.85}
            >
              <Text className="font-[Poppins-Bold] text-[12px] text-[#6C4EF5]">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
          <Image
            source={images.palace}
            className="absolute bottom-[-28px] right-[-20px] h-[168px] w-[168px]"
          />
        </View>

        <View className="mb-6 flex-row items-center justify-between">
          <Text className="mt-[30px] font-[Poppins-SemiBold] text-[16px] text-[#151D3A]">
            Today’s plan
          </Text>
          <TouchableOpacity activeOpacity={0.75}>
            <Text className="mt-[30px] font-[Poppins-Bold] text-[12px] text-[#6C4EF5]">
              View all
            </Text>
          </TouchableOpacity>
        </View>

        <View className="overflow-hidden rounded-[18px] border border-[#EDEDF2] bg-white px-4">
          <PlanRow
            title="Lesson"
            subtitle={
              currentLesson.title === "¡Hola!"
                ? "At the café"
                : currentLesson.title
            }
            iconClassName="bg-[#EFE7FF]"
            complete
            icon={<Feather name="book-open" size={20} color="#6C4EF5" />}
          />
          <PlanRow
            title="AI Conversation"
            subtitle="Talk about your day"
            iconClassName="bg-[#EFE7FF]"
            icon={<Feather name="headphones" size={20} color="#6C4EF5" />}
          />
          <PlanRow
            title="New words"
            subtitle={`${vocabularyCount} words`}
            iconClassName="bg-[#FFE3E7]"
            showDivider={false}
            icon={
              <MaterialCommunityIcons
                name="cards-heart"
                size={20}
                color="#FF5263"
              />
            }
          />
        </View>

        {/* <View className="mt-[22px] mb-0.5 h-[120px] flex-row items-center justify-between rounded-[17px] bg-[#F4FCEB] pl-[22px] pr-4">
          <View>
            <Text className="font-[Poppins-SemiBold] text-[12px] text-[#7E86A4]">
              Next up
            </Text>
            <Text className="mt-2 font-[Poppins-SemiBold] text-[18px] text-[#161E3C]">
              AI Video Call
            </Text>
            <Text className="mt-0.5 font-[Poppins-Medium] text-[12px] text-[#4F5978]">
              Practice speaking
            </Text>
          </View>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop&crop=faces",
            }}
            className="h-[92px] w-[92px] rounded-full"
          />
          <View className="h-[50px] w-[50px] items-center justify-center rounded-full bg-[#53C91F]">
            <FontAwesome5 name="video" size={20} color="#ffffff" />
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

function PlanRow({
  title,
  subtitle,
  iconClassName,
  icon,
  complete = false,
  showDivider = true,
}: {
  title: string;
  subtitle: string;
  iconClassName: string;
  icon: ReactNode;
  complete?: boolean;
  showDivider?: boolean;
}) {
  return (
    <View className="min-h-[60px] flex-row items-center">
      <View
        className={`mr-[14px] h-9 w-9 items-center justify-center rounded-[10px] ${iconClassName}`}
      >
        {icon}
      </View>
      <View className="flex-1">
        <Text className="font-[Poppins-SemiBold] text-body-small text-[#10152F]">
          {title}
        </Text>
        <Text className="font-[Poppins-Regular] text-[12px] text-[#7E86A4]">
          {subtitle}
        </Text>
      </View>
      <View
        className={`h-[22px] w-[22px] items-center justify-center rounded-full ${
          complete ? "bg-[#6D8DFF]" : "border-2 border-[#ECECF1]"
        }`}
      >
        {complete && <Feather name="check" size={13} color="#ffffff" />}
      </View>
      {showDivider && (
        <View className="absolute bottom-0 left-[50px] right-0 h-px bg-[#EFEFF3]" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 26,
  },
  mountainOne: {
    transform: [{ rotate: "-18deg" }],
  },
  mountainTwo: {
    transform: [{ rotate: "45deg" }],
  },
});
