import PostHog from "posthog-react-native";

const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST;

if (!POSTHOG_KEY) {
  throw new Error("Missing EXPO_PUBLIC_POSTHOG_KEY. Add it to your .env file.");
}

export const posthog = new PostHog(POSTHOG_KEY, {
  host: POSTHOG_HOST,
});
