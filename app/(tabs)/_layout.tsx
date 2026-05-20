import { AnalyticsEvents, track } from "@/lib/analytics";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_COUNT = 5;
const TAB_WIDTH = SCREEN_WIDTH / TAB_COUNT;

const PURPLE = "#6C4EF5";
const GRAY = "#7E86A4";

type TabConfig = {
  name: string;
  label: string;
  icon: (color: string, size: number) => React.ReactNode;
};

const tabConfigs: TabConfig[] = [
  {
    name: "index",
    label: "Home",
    icon: (color, size) => <Feather name="home" size={size} color={color} />,
  },
  {
    name: "learn",
    label: "Learn",
    icon: (color, size) => (
      <Feather name="book-open" size={size} color={color} />
    ),
  },
  {
    name: "ai-teacher",
    label: "AI Teacher",
    icon: (color, size) => (
      <MaterialCommunityIcons
        name="robot-happy-outline"
        size={size}
        color={color}
      />
    ),
  },
  {
    name: "chat",
    label: "Chat",
    icon: (color, size) => (
      <Feather name="message-circle" size={size} color={color} />
    ),
  },
  {
    name: "profile",
    label: "Profile",
    icon: (color, size) => <Feather name="user" size={size} color={color} />,
  },
];

function TabButton({
  isFocused,
  onPress,
  color,
  labelColor,
  tab,
  accessibilityState,
  accessibilityLabel,
}: {
  isFocused: boolean;
  onPress: () => void;
  color: string;
  labelColor: string;
  tab: TabConfig;
  accessibilityState: { selected: boolean } | object;
  accessibilityLabel?: string;
}) {
  const opacity = useRef(new Animated.Value(isFocused ? 0 : 1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isFocused ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isFocused, opacity]);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.72,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 18,
        bounciness: 14,
      }),
    ]).start();
    onPress();
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      onPress={handlePress}
      style={styles.tab}
      activeOpacity={1}
    >
      <Animated.View style={[styles.iconWrapper, { transform: [{ scale }] }]}>
        {tab.icon(color, 22)}
      </Animated.View>
      <Animated.Text style={[styles.label, { color: labelColor, opacity }]}>
        {tab.label}
      </Animated.Text>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const animatedIndex = useRef(new Animated.Value(state.index)).current;
  const debounceRef = useRef(false);

  useEffect(() => {
    Animated.timing(animatedIndex, {
      toValue: state.index,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [state.index, animatedIndex]);

  const onTabPress = (
    index: number,
    route: (typeof state.routes)[number],
    isFocused: boolean,
  ) => {
    if (debounceRef.current) return;

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      debounceRef.current = true;
      Animated.timing(animatedIndex, {
        toValue: index,
        duration: 200,
        useNativeDriver: true,
      }).start();
      navigation.navigate(route.name);
      if (route.name === "ai-teacher") {
        track(AnalyticsEvents.ai_teacher_viewed);
      }
      if (route.name === "chat") {
        track(AnalyticsEvents.chat_viewed);
      }
      setTimeout(() => {
        debounceRef.current = false;
      }, 300);
    }
  };

  const indicatorTranslateX = animatedIndex.interpolate({
    inputRange: tabConfigs.map((_, i) => i),
    outputRange: tabConfigs.map((_, i) => i * TAB_WIDTH + TAB_WIDTH / 2 - 24),
  });

  return (
    <View
      className="flex-row bg-white rounded-tl-[28px] rounded-tr-[28px] pt-3"
      style={[styles.containerShadow, { paddingBottom: insets.bottom || 10 }]}
    >
      <Animated.View
        style={[
          styles.activeCircle,
          { transform: [{ translateX: indicatorTranslateX }] },
        ]}
      />
      {state.routes.map(
        (route: (typeof state.routes)[number], index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const tab = tabConfigs.find((t) => t.name === route.name);
          if (!tab) return null;

          const color = isFocused ? "#ffffff" : GRAY;
          const labelColor = isFocused ? PURPLE : GRAY;

          return (
            <TabButton
              key={route.key}
              isFocused={isFocused}
              onPress={() => onTabPress(index, route, isFocused)}
              color={color}
              labelColor={labelColor}
              tab={tab}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
            />
          );
        },
      )}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {tabConfigs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{ title: tab.label }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  containerShadow: {
    shadowColor: "#D4D9EA",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 18,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 58,
  },
  activeCircle: {
    position: "absolute",
    top: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: PURPLE,
    zIndex: 0,
  },
  iconWrapper: {
    width: 48,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  label: {
    fontSize: 11,
    fontFamily: "Poppins-SemiBold",
    marginTop: 1,
    zIndex: 1,
  },
});
