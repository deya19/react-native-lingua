import { usePostHog } from "posthog-react-native";
import { usePathname } from "expo-router";
import { useEffect } from "react";

export function useScreenTracking() {
  const posthog = usePostHog();
  const pathname = usePathname();

  useEffect(() => {
    if (posthog) {
      posthog.screen(pathname);
    }
  }, [posthog, pathname]);
}
