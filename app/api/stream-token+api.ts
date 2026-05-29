import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;

if (!apiKey || !apiSecret) {
  throw new Error(
    "Missing STREAM_API_KEY or STREAM_API_SECRET environment variables",
  );
}

const client = new StreamClient(apiKey, apiSecret);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, userName, lessonId, languageCode, lessonTitle } = body;

    if (!userId || !lessonId) {
      return Response.json(
        { error: "Missing userId or lessonId" },
        { status: 400 },
      );
    }

    await client.upsertUsers([
      {
        id: userId,
        name: userName ?? userId,
        role: "user",
      },
    ]);

    const token = client.generateUserToken({ user_id: userId });

    const callType = "default";
    const callId = `lesson-${languageCode ?? "en"}-${lessonId}`;
    const call = client.video.call(callType, callId);

    await call.getOrCreate({
      data: {
        created_by_id: userId,
        custom: {
          lessonId,
          languageCode: languageCode ?? "en",
          lessonTitle: lessonTitle ?? "Lesson",
        },
      },
    });

    return Response.json({
      token,
      apiKey,
      callId,
      callType,
    });
  } catch (error) {
    console.error("Stream token generation error:", error);
    return Response.json(
      { error: "Failed to generate token" },
      { status: 500 },
    );
  }
}
