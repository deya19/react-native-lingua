const AGENT_SERVER_URL =
  process.env.AGENT_SERVER_URL ?? "http://localhost:8000";

export async function POST(request: Request) {
  try {
    const { callId, callType } = await request.json();

    if (!callId) {
      return Response.json({ error: "Missing callId" }, { status: 400 });
    }

    const res = await fetch(`${AGENT_SERVER_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        call_id: callId,
        call_type: callType ?? "default",
      }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      console.error(`Agent server error ${res.status}:`, errorText);
      return Response.json(
        { error: `Agent server error ${res.status}: ${errorText}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("Agent start API error:", error);
    return Response.json(
      { error: `Agent start failed: ${error}` },
      { status: 500 },
    );
  }
}
