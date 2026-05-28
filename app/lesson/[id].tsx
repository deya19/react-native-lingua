import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { lessons } from "@/data/lessons";
import { createStreamClient, fetchStreamToken } from "@/lib/stream";
import { StreamCall, StreamVideo, streamAvailable } from "@/lib/stream-sdk";
import { useUser } from "@clerk/expo";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LESSON_TITLES = [
  "Greetings & Introductions",
  "Daily Life",
  "At the Café",
  "Travel & Directions",
  "Shopping",
  "Family & Friends",
];

type CallLifecycleState =
  | "idle"
  | "loading"
  | "connecting"
  | "joined"
  | "error"
  | "ended";

type AgentStatus = "idle" | "connecting" | "connected" | "failed";

function CallControls({
  onEndCall,
  callLifecycle,
  isMuted,
  onToggleMute,
}: {
  onEndCall: () => void;
  callLifecycle: CallLifecycleState;
  isMuted: boolean;
  onToggleMute: () => void;
}) {
  const isJoined = callLifecycle === "joined";
  const micColor = isJoined && !isMuted ? "#5D45FF" : "#101936";
  const micBg = isJoined && !isMuted ? "#EDE9FE" : "white";

  return (
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
          className="h-[56px] w-[56px] items-center justify-center rounded-full"
          style={{ backgroundColor: micBg }}
          activeOpacity={0.8}
          onPress={onToggleMute}
        >
          <Feather
            name={isMuted ? "mic-off" : "mic"}
            size={26}
            color={micColor}
          />
        </TouchableOpacity>
        <Text className="mt-[8px] font-[Poppins-SemiBold] text-[13px] text-white">
          {isMuted ? "Muted" : "Mic"}
        </Text>
      </View>

      <View className="items-center">
        <TouchableOpacity
          className="h-[56px] w-[56px] items-center justify-center rounded-full bg-white"
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="translate" size={27} color="#101936" />
        </TouchableOpacity>
        <Text className="mt-[8px] font-[Poppins-SemiBold] text-[13px] text-white">
          Subtitles
        </Text>
      </View>

      <View className="items-center">
        <TouchableOpacity
          className="h-[56px] w-[56px] items-center justify-center rounded-full bg-[#FB4742]"
          activeOpacity={0.8}
          onPress={onEndCall}
        >
          <Feather name="phone" size={27} color="#ffffff" />
        </TouchableOpacity>
        <Text className="mt-[8px] font-[Poppins-SemiBold] text-[13px] text-white">
          End Call
        </Text>
      </View>
    </View>
  );
}

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const lessonId = Array.isArray(id) ? id[0] : id;
  const lesson = lessons.find((item) => item.id === lessonId);
  const { user } = useUser();

  const [client, setClient] = useState<any>();
  const [call, setCall] = useState<any>();
  const [callLifecycle, setCallLifecycle] =
    useState<CallLifecycleState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("idle");
  const [agentSessionId, setAgentSessionId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function setupStream() {
      if (!lesson || !user) return;
      if (!streamAvailable) return;

      setCallLifecycle("loading");

      try {
        const { token, apiKey, callId, callType } = await fetchStreamToken({
          userId: user.id,
          userName:
            user.fullName ?? user.primaryEmailAddress?.emailAddress ?? user.id,
          lessonId: lesson.id,
          languageCode: lesson.languageCode,
          lessonTitle: lesson.title,
        });

        const streamUser = { id: user.id, name: user.fullName ?? user.id };
        const streamClient = createStreamClient(apiKey, streamUser, token);
        const streamCall = streamClient.call(callType, callId);

        if (!mounted) {
          streamCall.leave().catch(() => {});
          streamClient.disconnectUser().catch(() => {});
          return;
        }

        setClient(streamClient);
        setCall(streamCall);
        setCallLifecycle("connecting");

        await streamCall.join({ create: true });

        // Audio-only: disable video, enable microphone
        await streamCall.camera.disable();
        await streamCall.microphone.enable();

        if (mounted) {
          setCallLifecycle("joined");
          setIsMuted(false);
          startAgent(callId, callType);
        }
      } catch (e) {
        console.error("Stream setup error:", e);
        if (mounted) {
          setCallLifecycle("error");
        }
      }
    }

    setupStream();

    return () => {
      mounted = false;
      stopAgent();
      call?.leave().catch(() => {});
      client?.disconnectUser().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, user?.id]);

  const startAgent = async (callId: string, callType: string) => {
    setAgentStatus("connecting");
    try {
      const res = await fetch("/api/agent-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId, callType }),
      });

      if (res.ok) {
        const data = await res.json();
        setAgentSessionId(data.session_id ?? null);
        setAgentStatus("connected");
      } else {
        const errorText = await res.text().catch(() => "unknown");
        console.error("Agent start failed:", res.status, errorText);
        setAgentStatus("failed");
      }
    } catch (err) {
      console.error("Agent start error:", err);
      setAgentStatus("failed");
    }
  };

  const stopAgent = async () => {
    if (agentSessionId) {
      try {
        await fetch("/api/agent-stop", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: agentSessionId }),
        });
      } catch {
        // ignore
      }
    }
    setAgentStatus("idle");
    setAgentSessionId(null);
  };

  const handleToggleMute = async () => {
    if (!call) return;
    try {
      if (isMuted) {
        await call.microphone.enable();
      } else {
        await call.microphone.disable();
      }
      setIsMuted(!isMuted);
    } catch {
      // ignore
    }
  };

  const handleEndCall = async () => {
    setCallLifecycle("ended");
    await stopAgent();
    try {
      await call?.leave();
    } catch {
      // ignore
    }
    try {
      await client?.disconnectUser();
    } catch {
      // ignore
    }
    router.back();
  };

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 items-center justify-center bg-white px-6">
          <Text className="text-center font-[Poppins-SemiBold] text-[16px] text-[#11182F]">
            Lesson not found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const title = LESSON_TITLES[lesson.order - 1] ?? lesson.title;
  const language = languages.find((item) => item.code === lesson.languageCode);
  const teacherLine =
    lesson.phrases[0]?.text ??
    lesson.aiTeacherPrompt?.practiceScript ??
    "¡Muy bien!";
  const teacherTranslation =
    lesson.phrases[0]?.translation ??
    lesson.goals[0]?.description ??
    "That was great!";

  const statusColor =
    callLifecycle === "joined"
      ? agentStatus === "failed"
        ? "#FB4742"
        : agentStatus === "connecting"
          ? "#F5A623"
          : "#62D84E"
      : callLifecycle === "error"
        ? "#FB4742"
        : callLifecycle === "connecting" || callLifecycle === "loading"
          ? "#F5A623"
          : "#62D84E";

  const statusText =
    callLifecycle === "joined"
      ? agentStatus === "connected"
        ? "Teacher online"
        : agentStatus === "connecting"
          ? "Teacher joining..."
          : agentStatus === "failed"
            ? "Teacher unavailable"
            : "Online"
      : callLifecycle === "error"
        ? "Error"
        : callLifecycle === "connecting"
          ? "Connecting..."
          : callLifecycle === "loading"
            ? "Loading..."
            : callLifecycle === "ended"
              ? "Ended"
              : "Online";

  const screenContent = (
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
            <View
              className="mr-[6px] h-[10px] w-[10px] rounded-full"
              style={{ backgroundColor: statusColor }}
            />
            <Text className="font-[Poppins-Medium] text-[14px] leading-[18px] text-[#61708F]">
              {statusText}
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
            {lesson.order}
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

        {/* <View className="absolute right-[14px] top-[16px] h-[153px] w-[104px] overflow-hidden rounded-[15px] border-[3px] border-white bg-[#E8EFE6]">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=420&fit=crop",
            }}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View> */}

        {(callLifecycle === "loading" || callLifecycle === "connecting") && (
          <View className="absolute inset-0 z-10 items-center justify-center">
            <View className="items-center rounded-[16px] bg-white/90 px-6 py-4">
              <ActivityIndicator size="small" color="#5D45FF" />
              <Text className="mt-2 font-[Poppins-SemiBold] text-[14px] text-[#11182F]">
                {callLifecycle === "loading"
                  ? "Starting session..."
                  : "Connecting..."}
              </Text>
            </View>
          </View>
        )}

        {callLifecycle === "error" && (
          <View className="absolute inset-0 z-10 items-center justify-center">
            <View className="items-center rounded-[16px] bg-white/90 px-6 py-4">
              <Ionicons name="alert-circle" size={32} color="#FB4742" />
              <Text className="mt-2 font-[Poppins-SemiBold] text-[14px] text-[#11182F]">
                Could not connect
              </Text>
              <Text className="mt-1 text-center font-[Poppins-Regular] text-[12px] text-[#61708F]">
                Tap End Call and try again.
              </Text>
            </View>
          </View>
        )}

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

        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallControls
                onEndCall={handleEndCall}
                callLifecycle={callLifecycle}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
              />
            </StreamCall>
          </StreamVideo>
        ) : (
          <CallControls
            onEndCall={handleEndCall}
            callLifecycle={callLifecycle}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        <View className="absolute bottom-[24px] left-[15px] right-[15px] h-[123px] flex-row rounded-[16px] bg-white px-[20px] py-[24px]">
          <View className="flex-1">
            <Text
              className="font-[Poppins-Bold] text-[12px] text-[#11182F]"
              numberOfLines={1}
            >
              Speaking
            </Text>
            <Text className="mt-[13px] font-[Poppins-Bold] text-[12px] text-[#58D446]">
              Excellent
            </Text>
          </View>
          <View className="mx-[12px] h-[66px] w-px bg-[#E4E7F0]" />
          <View className="flex-1">
            <Text
              className="font-[Poppins-Bold] text-[12px] text-[#11182F]"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Pronunciation
            </Text>
            <Text className="mt-[13px] font-[Poppins-Bold] text-[12px] text-[#3289FF]">
              Great
            </Text>
          </View>
          <View className="mx-[12px] h-[66px] w-px bg-[#E4E7F0]" />
          <View className="flex-1">
            <Text
              className="font-[Poppins-Bold] text-[12px] text-[#11182F]"
              numberOfLines={1}
            >
              Grammar
            </Text>
            <Text className="mt-[13px] font-[Poppins-Bold] text-[12px] text-[#5D45FF]">
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

      {user && (
        <View className="px-6 pt-[6px]">
          <Text className="text-center font-[Poppins-Medium] text-[11px] text-[#A0A8B8]">
            {user.fullName ?? user.primaryEmailAddress?.emailAddress ?? user.id}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      {screenContent}
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
