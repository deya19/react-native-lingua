import { posthog } from "./posthog";

export const AnalyticsEvents = {
  onboarding_get_started_tapped: "onboarding_get_started_tapped",
  sign_up_submitted: "sign_up_submitted",
  sign_up_completed: "sign_up_completed",
  sign_up_sso_started: "sign_up_sso_started",
  sign_in_submitted: "sign_in_submitted",
  sign_in_completed: "sign_in_completed",
  sign_in_sso_started: "sign_in_sso_started",
  language_selected: "language_selected",
  continue_learning_tapped: "continue_learning_tapped",
  ai_teacher_viewed: "ai_teacher_viewed",
  chat_viewed: "chat_viewed",
} as const;

type AnalyticsEventName =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export function track(
  event: AnalyticsEventName,
  properties?: Record<string, string | number | boolean | null>,
) {
  posthog.capture(event, properties ?? {});
}
