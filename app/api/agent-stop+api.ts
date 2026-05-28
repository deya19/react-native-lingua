const AGENT_SERVER_URL =
  process.env.AGENT_SERVER_URL ?? "http://localhost:8000";

export async function DELETE(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return Response.json(
        { error: "Missing sessionId" },
        { status: 400 },
      );
    }

    const res = await fetch(`${AGENT_SERVER_URL}/sessions/${sessionId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      console.error(`Agent server error ${res.status}:`, errorText);
      return Response.json(
        { error: `Agent server error ${res.status}: ${errorText}` },
        { status: res.status },
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Agent stop API error:", error);
    return Response.json(
      { error: "Failed to stop agent" },
      { status: 500 },
    );
  }
}
