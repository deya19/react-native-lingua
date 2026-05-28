import { StreamVideoClient } from "./stream-sdk";

export interface StreamTokenResponse {
  token: string;
  apiKey: string;
  callId: string;
  callType: string;
}

interface StreamUser {
  id: string;
  name?: string;
  image?: string;
}

export async function fetchStreamToken(payload: {
  userId: string;
  userName?: string;
  lessonId: string;
  languageCode?: string;
  lessonTitle?: string;
}): Promise<StreamTokenResponse> {
  const res = await fetch("/api/stream-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error ?? "Failed to fetch Stream token");
  }

  return res.json();
}

export function createStreamClient(
  apiKey: string,
  user: StreamUser,
  token: string,
): any {
  if (!StreamVideoClient) {
    throw new Error("StreamVideoClient is not available");
  }
  return StreamVideoClient.getOrCreateInstance({
    apiKey,
    user: {
      id: user.id ?? "",
      name: user.name ?? "",
      image: user.image,
      type: "authenticated",
    },
    token,
  });
}
