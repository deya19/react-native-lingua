import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useRef } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_COUNT = 5;
const TAB_WIDTH = SCREEN_WIDTH / TAB_COUNT;

const PURPLE = "#5b21b6";
const GRAY = "#9ca3af";

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

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const animatedIndex = useRef(new Animated.Value(state.index)).current;

  const onTabPress = (index: number, route: any, isFocused: boolean) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      Animated.timing(animatedIndex, {
        toValue: index,
        duration: 200,
        useNativeDriver: true,
      }).start();
      navigation.navigate(route.name);
    }
  };

  const indicatorTranslateX = animatedIndex.interpolate({
    inputRange: tabConfigs.map((_, i) => i),
    outputRange: tabConfigs.map((_, i) => i * TAB_WIDTH + TAB_WIDTH / 2 - 24),
  });

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 8 }]}>
      <Animated.View
        style={[
          styles.activeCircle,
          { transform: [{ translateX: indicatorTranslateX }] },
        ]}
      />
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const tab = tabConfigs.find((t) => t.name === route.name);
        if (!tab) return null;

        const color = isFocused ? "#ffffff" : GRAY;
        const labelColor = isFocused ? PURPLE : GRAY;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={() => onTabPress(index, route, isFocused)}
            style={styles.tab}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrapper}>{tab.icon(color, 22)}</View>
            {!isFocused && (
              <Text style={[styles.label, { color: labelColor }]}>
                {tab.label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
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
  container: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    zIndex: 1,
  },
  iconWrapper: {
    width: 48,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  activeCircle: {
    position: "absolute",
    top: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: PURPLE,
    zIndex: 0,
  },
  label: {
    fontSize: 11,
    fontFamily: "Poppins-Medium",
    marginTop: 0,
  },
});
